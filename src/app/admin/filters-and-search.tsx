'use client'

import { FileText, Search } from 'lucide-react'

import { type ContractStatusFilter, type Contract, type ContractStatus } from '@/types/contract'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

const statusColors: Record<ContractStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  signed: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
}

export default function FiltersAndSearch({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredContracts,
  handleSendEnvelope,
  handleStatusChange,
}: {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: ContractStatusFilter
  setStatusFilter: (value: ContractStatusFilter) => void
  filteredContracts: Contract[]
  handleSendEnvelope: (contractId: string) => void
  handleStatusChange: (contractId: string, newStatus: ContractStatus | ContractStatusFilter) => void
}) {
  return (
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
                      <div className="text-muted-foreground text-sm">{contract.recipientEmail}</div>
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
  )
}
