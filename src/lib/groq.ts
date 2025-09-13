import Groq from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables')
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

/**
 * Represents the context of a career counseling conversation
 * Used to track user's background and conversation progress for personalized responses
 */
interface ConversationContext {
  /** User's professional background or career stage */
  userBackground?: string
  /** User's stated career goals and aspirations */
  careerGoals?: string
  /** Current professional situation (student, career change, etc.) */
  currentSituation?: string
  /** Array of topics discussed in previous messages */
  previousTopics?: string[]
  /** Current stage of the conversation flow */
  conversationStage?: 'initial' | 'exploring' | 'planning' | 'implementing'
}

/**
 * Analyzes conversation messages to extract user context and determine conversation stage
 * 
 * @param messages - Array of conversation messages with role and content
 * @returns ConversationContext object with extracted user information and conversation stage
 * 
 * @example
 * ```typescript
 * const context = extractUserContext([
 *   { role: 'user', content: 'I am a recent graduate looking for my first job' },
 *   { role: 'assistant', content: 'Great! Let me help you...' }
 * ]);
 * // Returns: { currentSituation: 'student/recent graduate', conversationStage: 'initial' }
 * ```
 */
function extractUserContext(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): ConversationContext {
  const userMessages = messages.filter(msg => msg.role === 'user')
  const context: ConversationContext = {
    previousTopics: [],
    conversationStage: 'initial',
  }

  // Analyze conversation to extract context
  const allUserText = userMessages
    .map(msg => msg.content)
    .join(' ')
    .toLowerCase()

  // Detect career stage
  if (
    allUserText.includes('student') ||
    allUserText.includes('graduate') ||
    allUserText.includes('university')
  ) {
    context.currentSituation = 'student/recent graduate'
  } else if (
    allUserText.includes('career change') ||
    allUserText.includes('transition')
  ) {
    context.currentSituation = 'career transition'
  } else if (
    allUserText.includes('promotion') ||
    allUserText.includes('advance')
  ) {
    context.currentSituation = 'career advancement'
  }

  // Detect conversation stage based on message count and content
  if (messages.length <= 2) {
    context.conversationStage = 'initial'
  } else if (messages.length <= 6) {
    context.conversationStage = 'exploring'
  } else if (
    allUserText.includes('plan') ||
    allUserText.includes('roadmap') ||
    allUserText.includes('steps')
  ) {
    context.conversationStage = 'planning'
  } else {
    context.conversationStage = 'implementing'
  }

  return context
}

/**
 * Generates contextually appropriate follow-up questions based on conversation stage
 * 
 * @param context - The current conversation context
 * @returns Array of relevant follow-up questions for the current stage
 * 
 * @example
 * ```typescript
 * const questions = generateFollowUpQuestions({ conversationStage: 'initial' });
 * // Returns: ["What's your current professional situation?", ...]
 * ```
 */
function generateFollowUpQuestions(context: ConversationContext): string[] {
  const questions: string[] = []

  switch (context.conversationStage) {
    case 'initial':
      questions.push(
        "What's your current professional situation?",
        'What are your main career goals for the next 2-3 years?',
        'What challenges are you facing in your career right now?'
      )
      break
    case 'exploring':
      questions.push(
        'Which of these options resonates most with you and why?',
        'What skills do you feel most confident about?',
        'What concerns you most about making this change?'
      )
      break
    case 'planning':
      questions.push(
        'Which step feels most challenging to you?',
        'What timeline are you working with?',
        'What resources do you currently have available?'
      )
      break
    case 'implementing':
      questions.push(
        'How is your progress going so far?',
        'What obstacles have you encountered?',
        'What would be most helpful for your next steps?'
      )
      break
  }

  return questions
}

/**
 * Builds response structure guidelines based on conversation stage
 * 
 * @param context - The current conversation context
 * @returns String containing structured response guidelines for the AI
 * 
 * @example
 * ```typescript
 * const structure = buildStructuredResponse({ conversationStage: 'planning' });
 * // Returns structured guidance for planning stage responses
 * ```
 */
function buildStructuredResponse(context: ConversationContext): string {
  // Return empty string to remove rigid structure requirements
  // Let the AI respond naturally based on the conversation context
  return ''
}

