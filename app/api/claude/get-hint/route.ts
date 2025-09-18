import { NextRequest, NextResponse } from 'next/server'
import { claudeClient, checkApiKey } from '@/lib/claude-client'
import { THEMES, ThemeKey, Personality } from '@/lib/game-types'

export async function POST(request: NextRequest) {
  try {
    checkApiKey()
    const {
      targetWord,
      guesses,
      theme = 'original',
      personality = 'lasso'
    } = await request.json()

    // Validate inputs
    if (!targetWord || !Array.isArray(guesses)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const themeData = THEMES[theme as ThemeKey]
    const guessCount = guesses.length

    // Analyze game state for context
    const wrongLetters: string[] = []
    const correctLetters: Array<{ letter: string; position: number }> = []
    const wrongPositions: Array<{ letter: string; position: number }> = []

    guesses.forEach((guess: string) => {
      for (let i = 0; i < 5; i++) {
        const letter = guess[i]
        if (targetWord[i] === letter) {
          correctLetters.push({ letter, position: i + 1 })
        } else if (targetWord.includes(letter)) {
          wrongPositions.push({ letter, position: i + 1 })
        } else {
          wrongLetters.push(letter)
        }
      }
    })

    // Personality-driven prompt
    const personalityPrompt = personality === 'lasso'
      ? "You are Coach Ted Lasso - positive, encouraging, folksy, and optimistic. Use his speaking style and catchphrases."
      : "You are Roy Kent - gruff, direct, occasionally profane (but keep it mild), and brutally honest but caring underneath."

    const hintPrompt = `${personalityPrompt}

The player is playing ClaudLE with the theme "${themeData?.description || 'Classic Words'}". They're on guess ${guessCount} of 6.

Target word: ${targetWord}
Their guesses so far: ${guesses.join(', ') || 'None yet'}
Letters not in the word: ${[...new Set(wrongLetters)].join(', ') || 'None identified yet'}
Correct letters in correct positions: ${correctLetters.map(c => `${c.letter} in position ${c.position}`).join(', ') || 'None yet'}
Correct letters in wrong positions: ${wrongPositions.map(w => `${w.letter} (tried in position ${w.position})`).join(', ') || 'None yet'}

Give them a helpful hint without revealing the answer. Make the hint more specific as they get closer to guess 6. Stay in character!`

    const message = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: hintPrompt
      }]
    })

    const hint = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : ''

    return NextResponse.json({
      hint,
      personality,
      guessCount,
      theme: themeData?.name || 'Classic Words'
    })
  } catch (error) {
    console.error('Error getting hint:', error)

    // Fallback hints by personality
    const fallbackHints = {
      lasso: "Well, I believe in you! Sometimes the best strategy is to trust your gut and remember that every guess teaches us something new. You're doing great out there!",
      kent: "Right, you're overthinking this. Focus on what you know and stop second-guessing yourself. You've got the letters, now use them properly."
    }

    return NextResponse.json({
      hint: fallbackHints.lasso,
      personality: 'lasso',
      fallback: true
    })
  }
}