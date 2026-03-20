// Script de prueba — traduce 2 juegos y 2 cómics para ver la calidad
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function translate(text) {
  if (!text || text.trim() === '') return text
  try {
    const { translate } = await import('@vitalets/google-translate-api')
    const result = await translate(text, { from: 'en', to: 'es' })
    return result.text
  } catch (err) {
    console.error('Error traduciendo:', err.message)
    return text // Devuelve el original si falla
  }
}

async function main() {
  console.log('🔍 Obteniendo muestra de videojuegos...')
  const games = await prisma.game.findMany({ take: 2, select: { id: true, title: true, description: true } })

  console.log('\n🔍 Obteniendo muestra de cómics...')
  const comics = await prisma.comic.findMany({ take: 2, select: { id: true, title: true, description: true } })

  console.log('\n📝 Traduciendo...\n')

  for (const game of games) {
    console.log(`🎮 ${game.title}`)
    console.log(`  ORIGINAL:  ${game.description?.substring(0, 200)}`)
    const translated = await translate(game.description || '')
    console.log(`  TRADUCIDO: ${translated.substring(0, 200)}`)
    console.log()
  }

  for (const comic of comics) {
    console.log(`📚 ${comic.title}`)
    console.log(`  ORIGINAL:  ${comic.description?.substring(0, 200)}`)
    const translated = await translate(comic.description || '')
    console.log(`  TRADUCIDO: ${translated.substring(0, 200)}`)
    console.log()
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
