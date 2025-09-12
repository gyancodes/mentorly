import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../lib/trpc'
import { generateCareerAdvice } from '../../lib/groq'
import { MessageRole } from '@prisma/client'

export const chatRouter = createTRPCRouter({
  // Create a new chat session (only for authenticated users)
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.chatSession.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      })
      return session
    }),

  // Get all chat sessions (only for authenticated users)
  getSessions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.db.chatSession.findMany({
        where: {
          userId: ctx.session.user.id,
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

  // Get a specific chat session with messages (only for authenticated users)
  getSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.chatSession.findUnique({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id, // Ensure user can only access their own sessions
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

  // Send a message and get AI response (for authenticated users with persistence)
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify session belongs to user
      const sessionExists = await ctx.db.chatSession.findFirst({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
      })

      if (!sessionExists) {
        throw new Error('Session not found or access denied')
      }

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

  // Send a message and get AI response (for anonymous users without persistence)
  sendAnonymousMessage: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        conversationHistory: z.array(
          z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
          })
        ).optional().default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prepare conversation history including the new message
      const conversationHistory = [
        ...input.conversationHistory,
        {
          role: 'user' as const,
          content: input.content,
        },
      ]

      // Generate AI response without saving to database
      const aiResponse = await generateCareerAdvice(conversationHistory)

      return {
        userMessage: {
          id: `temp-user-${Date.now()}`,
          content: input.content,
          role: MessageRole.USER,
          createdAt: new Date(),
        },
        assistantMessage: {
          id: `temp-assistant-${Date.now()}`,
          content: aiResponse,
          role: MessageRole.ASSISTANT,
          createdAt: new Date(),
        },
      }
    }),

  // Delete a chat session (only for authenticated users)
  deleteSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.chatSession.delete({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id, // Ensure user can only delete their own sessions
        },
      })
      return { success: true }
    }),
})