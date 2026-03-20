/**
 * Actualiza castWithPhotos de todas las películas con hasta 12 actores desde TMDB
 * Uso: node scripts/update-movie-cast.js
 */

const { PrismaClient } = require('@prisma/client')
const https = require('https')
require('dotenv').config()

const prisma = new PrismaClient()
const API_KEY = process.env.TMDB_API_KEY
const IMG_W185 = 'https://image.tmdb.org/t/p/w185'

const TMDB_IDS = {
  'spider-man-2002':                                557,
  'spider-man-2-2004':                              558,
  'spider-man-3-2007':                              559,
  'the-amazing-spider-man-2012':                    1930,
  'the-amazing-spider-man-2-el-poder-de-electro-2014': 102382,
  'spider-man-homecoming-2017':                     315635,
  'spider-man-un-nuevo-universo-2018':              324857,
  'spider-man-lejos-de-casa-2019':                  429617,
  'spider-man-no-way-home-2021':                    634649,
  'spider-man-cruzando-el-multiverso-2023':         569094,
  'venom-2018':                                     335983,
  'venom-habra-matanza-2021':                       580489,
  'morbius-2022':                                   526896,
  'kraven-the-hunter-2024':                         539972,
  'madame-web-2024':                                634492,
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const movies = await prisma.movie.findMany({ select: { id: true, slug: true, title: true } })

  for (const movie of movies) {
    const tmdbId = TMDB_IDS[movie.slug]
    if (!tmdbId) {
      console.log(`⚠️  Sin TMDB ID: ${movie.slug}`)
      continue
    }

    try {
      const data = await fetchJson(
        `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${API_KEY}`
      )

      const castWithPhotos = (data.cast || [])
        .filter(a => a.profile_path)
        .filter(a => !a.character.toLowerCase().includes('uncredited'))
        .filter(a => a.popularity >= 3)
        .slice(0, 12)
        .map(a => ({
          name: a.name,
          character: a.character,
          photo: `${IMG_W185}${a.profile_path}`,
          bio: `${a.name} interpreta a ${a.character} en ${movie.title}`,
        }))

      await prisma.movie.update({
        where: { id: movie.id },
        data: { castWithPhotos },
      })

      console.log(`✅ ${movie.title}: ${castWithPhotos.length} actores`)
      await delay(300)
    } catch (e) {
      console.error(`❌ Error en ${movie.title}:`, e.message)
    }
  }

  await prisma.$disconnect()
  console.log('\n✅ Listo')
}

main().catch(e => { console.error(e); process.exit(1) })