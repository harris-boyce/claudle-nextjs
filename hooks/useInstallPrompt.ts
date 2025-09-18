import { useState, useEffect } from 'react'
import { getDeviceInfo, updateDeviceAnalytics } from '@/lib/device-analytics'

export interface InstallPromptState {
  canInstall: boolean
  shouldShow: boolean
  platform: 'ios-safari' | 'ios-other' | 'android' | 'windows' | 'unknown'
  isInstalled: boolean
  deferredPrompt: any
}

interface InstallPromptActions {
  showInstallPrompt: () => void
  dismissPrompt: (type: 'later' | 'never') => void
  installApp: () => Promise<void>
}

export function useInstallPrompt(): [InstallPromptState, InstallPromptActions] {
  const [state, setState] = useState<InstallPromptState>({
    canInstall: false,
    shouldShow: false,
    platform: 'unknown',
    isInstalled: false,
    deferredPrompt: null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect platform and browser
    const platform = detectPlatform()
    const isInstalled = detectInstallation()

    setState(prev => ({
      ...prev,
      platform,
      isInstalled
    }))

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e
      }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Check if we should show the prompt based on engagement
  useEffect(() => {
    if (typeof window === 'undefined' || state.isInstalled) return

    const deviceInfo = getDeviceInfo()
    const shouldShow = checkShouldShowPrompt(deviceInfo)

    setState(prev => ({
      ...prev,
      shouldShow
    }))
  }, [state.isInstalled])

  const showInstallPrompt = () => {
    setState(prev => ({ ...prev, shouldShow: true }))
  }

  const dismissPrompt = (type: 'later' | 'never') => {
    const days = type === 'later' ? 7 : 30
    updateDeviceAnalytics({
      installPromptDismissed: new Date().toISOString(),
      installPromptCooldown: days
    })

    setState(prev => ({ ...prev, shouldShow: false }))
  }

  const installApp = async () => {
    if (state.deferredPrompt) {
      // Chrome/Edge native prompt
      state.deferredPrompt.prompt()
      const { outcome } = await state.deferredPrompt.userChoice

      updateDeviceAnalytics({
        installAttempted: new Date().toISOString(),
        installOutcome: outcome
      })

      if (outcome === 'accepted') {
        setState(prev => ({ ...prev, isInstalled: true, shouldShow: false }))
      }

      setState(prev => ({ ...prev, deferredPrompt: null }))
    } else if (state.platform === 'ios-safari') {
      // iOS Safari - just track the attempt, user must do it manually
      updateDeviceAnalytics({
        installInstructionsShown: new Date().toISOString()
      })
    }
  }

  return [state, { showInstallPrompt, dismissPrompt, installApp }]
}

function detectPlatform(): InstallPromptState['platform'] {
  if (typeof window === 'undefined') return 'unknown'

  const userAgent = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(userAgent)
  const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent)
  const isWindows = /windows/.test(userAgent)
  const isAndroid = /android/.test(userAgent)

  if (isIOS && isSafari) return 'ios-safari'
  if (isIOS && !isSafari) return 'ios-other'
  if (isWindows) return 'windows'
  if (isAndroid) return 'android'

  return 'unknown'
}

function detectInstallation(): boolean {
  if (typeof window === 'undefined') return false

  // Check if running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

function checkShouldShowPrompt(deviceInfo: any): boolean {
  // Don't show if recently dismissed
  if (deviceInfo.installPromptDismissed) {
    const dismissedDate = new Date(deviceInfo.installPromptDismissed)
    const daysSinceDismissal = Math.floor((Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24))
    const cooldownDays = deviceInfo.installPromptCooldown || 7

    if (daysSinceDismissal < cooldownDays) {
      return false
    }
  }

  // Show after 3 games OR 2nd session
  const hasPlayedEnough = deviceInfo.gamesPlayed >= 3
  const isReturnVisitor = deviceInfo.sessions >= 2

  return hasPlayedEnough || isReturnVisitor
}