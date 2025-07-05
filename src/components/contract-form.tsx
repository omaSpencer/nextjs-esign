'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import { sendContractAction } from '@/app/actions'

export function ContractForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await sendContractAction(formData)

      if (result.success) {
        setIsSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 3000)
      } else {
        alert(result.error || 'Failed to send contract')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while sending the contract')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="text-primary mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Contract Sent Successfully!
          </h3>
          <p className="text-primary">
            The contract has been sent via DocuSign. The signer will receive an email shortly.
          </p>
        </CardContent>
      </Card>
    )
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractTitle">Contract Title *</Label>
        <Input
          id="contractTitle"
          name="contractTitle"
          placeholder="Service Agreement - Web Development"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Select name="contractType" disabled={isSubmitting}>
            <SelectTrigger className="w-full max-w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Service Agreement</SelectItem>
              <SelectItem value="employment">Employment Contract</SelectItem>
              <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
              <SelectItem value="consulting">Consulting Agreement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractValue">Contract Value</Label>
          <Input
            id="contractValue"
            name="contractValue"
            placeholder="$5,000"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Contract Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the contract terms and deliverables..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" disabled={isSubmitting} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" disabled={isSubmitting} />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Contract...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send for Signature
          </>
        )}
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        By clicking &quot;Send for Signature&quot;, you agree to our Terms of Service and Privacy
        Policy. The contract will be sent via DocuSign for secure digital signature.
      </p>
    </form>
  )
}
