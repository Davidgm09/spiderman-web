'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy } from 'lucide-react'
import { loadState, saveState, shuffle } from '@/lib/juegos'
import { trackEvent } from '@/lib/analytics'
import { ShareButton } from './ShareButton'

export interface Question {
  cat: string
  dif: 1 | 2 | 3
  q: string
  a: string[] // la primera es la correcta
  why: string
  link: string
}

interface Round {
  question: Question
  options: string[]
  picked: string | null
}

const ROUND_SIZE = 10
const MIX: Record<number, number> = { 1: 4, 2: 4, 3: 2 } // preguntas por dificultad
const MAX_PER_CATEGORY = 4
const STORAGE_KEY = 'test-spider-man-v1'

const RANKS = [
  { min: 10, title: 'Spider-Man Superior', text: 'Pleno. Ni el Doctor Octopus sabe tanto de Spider-Man.' },
  { min: 8, title: 'Vengador arácnido', text: 'Nivel experto: te sabes la historia del trepamuros de memoria.' },
  { min: 6, title: 'Héroe de barrio', text: 'Muy bien. Unas cuantas lecturas más y serás imbatible.' },
  { min: 4, title: 'Aprendiz de trepamuros', text: 'Vas por buen camino. Echa un ojo a las respuestas que has fallado.' },
  { min: 0, title: 'Vecino de Queens', text: 'Todo gran héroe empezó desde abajo. ¡Prueba otra vez!' },
]

function buildRound(bank: Question[]): Round[] {
  const random = Math.random
  const picked: Question[] = []
  const perCat: Record<string, number> = {}
  for (const dif of [1, 2, 3]) {
    let need = MIX[dif]
    for (const q of shuffle(bank.filter((x) => x.dif === dif), random)) {
      if (!need) break
      if ((perCat[q.cat] || 0) >= MAX_PER_CATEGORY) continue
      picked.push(q)
      perCat[q.cat] = (perCat[q.cat] || 0) + 1
      need--
    }
  }
  // Orden de dificultad creciente, con las opciones barajadas
  return picked.slice(0, ROUND_SIZE).map((question) => ({ question, options: shuffle(question.a, random), picked: null }))
}

export function TestSpiderMan({ questions }: { questions: Question[] }) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [index, setIndex] = useState(0)
  const [best, setBest] = useState(0)
  const [games, setGames] = useState(0)

  useEffect(() => {
    const saved = loadState(STORAGE_KEY, { best: 0, games: 0 })
    setBest(saved.best)
    setGames(saved.games)
    setRounds(buildRound(questions))
  }, [questions])

  if (!rounds.length) {
    return <div className="h-80 rounded-xl bg-gray-900/60 border border-gray-800 animate-pulse" aria-label="Preparando preguntas" />
  }

  const finished = index >= rounds.length
  const score = rounds.filter((r) => r.picked === r.question.a[0]).length

  function answer(option: string) {
    const current = rounds[index]
    if (current.picked) return
    if (index === 0) trackEvent('juego_empezado', { juego: 'test' })
    setRounds((rs) => rs.map((r, i) => (i === index ? { ...r, picked: option } : r)))
  }

  function next() {
    const nextIndex = index + 1
    setIndex(nextIndex)
    if (nextIndex >= rounds.length) {
      const final = rounds.filter((r) => r.picked === r.question.a[0]).length
      const newBest = Math.max(best, final)
      setBest(newBest)
      setGames(games + 1)
      saveState(STORAGE_KEY, { best: newBest, games: games + 1 })
      trackEvent('juego_terminado', { juego: 'test', puntuacion: final })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    setRounds(buildRound(questions))
    setIndex(0)
  }

  if (finished) {
    const rank = RANKS.find((r) => score >= r.min)!
    const failed = rounds.filter((r) => r.picked !== r.question.a[0])
    const shareText = [
      `🕷️ He sacado ${score}/${ROUND_SIZE} en el test de cultura arácnida: «${rank.title}».`,
      rounds.map((r) => (r.picked === r.question.a[0] ? '🟩' : '🟥')).join(''),
      '¿Cuánto sabes tú de Spider-Man? https://www.sentidoaracnido.com/juegos/test-spider-man',
    ].join('\n')

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-6 text-center">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <p className="text-5xl font-bold text-white">{score}<span className="text-2xl text-gray-400">/{ROUND_SIZE}</span></p>
          <p className="text-xl font-semibold text-red-400 mt-2">{rank.title}</p>
          <p className="text-gray-300 mt-1">{rank.text}</p>
          <p className="text-sm text-gray-500 mt-3">Tu mejor nota: {best}/{ROUND_SIZE} · Partidas jugadas: {games}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
            <ShareButton text={shareText} game="test" />
            <button
              onClick={restart}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> Jugar otra vez
            </button>
          </div>
        </div>

        {failed.length > 0 && (
          <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Repasa lo que has fallado</h2>
            <ul className="space-y-4">
              {failed.map((r) => (
                <li key={r.question.q} className="text-sm">
                  <p className="text-white font-medium">{r.question.q}</p>
                  <p className="text-green-400 mt-1">✔ {r.question.a[0]}</p>
                  <p className="text-gray-400 mt-1">
                    {r.question.why}{' '}
                    <Link href={r.question.link} className="text-red-400 hover:text-red-300 underline">Saber más</Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const current = rounds[index]
  const correct = current.question.a[0]
  const answered = current.picked !== null

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pregunta {index + 1} de {rounds.length} · {current.question.cat}</span>
          <span>Aciertos: {score}</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-600 to-blue-600 transition-all" style={{ width: `${(index / rounds.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">{current.question.q}</h2>
        <div className="grid gap-3">
          {current.options.map((option) => {
            const isCorrect = option === correct
            const isPicked = option === current.picked
            const style = !answered
              ? 'bg-gray-800 border-gray-700 hover:border-red-500 hover:bg-gray-700'
              : isCorrect
                ? 'bg-green-700/80 border-green-400'
                : isPicked
                  ? 'bg-red-800/80 border-red-500'
                  : 'bg-gray-800/50 border-gray-800 text-gray-500'
            return (
              <button
                key={option}
                onClick={() => answer(option)}
                disabled={answered}
                className={`flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-lg border text-white transition-colors ${style}`}
              >
                <span>{option}</span>
                {answered && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {answered && isPicked && !isCorrect && <XCircle className="w-5 h-5 shrink-0" />}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-5 p-4 rounded-lg bg-black/30 text-sm text-gray-300">
            <p className={`font-semibold mb-1 ${current.picked === correct ? 'text-green-400' : 'text-red-400'}`}>
              {current.picked === correct ? '¡Correcto!' : `Respuesta correcta: ${correct}`}
            </p>
            <p>{current.question.why}</p>
            <button
              onClick={next}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              {index + 1 < rounds.length ? 'Siguiente pregunta' : 'Ver resultado'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
