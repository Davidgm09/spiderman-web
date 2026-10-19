import { NextRequest, NextResponse } from 'next/server'
import { blogService, characterService, comicService, gameService, movieService, productService, seriesService } from '@/lib/database'

// Contador de visitas real: lo llama el navegador del visitante (components/analytics/ViewTracker.tsx),
// no el servidor al generar la página, así que no cuenta regeneraciones de caché, rastreadores ni pruebas.
const SERVICIOS = {
  blog: blogService,
  personaje: characterService,
  pelicula: movieService,
  serie: seriesService,
  comic: comicService,
  videojuego: gameService,
  producto: productService,
} as const

export type TipoVisita = keyof typeof SERVICIOS

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegram/i

export async function POST(request: NextRequest) {
  try {
    if (BOT.test(request.headers.get('user-agent') || '')) return NextResponse.json({ ok: true, contada: false })
    const { tipo, slug } = await request.json()
    const servicio = SERVICIOS[tipo as TipoVisita]
    if (!servicio || typeof slug !== 'string' || !slug || slug.length > 200) {
      return NextResponse.json({ error: 'tipo o slug no válidos' }, { status: 400 })
    }
    await servicio.incrementViews(slug)
    return NextResponse.json({ ok: true, contada: true })
  } catch {
    // Slug inexistente u otro error: no es grave para el visitante
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
