import React from 'react'
import { X, Download, Smartphone, Monitor, Share } from 'lucide-react'
import { InstallPromptState } from '@/hooks/useInstallPrompt'

interface InstallPromptProps {
  isOpen: boolean
  onClose: () => void
  onInstall: () => void
  onDismiss: (type: 'later' | 'never') => void
  platform: InstallPromptState['platform']
}

export default function InstallPrompt({
  isOpen,
  onClose,
  onInstall,
  onDismiss,
  platform
}: InstallPromptProps) {
  if (!isOpen) return null

  const platformConfig = {
    'ios-safari': {
      title: '📱 Install ClaudLE',
      subtitle: 'Add to your home screen for faster access',
      description: 'Play offline anytime! Install ClaudLE as an app for instant loading and offline word games.',
      instructions: [
        'Tap the Share button at the bottom',
        'Select "Add to Home Screen"',
        'Tap "Add" to install'
      ],
      icon: <Share className="h-6 w-6 text-blue-500" />,
      buttonText: 'Show Me How',
      offlineNote: 'Offline mode includes basic word games (AI hints available when online)'
    },
    'ios-other': {
      title: '💡 Full App Experience Available',
      subtitle: 'Open in Safari to install as an app',
      description: 'For the complete ClaudLE experience with offline play, open this link in Safari.',
      instructions: [],
      icon: <Smartphone className="h-6 w-6 text-blue-500" />,
      buttonText: 'Open in Safari',
      offlineNote: 'Offline mode includes basic word games (AI hints available when online)'
    },
    'android': {
      title: '⚡ Install ClaudLE',
      subtitle: 'Play offline anytime, loads instantly',
      description: 'Install ClaudLE for faster access and offline word games. No app store needed!',
      instructions: [],
      icon: <Download className="h-6 w-6 text-green-500" />,
      buttonText: 'Install App',
      offlineNote: 'Play word games offline (AI hints available when online)'
    },
    'windows': {
      title: '🖥️ Install ClaudLE',
      subtitle: 'Add to your desktop and taskbar',
      description: 'Install ClaudLE as a desktop app for quick access and offline play.',
      instructions: [],
      icon: <Monitor className="h-6 w-6 text-blue-500" />,
      buttonText: 'Install App',
      offlineNote: 'Play word games offline (AI hints available when online)'
    },
    'unknown': {
      title: '📱 ClaudLE Available Offline',
      subtitle: 'Bookmark for quick access',
      description: 'ClaudLE works great in your browser and supports offline play.',
      instructions: [],
      icon: <Smartphone className="h-6 w-6 text-gray-500" />,
      buttonText: 'Got It',
      offlineNote: 'Basic word games available offline (AI features require internet)'
    }
  }

  const config = platformConfig[platform]

  const handleInstall = () => {
    if (platform === 'ios-other') {
      // Open in Safari
      const url = window.location.href
      window.open(`x-web-search://?${encodeURIComponent(url)}`, '_blank')
    } else {
      onInstall()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {config.icon}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{config.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{config.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {config.description}
          </p>

          {config.instructions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">How to install:</h4>
              <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                {config.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              💡 {config.offlineNote}
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md"
            >
              {config.buttonText}
            </button>
            <button
              onClick={() => onDismiss('later')}
              className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <button
            onClick={() => onDismiss('never')}
            className="w-full text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors pt-2"
          >
            No thanks, don&apos;t ask again
          </button>
        </div>
      </div>
    </div>
  )
}