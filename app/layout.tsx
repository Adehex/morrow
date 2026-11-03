import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Morrow — Considered secondhand fashion',
  description: 'Unique, quality-checked thrift fashion for wardrobes with a point of view. Shop Morrow in Lagos and beyond.',
  openGraph: {
    title: 'Morrow — Considered secondhand fashion',
    description: 'Unique, quality-checked thrift fashion for wardrobes with a point of view. Shop Morrow in Lagos and beyond.',
    siteName: 'Morrow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morrow — Considered secondhand fashion',
    description: 'Unique, quality-checked thrift fashion for wardrobes with a point of view. Shop Morrow in Lagos and beyond.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
