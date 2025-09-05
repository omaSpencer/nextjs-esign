import axios from 'axios'

export interface DocuSignEnvelopeRequest {
  signerName: string
  signerEmail: string
  base64PDF: string
  documentName?: string
  emailSubject?: string
  emailBlurb?: string
  customTabs?: DocuSignTab[]
}

export interface DocuSignTab {
  type: 'signHere' | 'dateSigned' | 'text' | 'checkbox'
  anchorString: string
  anchorXOffset?: string
  anchorYOffset?: string
  anchorUnits?: 'pixels' | 'inches' | 'mms'
  documentId?: string
  pageNumber?: string
  tabLabel?: string
  value?: string
}

export interface DocuSignEnvelopeResponse {
  envelopeId: string
  status: string
  signingUrl: string
  message: string
}

interface DocuSignEnvelopeData {
  envelopeId: string
  status: string
}

interface DocuSignSigningUrlData {
  url: string
}

interface OrganizedTabs {
  signHereTabs?: Array<{
    anchorString: string
    anchorXOffset: string
    anchorYOffset: string
    anchorUnits: string
    documentId: string
    pageNumber: string
    tabLabel?: string
  }>
  dateSignedTabs?: Array<{
    anchorString: string
    anchorXOffset: string
    anchorYOffset: string
    anchorUnits: string
    documentId: string
    pageNumber: string
    tabLabel?: string
  }>
  textTabs?: Array<{
    anchorString: string
    anchorXOffset: string
    anchorYOffset: string
    anchorUnits: string
    documentId: string
    pageNumber: string
    tabLabel?: string
    value?: string
  }>
  checkboxTabs?: Array<{
    anchorString: string
    anchorXOffset: string
    anchorYOffset: string
    anchorUnits: string
    documentId: string
    pageNumber: string
    tabLabel?: string
    selected: boolean
  }>
}

export class DocuSignEnvelopeService {
  private accessToken: string
  private accountId: string
  private baseUrl: string

  constructor(accessToken: string, accountId: string, baseUrl: string = 'https://demo.docusign.net/restapi') {
    this.accessToken = accessToken
    this.accountId = accountId
    this.baseUrl = baseUrl
  }

