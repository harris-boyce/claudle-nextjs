import ClaudLE from '@/components/ClaudLE'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ClaudLE",
  "description": "AI-Enhanced Wordle game with coaching from Ted Lasso and Roy Kent, featuring 10 unique themes and intelligent strategy tips powered by Claude AI",
  "url": "https://claudle.vercel.app",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "ClaudLE Team"
  },
  "gameItem": {
    "@type": "Game",
    "name": "ClaudLE",
    "description": "Word puzzle game enhanced with AI coaching",
    "genre": "Puzzle"
  }
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container mx-auto px-4 py-8">
        <ClaudLE />
      </main>
    </>
  )
}