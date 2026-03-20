/**
 * Actualiza writer/artist de cada cómic usando Comic Vine
 * Estrategia: volumen ID (por serie) + número de issue → ID del issue → person_credits
 * Uso: node scripts/update-comic-credits.js
 */

const { PrismaClient } = require('@prisma/client')
const https = require('https')
require('dotenv').config()

const prisma = new PrismaClient()
const API_KEY = process.env.COMICVINE_API_KEY

// Mapa: nombre de serie → Comic Vine volume ID
const VOLUME_IDS = {
  'The Amazing Spider-Man':          2127,
  'The Amazing Spider-Man Annual':   2189,
  'The Spectacular Spider-Man':      2870,
  'Spectacular Spider-Man':          11069,
  'The Spectacular Spider-Man Annual': 3012,
  'Ultimate Spider-Man':             7257,
  'Spider-Gwen':                     80298,
  'Giant-Size Spider-Man':           2686,
  'Edge of Spider-Verse':            76863,
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SpiderWorld/1.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

const delay = ms => new Promise(r => setTimeout(r, ms))

function parseTitle(title) {
  // "The Amazing Spider-Man #102" → { series: "The Amazing Spider-Man", number: "102" }
  const match = title.match(/^(.*?)\s*#(\d+[\w½]*)$/)
  if (match) return { series: match[1].trim(), number: match[2] }
  return null
}

async function getCredits(title) {
  const parsed = parseTitle(title)
  if (!parsed) return null

  const volumeId = VOLUME_IDS[parsed.series]
  if (!volumeId) return null

  // Paso 1: obtener el ID del issue por volumen + número
  const issuesUrl = `https://comicvine.gamespot.com/api/issues/?api_key=${API_KEY}&format=json&filter=volume:${volumeId},issue_number:${parsed.number}&field_list=id,issue_number&limit=1`
  const issuesData = await fetchJson(issuesUrl)
  const issueId = issuesData?.results?.[0]?.id
  if (!issueId) return null

  await delay(500)

  // Paso 2: obtener créditos del issue individual
  const detailUrl = `https://comicvine.gamespot.com/api/issue/4000-${issueId}/?api_key=${API_KEY}&format=json&field_list=person_credits`
  const detailData = await fetchJson(detailUrl)
  const credits = detailData?.results?.person_credits || []

  const writers = credits.filter(p => p.role?.toLowerCase().includes('writer')).map(p => p.name)
  const artists = credits.filter(p => p.role?.toLowerCase().includes('penciler') || p.role?.toLowerCase().includes('artist')).map(p => p.name)

  return {
    writer: writers[0] || null,
    artist: artists[0] || null,
  }
}

async function main() {
  const comics = await prisma.comic.findMany({
    select: { id: true, title: true, writer: true }
  })

  const toUpdate = comics.filter(c => c.writer === 'Marvel Comics')
  console.log(`Actualizando ${toUpdate.length} cómics...\n`)

  let updated = 0
  let skipped = 0
  let noVolume = 0

  for (const comic of toUpdate) {
    try {
      const parsed = parseTitle(comic.title)
      if (!parsed || !VOLUME_IDS[parsed.series]) {
        console.log(`⏭️  Sin volumen mapeado: ${comic.title}`)
        noVolume++
        continue
      }

      const credits = await getCredits(comic.title)

      if (credits?.writer || credits?.artist) {
        await prisma.comic.update({
          where: { id: comic.id },
          data: {
            ...(credits.writer && { writer: credits.writer }),
            ...(credits.artist && { artist: credits.artist }),
          }
        })
        console.log(`✅ ${comic.title} → ${credits.writer || '?'} / ${credits.artist || '?'}`)
        updated++
      } else {
        console.log(`⚠️  Sin créditos: ${comic.title}`)
        skipped++
      }

      await delay(1500) // Comic Vine: rate limit estricto
    } catch (e) {
      console.error(`❌ Error en ${comic.title}:`, e.message)
      await delay(3000)
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Actualizados: ${updated} | Sin datos: ${skipped} | Sin volumen: ${noVolume}`)
}

main().catch(e => { console.error(e); process.exit(1) })