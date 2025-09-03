# DocuSign Envelope Creation API

Ez a dokumentum leírja a DocuSign envelope létrehozás API-jának használatát.

## Funkciók

- **PDF generálás**: Automatikus szerződés PDF generálás
- **Anchor alapú aláírás**: Aláírási mezők pozicionálása szöveg alapján
- **DocuSign integráció**: Közvetlen API hívás a DocuSign szolgáltatáshoz
- **JWT OAuth**: Biztonságos hitelesítés

## API Endpoints

### 1. Envelope létrehozás

```bash
POST /api/envelope
```

**Request body (FormData):**
- `signerName`: Aláíró neve
- `signerEmail`: Aláíró email címe
- `base64PDF`: (opcionális) Base64 kódolt PDF tartalom

**Response:**
```json
{
  "success": true,
  "envelopeId": "envelope-id-here",
  "status": "sent",
  "signingUrl": "https://demo.docusign.net/...",
  "message": "Envelope created successfully"
}
```

### 2. Teszt PDF generálás

```bash
GET /api/envelope/test
```

Generál egy teszt szerződés PDF-et az anchor szövegekkel.

## Anchor szövegek

A PDF-ben a következő anchor szövegek alapján pozicionálódnak az aláírási mezők:

- `Aláírás helye:` - Fő aláírási terület
- `[[Nev]] aláírása` - Aláíró aláírása
- `[[Ceg neve]] aláírása` - Cég aláírása
- `Tanu aláírása` - Tanú aláírása
- `Datum: [[Datum]]` - Dátum mező

## Használati példa

```typescript
// 1. Teszt PDF generálása
const testResponse = await fetch('/api/envelope/test')
const testData = await testResponse.json()

// 2. Envelope létrehozása
const formData = new FormData()
formData.append('signerName', 'John Doe')
formData.append('signerEmail', 'john@example.com')
formData.append('base64PDF', testData.base64PDF)

const envelopeResponse = await fetch('/api/envelope', {
  method: 'POST',
  body: formData
})

const envelopeData = await envelopeResponse.json()
console.log('Signing URL:', envelopeData.signingUrl)
```

## Környezeti változók

A következő környezeti változók szükségesek:

```env
DOCUSIGN_INTEGRATION_KEY=your_integration_key
DOCUSIGN_USER_ID=your_user_id
DOCUSIGN_RSA_PRIVATE=your_private_key
DOCUSIGN_ACCOUNT_ID=your_account_id
DOCUSIGN_OAUTH_BASE_URL=demo.docusign.net
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Hibaelhárítás

### Consent required hiba

Ha `consent_required` hibát kap:

1. Hívja meg: `GET /api/oauth/consent`
2. Nyissa meg a visszakapott `consentUrl`-t
3. Adja meg a hozzájárulását
4. Próbálja újra az envelope létrehozását

### JWT token hiba

Ellenőrizze a környezeti változókat:

```bash
GET /api/test-env
```
