'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, ArrowDown, Lightbulb, Trophy, Flame, Clock } from 'lucide-react'
import {
  GameCharacter, dayNumber, dailyCharacter, loadState, saveState, normalize, msUntilNextDay,
} from '@/lib/juegos'
import { trackEvent } from '@/lib/analytics'
import { ShareButton } from './ShareButton'

const MAX_GUESSES = 8
const CLUE_AFTER = 4
const IMAGE_AFTER = 6
const STORAGE_KEY = 'aranadle-v1'
// En empates del buscador, primero los Spider-Man y después los villanos
const CATEGORY_ORDER = ['Héroe arácnido', 'Villano', 'Aliado', 'Héroe Marvel']
// Y entre los más conocidos, por este orden
const POPULAR = [
  'spider-man-peter-parker-alt', 'spider-man-miles-morales-alt', 'spider-gwen-gwen-stacy-alt', 'venom-eddie-brock-alt',
  'green-goblin-norman-osborn-alt', 'doctor-octopus-otto-octavius-alt', 'spider-man-2099-miguel-ohara-alt',
]

type Status = 'playing' | 'won' | 'lost'
type Match = 'ok' | 'partial' | 'no'

interface Stats {
  played: number
  wins: number
  streak: number
  maxStreak: number
  lastWinDay: number
  dist: number[]
}

interface Saved {
  day: number
  guesses: string[]
  status: Status
  stats: Stats
}

const EMPTY_STATS: Stats = { played: 0, wins: 0, streak: 0, maxStreak: 0, lastWinDay: 0, dist: Array(MAX_GUESSES).fill(0) }

function overlap(a: string[], b: string[]): Match {
  if (a.length === b.length && a.every((x) => b.includes(x))) return 'ok'
  return a.some((x) => b.includes(x)) ? 'partial' : 'no'
}

function compare(guess: GameCharacter, target: GameCharacter) {
  return {
    gender: guess.gender === target.gender ? 'ok' : 'no',
    category: guess.category === target.category ? 'ok' : 'no',
    universe: guess.universe === target.universe ? 'ok' : 'no',
    year: guess.year === target.year ? 'ok' : 'no',
    creators: overlap(guess.creators, target.creators),
    groups: overlap(guess.groups, target.groups),
  } as Record<'gender' | 'category' | 'universe' | 'year' | 'creators' | 'groups', Match>
}

const CELL: Record<Match, string> = {
  ok: 'bg-green-600/90 border-green-400',
  partial: 'bg-yellow-500/90 border-yellow-300 text-gray-900',
  no: 'bg-red-900/80 border-red-700',
}
const EMOJI: Record<Match, string> = { ok: '🟩', partial: '🟨', no: '🟥' }

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

