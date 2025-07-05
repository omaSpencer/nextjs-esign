import docusign from 'docusign-esign'

export class DocuSignService {
  private apiClient: docusign.ApiClient
  private accountId: string

  constructor() {
    this.apiClient = new docusign.ApiClient()
    this.accountId = process.env.DOCUSIGN_ACCOUNT_ID || ''

    // Configure base path
    const basePath = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi'
    this.apiClient.setBasePath(basePath)
  }

  async initialize(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      if (!accessToken) {
        return false
      }

      this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)
      return true
    } catch (error) {
      console.error('Failed to initialize DocuSign service:', error)
      return false
    }
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY
      const userId = process.env.DOCUSIGN_USER_ID
      const privateKey = process.env.DOCUSIGN_PRIVATE_KEY

      if (!integrationKey || !userId || !privateKey) {
        throw new Error('Missing DocuSign credentials')
      }

      // Use manual JWT creation instead of SDK's requestJWTUserToken
      const jwt = await this.createJWT(integrationKey, userId, privateKey)
      const accessToken = await this.exchangeJWTForAccessToken(jwt)

      return accessToken
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  private async createJWT(
    integrationKey: string,
    userId: string,
    privateKey: string,
  ): Promise<string> {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com', // Use account.docusign.com for production
      iat: now,
      exp: now + 3600, // 1 hour
      scope: 'signature impersonation',
    }

    // Create JWT manually using base64 encoding
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')

    const crypto = await import('crypto')
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(`${encodedHeader}.${encodedPayload}`)
    const signature = sign.sign(privateKey, 'base64url')

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  private async exchangeJWTForAccessToken(jwt: string): Promise<string | null> {
    try {
      const basePath = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi'
      const oAuthBasePath = basePath.replace('/restapi', '')

      const response = await fetch(`${oAuthBasePath}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OAuth error:', errorText)
        return null
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error exchanging JWT for access token:', error)
      return null
    }
  }

  async createEnvelope(
    envelopeDefinition: docusign.EnvelopeDefinition,
  ): Promise<docusign.EnvelopeSummary | null> {
    try {
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient)
      const result = await envelopesApi.createEnvelope(this.accountId, {
        envelopeDefinition: envelopeDefinition,
      })
      return result
    } catch (error) {
      console.error('Error creating envelope:', error)
      return null
    }
  }

  async getEnvelopeStatus(envelopeId: string): Promise<docusign.Envelope | null> {
    try {
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient)
      const envelope = await envelopesApi.getEnvelope(this.accountId, envelopeId)
      return envelope
    } catch (error) {
      console.error('Error getting envelope status:', error)
      return null
    }
  }

  async listEnvelopes(options?: {
    fromDate?: string
    status?: string
    count?: number
  }): Promise<docusign.EnvelopesInformation | null> {
    try {
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient)
      const envelopes = await envelopesApi.listStatusChanges(this.accountId, {
        fromDate:
          options?.fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: options?.status || 'sent,delivered,completed',
        count: options?.count?.toString() || '10',
      })
      return envelopes
    } catch (error) {
      console.error('Error listing envelopes:', error)
      return null
    }
  }

  async downloadDocument(envelopeId: string, documentId = 'combined'): Promise<Buffer | null> {
    try {
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient)
      const document = await envelopesApi.getDocument(this.accountId, envelopeId, documentId, {})
      return Buffer.from(document, 'binary')
    } catch (error) {
      console.error('Error downloading document:', error)
      return null
    }
  }
}

export function createEnvelopeDefinition(contractData: {
  signerName: string
  signerEmail: string
  contractTitle: string
  contractType?: string
  contractValue?: string
  description?: string
  startDate?: string
  endDate?: string
}): docusign.EnvelopeDefinition {
  // Generate contract document
  const documentContent = generateContractDocument(contractData)
  const documentBase64 = Buffer.from(documentContent).toString('base64')

  // Create document
  const document: docusign.Document = {
    documentBase64: documentBase64,
    name: `${contractData.contractTitle}.html`,
    fileExtension: 'html',
    documentId: '1',
  }

  // Create signer
  const signer: docusign.Signer = {
    email: contractData.signerEmail,
    name: contractData.signerName,
    recipientId: '1',
    routingOrder: '1',
  }

  // Create signature tab
  const signHereTab: docusign.SignHere = {
    anchorString: '**SIGNATURE**',
    anchorUnits: 'pixels',
    anchorXOffset: '20',
    anchorYOffset: '10',
  }

  // Create date tab
  const dateSignedTab: docusign.DateSigned = {
    anchorString: '**DATE**',
    anchorUnits: 'pixels',
    anchorXOffset: '20',
    anchorYOffset: '10',
  }

  // Add tabs to signer
  signer.tabs = {
    signHereTabs: [signHereTab],
    dateSignedTabs: [dateSignedTab],
  }

  // Create recipients
  const recipients: docusign.Recipients = {
    signers: [signer],
  }

  // Create envelope definition
  const envelopeDefinition: docusign.EnvelopeDefinition = {
    emailSubject: `Please sign: ${contractData.contractTitle}`,
    documents: [document],
    recipients: recipients,
    status: 'sent',
  }

  return envelopeDefinition
}

function generateContractDocument(contractData: {
  signerName: string
  signerEmail: string
  contractTitle: string
  contractType?: string
  contractValue?: string
  description?: string
  startDate?: string
  endDate?: string
}): string {
  const currentDate = new Date().toLocaleDateString()

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${contractData.contractTitle}</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 40px; 
                color: #333;
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #007acc;
                padding-bottom: 20px;
            }
            .section { 
                margin-bottom: 25px; 
                padding: 15px;
                background-color: #f9f9f9;
                border-left: 4px solid #007acc;
            }
            .signature-section { 
                margin-top: 50px; 
                border-top: 2px solid #ccc; 
                padding-top: 30px; 
            }
            .signature-line { 
                margin: 30px 0; 
                padding: 20px;
                border: 1px dashed #ccc;
                background-color: #fafafa;
            }
            h1 { color: #007acc; }
            h3 { color: #005580; }
            .contract-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
            }
            .detail-item {
                padding: 10px;
                background-color: white;
                border-radius: 5px;
                border: 1px solid #e0e0e0;
            }
            .detail-label {
                font-weight: bold;
                color: #005580;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${contractData.contractTitle}</h1>
            <p><strong>Contract Date:</strong> ${currentDate}</p>
        </div>
        
        <div class="section">
            <h3>Contract Information</h3>
            <div class="contract-details">
                <div class="detail-item">
                    <div class="detail-label">Contract Type:</div>
                    <div>${contractData.contractType || 'Not specified'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contract Value:</div>
                    <div>${contractData.contractValue || 'Not specified'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Start Date:</div>
                    <div>${contractData.startDate || 'Not specified'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">End Date:</div>
                    <div>${contractData.endDate || 'Not specified'}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h3>Project Description</h3>
            <p>${contractData.description || 'No description provided'}</p>
        </div>
        
        <div class="section">
            <h3>Terms and Conditions</h3>
            <p>This contract is entered into between the parties and is subject to the terms and conditions outlined herein. Both parties agree to fulfill their respective obligations as described in this agreement.</p>
            
            <h4>Key Terms:</h4>
            <ul>
                <li>All work shall be completed in accordance with the specifications outlined above</li>
                <li>Payment terms and schedule as agreed upon by both parties</li>
                <li>Both parties agree to maintain confidentiality of proprietary information</li>
                <li>This agreement shall be governed by applicable local laws</li>
            </ul>
        </div>
        
        <div class="signature-section">
            <h3>Digital Signature Required</h3>
            <div class="signature-line">
                <p><strong>Signer:</strong> ${contractData.signerName}</p>
                <p><strong>Email:</strong> ${contractData.signerEmail}</p>
                <br>
                <p><strong>Digital Signature:</strong> **SIGNATURE**</p>
                <p><strong>Date Signed:</strong> **DATE**</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
                By signing this document electronically, you agree that your electronic signature 
                is the legal equivalent of your manual signature on this document.
            </p>
        </div>
    </body>
    </html>
  `
}
