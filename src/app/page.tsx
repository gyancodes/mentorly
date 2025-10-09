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
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
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
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <span className='text-lg font-bold tracking-wider'>
                MENTORLY
              </span>
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
        {/* Hero Section - Background Image Only */}
        <section 
          className='w-full h-screen bg-cover bg-center bg-no-repeat bg-fixed'
          style={{ backgroundImage: 'url(/bg.png)' }}
        >
          {/* Responsive background image only */}
        </section>

        {/* COMMENTED OUT HERO CONTENT - UNCOMMENT WHEN NEEDED
        <section 
          className='py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/bg.png)' }}
        >
          <div className='max-w-6xl mx-auto'>
            <motion.div 
              className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className='text-center lg:text-left' variants={fadeIn}>
                <motion.div 
                  className='inline-block px-4 py-2 border border-blue-600 rounded-full text-sm font-medium text-blue-600 mb-8 tracking-wider'
                  whileHover={{ scale: 1.05 }}
                >
                  AI • GROWTH • MENTORSHIP
                </motion.div>
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6'>
                  AI-Powered
                  <span className='block text-blue-600'>
                    Growth Mentorship
                  </span>
                </h1>
                <p className='text-lg sm:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 text-gray-700 dark:text-gray-300'>
                  Connect with AI mentors, track your progress, and accelerate your learning with personalized guidance and interactive coding lessons.
                </p>

                <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8'>
                  <motion.button
                    onClick={handleAnonymousChat}
                    className='px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer tracking-wider text-base'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    START SESSION
                  </motion.button>
                  <motion.button
                    onClick={() => router.push('/login')}
                    className='px-6 py-3 border-2 border-black dark:border-white font-bold rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer tracking-wider text-base'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    JOIN WAITLIST
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div 
                className='relative'
                variants={fadeIn}
              >
                <div className='relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
                  <div className='flex items-center space-x-3 mb-6'>
                    <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                      </svg>
                    </div>
                    <span className='font-bold'>Mentorly AI</span>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
                      <p className='text-sm'>How can I improve my web development skills?</p>
                    </div>
                    
                    <div className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg'>
                      <p className='text-sm'>Based on your goals, I recommend focusing on these three areas:</p>
                      <ul className='text-sm mt-2 space-y-1 list-disc pl-5'>
                        <li>Modern JavaScript frameworks (React, Vue)</li>
                        <li>API development and integration</li>
                        <li>Responsive design principles</li>
                      </ul>
                      <p className='text-sm mt-2'>Would you like me to create a personalized learning path?</p>
                    </div>
                  </div>
                </div>
                
                <div className='absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-2xl opacity-60 -z-10' />
                <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-blue-300 dark:bg-blue-800/30 rounded-full blur-2xl opacity-60 -z-10' />
              </motion.div>
            </motion.div>
          </div>
        </section>
        */}

        {/* About Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <motion.div 
              className='text-center mb-16'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>AI Mentorship, <span className='text-blue-600'>Simplified</span></h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Our platform combines artificial intelligence with proven growth methodologies to provide personalized mentorship at scale.
              </p>
            </motion.div>
            
            <motion.div 
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div 
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Personalized Guidance</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Our AI analyzes your skills, goals, and learning style to create customized growth plans that evolve with you.
                </p>
              </motion.div>
              
              <motion.div 
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Progress Tracking</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Monitor your development with detailed analytics and insights that highlight strengths and areas for improvement.
                </p>
              </motion.div>
              
              <motion.div 
                className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'
                variants={itemFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>24/7 Availability</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  Access mentorship whenever you need it, with no scheduling constraints or time zone limitations.
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>Powerful <span className='text-blue-600'>Features</span></h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Everything you need to accelerate your growth and achieve your career goals.
              </p>
            </motion.div>
            
            <motion.div 
              className='grid grid-cols-1 lg:grid-cols-2 gap-12'
              initial="hidden"
              whileInView="visible"
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
                      <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold'>Growth Mentorship</h3>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Receive personalized career advice, skill development recommendations, and strategic guidance from AI mentors trained on industry best practices.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Career path optimization
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Skill gap analysis
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Personalized learning recommendations
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
                      <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold'>Progress Tracking</h3>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Visualize your growth journey with comprehensive analytics and milestone tracking to stay motivated and focused on your goals.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Skill development metrics
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Goal achievement tracking
                    </li>
                    <li className='flex items-center text-sm text-gray-700 dark:text-gray-300'>
                      <svg className='w-4 h-4 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Visual progress dashboards
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Lessons Teaser */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <motion.div 
              className='text-center mb-16'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className='inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 font-medium rounded-full mb-4'>
                Now Available
              </div>
              <h2 className='text-3xl font-bold mb-4'>Interactive <span className='text-blue-600'>Coding Lessons</span></h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Learn web development through hands-on, interactive lessons with real-time feedback and guidance.
              </p>
            </motion.div>
            
            <motion.div 
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              initial="hidden"
              whileInView="visible"
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
                  <svg className='w-16 h-16 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>HTML Fundamentals</h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Master the building blocks of web development with interactive HTML lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Start Learning</span>
                    <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
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
                  <svg className='w-16 h-16 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>CSS Styling</h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Learn to create beautiful, responsive designs with interactive CSS lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Coming Soon</span>
                    <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
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
                  <svg className='w-16 h-16 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                  </svg>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors'>JavaScript Mastery</h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    Build dynamic, interactive web applications with JavaScript lessons.
                  </p>
                  <div className='flex items-center text-blue-600'>
                    <span className='text-sm font-medium'>Coming Soon</span>
                    <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-blue-950/20'>
          <div className='max-w-6xl mx-auto'>
            <motion.div 
              className='text-center mb-16'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className='text-3xl font-bold mb-4'>What Our <span className='text-blue-600'>Community</span> Says</h2>
              <p className='text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto'>
                Join thousands of professionals accelerating their careers with Mentorly.
              </p>
            </motion.div>
            
            <motion.div 
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Testimonial 1 */}
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
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Software Engineer</p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;Mentorly helped me identify skill gaps I didn&apos;t know I had. The personalized guidance was exactly what I needed to advance in my career.&rdquo;
                </p>
              </motion.div>
              
              {/* Testimonial 2 */}
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
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Product Manager</p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;The 24/7 availability of AI mentorship has been a game-changer. I can get guidance whenever I need it, without scheduling constraints.&rdquo;
                </p>
              </motion.div>
              
              {/* Testimonial 3 */}
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
                    <p className='text-sm text-gray-600 dark:text-gray-400'>UX Designer</p>
                  </div>
                </div>
                <p className='text-gray-700 dark:text-gray-300 italic'>
                  &ldquo;The progress tracking features keep me motivated and focused on my goals. I can clearly see how far I&apos;ve come and what&apos;s next.&rdquo;
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8'>
          <motion.div 
            className='max-w-4xl mx-auto bg-blue-600 rounded-2xl overflow-hidden shadow-xl'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className='p-8 md:p-12 text-center'>
              <h2 className='text-3xl font-bold text-white mb-4'>Ready to Accelerate Your Growth?</h2>
              <p className='text-blue-100 mb-8 max-w-2xl mx-auto'>
                Join thousands of professionals using AI-powered mentorship to reach their career goals faster.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <motion.button
                  onClick={handleAnonymousChat}
                  className='px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors cursor-pointer tracking-wider text-base'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  TRY FOR FREE
                </motion.button>
                <motion.button
                  onClick={() => router.push('/login')}
                  className='px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer tracking-wider text-base'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                </div>
                <span className='text-lg font-bold tracking-wider'>
                  MENTORLY
                </span>
              </div>
              <p className='text-sm font-medium tracking-wide mb-4 max-w-md text-gray-700 dark:text-gray-300'>
                AI-powered growth mentorship platform designed for ambitious professionals seeking to accelerate their career development.
              </p>
              <div className='text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400'>
                © 2024 MENTORLY. ALL RIGHTS RESERVED.
              </div>
            </div>
            
            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>PLATFORM</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300'>
                <li><button onClick={() => router.push('/docs')} className='hover:text-blue-600 transition-colors cursor-pointer'>Documentation</button></li>
                <li><button onClick={handleAnonymousChat} className='hover:text-blue-600 transition-colors cursor-pointer'>Try Free</button></li>
                <li><button onClick={() => router.push('/login')} className='hover:text-blue-600 transition-colors cursor-pointer'>Sign In</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className='text-sm font-bold mb-4 tracking-wide'>CONNECT</h4>
              <ul className='space-y-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300'>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Support</a></li>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Community</a></li>
                <li><a href='#' className='hover:text-blue-600 transition-colors'>Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