  /**
   * Create a DocuSign envelope with the provided PDF and signature tabs
   */
  async createEnvelope(request: DocuSignEnvelopeRequest): Promise<DocuSignEnvelopeResponse> {
    try {
      // Create envelope definition
      const envelopeDefinition = this.buildEnvelopeDefinition(request)

      // Create the envelope
      const envelopeResponse = await axios.post(
        `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes`,
        envelopeDefinition,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const envelopeData = envelopeResponse.data as DocuSignEnvelopeData
      const envelopeId = envelopeData.envelopeId
      let status = envelopeData.status

      // Send the envelope if it was created
      if (status === 'created') {
        const sendResponse = await axios.put(
          `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}`,
          { status: 'sent' },
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        status = (sendResponse.data as { status?: string }).status || 'sent'
      }

      // Get signing URL for embedded signing
      const signingUrl = await this.getSigningUrl(envelopeId, request.signerEmail, request.signerName)

      return {
        envelopeId,
        status,
        signingUrl,
        message: 'Envelope created successfully',
      }
    } catch (error) {
      // Handle axios errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errorCode?: string } } }
        throw new Error(`DocuSign API error: ${axiosError.response?.data?.errorCode || 'Unknown error'}`)
      }
      throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Build the envelope definition object for DocuSign API
   */
  private buildEnvelopeDefinition(request: DocuSignEnvelopeRequest) {
    const defaultTabs = this.getDefaultSignatureTabs()
    const customTabs = request.customTabs || []
    const allTabs = [...defaultTabs, ...customTabs]

    return {
      emailSubject: request.emailSubject || 'Please sign this document',
      emailBlurb: request.emailBlurb || 'Please review and sign the attached document.',
      documents: [
        {
          documentBase64: request.base64PDF,
          name: request.documentName || 'Document',
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      recipients: {
        signers: [
          {
            email: request.signerEmail,
            name: request.signerName,
            recipientId: '1',
            routingOrder: '1',
            clientUserId: '1000', // Required for embedded signing
            tabs: this.organizeTabs(allTabs),
          },
        ],
      },
      status: 'created', // Use 'created' for embedded signing, then send separately
    }
  }

  /**
   * Get default signature tabs based on common anchor texts in the PDF
   */
  private getDefaultSignatureTabs(): DocuSignTab[] {
    return [
      // Main signature area
      {
        type: 'signHere',
        anchorString: 'Aláírás helye:',
        anchorXOffset: '0',
        anchorYOffset: '20',
        anchorUnits: 'pixels',
        documentId: '1',
        pageNumber: '1',
        tabLabel: 'MainSignature',
      },
    ]
  }

  /**
   * Organize tabs by type for DocuSign API
   */
  private organizeTabs(tabs: DocuSignTab[]): OrganizedTabs {
    const organized: OrganizedTabs = {}

    tabs.forEach((tab) => {
      switch (tab.type) {
        case 'signHere':
          if (!organized.signHereTabs) organized.signHereTabs = []
          organized.signHereTabs.push({
            anchorString: tab.anchorString,
            anchorXOffset: tab.anchorXOffset || '0',
            anchorYOffset: tab.anchorYOffset || '0',
            anchorUnits: tab.anchorUnits || 'pixels',
            documentId: tab.documentId || '1',
            pageNumber: tab.pageNumber || '1',
            tabLabel: tab.tabLabel,
          })
          break
        case 'dateSigned':
          if (!organized.dateSignedTabs) organized.dateSignedTabs = []
          organized.dateSignedTabs.push({
            anchorString: tab.anchorString,
            anchorXOffset: tab.anchorXOffset || '0',
            anchorYOffset: tab.anchorYOffset || '0',
            anchorUnits: tab.anchorUnits || 'pixels',
            documentId: tab.documentId || '1',
            pageNumber: tab.pageNumber || '1',
            tabLabel: tab.tabLabel,
          })
          break
        case 'text':
          if (!organized.textTabs) organized.textTabs = []
          organized.textTabs.push({
            anchorString: tab.anchorString,
            anchorXOffset: tab.anchorXOffset || '0',
            anchorYOffset: tab.anchorYOffset || '0',
            anchorUnits: tab.anchorUnits || 'pixels',
            documentId: tab.documentId || '1',
            pageNumber: tab.pageNumber || '1',
            tabLabel: tab.tabLabel,
            value: tab.value,
          })
          break
        case 'checkbox':
          if (!organized.checkboxTabs) organized.checkboxTabs = []
          organized.checkboxTabs.push({
            anchorString: tab.anchorString,
            anchorXOffset: tab.anchorXOffset || '0',
            anchorYOffset: tab.anchorYOffset || '0',
            anchorUnits: tab.anchorUnits || 'pixels',
            documentId: tab.documentId || '1',
            pageNumber: tab.pageNumber || '1',
            tabLabel: tab.tabLabel,
            selected: false,
          })
          break
      }
    })

    return organized
  }

  /**
   * Get signing URL for embedded signing
   */
  private async getSigningUrl(envelopeId: string, signerEmail: string, signerName: string): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}/views/recipient`,
      {
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/after-signing`,
        authenticationMethod: 'none',
        email: signerEmail,
        userName: signerName,
        clientUserId: '1000', // Embedded signing
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const signingUrlData = response.data as DocuSignSigningUrlData
    return signingUrlData.url
  }

  /**
   * Get envelope status
   */
  async getEnvelopeStatus(envelopeId: string): Promise<Record<string, unknown>> {
    const response = await axios.get(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    )

    return response.data as Record<string, unknown>
  }

  /**
   * List all envelopes for the account
   */
  async listEnvelopes(fromDate?: string, toDate?: string): Promise<Record<string, unknown>> {
    let url = `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes`
    const params = new URLSearchParams()
    
    if (fromDate) params.append('from_date', fromDate)
    if (toDate) params.append('to_date', toDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    return response.data as Record<string, unknown>
  }
}
