export const revalidate = 3600

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/lib/database"
import { AMAZON_TAG, SITE_URL } from "@/lib/config"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await productService.getAll()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await productService.getBySlug(slug).catch(() => null)
  if (!product) return { title: "Producto no encontrado | Spider-World" }

  const url = `${SITE_URL}/tienda/${product.slug}`
  return {
    title: `${product.title} | Tienda Spider-World`,
    description: product.description?.substring(0, 155) ?? `Compra ${product.title} en Amazon a través de Spider-World.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.title} | Spider-World`,
      description: product.description?.substring(0, 155) ?? "",
      images: [product.image],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Spider-World`,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await productService.getBySlug(slug).catch(() => null)
  if (!product) notFound()

  productService.incrementViews(slug).catch(() => {})

  const relatedFiltered = await productService.getByCategory(product.category, slug).catch(() => [])

  const amazonUrl = product.asin
    ? `https://www.amazon.es/dp/${product.asin}?tag=${AMAZON_TAG}`
    : `https://www.amazon.es/s?k=${encodeURIComponent(`${product.title} Spider-Man`)}&tag=${AMAZON_TAG}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image.startsWith('/') ? `${SITE_URL}${product.image}` : product.image,
    brand: { "@type": "Brand", name: "Marvel" },
    offers: {
      "@type": "Offer",
      url: amazonUrl,
      priceCurrency: "EUR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Amazon" },
    },
    ...(product.rating && product.reviews ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: parseInt(product.reviews),
        bestRating: 5,
        worstRating: 1,
      }
    } : {})
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagen */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-950/60 border border-white/5">
            {product.discount && (
              <Badge className="absolute top-4 left-4 z-10 bg-red-600 text-white text-sm px-3 py-1">
                -{product.discount}
              </Badge>
            )}
            {product.inStock === false && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Sin stock</span>
              </div>
            )}
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-[420px] object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.category && (
              <span className="text-xs font-semibold tracking-widest uppercase text-red-400">{product.category}</span>
            )}

            <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                />
              ))}
              <span className="text-yellow-400 font-semibold ml-1">{product.rating}</span>
              <span className="text-gray-500 text-sm">({parseInt(product.reviews || "0").toLocaleString("es-ES")} reseñas)</span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">{product.price}€</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">{product.originalPrice}€</span>
              )}
              {product.discount && (
                <span className="text-green-400 text-sm font-semibold">Ahorra {product.discount}</span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            )}

            {/* Botón Amazon */}
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 hover:scale-[1.02] shadow-lg ${
                product.inStock === false
                  ? "bg-gray-700 cursor-not-allowed pointer-events-none"
                  : "bg-orange-500 hover:bg-orange-400 shadow-orange-900/40"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.inStock === false ? "Sin stock" : "Comprar en Amazon"}
            </a>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {[
                { icon: Truck,     color: "text-green-400",  label: "Envío Prime" },
                { icon: Shield,    color: "text-blue-400",   label: "Garantía Amazon" },
                { icon: RotateCcw, color: "text-purple-400", label: "30 días devolución" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Aviso afiliado */}
            <p className="text-xs text-gray-600">
              Enlace de afiliado — si compras a través de este enlace recibimos una pequeña comisión sin coste adicional para ti.
            </p>
          </div>
        </div>
      </section>

      {/* Productos relacionados */}
      {relatedFiltered.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
            <h2 className="text-xl font-bold text-white">Productos relacionados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedFiltered.map((p) => (
              <Link key={p.id} href={`/tienda/${p.slug}`} className="group bg-gray-950/60 border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden transition-all">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={300}
                  height={200}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold line-clamp-2 mb-2">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{p.price}€</span>
                    <span className="text-xs text-orange-400 font-semibold">Ver →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
