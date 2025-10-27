# Deployment Guide

## Quick Start

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Site monitor dashboard"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel (Recommended - 2 Minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-detects Next.js settings
6. Click "Deploy"

✨ **Done!** Your site will be live at `https://your-project.vercel.app`

The API endpoint `/api/check-status` will work automatically as a serverless function.

---

## Alternative: Netlify

1. Build locally first:
```bash
npm run build
```

2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `out` folder
4. Your site is live!

**Note**: For Netlify with API routes, you'll need to:
- Use Netlify Functions
- Create `netlify/functions/check-status.ts` (similar to pages/api)
- Update API calls in `pages/index.tsx` to `/api/check-status` or the Netlify function URL

---

## Manual Build Test

Build the static site:
```bash
npm run build
```

Serve locally:
```bash
npx serve out
```

Then open: `http://localhost:3000`

---

## Development

Run development server:
```bash
npm run dev
```

Then open: `http://localhost:3000`

---

## Update Sites to Monitor

Edit `pages/api/check-status.ts`:
```typescript
const SITES = {
  server1: [
    'https://yoursite1.com',
    'https://yoursite2.com',
  ],
  server2: [
    'https://yoursite3.com',
  ]
};
```

Then commit and push for automatic redeployment.
