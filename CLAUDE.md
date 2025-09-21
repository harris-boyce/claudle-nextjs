# 🤖 ClaudLE Development with Claude Code

> **AI Prompt Engineering Learning Platform - Your guide to building production-ready AI applications**

## 🎯 Project Overview

**ClaudLE** is an educational platform that teaches AI prompt engineering through interactive gameplay. It demonstrates the complete journey from Claude artifact to enterprise-ready AI application.

### **What Makes This Special**
- **Educational Focus**: Every component teaches AI development concepts
- **Production Quality**: Real-world patterns suitable for business applications
- **Progressive Learning**: 5 comprehensive tutorials from beginner to advanced
- **Sophisticated AI**: Context-aware prompt engineering with strategic game analysis

## 🚀 Quick Development Commands

### **Essential Commands**
```bash
npm run dev          # Start development server (auto-approved)
npm run type-check   # TypeScript validation (auto-approved)
npm run lint         # Code quality check (auto-approved)
npm run build        # Production build (auto-approved)
```

### **Git Workflow (Safe Commands Auto-Approved)**
```bash
git status           # Check working directory status
git diff             # See unstaged changes
git log --oneline    # View commit history
git add .            # Stage changes for commit
git restore <file>   # Restore file to last commit
```

### **Git Operations (Will Ask Permission)**
```bash
git commit -m "..."  # Commit staged changes
git push             # Push to remote repository
git pull             # Pull from remote repository
git checkout <branch># Switch branches
```

## 📚 Learning Journey Commands

### **Explore Tutorial Progression**
```bash
# See all tutorials
ls docs/tutorials/

# Read the origin story
cat docs/tutorials/TUTORIAL-00-ARTIFACT-ORIGIN.md

# Explore different development stages
git tag -l tutorial-*
git checkout tutorial-01-basic-game
git checkout tutorial-02-ai-integration
# etc...
```

### **Study AI Integration Patterns**
```bash
# Examine sophisticated AI coaching
cat app/api/claude/coaching/route.ts

# Check cost control mechanisms
cat lib/device-analytics.ts

# Review prompt engineering techniques
grep -r "personality" app/api/claude/
```

## 🧠 AI Development Insights

### **Prompt Engineering Examples**
- **Basic Integration**: `app/api/claude/get-hint/route.ts`
- **Advanced Context**: `app/api/claude/coaching/route.ts`
- **Cost Management**: Rate limiting in coaching route
- **Personality-Driven**: Ted Lasso vs Roy Kent implementations

### **Production Patterns**
- **Error Handling**: Graceful degradation in all AI routes
- **Rate Limiting**: User-based limits in `lib/device-analytics.ts`
- **Feature Flags**: `ENABLE_INTERACTIVE_COACHING` environment variable
- **Analytics**: Device tracking for usage insights

## 🛠️ Development Guidelines

### **When Making Changes**
1. **Type-check first**: All changes must pass `npm run type-check`
2. **Educational value**: Consider what this teaches other developers
3. **Cost awareness**: AI features should include rate limiting
4. **Documentation**: Update relevant tutorials if adding features

### **Code Quality Standards**
- **TypeScript**: Full type safety required
- **Component Architecture**: Clean, reusable components
- **Prompt Engineering**: Context-aware, well-structured prompts
- **Error Handling**: Graceful failures with user feedback

### **AI Integration Best Practices**
- **Context Building**: Study coaching route for context patterns
- **Cost Control**: Always include rate limiting for AI features
- **Fallback Strategies**: Provide responses when AI fails
- **User Experience**: Loading states and clear feedback

## 📁 Key File Locations

### **Entry Points**
- `app/page.tsx` - Main application page
- `components/ClaudLE.tsx` - Core game component

### **AI Integration**
- `app/api/claude/coaching/route.ts` - Advanced context-aware coaching
- `app/api/claude/get-hint/route.ts` - Basic hint generation
- `app/api/claude/generate-word/route.ts` - Theme-based word generation
- `lib/claude-client.ts` - Anthropic API client configuration

### **Educational Content**
- `docs/tutorials/` - Complete learning progression
- `docs/GETTING_STARTED.md` - Multiple development environment options
- `CONTRIBUTING.md` - Educational contribution guidelines

### **Production Features**
- `.github/workflows/deploy.yml` - Automated deployment pipeline
- `lib/device-analytics.ts` - Usage tracking and rate limiting
- `app/manifest.ts` - Progressive Web App configuration

## 🎯 Common Development Tasks

### **Adding New AI Features**
```bash
# Study existing patterns first
cat app/api/claude/coaching/route.ts

# Check rate limiting implementation
grep -r "rateLimiting" lib/

# Understand cost tracking
cat lib/device-analytics.ts
```

### **Updating Educational Content**
```bash
# Check all tutorials
ls docs/tutorials/

# Update specific tutorial
code docs/tutorials/TUTORIAL-03-PROMPT-ENGINEERING.md

# Verify cross-references
grep -r "TUTORIAL-" docs/
```

### **Testing Production Features**
```bash
# Run full test suite
npm run type-check && npm run lint && npm run build

# Check deployment configuration
cat .github/workflows/deploy.yml

# Verify environment variables
cat .env.local.example
```

## 🤝 Community & Contributions

### **Getting Involved**
- **GitHub Discussions**: Ask questions and share knowledge
- **Issues**: Report bugs or suggest educational improvements
- **Pull Requests**: Contribute new features or tutorial content

### **Educational Contributions**
- **New coaching personalities**: Add different AI interaction styles
- **Tutorial improvements**: Enhance learning progressions
- **Prompt engineering examples**: Share effective patterns
- **Real-world case studies**: Document artifact-to-app transformations

## 🔒 Security & Best Practices

### **API Key Management**
- **Never commit API keys**: Use `.env.local` for local development
- **Environment variables**: Production keys stored in Vercel
- **Rate limiting**: All AI endpoints include usage controls
- **Error handling**: No sensitive information in error messages

### **Educational Safety**
- **Content moderation**: AI responses appropriate for educational use
- **Cost controls**: Prevent runaway API usage
- **Privacy**: No personal data collection beyond device analytics
- **Accessibility**: Inclusive design for all learners

## 🎓 Learning Outcomes

By studying this codebase, developers learn:

- **Artifact Transformation**: Converting prototypes to production apps
- **Prompt Engineering**: Context-aware, sophisticated AI interactions
- **Cost Management**: Production-ready AI cost controls
- **Educational Design**: Creating learning experiences through code
- **Community Building**: Collaborative development practices

---

## 💡 Pro Tips for Claude Code Users

### **Efficient Exploration**
```bash
# Quickly understand the codebase structure
find . -name "*.ts" -o -name "*.tsx" | head -20

# See the most important files
cat .claude/workspace.json | grep -A 20 keyFiles

# Check recent changes
git log --oneline -10
```

### **Learning Workflow**
1. **Start with**: `docs/tutorials/TUTORIAL-00-ARTIFACT-ORIGIN.md`
2. **Then explore**: Each tutorial progression via git tags
3. **Study implementation**: Compare tutorial content to actual code
4. **Experiment**: Make changes and see educational impact

### **Development Workflow**
1. **Understand first**: Study existing patterns before adding features
2. **Type-check early**: Run `npm run type-check` frequently
3. **Consider education**: How does this change improve learning?
4. **Document learning**: Update tutorials for new concepts

---

**🤖 Built with Claude Code | This file enhances your Claude Code development experience**

*Happy learning and building! Every interaction with this codebase is an opportunity to understand sophisticated AI application development.*