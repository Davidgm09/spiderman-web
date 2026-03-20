// Traduce descripciones de videojuegos y cómics al español
// Uso: node scripts/translate-content.js [--games] [--comics] (sin flags = ambos)
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const args = process.argv.slice(2)
const doGames = args.length === 0 || args.includes('--games')
const doComics = args.length === 0 || args.includes('--comics')

const LINGVA_INSTANCES = [
  'https://lingva.ml',
  'https://lingva.thedaviddelta.com',
  'https://translate.plausibility.cloud',
]
let lingvaIndex = 0

async function translate(text, depth = 0) {
  if (!text || text.trim() === '') return text
  if (depth >= LINGVA_INSTANCES.length) return null
  const instance = LINGVA_INSTANCES[lingvaIndex % LINGVA_INSTANCES.length]
  try {
    const encoded = encodeURIComponent(text)
    const res = await fetch(`${instance}/api/v1/en/es/${encoded}`)
    if (!res.ok) {
      lingvaIndex++
      console.log(`  ⚡ Cambiando a ${LINGVA_INSTANCES[lingvaIndex % LINGVA_INSTANCES.length]}`)
      return translate(text, depth + 1)
    }
    const data = await res.json()
    if (data.translation) return data.translation
    console.error('  ❌ Lingva error:', data.error)
    return null
  } catch (err) {
    lingvaIndex++
    console.error('  ❌ Error traduciendo:', err.message)
    return translate(text, depth + 1)
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Detecta si un texto está mayoritariamente en inglés
function isEnglish(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  const spanishWords = ['el ', 'la ', 'los ', 'las ', ' es ', 'de ', 'que ', 'una ', 'con ', 'por ', 'para ', 'también', 'cuando', 'pero ', 'como ']
  const englishWords = [' the ', ' and ', ' is ', ' are ', ' was ', ' were ', ' has ', ' have ', ' with ', ' from ', ' that ', ' this ', ' his ', ' her ', ' they ', ' their ', ' will ']
  const spanishCount = spanishWords.filter(w => lower.includes(w)).length
  const englishCount = englishWords.filter(w => lower.includes(w)).length
  if (englishCount >= 3) return true
  return spanishCount < 3
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
    select: { id: true, title: true, description: true, longDescription: true, seoTitle: true, seoDescription: true }
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

    if (isEnglish(comic.longDescription)) {
      const t = await translate(comic.longDescription)
      if (t) updates.longDescription = t
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
