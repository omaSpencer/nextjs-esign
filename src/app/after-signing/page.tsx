import { Suspense } from 'react'
import AfterSigningContent from '@/blocks/after-signing-content'

export default function AfterSigningPage() {
  return (
    <div className="from-primary to-background min-h-screen bg-gradient-to-br">
      <Suspense
        fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
      >
        <AfterSigningContent />
      </Suspense>
    </div>
  )
}
