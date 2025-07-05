import { NextResponse } from 'next/server'
import { DocuSignClient } from '@/lib/docusign-client'

export async function GET(request: Request, { params }: { params: Promise<{ envelopeId: string }> }) {
  try {
    const docusignClient = new DocuSignClient()
    const envelope = await docusignClient.getEnvelopeStatus((await params).envelopeId)

    if (!envelope) {
      return NextResponse.json({ error: 'Envelope not found' }, { status: 404 })
    }

    return NextResponse.json({
      envelopeId: envelope.envelopeId,
      status: envelope.status,
      statusDateTime: envelope.statusChangedDateTime,
      emailSubject: envelope.emailSubject,
      recipients: envelope.recipients,
    })
  } catch (error) {
    console.error('Error getting envelope status:', error)
    return NextResponse.json({ error: 'Failed to get envelope status' }, { status: 500 })
  }
}
