"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CATEGORY_COLORS: Record<string, string> = {
  Figuras:        "text-red-400",
  Ropa:           "text-blue-400",
  Accesorios:     "text-purple-400",
  Juguetes:       "text-green-400",
  Coleccionables: "text-orange-400",
  Tecnología:     "text-yellow-400",
  Cómics:         "text-pink-400",
}

const PAGE_SIZE = 12

type Product = {
  id: string
  slug: string
  title: string
  image: string
  category: string
  inStock: boolean
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-gray-900/60 border border-white/5 hover:border-orange-400/50 hover:-translate-y-1 transition-all duration-200"
    >
      {/* Foto entera sobre fondo blanco, como en Amazon */}
      <div className="relative aspect-square bg-white">
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Sin stock</span>
          </div>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 sm:p-5 group-hover:scale-105 transition-transform duration-300"
          priority={priority}
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {product.category && (
          <span className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wide mb-1.5 ${CATEGORY_COLORS[product.category] ?? "text-gray-400"}`}>
            {product.category}
          </span>
        )}
        <h3 className="text-white font-medium text-sm leading-snug line-clamp-2 sm:line-clamp-3 flex-1">
          {product.title}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-orange-400 group-hover:text-orange-300">
          Ver detalles <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  )
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  const shown = products.slice(0, visible)
  const hasMore = visible < products.length

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {shown.map((product, i) => <ProductCard key={product.id} product={product} priority={i < 4} />)}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all duration-200"
          >
            Ver más ({products.length - visible} productos restantes)
          </button>
        </div>
      )}
    </>
  )
}
