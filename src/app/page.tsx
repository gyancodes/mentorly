'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useSessionContext } from '@/components/providers/session-provider'

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

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
    <div className='min-h-screen bg-white dark:bg-black text-black dark:text-white'>
      {/* Navigation */}
      <nav className='border-b border-black/10 dark:border-white/10 bg-white dark:bg-black sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <motion.div
              className='flex items-center space-x-3'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
              </div>
              <span className='text-lg font-bold tracking-wider'>MENTORLY</span>
            </motion.div>
            <div className='flex items-center space-x-6'>
              {/* Desktop Menu */}
              <motion.div
                className='hidden md:flex items-center space-x-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  onClick={() => router.push('/lessons')}
                  className='text-xs font-medium hover:text-blue-600 transition-colors cursor-pointer tracking-wide'
                >
                  LESSONS
                </button>
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
                <motion.button
                  onClick={() => router.push('/login')}
                  className='px-6 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer tracking-wide'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  GET STARTED
                </motion.button>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='md:hidden p-2 text-black dark:text-white hover:text-blue-600 transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  ) : (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
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
            <motion.div
              className='md:hidden fixed inset-0 bg-black/20 z-40'
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Menu */}
            <motion.div
              className='md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-black/10 dark:border-white/10 z-50 shadow-lg'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className='px-4 py-6 space-y-4'>
                <button
                  onClick={() => {
                    router.push('/lessons')
                    setIsMobileMenuOpen(false)
                  }}
                  className='block w-full text-left text-sm font-medium hover:text-blue-600 transition-colors tracking-wide py-2'
                >
                  LESSONS
                </button>
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
            </motion.div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <section className='min-h-screen py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden'>
          <div className='absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:60px_60px]' />
          <motion.div
            className='absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          >
            <div className='w-full h-full bg-white dark:bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
          </motion.div>
          <div className='max-w-6xl mx-auto relative'>
            <motion.div
              className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div
                className='text-center lg:text-left'
                variants={fadeIn}
              >
                <motion.div
                  className='inline-block px-4 py-2 bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 mb-8 tracking-wider backdrop-blur-sm'
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(37, 99, 235, 0.15)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  INTERVIEWS • CODING • TECH SKILLS
                </motion.div>
                <motion.h1
                  className='text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Ace Your Tech
                  <span className='block text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-500 bg-clip-text'>
                    Interviews & Career
                  </span>
                </motion.h1>
                <motion.p
                  className='text-lg sm:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 text-gray-600 dark:text-gray-300 leading-relaxed'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Master technical interviews, learn coding, and build in-demand tech skills with 
                  AI-powered practice, personalized feedback, and interactive learning paths.
                </motion.p>

                <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8'>
                  <motion.button
                    onClick={handleAnonymousChat}
                    className='group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer tracking-wider text-base overflow-hidden'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200'/>
                    <span className='relative flex items-center'>
                      START SESSION
                      <svg className='w-5 h-5 ml-2 -mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                      </svg>
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={() => router.push('/login')}
                    className='group relative px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-gray-900/10 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-xl hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-white/5 transition-all duration-200 cursor-pointer tracking-wider text-base'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className='absolute inset-0 bg-gray-900 dark:bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-200'/>
                    <span className='relative flex items-center'>
                      JOIN WAITLIST
                      <svg className='w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </svg>
                    </span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div className='relative' variants={fadeIn}>
                <div className='relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-800/50'>
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='relative'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg'>
                        <svg
                          className='w-6 h-6 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                          />
                        </svg>
                      </div>
                      <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900'></div>
                    </div>
                    <div>
                      <span className='font-bold text-lg'>Mentorly AI</span>
                      <div className='text-sm text-green-600 dark:text-green-400'>Online</div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <motion.div 
                      className='bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-2xl shadow-sm'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className='text-sm font-medium'>
                        How can I prepare for technical interviews at top tech companies?
                      </p>
                    </motion.div>

                    <motion.div 
                      className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-2xl shadow-sm'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <p className='text-sm font-medium mb-4'>
                        Based on current industry trends, I recommend focusing on these key areas:
                      </p>
                      <ul className='text-sm space-y-3 pl-5'>
                        <li className='flex items-start'>
                          <svg className='w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span>Data Structures & Algorithms optimization</span>
                        </li>
                        <li className='flex items-start'>
                          <svg className='w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span>System Design principles</span>
                        </li>
                        <li className='flex items-start'>
                          <svg className='w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span>Problem-solving techniques</span>
                        </li>
                      </ul>
                      <p className='text-sm font-medium mt-4 text-blue-600 dark:text-blue-400'>
                        Would you like me to create a personalized interview prep plan?
                      </p>
                    </motion.div>
                  </div>
                  <motion.div 
                    className='mt-4 flex items-center gap-2'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className='flex-1'>
                      <div className='h-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 px-4 flex items-center text-gray-400 dark:text-gray-500'>
                        Type your question here...
                      </div>
                    </div>
                    <button className='h-12 px-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl flex items-center justify-center text-white'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                <div className='absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-2xl opacity-60 -z-10' />
                <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-blue-300 dark:bg-blue-800/30 rounded-full blur-2xl opacity-60 -z-10' />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>
                Tech Interview Prep, <span className='text-blue-600'>Mastered</span>
              </h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Our platform combines AI-powered interview practice, coding challenges, and 
                comprehensive tech learning to help students excel in their interviews.
              </p>
            </motion.div>

            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div
                className='group bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm relative overflow-hidden'
                variants={itemFadeIn}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>
                  Mock Interviews
                </h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Practice with realistic technical interviews, get instant feedback,
                  and master common interview patterns with our AI interviewer.
                </p>
              </motion.div>

              <motion.div
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Coding Practice</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Solve real interview coding problems, learn optimal solutions,
                  and get detailed explanations for data structures and algorithms.
                </p>
              </motion.div>

              <motion.div
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Tech Skills</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Learn in-demand technologies through interactive lessons, hands-on
                  projects, and real-world applications. Perfect for students.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-blue-950/20'>
          <div className='max-w-6xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>
                Powerful <span className='text-blue-600'>Features</span>
              </h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Everything you need to accelerate your growth and achieve your
                career goals.
              </p>
            </motion.div>

            <motion.div
              className='grid grid-cols-1 lg:grid-cols-2 gap-12'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div
                className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
              >
                <div className='p-6'>
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4'>
                      <svg
                        className='w-5 h-5 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold'>Interview Excellence</h3>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Master technical interviews with our comprehensive preparation system. 
                    Practice with AI-powered mock interviews and get detailed feedback to improve.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Technical interview simulation
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Real interview questions
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Detailed performance analysis
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
              >
                <div className='p-6'>
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4'>
                      <svg
                        className='w-5 h-5 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold'>Coding Practice</h3>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Master data structures, algorithms, and coding patterns through 
                    interactive practice sessions and detailed solution explanations.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Algorithm challenges
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Data structure mastery
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg
                        className='w-4 h-4 text-blue-600 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Interactive coding environment
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Upcoming AI Features Section */}
        <section className='py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-blue-100/30 dark:from-transparent dark:via-indigo-950/30 dark:to-blue-900/30' />
          <div className='max-w-6xl mx-auto relative'>
            <motion.div
              className='text-center mb-16'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.div
                className='inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4'
                whileHover={{ scale: 1.05 }}
              >
                <span className='text-sm font-semibold text-indigo-600 dark:text-indigo-400'>Coming Soon</span>
              </motion.div>
              <h2 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400'>
                Next-Gen AI Interview Features
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
                Experience the future of technical interviews with our upcoming AI-powered features
              </p>
            </motion.div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Real-time AI Interview Analysis */}
              <motion.div
                className='group relative bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='relative'>
                  <div className='w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <svg className='w-7 h-7 text-indigo-600 dark:text-indigo-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>Real-time Interview Analysis</h3>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>Get instant feedback on your communication, technical accuracy, and problem-solving approach during mock interviews.</p>
                </div>
              </motion.div>

              {/* Personalized AI Interview Coach */}
              <motion.div
                className='group relative bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='relative'>
                  <div className='w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <svg className='w-7 h-7 text-indigo-600 dark:text-indigo-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>AI Interview Coach</h3>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>Adaptive coaching that learns your strengths and weaknesses to create personalized interview preparation plans.</p>
                </div>
              </motion.div>

              {/* Multi-modal Interview Practice */}
              <motion.div
                className='group relative bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='relative'>
                  <div className='w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <svg className='w-7 h-7 text-indigo-600 dark:text-indigo-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>Virtual Interview Simulator</h3>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>Practice with realistic video interviews, whiteboarding sessions, and system design discussions.</p>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Lessons Teaser */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className='inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 font-medium rounded-full mb-4'>
                Now Available
              </div>
              <h2 className='text-3xl font-bold mb-4'>
                Interactive{' '}
                <span className='text-blue-600'>Coding Lessons</span>
              </h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Learn web development through hands-on, interactive lessons with
                real-time feedback and guidance.
              </p>
            </motion.div>

            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* HTML Card */}
              <motion.div
                className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 group cursor-pointer'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => router.push('/lessons/html-basics')}
              >
                <div className='h-40 bg-gradient-to-r from-orange-400 to-red-500 p-6 flex items-center justify-center'>
                  <svg
                    className='w-16 h-16 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>
                    HTML Fundamentals
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Master the building blocks of web development with
                    interactive HTML lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Start Learning</span>
                    <svg
                      className='w-4 h-4 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* CSS Card */}
              <motion.div
                className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 group'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='h-40 bg-gradient-to-r from-blue-400 to-blue-600 p-6 flex items-center justify-center'>
                  <svg
                    className='w-16 h-16 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>
                    CSS Styling
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Learn to create beautiful, responsive designs with
                    interactive CSS lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Coming Soon</span>
                    <svg
                      className='w-4 h-4 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* JavaScript Card */}
              <motion.div
                className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 group'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='h-40 bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 flex items-center justify-center'>
                  <svg
                    className='w-16 h-16 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                    />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>
                    JavaScript Mastery
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Build dynamic, interactive web applications with JavaScript
                    lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Coming Soon</span>
                    <svg
                      className='w-4 h-4 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
       {/* <section className='py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-blue-950/20'>
          <div className='max-w-6xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>
                What Our <span className='text-blue-600'>Community</span> Says
              </h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Join thousands of professionals accelerating their careers with
                Mentorly.
              </p>
            </motion.div>

            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={staggerContainer}
            >
            
              <motion.div
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4'>
                    <span className='text-blue-600 font-bold'>JD</span>
                  </div>
                  <div>
                    <h4 className='font-bold'>Jane Doe</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Software Engineer
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;Mentorly helped me identify skill gaps I didn&apos;t
                  know I had. The personalized guidance was exactly what I
                  needed to advance in my career.&rdquo;
                </p>
              </motion.div>

             
              <motion.div
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4'>
                    <span className='text-blue-600 font-bold'>JS</span>
                  </div>
                  <div>
                    <h4 className='font-bold'>John Smith</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Product Manager
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;The 24/7 availability of AI mentorship has been a
                  game-changer. I can get guidance whenever I need it, without
                  scheduling constraints.&rdquo;
                </p>
              </motion.div>

             
              <motion.div
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4'>
                    <span className='text-blue-600 font-bold'>AJ</span>
                  </div>
                  <div>
                    <h4 className='font-bold'>Alex Johnson</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      UX Designer
                    </p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;The progress tracking features keep me motivated and
                  focused on my goals. I can clearly see how far I&apos;ve come
                  and what&apos;s next.&rdquo;
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 relative'>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-blue-100/50 dark:from-transparent dark:via-blue-950/20 dark:to-blue-900/30' />
          <motion.div
            className='max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl relative'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className='absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]' />
            <div className='relative p-8 md:p-12 text-center backdrop-blur-sm'>
              <h2 className='text-3xl font-bold text-white mb-4'>
                Ready to Accelerate Your Growth?
              </h2>
              <p className='text-blue-100 mb-8 max-w-2xl mx-auto'>
                Join thousands of professionals using AI-powered mentorship to
                reach their career goals faster.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <motion.button
                  onClick={handleAnonymousChat}
                  className='px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all cursor-pointer tracking-wider text-base shadow-lg hover:shadow-xl backdrop-blur-sm'
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  TRY FOR FREE
                </motion.button>
                <motion.button
                  onClick={() => router.push('/login')}
                  className='px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all cursor-pointer tracking-wider text-base backdrop-blur-sm'
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  JOIN WAITLIST
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-black/10 dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='md:col-span-2'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <span className='text-lg font-bold tracking-wider'>
                  MENTORLY
                </span>
              </div>
              <p className='text-sm font-medium tracking-wide mb-4 max-w-md text-gray-700 dark:text-gray-300'>
                AI-powered interview preparation and tech learning platform designed for 
                students aiming to excel in technical interviews and build successful careers.
              </p>
              <div className='text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400'>
                © 2024 MENTORLY. ALL RIGHTS RESERVED.
              </div>
            </div>

            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>PLATFORM</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300'>
                <li>
                  <button
                    onClick={() => router.push('/docs')}
                    className='hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAnonymousChat}
                    className='hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    Try Free
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className='hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>CONNECT</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300'>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Support
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Community
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-600 transition-colors'>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