/**
 * Constructs contextual prompt instructions for the AI based on conversation state
 * 
 * @param context - The current conversation context
 * @param isFirstMessage - Whether this is the first message in the conversation
 * @returns Contextual instructions string for the AI system prompt
 * 
 * @example
 * ```typescript
 * const prompt = buildContextualPrompt(
 *   { conversationStage: 'exploring', currentSituation: 'career transition' },
 *   false
 * );
 * // Returns detailed contextual instructions for the AI
 * ```
 */
function buildContextualPrompt(
  context: ConversationContext,
  isFirstMessage: boolean
): string {
  let contextualInstructions = ''

  if (isFirstMessage) {
    contextualInstructions +=
      '\n\nThis is the start of a new conversation. Feel free to greet them warmly and get to know their situation.'
  } else {
    if (context.currentSituation) {
      contextualInstructions += `\n\nContext: The user seems to be in a ${context.currentSituation} phase. Keep this in mind as you continue the conversation.`
    }
    contextualInstructions +=
      ' Build naturally on what you\'ve discussed before.'
  }

  // Simplified guidance based on conversation stage
  switch (context.conversationStage) {
    case 'initial':
      contextualInstructions +=
        ' Focus on getting to know them and their goals.'
      break
    case 'exploring':
      contextualInstructions +=
        ' Help them explore different possibilities and options.'
      break
    case 'planning':
      contextualInstructions +=
        ' They seem ready for more concrete planning and next steps.'
      break
    case 'implementing':
      contextualInstructions +=
        ' Focus on practical help with implementation and overcoming obstacles.'
      break
  }

  return contextualInstructions
}

/**
 * Generates personalized career advice using Groq AI based on conversation history
 * 
 * @param messages - Array of conversation messages with role and content
 * @returns Promise resolving to AI-generated career advice string
 * 
 * @throws {Error} When API key is missing or AI generation fails
 * 
 * @example
 * ```typescript
 * const advice = await generateCareerAdvice([
 *   { role: 'user', content: 'I want to transition from marketing to tech' },
 *   { role: 'assistant', content: 'That\'s a great goal...' },
 *   { role: 'user', content: 'What skills should I focus on?' }
 * ]);
 * // Returns personalized career advice based on conversation context
 * ```
 */
export async function generateCareerAdvice(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  try {
    // Extract conversation context
    const context = extractUserContext(messages)
    const isFirstMessage =
      messages.filter(msg => msg.role === 'user').length <= 1

    // Build contextual instructions
    const contextualInstructions = buildContextualPrompt(
      context,
      isFirstMessage
    )

    const systemPrompt = `You are an experienced and friendly career counselor who loves helping people navigate their professional journeys. You have over 10 years of experience guiding students, graduates, and professionals through career decisions.

Your communication style:
- Write naturally and conversationally, like you're talking to a friend over coffee
- Be warm, empathetic, and genuinely interested in helping
- Respond organically - sometimes with paragraphs, sometimes with lists, whatever feels right for the conversation
- Share insights and advice in a flowing, natural way rather than rigid structures
- Ask follow-up questions when they feel natural, not forced
- Be encouraging but realistic about challenges

What makes you great:
- You personalize every response based on what the person shares
- You offer practical, actionable advice that people can actually use
- You help people see multiple perspectives and options
- You're honest about both opportunities and challenges
- You remember what people have told you earlier in the conversation

Your expertise covers:
Career transitions, skill development, job searching, interview prep, workplace challenges, professional growth, work-life balance, industry insights, salary negotiation, networking, leadership development, and entrepreneurship.

Most importantly: Be yourself. Respond naturally and helpfully, just like a real career counselor would in a genuine conversation.${contextualInstructions}`

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      })),
    ]

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    let response = ''
    for await (const chunk of completion) {
      response += chunk.choices[0]?.delta?.content || ''
    }
    return (
      response ||
      "I apologize, but I'm having trouble generating a response right now. Please try again."
    )
  } catch (error) {
    console.error('Error generating career advice:', error)
    throw new Error('Failed to generate career advice')
  }
}
