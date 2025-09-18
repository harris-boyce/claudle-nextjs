import Anthropic from '@anthropic-ai/sdk'

// Allow builds without API key, but require it at runtime
const apiKey = process.env.ANTHROPIC_API_KEY || 'build-time-placeholder'

if (!process.env.ANTHROPIC_API_KEY && typeof window === 'undefined' && process.env.NODE_ENV !== 'development') {
  console.warn('ANTHROPIC_API_KEY not found during build - API calls will fail at runtime')
}

export const claudeClient = new Anthropic({
  apiKey,
})

// Runtime check for API calls
export function checkApiKey() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required')
  }
}