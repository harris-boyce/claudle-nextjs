'use client'

import { useState, useEffect } from 'react'
import { GameData, GameState, Difficulty, HintType } from '@/lib/game-types'
import { checkGuess, getKeyboardState, isValidWord } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'
import Modal from './Modal'

export default function ClaudLE() {
  const [gameData, setGameData] = useState<GameData>({
    targetWord: '',
    guesses: [],
    currentGuess: '',
    gameState: 'playing',
    difficulty: 'medium',
    hintsUsed: 0,
    maxGuesses: 6
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hint, setHint] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  // API integration functions
  const generateNewWord = async (difficulty: Difficulty = 'medium') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/claude/generate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty })
      })
      const data = await response.json()
      return data.word
    } catch (error) {
      console.error('Failed to generate word:', error)
      return 'HELLO' // fallback
    } finally {
      setIsLoading(false)
    }
  }

  const getHint = async (hintType: HintType = 'gentle') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/claude/get-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: gameData.targetWord,
          guesses: gameData.guesses.map(g => g.word),
          hintType
        })
      })
      const data = await response.json()
      setHint(data.hint)
      setShowHint(true)
      setGameData(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
    } catch (error) {
      console.error('Failed to get hint:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGameOverFeedback = async () => {
    try {
      const response = await fetch('/api/claude/game-over', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: gameData.targetWord,
          guesses: gameData.guesses.map(g => g.word),
          won: gameData.gameState === 'won',
          guessCount: gameData.guesses.length
        })
      })
      const data = await response.json()
      return data.feedback
    } catch (error) {
      console.error('Failed to get feedback:', error)
      return ''
    }
  }

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      const word = await generateNewWord(gameData.difficulty)
      setGameData(prev => ({ ...prev, targetWord: word }))
    }
    initGame()
  }, [gameData.difficulty])

  const startNewGame = async () => {
    const word = await generateNewWord(gameData.difficulty)
    setGameData({
      targetWord: word,
      guesses: [],
      currentGuess: '',
      gameState: 'playing',
      difficulty: gameData.difficulty,
      hintsUsed: 0,
      maxGuesses: 6
    })
    setHint('')
    setShowHint(false)
    setGameOver(false)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Game controls */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={gameData.difficulty}
          onChange={(e) => setGameData(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
          className="px-3 py-2 border rounded-md"
          disabled={gameData.gameState === 'playing' && gameData.guesses.length > 0}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={startNewGame}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'New Game'}
        </button>
      </div>

      {/* AI Assistance */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => getHint('gentle')}
          disabled={isLoading || gameData.gameState !== 'playing'}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Gentle Hint
        </button>
        <button
          onClick={() => getHint('strategic')}
          disabled={isLoading || gameData.gameState !== 'playing'}
          className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          Strategy Tip
        </button>
        <button
          onClick={() => getHint('direct')}
          disabled={isLoading || gameData.gameState !== 'playing'}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Direct Hint
        </button>
      </div>

      {/* Game board placeholder */}
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Game Board</h3>
        <p className="text-gray-600">
          Target: {gameData.targetWord || 'Loading...'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Hints used: {gameData.hintsUsed}
        </p>
        {gameData.currentGuess && (
          <p className="text-sm mt-2">Current: {gameData.currentGuess}</p>
        )}
      </div>

      {/* Hint Modal */}
      <Modal
        isOpen={showHint}
        onClose={() => setShowHint(false)}
        title="Claude's Hint"
      >
        <div className="text-gray-700 dark:text-gray-300">
          {hint}
        </div>
      </Modal>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-3">
            <LoadingSpinner />
            <span>Claude is thinking...</span>
          </div>
        </div>
      )}
    </div>
  )
}