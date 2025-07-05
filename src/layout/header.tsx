import { FileText } from 'lucide-react'
import Link from 'next/link'

import { useSession } from '@/hooks/useSession'

import { AuthButtons } from './auth-buttons'

export const Header = () => {
  const { user, isPending } = useSession()

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

          <AuthButtons user={user} isPending={isPending} />
        </nav>
      </div>
    </header>
  )
}
