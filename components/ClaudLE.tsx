'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, HelpCircle, Loader2, X, Trophy, Lightbulb, Settings, Zap, BarChart3, Brain } from 'lucide-react'
import { THEMES, ThemeKey, Personality } from '@/lib/game-types'
import { getDeviceInfo, updateDeviceAnalytics } from '@/lib/device-analytics'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import InstallPrompt from './InstallPrompt'

const ClaudLE = () => {
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameState, setGameState] = useState('playing')
  const [targetWord, setTargetWord] = useState('')
  const [theme, setTheme] = useState<ThemeKey>('original')
  const [personality, setPersonality] = useState<Personality>('lasso')
  const [gameStarted, setGameStarted] = useState(false)
  const [usedWords, setUsedWords] = useState(new Set<string>())
  const [useAudioStart, setUseAudioStart] = useState(true)
  const [interactiveCoach, setInteractiveCoach] = useState(false)

  // Modal states
  const [showHintModal, setShowHintModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [hintText, setHintText] = useState('')
  const [gameOverMessage, setGameOverMessage] = useState('')

  // Interactive coaching states
  const [coachingText, setCoachingText] = useState('')
  const [isLoadingCoaching, setIsLoadingCoaching] = useState(false)
  const [showCoaching, setShowCoaching] = useState(false)

  // Loading states
  const [isLoadingWord, setIsLoadingWord] = useState(false)
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  const [isLoadingGameOver, setIsLoadingGameOver] = useState(false)
  const [wordGenerationError, setWordGenerationError] = useState('')

  // Animation states
  const [shakeRow, setShakeRow] = useState<number | null>(null)
  const [flipRow, setFlipRow] = useState<number | null>(null)

  // Install prompt
  const [installPromptState, installPromptActions] = useInstallPrompt()

  // Game statistics
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0]
  })

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, size = "md" }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
  }) => {
    if (!isOpen) return null

    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl"
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // Loading Spinner Component
  const LoadingSpinner = ({ text, icon: Icon = Loader2 }: { text: string; icon?: React.ComponentType<any> }) => (
    <div className="flex items-center justify-center space-x-3 py-6">
      <Icon className="animate-spin h-6 w-6 text-blue-500" />
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  )

  // Load stats from localStorage and initialize device tracking
  useEffect(() => {
    const savedStats = localStorage.getItem('claudle-stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    // Initialize device analytics (creates device ID if needed)
    getDeviceInfo()
  }, [])

  // Update stats
  const updateStats = (won: boolean, guessCount: number) => {
    // Update device analytics
    updateDeviceAnalytics({
      gameWon: won,
      guessCount,
      theme,
      personality
    })

    setStats(prev => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: won ? prev.currentStreak + 1 : 0,
        maxStreak: won ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
        guessDistribution: [...prev.guessDistribution]
      }

      if (won && guessCount <= 6) {
        newStats.guessDistribution[guessCount - 1]++
      }

      localStorage.setItem('claudle-stats', JSON.stringify(newStats))
      return newStats
    })
  }

  // Get word from Claude
  const getNewWord = async () => {
    setIsLoadingWord(true)
    setWordGenerationError('')

    try {
      const usedWordsArray = Array.from(usedWords)

      const response = await fetch("/api/claude/generate-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          usedWords: usedWordsArray
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const word = data.word

      if (word.length !== 5 || !/^[A-Z]+$/.test(word)) {
        throw new Error('Invalid word generated')
      }

      if (usedWords.has(word)) {
        return getNewWord()
      }

      return word
    } catch (error) {
      console.error('Error generating word:', error)
      setWordGenerationError('Failed to generate word. Please try again.')
      return 'AUDIO'
    } finally {
      setIsLoadingWord(false)
    }
  }

  // Get interactive coaching analysis
  const analyzeCurrentGuess = useCallback(async (guess: string) => {
    if (!interactiveCoach || guess.length !== 5 || gameState !== 'playing') return

    setIsLoadingCoaching(true)
    setShowCoaching(true)

    try {
      const response = await fetch("/api/claude/coaching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetWord,
          guesses,
          currentGuess: guess,
          theme,
          personality
        })
      })

      const data = await response.json()
      setCoachingText(data.coaching)
    } catch (error) {
      console.error('Error getting coaching:', error)
      setCoachingText('Hmm, having trouble analyzing that one. But you got this!')
    } finally {
      setIsLoadingCoaching(false)
    }
  }, [interactiveCoach, gameState, guesses, targetWord, theme, personality])

  // Debounced coaching effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentGuess.length === 5 && interactiveCoach && gameState === 'playing') {
        analyzeCurrentGuess(currentGuess)
      } else {
        setShowCoaching(false)
      }
    }, 1000) // 1 second delay to avoid too many API calls

    return () => clearTimeout(timer)
  }, [currentGuess, interactiveCoach, gameState, guesses, targetWord, analyzeCurrentGuess])

  // Initialize game
  const startNewGame = async () => {
    setGameStarted(true)
    const newWord = await getNewWord()
    setTargetWord(newWord)
    setUsedWords(prev => new Set(prev).add(newWord))
    setGuesses(useAudioStart ? ['AUDIO'] : [])
    setCurrentGuess('')
    setGameState('playing')
    setShowGameOverModal(false)
    setShowHintModal(false)
    setShowCoaching(false)
    setCoachingText('')
    setShakeRow(null)
    setFlipRow(null)
  }

  // Get hint from Claude
  const getHint = async () => {
    setIsLoadingHint(true)
    setShowHintModal(true)
    setHintText('')

    try {
      const response = await fetch("/api/claude/get-hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetWord,
          guesses,
          theme,
          personality
        })
      })

      const data = await response.json()
      setHintText(data.hint)
    } catch (error) {
      console.error('Error getting hint:', error)
      setHintText('Sorry, I can\'t provide a hint right now. Keep trying!')
    } finally {
      setIsLoadingHint(false)
    }
  }

  // Get game over message
  const getGameOverMessage = async (won: boolean) => {
    setIsLoadingGameOver(true)

    try {
      const response = await fetch("/api/claude/game-over", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetWord,
          guesses,
          won,
          theme,
          personality
        })
      })

      const data = await response.json()
      setGameOverMessage(data.feedback)
    } catch (error) {
      const fallbackMessage = won
        ? (personality === 'lasso' ? "Congratulations! You did it!" : "Not bad. You got there.")
        : (personality === 'lasso' ? "Remember...be a goldfish!" : "Oy, that's gotta sting...")
      setGameOverMessage(fallbackMessage)
    } finally {
      setIsLoadingGameOver(false)
    }
  }

  // Handle guess submission
  const submitGuess = () => {
    if (currentGuess.length !== 5 || gameState !== 'playing') {
      setShakeRow(guesses.length)
      setTimeout(() => setShakeRow(null), 500)
      return
    }

    const newGuesses = [...guesses, currentGuess.toUpperCase()]
    setGuesses(newGuesses)
    setFlipRow(guesses.length)
    setShowCoaching(false)

    if (currentGuess.toUpperCase() === targetWord) {
      setGameState('won')
      updateStats(true, newGuesses.length)
      setTimeout(() => {
        getGameOverMessage(true)
        setShowGameOverModal(true)
        checkInstallPrompt()
      }, 1500)
    } else if (newGuesses.length >= 6) {
      setGameState('lost')
      updateStats(false, newGuesses.length)
      setTimeout(() => {
        getGameOverMessage(false)
        setShowGameOverModal(true)
        checkInstallPrompt()
      }, 1500)
    }

    setCurrentGuess('')
    setTimeout(() => setFlipRow(null), 1500)
  }

  // Get letter status for coloring
  const getLetterStatus = (guess: string, letterIndex: number) => {
    const letter = guess[letterIndex]
    const targetLetter = targetWord[letterIndex]

    if (letter === targetLetter) {
      return 'correct'
    } else if (targetWord.includes(letter)) {
      return 'present'
    } else {
      return 'absent'
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5 && /^[A-Z]*$/.test(value)) {
      setCurrentGuess(value)
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitGuess()
    }
  }

  // Reset used words when theme changes
  useEffect(() => {
    setUsedWords(new Set())
  }, [theme])

  // Calculate win rate
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0

  // Check if we should show install prompt
  const checkInstallPrompt = () => {
    if (!installPromptState.isInstalled && installPromptState.shouldShow && !installPromptState.canInstall) {
      // For platforms that need manual prompting (iOS Safari, etc.)
      setTimeout(() => installPromptActions.showInstallPrompt(), 2000)
    }
  }

  if (!gameStarted) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ClaudLE
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Word Guessing with Interactive Coach
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Your Theme:
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {Object.entries(THEMES).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as ThemeKey)}
                  className={`p-3 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                    theme === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{themeData.icon}</span>
                    <div>
                      <div className={`font-medium text-sm ${theme === key ? 'text-gray-900 dark:text-white' : ''}`}>{themeData.name}</div>
                      <div className={`text-xs ${theme === key ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{themeData.difficulty}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Your Coach:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPersonality('lasso')}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  personality === 'lasso'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`font-medium ${personality === 'lasso' ? 'text-gray-900 dark:text-white' : ''}`}>Ted Lasso 😊</div>
                <div className={`text-xs ${personality === 'lasso' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>Positive & Encouraging</div>
              </button>
              <button
                onClick={() => setPersonality('kent')}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  personality === 'kent'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`font-medium ${personality === 'kent' ? 'text-gray-900 dark:text-white' : ''}`}>Roy Kent 😤</div>
                <div className={`text-xs ${personality === 'kent' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>Gruff but Caring</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Start with &quot;AUDIO&quot;</span>
              <div className="text-sm text-gray-500 dark:text-gray-400">Begin each game with AUDIO as first guess</div>
            </div>
            <button
              onClick={() => setUseAudioStart(!useAudioStart)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                useAudioStart ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-0.5 ${
                useAudioStart ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Interactive Coach</span>
              <div className="text-sm text-gray-500 dark:text-gray-400">Get real-time strategy advice as you type</div>
            </div>
            <button
              onClick={() => setInteractiveCoach(!interactiveCoach)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                interactiveCoach ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-0.5 ${
                interactiveCoach ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <button
            onClick={startNewGame}
            disabled={isLoadingWord}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center shadow-lg"
          >
            {isLoadingWord ? (
              <LoadingSpinner text="Generating Word..." />
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Start ClaudLE
              </>
            )}
          </button>

          {wordGenerationError && (
            <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
              {wordGenerationError}
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="font-medium mb-2">How to play ClaudLE:</p>
          <ul className="space-y-1">
            <li>🎯 You have 6 tries to guess the 5-letter word</li>
            <li>🟩 Green = correct letter, correct position</li>
            <li>🟨 Yellow = correct letter, wrong position</li>
            <li>⬜ Gray = letter not in word</li>
            <li>💡 Ask your AI coach for hints when stuck!</li>
            <li>🤖 Interactive Coach gives real-time strategy tips!</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <span className="mr-2">{THEMES[theme].icon}</span>
            ClaudLE
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {THEMES[theme].name} • {personality === 'lasso' ? 'Ted Lasso 😊' : 'Roy Kent 😤'}
            {interactiveCoach && <span className="ml-2 text-purple-600 font-medium">• Interactive</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowStatsModal(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all transform hover:scale-105"
            title="Statistics"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all transform hover:scale-105"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={startNewGame}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all transform hover:scale-105"
            disabled={isLoadingWord}
            title="New Game"
          >
            {isLoadingWord ? <Loader2 className="animate-spin h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="text-gray-700 dark:text-gray-300">Progress: {guesses.length}/6</span>
          <span className="text-gray-700 dark:text-gray-300">Words played: {usedWords.size}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(guesses.length / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Game Board */}
      <div className="grid gap-2 mb-6">
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-5 gap-2 ${
              shakeRow === rowIndex ? 'animate-pulse' : ''
            } ${
              flipRow === rowIndex ? 'animate-bounce' : ''
            }`}
          >
            {Array.from({ length: 5 }, (_, colIndex) => {
              const guess = guesses[rowIndex]
              const isCurrentRow = rowIndex === guesses.length && gameState === 'playing'
              const letter = isCurrentRow && currentGuess[colIndex] ? currentGuess[colIndex] :
                            guess ? guess[colIndex] : ''

              let bgColor = 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'

              if (guess) {
                const status = getLetterStatus(guess, colIndex)
                if (status === 'correct') bgColor = 'bg-green-500 text-white border-green-500 shadow-md'
                else if (status === 'present') bgColor = 'bg-yellow-500 text-white border-yellow-500 shadow-md'
                else bgColor = 'bg-gray-400 text-white border-gray-400'
              } else if (isCurrentRow && letter) {
                bgColor = 'bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500 transform scale-105 text-gray-900 dark:text-white'
              }

              return (
                <div
                  key={colIndex}
                  className={`w-12 h-12 flex items-center justify-center text-lg font-bold uppercase transition-all duration-300 rounded ${bgColor} ${!guess && !letter ? 'text-gray-900 dark:text-white' : ''}`}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Interactive Coaching Panel */}
      {gameState === 'playing' && interactiveCoach && showCoaching && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-2xl">
              {personality === 'lasso' ? '😊' : '😤'}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">
                  {personality === 'lasso' ? 'Coach Lasso' : 'Roy Kent'} says:
                </span>
              </div>
              {isLoadingCoaching ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin h-4 w-4 text-purple-600" />
                  <span className="text-sm text-purple-700">Analyzing your strategy...</span>
                </div>
              ) : (
                <p className="text-sm text-purple-800 leading-relaxed">{coachingText}</p>
              )}
            </div>
            <button
              onClick={() => setShowCoaching(false)}
              className="flex-shrink-0 text-purple-400 hover:text-purple-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      {gameState === 'playing' && (
        <div className="mb-4">
          <input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-center text-lg font-bold uppercase focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
            placeholder="Enter your guess"
            maxLength={5}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <div className="flex space-x-2 mt-3">
            <button
              onClick={submitGuess}
              disabled={currentGuess.length !== 5}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-md"
            >
              Submit Guess
            </button>
            <button
              onClick={getHint}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md"
              title="Get Hint"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        title={`💡 Hint from ${personality === 'lasso' ? 'Coach Lasso' : 'Roy Kent'}`}
      >
        {isLoadingHint ? (
          <LoadingSpinner text="Getting hint..." icon={Lightbulb} />
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 leading-relaxed">{hintText}</p>
            </div>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
            >
              Got it! Thanks Coach!
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title={gameState === 'won' ? '🎉 Congratulations!' : '😔 Game Over'}
      >
        {isLoadingGameOver ? (
          <LoadingSpinner text="Getting message from your coach..." />
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xl mb-2">
                The word was: <span className="font-bold text-blue-600 text-2xl">{targetWord}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Solved in {guesses.length}/6 guesses
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{gameOverMessage}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowGameOverModal(false)
                  setShowStatsModal(true)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              >
                View Stats
              </button>
              <button
                onClick={startNewGame}
                disabled={isLoadingWord}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoadingWord ? 'Loading...' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="📊 Your ClaudLE Statistics"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-600">Played</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{winRate}%</div>
              <div className="text-xs text-gray-600">Win Rate</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.currentStreak}</div>
              <div className="text-xs text-gray-600">Current Streak</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.maxStreak}</div>
              <div className="text-xs text-gray-600">Max Streak</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Guess Distribution</h4>
            {stats.guessDistribution.map((count, index) => {
              const maxCount = Math.max(...stats.guessDistribution, 1)
              const width = (count / maxCount) * 100
              return (
                <div key={index} className="flex items-center space-x-3 mb-2">
                  <span className="w-4 text-sm font-medium">{index + 1}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(width, count > 0 ? 20 : 0)}%` }}
                    >
                      {count > 0 && <span className="text-xs text-white font-bold">{count}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setShowStatsModal(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="⚙️ ClaudLE Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Theme Selection</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {Object.entries(THEMES).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as ThemeKey)}
                  className={`p-3 rounded-lg border-2 text-left text-sm transition-all transform hover:scale-105 ${
                    theme === key
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{themeData.icon}</span>
                    <div>
                      <div className="font-medium">{themeData.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{themeData.difficulty}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Coach Personality</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPersonality('lasso')}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  personality === 'lasso'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Ted Lasso 😊</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Positive & Encouraging</div>
              </button>
              <button
                onClick={() => setPersonality('kent')}
                className={`p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105 ${
                  personality === 'kent'
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Roy Kent 😤</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Gruff but Caring</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Start with &quot;AUDIO&quot;</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Begin each game with AUDIO as first guess</div>
            </div>
            <button
              onClick={() => setUseAudioStart(!useAudioStart)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                useAudioStart ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-0.5 ${
                useAudioStart ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <div className="font-medium">Interactive Coach</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Get real-time strategy advice as you type</div>
            </div>
            <button
              onClick={() => setInteractiveCoach(!interactiveCoach)}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                interactiveCoach ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-0.5 ${
                interactiveCoach ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => {
                if (window.confirm('This will reset all your ClaudLE statistics. Are you sure?')) {
                  setStats({
                    gamesPlayed: 0,
                    gamesWon: 0,
                    currentStreak: 0,
                    maxStreak: 0,
                    guessDistribution: [0, 0, 0, 0, 0, 0]
                  })
                  localStorage.removeItem('claudle-stats')
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
            >
              Reset All Statistics
            </button>
          </div>
        </div>
      </Modal>

      {/* Install Prompt */}
      <InstallPrompt
        isOpen={installPromptState.shouldShow && !installPromptState.isInstalled}
        onClose={() => installPromptActions.dismissPrompt('later')}
        onInstall={installPromptActions.installApp}
        onDismiss={installPromptActions.dismissPrompt}
        platform={installPromptState.platform}
      />
    </div>
  )
}

export default ClaudLE