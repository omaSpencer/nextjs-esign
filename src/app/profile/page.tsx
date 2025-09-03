'use client'

import { notFound } from 'next/navigation'

import { useSession } from '@/hooks/useSession'

import { DefaultLayout } from '@/layout/default'

import UserInfoForm from '@/blocks/user-info-form'

export default function ProfilePage() {
  const { user, isPending } = useSession()

  if (isPending) {
    return null
  }

  if (!user?.sub && !isPending) {
    notFound()
  }

  return (
    <DefaultLayout>
      <UserInfoForm {...user!} />
    </DefaultLayout>
  )
}
