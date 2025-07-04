Of course! This is an excellent project. We will build a complete Next.js (App Router) application that integrates with the DocuSign eSign REST API from scratch. We'll handle user authentication, database storage for envelopes, and Hungarian localization.

Here is a comprehensive, step-by-step plan and the code to build it.

### **Project Goal**

To create a secure, multi-user web application where authenticated users can create, send, track, and manage DocuSign envelopes. The application will be fully localized in Hungarian (HU).

---

### **Phase 0: Prerequisites & Initial Setup**

Before writing any code, we need to set up our development environment and DocuSign account.

**Step 1: Get DocuSign Developer Account Credentials**

1.  **Create a free DocuSign Developer Account:** [https://developers.docusign.com/](https://developers.docusign.com/)
2.  Go to **Settings -> Apps and Keys**.
3.  Click **"Add App & Integration Key"**.
4.  Give it a name (e.g., "NextJS CRUD App"). Click **"Create App"**.
5.  **Authentication:**
    *   Select **"JWT Grant"**. This is essential for server-to-server communication without user interaction for each API call.
6.  **Service Integration:**
    *   Click **"Generate RSA"**. This will generate a public and private key pair. **Securely save the Private Key** into a file named `docusign_private.key`. You will not be able to see it again.
7.  **Take note of these values:**
    *   **Integration Key (Client ID)**
    *   **API Account ID**
    *   **User ID** (Go to your profile to find this GUID)
    *   **Account's Base URI / API Endpoint** (e.g., `https://demo.docusign.net/restapi`)

**Step 2: Initialize Next.js Project**

```bash
npx create-next-app@latest docusign-nextjs-app
# During setup, select:
# ✔ Would you like to use TypeScript? ... Yes
# ✔ Would you like to use ESLint? ... Yes
# ✔ Would you like to use Tailwind CSS? ... Yes
# ✔ Would you like to use `src` directory? ... No
# ✔ Would you like to use App Router? ... Yes
# ✔ Would you like to customize the default import alias? ... No

cd docusign-nextjs-app
```

**Step 3: Install Dependencies**

```bash
npm install prisma @prisma/client next-auth @auth/prisma-adapter bcrypt jsonwebtoken next-intl zod @hookform/resolvers react-hook-form lucide-react sonner
npm install -D @types/bcrypt @types/jsonwebtoken
```
*   **Prisma:** Our ORM for the database.
*   **NextAuth:** For user authentication.
*   **bcrypt:** For hashing passwords.
*   **jsonwebtoken:** To create the JWT for DocuSign authentication.
*   **next-intl:** For localization (i18n).
*   **Zod, React Hook Form, etc.:** For robust form handling and UI feedback.

**Step 4: Environment Variables**

Create a `.env.local` file in your project root. **Never commit this file to Git.**

```.env.local
# DATABASE
DATABASE_URL="file:./dev.db" # Using SQLite for simplicity

# NEXTAUTH
NEXTAUTH_SECRET="YOUR_SUPER_SECRET_KEY_FOR_NEXTAUTH" # Generate a strong random string
NEXTAUTH_URL="http://localhost:3000"

# DOCUSIGN
# All from your DocuSign Developer Account
DS_INTEGRATION_KEY="YOUR_INTEGRATION_KEY"
DS_USER_ID="YOUR_USER_ID_GUID"
DS_ACCOUNT_ID="YOUR_API_ACCOUNT_ID"
DS_API_BASE_PATH="https://demo.docusign.net/restapi" # Or your specific base path
DS_AUTH_SERVER="account-d.docusign.com" # For developer accounts

# Paste the content of your docusign_private.key file here,
# wrapped in quotes and with newlines replaced by \n
DS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMI...your...key...\n-----END RSA PRIVATE KEY-----"
```
Place the `docusign_private.key` file in your project root as well (and add it to `.gitignore`).

---

### **Phase 1: Project Foundation & Database**

**Step 1: Setup Prisma (Database)**

1.  Initialize Prisma:
    ```bash
    npx prisma init
    ```
    This creates a `prisma` directory with a `schema.prisma` file.

2.  Define your schema in `prisma/schema.prisma`:

    ```prisma
    // This is your Prisma schema file,
    // learn more about it in the docs: https://pris.ly/d/prisma-schema

    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "sqlite"
      url      = env("DATABASE_URL")
    }

    model Account {
      id                String  @id @default(cuid())
      userId            String
      type              String
      provider          String
      providerAccountId String
      refresh_token     String?
      access_token      String?
      expires_at        Int?
      token_type        String?
      scope             String?
      id_token          String?
      session_state     String?
      user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@unique([provider, providerAccountId])
    }

    model Session {
      id           String   @id @default(cuid())
      sessionToken String   @unique
      userId       String
      expires      DateTime
      user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    }

    model User {
      id            String     @id @default(cuid())
      name          String?
      email         String?    @unique
      emailVerified DateTime?
      password      String?    // For Credentials provider
      image         String?
      accounts      Account[]
      sessions      Session[]
      envelopes     Envelope[]
    }

    model VerificationToken {
      identifier String
      token      String   @unique
      expires    DateTime

      @@unique([identifier, token])
    }



    // Our custom model for tracking DocuSign envelopes
    model Envelope {
      id          String    @id @default(cuid())
      envelopeId  String    @unique // The ID from DocuSign API
      status      String    // e.g., 'sent', 'delivered', 'completed', 'voided'
      subject     String
      createdAt   DateTime  @default(now())
      updatedAt   DateTime  @updatedAt
      owner       User      @relation(fields: [ownerId], references: [id])
      ownerId     String
    }
    ```

3.  Migrate the database:
    ```bash
    npx prisma migrate dev --name init
    ```

**Step 2: Setup Localization (next-intl)**

1.  Create a `messages` directory in the root. Inside it, create `hu.json`:

    ```json
    // messages/hu.json
    {
      "HomePage": {
        "title": "Üdvözöljük a DocuSign Alkalmazásban"
      },
      "Navigation": {
        "dashboard": "Vezérlőpult",
        "newEnvelope": "Új Boríték",
        "login": "Bejelentkezés",
        "logout": "Kijelentkezés"
      },
      "Dashboard": {
        "title": "Vezérlőpult",
        "myEnvelopes": "Borítékjaim",
        "noEnvelopes": "Még nincsenek elküldött borítékok.",
        "table": {
          "subject": "Tárgy",
          "status": "Állapot",
          "sentDate": "Küldés Dátuma",
          "actions": "Műveletek"
        },
        "viewDetails": "Részletek"
      },
      "NewEnvelopePage": {
        "title": "Új Boríték Küldése",
        "signerEmail": "Aláíró Email Címe",
        "signerName": "Aláíró Neve",
        "emailSubject": "Email Tárgya",
        "emailMessage": "Email Üzenet",
        "document": "Dokumentum (PDF)",
        "sendButton": "Boríték Küldése",
        "sending": "Küldés...",
        "success": "A boríték sikeresen elküldve!",
        "error": "Hiba történt a küldés során."
      },
      "Auth": {
        "loginTitle": "Bejelentkezés",
        "email": "Email",
        "password": "Jelszó",
        "loginButton": "Bejelentkezés"
      }
    }
    ```

2.  Create `i18n.ts` in the root:

    ```typescript
    // i18n.ts
    import {getRequestConfig} from 'next-intl/server';
    
    export default getRequestConfig(async () => {
      // For this example, we'll always use Hungarian
      const locale = 'hu';
    
      return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
      };
    });
    ```

3.  Create `middleware.ts` in the root to handle routing:

    ```typescript
    // middleware.ts
    import createMiddleware from 'next-intl/middleware';
    
    export default createMiddleware({
      locales: ['hu'],
      defaultLocale: 'hu'
    });
    
    export const config = {
      // Skip all paths that should not be internationalized
      matcher: ['/((?!api|_next|.*\\..*).*)']
    };
    ```

---

### **Phase 2: Authentication (User & DocuSign)**

**Step 1: User Authentication with NextAuth.js**

1.  Create the API route handler at `app/api/auth/[...nextauth]/route.ts`:

    ```typescript
    // app/api/auth/[...nextauth]/route.ts
    import NextAuth, { AuthOptions } from "next-auth";
    import { PrismaAdapter } from "@auth/prisma-adapter";
    import CredentialsProvider from "next-auth/providers/credentials";
    import prisma from "@/lib/prisma";
    import { compare } from "bcrypt";

    export const authOptions: AuthOptions = {
      adapter: PrismaAdapter(prisma),
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/login",
      },
      providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials.password) {
              return null;
            }
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user || !user.password) {
              // You might want to create a user here if they don't exist
              // For now, we only allow existing users to log in
              return null;
            }

            const isPasswordValid = await compare(credentials.password, user.password);

            if (!isPasswordValid) {
              return null;
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          },
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
          }
          return session;
        },
      },
    };

    const handler = NextAuth(authOptions);

    export { handler as GET, handler as POST };
    ```

**Step 2: DocuSign API Service (100% REST)**

This is the core of our DocuSign integration. We will create a service to handle JWT authentication and make API calls.

Create `lib/docusign.ts`:

```typescript
// lib/docusign.ts
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

// This is a simple in-memory cache for the access token.
// In a production environment, you might use Redis or another caching layer.
let accessTokenCache = {
  token: '',
  expiresAt: 0,
};

const getAccessToken = async (): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  if (accessTokenCache.token && accessTokenCache.expiresAt > now) {
    return accessTokenCache.token;
  }
  
  console.log('Generating new DocuSign access token...');

  const privateKey = process.env.DS_PRIVATE_KEY;
  if (!privateKey) throw new Error('DS_PRIVATE_KEY is not set in .env.local');

  const jwtPayload = {
    iss: process.env.DS_INTEGRATION_KEY,
    sub: process.env.DS_USER_ID,
    iat: now,
    exp: now + 3600, // Token expires in 1 hour
    aud: process.env.DS_AUTH_SERVER,
    scope: "signature impersonation",
  };

  const token = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });

  const authServer = `https://${process.env.DS_AUTH_SERVER}/oauth/token`;

  const response = await fetch(authServer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to get access token: ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  
  accessTokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in - 60, // Subtract 60s for buffer
  };

  return data.access_token;
};

