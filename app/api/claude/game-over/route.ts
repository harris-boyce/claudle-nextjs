import { NextRequest, NextResponse } from 'next/server'
import { claudeClient } from '@/lib/claude-client'
import { THEMES, ThemeKey, Personality } from '@/lib/game-types'

export async function POST(request: NextRequest) {
  try {
    const {
      targetWord,
      guesses,
      won,
      theme = 'original',
      personality = 'lasso'
    } = await request.json()

    // Validate inputs
    if (!targetWord || !Array.isArray(guesses) || typeof won !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const themeData = THEMES[theme as ThemeKey]
    const guessCount = guesses.length

    // Personality-driven prompt
    const personalityPrompt = personality === 'lasso'
      ? "You are Coach Ted Lasso - positive, encouraging, folksy, and optimistic. Use his speaking style and catchphrases."
      : "You are Roy Kent - gruff, direct, occasionally profane (but keep it mild), and brutally honest but caring underneath."

    const messagePrompt = `${personalityPrompt}

The player just ${won ? 'won' : 'lost'} a ClaudLE game. The word was "${targetWord}" and they took ${guessCount} guesses.
Theme: ${themeData?.description || 'Classic Words'}

${won
  ? 'Give them a congratulatory message in character.'
  : 'Give them an encouraging "better luck next time" message. If you\'re Ted Lasso, you might say "Remember...be a goldfish..." If you\'re Roy Kent, you might say "Oy, that\'s gotta sting..."'
}

Keep it short and stay in character!`

    const message = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: messagePrompt
      }]
    })

    const feedback = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : ''

    return NextResponse.json({
      feedback,
      won,
      guessCount,
      personality,
      theme: themeData?.name || 'Classic Words',
      targetWord
    })
  } catch (error) {
    console.error('Error getting game over feedback:', error)

    // Fallback messages by personality and outcome
    const fallbackMessages = {
      lasso: {
        won: "Well, would you look at that! You did it! That's what I call some top-notch word-guessing right there. Keep that positive energy flowing!",
        lost: "Hey now, don't you worry about it. Remember, be a goldfish - short memory for the tough times. You'll get 'em next time, I believe in you!"
      },
      kent: {
        won: "Not bad. You actually did it. Proper job there. Don't let it go to your head though.",
        lost: "Oy, that's gotta sting a bit. But you know what? You gave it a proper go. Dust yourself off and try again."
      }
    }

    const personalityKey = request.json().personality as Personality || 'lasso'
    const outcomeKey = request.json().won ? 'won' : 'lost'

    return NextResponse.json({
      feedback: fallbackMessages[personalityKey][outcomeKey],
      won: request.json().won,
      guessCount: request.json().guesses?.length || 0,
      personality: personalityKey,
      fallback: true
    })
  }
}