import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook authenticity (implement HMAC verification in production)
    // const signature = request.headers.get('x-docusign-signature-1')

    // Handle different DocuSign events
    const { event, data } = body

    switch (event) {
      case 'envelope-completed':
        console.log('Envelope completed:', data.envelopeId)
        // Handle completed envelope (e.g., notify user, update database)
        break

      case 'envelope-sent':
        console.log('Envelope sent:', data.envelopeId)
        // Handle sent envelope
        break

      case 'envelope-delivered':
        console.log('Envelope delivered:', data.envelopeId)
        // Handle delivered envelope
        break

      case 'envelope-signed':
        console.log('Envelope signed:', data.envelopeId)
        // Handle signed envelope
        break

      default:
        console.log('Unhandled DocuSign event:', event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DocuSign webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
