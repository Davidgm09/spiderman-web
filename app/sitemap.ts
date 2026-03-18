import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
import {
  characterService,
  movieService,
  seriesService,
  comicService,
  gameService,
  blogService,
} from '@/lib/database'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spider-world.es'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/personajes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/peliculas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/series`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/comics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/videojuegos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/tienda`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Rutas dinámicas
  const [characters, movies, series, comics, games, blogPosts] = await Promise.all([
    characterService.getAll(),
    movieService.getAll(),
    seriesService.getAll(),
    comicService.getAll(),
    gameService.getAll(),
    blogService.getAll(),
  ])

  const characterRoutes: MetadataRoute.Sitemap = characters.map((c) => ({
    url: `${BASE_URL}/personajes/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const movieRoutes: MetadataRoute.Sitemap = movies.map((m) => ({
    url: `${BASE_URL}/peliculas/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const seriesRoutes: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${BASE_URL}/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const comicRoutes: MetadataRoute.Sitemap = comics.map((c) => ({
    url: `${BASE_URL}/comics/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const gameRoutes: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${BASE_URL}/videojuegos/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.publishDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...movieRoutes,
    ...seriesRoutes,
    ...gameRoutes,
    ...comicRoutes,
    ...characterRoutes,
  ]
}
