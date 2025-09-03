import { NextResponse } from 'next/server'
import { createDocuSignJWT } from '@/lib/jwt'
import { logJWTDetails, verifyJWTStructure } from '@/lib/jwt-debug'

export const POST = async () => {
  try {
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY
    const clientSecret = process.env.DOCUSIGN_CLIENT_SECRET
    const userId = process.env.DOCUSIGN_USER_ID
    const privateKey = process.env.DOCUSIGN_RSA_PRIVATE
    const oAuthBaseUrl = process.env.DOCUSIGN_OAUTH_BASE_URL
    const encodedKeys = btoa(`${integrationKey}:${clientSecret}`)

    if (!integrationKey || !userId || !privateKey || !oAuthBaseUrl || !clientSecret) {
      return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 })
    }

    // JWT token generálása a utility segítségével
    const jwt = createDocuSignJWT(integrationKey, userId, privateKey)
    console.log('JWT:', jwt)

    // JWT token debug és validáció
    console.log('Generated JWT token:')
    logJWTDetails(jwt)

    if (!verifyJWTStructure(jwt)) {
      return NextResponse.json({ error: 'Invalid JWT structure generated' }, { status: 500 })
    }

    // JWT token használata a DocuSign OAuth token lekéréséhez
    const response = await fetch(`https://${oAuthBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedKeys}`,
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DocuSign OAuth error:', errorData)

      // Consent required hiba kezelése
      if (errorData.error === 'consent_required') {
        return NextResponse.json(
          {
            error: 'consent_required',
            message: 'User consent is required. Please call /api/oauth/consent first.',
            consentEndpoint: '/api/oauth/consent',
            details: errorData,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        { error: 'Failed to get OAuth token from DocuSign', details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
    })
  } catch (error) {
    console.error('JWT OAuth error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
