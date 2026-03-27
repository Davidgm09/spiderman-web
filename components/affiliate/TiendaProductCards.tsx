import { productService } from "@/lib/database"
import { AmazonProductCard } from "./AmazonProductCard"
import { AMAZON_TAG } from "@/lib/config"

interface TiendaProductCardsProps {
  categories: string[]   // categorías a buscar, en orden de prioridad
  limit?: number
  excludeSlug?: string
}

export async function TiendaProductCards({ categories, limit = 2, excludeSlug }: TiendaProductCardsProps) {
  let products: Awaited<ReturnType<typeof productService.getByCategory>> = []
  for (const cat of categories) {
    const result = await productService.getByCategory(cat, excludeSlug ?? "", limit)
    products = [...products, ...result]
    if (products.length >= limit) break
  }
  products = products.slice(0, limit)

  if (products.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
        De nuestra tienda
      </p>
      <div className="grid grid-cols-2 gap-2">
        {products.map((p) => (
          <AmazonProductCard
            key={p.id}
            title={p.title}
            image={p.image}
            href={p.asin ? `https://www.amazon.es/dp/${p.asin}?tag=${AMAZON_TAG}` : `/tienda/${p.slug}`}
            badge={p.category}
            price={p.price}
            variant="compact"
          />
        ))}
      </div>
    </div>
  )
}
