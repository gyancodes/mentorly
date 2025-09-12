'use client'

import { Loader2, Mail, Lock, User } from 'lucide-react'
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

  return (
    <div className='w-full'>
      <div className='mb-8'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z' />
            </svg>
          </div>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white text-center mb-2'>
          Welcome Back!
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-center text-sm'>
          Sign in to access your dashboard and continue optimizing your career
          growth.
        </p>
      </div>

      <Card className='w-full border-0 shadow-lg'>
        <CardHeader className='pb-4'>
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
              <form onSubmit={handleLogin} className='space-y-4'>
                <div className='space-y-2'>
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

                <div className='space-y-2'>
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
              </form>
            </TabsContent>

            <TabsContent value='register'>
              <form onSubmit={handleRegister} className='space-y-4'>
                <div className='space-y-2'>
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

                <div className='space-y-2'>
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

                <div className='space-y-2'>
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
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Don&apos;t have an Account?{' '}
          <button
            onClick={() => {
              const registerTab = document.querySelector(
                '[data-value="register"]'
              ) as HTMLElement
              registerTab?.click()
            }}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
