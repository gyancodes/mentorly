'use client'

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
        <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center shadow-lg'>
          <svg
            className='w-4 h-4 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
          </svg>
        </div>
      </div>

      {/* Simple Three Dots Bubble */}
      <div className='max-w-[80%] animate-slideIn'>
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm'>
          <div className='flex items-center justify-center'>
            {/* Three Dots Animation */}
            <div className='flex space-x-1'>
              <div
                className='w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
               />
              <div
                className='w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'
                style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
               />
              <div
                className='w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce'
                style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
