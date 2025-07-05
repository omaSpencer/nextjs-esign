
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export const GET = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  const baseUrl = process.env.DOCUSIGN_BASE_URL
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID
  const templateId = process.env.DOCUSIGN_TEMPLATE_ID
  const recipientId = '26283072'

  const res = await fetch(`${baseUrl}/v2.1/accounts/${accountId}/templates/${templateId}/recipients/${recipientId}/tabs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: 'Nem sikerült lekérni a mezőket', detail: data }, { status: 500 })
  }

  return NextResponse.json(data)
}