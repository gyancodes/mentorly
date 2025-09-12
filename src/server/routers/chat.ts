import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../../lib/trpc'
import { generateCareerAdvice } from '../../lib/groq'
import { MessageRole } from '@prisma/client'

export const chatRouter = createTRPCRouter({
  // Create a new chat session
  createSession: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.chatSession.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      })
      return session
    }),

  // Get all chat sessions
  getSessions: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.db.chatSession.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: input.limit,
        skip: input.offset,
        include: {
          _count: {
            select: {
              messages: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      })
      return sessions
    }),

  // Get a specific chat session with messages
  getSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.chatSession.findUnique({
        where: {
          id: input.sessionId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      })
      return session
    }),

  // Send a message and get AI response
  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Save user message
      const userMessage = await ctx.db.message.create({
        data: {
          content: input.content,
          role: MessageRole.USER,
          chatSessionId: input.sessionId,
        },
      })

      // Get conversation history
      const messages = await ctx.db.message.findMany({
        where: {
          chatSessionId: input.sessionId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      // Prepare messages for AI
      const conversationHistory = messages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }))

      // Generate AI response
      const aiResponse = await generateCareerAdvice(conversationHistory)

      // Save AI message
      const assistantMessage = await ctx.db.message.create({
        data: {
          content: aiResponse,
          role: MessageRole.ASSISTANT,
          chatSessionId: input.sessionId,
        },
      })

      // Update session timestamp
      await ctx.db.chatSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          updatedAt: new Date(),
        },
      })

      return {
        userMessage,
        assistantMessage,
      }
    }),

  // Delete a chat session
  deleteSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.chatSession.delete({
        where: {
          id: input.sessionId,
        },
      })
      return { success: true }
    }),
})