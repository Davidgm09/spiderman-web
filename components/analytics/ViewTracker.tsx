'use client'

import { useEffect } from 'react'
import type { TipoVisita } from '@/app/api/view/route'

// Suma una visita desde el navegador del visitante, una sola vez por página y sesión
// (recargar la página no vuelve a contar). Ver app/api/view/route.ts.
export function ViewTracker({ tipo, slug }: { tipo: TipoVisita; slug: string }) {
  useEffect(() => {
    const clave = `visto:${tipo}:${slug}`
    try {
      if (sessionStorage.getItem(clave)) return
      sessionStorage.setItem(clave, '1')
    } catch {
      // Sin sessionStorage (modo privado estricto): se cuenta igualmente
    }
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, slug }),
      keepalive: true,
    }).catch(() => {})
  }, [tipo, slug])

  return null
}
