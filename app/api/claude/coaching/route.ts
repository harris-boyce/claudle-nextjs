import { NextRequest, NextResponse } from 'next/server'
import { claudeClient } from '@/lib/claude-client'
import { THEMES, ThemeKey, Personality } from '@/lib/game-types'

export async function POST(request: NextRequest) {
  try {
    // Feature flag check - disabled by default for cost control
    const enableInteractiveCoaching = process.env.ENABLE_INTERACTIVE_COACHING === 'true'

    if (!enableInteractiveCoaching) {
      return NextResponse.json({
        coaching: "Interactive coaching is currently disabled. Use the hint button for strategic advice!",
        enabled: false
      })
    }

    const {
      targetWord,
      guesses,
      currentGuess,
      theme = 'original',
      personality = 'lasso'
    } = await request.json()

    // Validate inputs
    if (!targetWord || !Array.isArray(guesses) || !currentGuess) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const themeData = THEMES[theme as ThemeKey]
    const guessCount = guesses.length

    // Analyze game state for sophisticated coaching
    const wrongLetters = new Set<string>()
    const correctLetters: Array<{ letter: string; position: number }> = []
    const wrongPositions: Array<{ letter: string; position: number }> = []

    // Analyze all previous guesses
    guesses.forEach((guess: string) => {
      for (let i = 0; i < 5; i++) {
        const letter = guess[i]
        if (targetWord[i] === letter) {
          correctLetters.push({ letter, position: i + 1 })
        } else if (targetWord.includes(letter)) {
          wrongPositions.push({ letter, position: i + 1 })
        } else {
          wrongLetters.add(letter)
        }
      }
    })

    // Analyze the current guess without revealing if it's correct
    const guessAnalysis: string[] = []
    for (let i = 0; i < 5; i++) {
      const letter = currentGuess[i]
      if (wrongLetters.has(letter)) {
        guessAnalysis.push(`${letter} (position ${i + 1}): Already ruled out`)
      } else if (correctLetters.some(c => c.letter === letter && c.position === i + 1)) {
        guessAnalysis.push(`${letter} (position ${i + 1}): Good - confirmed correct here`)
      } else if (correctLetters.some(c => c.letter === letter && c.position !== i + 1)) {
        guessAnalysis.push(`${letter} (position ${i + 1}): Wrong position - you know this letter belongs elsewhere`)
      }
    }

    const personalityPrompt = personality === 'lasso'
      ? "You are Coach Ted Lasso - positive, encouraging, folksy, and optimistic. Be supportive but educational."
      : "You are Roy Kent - gruff, direct, occasionally profane (but keep it mild), and brutally honest but helpful."

    const coachingPrompt = `${personalityPrompt}

The player is playing ClaudLE (theme: "${themeData?.description || 'Classic Words'}") and is considering the guess "${currentGuess}" for their ${guessCount + 1}th attempt.

Game state:
- Previous guesses: ${guesses.join(', ') || 'None yet'}
- Letters definitely not in word: ${Array.from(wrongLetters).join(', ') || 'None identified'}
- Confirmed correct positions: ${correctLetters.map(c => `${c.letter} in position ${c.position}`).join(', ') || 'None yet'}
- Letters in word but wrong position: ${wrongPositions.map(w => `${w.letter} (was tried in position ${w.position})`).join(', ') || 'None yet'}

Analysis of their potential guess "${currentGuess}":
${guessAnalysis.join('\n') || 'No obvious issues detected'}

WITHOUT revealing the target word, provide strategic coaching about this guess:
1. Is this a smart strategic choice given what they know?
2. Are they reusing ruled-out letters unnecessarily?
3. Are they placing confirmed letters in wrong positions?
4. Could they make a more strategic guess to gather more information?
5. Encourage good strategy and gently redirect poor choices.

Keep it under 100 words and stay in character. Be encouraging but educational.`

    const message = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: coachingPrompt
      }]
    })

    const coaching = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : ''

    return NextResponse.json({
      coaching,
      personality,
      guessCount: guessCount + 1,
      theme: themeData?.name || 'Classic Words',
      enabled: true
    })
  } catch (error) {
    console.error('Error getting coaching:', error)

    // Fallback coaching by personality
    const fallbackCoaching = {
      lasso: "Hmm, having trouble analyzing that one. But you know what? Trust your instincts! You've got this, and every guess is teaching us something new.",
      kent: "Right, can't analyze that properly right now. But listen - stick to what you know and don't overthink it. You've got the tools, use them."
    }

    return NextResponse.json({
      coaching: fallbackCoaching[request.json().personality as Personality] || fallbackCoaching.lasso,
      personality: request.json().personality || 'lasso',
      enabled: true,
      fallback: true
    })
  }
}