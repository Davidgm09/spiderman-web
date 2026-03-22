import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InContentAd } from "@/components/ads/GoogleAdsense"
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

type Props = { searchParams: Promise<{ categoria?: string }> }

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const allProducts = await productService.getAll()

  const filtered = categoria
    ? allProducts.filter((p) => p.category === categoria)
    : allProducts

  const categoryCounts: Record<string, number> = {}
  allProducts.forEach((p) => {
    if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
  })
  const categories = Object.entries(categoryCounts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3">Spider-World · Tienda</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Productos Oficiales Spider-Man
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Figuras, camisetas, Funko Pop y coleccionables. Todo a través de Amazon con envío rápido.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-gray-300">{allProducts.length} productos</span>
            <span className="px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-gray-300">Envío Prime</span>
            <span className="px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-gray-300">Garantía Amazon</span>
          </div>
          {categoria && (
            <p className="mt-4 text-sm text-gray-500">
              Filtrando por <span className="text-white font-medium">{categoria}</span>
              {" · "}<Link href="/tienda" className="text-red-400 hover:text-red-300">Ver todos</Link>
            </p>
          )}
        </div>
      </section>

      {/* Aviso afiliado */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <p className="text-xs text-gray-500 text-center bg-gray-950/60 border border-white/5 rounded-xl py-2.5 px-4">
          Spider-World participa en el Programa de Afiliados de Amazon EU. Si compras a través de nuestros enlaces recibimos una pequeña comisión sin coste adicional para ti.{" "}
          <a href="/aviso-legal" className="text-red-400 hover:text-red-300">Más información</a>.
        </p>
      </div>

      {/* Beneficios */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck,     color: "text-green-400",  title: "Envío Prime",       sub: "Entrega en 1-2 días" },
            { icon: Shield,    color: "text-blue-400",   title: "Garantía Amazon",   sub: "Productos oficiales" },
            { icon: RotateCcw, color: "text-purple-400", title: "Devoluciones",      sub: "30 días sin coste" },
          ].map(({ icon: Icon, color, title, sub }) => (
            <div key={title} className="flex items-center gap-4 bg-gray-950/60 border border-white/5 rounded-2xl p-5">
              <Icon className={`w-8 h-8 shrink-0 ${color}`} />
              <div>
                <div className="font-semibold text-white">{title}</div>
                <div className="text-sm text-gray-400">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tienda"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !categoria
                  ? "bg-white/15 border-white/30 text-white"
                  : "text-gray-400 border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              Todos <span className="opacity-60">({allProducts.length})</span>
            </Link>
            {categories.map(([name, count]) => (
              <Link
                key={name}
                href={categoria === name ? "/tienda" : `/tienda?categoria=${encodeURIComponent(name)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  categoria === name
                    ? (CATEGORY_COLORS[name] ?? "text-gray-400 border-white/10 bg-white/5") + " ring-2 ring-white/20"
                    : (CATEGORY_COLORS[name] ?? "text-gray-400 border-white/10 bg-white/5") + " opacity-70 hover:opacity-100"
                }`}
              >
                {name} <span className="opacity-60">({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 mb-10">
        <InContentAd />
      </div>

      {/* Grid de productos */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
          <h2 className="text-2xl font-bold text-white">
            {categoria ? `${categoria} (${filtered.length})` : "Todos los productos"}
          </h2>
        </div>

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
