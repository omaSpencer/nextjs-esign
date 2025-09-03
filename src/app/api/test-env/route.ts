import { NextResponse } from 'next/server'

export const GET = async () => {
  const envVars = {
    DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY ? '✅ Set' : '❌ Missing',
    DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID ? '✅ Set' : '❌ Missing',
    DOCUSIGN_RSA_PUBLIC: process.env.DOCUSIGN_RSA_PUBLIC ? '✅ Set' : '❌ Missing',
    DOCUSIGN_RSA_PRIVATE: process.env.DOCUSIGN_RSA_PRIVATE
      ? process.env.DOCUSIGN_RSA_PRIVATE.length > 100
        ? '✅ Set (Long)'
        : '⚠️ Set (Short)'
      : '❌ Missing',
    DOCUSIGN_OAUTH_BASE_URL: process.env.DOCUSIGN_OAUTH_BASE_URL ? '✅ Set' : '❌ Missing',
    DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID ? '✅ Set' : '❌ Missing',
    DOCUSIGN_BASE_PATH: process.env.DOCUSIGN_BASE_PATH ? '✅ Set' : '❌ Missing',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing',
  }

  const missingVars = Object.entries(envVars)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => value.includes('❌'))
    .map(([key]) => key)

  return NextResponse.json({
    environment: process.env.NODE_ENV || 'development',
    environmentVariables: envVars,
    missingVariables: missingVars,
    timestamp: new Date().toISOString(),
  })
}
