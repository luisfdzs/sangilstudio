import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Los derivados ya se generan en build-time con sharp (npm run images), así que
    // aquí sólo declaramos los formatos y anchos que el optimizador de Vercel sirve.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1200, 1600, 2048, 2560],
    // Next 16 restringe las calidades permitidas a una lista blanca (por defecto
    // sólo 75). Declaramos las dos que usamos: 82 para portadas y hero, 75 para el
    // resto. Una calidad no declarada se redondea a la más cercana, en silencio.
    qualities: [75, 82],
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
        // Los derivados llevan hash de contenido en el nombre: cache agresiva.
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
