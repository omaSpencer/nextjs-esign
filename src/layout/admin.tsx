'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CalendarDays, FileText, Mail, Plus, Search, Users } from 'lucide-react'

type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'declined' | 'expired'

interface Contract {
  id: string
  recipientName: string
  recipientEmail: string
  contractType: string
  subject: string
  message: string
  status: ContractStatus
  createdAt: string
  sentAt?: string
  signedAt?: string
}

const statusColors: Record<ContractStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  signed: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
}

const mockContracts: Contract[] = [
  {
    id: '1',
    recipientName: 'John Smith',
    recipientEmail: 'john.smith@example.com',
    contractType: 'Employment Agreement',
    subject: 'Employment Contract - Software Engineer',
    message: 'Please review and sign your employment agreement.',
    status: 'signed',
    createdAt: '2024-01-15T10:30:00Z',
    sentAt: '2024-01-15T10:35:00Z',
    signedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '2',
    recipientName: 'Sarah Johnson',
    recipientEmail: 'sarah.johnson@example.com',
    contractType: 'NDA',
    subject: 'Non-Disclosure Agreement',
    message: 'Please sign the NDA before we proceed with the project discussion.',
    status: 'sent',
    createdAt: '2024-01-16T09:15:00Z',
    sentAt: '2024-01-16T09:20:00Z',
  },
  {
    id: '3',
    recipientName: 'Michael Brown',
    recipientEmail: 'michael.brown@example.com',
    contractType: 'Service Agreement',
    subject: 'Consulting Services Contract',
    message: 'Please review and sign the consulting agreement.',
    status: 'draft',
    createdAt: '2024-01-17T11:45:00Z',
  },
  {
    id: '4',
    recipientName: 'Emily Davis',
    recipientEmail: 'emily.davis@example.com',
    contractType: 'Partnership Agreement',
    subject: 'Business Partnership Contract',
    message: 'Partnership agreement for our upcoming collaboration.',
    status: 'completed',
    createdAt: '2024-01-10T08:00:00Z',
    sentAt: '2024-01-10T08:05:00Z',
    signedAt: '2024-01-12T16:30:00Z',
  },
]

export default function AdminDashboard() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    contractType: '',
    subject: '',
    message: '',
  })

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (contractId: string, newStatus: ContractStatus) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId ? { ...contract, status: newStatus } : contract,
      ),
    )
  }

  const handleCreateContract = async () => {
    if (
      !formData.recipientName ||
      !formData.recipientEmail ||
      !formData.contractType ||
      !formData.subject
    ) {
      alert('Please fill in all required fields')
      return
    }

    const newContract: Contract = {
      id: Date.now().toString(),
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }

    setContracts((prev) => [newContract, ...prev])
    setFormData({
      recipientName: '',
      recipientEmail: '',
      contractType: '',
      subject: '',
      message: '',
    })
    setIsCreateDialogOpen(false)
  }

  const handleSendEnvelope = async (contractId: string) => {
    // Mock DocuSign API call
    console.log('Sending DocuSign envelope for contract:', contractId)

    // Simulate API call
    setTimeout(() => {
      setContracts((prev) =>
        prev.map((contract) =>
          contract.id === contractId
            ? {
                ...contract,
                status: 'sent' as ContractStatus,
                sentAt: new Date().toISOString(),
              }
            : contract,
        ),
      )
      alert('Envelope sent successfully!')
    }, 1000)
  }

  const getStatusCounts = () => {
    const counts = contracts.reduce(
      (acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: contracts.length,
      draft: counts.draft || 0,
      sent: counts.sent || 0,
      signed: counts.signed || 0,
      completed: counts.completed || 0,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DocuSign Dashboard</h1>
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
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contractType: value }))
                    }
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <CalendarDays className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Mail className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Management</CardTitle>
            <CardDescription>View and manage all contract applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center space-x-4">
              <div className="relative max-w-sm flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contracts Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.recipientName}</div>
                          <div className="text-muted-foreground text-sm">
                            {contract.recipientEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contract.contractType}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{contract.subject}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[contract.status]}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {contract.status === 'draft' && (
                            <Button size="sm" onClick={() => handleSendEnvelope(contract.id)}>
                              Send
                            </Button>
                          )}
                          <Select
                            value={contract.status}
                            onValueChange={(value: ContractStatus) =>
                              handleStatusChange(contract.id, value)
                            }
                          >
                            <SelectTrigger className="h-8 w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="signed">Signed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredContracts.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="text-muted-foreground mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No contracts found</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating a new contract.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
