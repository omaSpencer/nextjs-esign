import type { Metadata } from 'next'
import { Fira_Mono, Inter, Merriweather } from 'next/font/google'
import './globals.css'

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fontMono = Fira_Mono({
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const fontSerif = Merriweather({
  variable: '--font-serif',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'DocuSign NextJS Starter',
  description: 'DocuSign NextJS Starter',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontMono.variable} ${fontSans.variable} ${fontSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
