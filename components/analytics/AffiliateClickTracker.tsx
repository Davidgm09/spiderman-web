'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

// Registra en Analytics cada clic en un enlace de Amazon, esté donde esté (tienda, artículos, fichas, guías),
// con la página de origen y el producto. Solo llega a GA si el visitante aceptó las cookies.
export function AffiliateClickTracker() {
  const pathname = usePathname()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href*="amazon."]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.href
      const asin = (href.match(/\/dp\/([A-Z0-9]{10})/) || [])[1] || ''
      const busqueda = asin ? '' : new URL(href).searchParams.get('k') || ''
      trackEvent('clic_amazon', {
        pagina: pathname,
        producto: asin || busqueda || 'otro',
        texto: (link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 80),
      })
    }
    // En captura, para registrarlo antes de que el navegador abra la pestaña nueva
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  return null
}
