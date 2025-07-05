'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'

const queryClient = new QueryClient()

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>{children}</Suspense>
    </QueryClientProvider>
  )
}
