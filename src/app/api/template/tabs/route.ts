import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const recipientId = searchParams.get('recipientId')

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  const baseUrl = process.env.DOCUSIGN_REST_API_BASE_URL
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID
  const templateId = process.env.DOCUSIGN_TEMPLATE_ID

  try {
    const res = await fetch(
      `${baseUrl}/v2.1/accounts/${accountId}/templates/${templateId}/recipients/${recipientId}/tabs`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  
    const data = await res.json()
  
    if (!res.ok) {
      return NextResponse.json({ error: 'Error fetching tabs', detail: data }, { status: 500 })
    }
  
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tabs', detail: error }, { status: 500 })
  }
}
