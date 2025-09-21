# Tutorial 02: Bridging Back to AI Intelligence

> **Learning Objective**: Transform your static app back into an intelligent, AI-powered application by properly integrating the Claude API outside of the artifact environment.

## 🎯 What You'll Master

This tutorial solves the **"API Reality Check"** from Tutorial 01:
- **Restore basic AI functionality** that worked in Claude artifacts
- **Set up proper authentication** with your own Claude API key
- **Create working API routes** in Next.js
- **Implement basic error handling** and fallbacks
- **Add simple AI features** like theme-based word generation and basic hints

**The Bridge**: `Working App (No AI)` → `Intelligent App (Your AI)`

---

## 🚨 The Challenge: Broken AI Magic

### **What Happened in Tutorial 01**
Your artifact transformation worked perfectly, but:

```typescript
// This used to work magically in Claude artifacts:
const generateWord = async () => {
  const response = await fetch('/api/claude', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'Generate a 5-letter word' })
  })
  // ❌ Now fails: API key not found, endpoint doesn't exist
}
```

### **Why AI Broke When You Left Claude**
- ❌ **No API key**: Claude artifacts had automatic authentication
- ❌ **No endpoints**: Your Next.js app doesn't have `/api/claude` routes
- ❌ **No cost controls**: Artifacts didn't charge you per API call
- ❌ **No error handling**: Artifacts handled failures gracefully

### **What We'll Fix**
- ✅ **Your own Claude API key**: Independent authentication
- ✅ **Basic API routes**: `/api/claude/generate-word`, `/api/claude/get-hint`
- ✅ **Simple error handling**: Graceful failures and fallbacks
- ✅ **Basic AI features**: Word generation and simple hints

---

## 🛠️ Getting Started

> **First time?** Complete [Tutorial 01](./TUTORIAL-01-BASIC-GAME.md) first to have a working Next.js app.

### **Check Out This Tutorial Step**
```bash
git checkout tutorial-02-ai-integration
npm run dev  # Should work but AI features won't work yet
```

### **What You'll Build**
Transform this static app into an intelligent one by adding:
```
app/api/claude/
├── generate-word/route.ts    # AI word generation
├── get-hint/route.ts         # Intelligent hints
└── coaching/route.ts         # Real-time coaching
```

---

## 🤖 Step-by-Step: Restoring AI Intelligence

### **Phase 1: Get Your Own Claude API Key**

#### **🔑 API Key Setup Prompt**
```
I want to integrate Claude API into my Next.js application. I need to:

1. Get my own Claude API key from Anthropic
2. Set it up securely in my Next.js app with environment variables
3. Create a basic API route to test the connection

Guide me through the complete setup process, including security best practices for API key management.
```

**Expected Claude Response:**
- Link to Anthropic console for API key
- Environment variable setup (`.env.local`)
- Basic API route creation
- Security considerations

#### **🔧 Environment Setup**
After getting your API key, you'll have:
```bash
# .env.local
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### **Phase 2: Create Your First AI Endpoint**

#### **🏗️ Basic API Route Prompt**
```
I have a Next.js 14 app with App Router and my Claude API key in environment variables.

Create a basic API route at /api/claude/test that:
1. Connects to Claude API securely
2. Sends a simple prompt and returns the response
3. Includes proper error handling
4. Follows Next.js App Router patterns

Show me the complete code and explain how it works.
```

**This creates your first working AI endpoint!**

### **Phase 3: Word Generation Intelligence**

#### **🎯 Word Generation Prompt**
```
My word game needs intelligent word generation. Create an API route /api/claude/generate-word that:

1. Accepts a theme parameter (e.g., "technology", "nature", "movies")
2. Uses Claude to generate a 5-letter word appropriate for that theme
3. Returns the word along with difficulty level and theme confirmation
4. Includes error handling with fallback words
5. Has rate limiting to control costs

Current themes: technology, nature, movies, food, sports

Show me the implementation and explain the prompt engineering strategy.
```

#### **Example Generated Route:**
```typescript
// app/api/claude/generate-word/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { claudeClient } from '@/lib/claude-client'

