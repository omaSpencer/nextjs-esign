# Next.js eSign - DocuSign Integration

Ez a projekt egy Next.js alapú eSign alkalmazás, amely JWT alapú OAuth-t használ a DocuSign API-hoz való kapcsolódáshoz.

## Funkciók

- **JWT alapú OAuth**: Minden request előtt automatikusan generál JWT tokent
- **Envelope létrehozás**: DocuSign envelope-ok létrehozása dinamikus adatokkal
- **Placeholder támogatás**: `{{var}}` formátumú placeholder-ek cseréje
- **Anchor alapú aláírás**: Px pontosságú aláírási mezők elhelyezése
- **PDF és HTML támogatás**: Különböző dokumentum formátumok

## Telepítés

1. Klónozza a repository-t:
```bash
git clone <repository-url>
cd nextjs-esign
```

2. Telepítse a függőségeket:
```bash
npm install
# vagy
bun install
```

3. Környezeti változók beállítása:
```bash
cp .env.example .env.local
```

4. Töltse ki a `.env.local` fájlt a DocuSign adataival:
```env
DOCUSIGN_INTEGRATION_KEY=your_integration_key_here
DOCUSIGN_USER_ID=your_user_id_here
DOCUSIGN_RSA_PRIVATE=-----BEGIN RSA PRIVATE KEY-----\nYour private key here\n-----END RSA PRIVATE KEY-----
DOCUSIGN_RSA_PUBLIC=-----BEGIN PUBLIC KEY-----\nYour public key here\n-----END PUBLIC KEY-----
DOCUSIGN_OAUTH_BASE_URL=demo.docusign.net
DOCUSIGN_ACCOUNT_ID=your_account_id_here
DOCUSIGN_BASE_PATH=https://demo.docusign.net/restapi
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Indítsa el a fejlesztői szervert:
```bash
npm run dev
# vagy
bun dev
```

## Használat

### JWT OAuth

A rendszer automatikusan generál JWT tokent minden API hívás előtt:

```typescript
// JWT token generálása
const response = await fetch('/api/oauth/jwt', { method: 'POST' })
const { access_token } = await response.json()
```

### Consent kezelés

Ha `consent_required` hibát kap, először a felhasználói hozzájárulást kell megadni:

```typescript
// 1. Consent endpoint hívása
const consentResponse = await fetch('/api/oauth/consent')
const { consentUrl } = await consentResponse.json()

// 2. Felhasználó átirányítása a consent URL-re
window.location.href = consentUrl

// 3. A callback után újra próbálkozás
const jwtResponse = await fetch('/api/oauth/jwt', { method: 'POST' })
```

### Envelope létrehozás

```typescript
const envelopeData = {
  subject: 'Szerződés aláírás',
  message: 'Kérjük, írja alá a szerződést',
  signers: [
    {
      email: 'user@example.com',
      name: 'John Doe',
      recipientId: '1'
    }
  ],
  documents: [
    {
      name: 'contract.pdf',
      content: 'base64-encoded-pdf-content',
      fileExtension: 'pdf',
      documentId: '1',
      placeholders: {
        'name': 'John Doe',
        'date': '2024-01-01'
      }
    }
  ]
}

const response = await fetch('/api/envelope', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(envelopeData)
})
```

## API Endpoints

- `POST /api/oauth/jwt` - JWT token generálása
- `GET /api/oauth/consent` - Felhasználói hozzájárulás kezelése
- `GET /api/oauth/callback` - Consent callback feldolgozása
- `GET /api/oauth/userinfo` - Felhasználói információk lekérése
- `POST /api/envelope` - Envelope létrehozása és elküldése
- `GET /api/envelope` - Envelope service állapot ellenőrzése
- `GET /api/test-env` - Környezeti változók ellenőrzése

## Fejlesztés

```bash
# Adatbázis migrációk generálása
npm run db:generate

# Adatbázis migrációk futtatása
npm run db:migrate

# Adatbázis studio indítása
npm run db:studio

# Kód formázása
npm run format

# Linting
npm run lint
```

## Technológiai stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **OAuth**: JWT (JSON Web Token)
- **API**: DocuSign eSign REST API
- **Adatbázis**: Drizzle ORM
- **Autentikáció**: Lucia Auth

## Licenc

MIT
