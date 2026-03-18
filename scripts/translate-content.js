// Traduce descripciones de videojuegos y cómics al español
// Uso: node scripts/translate-content.js [--games] [--comics] (sin flags = ambos)
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const args = process.argv.slice(2)
const doGames = args.length === 0 || args.includes('--games')
const doComics = args.length === 0 || args.includes('--comics')

let translateFn = null

async function translate(text, retries = 5) {
  if (!text || text.trim() === '') return text
  if (!translateFn) {
    const mod = await import('@vitalets/google-translate-api')
    translateFn = mod.translate
  }
  try {
    const result = await translateFn(text, { from: 'en', to: 'es' })
    return result.text
  } catch (err) {
    if (err.message?.includes('429') && retries > 0) {
      const wait = (6 - retries) * 8000 // 8s, 16s, 24s, 32s, 40s
      console.log(`  ⏳ Rate limit, esperando ${wait/1000}s... (${retries} reintentos)`)
      await sleep(wait)
      return translate(text, retries - 1)
    }
    console.error('  ❌ Error traduciendo:', err.message)
    return null // null = falló, no guardar
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Detecta si un texto está mayoritariamente en inglés
function isEnglish(text) {
  if (!text) return false
  const spanishWords = ['el ', 'la ', 'los ', 'las ', 'es ', 'en ', 'de ', 'que ', 'un ', 'una ', 'con ', 'por ', 'para ']
  const lower = text.toLowerCase()
  const matches = spanishWords.filter(w => lower.includes(w)).length
  return matches < 3
}

async function translateGames() {
  const games = await prisma.game.findMany({
    select: { id: true, title: true, description: true, longDescription: true, seoTitle: true, seoDescription: true }
  })

  console.log(`\n🎮 Traduciendo ${games.length} videojuegos...\n`)

  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    console.log(`[${i + 1}/${games.length}] ${game.title}`)

    const updates = {}

    if (isEnglish(game.description)) {
      const t = await translate(game.description)
      if (t) updates.description = t
      await sleep(2000)
    }

    if (isEnglish(game.seoDescription)) {
      const t = await translate(game.seoDescription)
      if (t) updates.seoDescription = t
      await sleep(2000)
    }

    if (isEnglish(game.seoTitle)) {
      const t = await translate(game.seoTitle)
      if (t) updates.seoTitle = t
      await sleep(2000)
    }

    if (isEnglish(game.longDescription)) {
      if (!game.longDescription.includes('<') || game.longDescription.length < 2000) {
        const t = await translate(game.longDescription)
        if (t) updates.longDescription = t
        await sleep(2000)
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.game.update({ where: { id: game.id }, data: updates })
      console.log(`  ✅ Actualizado (${Object.keys(updates).join(', ')})`)
    } else {
      console.log(`  ⏭️  Ya en español`)
    }

    await sleep(1000)
  }
}

async function translateComics() {
  const comics = await prisma.comic.findMany({
    select: { id: true, title: true, description: true, seoTitle: true, seoDescription: true }
  })

  console.log(`\n📚 Traduciendo ${comics.length} cómics...\n`)

  for (let i = 0; i < comics.length; i++) {
    const comic = comics[i]
    console.log(`[${i + 1}/${comics.length}] ${comic.title}`)

    const updates = {}

    if (isEnglish(comic.description)) {
      const t = await translate(comic.description)
      if (t) updates.description = t
      await sleep(2000)
    }

    if (isEnglish(comic.seoDescription)) {
      const t = await translate(comic.seoDescription)
      if (t) updates.seoDescription = t
      await sleep(2000)
    }

    if (isEnglish(comic.seoTitle)) {
      const t = await translate(comic.seoTitle)
      if (t) updates.seoTitle = t
      await sleep(2000)
    }

    if (Object.keys(updates).length > 0) {
      await prisma.comic.update({ where: { id: comic.id }, data: updates })
      console.log(`  ✅ Actualizado (${Object.keys(updates).join(', ')})`)
    } else {
      console.log(`  ⏭️  Ya en español`)
    }

    await sleep(1000)
  }
}

async function main() {
  console.log('🕷️  Spider-World — Traductor de contenido')
  console.log('==========================================')

  if (doGames) await translateGames()
  if (doComics) await translateComics()

  console.log('\n✅ Traducción completada.')
  await prisma.$disconnect()
}

main().catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
