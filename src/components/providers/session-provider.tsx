'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

import { useSession, type Session } from '../../lib/auth-client'

interface SessionContextType {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
  isAuthenticated: false,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending])

  const value = {
    session,
    isLoading,
    isAuthenticated: !!session,
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}

// Protected route wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSessionContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
