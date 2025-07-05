'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from '@/hooks/useSession'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isPending) {
      router.push('/api/oauth/login')
    }
  }, [user, isPending, router])

  if (!user && isPending) {
    return null //? or spinner
  }

  if (!user && !isPending) {
    return null //? redirect in progress
  }

  return <>{children}</>
}
