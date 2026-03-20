/**
 * Re-fetchea descripciones completas de RAWG y actualiza longDescription en BD
 * Uso: node scripts/refresh-game-descriptions.js
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const RAWG_KEY = process.env.RAWG_API_KEY

const KNOWN_GAME_IDS = [
  58134,   // Marvel's Spider-Man (2018)
  663742,  // Marvel's Spider-Man Remastered
  452634,  // Marvel's Spider-Man: Miles Morales
  662316,  // Marvel's Spider-Man 2
  989789,  // Marvel's Spider-Man 2 PC Port
  249966,  // Spider-Man (2000)
  36795,   // Ultimate Spider-Man (2005)
  57794,   // Spider-Man 2: Enter Electro
  24687,   // Spider-Man: Web of Shadows
  57183,   // Spider-Man and Venom: Maximum Carnage
  53553,   // Spider-Man: Mysterio's Menace
]

async function main() {
  console.log('🎮 Refreshing game descriptions from RAWG...\n')
  let updated = 0

  for (const rawgId of KNOWN_GAME_IDS) {
    const res = await fetch(`https://api.rawg.io/api/games/${rawgId}?key=${RAWG_KEY}`)
    const data = await res.json()

    if (!data.description || data.description.trim().length < 100) {
      console.log(`⏭️  ${data.name} — sin descripción en RAWG`)
      await delay(300)
      continue
    }

    // Buscar en BD por título exacto o slug
    const game = await prisma.game.findFirst({
      where: { OR: [
        { title: data.name },
        { slug: { contains: data.slug?.replace(/-/g, '').substring(0, 15) } }
      ]},
      select: { id: true, title: true, longDescription: true }
    }) || await prisma.game.findFirst({
      where: { title: { contains: data.name } },
      select: { id: true, title: true, longDescription: true }
    })

    if (!game) {
      console.log(`⚠️  ${data.name} — no encontrado en BD`)
      await delay(300)
      continue
    }

    const currentLen = game.longDescription?.replace(/<[^>]*>/g, '').trim().length || 0
    const newLen = data.description.replace(/<[^>]*>/g, '').trim().length

    if (newLen > currentLen + 100) {
      await prisma.game.update({
        where: { id: game.id },
        data: { longDescription: data.description }
      })
      console.log(`✅ ${game.title} (${currentLen} → ${newLen} chars)`)
      updated++
    } else {
      console.log(`⏭️  ${game.title} — ya tiene contenido suficiente`)
    }

    await delay(400)
  }

  console.log(`\n✅ Completado: ${updated} juegos actualizados.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