export async function POST(request: NextRequest) {
  try {
    const { theme = 'general' } = await request.json()

    const prompt = `Generate exactly one 5-letter word for a word game with the theme: "${theme}".

Requirements:
- Must be exactly 5 letters
- Must be a common English word
- Must relate to the theme
- Must be appropriate for all audiences

Return only the word in uppercase.`

    const message = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }]
    })

    const word = message.content[0].text.trim().toUpperCase()

    return NextResponse.json({
      word,
      theme,
      difficulty: 'Medium'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Word generation failed', fallback: 'AUDIO' },
      { status: 500 }
    )
  }
}
```

### **Phase 4: Simple Hint System**

#### **🧠 Basic Hint Prompt**
```
Create a simple hint system for my word game:

1. API route: /api/claude/get-hint
2. Takes the target word and guess number
3. Provides helpful hints without revealing the answer
4. Has two personality modes: encouraging (Ted Lasso) or direct (Roy Kent)
5. Gets slightly more specific on later guesses

Keep it simple - just basic hints, no complex game analysis.
```

#### **Basic Implementation Example:**
```typescript
// Simple hint system
const basicHintPrompt = `You are ${personality === 'lasso' ? 'Ted Lasso - encouraging and positive' : 'Roy Kent - direct but helpful'}.

The player needs a hint for their word game. They are on guess ${guessNumber} of 6.
The target word is: ${targetWord}

Give them a helpful hint about the word without revealing it directly. ${guessNumber >= 4 ? 'Be more specific since they are running out of guesses.' : 'Keep it general for now.'}

Stay in character and be encouraging!`
```

#### **Why This Works (Basic Level)**
- ✅ **Gets AI working**: Simple but functional AI integration
- ✅ **Personality engagement**: Ted vs Roy creates different experiences
- ✅ **Progressive difficulty**: Hints get more specific over time
- ✅ **Foundation building**: Sets up for advanced features later

#### **🎯 Preview: Advanced Intelligence Coming in Tutorial 03**

Right now we're building **working AI integration**. In Tutorial 03, you'll learn the **advanced prompt engineering techniques** that transform basic AI into sophisticated, context-aware assistance:

- Game state analysis and strategic coaching
- Context-aware prompting with player behavior patterns
- Real-time strategy optimization
- Professional-grade prompt engineering patterns

**Tutorial 02 Goal**: Get basic AI working
**Tutorial 03 Goal**: Make AI incredibly intelligent

### **Phase 5: Basic Error Handling**

#### **🛡️ Simple Error Handling Prompt**
```
My Claude API integration works but needs basic error handling:

1. Graceful fallbacks when API calls fail
2. User-friendly error messages
3. Loading states during API calls
4. Basic retry logic for temporary failures

Implement simple but effective error handling for my word game AI features.
```

---

## 🎮 Hands-On Practice

### **🎯 Exercise 1: Basic Integration**
**Goal**: Get a simple AI response working

1. **Get Claude API key** from [Anthropic Console](https://console.anthropic.com/)
2. **Add to environment**: `ANTHROPIC_API_KEY=your_key_here`
3. **Use this prompt**:
```
Create a simple API route /api/claude/test that sends "Hello Claude" and returns the response. Include error handling.
```

### **🎯 Exercise 2: Theme-Based Word Generation**
**Goal**: Replace hardcoded words with AI-generated ones

**Prompt to try**:
```
My word game has themes like "space", "cooking", "sports". Create an API that generates appropriate 5-letter words for each theme using Claude. Include validation to ensure exactly 5 letters.
```

### **🎯 Exercise 3: Basic Hints**
**Goal**: Add personality-driven hints

**Prompt to try**:
```
Create a simple AI hint system with two personalities (Ted Lasso and Roy Kent) that provides helpful hints without revealing the answer. Make hints more specific on later guesses.
```

---

## 🚨 Common Challenges & Solutions

### **Challenge: "API calls are slow!"**

**Solution Prompt**:
```
My Claude API calls take time and users get confused. Add better user experience:

1. Loading states while API calls are in progress
2. Clear feedback when requests succeed or fail
3. Disable buttons during API calls to prevent double-clicks
4. Fallback messages when things go wrong

Show me how to implement good loading UX.
```

### **Challenge: "API calls sometimes fail"**

**Solution Prompt**:
```
My Claude API integration needs better error handling:

1. Graceful fallbacks when API is down
2. Retry logic for temporary failures
3. User-friendly error messages
4. Offline mode with cached responses

