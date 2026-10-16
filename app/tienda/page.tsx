import type { Metadata } from "next"
import Link from "next/link"
import { Search, X, CheckCircle2, ShoppingCart, Tag, Gift, ArrowRight } from "lucide-react"
import { productService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import ProductGrid, { ProductCard } from "@/components/tienda/ProductGrid"

export const metadata: Metadata = {
  title: "Tienda Spider-Man: figuras, Funko y más | Sentido Arácnido",
  description:
    "Selección de productos de Spider-Man en Amazon revisados uno a uno: figuras Marvel Legends, Funko Pop, LEGO, cómics de Panini, ropa y regalos.",
  keywords: ["tienda Spider-Man", "productos Spider-Man", "figuras Spider-Man", "camisetas Marvel", "funkos", "merchandising"],
  alternates: { canonical: `${SITE_URL}/tienda` },
  openGraph: {
    title: "Tienda Spider-Man: figuras, Funko y más | Sentido Arácnido",
    description: "Figuras, Funko Pop, LEGO, cómics y regalos de Spider-Man, revisados uno a uno.",
    url: `${SITE_URL}/tienda`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda Spider-Man | Sentido Arácnido",
    description: "Figuras, Funko Pop, LEGO, cómics y regalos de Spider-Man, revisados uno a uno.",
  },
}


const CATEGORY_COLORS: Record<string, string> = {
  Figuras:        "text-red-400 border-red-500/30 bg-red-500/10",
  Ropa:           "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Accesorios:     "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Juguetes:       "text-green-400 border-green-500/30 bg-green-500/10",
  Coleccionables: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  Tecnología:     "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  Cómics:         "text-pink-400 border-pink-500/30 bg-pink-500/10",
}

// Accesos rápidos por tipo de comprador (cada uno abre una categoría)
const COLLECTIONS = [
  { emoji: "🧸", title: "Para los más pequeños", text: "LEGO, máscaras y juguetes", category: "Juguetes", bg: "from-green-500/15 to-transparent" },
  { emoji: "🦸", title: "Para coleccionistas", text: "Figuras Marvel Legends", category: "Figuras", bg: "from-red-500/15 to-transparent" },
  { emoji: "📚", title: "Para lectores", text: "Cómics de Panini y ómnibus", category: "Cómics", bg: "from-pink-500/15 to-transparent" },
  { emoji: "🎁", title: "Detalles y Funko", text: "Funko Pop y coleccionables", category: "Coleccionables", bg: "from-orange-500/15 to-transparent" },
]

type Props = { searchParams: Promise<{ categoria?: string; q?: string }> }

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria, q } = await searchParams
  const allProducts = await productService.getAll()

  const query = q?.trim().toLowerCase() ?? ""

  const filtered = allProducts.filter((p) => {
    const matchCat = categoria ? p.category === categoria : true
    const matchQ = query
      ? p.title.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
      : true
    return matchCat && matchQ
  })

  // Novedades de la película: bloque propio en la vista general (y fuera de la cuadrícula para no repetirlos)
  const showHighlights = !categoria && !query
  const NOVEDADES_ORDEN = ["marvel-legends-spider-man", "funko-pop-spider-man-brand", "funko-pop-spider-man-traje", "hasbro-spider-man-power", "marvel-legends-hulk", "funko-pop-super-hulk", "camiseta"]
  const rank = (slug: string) => { const i = NOVEDADES_ORDEN.findIndex((k) => slug.startsWith(k)); return i < 0 ? NOVEDADES_ORDEN.length : i }
  const novedades = showHighlights
    ? allProducts.filter((p) => p.slug.includes("brand-new-day")).sort((a, b) => rank(a.slug) - rank(b.slug))
    : []
  const gridProducts = showHighlights ? filtered.filter((p) => !p.slug.includes("brand-new-day")) : filtered

  const categoryCounts: Record<string, number> = {}
  allProducts.forEach((p) => {
    if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
  })
  const categories = Object.entries(categoryCounts)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">

      {/* Hero compacto con búsqueda integrada */}
      <section className="relative pt-28 pb-10 px-4 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12)_0%,_transparent_65%)]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">Sentido Arácnido · Selección de productos</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Merchandising<br className="hidden sm:block" /> Spider-Man
          </h1>
          <p className="text-gray-500 text-base mb-8">
            Figuras, Funko Pop, LEGO, cómics y ropa que hemos elegido y revisado uno a uno. La compra se hace en Amazon.
          </p>

          {/* Barra de búsqueda */}
          <form action="/tienda" method="GET" className="relative max-w-xl mx-auto mb-6">
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar figuras, cómics, ropa..."
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 text-sm outline-none transition-colors"
            />
            {query ? (
              <Link
                href={categoria ? `/tienda?categoria=${encodeURIComponent(categoria)}` : "/tienda"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Borrar búsqueda"
              >
                <X className="w-4 h-4" />
              </Link>
            ) : (
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 text-white rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors">
                Buscar
              </button>
            )}
          </form>

          {/* Beneficios en línea */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />Productos revisados uno a uno</span>
            <span className="flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5 text-orange-400" />Compras directamente en Amazon</span>
            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-blue-400" />Sin coste extra para ti</span>
          </div>
        </div>
      </section>

      {/* Barra de filtros */}
      <div className="sticky top-16 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide">
          <Link
            href={query ? `/tienda?q=${encodeURIComponent(query)}` : "/tienda"}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !categoria
                ? "bg-white text-gray-900 border-white"
                : "text-gray-400 border-white/10 bg-transparent hover:border-white/25 hover:text-white"
            }`}
          >
            Todos <span className="opacity-60">({allProducts.length})</span>
          </Link>
          {categories.map(([name, count]) => {
            const isActive = categoria === name
            const base = query ? `?q=${encodeURIComponent(query)}&` : "?"
            const href = isActive
              ? (query ? `/tienda?q=${encodeURIComponent(query)}` : "/tienda")
              : `/tienda${base}categoria=${encodeURIComponent(name)}`
            return (
              <Link
                key={name}
                href={href}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? (CATEGORY_COLORS[name] ?? "text-white border-white/30 bg-white/10")
                    : "text-gray-400 border-white/10 bg-transparent hover:border-white/25 hover:text-white"
                }`}
              >
                {name} <span className="opacity-50">({count})</span>
              </Link>
            )
          })}
          {(categoria || query) && (
            <Link href="/tienda" className="shrink-0 ml-auto text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Limpiar
            </Link>
          )}
        </div>
      </div>

      {/* Aviso afiliado */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <p className="text-xs text-gray-600 text-center">
          Participamos en el Programa de Afiliados de Amazon EU — recibimos una comisión sin coste para ti.{" "}
          <a href="/aviso-legal" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">Más info</a>
        </p>
      </div>

      {/* Ideas para regalar (solo en la vista general) */}
      {!categoria && !query && (
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <Link
            href="/blog/regalos-spider-man-navidad-guia"
            className="group flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6 rounded-2xl border border-orange-400/30 bg-gradient-to-r from-orange-500/15 via-red-500/10 to-transparent hover:border-orange-400/60 transition-colors"
          >
            <Gift className="w-10 h-10 text-orange-400 shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-bold text-white">¿Buscas un regalo? Mira nuestra guía de Navidad</p>
              <p className="text-sm text-gray-400">Ordenada por tipo de fan: niños, coleccionistas, lectores de cómics y detalles para el amigo invisible.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-400 group-hover:text-orange-300">
              Ver la guía <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.title}
                href={`/tienda?categoria=${encodeURIComponent(c.category)}`}
                className={`rounded-2xl p-4 sm:p-5 border border-white/5 bg-gradient-to-br ${c.bg} hover:border-white/20 transition-colors`}
              >
                <span className="text-2xl" aria-hidden>{c.emoji}</span>
                <p className="mt-2 font-bold text-white text-sm sm:text-base">{c.title}</p>
                <p className="text-xs text-gray-400 mt-1">{c.text}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Novedades de Brand New Day */}
      {novedades.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-blue-600" />
            <h2 className="text-2xl font-bold text-white">Novedad: Spider-Man: Brand New Day</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Figuras, Funko Pop y camisetas de la cuarta película de Tom Holland.{" "}
            <Link href="/peliculas/spider-man-brand-new-day-2026" className="text-red-400 hover:text-red-300 underline">Ver la ficha de la película</Link>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {novedades.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        </section>
      )}

      {/* Grid de productos */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
          <h2 className="text-2xl font-bold text-white">
            {filtered.length === allProducts.length
              ? "Todos los productos"
              : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-400">Sin resultados</p>
            <p className="text-sm mt-1 mb-4">Prueba con otro término o categoría</p>
            <Link href="/tienda" className="text-sm text-red-400 hover:text-red-300 transition-colors">Limpiar filtros</Link>
          </div>
        )}

        <ProductGrid products={gridProducts} />
      </section>

    </div>
  )
}