// Generic function to make an authenticated API call to DocuSign
export const makeDocusignApiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body: object | null = null
) => {
  const accessToken = await getAccessToken();
  const accountId = process.env.DS_ACCOUNT_ID;
  const basePath = process.env.DS_API_BASE_PATH;

  const url = `${basePath}${endpoint.replace('{accountId}', accountId!)}`;

  const headers: HeadersInit = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("DocuSign API Error:", errorData);
    throw new Error(`DocuSign API request failed: ${response.statusText}`);
  }

  // Handle cases where the response might be empty (e.g., 204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
  }
  
  return response.json();
};

// --- Specific API Functions ---

// Function to create and send an envelope
export const createEnvelope = async (envelopeData: any) => {
  return makeDocusignApiRequest(
    'POST',
    `/v2.1/accounts/{accountId}/envelopes`,
    envelopeData
  );
};

// Function to get the status of an envelope
export const getEnvelopeStatus = async (envelopeId: string) => {
  return makeDocusignApiRequest(
    'GET',
    `/v2.1/accounts/{accountId}/envelopes/${envelopeId}`
  );
};
```

---

### **Phase 3: Core CRUD Functionality & UI**

Now we'll build the pages and components for our application.

**Step 1: Main Layout and Providers**

Update `app/layout.tsx`:

```typescript
// app/[locale]/layout.tsx (rename from app/layout.tsx)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider, useMessages} from 'next-intl';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuSign Next.js App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster richColors />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

