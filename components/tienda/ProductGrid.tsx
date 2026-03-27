"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CATEGORY_COLORS: Record<string, string> = {
  Figuras:        "text-red-400 border-red-500/30 bg-red-500/10",
  Ropa:           "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Accesorios:     "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Juguetes:       "text-green-400 border-green-500/30 bg-green-500/10",
  Coleccionables: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  Tecnología:     "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  Cómics:         "text-pink-400 border-pink-500/30 bg-pink-500/10",
}

const PAGE_SIZE = 12

type Product = {
  id: string
  slug: string
  title: string
  image: string
  category: string
  discount: string | null
  inStock: boolean
  rating: number | null
  reviews: string | null
  price: string
  originalPrice: string | null
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  const shown = products.slice(0, visible)
  const hasMore = visible < products.length

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shown.map((product) => (
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
                {[1, 2, 3, 4, 5].map((i) => (
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
