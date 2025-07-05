import { NextResponse } from "next/server"

export const GET = async () => {
  const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
  const accessToken = process.env.DOCUSIGN_ACCESS_TOKEN

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
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}