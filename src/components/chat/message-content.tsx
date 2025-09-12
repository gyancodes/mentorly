'use client'

import { MessageRole } from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { cn } from '../../lib/utils'
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

  // For AI messages, render with markdown support
  return (
    <div className='prose prose-base max-w-none dark:prose-invert leading-7 text-gray-800 dark:text-gray-100 break-words overflow-wrap-anywhere'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for markdown elements - ChatGPT-like
          h1: ({ children }) => (
            <h1 className='text-2xl font-bold mb-6 mt-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 first:mt-0'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-xl font-semibold mb-4 mt-6 text-gray-900 dark:text-white first:mt-0'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-lg font-semibold mb-3 mt-5 text-gray-900 dark:text-white first:mt-0'>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className='text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-white first:mt-0'>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className='mb-4 text-gray-800 dark:text-gray-200 leading-7 text-base first:mt-0 last:mb-0'>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className='list-disc mb-5 space-y-2 text-gray-800 dark:text-gray-200 ml-6 pl-2'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal mb-5 space-y-2 text-gray-800 dark:text-gray-200 ml-6 pl-2'>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className='text-gray-800 dark:text-gray-200 text-base leading-7 marker:text-gray-500 dark:marker:text-gray-400'>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-blue-500 dark:border-blue-400 pl-6 pr-4 italic mb-6 text-gray-700 dark:text-gray-300 bg-blue-50/50 dark:bg-blue-900/10 py-4 rounded-r-xl my-6'>
              {children}
            </blockquote>
          ),
          code: ({ inline, children, className }: _CodeProps) => {
            if (inline) {
              return (
                <code className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700'>
                  {children}
                </code>
              )
            }
            return (
              <code className={cn('block font-mono text-sm', className)}>
                {children}
              </code>
            )
          },
          pre: ({ children }: _PreProps) => {
            /**
             * Recursively extracts text content from React nodes for clipboard functionality
             * @param node - React node to extract text from
             * @returns Extracted text content as string
             */
            const getTextContent = (node: React.ReactNode): string => {
              if (typeof node === 'string') {return node}
              if (Array.isArray(node)) {return node.map(getTextContent).join('')}
              if (node && typeof node === 'object' && 'props' in node) {
                const element = node as {
                  props?: { children?: React.ReactNode }
                }
                if (element.props?.children) {
                  return getTextContent(element.props.children)
                }
              }
              return ''
            }

            return (
              <div className='relative group mb-6'>
                <pre className='bg-gray-900 dark:bg-gray-950 text-gray-100 p-5 rounded-xl overflow-x-auto text-sm border border-gray-700 dark:border-gray-800 shadow-lg font-mono leading-6 max-w-full whitespace-pre-wrap break-all'>
                  {children}
                </pre>
                <button
                  className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium'
                  onClick={() => {
                    const code = getTextContent(children)
                    navigator.clipboard.writeText(code)
                  }}
                >
                  Copy
                </button>
              </div>
            )
          },
          strong: ({ children }) => (
            <strong className='font-semibold text-gray-900 dark:text-white'>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className='italic text-gray-800 dark:text-gray-200'>
              {children}
            </em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded'
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className='overflow-x-auto mb-6 rounded-lg border border-gray-200 dark:border-gray-700'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className='bg-gray-50 dark:bg-gray-800'>{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150'>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
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