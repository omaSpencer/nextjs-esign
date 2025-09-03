# Környezeti változók beállítása

Ez a dokumentum leírja, hogyan kell beállítani a környezeti változókat a JWT alapú DocuSign OAuth-hoz.

## Szükséges környezeti változók

Hozzon létre egy `.env.local` fájlt a projekt gyökérkönyvtárában a következő változókkal:

### DocuSign OAuth beállítások

```env
# DocuSign Integration Key (App Integration Key)
DOCUSIGN_INTEGRATION_KEY=your_integration_key_here

# DocuSign User ID (a felhasználó GUID-je)
DOCUSIGN_USER_ID=your_user_id_here

# RSA Private Key (PEM formátumban)
DOCUSIGN_RSA_PRIVATE=-----BEGIN RSA PRIVATE KEY-----\nYour private key here\n-----END RSA PRIVATE KEY-----

# DocuSign OAuth Base URL (demo vagy production)
DOCUSIGN_OAUTH_BASE_URL=demo.docusign.net

# DocuSign Account ID
DOCUSIGN_ACCOUNT_ID=your_account_id_here

# DocuSign REST API Base Path
DOCUSIGN_BASE_PATH=https://demo.docusign.net/restapi
```

### App beállítások

```env
# Next.js app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Hogyan szerezze be ezeket az adatokat?

### 1. DocuSign Developer Account

1. Menjen a [DocuSign Developer Center](https://developers.docusign.com/) oldalra
2. Regisztráljon vagy jelentkezzen be
3. Hozzon létre egy új integrációt

### 2. Integration Key (App Integration Key)

1. A Developer Center-ben válassza az "Apps and Keys" menüpontot
2. Kattintson az "Add App Integration" gombra
3. Válassza ki az "Authorization Code Grant" vagy "JWT Grant" típust
4. Másolja ki a generált Integration Key-t

### 3. User ID

1. A Developer Center-ben válassza a "Users" menüpontot
2. Keresse meg a felhasználót, akinek nevében szeretne működni
3. Másolja ki a User ID-t (GUID formátum)

### 4. RSA Private és Public Key

1. Generáljon egy RSA kulcspárt:
```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

2. Másolja a private key tartalmát a `DOCUSIGN_RSA_PRIVATE` változóba
3. Másolja a public key tartalmát a `DOCUSIGN_RSA_PUBLIC` változóba
4. Töltse fel a public key-t a DocuSign Developer Center-ben

### 5. Account ID

1. A DocuSign webes felületen menjen a "Settings" > "API and Keys" menüpontra
2. Másolja ki az Account ID-t

### 6. OAuth Base URL

- **Demo**: `demo.docusign.net`
- **Production**: `account.docusign.com`

## Példa .env.local fájl

```env
# DocuSign JWT OAuth Configuration
DOCUSIGN_INTEGRATION_KEY=12345678-1234-1234-1234-123456789012
DOCUSIGN_USER_ID=87654321-4321-4321-4321-210987654321
DOCUSIGN_RSA_PRIVATE=-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----
DOCUSIGN_RSA_PUBLIC=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----
DOCUSIGN_OAUTH_BASE_URL=demo.docusign.net
DOCUSIGN_ACCOUNT_ID=12345678-1234-1234-1234-123456789012
DOCUSIGN_BASE_PATH=https://demo.docusign.net/restapi

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Biztonsági megjegyzések

- **NE** commitolja a `.env.local` fájlt a git repository-ba
- A `.env.local` fájl már szerepel a `.gitignore`-ban
- A private key-eket biztonságosan tárolja
- Production környezetben használjon erős jelszavakat és kulcsokat

## Tesztelés

A beállítások teszteléséhez:

1. Indítsa el a fejlesztői szervert: `npm run dev`
2. Tesztelje a környezeti változókat: `http://localhost:3000/api/test-env`
3. Próbálja meg a JWT OAuth-t: `http://localhost:3000/api/oauth/jwt`

### Consent kezelés

Ha `consent_required` hibát kap:

1. Hívja meg a consent endpoint-ot: `http://localhost:3000/api/oauth/consent`
2. Nyissa meg a visszakapott `consentUrl`-t a böngészőben
3. Jelentkezzen be a DocuSign fiókjába és adja meg a hozzájárulását
4. A callback után próbálja újra a JWT OAuth-t

## Hibaelhárítás

### "Missing required environment variables" hiba

Ellenőrizze, hogy minden szükséges környezeti változó be van-e állítva.

### "Failed to generate JWT token" hiba

Ellenőrizze:
- A private key formátumát
- Az Integration Key és User ID helyességét
- A DocuSign Developer Center beállításait

### "Failed to get OAuth token from DocuSign" hiba

Ellenőrizze:
- A private key-t a DocuSign Developer Center-ben
- Az OAuth Base URL-t
- A scope beállításokat
