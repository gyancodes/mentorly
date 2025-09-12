import { MessageRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { generateCareerAdvice } from '../../lib/groq'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '../../lib/trpc'

export const chatRouter = createTRPCRouter({
  // Create a new chat session (only for authenticated users)
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Session title is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await ctx.db.chatSession.create({
          data: {
            title: input.title,
            userId: ctx.session.user.id,
          },
        })
        return session
      } catch (error) {
        console.error('Failed to create chat session:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create chat session. Please try again.',
        })
      }
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
      try {
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
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to load chat sessions. Please try again.',
        })
      }
    }),

  // Get a specific chat session with messages (only for authenticated users)
  getSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().min(1, 'Session ID is required'),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
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

        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found or access denied.',
          })
        }

        return session
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error('Failed to fetch chat session:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to load chat session. Please try again.',
        })
      }
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
      try {
        // Verify session belongs to user
        const sessionExists = await ctx.db.chatSession.findFirst({
          where: {
            id: input.sessionId,
            userId: ctx.session.user.id,
          },
        })

        if (!sessionExists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found or access denied.',
          })
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
        let aiResponse: string
        try {
          aiResponse = await generateCareerAdvice(conversationHistory)
        } catch (aiError) {
          console.error('AI generation failed:', aiError)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate AI response. Please try again.',
          })
        }

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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error('Failed to send message:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message. Please try again.',
        })
      }
    }),

  // Send a message and get AI response (for anonymous users without persistence)
  sendAnonymousMessage: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Prepare conversation history including the new message
        const conversationHistory = [
          ...input.conversationHistory,
          {
            role: 'user' as const,
            content: input.content,
          },
        ]

        // Generate AI response without saving to database
        let aiResponse: string
        try {
          aiResponse = await generateCareerAdvice(conversationHistory)
        } catch (aiError) {
          console.error('AI generation failed for anonymous user:', aiError)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate AI response. Please try again.',
          })
        }

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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error('Failed to send anonymous message:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message. Please try again.',
        })
      }
    }),

  // Delete a chat session (only for authenticated users)
  deleteSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().min(1, 'Session ID is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First check if session exists and belongs to user
        const session = await ctx.db.chatSession.findFirst({
          where: {
            id: input.sessionId,
            userId: ctx.session.user.id,
          },
        })

        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found or access denied.',
          })
        }

        await ctx.db.chatSession.delete({
          where: {
            id: input.sessionId,
            userId: ctx.session.user.id, // Ensure user can only delete their own sessions
          },
        })
        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error('Failed to delete chat session:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete chat session. Please try again.',
        })
      }
    }),
})
