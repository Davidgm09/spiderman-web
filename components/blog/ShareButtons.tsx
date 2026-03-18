'use client'

import { useState } from 'react'
import { Twitter, Facebook, Link, Check, Send } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  }

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-400 font-medium">Compartir:</span>

      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en X (Twitter)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-gray-900 text-white text-sm font-medium transition-colors"
      >
        <Twitter className="w-4 h-4" />
        X
      </a>

      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en Facebook"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </a>

      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en WhatsApp"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
      >
        <Send className="w-4 h-4" />
        WhatsApp
      </a>

      <button
        onClick={copyLink}
        aria-label="Copiar enlace"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}
