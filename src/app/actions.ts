"use server"

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
      signerName: formData.get("signerName") as string,
      signerEmail: formData.get("signerEmail") as string,
      contractTitle: formData.get("contractTitle") as string,
      contractType: formData.get("contractType") as string,
      contractValue: formData.get("contractValue") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    }

    // Validate required fields
    if (!contractData.signerName || !contractData.signerEmail || !contractData.contractTitle) {
      return { success: false, error: "Missing required fields" }
    }

    // Create DocuSign envelope
    const envelopeResult = await createDocuSignEnvelope(contractData)

    if (!envelopeResult.success) {
      return { success: false, error: envelopeResult.error }
    }

    return {
      success: true,
      envelopeId: envelopeResult.envelopeId,
      message: "Contract sent successfully via DocuSign",
    }
  } catch (error) {
    console.error("Error in sendContractAction:", error)
    return { success: false, error: "Failed to send contract" }
  }
}

async function createDocuSignEnvelope(contractData: ContractData) {
  try {
    // DocuSign API configuration
    const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL || "https://demo.docusign.net/restapi"
    const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID
    const DOCUSIGN_ACCESS_TOKEN = process.env.DOCUSIGN_ACCESS_TOKEN

    if (!DOCUSIGN_ACCOUNT_ID || !DOCUSIGN_ACCESS_TOKEN) {
      return { success: false, error: "DocuSign credentials not configured" }
    }

    // Generate contract document content
    const documentContent = generateContractDocument(contractData)
    const documentBase64 = Buffer.from(documentContent).toString("base64")

    // Create envelope definition
    const envelopeDefinition = {
      emailSubject: `Please sign: ${contractData.contractTitle}`,
      documents: [
        {
          documentBase64: documentBase64,
          name: `${contractData.contractTitle}.html`,
          fileExtension: "html",
          documentId: "1",
        },
      ],
      recipients: {
        signers: [
          {
            email: contractData.signerEmail,
            name: contractData.signerName,
            recipientId: "1",
            routingOrder: "1",
            tabs: {
              signHereTabs: [
                {
                  anchorString: "**SIGNATURE**",
                  anchorUnits: "pixels",
                  anchorXOffset: "20",
                  anchorYOffset: "10",
                },
              ],
              dateSignedTabs: [
                {
                  anchorString: "**DATE**",
                  anchorUnits: "pixels",
                  anchorXOffset: "20",
                  anchorYOffset: "10",
                },
              ],
            },
          },
        ],
      },
      status: "sent",
    }

    // Send request to DocuSign API
    const response = await fetch(`${DOCUSIGN_BASE_URL}/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DOCUSIGN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envelopeDefinition),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("DocuSign API Error:", errorData)
      return { success: false, error: "Failed to create DocuSign envelope" }
    }

    const result = await response.json()

    return {
      success: true,
      envelopeId: result.envelopeId,
      status: result.status,
    }
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error)
    return { success: false, error: "Failed to create envelope" }
  }
}

function generateContractDocument(contractData: ContractData): string {
  const currentDate = new Date().toLocaleDateString()

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${contractData.contractTitle}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .signature-section { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 30px; }
            .signature-line { margin: 30px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${contractData.contractTitle}</h1>
            <p>Contract Date: ${currentDate}</p>
        </div>
        
        <div class="section">
            <h3>Contract Details</h3>
            <p><strong>Contract Type:</strong> ${contractData.contractType || "Not specified"}</p>
            <p><strong>Contract Value:</strong> ${contractData.contractValue || "Not specified"}</p>
            <p><strong>Start Date:</strong> ${contractData.startDate || "Not specified"}</p>
            <p><strong>End Date:</strong> ${contractData.endDate || "Not specified"}</p>
        </div>
        
        <div class="section">
            <h3>Description</h3>
            <p>${contractData.description || "No description provided"}</p>
        </div>
        
        <div class="section">
            <h3>Terms and Conditions</h3>
            <p>This contract is entered into between the parties and is subject to the terms and conditions outlined herein. Both parties agree to fulfill their respective obligations as described in this agreement.</p>
        </div>
        
        <div class="signature-section">
            <h3>Signatures</h3>
            <div class="signature-line">
                <p><strong>Signer:</strong> ${contractData.signerName}</p>
                <p>Signature: **SIGNATURE**</p>
                <p>Date: **DATE**</p>
            </div>
        </div>
    </body>
    </html>
  `
}
