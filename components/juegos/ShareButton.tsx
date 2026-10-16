'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface ShareButtonProps {
  text: string
  game: string
  className?: string
}

// Comparte con el menú nativo del móvil; en escritorio (o si se cancela) copia el texto
export function ShareButton({ text, game, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function share() {
    trackEvent('compartir', { juego: game })
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // cancelado: probamos a copiar
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copia tu resultado:', text)
    }
  }

  return (
    <button
      onClick={share}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors ${className}`}
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      {copied ? '¡Copiado!' : 'Compartir resultado'}
    </button>
  )
}
