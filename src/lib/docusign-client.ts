interface DocuSignConfig {
  integrationKey: string
  userId: string
  accountId: string
  privateKey: string
  baseUrl: string
}

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

export class DocuSignClient {
  private config: DocuSignConfig
  private accessToken: string | null = null

  constructor() {
    this.config = {
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
      userId: process.env.DOCUSIGN_USER_ID || '',
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY || '',
      baseUrl: process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi',
    }
  }

  private validateConfig(): boolean {
    return !!(
      this.config.integrationKey &&
      this.config.userId &&
      this.config.accountId &&
      this.config.privateKey
    )
  }

  private async createJWT(): Promise<string> {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: this.config.integrationKey,
      sub: this.config.userId,
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
    const signature = sign.sign(this.config.privateKey, 'base64url')

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      if (!this.validateConfig()) {
        throw new Error('Missing DocuSign configuration')
      }

      const jwt = await this.createJWT()
      const oAuthUrl = this.config.baseUrl.replace('/restapi', '/oauth/token')

      const response = await fetch(oAuthUrl, {
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
        throw new Error(`OAuth failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  async createEnvelope(
    contractData: ContractData,
  ): Promise<{ success: boolean; envelopeId?: string; error?: string }> {
    try {
      // Get access token
      const token = await this.getAccessToken()
      if (!token) {
        return { success: false, error: 'Failed to authenticate with DocuSign' }
      }

      // Create envelope definition
      const envelopeDefinition = this.createEnvelopeDefinition(contractData)

      // Send request to DocuSign API
      const response = await fetch(
        `${this.config.baseUrl}/v2.1/accounts/${this.config.accountId}/envelopes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(envelopeDefinition),
        },
      )

      if (!response.ok) {
        const errorData = await response.text()
        console.error('DocuSign API Error:', errorData)
        return { success: false, error: 'Failed to create envelope' }
      }

      const result = await response.json()
      return {
        success: true,
        envelopeId: result.envelopeId,
      }
    } catch (error) {
      console.error('Error creating envelope:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private createEnvelopeDefinition(contractData: ContractData) {
    const documentContent = this.generateContractDocument(contractData)
    const documentBase64 = Buffer.from(documentContent).toString('base64')

    return {
      emailSubject: `Please sign: ${contractData.contractTitle}`,
      documents: [
        {
          documentBase64: documentBase64,
          name: `${contractData.contractTitle}.html`,
          fileExtension: 'html',
          documentId: '1',
        },
      ],
      recipients: {
        signers: [
          {
            email: contractData.signerEmail,
            name: contractData.signerName,
            recipientId: '1',
            routingOrder: '1',
            tabs: {
              signHereTabs: [
                {
                  anchorString: '**SIGNATURE**',
                  anchorUnits: 'pixels',
                  anchorXOffset: '20',
                  anchorYOffset: '10',
                },
              ],
              dateSignedTabs: [
                {
                  anchorString: '**DATE**',
                  anchorUnits: 'pixels',
                  anchorXOffset: '20',
                  anchorYOffset: '10',
                },
              ],
            },
          },
        ],
      },
      status: 'sent',
    }
  }

  private generateContractDocument(contractData: ContractData): string {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getEnvelopeStatus(envelopeId: string): Promise<any> {
    try {
      const token = await this.getAccessToken()
      if (!token) {
        throw new Error('Failed to authenticate')
      }

      const response = await fetch(
        `${this.config.baseUrl}/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to get envelope status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting envelope status:', error)
      return null
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.validateConfig()) {
        return {
          success: false,
          message: 'Missing DocuSign configuration',
          details: {
            hasIntegrationKey: !!this.config.integrationKey,
            hasUserId: !!this.config.userId,
            hasAccountId: !!this.config.accountId,
            hasPrivateKey: !!this.config.privateKey,
          },
        }
      }

      const token = await this.getAccessToken()
      if (!token) {
        return {
          success: false,
          message: 'Failed to authenticate with DocuSign',
        }
      }

      // Test API call - get account info
      const response = await fetch(
        `${this.config.baseUrl}/v2.1/accounts/${this.config.accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        return {
          success: false,
          message: `API test failed: ${response.status}`,
        }
      }

      const accountInfo = await response.json()
      return {
        success: true,
        message: 'DocuSign connection successful',
        details: {
          accountId: accountInfo.accountId,
          accountName: accountInfo.accountName,
          baseUrl: this.config.baseUrl,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
