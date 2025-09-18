import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LetterState, TileState, GuessResult } from './game-types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkGuess(guess: string, targetWord: string): GuessResult {
  const tiles: TileState[] = []
  const targetLetters = targetWord.split('')
  const guessLetters = guess.split('')

  // First pass: mark correct letters
  const remainingTarget: string[] = []
  const remainingGuess: { letter: string; index: number }[] = []

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      tiles[i] = { letter: guessLetters[i], state: 'correct' }
    } else {
      tiles[i] = { letter: guessLetters[i], state: 'absent' }
      remainingTarget.push(targetLetters[i])
      remainingGuess.push({ letter: guessLetters[i], index: i })
    }
  }

  // Second pass: mark present letters
  for (const { letter, index } of remainingGuess) {
    const targetIndex = remainingTarget.indexOf(letter)
    if (targetIndex !== -1) {
      tiles[index].state = 'present'
      remainingTarget.splice(targetIndex, 1)
    }
  }

  return { word: guess, tiles }
}

export function getKeyboardState(guesses: GuessResult[]): Record<string, LetterState> {
  const keyboardState: Record<string, LetterState> = {}

  for (const guess of guesses) {
    for (const tile of guess.tiles) {
      const currentState = keyboardState[tile.letter]

      // Priority: correct > present > absent
      if (tile.state === 'correct') {
        keyboardState[tile.letter] = 'correct'
      } else if (tile.state === 'present' && currentState !== 'correct') {
        keyboardState[tile.letter] = 'present'
      } else if (!currentState) {
        keyboardState[tile.letter] = tile.state
      }
    }
  }

  return keyboardState
}

export function isValidWord(word: string): boolean {
  // Basic validation - you might want to add a word list check
  return /^[A-Z]{5}$/.test(word)
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function getShareText(guesses: GuessResult[], won: boolean, difficulty: string): string {
  const guessCount = won ? guesses.length : 'X'
  const maxGuesses = 6

  let text = `ClaudLE ${guessCount}/${maxGuesses} (${difficulty})\n\n`

  for (const guess of guesses) {
    for (const tile of guess.tiles) {
      switch (tile.state) {
        case 'correct':
          text += '🟩'
          break
        case 'present':
          text += '🟨'
          break
        case 'absent':
          text += '⬜'
          break
      }
    }
    text += '\n'
  }

  text += '\nPlay at: claudle.vercel.app'

  return text
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export function saveGameStats(stats: any): void {
  try {
    localStorage.setItem('claudle-stats', JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save game stats:', error)
  }
}

export function loadGameStats(): any {
  try {
    const saved = localStorage.getItem('claudle-stats')
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0]
    }
  } catch (error) {
    console.error('Failed to load game stats:', error)
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0]
    }
  }
}