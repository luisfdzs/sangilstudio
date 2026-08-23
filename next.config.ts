import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.*', '192.168.0.*', '10.0.0.*', '172.20.10.*'],
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    loader: 'custom',
    loaderFile: './sanity/imageLoader.ts',
    deviceSizes: [420, 640, 828, 1200, 1600, 2048, 2560],
    qualities: [75, 82],
  },
  async redirects() {
    return [
      {
        source: '/:locale(es|en)/competitions',
        destination: '/:locale/work',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
