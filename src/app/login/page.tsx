import { AuthForm } from '../../components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='flex min-h-screen'>
        {/* Left Column - Auth Form */}
        <div className='flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12'>
          <div className='w-full max-w-md mx-auto'>
            <AuthForm />
          </div>
        </div>

        {/* Right Column - Promotional Content */}
        <div className='hidden lg:flex flex-1 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden'>
          <div className='flex flex-col justify-center px-12 xl:px-16 text-white relative z-10'>
            <div className='mb-8'>
              <h1 className='text-4xl xl:text-5xl font-bold mb-6 leading-tight'>
                Welcome Back!
                <span className='block'>Continue Your Career Journey</span>
              </h1>

              <p className='text-lg xl:text-xl mb-8 opacity-90'>
                Sign in to access your personalized AI career mentor and continue optimizing your professional growth with intelligent guidance.
              </p>

              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Personalized Career Advice</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Real-time Chat Sessions</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>AI-Powered Insights</span>
                </div>
              </div>
            </div>

            <div className='mt-12'>
              <div className='text-sm font-medium mb-4 opacity-75'>
                POWERED BY ADVANCED TECHNOLOGY
              </div>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Next.js</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Groq AI</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90' />
          <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48' />
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32' />
        </div>
      </div>
    </div>
  )
}
