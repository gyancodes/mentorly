'use client'

import { trpc } from '../../lib/trpc-client'
import { cn } from '../../lib/utils'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ChatSessionListProps {
  selectedSessionId?: string
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
}

export function ChatSessionList({
  selectedSessionId,
  onSelectSession,
  onNewSession,
}: ChatSessionListProps) {
  const { data: sessions, isLoading, error, refetch } = trpc.chat.getSessions.useQuery({})
  const utils = trpc.useUtils()
  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: (_, variables) => {
      toast.dismiss(`delete-${variables.sessionId}`)
      toast.success('Chat deleted successfully')
      refetch()
    },
    onError: (error, variables) => {
      toast.dismiss(`delete-${variables.sessionId}`)
      toast.error('Failed to delete chat')
      console.error('Delete session error:', error)
      refetch() // Refresh to restore the session in case of optimistic update
    },
  })





  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent session selection when clicking delete
    
    toast('Are you sure you want to delete this chat session?', {
      action: {
        label: 'Delete',
        onClick: () => {
          // Show immediate feedback first
          toast.loading('Deleting chat...', { id: `delete-${sessionId}` })
          
          // Small delay before optimistic update to ensure toast is visible
          setTimeout(() => {
            // Optimistic update - remove from UI after toast is shown
            utils.chat.getSessions.setData({}, (oldData) => {
              if (!oldData) return oldData
              return oldData.filter(session => session.id !== sessionId)
            })
          }, 100)
          
          deleteSessionMutation.mutate({ sessionId })
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      }
    })
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewSession}
          className="w-full group flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New chat</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {sessions?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <p className="font-medium mb-1">No conversations yet</p>
            <p className="text-sm">Start your first chat to begin!</p>
          </div>
        ) : (
          sessions?.map((session, index) => {
            const lastMessage = session.messages && session.messages.length > 0 ? session.messages[0] : null
            const isSelected = session.id === selectedSessionId

            return (
              <div
                key={session.id}
                className="animate-slideIn relative"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={cn(
                  'relative w-full rounded-lg border transition-all duration-200 group',
                  isSelected
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}>
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="w-full text-left p-3 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Session Icon */}
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-500'
                      )}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                        </svg>
                      </div>

                      {/* Session Content */}
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            'font-medium text-xs truncate',
                            isSelected
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-900 dark:text-gray-100'
                          )}>
                            {session.title || 'Untitled Chat'}
                          </h3>
                          <span className={cn(
                            'text-xs px-1.5 py-0.5 rounded text-xs',
                            isSelected
                              ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                          )}>
                            {session._count?.messages || 0}
                          </span>
                        </div>
                      
                        {lastMessage && (
                          <p className={cn(
                            'text-xs truncate mb-1',
                            isSelected
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-gray-500 dark:text-gray-400'
                          )}>
                            {lastMessage.content.substring(0, 80)}...
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            'text-xs font-medium',
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 dark:text-gray-500'
                          )}>
                            {format(new Date(session.updatedAt), 'MMM d, HH:mm')}
                          </span>
                          
                          {isSelected && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button positioned absolutely */}
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="absolute top-2 right-2 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
      

    </div>
  )
}