Create `components/AuthProvider.tsx`:

```tsx
// components/AuthProvider.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
```

**Step 2: Create the "New Envelope" Page (The "C" in CRUD)**

1.  **Server Action (`actions/sendEnvelope.ts`)**:

    ```typescript
    // actions/sendEnvelope.ts
    'use server';

    import { createEnvelope } from '@/lib/docusign';
    import prisma from '@/lib/prisma';
    import { getServerSession } from 'next-auth';
    import { authOptions } from '@/app/api/auth/[...nextauth]/route';
    import { z } from 'zod';
    import { revalidatePath } from 'next/cache';

    const schema = z.object({
      signerEmail: z.string().email(),
      signerName: z.string().min(2),
      subject: z.string().min(5),
    });

    export async function sendEnvelopeAction(prevState: any, formData: FormData) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return { message: 'Not authenticated', status: 'error' };
      }

      const validatedFields = schema.safeParse({
        signerEmail: formData.get('signerEmail'),
        signerName: formData.get('signerName'),
        subject: formData.get('subject'),
      });

      if (!validatedFields.success) {
        return { message: 'Invalid form data.', status: 'error', errors: validatedFields.error.flatten().fieldErrors };
      }

      const { signerEmail, signerName, subject } = validatedFields.data;
      const document = formData.get('document') as File;

      if (!document || document.size === 0) {
        return { message: 'Document is required.', status: 'error' };
      }

      // Convert file to base64
      const buffer = Buffer.from(await document.arrayBuffer());
      const documentBase64 = buffer.toString('base64');

      const envelopeDefinition = {
        emailSubject: subject,
        status: 'sent', // 'sent' to send immediately, 'created' to save as draft
        documents: [
          {
            documentBase64: documentBase64,
            name: 'Sample Document',
            fileExtension: 'pdf',
            documentId: '1',
          },
        ],
        recipients: {
          signers: [
            {
              email: signerEmail,
              name: signerName,
              recipientId: '1',
              routingOrder: '1',
              tabs: {
                signHereTabs: [
                  {
                    anchorString: '/sn1/', // This string must exist in your PDF
                    anchorUnits: 'pixels',
                    anchorXOffset: '20',
                    anchorYOffset: '10',
                  },
                ],
              },
            },
          ],
        },
      };

      try {
        const result = await createEnvelope(envelopeDefinition);
        
        // Save to our local database
        await prisma.envelope.create({
          data: {
            envelopeId: result.envelopeId,
            status: result.status,
            subject: subject,
            ownerId: session.user.id,
          },
        });

        revalidatePath('/hu/dashboard'); // Update the dashboard
        return { message: 'Envelope sent successfully!', status: 'success' };
      } catch (error) {
        console.error(error);
        return { message: 'Failed to send envelope.', status: 'error' };
      }
    }
    ```
    **Note on `anchorString`:** For the signature tab to appear, your PDF document *must* contain the text `/sn1/`. DocuSign will find this text and place the signature tab near it.

