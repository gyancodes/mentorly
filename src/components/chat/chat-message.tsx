'use client'

import { MessageRole } from '@prisma/client'
import { format } from 'date-fns'
import { Bot } from 'lucide-react'

import { cn } from '../../lib/utils'

import { MessageContent } from './message-content'
import { MessageContentWithTyping } from './message-content-with-typing'

interface ChatMessageProps {
  content: string
  role: MessageRole
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  enableTyping?: boolean
  typingSpeed?: number
}

export function ChatMessage({
  content,
  role,
  timestamp,
  status,
  enableTyping = false,
  typingSpeed = 30,
}: ChatMessageProps) {
  const isUser = role === MessageRole.USER
  const isError = status === 'error'
  const isSending = status === 'sending'

  return (
    <div
      className={cn(
        'flex w-full group animate-message-slide-in mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex items-start space-x-4 w-full',
          isUser ? 'max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%] flex-row-reverse space-x-reverse' : 'max-w-full'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg',
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          )}
        >
          {isUser ? (
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <Bot className='w-4 h-4' />
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            'transition-all duration-300 min-w-0 break-words overflow-wrap-anywhere',
            isUser ? 'max-w-fit' : 'flex-1 w-full',
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm'
              : 'text-gray-900 dark:text-gray-100',
            isError &&
              'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-4 py-3 animate-pulse',
            isSending && 'opacity-75 scale-[0.98]',
            ''
          )}
        >
          {enableTyping && role === MessageRole.ASSISTANT ? (
            <MessageContentWithTyping
              content={content}
              role={role}
              enableTyping={enableTyping}
              typingSpeed={typingSpeed}
            />
          ) : (
            <MessageContent content={content} role={role} />
          )}

          {/* Timestamp and Status */}
          <div
            className={cn(
              'text-xs mt-1 flex items-center gap-2 opacity-60',
              isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <span className='font-medium'>{format(timestamp, 'HH:mm')}</span>

            {status === 'sending' && (
              <div className='flex items-center space-x-2'>
                <div className='flex space-x-1'>
                  <div
                    className='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                    style={{ animationDelay: '0ms', animationDuration: '1.2s' }}
                  />
                  <div
                    className='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                    style={{ animationDelay: '150ms', animationDuration: '1.2s' }}
                  />
                  <div
                    className='w-1.5 h-1.5 bg-current rounded-full animate-bounce'
                    style={{ animationDelay: '300ms', animationDuration: '1.2s' }}
                  />
                </div>
                <span className='text-xs opacity-75 animate-pulse'>Sending...</span>
              </div>
            )}

            {status === 'sent' && isUser && (
              <svg
                className='w-3.5 h-3.5 text-blue-200'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}

            {status === 'error' && (
              <svg
                className='w-3.5 h-3.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