Implement robust error handling for my word game.
```

### **Challenge: "Hints are inconsistent"**

**Solution Prompt**:
```
My AI hints vary too much in quality and style. Help me create consistent prompts that:

1. Always stay in character (Ted vs Roy)
2. Provide similar difficulty levels of hints
3. Never accidentally reveal the answer
4. Maintain encouraging tone even when direct

Show me how to write more reliable prompts.
```

---

## 🧪 Basic AI Integration Patterns

### **🎯 Progressive Enhancement Strategy**

1. **Static**: Hardcoded words and responses ✅
2. **Basic AI**: Theme-based word generation ✅
3. **Personality**: Ted vs Roy hint personalities ✅
4. **Smart**: Advanced context analysis (Tutorial 03) 🎯
5. **Production**: Cost controls and optimization (Tutorial 04) 🚀

### **🤖 Simple Prompt Techniques**

#### **Basic Personality Prompting**
```typescript
const personalityPrompt = `You are ${personality === 'lasso'
  ? 'Ted Lasso - encouraging and positive'
  : 'Roy Kent - direct but helpful'}.

Give a hint for: ${targetWord}
Stay in character!`
```

#### **Progressive Difficulty**
```typescript
const difficultyPrompt = `
Give a ${guessNumber < 3 ? 'general' : 'more specific'} hint for the word "${targetWord}".
${guessNumber >= 5 ? 'This is their last chance - be more direct.' : ''}
`
```

---

## ✅ Success Milestones

### **🌱 Basic AI Integration**
- [ ] Successfully connected to Claude API with your own key
- [ ] Created working `/api/claude/test` endpoint
- [ ] Handled basic API errors gracefully
- [ ] Secured API key in environment variables

### **🎮 Simple AI Features**
- [ ] AI generates theme-appropriate words
- [ ] Basic hints that don't reveal answers
- [ ] Two personality modes (Ted vs Roy)
- [ ] Loading states during API calls

### **🚀 Reliable Integration**
- [ ] Consistent prompt responses
- [ ] Good user experience during API calls
- [ ] Fallback messages when APIs fail
- [ ] Basic error handling throughout

### **🎓 Ready for Advanced Features**
- [ ] Understanding of prompt engineering basics
- [ ] Solid foundation for complex AI features
- [ ] Ready to tackle Tutorial 03 (Advanced Prompting)
- [ ] Confidence in AI integration patterns

---

## 📚 Learning Resources

### **Claude API Mastery**
- [Anthropic API Documentation](https://docs.anthropic.com/claude/docs)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Claude API Best Practices](https://docs.anthropic.com/claude/docs/api-best-practices)

### **Next.js API Routes**
- [App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Middleware & Rate Limiting](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### **Production AI Patterns**
- Error handling and graceful degradation
- Caching strategies for AI responses
- Cost monitoring and alerting
- A/B testing different prompts

---

## ➡️ Next Step: Advanced Prompt Engineering

**🎯 You did it!** Your app now has working AI integration with basic intelligence.

**Tutorial 03** transforms your basic AI into sophisticated, context-aware assistance:

- **Advanced prompting techniques** for game state analysis
- **Context-aware coaching** that analyzes player strategy
- **Professional-grade patterns** used in enterprise AI applications
- **Strategic optimization** through intelligent prompt engineering

```bash
git checkout tutorial-03-prompt-engineering
cat docs/tutorials/TUTORIAL-03-PROMPT-ENGINEERING.md
```

### **🚀 The Journey Continues**
1. **Tutorial 01**: `Claude Artifact` → `Runnable App` ✅
2. **Tutorial 02**: `Runnable App` → `Intelligent App` (You are here! ✅)
3. **Tutorial 03**: `Intelligent App` → `Advanced AI App` (Next step 🎯)
4. **Tutorial 04**: `AI App` → `Production PWA` (Coming soon...)
5. **Tutorial 05**: `PWA` → `Complete Platform` (Coming soon...)

---

**🎓 Tutorial Progress**: 2/5 Complete | **Next**: [Tutorial 03 - Advanced Prompt Engineering](./TUTORIAL-03-PROMPT-ENGINEERING.md)

**🌟 Achievement Unlocked**: Your app now has AI superpowers! You've successfully bridged from artifact intelligence to your own AI integration. The magic is back, and this time YOU control it! 🧙‍♂️