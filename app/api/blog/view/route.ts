import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug requerido' }, { status: 400 })
    }
    await blogService.incrementViews(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
