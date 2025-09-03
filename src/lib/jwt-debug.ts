import jwt from 'jsonwebtoken'

export function decodeJWT(token: string) {
  try {
    // JWT token dekódolása header és payload nélkül
    const decoded = jwt.decode(token, { complete: true })
    return decoded
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

export function verifyJWTStructure(token: string): boolean {
  try {
    // Ellenőrizzük, hogy a token 3 részből áll-e (header.payload.signature)
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT structure: token should have 3 parts')
      return false
    }

    // Ellenőrizzük, hogy minden rész base64 encoded-e
    for (let i = 0; i < 3; i++) {
      try {
        Buffer.from(parts[i], 'base64')
      } catch {
        console.error(`Invalid base64 encoding in part ${i}`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('JWT structure verification error:', error)
    return false
  }
}

export function logJWTDetails(token: string) {
  console.log('=== JWT Token Details ===')
  console.log('Token:', token)
  console.log('Length:', token.length)

  const parts = token.split('.')
  console.log('Parts count:', parts.length)

  if (parts.length === 3) {
    try {
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

      console.log('Header:', JSON.stringify(header, null, 2))
      console.log('Payload:', JSON.stringify(payload, null, 2))

      // Ellenőrizzük a DocuSign specifikációkat
      const requiredFields = ['iss', 'sub', 'aud', 'iat', 'exp', 'scope']
      const missingFields = requiredFields.filter((field) => !(field in payload))

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields)
      } else {
        console.log('✅ All required fields present')
      }

      // Ellenőrizzük az exp időt
      const now = Math.floor(Date.now() / 1000)
      const exp = payload.exp
      const timeLeft = exp - now

      console.log(`Expiration: ${new Date(exp * 1000).toISOString()}`)
      console.log(`Time left: ${timeLeft} seconds`)

      if (timeLeft <= 0) {
        console.error('❌ Token expired!')
      } else if (timeLeft < 300) {
        // 5 perc alatt
        console.warn('⚠️ Token expires soon!')
      } else {
        console.log('✅ Token is valid')
      }

      // Signature részlet
      console.log('Signature length:', parts[2].length)
      console.log('Signature preview:', parts[2].substring(0, 20) + '...')
    } catch (error) {
      console.error('Error parsing JWT parts:', error)
    }
  }

  console.log('========================')
}
