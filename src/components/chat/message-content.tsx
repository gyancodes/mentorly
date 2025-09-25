'use client'

import { MessageRole } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'


import 'highlight.js/styles/github.css'

interface MessageContentProps {
  content: string
  role: MessageRole
}

// Define proper TypeScript interfaces for ReactMarkdown component props
interface _CodeProps {
  inline?: boolean
  children?: React.ReactNode
  className?: string
}

interface _PreProps {
  children?: React.ReactNode
}

interface _ReactElementWithProps {
  props?: {
    children?: React.ReactNode
  }
}

export function MessageContent({ content, role }: MessageContentProps) {
  const isUser = role === MessageRole.USER

  // For user messages, just render plain text
  if (isUser) {
    return <div className='whitespace-pre-wrap'>{content}</div>
  }

  // For AI messages, render with clean, smooth formatting
  return (
    <div className='text-gray-900 dark:text-gray-100 leading-7 break-words overflow-wrap-anywhere'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Smooth, clean styling
          p: ({ children }) => (
            <p className='mb-3 text-gray-900 dark:text-gray-100 leading-7'>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className='list-disc mb-3 space-y-1 text-gray-900 dark:text-gray-100 ml-5'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal mb-3 space-y-1 text-gray-900 dark:text-gray-100 ml-5'>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className='text-gray-900 dark:text-gray-100 leading-6'>
              {children}
            </li>
          ),
          code: ({ inline, children }: _CodeProps) => {
            if (inline) {
              return (
                <code className='bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200'>
                  {children}
                </code>
              )
            }
            return (
              <code className='block font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200 mb-3'>
                {children}
              </code>
            )
          },
          pre: ({ children }: _PreProps) => (
            <pre className='bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 mb-3'>
              {children}
            </pre>
          ),
          strong: ({ children }) => (
            <strong className='font-semibold text-gray-900 dark:text-gray-100'>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className='italic text-gray-900 dark:text-gray-100'>
              {children}
            </em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              {children}
            </a>
          ),
          // Simple headings
          h1: ({ children }) => (
            <h1 className='text-lg font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-base font-semibold mb-2 mt-3 text-gray-900 dark:text-gray-100'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-sm font-semibold mb-2 mt-2 text-gray-900 dark:text-gray-100'>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className='text-sm font-medium mb-1 mt-2 text-gray-900 dark:text-gray-100'>
              {children}
            </h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic mb-3 text-gray-700 dark:text-gray-300'>
              {children}
            </blockquote>
          ),
          // Simple table formatting
          table: ({ children }) => (
            <div className='overflow-x-auto mb-3 rounded border border-gray-200 dark:border-gray-700'>
              <table className='min-w-full text-sm'>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className='bg-gray-50 dark:bg-gray-800'>{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className='bg-white dark:bg-gray-900'>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className='px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='px-3 py-2 text-gray-900 dark:text-gray-100'>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}