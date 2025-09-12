import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { SessionProvider } from '../components/providers/session-provider'
import { ThemeProvider } from '../components/providers/theme-provider'
import { TRPCProvider } from '../components/providers/trpc-provider'
import { Toaster } from '../components/ui/sonner'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mentorly - AI Career Counselor',
  description:
    'Get personalized career guidance and advice from our AI-powered career counselor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        <ThemeProvider defaultTheme='system'>
          <TRPCProvider>
            <SessionProvider>
              <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20'>
                {children}
              </div>
              <Toaster />
            </SessionProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
