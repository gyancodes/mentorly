'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'

import { trpc } from '../../lib/trpc-client'

function getBaseUrl() {
  if (typeof window !== 'undefined') {return ''}
  if (process.env.VERCEL_URL) {return `https://${process.env.VERCEL_URL}`}
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent aggressive refetching that causes auto-refresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false, // Prevent refetch on window focus
        refetchOnReconnect: false, // Prevent refetch on reconnect
        refetchOnMount: false, // Prevent refetch on component mount
        retry: 1, // Reduce retry attempts
      },
      mutations: {
        retry: 1, // Reduce retry attempts for mutations
      },
    },
  }))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
