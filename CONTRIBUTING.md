# 🤝 Contributing to ClaudLE

Welcome to ClaudLE! We're excited to have you contribute to this educational AI prompt engineering resource. This project serves both as a fun game and as a learning platform for AI development patterns.

## 🎯 Our Mission

ClaudLE demonstrates sophisticated prompt engineering techniques through an interactive gaming experience. Every contribution should enhance either:
- **Educational Value**: Help others learn AI/prompt engineering
- **User Experience**: Make the game more engaging and accessible
- **Technical Excellence**: Showcase best practices in AI development

## 🎓 Types of Contributions We Welcome

### 1. **Educational Enhancements** 🎓
- Tutorial content improvements
- Documentation of prompt engineering techniques
- Learning objective clarifications
- Code examples and explanations

### 2. **Prompt Engineering Improvements** 🧠
- Better AI coaching interactions
- New personality coaching styles
- Cost-effective prompting patterns
- Context-aware AI responses

### 3. **Feature Development** ⚡
- New game themes or modes
- Enhanced user experience features
- Performance optimizations
- Accessibility improvements

### 4. **Technical Infrastructure** 🔧
- Code quality improvements
- Testing enhancements
- Security updates
- Documentation improvements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git knowledge
- An Anthropic API key ([get one here](https://console.anthropic.com/))
- Basic understanding of Next.js and React

### Setup for Development
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/claudle-nextjs
cd claudle-nextjs
npm install

# Set up environment
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start development server
npm run dev
```

### Using the Tutorial Structure
Before contributing, explore our progressive tutorial:
```bash
# Start with the origin story
cat TUTORIAL-00-ARTIFACT-ORIGIN.md

# Explore the progression
git checkout tutorial-01-basic-game
git checkout tutorial-02-ai-integration
git checkout tutorial-03-prompt-engineering
# ... etc
```

## 📝 Contribution Guidelines

### Educational Contributions

#### When Adding Tutorial Content:
- **Learning Objectives**: Clearly state what learners will understand
- **Practical Examples**: Include real code, not just theory
- **Progressive Difficulty**: Build on previous concepts
- **Authentic Value**: Don't overpromise what's actually delivered

#### When Documenting Prompts:
- **Show Context**: Explain why the prompt works
- **Include Game State**: Show how game data informs AI responses
- **Cost Considerations**: Mention API usage implications
- **Fallback Strategies**: Document error handling approaches

### Code Contributions

#### Prompt Engineering Standards:
```typescript
// ✅ Good prompt structure
const coachingPrompt = `${personalityContext}

Game Analysis:
- Current state: ${gameState}
- Player context: ${playerContext}
- Constraints: ${constraints}

Task: ${specificTask}
Guidelines: ${guidelines}

Stay in character and be helpful.`

// ❌ Avoid vague prompts
const badPrompt = "Give a hint"
```

#### Code Quality Requirements:
- **TypeScript**: Full type safety required
- **Error Handling**: Graceful degradation for AI failures
- **Testing**: Add tests for new functionality
- **Performance**: Consider API cost and response time
- **Accessibility**: Follow WCAG guidelines

### Commit Message Format
```
type(scope): short description

Longer explanation if needed, focusing on educational impact.

Learning outcomes:
- What this teaches developers
- How it improves the educational experience
- Any prompt engineering patterns demonstrated
```

Types: `feat`, `fix`, `docs`, `tutorial`, `prompt`, `test`, `refactor`

## 🧪 Testing Your Contributions

### Before Submitting:
```bash
# Run all checks
npm run build        # Verify TypeScript compilation
npm run lint         # Check code style
npm test            # Run test suite (when available)
npm run dev         # Manual testing
```

### AI Feature Testing:
- Test with different themes and personalities
- Verify cost controls and rate limiting
- Check fallback behavior when API fails
- Ensure educational messaging is accurate

### Educational Content Testing:
- Verify learning objectives are met
- Check that examples work as described
- Ensure tutorial progression is logical
- Test with different skill levels in mind

## 📋 Pull Request Process

1. **Create an Issue First** (for significant changes)
   - Use our issue templates
   - Discuss educational goals and implementation approach

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/educational-enhancement
   ```

3. **Make Your Changes**
   - Follow our coding standards
   - Add documentation for educational features
   - Include tests where applicable

4. **Submit Pull Request**
   - Use our PR template
   - Clearly explain educational impact
   - Include screenshots/demos if relevant

5. **Code Review Process**
   - Maintainers will review for educational value
   - Community feedback on learning experience
   - Technical review for code quality

## 🎯 Specific Areas for Contribution

### High Priority:
- **Tutorial README files** for each git tag level
- **Prompt engineering documentation** with real examples
- **Interactive learning features** within the app
- **Cost optimization** techniques for AI APIs

### Medium Priority:
- **New coaching personalities** with distinct prompting styles
- **Advanced game features** that demonstrate AI techniques
- **Performance optimizations** for better user experience
- **Accessibility improvements** for inclusive learning

### Future Opportunities:
- **Prompt playground** for live prompt editing
- **A/B testing framework** for prompt comparison
- **Community prompt library** for shared learning
- **Educational analytics** for learning progress tracking

## 🔍 Code Review Criteria

### Educational Value:
- Does this help learners understand AI/prompt engineering?
- Are learning objectives clearly stated and met?
- Is the educational content accurate and authentic?

### Technical Quality:
- Follows TypeScript and React best practices
- Proper error handling and user feedback
- Performance considerations for AI interactions
- Security best practices followed

### User Experience:
- Intuitive and accessible interface
- Helpful error messages and guidance
- Consistent with existing design patterns
- Works across different devices and browsers

## 🤝 Community Guidelines

### Be Educational:
- Share knowledge generously
- Explain your reasoning and choices
- Help others learn from your contributions

### Be Respectful:
- Constructive feedback and suggestions
- Patient with learners at different levels
- Inclusive and welcoming to all contributors

### Be Authentic:
- Don't oversell educational value
- Admit when you're unsure about something
- Focus on real, practical learning outcomes

## 🐛 Bug Reports

When reporting bugs, please:
- Use our bug report template
- Include reproduction steps
- Mention educational impact if relevant
- Provide game context (theme, coach, guess number)

## 🎓 Questions and Support

- **GitHub Issues**: For feature requests and bug reports
- **GitHub Discussions**: For questions and community chat
- **Educational Questions**: Tag issues with `education` label

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors who enhance the educational value will be:
- Listed in our contributors section
- Mentioned in relevant tutorial documentation
- Credited for educational improvements

---

**Thank you for helping make ClaudLE a valuable learning resource for the AI development community!**

🤖 Built with Claude Code | Experience the future of AI-assisted development