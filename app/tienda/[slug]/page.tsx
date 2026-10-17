export const revalidate = 3600

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShoppingCart, CheckCircle2, Tag, Gift, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/tienda/ProductGrid"
import { Breadcrumb } from "@/components/breadcrumb"
import { productService } from "@/lib/database"
import { AMAZON_TAG, SITE_URL, pageTitle } from "@/lib/config"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await productService.getAll()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug)
  const product = await productService.getBySlug(slug)
  // notFound() aquí (antes de empezar a enviar la página) devuelve un 404 real
  if (!product) notFound()

  const url = `${SITE_URL}/tienda/${product.slug}`
  return {
    title: pageTitle(product.title),
    description: product.description?.substring(0, 155) ?? `Compra ${product.title} en Amazon a través de Sentido Arácnido.`,
    alternates: { canonical: url },
    // Fichas de afiliado con poco texto propio: visibles para el usuario, pero fuera del índice de Google
    // (la página /tienda sí se indexa)
    robots: { index: false, follow: true },
    openGraph: {
      title: `${product.title} | Sentido Arácnido`,
      description: product.description?.substring(0, 155) ?? "",
      images: [product.image],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Sentido Arácnido`,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug)
  const product = await productService.getBySlug(slug)
  if (!product) notFound()

  productService.incrementViews(slug).catch(() => {})

  const relatedFiltered = await productService.getByCategory(product.category, slug).catch(() => [])

  const amazonUrl = product.asin
    ? `https://www.amazon.es/dp/${product.asin}?tag=${AMAZON_TAG}`
    : `https://www.amazon.es/s?k=${encodeURIComponent(`${product.title} Spider-Man`)}&tag=${AMAZON_TAG}`


  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Breadcrumb items={[{ label: "Tienda", href: "/tienda" }, { label: product.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagen */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-white/5 aspect-square">
            {product.inStock === false && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Sin stock</span>
              </div>
            )}
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 sm:p-10"
              priority
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.category && (
              <span className="text-xs font-semibold tracking-widest uppercase text-red-400">{product.category}</span>
            )}

            <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>

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
              {product.inStock === false ? "Sin stock" : "Ver precio en Amazon"}
            </a>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {[
                { icon: CheckCircle2, color: "text-green-400",  label: "Revisado por Sentido Arácnido" },
                { icon: ShoppingCart, color: "text-orange-400", label: "Compra directa en Amazon" },
                { icon: Tag,          color: "text-blue-400",   label: "Sin coste extra para ti" },
              ].map(({ icon: Icon, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Aviso afiliado */}
            <p className="text-xs text-gray-600">
              Enlace de afiliado — si compras a través de este enlace recibimos una pequeña comisión sin coste adicional para ti. El precio, el envío y la disponibilidad los fija Amazon y pueden cambiar.
            </p>

            <Link
              href="/blog/regalos-spider-man-navidad-guia"
              className="group flex items-center gap-3 p-4 rounded-xl border border-orange-400/30 bg-orange-500/10 hover:border-orange-400/60 transition-colors"
            >
              <Gift className="w-6 h-6 text-orange-400 shrink-0" />
              <span className="flex-1 text-sm text-gray-200">¿Es para regalar? Mira más ideas en nuestra <strong className="text-white">guía de regalos de Spider-Man</strong></span>
              <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
            {relatedFiltered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

    </div>
  )
}
