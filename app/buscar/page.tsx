import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { prisma } from "@/lib/database"
import { Breadcrumb } from "@/components/breadcrumb"

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Resultados para "${q}" | Spider-World` : "Buscador | Spider-World",
    description: "Busca películas, personajes, cómics, series, videojuegos y artículos sobre Spider-Man.",
    robots: { index: false },
  }
}

async function search(q: string) {
  const s = { contains: q, mode: "insensitive" as const }
  const [characters, movies, series, comics, games, posts] = await Promise.all([
    prisma.character.findMany({ where: { OR: [{ name: s }, { description: s }] }, select: { name: true, slug: true, image: true, category: true }, take: 6 }),
    prisma.movie.findMany({ where: { OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.series.findMany({ where: { OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.comic.findMany({ where: { OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.game.findMany({ where: { OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.blogPost.findMany({ where: { isPublished: true, OR: [{ title: s }, { excerpt: s }] }, select: { title: true, slug: true, image: true, category: true }, take: 6 }),
  ])
  return { characters, movies, series, comics, games, posts }
}

interface ResultCardProps {
  href: string
  image: string | null
  title: string
  subtitle?: string
  badge: string
  badgeColor: string
}

function ResultCard({ href, image, title, subtitle, badge, badgeColor }: ResultCardProps) {
  return (
    <Link href={href} className="flex items-center gap-3 bg-gray-900/50 hover:bg-gray-800/60 border border-gray-700/30 hover:border-red-600/30 rounded-lg p-3 transition-all group">
      {image && (
        <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
          <Image src={image} alt={title} fill sizes="48px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor} mb-1 inline-block`}>{badge}</span>
        <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">{title}</p>
        {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
      </div>
    </Link>
  )
}

const SECTIONS = [
  { key: "movies",     label: "Películas",    badge: "Película",    color: "bg-blue-600/20 text-blue-300",   path: "/peliculas",  titleKey: "title", subtitleKey: "year" },
  { key: "characters", label: "Personajes",   badge: "Personaje",   color: "bg-red-600/20 text-red-300",     path: "/personajes", titleKey: "name",  subtitleKey: "category" },
  { key: "series",     label: "Series",       badge: "Serie",       color: "bg-purple-600/20 text-purple-300", path: "/series",   titleKey: "title", subtitleKey: "year" },
  { key: "comics",     label: "Cómics",       badge: "Cómic",       color: "bg-yellow-600/20 text-yellow-300", path: "/comics",   titleKey: "title", subtitleKey: "year" },
  { key: "games",      label: "Videojuegos",  badge: "Videojuego",  color: "bg-green-600/20 text-green-300",  path: "/videojuegos", titleKey: "title", subtitleKey: "year" },
  { key: "posts",      label: "Blog",         badge: "Artículo",    color: "bg-orange-600/20 text-orange-300", path: "/blog",     titleKey: "title", subtitleKey: "category" },
]

export default async function BuscarPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const hasQuery = query.length >= 2

  const results = hasQuery ? await search(query) : null
  const totalResults = results
    ? Object.values(results).reduce((acc, arr) => acc + arr.length, 0)
    : 0

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumb items={[{ label: "Buscador" }]} />

        <h1 className="text-3xl font-bold mb-2">Buscador</h1>
        <p className="text-gray-400 mb-8">Películas, personajes, cómics, series, videojuegos y artículos</p>

        {/* Search form */}
        <form method="GET" action="/buscar" className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Busca Spider-Man, Venom, No Way Home..."
            autoFocus
            className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 outline-none text-lg transition-colors"
          />
        </form>

        {/* Results */}
        {hasQuery && results && (
          <>
            <p className="text-gray-400 text-sm mb-8">
              {totalResults > 0
                ? `${totalResults} resultado${totalResults !== 1 ? "s" : ""} para "${query}"`
                : `Sin resultados para "${query}"`}
            </p>

            {totalResults === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Prueba con otro término de búsqueda.</p>
              </div>
            )}

            <div className="space-y-10">
              {SECTIONS.map(({ key, label, badge, color, path, titleKey, subtitleKey }) => {
                const items = (results as unknown as Record<string, Record<string, string>[]>)[key]
                if (!items?.length) return null
                return (
                  <section key={key}>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${color}`}>{items.length}</span>
                      {label}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((item) => (
                        <ResultCard
                          key={item.slug}
                          href={`${path}/${item.slug}`}
                          image={item.image}
                          title={item[titleKey]}
                          subtitle={item[subtitleKey] ? String(item[subtitleKey]) : undefined}
                          badge={badge}
                          badgeColor={color}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </>
        )}

        {!hasQuery && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p>Escribe al menos 2 caracteres para buscar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
