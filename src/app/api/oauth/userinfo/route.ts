import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const GET = async () => {
  const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/login`)
  }

  try {
    const response = await fetch(`https://${oAuthBaseUrl}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
