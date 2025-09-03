import jwt from 'jsonwebtoken'

export interface JWTPayload {
  iss: string // Integration Key
  sub: string // User ID
  iat: number // Issued at
  exp: number // Expiration time
  aud: string // Audience
  scope: string // Scope
}

export function generateJWT(payload: JWTPayload, privateKey: string): string {
  try {
    // JWT token generálása jsonwebtoken package használatával
    // A jsonwebtoken package automatikusan kezeli az RS256 algoritmust
    const signOptions: jwt.SignOptions = {
      algorithm: 'RS256',
      header: {
        alg: 'RS256',
        typ: 'JWT',
      },
    }

    // JWT token generálása a private key-jel
    // A public key a DocuSign Developer Center-ben van tárolva
    return jwt.sign(payload, privateKey, signOptions)
  } catch (error) {
    console.error('JWT generation error:', error)
    throw new Error(
      `Failed to generate JWT: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export function createDocuSignJWT(
  integrationKey: string,
  userId: string,
  privateKey: string,
): string {
  const now = Math.floor(Date.now() / 1000)

  const payload: JWTPayload = {
    iss: integrationKey,
    sub: userId,
    iat: now,
    exp: now + 6000, // 100 perc érvényesség (DocuSign specifikáció szerint)
    aud: 'account-d.docusign.com',
    scope: 'signature impersonation',
  }

  return generateJWT(payload, privateKey)
}
