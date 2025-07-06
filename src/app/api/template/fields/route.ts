import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const cookieStore = await cookies()

  const baseUrl = process.env.DOCUSIGN_REST_API_BASE_URL
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID
  const templateId = process.env.DOCUSIGN_TEMPLATE_ID
  const accessToken = cookieStore.get('access_token')?.value

  try {
    const res = await fetch(
      `${baseUrl}/v2.1/accounts/${accountId}/templates/${templateId}/recipients`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  
    const data = await res.json()
  
    if (!res.ok) {
      return NextResponse.json({ error: 'Error fetching fields', detail: data }, { status: 500 })
    }
  
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching fields', detail: error }, { status: 500 })
  }
}
