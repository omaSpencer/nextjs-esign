import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  const formData = await req.formData()
  const signerName = formData.get('signerName') as string
  const signerEmail = formData.get('signerEmail') as string

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  const baseUrl = process.env.DOCUSIGN_REST_API_BASE_URL
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID
  const templateId = process.env.DOCUSIGN_TEMPLATE_ID

  const envelopeRes = await fetch(`${baseUrl}/v2.1/accounts/${accountId}/envelopes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId,
      templateRoles: [
        {
          roleName: 'signer',
          name: signerName,
          email: signerEmail,
          clientUserId: 'signer-1',
        },
      ],
      status: 'sent',
    }),
  })

  const envelopeData = await envelopeRes.json()

  if (!envelopeRes.ok) {
    return NextResponse.json({ error: 'Envelope error', detail: envelopeData }, { status: 500 })
  }

  const envelopeId = envelopeData.envelopeId

  const recipientViewRes = await fetch(
    `${baseUrl}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3000/after-signing',
        authenticationMethod: 'none',
        email: signerEmail,
        userName: signerName,
        recipientId: '1',
        clientUserId: 'signer-1',
      }),
    },
  )

  const viewData = await recipientViewRes.json()

  if (!recipientViewRes.ok) {
    return NextResponse.json({ error: 'View URL error', detail: viewData }, { status: 500 })
  }

  return NextResponse.json({ url: viewData.url })
}
