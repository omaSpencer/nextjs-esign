'use client'

import { useQuery } from '@tanstack/react-query'

import type { User } from '@/types/user'

export const sessionQueryKey = ['session'] as const

export function useSession() {
  const { data: user, isPending } = useQuery({
    queryKey: sessionQueryKey,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/userinfo`)

      if (!res.ok) {
        return null
      }

      const data = (await res.json()) as User

      return data
    },
    refetchInterval: 1000 * 60 * 5, //? 5 minutes
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  })

  return { user, isPending }
}
