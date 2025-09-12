'use client'

import Link from 'next/link'
import { useSessionContext } from '../providers/session-provider'
import { signOut } from '../../lib/auth-client'
import { Button } from '../ui/button'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function Header() {
  const { session } = useSessionContext()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      window.location.href = '/login'
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-2 sm:px-3 py-2 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Mentorly
            </h1>
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            Career Growth Platform
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {isDark ? (
              <Sun className="h-3 w-3" />
            ) : (
              <Moon className="h-3 w-3" />
            )}
          </Button>
          
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 dark:text-gray-300 hidden sm:block">
                {session?.user?.name}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-400 hidden sm:block">
                {session?.user?.email}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="text-xs hidden sm:block">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}