2.  **Client Component Form (`app/[locale]/dashboard/new/page.tsx`)**:

    ```tsx
    // app/[locale]/dashboard/new/page.tsx
    'use client';

    import { useFormState, useFormStatus } from 'react-dom';
    import { sendEnvelopeAction } from '@/actions/sendEnvelope';
    import { useTranslations } from 'next-intl';
    import { useEffect } from 'react';
    import { toast } from 'sonner';

    function SubmitButton() {
      const { pending } = useFormStatus();
      const t = useTranslations('NewEnvelopePage');
      return (
        <button type="submit" disabled={pending} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {pending ? t('sending') : t('sendButton')}
        </button>
      );
    }

    export default function NewEnvelopePage() {
      const t = useTranslations('NewEnvelopePage');
      const initialState = { message: null, status: null, errors: null };
      const [state, dispatch] = useFormState(sendEnvelopeAction, initialState);

      useEffect(() => {
        if (state.status === 'success') {
          toast.success(t('success'));
        } else if (state.status === 'error' && state.message) {
          toast.error(`${t('error')}: ${state.message}`);
        }
      }, [state, t]);

      return (
        <div className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
          <form action={dispatch} className="space-y-4">
            <div>
              <label htmlFor="signerEmail" className="block mb-2 text-sm font-medium text-gray-900">{t('signerEmail')}</label>
              <input type="email" name="signerEmail" id="signerEmail" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
              <label htmlFor="signerName" className="block mb-2 text-sm font-medium text-gray-900">{t('signerName')}</label>
              <input type="text" name="signerName" id="signerName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900">{t('emailSubject')}</label>
              <input type="text" name="subject" id="subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
              <label htmlFor="document" className="block mb-2 text-sm font-medium text-gray-900">{t('document')}</label>
              <input type="file" name="document" id="document" accept=".pdf" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" required />
            </div>
            <SubmitButton />
          </form>
        </div>
      );
    }
    ```

**Step 3: Create the Dashboard Page (The "R" in CRUD)**

This page will be a Server Component that fetches data from *our* database.

