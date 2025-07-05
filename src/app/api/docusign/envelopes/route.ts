import { type NextRequest, NextResponse } from 'next/server'
import { DocuSignService } from '@/lib/docusign-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const count = searchParams.get('count')
      ? Number.parseInt(searchParams.get('count')!)
      : undefined
    const fromDate = searchParams.get('fromDate') || undefined

    const docusignService = new DocuSignService()
    const initialized = await docusignService.initialize()

    if (!initialized) {
      return NextResponse.json({ error: 'Failed to initialize DocuSign service' }, { status: 500 })
    }

    const envelopes = await docusignService.listEnvelopes({
      status,
      count,
      fromDate,
    })

    if (!envelopes) {
      return NextResponse.json({ error: 'Failed to retrieve envelopes' }, { status: 500 })
    }

    return NextResponse.json({
      totalSetSize: envelopes.totalSetSize,
      envelopes: envelopes.envelopes?.map((env) => ({
        envelopeId: env.envelopeId,
        status: env.status,
        statusDateTime: env.statusChangedDateTime,
        emailSubject: env.emailSubject,
        senderName: env.sender?.userName,
        senderEmail: env.sender?.email,
      })),
    })
  } catch (error) {
    console.error('Error listing envelopes:', error)
    return NextResponse.json({ error: 'Failed to list envelopes' }, { status: 500 })
  }
}