export function Aranadle({ characters }: { characters: GameCharacter[] }) {
  const [mounted, setMounted] = useState(false)
  const [day, setDay] = useState(0)
  const [guesses, setGuesses] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('playing')
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [countdown, setCountdown] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const bySlug = useMemo(() => new Map(characters.map((c) => [c.slug, c])), [characters])
  const target = useMemo(() => (day ? dailyCharacter(characters, day) : null), [characters, day])

  // El reto depende de la fecha del visitante: se calcula solo en el navegador
  useEffect(() => {
    const today = dayNumber()
    const saved = loadState<Saved>(STORAGE_KEY, { day: today, guesses: [], status: 'playing', stats: EMPTY_STATS })
    const sameDay = saved.day === today
    setDay(today)
    setGuesses(sameDay ? saved.guesses.filter((g) => bySlug.has(g)) : [])
    setStatus(sameDay ? saved.status : 'playing')
    setStats({ ...EMPTY_STATS, ...saved.stats })
    setMounted(true)
  }, [bySlug])

  useEffect(() => {
    if (!mounted) return
    saveState(STORAGE_KEY, { day, guesses, status, stats } satisfies Saved)
  }, [mounted, day, guesses, status, stats])

  useEffect(() => {
    if (status === 'playing') return
    const tick = () => {
      const ms = msUntilNextDay()
      setCountdown(formatCountdown(ms))
      if (ms <= 1000) window.location.reload()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [status])

  const suggestions = useMemo(() => {
    const q = normalize(query)
    if (!q) return []
    // 0: coincidencia exacta · 1: empieza igual · 2: alguna palabra empieza igual · 3: lo contiene
    const match = (t: string) => {
      const n = normalize(t)
      if (n === q) return 0
      if (n.startsWith(q)) return 1
      if (n.split(/[\s()\-']+/).some((w) => w.startsWith(q))) return 2
      if (n.includes(q)) return 3
      // «spiderman» encuentra «Spider-Man»: se comparan también sin espacios ni guiones
      return n.replace(/[^a-z0-9]/g, '').includes(q.replace(/[^a-z0-9]/g, '')) ? 4 : 9
    }
    // El nombre del personaje pesa más que sus alias («venom» → Venom antes que el Escorpión)
    const rank = (c: GameCharacter) => Math.min(match(c.name), ...c.terms.map((t) => match(t) + 2))
    const popular = (c: GameCharacter) => { const i = POPULAR.indexOf(c.slug); return i < 0 ? POPULAR.length : i }
    const order = (c: GameCharacter) => CATEGORY_ORDER.indexOf(c.category)
    return characters
      .filter((c) => !guesses.includes(c.slug))
      .map((c) => ({ c, r: rank(c) }))
      .filter((x) => x.r < 9)
      .sort((a, b) => a.r - b.r || popular(a.c) - popular(b.c) || order(a.c) - order(b.c) || a.c.name.localeCompare(b.c.name))
      .map((x) => x.c)
      .slice(0, 6)
  }, [query, characters, guesses])

  function guess(slug: string) {
    if (!target || status !== 'playing' || guesses.includes(slug)) return
    const next = [...guesses, slug]
    if (guesses.length === 0) trackEvent('juego_empezado', { juego: 'aranadle' })
    setGuesses(next)
    setQuery('')
    setActive(0)

    const won = slug === target.slug
    if (!won && next.length < MAX_GUESSES) return

    const result: Status = won ? 'won' : 'lost'
    setStatus(result)
    trackEvent('juego_terminado', { juego: 'aranadle', resultado: result, intentos: next.length })
    setStats((s) => {
      const dist = [...s.dist]
      if (won) dist[next.length - 1] += 1
      const streak = won ? (s.lastWinDay === day - 1 ? s.streak + 1 : 1) : 0
      return {
        played: s.played + 1,
        wins: s.wins + (won ? 1 : 0),
        streak,
        maxStreak: Math.max(s.maxStreak, streak),
        lastWinDay: won ? day : s.lastWinDay,
        dist,
      }
    })
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + suggestions.length) % suggestions.length) }
    if (e.key === 'Enter') { e.preventDefault(); guess(suggestions[Math.min(active, suggestions.length - 1)].slug) }
    if (e.key === 'Escape') setQuery('')
  }

  if (!mounted || !target) {
    return <div className="h-96 rounded-xl bg-gray-900/60 border border-gray-800 animate-pulse" aria-label="Cargando el reto de hoy" />
  }

  const wrong = guesses.filter((g) => g !== target.slug).length
  const rows = guesses.map((g) => bySlug.get(g)!).reverse()
  const currentStreak = stats.lastWinDay >= day - 1 ? stats.streak : 0

  const shareText = [
    `Arañadle #${day} 🕷️ ${status === 'won' ? guesses.length : 'X'}/${MAX_GUESSES}`,
    ...guesses.map((g) => {
      const c = bySlug.get(g)!
      const r = compare(c, target)
      const year = c.year === target.year ? '🟩' : target.year > c.year ? '⬆️' : '⬇️'
      return [EMOJI[r.gender], EMOJI[r.category], EMOJI[r.universe], year, EMOJI[r.creators], EMOJI[r.groups]].join('')
    }),
    'https://www.sentidoaracnido.com/juegos/aranadle',
  ].join('\n')

  return (
    <div className="space-y-6">
      {/* Marcador */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-gray-300">
          Reto <strong className="text-white">#{day}</strong> · Intentos{' '}
          <strong className="text-white">{guesses.length}/{MAX_GUESSES}</strong>
        </span>
        <span className="flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400" /> Racha {currentStreak}</span>
          <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-400" /> {stats.wins} ganados</span>
        </span>
      </div>

      {/* Buscador */}
      {status === 'playing' && (
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Escribe un personaje: Venom, Miles, Duende Verde…"
            aria-label="Escribe el nombre de un personaje"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-base"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 shadow-xl overflow-hidden" role="listbox">
              {suggestions.map((c, i) => (
                <li key={c.slug} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); guess(c.slug) }}
                    onMouseEnter={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left ${i === active ? 'bg-red-600/30' : 'hover:bg-gray-800'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" className="w-9 h-9 rounded object-cover bg-gray-800" loading="lazy" />
                    <span className="text-white">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query && suggestions.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No hay ningún personaje con ese nombre (o ya lo has probado).</p>
          )}
        </div>
      )}

      {/* Pistas */}
      {status === 'playing' && wrong >= CLUE_AFTER && (
        <div className="flex gap-3 p-4 rounded-lg bg-blue-950/50 border border-blue-700/50">
          <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-200">
            <p><strong>Pista:</strong> {target.clue}</p>
            {wrong >= IMAGE_AFTER && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={target.image} alt="Imagen borrosa del personaje" className="mt-3 w-24 h-24 rounded object-cover blur-md" />
            )}
          </div>
        </div>
      )}
      {status === 'playing' && wrong > 0 && wrong < CLUE_AFTER && (
        <p className="text-sm text-gray-500">Pista extra en {CLUE_AFTER - wrong} {CLUE_AFTER - wrong === 1 ? 'intento' : 'intentos'}.</p>
      )}

      {/* Resultado */}
      {status !== 'playing' && (
        <div className={`p-5 rounded-xl border ${status === 'won' ? 'bg-green-950/40 border-green-600/50' : 'bg-red-950/40 border-red-600/50'}`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={target.image} alt={target.name} className="w-28 h-28 rounded-lg object-cover bg-gray-800" />
            <div className="text-center sm:text-left flex-1">
              <p className="text-lg font-bold text-white">
                {status === 'won'
                  ? `¡Correcto! Lo has adivinado en ${guesses.length} ${guesses.length === 1 ? 'intento' : 'intentos'}.`
                  : 'Esta vez no ha podido ser.'}
              </p>
              <p className="text-gray-300 mt-1">
                El personaje de hoy era <strong className="text-white">{target.name}</strong>.{' '}
                <Link href={`/personajes/${target.slug}`} className="text-red-400 hover:text-red-300 underline">Ver su ficha</Link>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1 text-sm text-gray-400 mt-2">
                <Clock className="w-4 h-4" /> Nuevo personaje en <span className="font-mono text-white">{countdown}</span>
              </p>
              <ShareButton text={shareText} game="aranadle" className="mt-4" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-6 text-center">
            {[
              ['Jugados', stats.played],
              ['% victorias', stats.played ? Math.round((stats.wins / stats.played) * 100) : 0],
              ['Racha', currentStreak],
              ['Mejor racha', stats.maxStreak],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-black/30 py-2">
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1">
            {stats.dist.map((n, i) => {
              const max = Math.max(1, ...stats.dist)
              const mine = status === 'won' && guesses.length === i + 1
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-gray-400">{i + 1}</span>
                  <div
                    className={`h-5 rounded px-2 flex items-center justify-end text-white ${mine ? 'bg-green-600' : 'bg-gray-700'}`}
                    style={{ width: `${Math.max(8, (n / max) * 100)}%` }}
                  >
                    {n}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabla de intentos */}
      {rows.length > 0 && (
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <table className="w-full min-w-[720px] border-separate border-spacing-1 text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-400">
                {['Personaje', 'Género', 'Tipo', 'Universo', 'Debut', 'Creadores', 'Grupos'].map((h) => (
                  <th key={h} className="font-medium pb-1 text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const r = compare(c, target)
                const cell = (m: Match) => `rounded-md border p-2 text-center align-middle text-white ${CELL[m]}`
                return (
                  <tr key={c.slug} className="animate-in fade-in duration-500">
                    <td className="rounded-md bg-gray-900 border border-gray-700 p-1.5">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-800 shrink-0" />
                        <span className="text-white leading-tight">{c.name}</span>
                      </div>
                    </td>
                    <td className={cell(r.gender)}>{c.gender}</td>
                    <td className={cell(r.category)}>{c.category}</td>
                    <td className={cell(r.universe)}>{c.universe}</td>
                    <td className={cell(r.year)}>
                      <span className="inline-flex items-center gap-1">
                        {c.year}
                        {c.year < target.year && <ArrowUp className="w-4 h-4" aria-label="más reciente" />}
                        {c.year > target.year && <ArrowDown className="w-4 h-4" aria-label="más antiguo" />}
                      </span>
                    </td>
                    <td className={cell(r.creators)}>{c.creators.join(', ')}</td>
                    <td className={cell(r.groups)}>{c.groups.length ? c.groups.join(', ') : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
