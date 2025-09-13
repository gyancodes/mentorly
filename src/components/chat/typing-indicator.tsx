'use client'

import { Bot } from 'lucide-react'

import { cn } from '../../lib/utils'

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-start space-x-3 mb-4 animate-fadeIn transition-all duration-500',
        className
      )}
    >
      {/* AI Avatar */}
      <div className='flex-shrink-0 mt-1'>
        <div className='w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg'>
          <Bot className='w-4 h-4 text-white' />
        </div>
      </div>

      {/* Enhanced Typing Bubble */}
      <div className='max-w-[80%] animate-slideIn'>
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='flex items-center justify-center'>
            {/* Three Dots Animation */}
            <div className='flex space-x-1'>
              <div
                className='w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce'
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
               />
              <div
                className='w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce'
                style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
               />
              <div
                className='w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce'
                style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
