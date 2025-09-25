'use client'

import { Moon, Sun } from 'lucide-react'

import { cn } from '../../lib/utils'
import { useTheme } from '../providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-xl',
        'bg-white/90 backdrop-blur-sm border border-gray-200/50',
        'hover:bg-white hover:border-blue-300 hover:shadow-lg',
        'dark:bg-gray-800/90 dark:border-gray-700/50',
        'dark:hover:bg-gray-800 dark:hover:border-blue-600',
        'transition-all duration-300 ease-in-out',
        'shadow-sm hover:shadow-md',
        'group'
      )}
      aria-label='Toggle theme'
    >
      <div className='relative w-5 h-5'>
        <Sun
          className={cn(
            'absolute inset-0 w-5 h-5 text-amber-500',
            'transition-all duration-300 ease-in-out',
            'group-hover:scale-110',
            theme === 'dark'
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 w-5 h-5 text-blue-500',
            'transition-all duration-300 ease-in-out',
            'group-hover:scale-110',
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </div>
    </button>
  )
}
