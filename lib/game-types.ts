export type LetterState = 'correct' | 'present' | 'absent' | 'empty'

export type TileState = {
  letter: string
  state: LetterState
}

export type GameState = 'playing' | 'won' | 'lost'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type HintType = 'gentle' | 'strategic' | 'direct'

export type ThemeKey = 'original' | 'theater' | 'harry-potter' | 'disney' | 'marine-biology' | 'billy-joel' | 'cooking' | 'space' | 'sports' | 'nature'

export type Personality = 'lasso' | 'kent'

export interface Theme {
  name: string
  description: string
  difficulty: string
  icon: string
}

export const THEMES: Record<ThemeKey, Theme> = {
  original: {
    name: "Classic Words",
    description: "Common English words suitable for Wordle",
    difficulty: "Medium",
    icon: "📝"
  },
  theater: {
    name: "Theater & Drama",
    description: "Drama, stage, and performance terms",
    difficulty: "Hard",
    icon: "🎭"
  },
  "harry-potter": {
    name: "Wizarding World",
    description: "Harry Potter spells, characters, and magical terms",
    difficulty: "Hard",
    icon: "⚡"
  },
  disney: {
    name: "Disney Magic",
    description: "Disney characters, movies, and magical words",
    difficulty: "Medium",
    icon: "🏰"
  },
  "marine-biology": {
    name: "Ocean Depths",
    description: "Marine creatures and underwater terms",
    difficulty: "Hard",
    icon: "🌊"
  },
  "billy-joel": {
    name: "Piano Man",
    description: "Billy Joel songs and music terms",
    difficulty: "Hard",
    icon: "🎹"
  },
  cooking: {
    name: "Culinary Arts",
    description: "Food, cooking, and kitchen terms",
    difficulty: "Medium",
    icon: "👨‍🍳"
  },
  space: {
    name: "Cosmic Journey",
    description: "Astronomy and space exploration",
    difficulty: "Medium",
    icon: "🚀"
  },
  sports: {
    name: "Athletic Arena",
    description: "Sports, games, and athletic terms",
    difficulty: "Easy",
    icon: "⚽"
  },
  nature: {
    name: "Wild Kingdom",
    description: "Plants, animals, and natural phenomena",
    difficulty: "Easy",
    icon: "🌿"
  }
}

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
}

export interface GuessResult {
  word: string
  tiles: TileState[]
}

export interface GameData {
  targetWord: string
  guesses: GuessResult[]
  currentGuess: string
  gameState: GameState
  difficulty: Difficulty
  hintsUsed: number
  maxGuesses: number
}

export const WORD_LENGTH = 5
export const MAX_GUESSES = 6

export const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]