import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

// Supabase pausa los proyectos gratuitos tras una semana sin actividad.
// Vercel llama a esta ruta una vez al día (ver vercel.json) con una consulta mínima para mantenerla activa.
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  // Si CRON_SECRET está configurado, Vercel lo envía en la cabecera y solo se acepta esa llamada
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const posts = await prisma.blogPost.count()
    return NextResponse.json({ ok: true, posts, at: new Date().toISOString() })
  } catch (error) {
    console.error("keepalive: la base de datos no responde", error)
    return NextResponse.json({ ok: false }, { status: 503 })
  }
}
