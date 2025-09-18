import { NextRequest, NextResponse } from 'next/server'
import { claudeClient, checkApiKey } from '@/lib/claude-client'
import { THEMES, ThemeKey } from '@/lib/game-types'

export async function POST(request: NextRequest) {
  try {
    checkApiKey()
    const { theme = 'original', usedWords = [] } = await request.json()

    // Validate theme
    if (!THEMES[theme as ThemeKey]) {
      return NextResponse.json(
        { error: 'Invalid theme specified' },
        { status: 400 }
      )
    }

    const themeData = THEMES[theme as ThemeKey]

    // Build exclusion text for used words
    const excludeText = usedWords.length > 0
      ? `Do NOT use any of these words that have already been used: ${usedWords.join(', ')}.`
      : ''

    const prompt = `Generate exactly one 5-letter word for a Wordle game with the theme: "${themeData.description}".

Requirements:
- Exactly 5 letters
- Uses only standard English alphabet (A-Z)
- Must be a real, common word that players would know
- Appropriate for the theme: ${themeData.description}
${excludeText}

Respond with ONLY the word in uppercase letters, nothing else.`

    const message = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const word = message.content[0].type === 'text'
      ? message.content[0].text.trim().toUpperCase()
      : ''

    // Validate word format
    if (word.length !== 5 || !/^[A-Z]+$/.test(word)) {
      throw new Error('Invalid word generated')
    }

    // Check if word was already used
    if (usedWords.includes(word)) {
      // Retry with stronger exclusion prompt
      return POST(request)
    }

    return NextResponse.json({
      word,
      theme: themeData.name,
      difficulty: themeData.difficulty
    })
  } catch (error) {
    console.error('Error generating word:', error)

    // Fallback words by theme
    const fallbackWords: Record<string, string> = {
      original: 'AUDIO',
      theater: 'STAGE',
      'harry-potter': 'MAGIC',
      disney: 'MOUSE',
      'marine-biology': 'WHALE',
      'billy-joel': 'PIANO',
      cooking: 'SPICE',
      space: 'ORBIT',
      sports: 'FIELD',
      nature: 'FLORA'
    }

    const fallbackTheme = 'original'
    return NextResponse.json({
      word: fallbackWords[fallbackTheme] || 'AUDIO',
      theme: THEMES[fallbackTheme].name,
      difficulty: THEMES[fallbackTheme].difficulty,
      fallback: true
    })
  }
}