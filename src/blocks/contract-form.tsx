'use client'

import { Loader2, Send } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useSession } from '@/hooks/useSession'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ContractForm() {
  const router = useRouter()
  const { user } = useSession()

  const { mutate: createEnvelope, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/envelope', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Failed to create envelope')
      }

      return res.json()
    },
    onSuccess: (data: { url: string }) => {
      router.push(`/envelope?url=${data.url}`)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  async function handleSubmit(formData: FormData) {
    if (!formData.get('signerName') || !formData.get('signerEmail')) {
      return
    }

    createEnvelope(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signerName">Signer Name *</Label>
          <Input
            id="signerName"
            name="signerName"
            placeholder="John Doe"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signerEmail">Email *</Label>
          <Input
            id="signerEmail"
            name="signerEmail"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending || !user?.sub}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Send for Signature
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        By clicking &quot;Send for Signature&quot;, you agree to our Terms of Service and Privacy
        Policy. The contract will be sent via DocuSign for secure digital signature.
      </p>
    </form>
  )
}
