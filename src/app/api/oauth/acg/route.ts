import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const { code } = (await request.json()) as { code?: string }

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  try {
    const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY
    const clientSecret = process.env.DOCUSIGN_CLIENT_SECRET
    const encodedKeys = btoa(`${integrationKey}:${clientSecret}`)

    const response = await fetch(`https://${oAuthBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedKeys}`,
      },
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
      }),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
