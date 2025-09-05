'use client'

import { useState } from 'react'

import type {
  Contract,
  ContractStatus,
  ContractStatusFilter,
  CreateContractFormData,
} from '@/types/contract'

import { DefaultLayout } from '@/layout/default'

import AdminHeader from './header'
import StatsCards from './stats-cards'
import FiltersAndSearch from './filters-and-search'

//! TODO: Remove mock contracts
import { mockContracts } from '@/mocks'

export default function AdminDashboard() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [formData, setFormData] = useState<CreateContractFormData>({
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

  const handleStatusChange = (
    contractId: string,
    newStatus: ContractStatus | ContractStatusFilter,
  ) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: newStatus as ContractStatus }
          : contract,
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
    <DefaultLayout>
      <div className="container mx-auto space-y-6 px-4 py-6 md:pb-8 lg:pb-10 xl:pb-12">
        <AdminHeader
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          handleCreateContract={handleCreateContract}
        />

        <StatsCards statusCounts={statusCounts} />

        <FiltersAndSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter as ContractStatusFilter}
          setStatusFilter={setStatusFilter}
          filteredContracts={filteredContracts}
          handleSendEnvelope={handleSendEnvelope}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </DefaultLayout>
  )
}
