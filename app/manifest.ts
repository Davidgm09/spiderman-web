import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sentido Arácnido',
    short_name: 'Sentido Arácnido',
    description: 'La guía definitiva del universo Spider-Man: películas, cómics, videojuegos, series y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#dc2626',
    lang: 'es',
    icons: [
      {
        src: '/icons/spider-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/spider-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
