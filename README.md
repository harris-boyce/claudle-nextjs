# ClaudLE - AI-Enhanced Wordle with Next.js

An intelligent Wordle game enhanced with AI hints and coaching from Claude.

## Features

- **AI-Powered Hints**: Get gentle nudges, strategic advice, or direct hints from Claude
- **Adaptive Difficulty**: Easy, medium, and hard word generation
- **Smart Coaching**: Real-time feedback on your guessing strategy
- **Game Analysis**: Post-game insights and performance analysis
- **Modern UI**: Built with Next.js 14, React, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd claudle-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development with GitHub Codespaces

This project includes full support for GitHub Codespaces and devcontainers:

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. The environment will automatically set up with all dependencies
3. The dev server will start automatically on port 3000

## API Routes

The app includes several Claude-powered API endpoints:

- `/api/claude/generate-word` - Generate new target words
- `/api/claude/get-hint` - Get AI hints during gameplay
- `/api/claude/coaching` - Get strategy coaching
- `/api/claude/game-over` - Get post-game analysis

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `ANTHROPIC_API_KEY` as an environment variable in Vercel
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Anthropic Claude API
- **Development**: GitHub Codespaces, ESLint, Prettier

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.