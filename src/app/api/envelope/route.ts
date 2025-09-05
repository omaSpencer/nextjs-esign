import { NextRequest, NextResponse } from 'next/server'
import { DocuSignEnvelopeService } from '@/lib/docusign-envelope'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      signerName, 
      signerEmail, 
      base64PDF, 
      documentName, 
      emailSubject, 
      emailBlurb 
    } = body

    if (!signerName || !signerEmail) {
      return NextResponse.json(
        { error: 'Signer name and email are required' },
        { status: 400 }
      )
    }

    // Get JWT token for DocuSign authentication
    const jwtResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/jwt`, {
      method: 'POST',
    })

    if (!jwtResponse.ok) {
      const errorData = await jwtResponse.json()
      if (errorData.error === 'consent_required') {
        return NextResponse.json(
          {
            error: 'consent_required',
            message: 'User consent is required. Please call /api/oauth/consent first.',
            consentEndpoint: '/api/oauth/consent',
          },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to get JWT token' },
        { status: 500 }
      )
    }

    const jwtData = await jwtResponse.json()
    const accessToken = jwtData.access_token

    // Get account ID from environment
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID
    if (!accountId) {
      return NextResponse.json(
        { error: 'DocuSign account ID not configured' },
        { status: 500 }
      )
    }

    // Use provided PDF or generate default one
    let finalBase64PDF: string
    if (base64PDF) {
      finalBase64PDF = base64PDF
    } else {
      // Generate default contract PDF
      const { generateContractPDF } = await import('@/lib/pdf-generator')
      const contractData = {
        name: signerName,
        date: new Date().toLocaleDateString('hu-HU'),
        companyName: 'Company Name',
        contractValue: 'Contract Value',
      }
      finalBase64PDF = await generateContractPDF(contractData)
    }

    // Create DocuSign envelope service
    const envelopeService = new DocuSignEnvelopeService(accessToken, accountId)

    // Create envelope
    const result = await envelopeService.createEnvelope({
      signerName,
      signerEmail,
      base64PDF: finalBase64PDF,
      documentName: documentName || 'Contract',
      emailSubject: emailSubject || 'Please sign this contract',
      emailBlurb: emailBlurb || 'Please review and sign the attached contract document.',
    })

    return NextResponse.json({
      success: true,
      ...result,
    })

  } catch (error) {
    console.error('Envelope creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create DocuSign envelope',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
