'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RotateCcw, ArrowRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { ShareButton } from './ShareButton'

export interface Profile {
  name: string
  slug: string
  title: string
  text: string
  image: string
}

export interface PersonalityQuestion {
  q: string
  a: { t: string; p: Record<string, number> }[]
}

interface Props {
  profiles: Record<string, Profile>
  questions: PersonalityQuestion[]
  initialResult?: string
}

// Empates: gana quien sumó puntos en la respuesta más reciente
function winner(answers: number[], questions: PersonalityQuestion[], ids: string[]): string {
  const score: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]))
  answers.forEach((a, i) => Object.entries(questions[i].a[a].p).forEach(([id, pts]) => { score[id] += pts }))
  const max = Math.max(...Object.values(score))
  let tied = ids.filter((id) => score[id] === max)
  for (let i = answers.length - 1; i >= 0 && tied.length > 1; i--) {
    const scored = tied.filter((id) => questions[i].a[answers[i]].p[id])
    if (scored.length) tied = scored
  }
  return tied[0]
}

export function QueSpiderManEres({ profiles, questions, initialResult }: Props) {
  const ids = Object.keys(profiles)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<string | null>(initialResult && profiles[initialResult] ? initialResult : null)

  function answer(i: number) {
    const next = [...answers, i]
    if (answers.length === 0) trackEvent('juego_empezado', { juego: 'que-spider-man-eres' })
    if (next.length < questions.length) {
      setAnswers(next)
      return
    }
    const r = winner(next, questions, ids)
    setAnswers(next)
    setResult(r)
    trackEvent('juego_terminado', { juego: 'que-spider-man-eres', resultado: r })
    window.history.replaceState(null, '', `?r=${r}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    setAnswers([])
    setResult(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  if (result) {
    const p = profiles[result]
    const fromLink = answers.length === 0
    const shareText = `🕷️ Soy ${p.name}: «${p.title}». ¿Qué Spider-Man eres tú? https://www.sentidoaracnido.com/juegos/que-spider-man-eres?r=${result}`
    return (
      <div className="rounded-xl bg-gray-900/70 border border-purple-700/40 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className="w-40 h-40 rounded-xl object-cover bg-gray-800 shrink-0" />
          <div className="text-center sm:text-left">
            <p className="text-sm uppercase tracking-wider text-purple-400 font-semibold">
              {fromLink ? 'Este es el resultado que te han enviado' : 'Tu Spider-Man es…'}
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">{p.name}</h2>
            <p className="text-lg text-red-400 font-semibold">{p.title}</p>
            <p className="text-gray-300 mt-3">{p.text}</p>
            <p className="mt-3">
              <Link href={`/personajes/${p.slug}`} className="text-red-400 hover:text-red-300 underline">
                Conoce su historia en su ficha
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {!fromLink && <ShareButton text={shareText} game="que-spider-man-eres" />}
          <button
            onClick={restart}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
          >
            {fromLink ? <ArrowRight className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            {fromLink ? 'Haz tú el test' : 'Repetir el test'}
          </button>
        </div>
      </div>
    )
  }

  const current = questions[answers.length]
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pregunta {answers.length + 1} de {questions.length}</span>
          {answers.length > 0 && (
            <button onClick={() => setAnswers(answers.slice(0, -1))} className="hover:text-white underline">Volver atrás</button>
          )}
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-red-600 transition-all" style={{ width: `${(answers.length / questions.length) * 100}%` }} />
        </div>
      </div>
      <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">{current.q}</h2>
        <div className="grid gap-3">
          {current.a.map((a, i) => (
            <button
              key={a.t}
              onClick={() => answer(i)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-purple-500 hover:bg-gray-700 text-white transition-colors"
            >
              {a.t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
