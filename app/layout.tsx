import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const siteTitle = 'Cursor Nairobi Meetup Card'
const siteDescription =
  'Generate the Cursor Nairobi Meetup social card from the provided Figma reference.'
const ogImage = {
  url: '/cursor-community-avatar.svg',
  width: 1200,
  height: 1200,
  alt: 'Cursor Community',
  type: 'image/svg+xml',
}

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/cursor-community-avatar.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/cursor-community-avatar.svg',
    apple: '/cursor-community-avatar.svg',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only left-4 top-4 z-50 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed"
        >
          Skip to Main Content
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
