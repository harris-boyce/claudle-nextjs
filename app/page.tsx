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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ClaudLE
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-Enhanced Wordle with Claude
          </p>
        </div>
        <ClaudLE />
      </main>
    </>
  )
}