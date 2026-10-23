'use client'

import { useState } from 'react'
import { Share2, Check, MessageCircle } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface ShareButtonProps {
  text: string
  game: string
  className?: string
}

// Comparte con el menú nativo del móvil; en escritorio (o si se cancela) copia el texto.
// Al lado, accesos directos a WhatsApp (lo más usado por el público de Latinoamérica) y X.
export function ShareButton({ text, game, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function share() {
    trackEvent('compartir', { juego: game, red: 'nativo' })
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

  const encoded = encodeURIComponent(text)
  const link = 'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors'

  return (
    <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 ${className}`}>
      <button onClick={share} className={`${link} bg-red-600 hover:bg-red-700 text-white`}>
        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        {copied ? '¡Copiado!' : 'Compartir resultado'}
      </button>
      <a
        href={`https://wa.me/?text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('compartir', { juego: game, red: 'whatsapp' })}
        className={`${link} bg-[#25D366] hover:bg-[#1fb957] text-gray-950`}
      >
        <MessageCircle className="w-5 h-5" /> WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('compartir', { juego: game, red: 'x' })}
        aria-label="Compartir en X"
        className={`${link} bg-black hover:bg-gray-900 text-white border border-gray-700`}
      >
        <span aria-hidden="true" className="font-bold">𝕏</span>
      </a>
    </div>
  )
}
