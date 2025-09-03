export type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'declined' | 'expired'
export type ContractStatusFilter = 'all' | ContractStatus

export interface Contract {
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

export interface CreateContractFormData {
  recipientName: string
  recipientEmail: string
  contractType: string
  subject: string
  message: string
}
