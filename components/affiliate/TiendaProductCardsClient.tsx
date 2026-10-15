'use client'

import { useEffect, useState } from 'react'
import { AmazonProductCard } from './AmazonProductCard'

interface Product {
  id: string
  title: string
  image: string
  asin: string | null
  slug: string
  category: string
}

interface TiendaProductCardsClientProps {
  products: Product[]
  amazonTag: string
  display?: number
}

export function TiendaProductCardsClient({ products, amazonTag, display = 4 }: TiendaProductCardsClientProps) {
  // Primero los N primeros (igual en servidor y navegador) y se barajan ya en el navegador:
  // barajar durante el render daba un HTML distinto en cada lado (error de hidratación #418)
  const [picked, setPicked] = useState(() => products.slice(0, display))

  useEffect(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    setPicked(shuffled.slice(0, display))
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
            variant="compact"
          />
        ))}
      </div>
    </div>
  )
}
