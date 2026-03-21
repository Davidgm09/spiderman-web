import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const search = { contains: q, mode: "insensitive" as const }

  const [characters, movies, series, comics, games, posts] = await Promise.all([
    prisma.character.findMany({
      where: { isActive: true, OR: [{ name: search }, { description: search }] },
      select: { name: true, slug: true, image: true, category: true },
      take: 5,
    }),
    prisma.movie.findMany({
      where: { isActive: true, OR: [{ title: search }, { description: search }] },
      select: { title: true, slug: true, image: true, year: true },
      take: 5,
    }),
    prisma.series.findMany({
      where: { isActive: true, OR: [{ title: search }, { description: search }] },
      select: { title: true, slug: true, image: true, year: true },
      take: 5,
    }),
    prisma.comic.findMany({
      where: { isActive: true, OR: [{ title: search }, { description: search }] },
      select: { title: true, slug: true, image: true, year: true },
      take: 5,
    }),
    prisma.game.findMany({
      where: { isActive: true, OR: [{ title: search }, { description: search }] },
      select: { title: true, slug: true, image: true, year: true },
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true, OR: [{ title: search }, { excerpt: search }] },
      select: { title: true, slug: true, image: true, category: true },
      take: 5,
    }),
  ])

  return NextResponse.json({
    results: {
      characters: characters.map((c) => ({ ...c, type: "personaje", href: `/personajes/${c.slug}` })),
      movies: movies.map((m) => ({ ...m, type: "película", href: `/peliculas/${m.slug}` })),
      series: series.map((s) => ({ ...s, type: "serie", href: `/series/${s.slug}` })),
      comics: comics.map((c) => ({ ...c, type: "cómic", href: `/comics/${c.slug}` })),
      games: games.map((g) => ({ ...g, type: "videojuego", href: `/videojuegos/${g.slug}` })),
      posts: posts.map((p) => ({ ...p, type: "artículo", href: `/blog/${p.slug}` })),
    },
  })
}
