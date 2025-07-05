'use server'

import { DocuSignClient } from '@/lib/docusign-client'

interface ContractData {
  signerName: string
  signerEmail: string
  contractTitle: string
  contractType?: string
  contractValue?: string
  description?: string
  startDate?: string
  endDate?: string
}

export async function sendContractAction(formData: FormData) {
  try {
    // Extract form data
    const contractData: ContractData = {
      signerName: formData.get('signerName') as string,
      signerEmail: formData.get('signerEmail') as string,
      contractTitle: formData.get('contractTitle') as string,
      contractType: formData.get('contractType') as string,
      contractValue: formData.get('contractValue') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    }

    // Validate required fields
    if (!contractData.signerName || !contractData.signerEmail || !contractData.contractTitle) {
      return { success: false, error: 'Missing required fields' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contractData.signerEmail)) {
      return { success: false, error: 'Invalid email format' }
    }

    // Create DocuSign client
    const docusignClient = new DocuSignClient()

    // Create and send envelope
    const result = await docusignClient.createEnvelope(contractData)

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to create envelope' }
    }

    return {
      success: true,
      envelopeId: result.envelopeId,
      message: 'Contract sent successfully via DocuSign',
    }
  } catch (error) {
    console.error('Error in sendContractAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send contract',
    }
  }
}
