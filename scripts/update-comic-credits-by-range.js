/**
 * Actualiza writer/artist por rangos conocidos de series
 * Solo actualiza cómics que aún tienen "Marvel Comics" como placeholder
 * Uso: node scripts/update-comic-credits-by-range.js
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

// Mapeo: { serie, desde, hasta, writer, artist }
// Para rangos sin límite superior usar 9999
const CREDITS_BY_RANGE = [
  // === The Amazing Spider-Man (1963) ===
  // Stan Lee escribió del #1 al #100, con Ditko en lápices hasta #38
  { series: 'The Amazing Spider-Man', from: 1,   to: 38,  writer: 'Stan Lee',       artist: 'Steve Ditko' },
  { series: 'The Amazing Spider-Man', from: 39,  to: 100, writer: 'Stan Lee',       artist: 'John Romita Sr.' },
  { series: 'The Amazing Spider-Man', from: 101, to: 110, writer: 'Roy Thomas',     artist: 'Gil Kane' },
  { series: 'The Amazing Spider-Man', from: 111, to: 149, writer: 'Gerry Conway',   artist: 'John Romita Sr.' },

  // === The Amazing Spider-Man Annual ===
  { series: 'The Amazing Spider-Man Annual', from: 1,  to: 18, writer: 'Stan Lee',     artist: 'Steve Ditko' },
  { series: 'The Amazing Spider-Man Annual', from: 19, to: 27, writer: 'Gerry Conway', artist: 'Ron Frenz' },

  // === The Spectacular Spider-Man (1976) ===
  { series: 'The Spectacular Spider-Man', from: 1,   to: 21,  writer: 'Gerry Conway', artist: 'Sal Buscema' },
  { series: 'The Spectacular Spider-Man', from: 22,  to: 60,  writer: 'Bill Mantlo',  artist: 'Sal Buscema' },
  { series: 'The Spectacular Spider-Man', from: 61,  to: 100, writer: 'Bill Mantlo',  artist: 'Al Milgrom' },
  { series: 'The Spectacular Spider-Man', from: 101, to: 132, writer: 'Peter David',  artist: 'Rich Buckler' },
  { series: 'The Spectacular Spider-Man', from: 133, to: 145, writer: 'Gerry Conway', artist: 'Sal Buscema' },

  // === The Spectacular Spider-Man Annual ===
  { series: 'The Spectacular Spider-Man Annual', from: 1,  to: 6,  writer: 'Bill Mantlo',       artist: 'Sal Buscema' },
  { series: 'The Spectacular Spider-Man Annual', from: 7,  to: 14, writer: 'Gerry Conway',       artist: 'Sal Buscema' },

  // === Spectacular Spider-Man (2003) ===
  { series: 'Spectacular Spider-Man', from: 1,  to: 27, writer: 'Paul Jenkins',        artist: 'Humberto Ramos' },

  // === Ultimate Spider-Man (2000) ===
  { series: 'Ultimate Spider-Man', from: 1,   to: 110, writer: 'Brian Michael Bendis', artist: 'Mark Bagley' },
  { series: 'Ultimate Spider-Man', from: 111, to: 133, writer: 'Brian Michael Bendis', artist: 'Stuart Immonen' },

  // === Spider-Gwen (2015) ===
  { series: 'Spider-Gwen', from: 0, to: 34, writer: 'Jason Latour', artist: 'Robbi Rodriguez' },

  // === Giant-Size Spider-Man (1974) ===
  { series: 'Giant-Size Spider-Man', from: 1, to: 6, writer: 'Gerry Conway', artist: 'Ross Andru' },

  // === Edge of Spider-Verse (2014) ===
  { series: 'Edge of Spider-Verse', from: 1, to: 5, writer: 'Jason Latour', artist: 'Robbi Rodriguez' },
]

function parseTitle(title) {
  const match = title.match(/^(.*?)\s*#(\d+)/)
  if (match) return { series: match[1].trim(), number: parseInt(match[2]) }
  // Handle #0
  const match0 = title.match(/^(.*?)\s*#(0)$/)
  if (match0) return { series: match0[1].trim(), number: 0 }
  return null
}

function findCredits(title) {
  const parsed = parseTitle(title)
  if (!parsed) return null

  const range = CREDITS_BY_RANGE.find(r =>
    r.series === parsed.series &&
    parsed.number >= r.from &&
    parsed.number <= r.to
  )
  return range ? { writer: range.writer, artist: range.artist } : null
}

async function main() {
  const comics = await prisma.comic.findMany({
    select: { id: true, title: true, writer: true, artist: true }
  })

  const toUpdate = comics.filter(c => c.writer === 'Marvel Comics')
  console.log(`Cómics con placeholder: ${toUpdate.length}\n`)

  let updated = 0
  let skipped = 0

  for (const comic of toUpdate) {
    const credits = findCredits(comic.title)
    if (credits) {
      await prisma.comic.update({
        where: { id: comic.id },
        data: { writer: credits.writer, artist: credits.artist }
      })
      console.log(`✅ ${comic.title} → ${credits.writer} / ${credits.artist}`)
      updated++
    } else {
      console.log(`⏭️  Sin rango: ${comic.title}`)
      skipped++
    }
  }

  await prisma.$disconnect()
  console.log(`\n✅ Actualizados: ${updated} | Sin rango: ${skipped}`)
}

main().catch(e => { console.error(e); process.exit(1) })