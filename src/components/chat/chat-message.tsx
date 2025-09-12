'use client'

import { MessageRole } from '@prisma/client'
import { cn } from '../../lib/utils'
import { format } from 'date-fns'
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

export function ChatMessage({ content, role, timestamp, status, enableTyping = false, typingSpeed = 30 }: ChatMessageProps) {
  const isUser = role === MessageRole.USER
  const isError = status === 'error'
  const isSending = status === 'sending'

  return (
    <div className={cn(
      'flex w-full group animate-in fade-in-0 slide-in-from-bottom-2 duration-500',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex items-start space-x-3 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%] w-full',
        isUser && 'flex-row-reverse space-x-reverse'
      )}>
        {/* Avatar */}
        <div className={cn(
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm',
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-200'
        )}>
          {isUser ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          'rounded-xl px-3 py-2.5 shadow-sm backdrop-blur-sm border transition-all duration-200 min-w-0 flex-1 break-words overflow-wrap-anywhere',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400/20 shadow-blue-500/20'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-600/50 shadow-gray-500/10',
          isError && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
          isSending && 'opacity-70 scale-95',
          'group-hover:shadow-lg group-hover:scale-[1.02]'
        )}>
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
          <div className={cn(
            'text-xs mt-1.5 flex items-center gap-2 opacity-70',
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          )}>
            <span className="font-medium">{format(timestamp, 'HH:mm')}</span>
            
            {status === 'sending' && (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            {status === 'sent' && isUser && (
              <svg className="w-3.5 h-3.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {status === 'error' && (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}