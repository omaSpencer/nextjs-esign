'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'

import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient()

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>{children}</Suspense>

      <Toaster />
    </QueryClientProvider>
  )
}
