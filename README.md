# 🎯 ClaudLE - Learn AI Prompt Engineering Through Interactive Gameplay

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet%204-orange?logo=anthropic)](https://www.anthropic.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?logo=pwa)](https://web.dev/progressive-web-apps/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Experience advanced AI prompt engineering in action through an interactive word-guessing game with real-time AI coaching.**

## 🚀 What Makes This Special

ClaudLE isn't just another word game—it's a **living demonstration of sophisticated prompt engineering techniques** that you can study, modify, and learn from. See how context-aware prompting, personality-driven AI, and adaptive difficulty create engaging user experiences.

### 🎓 Educational Value
- **Real Prompt Engineering**: Study actual prompts used for AI coaching
- **Strategy Optimization**: Learn through AI-powered real-time feedback
- **Personality-Driven AI**: See how different prompt styles create distinct AI personalities
- **Progressive Learning Path**: From basic game mechanics to advanced AI integration

## 📚 Progressive Tutorial (Learn by Building)

This repository includes a complete **"Angular Tutorial"-style learning progression** using git tags:

### 🎯 Learning Path:
- 📝 [`tutorial-00-idea-to-artifact`](./docs/tutorials/TUTORIAL-00-ARTIFACT-ORIGIN.md) - From concept to Claude artifact
- 🎮 `tutorial-01-basic-game` - Core game mechanics & React patterns
- 🤖 `tutorial-02-ai-integration` - Adding Claude API & prompt basics
- 🧠 `tutorial-03-prompt-engineering` - Advanced prompting techniques
- 📱 `tutorial-04-operationalizing` - Production deployment & analytics
- 🎯 `tutorial-05-complete-platform` - Full learning platform

### 🚀 Start Learning:
```bash
git clone https://github.com/yourusername/claudle-nextjs
cd claudle-nextjs

# Start with the origin story
cat docs/tutorials/TUTORIAL-00-ARTIFACT-ORIGIN.md

# Then progress through the tutorial
git checkout tutorial-01-basic-game
# Follow the README at each step
```

## 🔍 What You'll Actually Learn

### Authentic Prompt Engineering Implementation
- **Context-aware prompting** with detailed game state analysis
- **Personality-driven AI** (Ted Lasso vs Roy Kent coaching styles)
- **Progressive difficulty adaptation** in AI responses
- **Strategy optimization** through real-time AI feedback
- **Cost-effective AI integration** with feature flags and rate limiting

### Real-World AI Development Patterns
- Structured prompt construction with game state context
- Error handling and fallback strategies for AI responses
- Performance optimization for interactive AI experiences
- Production-ready AI application architecture

## ✨ Game Features

- **🎭 Personality Coaching**: Choose between Ted Lasso's encouragement or Roy Kent's tough love
- **🎲 10 Unique Themes**: From Classic words to Harry Potter, Disney, and more
- **🧠 Real-time Strategy Analysis**: AI coaches your approach as you type
- **💡 Adaptive Hints**: Context-aware hints that get more specific as you progress
- **📱 PWA Ready**: Install as an app, play offline with cached word lists
- **🌙 Dark Mode**: Automatic system theme detection
- **📊 Privacy-first Analytics**: Track your progress without compromising privacy

## 🚀 Quick Start

> **"I created something cool in Claude Artifacts - now how do I make it a real app?"**

**[📖 Complete Getting Started Guide →](./docs/GETTING_STARTED.md)**

### **🌟 Instant Start (Recommended)**
1. **Fork this repository**
2. **Click "Code" → "Codespaces" → "Create codespace"**
3. **Wait 2-3 minutes** for automatic setup
4. **Start learning** - everything pre-configured!

### **🔧 Alternative Paths**
- **Local + DevContainer**: Isolated development environment
- **Traditional Setup**: Direct local development
- **[See all options →](./docs/GETTING_STARTED.md)**

## 🎯 For Developers & Learners

### Study the Prompt Engineering
```typescript
// See real prompt engineering in action
// File: /app/api/claude/coaching/route.ts

const coachingPrompt = `${personalityPrompt}

The player is considering the guess "${currentGuess}" for attempt ${guessCount + 1}.

Game state analysis:
- Previous guesses: ${guesses.join(', ')}
- Letters ruled out: ${Array.from(wrongLetters).join(', ')}
- Confirmed positions: ${correctLetters.map(c => `${c.letter} in position ${c.position}`).join(', ')}

WITHOUT revealing the target word, provide strategic coaching about this guess:
1. Is this strategically optimal given what they know?
2. Are they reusing ruled-out letters unnecessarily?
3. Could they make a more information-gathering guess?

Stay in character and keep under 100 words.`
```

### API Architecture
- **`/api/claude/generate-word`** - Theme-based word generation with difficulty control
- **`/api/claude/get-hint`** - Context-aware hints with progressive difficulty
- **`/api/claude/coaching`** - Real-time strategy analysis (feature-flagged)
- **`/api/claude/game-over`** - Post-game analysis and encouragement

### Cost Management & Production Ready
- Rate limiting (5 games/day per IP, 30 hints/hour)
- Feature flags for expensive operations
- Fallback responses for offline/error scenarios
- Caching strategies for repeated requests

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy!

### Other Platforms
Works on any Next.js-compatible platform: Netlify, Railway, Render, or self-hosted.

## 🤝 Contributing

We welcome contributions that enhance the educational value or improve the AI interactions!

### **Join the Community**
- 💬 **[GitHub Discussions](../../discussions)** - Ask questions, share knowledge, and connect with other AI developers
- 🐛 **[Issues](../../issues)** - Report bugs or request features
- 🔧 **[Pull Requests](../../pulls)** - Contribute improvements

### Areas for Contribution:
- **New coaching personalities** - Add different AI coaching styles
- **Advanced prompt techniques** - Demonstrate new prompting patterns
- **Educational content** - Improve tutorials and documentation
- **Performance optimizations** - Enhance the AI integration efficiency

### Development Process:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/educational-enhancement`)
3. Make your changes with clear commit messages
4. Add/update relevant tutorial documentation
5. Submit a Pull Request with learning outcomes described

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🎓 Educational Context

This project was created to demonstrate real-world prompt engineering techniques in an engaging, interactive format. It showcases:

- **Production AI Integration** - Not just demos, but patterns you can use in real applications
- **Cost-Effective AI Usage** - Practical approaches to managing AI API costs
- **User Experience with AI** - How to make AI feel natural and helpful
- **Iterative Prompt Development** - See how prompts evolved from simple to sophisticated

**Perfect for**: Developers learning AI integration, prompt engineering students, educators teaching modern web development with AI, and anyone curious about building engaging AI-powered applications.

### 🔗 Learn More
- [Anthropic's Claude API Documentation](https://docs.anthropic.com/claude/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

**Built with Claude Code | Experience the future of AI-assisted development**