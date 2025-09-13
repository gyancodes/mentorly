'use client'

import { MessageRole } from '@prisma/client'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'

import { signOut } from '@/lib/auth-client'

import { trpc } from '../../lib/trpc-client'
import { cn } from '../../lib/utils'
import { useSessionContext } from '../providers/session-provider'
import { ThemeToggle } from '../ui/theme-toggle'

import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'
import { ChatSessionList } from './chat-session-list'
import { TypingIndicator } from './typing-indicator'

// Types
interface PendingMessage {
  id: string
  content: string
  role: MessageRole
  timestamp: Date
  status: 'sending' | 'sent' | 'error'
}

interface AnonymousMessage {
  id: string
  content: string
  role: MessageRole
  createdAt: Date
}

interface ChatInterfaceProps {
  sessionId?: string
}

export function ChatInterface({ sessionId }: ChatInterfaceProps = {}) {
  const router = useRouter()
  const { session: userSession } = useSessionContext()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessionId || null
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [isAiResponding, setIsAiResponding] = useState(false)
  const [latestAiMessageId, setLatestAiMessageId] = useState<string | null>(
    null
  )
  const [anonymousMessages, setAnonymousMessages] = useState<
    AnonymousMessage[]
  >([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: session, refetch: refetchSession } =
    trpc.chat.getSession.useQuery(
      { sessionId: selectedSessionId! },
      { 
        enabled: !!selectedSessionId && !!userSession,
        staleTime: 30 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    )

  trpc.chat.getSessions.useQuery(
    {},
    { 
      enabled: !!userSession,
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  )

  const utils = trpc.useUtils()

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setPendingMessages(prev => prev.filter(msg => msg.id !== data.userMessage.id))
      setIsAiResponding(false)
      
      if (data.assistantMessage) {
        setLatestAiMessageId(data.assistantMessage.id)
        setTimeout(() => setLatestAiMessageId(null), 3000)
      }
      
      // Use optimistic updates instead of invalidating to prevent refresh
      if (selectedSessionId) {
        utils.chat.getSession.setData(
          { sessionId: selectedSessionId },
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              messages: [
                ...oldData.messages,
                data.userMessage,
                data.assistantMessage,
              ],
            }
          }
        )
      }
    },
    onError: error => {
      console.error('Failed to send message:', error)
      setPendingMessages(prev =>
        prev.map(msg =>
          msg.status === 'sending' ? { ...msg, status: 'error' as const } : msg
        )
      )
      setIsAiResponding(false)
      toast.error('Failed to send message. Please try again.')
    },
  })

  const sendAnonymousMessageMutation =
    trpc.chat.sendAnonymousMessage.useMutation({
      onSuccess: data => {
        setPendingMessages(prev => prev.filter(msg => msg.id !== data.userMessage.id))
        setAnonymousMessages(prev => [
          ...prev,
          {
            id: data.userMessage.id,
            content: data.userMessage.content,
            role: data.userMessage.role,
            createdAt: new Date(data.userMessage.createdAt),
          },
          {
            id: data.assistantMessage.id,
            content: data.assistantMessage.content,
            role: data.assistantMessage.role,
            createdAt: new Date(data.assistantMessage.createdAt),
          },
        ])
        setIsAiResponding(false)
        setLatestAiMessageId(data.assistantMessage.id)
        setTimeout(() => setLatestAiMessageId(null), 3000)
      },
      onError: error => {
        console.error('Failed to send anonymous message:', error)
        setPendingMessages(prev =>
          prev.map(msg =>
            msg.status === 'sending' ? { ...msg, status: 'error' as const } : msg
          )
        )
        setIsAiResponding(false)
        toast.error('Failed to send message. Please try again.')
      },
    })

  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: newSession => {
      setSelectedSessionId(newSession.id)
      // Use optimistic updates instead of refetching
      utils.chat.getSessions.setData({}, (oldData) => {
        if (!oldData) return [newSession]
        return [newSession, ...oldData]
      })
    },
    onError: error => {
      console.error('Failed to create session:', error)
      toast.error('Failed to create new session. Please try again.')
    },
  })

  const createSessionWithFirstMessageMutation = trpc.chat.createSessionWithFirstMessage.useMutation({
    onSuccess: (data) => {
      setSelectedSessionId(data.session.id)
      // Clear all pending messages since we created the session successfully
      setPendingMessages([])
      setIsAiResponding(false)
      
      if (data.assistantMessage) {
        setLatestAiMessageId(data.assistantMessage.id)
        setTimeout(() => setLatestAiMessageId(null), 3000)
      }
      
      // Use optimistic updates instead of invalidating
      utils.chat.getSessions.setData({}, (oldData) => {
        if (!oldData) return [data.session]
        return [data.session, ...oldData]
      })
      
      utils.chat.getSession.setData(
        { sessionId: data.session.id },
        {
          ...data.session,
          messages: [data.userMessage, data.assistantMessage],
        }
      )
    },
    onError: error => {
      console.error('Failed to create session with message:', error)
      setPendingMessages(prev =>
        prev.map(msg =>
          msg.status === 'sending' ? { ...msg, status: 'error' as const } : msg
        )
      )
      setIsAiResponding(false)
      toast.error('Failed to send message. Please try again.')
    },
  })

  const scrollToBottom = useCallback(
    (force = false) => {
      if (force || isAiResponding) {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
    },
    [isAiResponding]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [session?.messages?.length, anonymousMessages.length, pendingMessages.length, scrollToBottom])

  useEffect(() => {
    if (isAiResponding) {
      const interval = setInterval(() => {
        scrollToBottom()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isAiResponding, scrollToBottom])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return
    const messageId = `temp-${Date.now()}-${Math.random()}`
    setIsAiResponding(true)
    
    const userMessage: PendingMessage = {
      id: messageId,
      content: content.trim(),
      role: MessageRole.USER,
      timestamp: new Date(),
      status: 'sending',
    }
    
    setPendingMessages(prev => [...prev, userMessage])
    
    if (!userSession) {
      const conversationHistory = anonymousMessages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }))
      
      setPendingMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'sent' as const } : msg
        )
      )
      
      sendAnonymousMessageMutation.mutate({
        content: content.trim(),
        conversationHistory,
      })
    } else if (!selectedSessionId) {
      // Use optimized mutation that creates session and sends message in one operation
      setIsAiResponding(true)
      
      // Add pending message for immediate UI feedback
      setPendingMessages(prev => [
        ...prev,
        {
          id: messageId,
          content: content.trim(),
          role: 'user' as const,
          status: 'sending' as const,
          timestamp: new Date(),
        },
      ])
      
      createSessionWithFirstMessageMutation.mutate({
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        firstMessage: content.trim(),
      })
    } else {
      setPendingMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'sent' as const } : msg
        )
      )
      
      sendMessageMutation.mutate({
        sessionId: selectedSessionId,
        content: content.trim(),
        messageId,
      })
    }
  }

  const handleNewSession = () => {
    setSelectedSessionId(null)
    setPendingMessages([])
    setIsAiResponding(false)
    setLatestAiMessageId(null)
    
    if (!userSession) {
      setAnonymousMessages([])
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden'>
      <div
        className={cn(
          'flex w-full transition-all duration-300',
          !isSidebarOpen ? 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' : ''
        )}
      >
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 backdrop-blur-sm bg-white/10 z-40 sm:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            'bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
            isSidebarOpen ? 'w-64 sm:w-64' : 'w-0 overflow-hidden',
            'fixed sm:relative z-50 sm:z-auto h-full'
          )}
        >
          <div className='h-full flex flex-col'>
            {/* Sidebar Header */}
            <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
              {/* Mentorly Logo */}
              {userSession ? (
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-lg font-bold text-gray-900 dark:text-white'>Mentorly</h2>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>AI Career Mentor</p>
                  </div>
                </div>
              ) : (
                <Link href='/' className='flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity'>
                  <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-lg font-bold text-gray-900 dark:text-white'>Mentorly</h2>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>AI Career Mentor</p>
                  </div>
                </Link>
              )}

            </div>

            {/* Chat Sessions */}
            <div className='flex-1 overflow-y-auto'>
              {isSidebarOpen && userSession && (
                <ChatSessionList
                  selectedSessionId={selectedSessionId || undefined}
                  onSelectSession={setSelectedSessionId}
                  onNewSession={handleNewSession}
                />
              )}

              {isSidebarOpen && !userSession && (
                <div className='p-4 text-center'>
                  <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                    <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <svg
                        className='w-6 h-6 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-2'>
                      Anonymous Mode
                    </h3>
                    <p className='text-xs text-blue-700 dark:text-blue-300 mb-3'>
                      Your conversations are not saved. Sign in to access chat
                      history and save your sessions.
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className='text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors'
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            {isSidebarOpen && (
              <div className='border-t border-gray-200 dark:border-gray-800 p-4'>
                {userSession ? (
                  <div className='space-y-2'>
                    {/* User Info */}
                    <div className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                      <div className='w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0'>
                        <span className='text-gray-700 dark:text-gray-300 text-sm font-medium'>
                          {(
                            userSession.user.name ||
                            userSession.user.email ||
                            'U'
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                          {userSession.user.name || 'User'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className='p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors'
                      >
                        <LogOut className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='px-2'>
                    <Link
                      href='/'
                      className='flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                      </svg>
                      Sign in
                    </Link>
                  </div>
                )}
                
                {/* Minimal Branding */}
                <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
                  <div className='flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='w-4 h-4 bg-blue-600 rounded-lg flex items-center justify-center'>
                      <svg className='w-2.5 h-2.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                      </svg>
                    </div>
                    <span>Mentorly</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0'>
          {/* Header */}
          <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
              >
                <svg
                  className='w-5 h-5 text-gray-600 dark:text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
              {userSession ? (
                <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {session?.title || 'Mentorly'}
                </h1>
              ) : (
                <Link href='/' className='text-lg font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity'>
                  {session?.title || 'Mentorly'}
                </Link>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <ThemeToggle />
            </div>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto bg-white dark:bg-gray-900'>
            <div className='h-full'>
              {(userSession ? (!selectedSessionId || session?.messages.length === 0) : (anonymousMessages.length === 0)) ? (
                <div className='h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-6'>

                  <div className='mb-6'>
                    <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-xl'>
                      <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                      </svg>
                    </div>
                    <h2 className='text-2xl font-semibold text-blue-600 mb-2'>
                      How can I help you today?
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Your AI-powered career mentor is ready to assist</p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl mt-6'>
                    <button
                      onClick={() => handleSendMessage('Help me create a career development plan')}
                      className='p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 text-left border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md'
                    >
                      <div className='flex items-start gap-2'>
                        <div className='w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5'>
                          <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900 dark:text-white text-xs mb-1'>
                            Career Planning
                          </h3>
                          <p className='text-gray-600 dark:text-gray-400 text-xs'>
                            Create a personalized roadmap
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSendMessage('What skills should I develop for my career?')}
                      className='p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-200 text-left border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-md'
                    >
                      <div className='flex items-start gap-2'>
                        <div className='w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5'>
                          <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 10V3L4 14h7v7l9-11h-7z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900 dark:text-white text-xs mb-1'>
                            Skill Development
                          </h3>
                          <p className='text-gray-600 dark:text-gray-400 text-xs'>
                            Discover key skills to advance
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSendMessage('Help me prepare for job interviews')}
                      className='p-2 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30 transition-all duration-200 text-left border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md'
                    >
                      <div className='flex items-start gap-2'>
                        <div className='w-4 h-4 text-green-600 dark:text-green-400 mt-0.5'>
                          <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900 dark:text-white text-xs mb-1'>
                            Interview Prep
                          </h3>
                          <p className='text-gray-600 dark:text-gray-400 text-xs'>
                            Get ready for your next interview
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSendMessage('How can I improve my professional network?')}
                      className='p-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-all duration-200 text-left border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm hover:shadow-md'
                    >
                      <div className='flex items-start gap-2'>
                        <div className='w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5'>
                          <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900 dark:text-white text-xs mb-1'>
                            Networking
                          </h3>
                          <p className='text-gray-600 dark:text-gray-400 text-xs'>
                            Build meaningful connections
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='px-3 sm:px-4 md:px-6 py-2 sm:py-3'>
                  <div className='space-y-4 animate-fadeIn'>
                    {/* Render messages based on authentication status */}
                    {userSession
                      ? // Authenticated user - show database messages
                        session?.messages.map((message, index) => {
                          const isLatestAiMessage =
                            message.role === MessageRole.ASSISTANT &&
                            message.id === latestAiMessageId
                          return (
                            <div
                              key={message.id}
                              className='animate-slideIn'
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <ChatMessage
                                content={message.content}
                                role={message.role}
                                timestamp={new Date(message.createdAt)}
                                enableTyping={isLatestAiMessage}
                                typingSpeed={25}
                              />
                            </div>
                          )
                        })
                      : // Anonymous user - show in-memory messages
                        anonymousMessages.map((message, index) => {
                          const isLatestAiMessage =
                            message.role === MessageRole.ASSISTANT &&
                            message.id === latestAiMessageId
                          return (
                            <div
                              key={message.id}
                              className='animate-slideIn'
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <ChatMessage
                                content={message.content}
                                role={message.role}
                                timestamp={message.createdAt}
                                enableTyping={isLatestAiMessage}
                                typingSpeed={25}
                              />
                            </div>
                          )
                        })}

                    {/* Render pending messages (optimistic updates) */}
                    {pendingMessages.map(message => {
                      // For authenticated users, check for duplicates with server messages
                      // For anonymous users, check for duplicates with in-memory messages
                      const isDuplicate = userSession
                        ? session?.messages?.some(
                            serverMsg =>
                              serverMsg.content === message.content &&
                              serverMsg.role === message.role &&
                              Math.abs(
                                new Date(serverMsg.createdAt).getTime() -
                                  message.timestamp.getTime()
                              ) < 5000
                          )
                        : anonymousMessages.some(
                            anonMsg =>
                              anonMsg.content === message.content &&
                              anonMsg.role === message.role &&
                              Math.abs(
                                anonMsg.createdAt.getTime() -
                                  message.timestamp.getTime()
                              ) < 5000
                          )

                      if (isDuplicate) return null

                      return (
                        <div key={message.id} className='animate-slideIn'>
                          <ChatMessage
                            content={message.content}
                            role={message.role}
                            timestamp={message.timestamp}
                            status={message.status}
                          />
                        </div>
                      )
                    })}

                    {/* Typing bubble animation when AI is responding */}
                    {isAiResponding && (
                      <div className='animate-slideIn'>
                        <div className='flex items-start gap-3 mb-4'>
                          <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <div className='bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-xs'>
                              <div className='flex items-center space-x-1'>
                                <div className='flex space-x-1'>
                                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0ms'}}></div>
                                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '150ms'}}></div>
                                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '300ms'}}></div>
                                </div>
                              </div>
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1'>
                              AI is thinking...
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isAiResponding}
            placeholder={
              selectedSessionId
                ? 'Ask me anything...'
                : 'Ask about your career...'
            }
          />
        </div>
      </div>
    </div>
  )
}
