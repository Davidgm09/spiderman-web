import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Tienda Spider-Man - Figuras, Camisetas, Funkos y Más | Spider-World",
  description:
    "Los mejores productos oficiales de Spider-Man en Amazon: figuras, camisetas, Funko Pop, mochilas y coleccionables. Envío rápido y garantía Amazon.",
  keywords: ["tienda Spider-Man", "productos Spider-Man", "figuras Spider-Man", "camisetas Marvel", "funkos", "merchandising"],
  alternates: { canonical: `${SITE_URL}/tienda` },
  openGraph: {
    title: "Tienda Spider-Man - Figuras, Camisetas, Funkos y Más | Spider-World",
    description: "Los mejores productos oficiales de Spider-Man en Amazon.",
    url: `${SITE_URL}/tienda`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda Spider-Man | Spider-World",
    description: "Los mejores productos oficiales de Spider-Man en Amazon.",
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  Figuras:       "text-red-400 border-red-500/30 bg-red-500/10",
  Ropa:          "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Accesorios:    "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Juguetes:      "text-green-400 border-green-500/30 bg-green-500/10",
  Coleccionables:"text-orange-400 border-orange-500/30 bg-orange-500/10",
  Tecnología:    "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
}

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
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">Spider-World · Tienda Oficial</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Merchandising<br className="hidden sm:block" /> Spider-Man
          </h1>
          <p className="text-gray-500 text-base mb-8">
            Figuras, Funko Pop, cómics y ropa. Enviado desde Amazon.
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
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-green-500" />Envío Prime 1-2 días</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-500" />Garantía Amazon</span>
            <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-purple-500" />30 días devolución</span>
          </div>
        </div>
      </section>

      {/* Barra de filtros */}
      <div className="sticky top-16 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/tienda/${product.slug}`}
              className="group bg-gray-950/60 border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Imagen */}
              <div className="relative">
                {product.discount && (
                  <Badge className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs">
                    -{product.discount}
                  </Badge>
                )}
                {product.inStock === false && (
                  <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Sin stock</span>
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                {product.category && (
                  <span className={`text-xs font-semibold mb-2 ${CATEGORY_COLORS[product.category] ?? "text-gray-400"}`}>
                    {product.category}
                  </span>
                )}

                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-3 flex-1">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i <= Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">({parseInt(product.reviews || "0").toLocaleString("es-ES")})</span>
                </div>

                {/* Precio */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-white">{product.price}€</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}€</span>
                  )}
                </div>

                {/* Botón */}
                <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 group-hover:bg-orange-400 text-white text-sm font-semibold transition-colors duration-200">
                  <ShoppingCart className="w-4 h-4" />
                  Ver producto
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
