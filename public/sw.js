// Minimal service worker for PWA installation
// Version 1.0 - Basic caching for offline functionality

const CACHE_NAME = 'claudle-v1'
const OFFLINE_CACHE = 'claudle-offline-v1'

// Essential files to cache for offline play
const CACHE_FILES = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Fallback words for offline play (one per theme)
const OFFLINE_WORDS = {
  original: 'AUDIO',
  theater: 'DRAMA',
  technology: 'BYTES',
  cooking: 'SPICE',
  nature: 'GROVE',
  sports: 'SCORE',
  music: 'CHORD',
  science: 'ATOMS',
  travel: 'COAST',
  literature: 'VERSE'
}

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const { request } = event

  // Handle API requests
  if (request.url.includes('/api/claude/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(request)
          .then(fetchResponse => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone()
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone))
            }
            return fetchResponse
          })
      })
      .catch(() => {
        // Offline fallback
        return caches.match('/')
      })
  )
})

// Handle API requests with offline fallbacks
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)
    return response
  } catch (error) {
    // Offline fallbacks
    const url = new URL(request.url)

    if (url.pathname.includes('/generate-word')) {
      const body = await request.json().catch(() => ({ theme: 'original' }))
      const theme = body.theme || 'original'
      const word = OFFLINE_WORDS[theme] || 'AUDIO'

      return new Response(JSON.stringify({
        word,
        theme: theme.charAt(0).toUpperCase() + theme.slice(1),
        difficulty: 'Medium',
        fallback: true,
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (url.pathname.includes('/get-hint')) {
      return new Response(JSON.stringify({
        hint: "You're offline, but keep trying! Trust your instincts and use common letter patterns.",
        personality: 'lasso',
        fallback: true,
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (url.pathname.includes('/coaching')) {
      return new Response(JSON.stringify({
        coaching: "Can't analyze your strategy offline, but you're doing great! Focus on eliminating common letters.",
        enabled: false,
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (url.pathname.includes('/game-over')) {
      return new Response(JSON.stringify({
        feedback: "Good game! When you're back online, I'll have more personalized feedback for you.",
        personality: 'lasso',
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Default offline response
    return new Response(JSON.stringify({
      error: 'Offline - feature unavailable',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}