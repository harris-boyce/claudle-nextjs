// Simple device fingerprinting and analytics without external dependencies

export interface DeviceInfo {
  id: string
  firstSeen: string
  lastSeen: string
  gamesPlayed: number
  gamesWon: number
  totalGuesses: number
  averageGuesses: number
  favoriteTheme: string
  favoritePersonality: string
  installTime?: string
  isPWA: boolean
}

// Generate stable device fingerprint
export function generateDeviceId(): string {
  if (typeof window === 'undefined') return 'server'

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx!.textBaseline = 'top'
  ctx!.font = '14px Arial'
  ctx!.fillText('ClaudLE fingerprint', 2, 2)

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvas.toDataURL()
  ].join('|')

  // Simple hash function (no crypto dependency needed)
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  return 'cld_' + Math.abs(hash).toString(36)
}

// Get or create device info
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      id: 'server',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      gamesPlayed: 0,
      gamesWon: 0,
      totalGuesses: 0,
      averageGuesses: 0,
      favoriteTheme: 'original',
      favoritePersonality: 'lasso',
      isPWA: false
    }
  }

  const deviceId = generateDeviceId()
  const stored = localStorage.getItem(`claudle-device-${deviceId}`)

  if (stored) {
    const info = JSON.parse(stored) as DeviceInfo
    info.lastSeen = new Date().toISOString()
    info.isPWA = window.matchMedia('(display-mode: standalone)').matches
    localStorage.setItem(`claudle-device-${deviceId}`, JSON.stringify(info))
    return info
  }

  const newInfo: DeviceInfo = {
    id: deviceId,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    gamesPlayed: 0,
    gamesWon: 0,
    totalGuesses: 0,
    averageGuesses: 0,
    favoriteTheme: 'original',
    favoritePersonality: 'lasso',
    isPWA: window.matchMedia('(display-mode: standalone)').matches
  }

  localStorage.setItem(`claudle-device-${deviceId}`, JSON.stringify(newInfo))
  return newInfo
}

// Update device analytics
export function updateDeviceAnalytics(data: {
  gameWon?: boolean
  guessCount?: number
  theme?: string
  personality?: string
}) {
  if (typeof window === 'undefined') return

  const info = getDeviceInfo()

  if (data.gameWon !== undefined) {
    info.gamesPlayed++
    if (data.gameWon) info.gamesWon++
  }

  if (data.guessCount) {
    info.totalGuesses += data.guessCount
    info.averageGuesses = info.totalGuesses / info.gamesPlayed
  }

  if (data.theme) {
    info.favoriteTheme = data.theme
  }

  if (data.personality) {
    info.favoritePersonality = data.personality
  }

  info.lastSeen = new Date().toISOString()
  localStorage.setItem(`claudle-device-${info.id}`, JSON.stringify(info))
}

// Get analytics summary for all devices (useful for debugging)
export function getAnalyticsSummary() {
  if (typeof window === 'undefined') return null

  const keys = Object.keys(localStorage).filter(key => key.startsWith('claudle-device-'))
  const devices = keys.map(key => JSON.parse(localStorage.getItem(key)!) as DeviceInfo)

  return {
    totalDevices: devices.length,
    totalGames: devices.reduce((sum, d) => sum + d.gamesPlayed, 0),
    totalWins: devices.reduce((sum, d) => sum + d.gamesWon, 0),
    avgWinRate: devices.length > 0 ?
      devices.reduce((sum, d) => sum + (d.gamesWon / Math.max(d.gamesPlayed, 1)), 0) / devices.length : 0,
    pwaUsers: devices.filter(d => d.isPWA).length
  }
}