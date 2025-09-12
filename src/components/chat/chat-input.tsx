'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-4">
        <div className="flex-1 relative">
          <div className={cn(
            'relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300',
            isFocused 
              ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white dark:bg-gray-700' 
              : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50',
            'hover:border-blue-400 dark:hover:border-blue-500'
          )}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-3 text-base sm:text-sm bg-transparent',
                'focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'disabled:text-gray-500 dark:disabled:text-gray-400',
                'text-gray-900 dark:text-gray-100',
                'max-h-32 overflow-y-hidden sm:overflow-y-auto sm:scrollbar-thin',
                'touch-manipulation min-h-[44px]'
              )}
            />
            
            {/* Character count indicator */}
            {message.length > 0 && (
              <div className="absolute bottom-2 right-2 sm:right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
                {message.length}
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            'group relative rounded-xl sm:rounded-2xl p-3 sm:p-3 font-medium transition-all duration-300 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
            message.trim() && !disabled
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed',
            'transform transition-transform'
          )}>
          <div className="flex items-center justify-center">
            {disabled ? (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <svg 
                className={cn(
                  'h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-200',
                  message.trim() && 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                )} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </div>
          
          {/* Ripple effect */}
          {message.trim() && !disabled && (
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
          )}
        </button>
      </form>
      
      {/* Quick actions */}
      <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd>
            <span className="hidden sm:inline">to send</span>
          </span>
          <span className="flex items-center space-x-1 hidden sm:flex">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd>
            <span>for new line</span>
          </span>
        </div>
        
        {message.length > 500 && (
          <span className="text-amber-500 dark:text-amber-400 font-medium">
            Long message
          </span>
        )}
      </div>
    </div>
  )
}