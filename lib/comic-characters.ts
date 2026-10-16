import type { Character } from '@prisma/client'

// Nombres de Comic Vine que no se deben deducir: alias fijos y personajes homónimos
const ALIASES: Record<string, string> = {
  'spider-man': 'spider-man-peter-parker-alt',
  'kaine': 'kaine-parker-scarlet-spider-alt',
}
const NEVER_MATCH = new Set([
  'gwen stacy',    // la Gwen clásica (novia de Peter), no Spider-Gwen de Tierra-65
  'spider-woman',  // en Comic Vine suele ser Jessica Drew, no Julia Carpenter
])

const lower = (s: string) => s.toLowerCase().trim()
// "Green Goblin (Norman Osborn)" -> { base: "green goblin", inner: "norman osborn" }
function split(name: string) {
  const m = name.match(/^(.*?)\s*\(([^)]*)\)\s*$/)
  return m ? { base: lower(m[1]), inner: lower(m[2]) } : { base: lower(name), inner: '' }
}

// Emparejamiento estricto: un nombre parecido no basta ("Lex Luthor" no es Thor, "Vulture (Drago)" no es Toomes)
export function matchCharacter(name: string, characters: Character[]): Character | null {
  const n = lower(name)
  if (NEVER_MATCH.has(n)) return null
  if (ALIASES[n]) return characters.find(c => c.slug === ALIASES[n]) ?? null

  const exact = characters.find(c => lower(c.name) === n)
  if (exact) return exact

  const cv = split(name)
  return characters.find(c => {
    const db = split(c.name)
    if (cv.inner) return cv.base === db.base && db.inner.includes(cv.inner) // "Hobgoblin (Kingsley)"
    return cv.base === db.base || cv.base === db.inner                     // "Doctor Octopus" o "Norman Osborn"
  }) ?? null
}
