# Site Monitor

A beautiful static site monitoring dashboard that displays real-time status of your websites across different servers.

## Features

- ✅ Real-time site status monitoring
- 🎨 Modern, responsive UI
- ⚡ Fast static site generation
- 🔄 Auto-refresh every 5 minutes
- 📱 Mobile-friendly design
- 🌐 Direct links to all sites

## Monitored Sites

### Server 1
- brahamand.ai
- subvivah.com
- foodfly.co
- customerzone.in

### Server 2
- chitbox.co
- connectflow.co.in
- tutorbuddy.co
- amenites.rozgarhub.co
- orbitx.zone

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build Static Site

Build a static export:

```bash
npm run build
```

The static files will be in the `out` directory.

## Deployment

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Deploy! Vercel will automatically:
   - Detect Next.js
   - Build and deploy
   - Host the API endpoint as a serverless function

### Option 2: Netlify (Free)

1. Build the static site: `npm run build`
2. Push to GitHub
3. Connect to [Netlify](https://netlify.com)
4. Set build command: `npm run build`
5. Set publish directory: `out`

**Note**: For Netlify, you'll need to configure a serverless function for the API endpoint or use their [Functions](https://docs.netlify.com/functions/overview/) feature.

### Option 3: GitHub Pages

1. Install: `npm install -g gh-pages`
2. Add to package.json:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d out"
}
```
3. Run: `npm run deploy`

**Note**: GitHub Pages doesn't support server-side API routes. You'll need to use a separate service for status checking (like UptimeRobot API).

## Configuration

To monitor different sites, edit `pages/api/check-status.ts`:

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

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS-in-JS (styled-jsx)
- **Deployment**: Static export

## License

MIT
