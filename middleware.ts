import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiting store (resets on deployment/cold starts)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/claude/generate-word': { maxRequests: 5, windowMinutes: 60 * 24 }, // 5 games per day
  '/api/claude/get-hint': { maxRequests: 30, windowMinutes: 60 }, // 30 hints per hour
  '/api/claude/coaching': { maxRequests: 100, windowMinutes: 60 }, // 100 coaching calls per hour
  '/api/claude/game-over': { maxRequests: 10, windowMinutes: 60 } // 10 game endings per hour
}

function getRateLimitKey(ip: string, path: string): string {
  const now = new Date()
  const config = RATE_LIMITS[path as keyof typeof RATE_LIMITS]

  if (!config) return `${ip}-${path}-${now.getTime()}`

  // Create time window buckets
  const windowMs = config.windowMinutes * 60 * 1000
  const windowStart = Math.floor(now.getTime() / windowMs) * windowMs

  return `${ip}-${path}-${windowStart}`
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number } {
  const config = RATE_LIMITS[path as keyof typeof RATE_LIMITS]

  if (!config) {
    return { allowed: true, remaining: 999 }
  }

  const key = getRateLimitKey(ip, path)
  const now = Date.now()
  const windowMs = config.windowMinutes * 60 * 1000

  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    // New window or expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: config.maxRequests - 1 }
  }

  if (current.count >= config.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  current.count++
  rateLimitStore.set(key, current)

  return { allowed: true, remaining: config.maxRequests - current.count }
}

export function middleware(request: NextRequest) {
  // Get client IP
  const ip = request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Rate limiting for Claude API routes
  if (request.nextUrl.pathname.startsWith('/api/claude')) {
    const { allowed, remaining } = checkRateLimit(ip, request.nextUrl.pathname)

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', remaining.toString())

    if (!allowed) {
      const config = RATE_LIMITS[request.nextUrl.pathname as keyof typeof RATE_LIMITS]
      const retryAfter = config ? config.windowMinutes * 60 : 3600

      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again later.`,
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }
  }

  // Clean up old entries periodically (basic garbage collection)
  if (Math.random() < 0.01) { // 1% chance on each request
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}