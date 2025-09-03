'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { Plus } from 'lucide-react'

import { type CreateContractFormData } from '@/types/contract'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function AdminHeader({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  formData,
  setFormData,
  handleCreateContract,
}: {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  formData: CreateContractFormData
  setFormData: Dispatch<SetStateAction<CreateContractFormData>>
  handleCreateContract: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage contracts and track signing status</p>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
            <DialogDescription>
              Fill out the contract details to create a new DocuSign envelope.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, recipientName: e.target.value }))
                  }
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, recipientEmail: e.target.value }))
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type *</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, contractType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employment Agreement">Employment Agreement</SelectItem>
                  <SelectItem value="NDA">Non-Disclosure Agreement</SelectItem>
                  <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                  <SelectItem value="Partnership Agreement">Partnership Agreement</SelectItem>
                  <SelectItem value="Freelance Contract">Freelance Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Please sign your contract"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Email Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Please review and sign the attached contract..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContract}>Create Contract</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
