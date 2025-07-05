'use client'

import { Loader2, Send } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContractForm() {
  const router = useRouter()

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
    if (!formData.get('signerName') || !formData.get('signerEmail') || !formData.get('content')) {
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
          <Label htmlFor="signerEmail">Signer Email *</Label>
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

      <div className="space-y-2">
        <Label htmlFor="content">Contract Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Brief content of the contract terms and deliverables..."
          rows={4}
          required
          maxLength={255}
          minLength={32}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
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
