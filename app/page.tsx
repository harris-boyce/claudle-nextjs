import ClaudLE from '@/components/ClaudLE'

export default function Home() {
  return (
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
  )
}