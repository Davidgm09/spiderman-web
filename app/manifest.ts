import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spider-World',
    short_name: 'Spider-World',
    description: 'La guía definitiva del universo Spider-Man: películas, cómics, videojuegos, series y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#dc2626',
    lang: 'es',
    icons: [
      {
        src: '/icons/spider-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/spider-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
