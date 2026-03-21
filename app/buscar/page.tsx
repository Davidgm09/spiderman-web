import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Search, Film, Users, Tv, BookOpen, Gamepad2, BookMarked } from "lucide-react"
import { prisma } from "@/lib/database"

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
    prisma.character.findMany({ where: { isActive: true, OR: [{ name: s }, { description: s }] }, select: { name: true, slug: true, image: true, category: true }, take: 6 }),
    prisma.movie.findMany({ where: { isActive: true, OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.series.findMany({ where: { isActive: true, OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.comic.findMany({ where: { isActive: true, OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.game.findMany({ where: { isActive: true, OR: [{ title: s }, { description: s }] }, select: { title: true, slug: true, image: true, year: true }, take: 6 }),
    prisma.blogPost.findMany({ where: { isPublished: true, OR: [{ title: s }, { excerpt: s }] }, select: { title: true, slug: true, image: true, category: true }, take: 6 }),
  ])
  const totalResults = characters.length + movies.length + series.length + comics.length + games.length + posts.length
  prisma.searchQuery.create({ data: { query: q, results: totalResults } }).catch(() => {})
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
    <Link href={href} className="flex items-center gap-4 bg-gray-950/60 hover:bg-gray-900/60 border border-white/5 hover:border-white/15 rounded-2xl p-3 transition-all duration-200 group">
      <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
        {image && (
          <Image src={image} alt={title} fill sizes="48px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeColor} mb-1.5 inline-block`}>{badge}</span>
        <p className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors truncate leading-snug">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5 truncate">{subtitle}</p>}
      </div>
    </Link>
  )
}

const SECTIONS = [
  { key: "movies",     label: "Películas",   badge: "Película",   color: "bg-blue-600/20 text-blue-300",    path: "/peliculas",   titleKey: "title", subtitleKey: "year" },
  { key: "characters", label: "Personajes",  badge: "Personaje",  color: "bg-red-600/20 text-red-300",      path: "/personajes",  titleKey: "name",  subtitleKey: "category" },
  { key: "series",     label: "Series",      badge: "Serie",      color: "bg-purple-600/20 text-purple-300", path: "/series",      titleKey: "title", subtitleKey: "year" },
  { key: "comics",     label: "Cómics",      badge: "Cómic",      color: "bg-yellow-600/20 text-yellow-300", path: "/comics",      titleKey: "title", subtitleKey: "year" },
  { key: "games",      label: "Videojuegos", badge: "Videojuego", color: "bg-green-600/20 text-green-300",   path: "/videojuegos", titleKey: "title", subtitleKey: "year" },
  { key: "posts",      label: "Blog",        badge: "Artículo",   color: "bg-orange-600/20 text-orange-300", path: "/blog",        titleKey: "title", subtitleKey: "category" },
]

const QUICK_LINKS = [
  { href: "/peliculas",   label: "Películas",   icon: Film,      color: "border-blue-500/30 text-blue-400 hover:border-blue-400/60 hover:bg-blue-950/30" },
  { href: "/personajes",  label: "Personajes",  icon: Users,     color: "border-red-500/30 text-red-400 hover:border-red-400/60 hover:bg-red-950/30" },
  { href: "/series",      label: "Series",      icon: Tv,        color: "border-purple-500/30 text-purple-400 hover:border-purple-400/60 hover:bg-purple-950/30" },
  { href: "/comics",      label: "Cómics",      icon: BookOpen,  color: "border-yellow-500/30 text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-950/30" },
  { href: "/videojuegos", label: "Videojuegos", icon: Gamepad2,  color: "border-green-500/30 text-green-400 hover:border-green-400/60 hover:bg-green-950/30" },
  { href: "/blog",        label: "Blog",        icon: BookMarked, color: "border-orange-500/30 text-orange-400 hover:border-orange-400/60 hover:bg-orange-950/30" },
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
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 text-white">

      {/* Header */}
      <section className="pt-32 pb-12 px-4 text-center">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Búsqueda</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">
          {hasQuery
            ? <>Resultados para <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">"{query}"</span></>
            : <>¿Qué <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">buscas?</span></>
          }
        </h1>
        {!hasQuery && (
          <p className="text-gray-400 mb-10">Películas, personajes, cómics, series, videojuegos y artículos</p>
        )}
        {hasQuery && (
          <p className="text-gray-400 mb-10">
            {totalResults > 0
              ? `${totalResults} resultado${totalResults !== 1 ? "s" : ""} encontrado${totalResults !== 1 ? "s" : ""}`
              : "Sin resultados — prueba con otro término"}
          </p>
        )}

        {/* Search form */}
        <form method="GET" action="/buscar" className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Busca Spider-Man, Venom, No Way Home..."
            autoFocus
            className="w-full bg-black/40 backdrop-blur-sm border border-white/10 focus:border-red-500/60 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-gray-500 outline-none text-lg transition-colors shadow-2xl shadow-black/40"
          />
        </form>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">

        {/* Sin query: accesos rápidos */}
        {!hasQuery && (
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-5 text-center">Explorar por categoría</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 border rounded-2xl px-5 py-4 transition-all duration-200 hover:scale-105 ${color}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-semibold text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sin resultados */}
        {hasQuery && totalResults === 0 && (
          <div className="text-center py-20">
            <Search className="w-14 h-14 text-gray-700 mx-auto mb-5" />
            <p className="text-gray-300 font-semibold text-lg mb-2">No encontramos nada para "{query}"</p>
            <p className="text-gray-500 text-sm mb-8">Prueba con el título completo o un término más general.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 ${color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {hasQuery && results && totalResults > 0 && (
          <div className="space-y-10">
            {SECTIONS.map(({ key, label, badge, color, path, titleKey, subtitleKey }) => {
              const items = (results as unknown as Record<string, Record<string, string>[]>)[key]
              if (!items?.length) return null
              return (
                <section key={key}>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-transparent" />
                    <h2 className="text-base font-bold text-white">{label}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${color}`}>{items.length}</span>
                  </div>
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
        )}
      </div>
    </div>
  )
}
