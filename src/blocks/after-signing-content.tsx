'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

export default function AfterSigningContent() {
  return (
    <div className="mx-auto max-w-2xl py-6 lg:py-10 xl:py-16">
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="pb-4 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-foreground text-2xl font-bold">
            Document Signed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-foreground text-lg">
            Thank you for signing the document. The contract has been completed and all parties will
            receive a copy.
          </p>

          <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
            Create New Contract
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
