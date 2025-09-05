'use client'

import { useState } from 'react'

import { DefaultLayout } from '@/layout/default'

import { ProgressIndicator } from './progress-indicator'
import { PersonalDetails } from './personal-details'
import { MetaDetails } from './meta-details'
import { ContractFooter } from './footer'

export default function ESignForm() {
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const [contractDetails, setContractDetails] = useState({
    contractType: 'Service Agreement',
    startDate: '',
    endDate: '',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleContractChange = (field: string, value: string) => {
    setContractDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Mock submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert('Document sent for signing via DocuSign!')
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator />

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <PersonalDetails
            personalDetails={personalDetails}
            handlePersonalChange={handlePersonalChange}
          />

          <MetaDetails
            contractDetails={contractDetails}
            handleContractChange={handleContractChange}
          />
        </div>

        <ContractFooter
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          personalDetails={personalDetails}
        />
      </div>
    </DefaultLayout>
  )
}
