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
  since?: number // reto a partir del cual entra en el juego (sin valor: desde el reto #1)
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

// Personaje del reto n: cada vuelta de N días recorre todos los personajes en un orden distinto.
// Cuando entran personajes nuevos (campo `since`) empieza una «época» nueva desde ese reto, así que
// los retos anteriores no cambian. En la primera vuelta de cada época, los personajes que salieron
// justo antes pasan al final para que no se repitan enseguida.
export function dailyCharacter<T extends { slug: string; since?: number }>(characters: T[], day: number): T {
  const cache = new Map<number, T>()
  const pick = (d: number): T => {
    const cached = cache.get(d)
    if (cached) return cached
    const starts = characters.map((c) => c.since ?? 1).filter((s) => s <= d)
    const start = starts.length ? Math.max(...starts) : 1
    const pool = characters.filter((c) => (c.since ?? 1) <= start).sort((a, b) => a.slug.localeCompare(b.slug))
    const n = pool.length
    const offset = d - start // días transcurridos dentro de la época
    const index = ((offset % n) + n) % n
    const round = Math.floor(offset / n)
    // La época del reto #1 conserva su semilla original
    let order = shuffle(pool, seededRandom(20261017 + (start === 1 ? 0 : start * 1000) + round))
    if (start > 1 && round === 0) {
      const recent = new Set<string>()
      for (let prev = start - 1; prev >= 1 && recent.size < n - 1 && start - prev <= n; prev--) recent.add(pick(prev).slug)
      order = [...order.filter((c) => !recent.has(c.slug)), ...order.filter((c) => recent.has(c.slug))]
    }
    const result = order[index]
    cache.set(d, result)
    return result
  }
  return pick(day)
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
