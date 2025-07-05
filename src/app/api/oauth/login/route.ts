import { NextResponse } from 'next/server'

export const GET = async () => {
  const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
  const redirectUri = process.env.DOCUSIGN_OAUTH_REDIRECT_URI
  const scope = process.env.DOCUSIGN_OAUTH_SCOPE
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY

  const url = `https://${oAuthBaseUrl}/oauth/auth?response_type=code&scope=${scope}&client_id=${integrationKey}&redirect_uri=${redirectUri}`

  return NextResponse.redirect(url)
}
