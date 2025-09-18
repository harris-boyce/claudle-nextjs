# 🚀 ClaudLE Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Anthropic API key

### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial ClaudLE setup"
   git remote add origin https://github.com/yourusername/claudle-nextjs.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables in Vercel Dashboard:**
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ENABLE_INTERACTIVE_COACHING=false
   ```

4. **Deploy!**
   - Vercel automatically deploys
   - Get live URL: `https://claudle-nextjs.vercel.app`

## GitHub Actions Setup

### Required Secrets (in GitHub repo settings):
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
ANTHROPIC_API_KEY=your_api_key
```

### Get Vercel Credentials:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and get credentials
vercel login
vercel link  # Select your project

# Get your IDs
cat .vercel/project.json
```

### What GitHub Actions Does:
- ✅ **Tests:** Type check, lint, build
- ✅ **Preview Deployments:** Every PR gets preview URL
- ✅ **Production Deployments:** Main branch auto-deploys
- ✅ **Performance Audits:** Lighthouse scores on PRs
- ✅ **Auto Releases:** Creates GitHub releases

## Environment Variables

### Required:
- `ANTHROPIC_API_KEY` - Your Claude API key

### Optional:
- `ENABLE_INTERACTIVE_COACHING=true` - Enable expensive coaching feature
- `VERCEL_ANALYTICS_ID` - Vercel Analytics tracking

## Rate Limiting (Built-in)

- **5 games per day** per IP
- **30 hints per hour** per IP
- **100 coaching calls per hour** per IP
- **10 game endings per hour** per IP

## Monitoring

- **Health Check:** `/health` endpoint
- **Performance:** Lighthouse CI in PRs
- **Rate Limit Headers:** `X-RateLimit-Remaining`

## Cost Estimation

### Vercel (Free Tier):
- ✅ 100GB bandwidth
- ✅ 100 serverless function executions
- ✅ Unlimited static files

### Anthropic API:
- **Generate Word:** ~$0.01 per game (5/day = $0.05/day max)
- **Hints:** ~$0.005 per hint (30/hour = $0.15/hour max)
- **Coaching:** ~$0.01 per analysis (if enabled)

**Total estimated cost: $5-15/month for moderate usage**

## Security Features

- ✅ Rate limiting (5 games/day per IP)
- ✅ API key never exposed to frontend
- ✅ Security headers (XSS, CSRF protection)
- ✅ Input validation and sanitization
- ✅ Error handling with fallbacks

## Performance

- ✅ Edge deployment (Vercel)
- ✅ Static generation where possible
- ✅ API response caching
- ✅ Optimized bundle size
- ✅ Lighthouse CI monitoring

## Troubleshooting

### Common Issues:

1. **Build fails:** Check TypeScript errors
   ```bash
   npm run type-check
   ```

2. **API errors:** Verify environment variables
   ```bash
   curl https://your-domain.vercel.app/health
   ```

3. **Rate limiting too strict:** Adjust in `middleware.ts`

4. **High API costs:** Disable coaching feature:
   ```
   ENABLE_INTERACTIVE_COACHING=false
   ```

## Advanced Features

### Custom Domain:
1. Add domain in Vercel dashboard
2. Update DNS records
3. SSL automatically configured

### Analytics:
```bash
# Add Vercel Analytics
npm install @vercel/analytics
```

### Database (if needed later):
- Vercel Postgres
- Supabase
- PlanetScale

---

**Ready to deploy!** 🎯