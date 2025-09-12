import Groq from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables')
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface ConversationContext {
  userBackground?: string;
  careerGoals?: string;
  currentSituation?: string;
  previousTopics?: string[];
  conversationStage?: 'initial' | 'exploring' | 'planning' | 'implementing';
}

function extractUserContext(messages: Array<{ role: 'user' | 'assistant'; content: string }>): ConversationContext {
  const userMessages = messages.filter(msg => msg.role === 'user');
  const context: ConversationContext = {
    previousTopics: [],
    conversationStage: 'initial'
  };

  // Analyze conversation to extract context
  const allUserText = userMessages.map(msg => msg.content).join(' ').toLowerCase();
  
  // Detect career stage
  if (allUserText.includes('student') || allUserText.includes('graduate') || allUserText.includes('university')) {
    context.currentSituation = 'student/recent graduate';
  } else if (allUserText.includes('career change') || allUserText.includes('transition')) {
    context.currentSituation = 'career transition';
  } else if (allUserText.includes('promotion') || allUserText.includes('advance')) {
    context.currentSituation = 'career advancement';
  }

  // Detect conversation stage based on message count and content
  if (messages.length <= 2) {
    context.conversationStage = 'initial';
  } else if (messages.length <= 6) {
    context.conversationStage = 'exploring';
  } else if (allUserText.includes('plan') || allUserText.includes('roadmap') || allUserText.includes('steps')) {
    context.conversationStage = 'planning';
  } else {
    context.conversationStage = 'implementing';
  }

  return context;
}

function generateFollowUpQuestions(context: ConversationContext): string[] {
  const questions: string[] = [];
  
  switch (context.conversationStage) {
    case 'initial':
      questions.push(
        "What's your current professional situation?",
        "What are your main career goals for the next 2-3 years?",
        "What challenges are you facing in your career right now?"
      );
      break;
    case 'exploring':
      questions.push(
        "Which of these options resonates most with you and why?",
        "What skills do you feel most confident about?",
        "What concerns you most about making this change?"
      );
      break;
    case 'planning':
      questions.push(
        "Which step feels most challenging to you?",
        "What timeline are you working with?",
        "What resources do you currently have available?"
      );
      break;
    case 'implementing':
      questions.push(
        "How is your progress going so far?",
        "What obstacles have you encountered?",
        "What would be most helpful for your next steps?"
      );
      break;
  }
  
  return questions;
}

function buildStructuredResponse(context: ConversationContext): string {
  let structure = '';
  
  switch (context.conversationStage) {
    case 'initial':
      structure = '\n\nRESPONSE STRUCTURE: 1) Warm acknowledgment 2) Ask 1-2 key questions to understand their situation 3) Offer initial perspective or encouragement';
      break;
    case 'exploring':
      structure = '\n\nRESPONSE STRUCTURE: 1) Acknowledge their input 2) Analyze their situation 3) Present 2-3 options with pros/cons 4) Ask which direction interests them most';
      break;
    case 'planning':
      structure = '\n\nRESPONSE STRUCTURE: 1) Acknowledge their goals 2) Break down into clear steps 3) Provide specific actionable advice 4) Ask about timeline or resources';
      break;
    case 'implementing':
      structure = '\n\nRESPONSE STRUCTURE: 1) Acknowledge progress 2) Address specific challenges 3) Provide practical solutions 4) Encourage next steps';
      break;
  }
  
  return structure;
}

function buildContextualPrompt(context: ConversationContext, isFirstMessage: boolean): string {
  let contextualInstructions = '';
  
  if (isFirstMessage) {
    contextualInstructions += '\n\nThis is the start of a new conversation. Begin with a warm greeting and ask 1-2 targeted questions to understand their situation better.';
  } else {
    contextualInstructions += `\n\nConversation context: Stage is ${context.conversationStage}.`;
    if (context.currentSituation) {
      contextualInstructions += ` User appears to be in ${context.currentSituation} phase.`;
    }
    contextualInstructions += ' Build upon previous discussion and maintain conversation flow.';
  }

  // Add structured response guidance
  contextualInstructions += buildStructuredResponse(context);
  
  // Add follow-up question suggestions
  const followUpQuestions = generateFollowUpQuestions(context);
  contextualInstructions += `\n\nSUGGESTED FOLLOW-UP QUESTIONS: ${followUpQuestions.join(' | ')}`;

  switch (context.conversationStage) {
    case 'initial':
      contextualInstructions += ' Focus on understanding their background, current situation, and goals.';
      break;
    case 'exploring':
      contextualInstructions += ' Help them explore options and possibilities. Ask deeper questions.';
      break;
    case 'planning':
      contextualInstructions += ' Provide structured plans and actionable roadmaps.';
      break;
    case 'implementing':
      contextualInstructions += ' Focus on practical implementation steps and troubleshooting.';
      break;
  }

  return contextualInstructions;
}

export async function generateCareerAdvice(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  try {
    // Extract conversation context
    const context = extractUserContext(messages);
    const isFirstMessage = messages.filter(msg => msg.role === 'user').length <= 1;
    
    // Build contextual instructions
    const contextualInstructions = buildContextualPrompt(context, isFirstMessage);
    
    const systemPrompt = `You are an experienced career counselor with more than 10 years of guiding students, graduates, and professionals. Your role is to provide meaningful, personalized career guidance.

STYLE:
- Warm, empathetic, and encouraging, but also professional and realistic.
- Structured responses: Acknowledge → Analyze → Advise → Encourage.
- Use clear steps, bullet points, or numbered lists.
- Keep replies concise but insightful (avoid long walls of text).
- Ask clarifying questions if the user is vague or confused.

BEHAVIOR:
- Always personalize answers using the user's background, skills, or goals (if provided).
- Offer multiple career path options where possible, explaining pros & cons.
- Provide actionable steps (courses, skills, projects, networking tips).
- If the user asks about interviews, switch to mock interview style with feedback.
- If the user wants a roadmap, create a step-by-step learning/progression plan.
- Never give generic motivational fluff — keep advice practical and tailored.

TONE:
- Friendly mentor, not robotic.
- Balanced: honest about challenges, but encouraging about growth.
- Conversational: end with a follow-up question to keep engagement going.

EXPERTISE AREAS:
- Career transitions and changes
- Skill development and education paths
- Job search strategies and resume optimization
- Interview preparation and mock interviews
- Workplace challenges and conflict resolution
- Professional growth and advancement planning
- Work-life balance and burnout prevention
- Industry insights and market trends
- Salary negotiation and compensation
- Networking and personal branding
- Leadership development
- Entrepreneurship and freelancing guidance

CONVERSATION FLOW:
- Always acknowledge what the user shared before providing advice
- Reference previous parts of the conversation when relevant
- Build progressively deeper understanding through follow-up questions
- Adapt your communication style based on the user's responses
- End each response with a thoughtful question to continue the dialogue${contextualInstructions}`

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ]

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    let response = '';
    for await (const chunk of completion) {
        response += chunk.choices[0]?.delta?.content || '';
    }
    return response || 'I apologize, but I\'m having trouble generating a response right now. Please try again.';
  } catch (error) {
    console.error('Error generating career advice:', error)
    throw new Error('Failed to generate career advice')
  }
}