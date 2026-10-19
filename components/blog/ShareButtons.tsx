'use client'

import { useEffect, useState } from 'react'
import { Twitter, Facebook, Link, Check, Send, Share2, Phone, MessagesSquare } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface ShareButtonsProps {
  url: string
  title: string
  compact?: boolean // solo iconos (cabecera del artículo)
}

export function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  // El menú nativo solo existe en el navegador (y sobre todo en móvil): se comprueba tras montar
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function' && /Android|iPhone|iPad/i.test(navigator.userAgent))
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const networks = [
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, color: 'bg-green-700 hover:bg-green-800', href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'bg-sky-700 hover:bg-sky-800', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { id: 'x', label: 'X', icon: Twitter, color: 'bg-black hover:bg-gray-900 border border-white/10', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { id: 'reddit', label: 'Reddit', icon: MessagesSquare, color: 'bg-orange-700 hover:bg-orange-800', href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` },
  ]

  const track = (red: string) => trackEvent('compartir', { red, url })

  function copyLink() {
    track('copiar')
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => window.prompt('Copia el enlace:', url))
  }

  async function nativeShare() {
    track('nativo')
    try {
      await navigator.share({ title, url })
    } catch {
      // cancelado por el usuario
    }
  }

  const button = `flex items-center justify-center gap-1.5 rounded-lg text-white text-sm font-medium transition-colors ${compact ? 'w-9 h-9' : 'px-3 py-1.5'}`

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!compact && <span className="text-sm text-gray-400 font-medium mr-1">Compartir:</span>}

      {canNativeShare && (
        <button onClick={nativeShare} aria-label="Compartir" className={`${button} bg-red-600 hover:bg-red-700`}>
          <Share2 className="w-4 h-4" />
          {!compact && 'Compartir'}
        </button>
      )}

      {networks.map(({ id, label, icon: Icon, color, href }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir en ${label}`}
          title={`Compartir en ${label}`}
          onClick={() => track(id)}
          className={`${button} ${color}`}
        >
          <Icon className="w-4 h-4" />
          {!compact && label}
        </a>
      ))}

      <button onClick={copyLink} aria-label="Copiar enlace" title="Copiar enlace" className={`${button} bg-gray-700 hover:bg-gray-600`}>
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
        {!compact && (copied ? '¡Copiado!' : 'Copiar')}
      </button>
    </div>
  )
}
