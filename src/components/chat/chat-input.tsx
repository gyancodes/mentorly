'use client'

import { useState, useRef, useEffect } from 'react'

import { cn } from '../../lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  variant?: 'default' | 'hero'
}

const QUICK_QUESTIONS = [
  "Help me create a career development plan",
  "What skills should I develop for my career?",
  "Help me prepare for job interviews",
  "How can I improve my professional network?",
  "What are the latest trends in my industry?",
  "How do I negotiate a salary increase?",
  "What certifications should I pursue?",
  "How can I transition to a new career field?"
]

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  variant = 'default',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      setShowSuggestions(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  // Filter suggestions based on input
  useEffect(() => {
    if (message.trim().length > 0) {
      const filtered = QUICK_QUESTIONS.filter(q => 
        q.toLowerCase().includes(message.toLowerCase())
      ).slice(0, 4)
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
      setFilteredSuggestions([])
    }
  }, [message])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn(
      variant === 'hero' ? '' : 'bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800'
    )}>
      <div className={cn(
        variant === 'hero' ? '' : 'max-w-4xl mx-auto'
      )}>
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              'relative flex items-center rounded-2xl border transition-all duration-300 shadow-sm',
              variant === 'hero' 
                ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                : 'bg-white dark:bg-gray-800',
              isFocused
                ? 'border-blue-500 ring-2 ring-blue-500/20 ring-offset-0 shadow-lg'
                : 'hover:border-gray-400 dark:hover:border-gray-600'
            )}
          >
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
                'flex-1 resize-none bg-transparent px-4 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none max-h-40 overflow-y-auto',
                'disabled:text-gray-400 dark:disabled:text-gray-500'
              )}
            />
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className={cn(
                'flex items-center justify-center rounded-xl transition-all duration-200 mr-2',
                'w-10 h-10',
                message.trim() && !disabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              {disabled ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                </div>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Quick Questions Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div className="p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1 font-medium">
                  Quick Questions
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150 flex items-start gap-2"
                  >
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
