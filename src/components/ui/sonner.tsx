'use client'

import { useTheme } from 'next-themes'
import type { ToasterProps } from 'sonner';
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        style: {
          background: 'rgb(var(--card))',
          color: 'rgb(var(--card-foreground))',
          border: '1px solid rgb(var(--border))',
          borderRadius: '0.75rem',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        className: 'toast',
      }}
      position='top-right'
      expand={true}
      richColors
      closeButton
      {...props}
    />
  )
}

export { Toaster }
