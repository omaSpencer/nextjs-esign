import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import type { User } from '@/types/user'

import { cn } from '@/lib/utils'

import { UserMenu } from '@/layout/user-menu'

import { buttonVariants } from '@/components/ui/button'

export const AuthButtons = ({ user, isPending }: { user?: User | null; isPending: boolean }) => {
  return (
    <>
      {isPending && (
        <div className="bg-background border-border relative flex size-9 items-center justify-center overflow-hidden rounded-full border">
          <Loader2 className="text-primary size-5 animate-spin" />
        </div>
      )}
      {!user?.sub && !isPending && (
        <Link href="/api/oauth/login" className={cn(buttonVariants({ variant: 'outline' }))}>
          Sign In
        </Link>
      )}
      {user?.sub && <UserMenu />}
    </>
  )
}
