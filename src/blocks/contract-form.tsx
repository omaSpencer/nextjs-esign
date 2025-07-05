'use client'

import { Send } from 'lucide-react'

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

export default function ContractForm() {
  async function handleSubmit(formData: FormData) {
    console.log(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signerName">Signer Name *</Label>
          <Input id="signerName" name="signerName" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signerEmail">Signer Email *</Label>
          <Input
            id="signerEmail"
            name="signerEmail"
            type="email"
            placeholder="john@example.com"
            required
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
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Select name="contractType">
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
          <Input id="contractValue" name="contractValue" placeholder="$5,000" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Contract Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the contract terms and deliverables..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Send className="mr-2 h-4 w-4" />
        Send for Signature
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        By clicking &quot;Send for Signature&quot;, you agree to our Terms of Service and Privacy
        Policy. The contract will be sent via DocuSign for secure digital signature.
      </p>
    </form>
  )
}
