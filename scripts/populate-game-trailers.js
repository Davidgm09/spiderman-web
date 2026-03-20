// scripts/populate-game-trailers.js
// Busca trailers oficiales en YouTube para cada juego y actualiza playUrl en la DB.
// Uso: node scripts/populate-game-trailers.js [--dry-run]

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const DRY_RUN = process.argv.includes('--dry-run')

// Overrides manuales para juegos donde la búsqueda automática puede fallar
// o donde conocemos el trailer exacto. Clave = slug del juego.
const MANUAL_OVERRIDES = {
  'the-amazing-spider-man-vs-the-kingpin-1990':
    'https://www.youtube.com/watch?v=U25QCLf5qYs',
  'spider-man-and-venom-maximum-carnage-1994':
    'https://www.youtube.com/watch?v=6iYjezUC-6U',
  'spider-man-2000-2000':
    'https://www.youtube.com/watch?v=vDp4JvDx8cI',
  'spider-man-mysterio-s-menace-2001':
    'https://www.youtube.com/watch?v=G0n47HT6X6E',
  'spider-man-2-enter-electro-2001':
    'https://www.youtube.com/watch?v=WUvov69CmHw',
  'spider-man-2-the-game-2004':
    'https://www.youtube.com/watch?v=u_qNg4YTLUA',
  'ultimate-spider-man-2005':
    'https://www.youtube.com/watch?v=lCMyiYeXPHQ',
  'spider-man-web-of-shadows-2008':
    'https://www.youtube.com/watch?v=f_7uOrS_mvw',
  'spider-man-shattered-dimensions-2010':
    'https://www.youtube.com/watch?v=W-7iyF0bSwI',
  'marvel-s-spider-man-2018':
    'https://www.youtube.com/watch?v=q4GdJVvdxss',
  'marvel-s-spider-man-the-city-that-never-sleeps-2018':
    'https://www.youtube.com/watch?v=q4GdJVvdxss',
  'marvel-s-spider-man-the-heist-2018':
    'https://www.youtube.com/watch?v=q4GdJVvdxss',
  'marvel-s-spider-man-silver-lining-2018':
    'https://www.youtube.com/watch?v=q4GdJVvdxss',
  'marvel-s-spider-man-remastered-2020':
    'https://www.youtube.com/watch?v=_odHWsYOm2k',
  'marvel-s-spider-man-miles-morales-2020':
    'https://www.youtube.com/watch?v=3wHL2VIaFcs',
  'marvel-s-spider-man-2-2023':
    'https://www.youtube.com/watch?v=9fVYKsEmuRo',
  'marvel-s-spider-man-2-pc-port-2025':
    'https://www.youtube.com/watch?v=9fVYKsEmuRo',
}

async function searchYouTubeTrailer(title, year) {
  const query = `${title} ${year} official trailer`
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.text()
      console.error(`   YouTube API error: ${res.status} — ${err.substring(0, 200)}`)
      return null
    }
    const data = await res.json()
    const item = data.items?.[0]
    if (!item) return null
    const videoId = item.id?.videoId
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null
  } catch (e) {
    console.error(`   Fetch error: ${e.message}`)
    return null
  }
}

async function main() {
  console.log(`\n🕷️  Spider-Man Game Trailer Populator ${DRY_RUN ? '(DRY RUN)' : ''}\n`)

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YOUTUBE_API_KEY no está definida en .env')
    process.exit(1)
  }

  const games = await prisma.game.findMany({
    select: { id: true, slug: true, title: true, year: true, playUrl: true },
    orderBy: { year: 'asc' },
  })

  console.log(`📋 ${games.length} juegos encontrados\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const game of games) {
    const override = MANUAL_OVERRIDES[game.slug]

    if (override) {
      console.log(`✅ ${game.title} (${game.year}) — override manual`)
      if (!DRY_RUN) {
        await prisma.game.update({ where: { id: game.id }, data: { playUrl: override } })
      }
      updated++
      continue
    }

    // Si ya tiene URL y no hay override, se omite salvo que se pase --force
    if (game.playUrl && !process.argv.includes('--force')) {
      console.log(`⏭️  ${game.title} — ya tiene tráiler, omitiendo`)
      skipped++
      continue
    }

    console.log(`🔍 Buscando tráiler: ${game.title} (${game.year})...`)
    const trailerUrl = await searchYouTubeTrailer(game.title, game.year)

    if (trailerUrl) {
      console.log(`   ✅ Encontrado: ${trailerUrl}`)
      if (!DRY_RUN) {
        await prisma.game.update({ where: { id: game.id }, data: { playUrl: trailerUrl } })
      }
      updated++
    } else {
      console.log(`   ❌ No encontrado`)
      failed++
    }

    // Pausa para no saturar la API
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n📊 Resumen:`)
  console.log(`   ✅ Actualizados: ${updated}`)
  console.log(`   ⏭️  Omitidos:    ${skipped}`)
  console.log(`   ❌ Fallados:     ${failed}`)

  await prisma.$disconnect()
}

main().catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
