import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.json(
        {
          error: 'Consent failed',
          details: error,
          message: 'User denied consent or an error occurred during the consent process.',
        },
        { status: 400 },
      )
    }

    if (!code) {
      return NextResponse.json(
        {
          error: 'No authorization code received',
          message: 'The consent process did not return an authorization code.',
        },
        { status: 400 },
      )
    }

    // Consent sikeresen megadva
    return NextResponse.json({
      success: true,
      message: 'Consent granted successfully! You can now use the JWT OAuth endpoint.',
      nextSteps: [
        '1. Térjen vissza az alkalmazáshoz',
        '2. Próbálja újra a /api/oauth/jwt endpoint-ot',
        '3. A JWT OAuth most már működni fog',
      ],
      code: code.substring(0, 10) + '...', // Csak az első 10 karakter
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
