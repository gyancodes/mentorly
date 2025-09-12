import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation - Mentorly',
  description: 'Technical documentation and overview for the Mentorly AI-powered career mentorship platform.',
}

export default function DocsPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Navigation */}
      <nav className='border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-7 h-7 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center'>
                <svg
                  className='w-3.5 h-3.5 text-white dark:text-gray-900'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
                </svg>
              </div>
              <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                Mentorly
              </span>
            </Link>
            <div className='flex items-center space-x-3'>
              <Link
                href='/'
                className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              >
                Home
              </Link>
              <Link
                href='/chat'
                className='px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100'
              >
                Try Chat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
              Documentation
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Technical overview for the Mentorly platform.
            </p>
          </div>

          <div className='prose prose-gray dark:prose-invert max-w-none'>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Architecture
              </h2>
              <div className='mb-4'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Modern full-stack TypeScript application with Next.js foundation.
                </p>
              </div>

              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• Next.js 15.5.3 with App Router</li>
                <li>• React 19.1.0 with TypeScript</li>
                <li>• Tailwind CSS styling</li>
                <li>• tRPC for type-safe APIs</li>
                <li>• Prisma ORM with PostgreSQL</li>
                <li>• Better Auth authentication</li>
                <li>• Groq AI integration</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Key Components
              </h2>
              <div className='space-y-3'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-white'>Authentication</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Better Auth with multiple providers and session management</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-white'>Chat System</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Real-time interface with message persistence</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-white'>AI Integration</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Groq AI for fast responses and career guidance</p>
                </div>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Database</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>PostgreSQL with Prisma ORM for type-safe database operations.</p>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• User management and authentication</li>
                <li>• Chat sessions and message history</li>
                <li>• Account linking for OAuth providers</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>API Layer</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>tRPC for type-safe API communication:</p>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• Chat router for conversation management</li>
                <li>• Auth router for user operations</li>
                <li>• Full TypeScript integration</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Project Structure</h2>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• <code>src/app/</code> - Next.js App Router pages</li>
                <li>• <code>src/components/</code> - React components</li>
                <li>• <code>src/lib/</code> - Utility libraries and configurations</li>
                <li>• <code>src/server/</code> - tRPC routers and server code</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Development</h2>
              <div className='text-sm text-gray-600 dark:text-gray-400 space-y-2'>
                <p>1. Install dependencies: <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>npm install</code></p>
                <p>2. Set up database: <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>npx prisma db push</code></p>
                <p>3. Start development: <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>npm run dev</code></p>
              </div>
            </section>

            <section>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Environment Variables</h2>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• <code>DATABASE_URL</code> - PostgreSQL connection string</li>
                <li>• <code>BETTER_AUTH_SECRET</code> - Authentication secret key</li>
                <li>• <code>GROQ_API_KEY</code> - AI service API key</li>
              </ul>
            </section>


          </div>
        </div>
      </main>
    </div>
  )
}