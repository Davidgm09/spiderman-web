// Utilidades compartidas por los minijuegos de /juegos (solo se usan en el navegador)

export interface GameCharacter {
  slug: string
  name: string
  image: string
  terms: string[]
  gender: string
  category: string
  universe: string
  year: number
  creators: string[]
  groups: string[]
  clue: string
}

// Primer reto del juego diario: 16 de octubre de 2026 (reto #1)
const FIRST_DAY = Date.UTC(2026, 9, 16)
const DAY_MS = 86_400_000

// Fecha de hoy en España, para que el reto cambie a medianoche hora peninsular
export function madridToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now)
}

export function dayNumber(date = madridToday()): number {
  const [y, m, d] = date.split('-').map(Number)
  return Math.floor((Date.UTC(y, m - 1, d) - FIRST_DAY) / DAY_MS) + 1
}

// Milisegundos hasta la próxima medianoche en Madrid (para la cuenta atrás)
export function msUntilNextDay(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value || 0)
  const elapsed = (get('hour') * 3600 + get('minute') * 60 + get('second')) * 1000
  return DAY_MS - elapsed
}

// Generador pseudoaleatorio con semilla (mismo resultado en todos los navegadores)
export function seededRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Personaje del reto n: cada vuelta de N días recorre todos los personajes en un orden distinto
export function dailyCharacter<T extends { slug: string }>(characters: T[], day: number): T {
  const sorted = [...characters].sort((a, b) => a.slug.localeCompare(b.slug))
  const n = sorted.length
  const index = (((day - 1) % n) + n) % n
  const round = Math.floor((day - 1) / n)
  return shuffle(sorted, seededRandom(20261017 + round))[index]
}

// localStorage puede no existir o lanzar (modo privado, cookies bloqueadas): los juegos funcionan igual
export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function saveState(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // sin almacenamiento: no se guardan las estadísticas
  }
}

// Comparación de textos sin tildes ni mayúsculas (para el buscador)
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}
