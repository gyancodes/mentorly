import { AuthForm } from '../../components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='flex min-h-screen'>
        {/* Left Column - Auth Form */}
        <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24'>
          <div className='w-full max-w-sm mx-auto'>
            <AuthForm />
          </div>
        </div>

        {/* Right Column - Promotional Content */}
        <div className='hidden lg:flex flex-1 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden'>
          <div className='flex flex-col justify-center px-12 xl:px-16 text-white relative z-10'>
            <div className='mb-8'>
              <h1 className='text-4xl xl:text-5xl font-bold mb-6 leading-tight'>
                Revolutionize Your Career with
                <span className='block'>Smarter AI Guidance</span>
              </h1>

              <blockquote className='text-lg xl:text-xl mb-8 opacity-90 italic'>
                &ldquo;Mentorly has completely transformed my career planning
                process. It&apos;s reliable, efficient, and ensures my
                professional growth is always top-notch.&rdquo;
              </blockquote>

              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z' />
                  </svg>
                </div>
                <div>
                  <div className='font-semibold'>Sarah Johnson</div>
                  <div className='text-sm opacity-75'>
                    Software Engineer at TechCorp
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-12'>
              <div className='text-sm font-medium mb-4 opacity-75'>
                JOIN 10K+ PROFESSIONALS
              </div>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>LinkedIn</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Indeed</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-white/20 rounded flex items-center justify-center'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                    </svg>
                  </div>
                  <span className='text-sm font-medium'>Glassdoor</span>
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
