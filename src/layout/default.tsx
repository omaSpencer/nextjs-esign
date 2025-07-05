'use client'

import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

import { Header } from '@/layout/header'
import { Footer } from '@/layout/footer'

export const DefaultLayout = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string
}>) => {
  return (
    <main className={cn('relative', className)}>
      <Header />
      {children}
      <Footer />
    </main>
  )
}
