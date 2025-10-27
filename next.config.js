/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // This allows API routes to work in development
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
