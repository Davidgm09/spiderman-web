'use client'

import { useEffect, useState } from 'react'
import { dayNumber, loadState } from '@/lib/juegos'

// Sin mayúsculas acentuadas: la fuente pixelada no las tiene
// Dato del jugador guardado en su navegador (racha, récord, último resultado), en la tarjeta de cada juego
export function PlayerChip({ game, names = {} }: { game: string; names?: Record<string, string> }) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    if (game === 'aranadle') {
      const s = loadState('aranadle-v1', { day: 0, status: 'playing', stats: { streak: 0, lastWinDay: 0, played: 0 } })
      const today = dayNumber()
      const streak = s.stats.lastWinDay >= today - 1 ? s.stats.streak : 0
      if (s.day === today && s.status !== 'playing') setText(s.status === 'won' ? `Hoy: superado · Racha ${streak}` : `Hoy: fallado · Racha ${streak}`)
      else setText(s.stats.played ? `Racha ${streak} · ¡Reto nuevo!` : '¡Reto nuevo hoy!')
    }
    if (game === 'test-spider-man') {
      const s = loadState('test-spider-man-v1', { best: 0, games: 0 })
      setText(s.games ? `Récord ${s.best}/10` : 'Sin récord aún')
    }
    if (game === 'que-spider-man-eres') {
      const s = loadState<{ last: string }>('que-spider-man-eres-v1', { last: '' })
      setText(s.last && names[s.last] ? `Eres: ${names[s.last]}` : '¿Quién serás?')
    }
  }, [game, names])

  if (!text) return <span className="h-6" aria-hidden />
  return (
    <span className="font-pixel inline-block text-[10px] leading-relaxed px-2 py-1 rounded bg-black/60 border border-yellow-400/50 text-yellow-300">
      {text}
    </span>
  )
}
