import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Necesario para la directiva `use cache` (ver lib/content.ts): es lo que permite
  // etiquetar los datos del CMS y que el webhook de publicación los invalide.
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    // Las transformaciones las hace la CDN de Sanity, que ya tiene el original: ver
    // sanity/imageLoader.ts. Así no se consume cuota de optimización de Vercel y las
    // imágenes que se suben desde el panel se optimizan igual que las demás.
    loader: 'custom',
    loaderFile: './sanity/imageLoader.ts',
    deviceSizes: [420, 640, 828, 1200, 1600, 2048, 2560],
    // Next 16 restringe las calidades permitidas a una lista blanca (por defecto
    // sólo 75). Declaramos las dos que usamos: 82 para portadas y hero, 75 para el
    // resto. Una calidad no declarada se redondea a la más cercana, en silencio.
    qualities: [75, 82],
  },
  async redirects() {
    return [
      {
        // `/competitions` existió como sección propia y estuvo en el sitemap. Los
        // concursos son ahora proyectos con estado «Concurso», así que la URL antigua
        // lleva al listado de obra en vez de devolver un 404 a quien tenga el enlace.
        source: '/:locale(es|en)/competitions',
        destination: '/:locale/work',
        permanent: true,
      },
      // Aquí había una redirección de `/studio` y `/contact` al ancla de la portada,
      // de cuando dejaron de ser páginas. Ya no: son otra vez direcciones válidas, y
      // dejarla habría hecho justo lo contrario de lo que se buscaba —convertir
      // `/es/studio` en `/es#studio`— interceptando la ruta antes de que exista.
      //
      // Iba con 308, y un permanente lo cachea el navegador sin fecha de caducidad:
      // quien las visitó entonces seguirá yendo al ancla hasta que limpie la caché. No
      // se rompe nada, porque el `id` del `<section>` sigue estando y el navegador cae
      // en el mismo sitio; sólo se ve una almohadilla que ya no toca.
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
        // Los derivados llevan hash de contenido en el nombre: cache agresiva.
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
