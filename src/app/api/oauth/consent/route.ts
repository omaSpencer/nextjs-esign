import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY
    const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
    const redirectUri = process.env.NEXT_PUBLIC_APP_URL + '/api/oauth/callback'

    if (!integrationKey || !oAuthBaseUrl) {
      return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 })
    }

    // Consent URL generálása a DocuSign számára
    // Ez a felhasználónak lehetőséget ad a hozzájárulás megadására
    const consentUrl = `https://${oAuthBaseUrl}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${integrationKey}&redirect_uri=${encodeURIComponent(redirectUri)}`

    return NextResponse.json({
      consentUrl,
      message: 'User needs to provide consent. Please redirect to the consent URL.',
      instructions: [
        '1. Nyissa meg a consentUrl-t a böngészőben',
        '2. Jelentkezzen be a DocuSign fiókjába',
        '3. Adja meg a hozzájárulását az alkalmazáshoz',
        '4. A callback után újra próbálja a JWT OAuth-t',
      ],
    })
  } catch (error) {
    console.error('Consent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
