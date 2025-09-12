'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { MessageRole } from '@prisma/client'

import { TypewriterEffect } from '../ui/typewriter-effect'
import 'highlight.js/styles/github.css'

interface MessageContentWithTypingProps {
  content: string
  role: MessageRole
  enableTyping?: boolean
  typingSpeed?: number
}

export function MessageContentWithTyping({ 
  content, 
  role, 
  enableTyping = false,
  typingSpeed = 30
}: MessageContentWithTypingProps) {
  const isUser = role === MessageRole.USER
  const [isTypingComplete, setIsTypingComplete] = useState(!enableTyping)

  // For user messages, just render plain text
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  // For AI messages with typing disabled or completed, render with markdown support
  if (!enableTyping || isTypingComplete) {
    return (
      <div className="prose prose-base max-w-none dark:prose-invert leading-7 text-gray-800 dark:text-gray-100 break-words overflow-wrap-anywhere">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom styling for markdown elements - ChatGPT-like
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-4 mt-6 text-gray-900 dark:text-white first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mb-3 mt-5 text-gray-900 dark:text-white first:mt-0">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-white first:mt-0">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-7 text-gray-800 dark:text-gray-200">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-gray-800 dark:text-gray-200">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-800 dark:text-gray-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-7">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                )
              }
              return (
                <div className="relative group mb-4">
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-6 border border-gray-200 dark:border-gray-700">
                    <code className={className}>{children}</code>
                  </pre>
                  <button
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    onClick={() => {
                      const code = children?.toString() || '';
                      navigator.clipboard.writeText(code);
                    }}
                  >
                    Copy
                  </button>
                </div>
              )
            },
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900 dark:text-white">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-800 dark:text-gray-200">
                {children}
              </em>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  // For AI messages with typing enabled, show typewriter effect
  return (
    <div className="prose prose-base max-w-none dark:prose-invert leading-7 text-gray-800 dark:text-gray-100 break-words overflow-wrap-anywhere">
      <TypewriterEffect
        text={content}
        speed={typingSpeed}
        onComplete={() => setIsTypingComplete(true)}
        className="whitespace-pre-wrap"
      />
    </div>
  )
}