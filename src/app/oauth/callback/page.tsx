'use client'

import { useEffect } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'

import { storeTokens } from '@/app/actions'

import { sessionQueryKey } from '@/hooks/useSession'

import { DefaultLayout } from '@/layout/default'

export default function CallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const code = searchParams.get('code')

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/acg`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      await storeTokens(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey })
      router.push('/')
    },
  })

  if (!code) {
    notFound()
  }

  useEffect(() => {
    if (code && !isPending && !isSuccess) {
      mutate()
    }
  }, [code, isPending, isSuccess, mutate])

  return (
    <DefaultLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <Loader2Icon className="h-10 w-10 animate-spin" />
      </div>
    </DefaultLayout>
  )
}
