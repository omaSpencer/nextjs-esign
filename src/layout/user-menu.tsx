'use client'

import { FileText, LogOut, User } from 'lucide-react'
import Link from 'next/link'

import { signOut } from '@/app/actions'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const userMenu = [
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    label: 'Contracts',
    href: '/contracts',
    icon: FileText,
  },
  {
    label: 'Sign Out',
    onClick: signOut,
    icon: LogOut,
  },
]

export const UserMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {userMenu.map((item) => (
          <DropdownMenuItem key={item.label}>
            {item.href ? (
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ) : (
              <Button variant="ghost" onClick={item.onClick}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
