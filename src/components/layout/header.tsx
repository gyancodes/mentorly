'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { signOut } from '@/lib/auth-client'

import { useSessionContext } from '../providers/session-provider'
import { ThemeToggle } from '../ui/theme-toggle'

export function Header() {
  const router = useRouter()
  const { session } = useSessionContext()

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
    <header className='border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
              <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
              </svg>
            </div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>
              Mentorly
            </span>
          </div>

          {/* Right side */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            {/* Show user info and logout only if authenticated */}
            {session && (
              <div className='flex items-center space-x-3'>
                <div className='text-sm text-gray-700 dark:text-gray-300'>
                  <span className='font-medium'>
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className='flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  <LogOut className='w-4 h-4' />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Show anonymous indicator if not authenticated */}
            {!session && (
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                <span className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium'>
                  Anonymous Mode
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
