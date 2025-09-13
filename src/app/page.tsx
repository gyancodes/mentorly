'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useSessionContext } from '@/components/providers/session-provider'

export default function Home() {
  const router = useRouter()
  const { session, isLoading: sessionLoading } = useSessionContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const handleAnonymousChat = () => {
    router.push('/chat')
  }

  // Handle redirect in useEffect to avoid state update during render
  useEffect(() => {
    if (!sessionLoading && session) {
      router.push('/chat')
    }
  }, [session, sessionLoading, router])

  // Show loading while checking session
  if (sessionLoading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600' />
      </div>
    )
  }

  // If user is authenticated, show loading while redirecting
  if (session) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600' />
      </div>
    )
  }

  // Show landing page with options
  return (
    <div className='min-h-screen bg-white dark:bg-black text-black dark:text-white font-orbitron'>
      {/* Navigation */}
      <nav className='border-b border-black/10 dark:border-white/10 bg-white dark:bg-black'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <span className='text-lg font-bold tracking-wider'>
                MENTORLY
              </span>
            </div>
            <div className='flex items-center space-x-6'>
              {/* Desktop Menu */}
              <div className='hidden md:flex items-center space-x-6'>
                <button
                  onClick={() => router.push('/docs')}
                  className='text-xs font-medium hover:text-blue-600 transition-colors cursor-pointer tracking-wide'
                >
                  DOCS
                </button>
                <button
                  onClick={handleAnonymousChat}
                  className='text-xs font-medium hover:text-blue-600 transition-colors cursor-pointer tracking-wide'
                >
                  TRY FREE
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className='px-6 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer tracking-wide'
                >
                  GET STARTED
                </button>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='md:hidden p-2 text-black dark:text-white hover:text-blue-600 transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  {isMobileMenuOpen ? (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  ) : (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className='md:hidden fixed inset-0 bg-black/20 z-40'
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <div className='md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-black/10 dark:border-white/10 z-50 shadow-lg'>
              <div className='px-4 py-6 space-y-4'>
                <button
                  onClick={() => {
                    router.push('/docs')
                    setIsMobileMenuOpen(false)
                  }}
                  className='block w-full text-left text-sm font-medium hover:text-blue-600 transition-colors tracking-wide py-2'
                >
                  DOCS
                </button>
                <button
                  onClick={() => {
                    handleAnonymousChat()
                    setIsMobileMenuOpen(false)
                  }}
                  className='block w-full text-left text-sm font-medium hover:text-blue-600 transition-colors tracking-wide py-2'
                >
                  TRY FREE
                </button>
                <button
                  onClick={() => {
                    router.push('/login')
                    setIsMobileMenuOpen(false)
                  }}
                  className='block w-full text-left bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors tracking-wide py-3 px-4'
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className='py-32 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto text-center'>
            <div className='inline-block px-4 py-2 border border-blue-600 rounded-full text-sm font-medium text-blue-600 mb-8 tracking-wider'>
              AI • CAREER • FUTURE
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8'>
              ELEVATE YOUR
              <span className='block text-blue-600'>
                CAREER PATH
              </span>
            </h1>
            <p className='text-lg sm:text-xl mb-12 max-w-3xl mx-auto font-medium tracking-wide'>
              Advanced AI mentorship for the next generation of professionals
            </p>

            <div className='flex flex-col sm:flex-row justify-center gap-4 mb-20'>
              <button
                onClick={handleAnonymousChat}
                className='px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer tracking-wider text-base'
              >
                START SESSION
              </button>
              <button
                onClick={() => router.push('/login')}
                className='px-6 py-3 border-2 border-black dark:border-white font-bold rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer tracking-wider text-base'
              >
                JOIN NOW
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-black dark:bg-white text-white dark:text-black'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-2xl sm:text-3xl font-black tracking-tight mb-4'>
                CORE FEATURES
              </h2>
              <p className='text-lg font-medium tracking-wide'>
                Precision-engineered for career acceleration
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <div className='text-center group'>
                <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                  </svg>
                </div>
                <h3 className='text-lg font-bold mb-3 tracking-wide'>
                  AI STRATEGY
                </h3>
                <p className='text-sm font-medium tracking-wide opacity-80'>
                  Intelligent career roadmaps powered by machine learning algorithms
                </p>
              </div>

              <div className='text-center group'>
                <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <h3 className='text-lg font-bold mb-3 tracking-wide'>
                  SKILL MATRIX
                </h3>
                <p className='text-sm font-medium tracking-wide opacity-80'>
                  Real-time skill gap analysis with precision learning paths
                </p>
              </div>

              <div className='text-center group'>
                <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <h3 className='text-lg font-bold mb-3 tracking-wide'>
                  INTERVIEW SIM
                </h3>
                <p className='text-sm font-medium tracking-wide opacity-80'>
                  Advanced simulation technology for interview mastery
                </p>
              </div>

              <div className='text-center group'>
                <div className='w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                  </svg>
                </div>
                <h3 className='text-lg font-bold mb-3 tracking-wide'>
                  DATA INSIGHTS
                </h3>
                <p className='text-sm font-medium tracking-wide opacity-80'>
                  Comprehensive analytics for data-driven career decisions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
              <div>
                <div className='text-3xl font-black text-blue-600 mb-2 tracking-tight'>99%</div>
                <div className='text-sm font-bold tracking-wide'>SUCCESS RATE</div>
              </div>
              <div>
                <div className='text-3xl font-black text-blue-600 mb-2 tracking-tight'>24/7</div>
                <div className='text-sm font-bold tracking-wide'>AI AVAILABILITY</div>
              </div>
              <div>
                <div className='text-3xl font-black text-blue-600 mb-2 tracking-tight'>10K+</div>
                <div className='text-sm font-bold tracking-wide'>PROFESSIONALS</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-black/10 dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='md:col-span-2'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                </div>
                <span className='text-lg font-bold tracking-wider'>
                  MENTORLY
                </span>
              </div>
              <p className='text-sm font-medium tracking-wide mb-4 max-w-md'>
                Next-generation AI mentorship platform designed for ambitious professionals.
              </p>
              <div className='text-xs font-medium tracking-wide opacity-60'>
                © 2024 MENTORLY. ALL RIGHTS RESERVED.
              </div>
            </div>
            
            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>PLATFORM</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide'>
                <li><button onClick={() => router.push('/docs')} className='hover:text-blue-600 transition-colors cursor-pointer'>Documentation</button></li>
                <li><button onClick={handleAnonymousChat} className='hover:text-blue-600 transition-colors cursor-pointer'>Try Free</button></li>
                <li><button onClick={() => router.push('/login')} className='hover:text-blue-600 transition-colors cursor-pointer'>Sign In</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>CONNECT</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide'>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Support</a></li>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Community</a></li>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Updates</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
