import { FileText } from 'lucide-react'
import Link from 'next/link'

import { useSession } from '@/hooks/useSession'

import { cn } from '@/lib/utils'

import { UserMenu } from '@/layout/user-menu'

import { buttonVariants } from '@/components/ui/button'

export const Header = () => {
  const { user } = useSession()

  return (
    <header className="bg-background/30 sticky top-0 left-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">DocuFlow</span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-foreground hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          {!user?.sub && (
            <Link href="/api/oauth/login" className={cn(buttonVariants({ variant: 'outline' }))}>
              Sign In
            </Link>
          )}

          {user?.sub && <UserMenu />}
        </nav>
      </div>
    </header>
  )
}