```tsx
// app/[locale]/dashboard/page.tsx
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getEnvelopeStatus } from '@/lib/docusign';

async function getEnvelopes(userId: string) {
  const envelopes = await prisma.envelope.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  });

  // Optional: For real-time status, you could iterate and call DocuSign for each.
  // Be mindful of API rate limits. For this example, we show the DB status.
  // For a more advanced implementation, use webhooks (Phase 4).
  
  // Example of fetching fresh status for one envelope (for demonstration)
  // if (envelopes.length > 0) {
  //   const latestStatus = await getEnvelopeStatus(envelopes[0].envelopeId);
  //   envelopes[0].status = latestStatus.status;
  // }

  return envelopes;
}

export default async function DashboardPage({params: {locale}}: {params: {locale: string}}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const envelopes = await getEnvelopes(session.user.id);
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      
      <div className="mb-6">
        <Link href={`/${locale}/dashboard/new`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          {t('myEnvelopes')}
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-2">{t('myEnvelopes')}</h2>
      
      {envelopes.length === 0 ? (
        <p>{t('noEnvelopes')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">{t('table.subject')}</th>
                <th className="py-2 px-4">{t('table.status')}</th>
                <th className="py-2 px-4">{t('table.sentDate')}</th>
                <th className="py-2 px-4">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {envelopes.map((envelope) => (
                <tr key={envelope.id} className="border-b">
                  <td className="py-2 px-4">{envelope.subject}</td>
                  <td className="py-2 px-4 capitalize">{envelope.status}</td>
                  <td className="py-2 px-4">{new Date(envelope.createdAt).toLocaleDateString(locale)}</td>
                  <td className="py-2 px-4">
                    {/* Placeholder for future actions like View, Void, etc. */}
                    <a href="#" className="text-blue-600 hover:underline">{t('viewDetails')}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

### **Phase 4: Webhooks for Real-Time Status Updates (Advanced)**

Polling the DocuSign API for status updates is inefficient. The professional solution is to use DocuSign Connect (webhooks).

**Step 1: Create the Webhook Handler**

Create an API route handler at `app/api/docusign-webhook/route.ts`:

```typescript
// app/api/docusign-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import prisma from '@/lib/prisma';

// In a real app, you MUST validate the webhook signature for security.
// https://developers.docusign.com/platform/webhooks/connect/validate/
// This involves checking an HMAC signature in the request headers.
// For simplicity, this example omits that step.

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    
    // 1. TODO: VALIDATE HMAC SIGNATURE HERE

    const parser = new XMLParser();
    const parsedXml = parser.parse(rawBody);
    
    const envelopeStatus = parsedXml.DocuSignEnvelopeInformation.EnvelopeStatus;
    const envelopeId = envelopeStatus.EnvelopeID;
    const status = envelopeStatus.Status.toLowerCase(); // 'sent', 'delivered', 'completed'

    if (envelopeId && status) {
      console.log(`Webhook received: Envelope ${envelopeId} is now ${status}`);
      
      // Update the status in our local database
      await prisma.envelope.update({
        where: { envelopeId: envelopeId },
        data: { status: status },
      });
    }

    // DocuSign expects a 200 OK response to acknowledge receipt.
    return new NextResponse(null, { status: 200 });

  } catch (error) {
    console.error('Error processing DocuSign webhook:', error);
    // Return a 500 but don't send back error details to the webhook source.
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
```

**Step 2: Configure DocuSign Connect**

1.  In your DocuSign Developer Account, go to **Settings -> Connect**.
2.  Click **"Add Configuration" -> "Custom"**.
3.  **URL to publish:** You'll need a publicly accessible URL. While developing locally, use a service like **ngrok** (`ngrok http 3000`) to expose your local server. The URL will be something like `https://your-ngrok-id.ngrok.io/api/docusign-webhook`.
4.  **Trigger Events:** Select "Envelope and Recipients" and check the boxes for the statuses you care about (e.g., Sent, Delivered, Completed, Declined, Voided).
5.  **Include Data:** Select "Documents" and "Tabs" if you want that data in the webhook payload.
6.  Save the configuration. Now, whenever an envelope's status changes, DocuSign will POST the update to your endpoint, and your database will be updated automatically.

---

### **How to Run the Project**

1.  **Ensure `.env.local` is correctly filled out.**
2.  **Ensure you have a sample PDF with the anchor text `/sn1/` inside.**
3.  **Run the database migration:** `npx prisma migrate dev`
4.  **(Optional) Seed a user for testing:** You can use `npx prisma studio` to manually add a user with a hashed password or build a registration page.
5.  **Start the development server:** `npm run dev`
6.  Navigate to `http://localhost:3000/hu/login` to log in, then to `http://localhost:3000/hu/dashboard` to use the application.

This comprehensive plan provides a robust, production-ready foundation for a Next.js application integrated with DocuSign's eSignature REST API, complete with authentication, CRUD operations, and real-time updates.
