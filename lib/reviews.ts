// Análisis del blog que son reseñas de una película o un videojuego concretos.
// Se usan para el JSON-LD de tipo Review (fragmentos de reseña con estrellas en Google).
// La nota no se guarda aquí: se lee del «Puntuación: X/10» del propio artículo.

interface ReviewedItem {
  type: 'Movie' | 'VideoGame'
  name: string
  year: string
  director?: string[] // películas
  studio?: string // videojuegos
}

export const REVIEWED: Record<string, ReviewedItem> = {
  'spider-man-2-2004-analisis-mejor-pelicula-superheroes': { type: 'Movie', name: 'Spider-Man 2', year: '2004', director: ['Sam Raimi'] },
  'the-amazing-spider-man-2012-revaloracion-andrew-garfield': { type: 'Movie', name: 'The Amazing Spider-Man', year: '2012', director: ['Marc Webb'] },
  'spider-man-into-the-spider-verse-analisis-revolucion-animacion': {
    type: 'Movie', name: 'Spider-Man: Un nuevo universo', year: '2018', director: ['Bob Persichetti', 'Peter Ramsey', 'Rodney Rothman'],
  },
  'spider-man-no-way-home-analisis': { type: 'Movie', name: 'Spider-Man: No Way Home', year: '2021', director: ['Jon Watts'] },
  'across-the-spider-verse-analisis': {
    type: 'Movie', name: 'Spider-Man: Cruzando el Multiverso', year: '2023', director: ['Joaquim Dos Santos', 'Kemp Powers', 'Justin K. Thompson'],
  },
  'marvels-spider-man-ps4-2018-analisis-insomniac': { type: 'VideoGame', name: "Marvel's Spider-Man", year: '2018', studio: 'Insomniac Games' },
  'spider-man-miles-morales-ps5-analisis': { type: 'VideoGame', name: "Marvel's Spider-Man: Miles Morales", year: '2020', studio: 'Insomniac Games' },
  'marvels-spider-man-2-ps5-analisis': { type: 'VideoGame', name: "Marvel's Spider-Man 2", year: '2023', studio: 'Insomniac Games' },
}

// «Puntuación: 9,5/10» → 9.5
export function scoreFromContent(html: string): number | null {
  const m = html.match(/Puntuaci[oó]n:\s*([\d]+(?:[.,]\d+)?)\s*\/\s*10/i)
  if (!m) return null
  const n = parseFloat(m[1].replace(',', '.'))
  return n >= 0 && n <= 10 ? n : null
}

export function reviewJsonLd(
  post: { slug: string; title: string; excerpt: string; content: string; publishDate: Date; image: string | null },
  url: string,
  siteUrl: string,
) {
  const item = REVIEWED[post.slug]
  const score = item ? scoreFromContent(post.content) : null
  if (!item || score === null) return null
  const image = post.image ? (post.image.startsWith('/') ? `${siteUrl}${post.image}` : post.image) : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: post.title,
    url,
    datePublished: post.publishDate.toISOString(),
    reviewBody: post.excerpt,
    author: { '@type': 'Organization', name: 'Sentido Arácnido', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Sentido Arácnido', url: siteUrl },
    reviewRating: { '@type': 'Rating', ratingValue: score, bestRating: 10, worstRating: 0 },
    itemReviewed:
      item.type === 'Movie'
        ? {
          '@type': 'Movie',
          name: item.name,
          dateCreated: item.year,
          image,
          director: item.director?.map((name) => ({ '@type': 'Person', name })),
        }
        : {
          '@type': 'VideoGame',
          name: item.name,
          datePublished: item.year,
          image,
          author: item.studio ? { '@type': 'Organization', name: item.studio } : undefined,
          gamePlatform: 'PlayStation',
          applicationCategory: 'Game',
        },
  }
}
