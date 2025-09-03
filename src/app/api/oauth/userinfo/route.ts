import { NextResponse } from 'next/server'

export const GET = async () => {
  const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL

  try {
    // JWT token generálása minden request előtt
    const jwtResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/jwt`, {
      method: 'POST',
    })

    if (!jwtResponse.ok) {
      return NextResponse.json({ error: 'Failed to generate JWT token' }, { status: 500 })
    }

    const jwtData = await jwtResponse.json()
    const accessToken = jwtData.access_token

    // Userinfo lekérése a generált JWT token-nel
    const response = await fetch(`https://${oAuthBaseUrl}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('DocuSign userinfo error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get user info from DocuSign' },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      ...data,
      access_token: accessToken,
      token_type: jwtData.token_type,
      expires_in: jwtData.expires_in,
    })
  } catch (error) {
    console.error('Userinfo error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
