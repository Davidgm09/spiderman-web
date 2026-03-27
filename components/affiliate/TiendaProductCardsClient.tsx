'use client'

import { useMemo } from 'react'
import { AmazonProductCard } from './AmazonProductCard'

interface Product {
  id: string
  title: string
  image: string
  asin: string | null
  slug: string
  category: string
  price: string | null
}

interface TiendaProductCardsClientProps {
  products: Product[]
  amazonTag: string
  display?: number
}

export function TiendaProductCardsClient({ products, amazonTag, display = 4 }: TiendaProductCardsClientProps) {
  const picked = useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, display)
  }, [products, display])

  if (picked.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
        De nuestra tienda
      </p>
      <div className="grid grid-cols-2 gap-2">
        {picked.map((p) => (
          <AmazonProductCard
            key={p.id}
            title={p.title}
            image={p.image}
            href={p.asin ? `https://www.amazon.es/dp/${p.asin}?tag=${amazonTag}` : `/tienda/${p.slug}`}
            badge={p.category}
            price={p.price ?? undefined}
            variant="compact"
          />
        ))}
      </div>
    </div>
  )
}
