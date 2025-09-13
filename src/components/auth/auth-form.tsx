'use client'

import { Loader2, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { signIn, signUp } from '../../lib/auth-client'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn.email({
        email: loginData.email,
        password: loginData.password,
      })

      if (result.error) {
        toast.error(result.error.message || 'Login failed')
      } else {
        toast.success('Welcome back!')
        window.location.href = '/'
      }
    } catch {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signUp.email({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
      })

      if (result.error) {
        toast.error(result.error.message || 'Registration failed')
      } else {
        toast.success('Account created successfully!')
        window.location.href = '/'
      }
    } catch {
      toast.error('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      })
    } catch {
      toast.error('An error occurred during Google sign-in')
    }
  }

  return (
    <div className='w-full p-1 sm:p-2'>
      <div className='mb-8'>
          <div className='flex items-center justify-center mb-2'>
            <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>Mentorly</span>
            </Link>
          </div>

      </div>

      <Card className='w-full border-0 shadow-2xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg font-semibold text-center'>
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='login' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
              <TabsTrigger
                value='login'
                className='data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium'
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value='register'
                className='data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium'
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value='login'>
              <form onSubmit={handleLogin} className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='login-email'>Email</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='login-email'
                      type='email'
                      placeholder='Enter your email'
                      value={loginData.email}
                      onChange={e =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className='pl-10'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='login-password'>Password</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='login-password'
                      type='password'
                      placeholder='Enter your password'
                      value={loginData.password}
                      onChange={e =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className='pl-10'
                      required
                    />
                  </div>
                </div>

                <div className='flex items-center justify-end mb-4'>
                  <button
                    type='button'
                    className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                    onClick={() =>
                      toast.info('Password reset feature coming soon!')
                    }
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className='relative my-4'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t border-gray-300 dark:border-gray-600' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
            </TabsContent>

            <TabsContent value='register'>
              <form onSubmit={handleRegister} className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='register-name'>Name</Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='register-name'
                      type='text'
                      placeholder='Enter your name'
                      value={registerData.name}
                      onChange={e =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                      className='pl-10'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='register-email'>Email</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='register-email'
                      type='email'
                      placeholder='Enter your email'
                      value={registerData.email}
                      onChange={e =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      className='pl-10'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='register-password'>Password</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='register-password'
                      type='password'
                      placeholder='Create a password'
                      value={registerData.password}
                      onChange={e =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      className='pl-10'
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className='relative my-4'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t border-gray-300 dark:border-gray-600' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>


    </div>
  )
}
