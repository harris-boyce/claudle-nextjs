import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://claudle.vercel.app'),
  title: 'ClaudLE - AI-Enhanced Wordle with Ted Lasso & Roy Kent Coaching',
  description: 'Play Wordle with AI-powered hints and coaching from Ted Lasso or Roy Kent! 10 unique themes, interactive coaching, and intelligent strategy tips powered by Claude AI.',
  keywords: ['wordle', 'game', 'ai', 'claude', 'puzzle', 'word game', 'ted lasso', 'roy kent', 'coaching', 'hints', 'strategy', 'themes'],
  authors: [{ name: 'ClaudLE Team' }],
  category: 'Games',
  creator: 'ClaudLE Team',
  publisher: 'ClaudLE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClaudLE - AI-Enhanced Wordle with Coaching',
    description: 'Play Wordle with AI-powered hints and coaching from Ted Lasso or Roy Kent! 10 unique themes, interactive coaching, and intelligent strategy tips.',
    url: 'https://claudle.vercel.app',
    siteName: 'ClaudLE',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClaudLE - AI-Enhanced Wordle with Ted Lasso and Roy Kent Coaching',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClaudLE - AI-Enhanced Wordle',
    description: 'Play Wordle with AI coaching from Ted Lasso or Roy Kent! 10 themes, interactive hints, and intelligent strategy tips.',
    images: ['/og-image.png'],
    creator: '@claudle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <Analytics />
      </body>
    </html>
  )
}