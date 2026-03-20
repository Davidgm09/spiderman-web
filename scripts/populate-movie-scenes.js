/**
 * Rellena sceneImages de cada película con backdrops de TMDB
 * Uso: node scripts/populate-movie-scenes.js
 */

const { PrismaClient } = require('@prisma/client')
const https = require('https')
require('dotenv').config()

const prisma = new PrismaClient()
const API_KEY = process.env.TMDB_API_KEY
const IMG_BASE = 'https://image.tmdb.org/t/p/w1280'

// TMDB IDs por slug de película
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

const SCENE_TITLES = [
  'Escena icónica',
  'Momento épico',
  'Acción sin límites',
  'El clímax',
  'Instante memorable',
  'Gran final',
]

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
        `https://api.themoviedb.org/3/movie/${tmdbId}/images?api_key=${API_KEY}&include_image_language=null`
      )

      const all = (data.backdrops || []).filter(b => b.vote_average > 0)
      if (all.length === 0) {
        console.log(`⚠️  Sin backdrops: ${movie.title}`)
        continue
      }
      // Tomar imágenes distribuidas a lo largo del array para mayor variedad
      const step = Math.max(1, Math.floor(all.length / 6))
      const backdrops = Array.from({ length: 6 }, (_, i) => all[Math.min(i * step, all.length - 1)])

      if (backdrops.length === 0) {
        console.log(`⚠️  Sin backdrops: ${movie.title}`)
        continue
      }

      const sceneImages = backdrops.map((b, i) => ({
        url: `${IMG_BASE}${b.file_path}`,
        title: `${movie.title} — ${SCENE_TITLES[i] || `Escena ${i + 1}`}`,
        description: 'Un gran poder conlleva una gran responsabilidad.',
      }))

      await prisma.movie.update({
        where: { id: movie.id },
        data: { sceneImages },
      })

      console.log(`✅ ${movie.title}: ${sceneImages.length} imágenes`)
      await delay(300)
    } catch (e) {
      console.error(`❌ Error en ${movie.title}:`, e.message)
    }
  }

  await prisma.$disconnect()
  console.log('\n✅ Listo')
}

main().catch((e) => { console.error(e); process.exit(1) })