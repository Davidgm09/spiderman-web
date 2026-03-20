/**
 * Re-fetchea las descripciones completas de Comic Vine y actualiza longDescription en BD
 * Uso: node scripts/refresh-comic-descriptions.js
 */
const { PrismaClient } = require('@prisma/client')
const https = require('https')
require('dotenv').config()

const prisma = new PrismaClient()
const API_KEY = process.env.COMICVINE_API_KEY
const BASE_URL = 'https://comicvine.gamespot.com/api'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const SERIES_TO_FETCH = [
  'Amazing Spider-Man',
  'Ultimate Spider-Man',
  'Spectacular Spider-Man',
  'Miles Morales Spider-Man',
  'Spider-Gwen',
  'Spider-Verse',
]

function cvGet(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}/`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('format', 'json')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  return new Promise((resolve, reject) => {
    https.get(url.toString(), { headers: { 'User-Agent': 'Spider-World/1.0' } }, (res) => {
      let raw = ''
      res.on('data', (chunk) => (raw += chunk))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw)
          if (parsed.status_code !== 1) reject(new Error(`CV error: ${parsed.error}`))
          else resolve(parsed)
        } catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function generateSlug(title, year) {
  return `${title}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('🕷️  Refreshing comic descriptions from Comic Vine...\n')

  let updated = 0
  let skipped = 0

  for (const seriesName of SERIES_TO_FETCH) {
    console.log(`\n📚 Buscando volúmenes: "${seriesName}"...`)

    const volData = await cvGet('/volumes', {
      filter: `name:${seriesName}`,
      field_list: 'id,name,start_year',
      limit: 5,
    }).catch(() => ({ results: [] }))

    const volumes = (volData.results || []).filter((v) => {
      const name = (v.name || '').toLowerCase()
      return name.includes('spider-man') || name.includes('spider-gwen') ||
             name.includes('miles morales') || name.includes('spider-verse')
    })

    for (const volume of volumes) {
      console.log(`  📖 Volumen: ${volume.name} (${volume.start_year})`)
      await delay(1000)

      const issueData = await cvGet('/issues', {
        filter: `volume:${volume.id}`,
        field_list: 'id,name,issue_number,cover_date,description',
        limit: 100,
        sort: 'issue_number:asc',
      }).catch(() => ({ results: [] }))

      for (const issue of issueData.results || []) {
        if (!issue.description || issue.description.trim().length < 100) {
          skipped++
          continue
        }

        const year = issue.cover_date
          ? new Date(issue.cover_date).getFullYear()
          : parseInt(volume.start_year || '2000')
        const title = `${volume.name} #${issue.issue_number}`
        const slug = generateSlug(title, year)

        const comic = await prisma.comic.findFirst({ where: { slug } })
        if (!comic) { skipped++; continue }

        // Solo actualizar si el contenido de CV es más rico que lo que tenemos
        const currentLen = comic.longDescription?.replace(/<[^>]*>/g, '').trim().length || 0
        const newLen = issue.description.replace(/<[^>]*>/g, '').trim().length

        if (newLen > currentLen + 100) {
          await prisma.comic.update({
            where: { id: comic.id },
            data: { longDescription: issue.description }
          })
          console.log(`    ✅ ${title} (${currentLen} → ${newLen} chars)`)
          updated++
        } else {
          skipped++
        }

        await delay(500)
      }
    }
  }

  console.log(`\n✅ Completado: ${updated} actualizados, ${skipped} sin cambios.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
