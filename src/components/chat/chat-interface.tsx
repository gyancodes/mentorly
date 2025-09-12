'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '../../lib/trpc-client'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatSessionList } from './chat-session-list'
import { TypingIndicator } from './typing-indicator'
import { ThemeToggle } from '../ui/theme-toggle'
import { useSessionContext } from '../providers/session-provider'
import { signOut } from '@/lib/auth-client'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { MessageRole } from '@prisma/client'
import { LogOut } from 'lucide-react'

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
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(sessionId || null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [isAiResponding, setIsAiResponding] = useState(false)
  const [latestAiMessageId, setLatestAiMessageId] = useState<string | null>(null)
  const [anonymousMessages, setAnonymousMessages] = useState<AnonymousMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: session, refetch: refetchSession } = trpc.chat.getSession.useQuery(
    { sessionId: selectedSessionId! },
    { enabled: !!selectedSessionId && !!userSession }
  )

  const { refetch: refetchSessions } = trpc.chat.getSessions.useQuery(
    {},
    { enabled: !!userSession }
  )

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      // Clear pending messages immediately to prevent duplication
      setPendingMessages([])
      setIsAiResponding(false)
      
      // Then refresh session to get the real messages
      refetchSession().then((result) => {
        // Set the latest AI message for typing effect
        if (result.data?.messages) {
          const latestAiMessage = result.data.messages
            .filter(msg => msg.role === MessageRole.ASSISTANT)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
          if (latestAiMessage) {
            setLatestAiMessageId(latestAiMessage.id)
            // Clear the typing effect after a delay
            setTimeout(() => setLatestAiMessageId(null), 5000)
          }
        }
      })
    },
    onError: (error) => {
      // Mark pending message as error
      setPendingMessages(prev => 
        prev.map(msg => ({ ...msg, status: 'error' as const }))
      )
      setIsAiResponding(false)
      console.error('Failed to send message:', error)
    },
  })

  const sendAnonymousMessageMutation = trpc.chat.sendAnonymousMessage.useMutation({
    onSuccess: (data) => {
      // Add both user and AI messages to anonymous conversation
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
      
      // Clear pending messages and set typing effect
      setPendingMessages([])
      setIsAiResponding(false)
      setLatestAiMessageId(data.assistantMessage.id)
      
      // Clear the typing effect after a delay
      setTimeout(() => setLatestAiMessageId(null), 5000)
    },
    onError: (error) => {
      // Mark pending message as error
      setPendingMessages(prev => 
        prev.map(msg => ({ ...msg, status: 'error' as const }))
      )
      setIsAiResponding(false)
      console.error('Failed to send anonymous message:', error)
    },
  })

  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: (newSession) => {
      setSelectedSessionId(newSession.id)
      // Refresh the sessions list to show the new session
      refetchSessions()
    },
    onError: (error) => {
      // Clear pending messages on session creation error
      setPendingMessages([])
      setIsAiResponding(false)
      console.error('Failed to create session:', error)
    },
  })

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAiResponding) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  }, [isAiResponding])

  // Auto-scroll when messages change or AI is responding
  useEffect(() => {
    scrollToBottom(true)
  }, [session?.messages, scrollToBottom])

  // Continuous scroll during AI response
  useEffect(() => {
    if (isAiResponding) {
      const interval = setInterval(() => {
        scrollToBottom()
      }, 500) // Scroll every 500ms during AI response
      
      return () => clearInterval(interval)
    }
  }, [isAiResponding, scrollToBottom])

  // Scroll when pending messages change
  useEffect(() => {
    if (pendingMessages.length > 0) {
      scrollToBottom(true)
    }
  }, [pendingMessages, scrollToBottom])

  const handleSendMessage = (content: string) => {
    // Generate unique ID for optimistic update
    const messageId = `temp-${Date.now()}-${Math.random()}`
    
    // Add user message immediately (optimistic update)
    const userMessage: PendingMessage = {
      id: messageId,
      content,
      role: MessageRole.USER,
      timestamp: new Date(),
      status: 'sending'
    }
    
    setPendingMessages([userMessage])
    setIsAiResponding(true)
    
    if (!userSession) {
      // Anonymous user - use in-memory conversation
      const conversationHistory = anonymousMessages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }))
      
      sendAnonymousMessageMutation.mutate({
        content,
        conversationHistory,
      })
    } else if (!selectedSessionId) {
      // Authenticated user - create a new session
      createSessionMutation.mutate(
        {
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        },
        {
          onSuccess: (newSession) => {
            // Update message status to sent
            setPendingMessages(prev => 
              prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent' as const } : msg)
            )
            sendMessageMutation.mutate({
              sessionId: newSession.id,
              content,
            })
          },
        }
      )
    } else {
      // Authenticated user - use existing session
      setPendingMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent' as const } : msg)
      )
      sendMessageMutation.mutate({
        sessionId: selectedSessionId,
        content,
      })
    }
  }

  const handleNewSession = () => {
    setSelectedSessionId(null)
    // Clear any pending messages when starting a new session
    setPendingMessages([])
    setIsAiResponding(false)
    
    // For anonymous users, also clear the conversation history
    if (!userSession) {
      setAnonymousMessages([])
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      <div className={cn(
        "flex w-full transition-all duration-300",
        !isSidebarOpen ? "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" : ""
      )}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/10 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
        <div className={cn(
          'bg-white dark:bg-gray-900 border-r transition-all duration-300 ease-in-out shadow-lg',
          isSidebarOpen ? 'w-80 sm:w-80' : 'w-0 overflow-hidden',
          'fixed sm:relative z-50 sm:z-auto h-full',
          // Blue animation effect for mobile
          isSidebarOpen 
            ? 'border-blue-500 shadow-blue-500/20 shadow-2xl sm:border-gray-200 sm:dark:border-gray-800 sm:shadow-lg animate-in slide-in-from-left duration-300' 
            : 'border-gray-200 dark:border-gray-800'
        )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={cn(
            "p-3 border-b transition-all duration-300",
            isSidebarOpen 
              ? "border-blue-200 dark:border-blue-800 sm:border-gray-200 sm:dark:border-gray-800" 
              : "border-gray-200 dark:border-gray-800"
          )}>
            <Link href="/" className="flex items-center justify-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Mentorly
              </h2>
            </Link>
          </div>

          {/* Chat Sessions - Only show for authenticated users */}
          <div className="flex-1 overflow-y-auto">
            {isSidebarOpen && userSession && (
              <ChatSessionList
                selectedSessionId={selectedSessionId || undefined}
                onSelectSession={setSelectedSessionId}
                onNewSession={handleNewSession}
              />
            )}
            {/* Anonymous user message */}
            {isSidebarOpen && !userSession && (
              <div className="p-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Anonymous Mode</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Your conversations are not saved. Sign in to access chat history and save your sessions.</p>
                  <button
                    onClick={() => router.push('/')}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section with Logout */}
          {isSidebarOpen && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-3">
              {userSession ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {(userSession.user.name || userSession.user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {userSession.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userSession.user.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-2">
                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium">
                    Anonymous Mode
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {session?.title || 'Mentorly - Career Growth Platform'}
                  </h1>
                  {session && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.messages.length} messages
                    </p>
                  )}
                </div>
              </div>
          </div>
            <div className="flex items-center flex-shrink-0">
              <ThemeToggle />
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
          {(!selectedSessionId && !userSession && anonymousMessages.length === 0) ? (
            <div className="flex items-center justify-center h-full animate-fadeIn">
              <div className="text-center max-w-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg animate-breathing animate-warm-glow">
                  <svg className="w-6 h-6 text-white animate-gentle-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gradient mb-2">
                  Ready to unlock your career potential? 🚀
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                  Get personalized guidance, expert advice, and actionable insights to accelerate your professional journey!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-human cursor-pointer hover-lift animate-subtle-float" style={{ animationDelay: '0s' }}>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center animate-gentle-pulse">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">💼</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Career Move</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-human cursor-pointer hover-lift animate-subtle-float" style={{ animationDelay: '0.5s' }}>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center animate-gentle-pulse">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">🎯</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Dream Job</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-human cursor-pointer hover-lift animate-subtle-float" style={{ animationDelay: '1s' }}>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center animate-gentle-pulse">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">📈</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Skills</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-human cursor-pointer hover-lift animate-subtle-float" style={{ animationDelay: '1.5s' }}>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center animate-gentle-pulse">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">🤝</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Interviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Render server messages */}
              {/* Render messages based on authentication status */}
              {userSession ? (
                // Authenticated user - show database messages
                session?.messages.map((message, index) => {
                  const isLatestAiMessage = message.role === MessageRole.ASSISTANT && message.id === latestAiMessageId
                  return (
                    <div key={message.id} className="animate-slideIn" style={{ animationDelay: `${index * 0.1}s` }}>
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
              ) : (
                // Anonymous user - show in-memory messages
                anonymousMessages.map((message, index) => {
                  const isLatestAiMessage = message.role === MessageRole.ASSISTANT && message.id === latestAiMessageId
                  return (
                    <div key={message.id} className="animate-slideIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ChatMessage
                        content={message.content}
                        role={message.role}
                        timestamp={message.createdAt}
                        enableTyping={isLatestAiMessage}
                        typingSpeed={25}
                      />
                    </div>
                  )
                })
              )}
              
              {/* Render pending messages (optimistic updates) */}
              {pendingMessages.map((message) => {
                // For authenticated users, check for duplicates with server messages
                // For anonymous users, check for duplicates with in-memory messages
                const isDuplicate = userSession 
                  ? session?.messages?.some(serverMsg => 
                      serverMsg.content === message.content && 
                      serverMsg.role === message.role &&
                      Math.abs(new Date(serverMsg.createdAt).getTime() - message.timestamp.getTime()) < 5000
                    )
                  : anonymousMessages.some(anonMsg => 
                      anonMsg.content === message.content && 
                      anonMsg.role === message.role &&
                      Math.abs(anonMsg.createdAt.getTime() - message.timestamp.getTime()) < 5000
                    )
                
                if (isDuplicate) return null
                
                return (
                  <div key={message.id} className="animate-slideIn">
                    <ChatMessage
                      content={message.content}
                      role={message.role}
                      timestamp={message.timestamp}
                      status={message.status}
                    />
                  </div>
                )
              })}
              
              {/* Show typing indicator when AI is responding */}
              {isAiResponding && (
                <TypingIndicator />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isAiResponding}
          placeholder={selectedSessionId ? "Ask me anything..." : "Ask about your career..."}
        />
      </div>
      </div>
    </div>
  )
}