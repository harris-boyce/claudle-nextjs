import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClaudLE - AI-Enhanced Wordle',
  description: 'A Wordle game enhanced with AI hints and coaching from Claude',
  keywords: ['wordle', 'game', 'ai', 'claude', 'puzzle', 'word game'],
  authors: [{ name: 'ClaudLE Team' }],
  openGraph: {
    title: 'ClaudLE - AI-Enhanced Wordle',
    description: 'A Wordle game enhanced with AI hints and coaching from Claude',
    url: 'https://claudle.vercel.app',
    siteName: 'ClaudLE',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClaudLE - AI-Enhanced Wordle',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClaudLE - AI-Enhanced Wordle',
    description: 'A Wordle game enhanced with AI hints and coaching from Claude',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          {children}
        </div>
      </body>
    </html>
  )
}