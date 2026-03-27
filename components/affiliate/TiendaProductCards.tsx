import { productService } from "@/lib/database"
import { AMAZON_TAG } from "@/lib/config"
import { TiendaProductCardsClient } from "./TiendaProductCardsClient"

interface TiendaProductCardsProps {
  categories: string[]
  display?: number       // cuántos mostrar (aleatorio de los que se fetchen)
  fetchLimit?: number    // cuántos traer de BD para tener variedad
  excludeSlug?: string
}

export async function TiendaProductCards({
  categories,
  display = 4,
  fetchLimit = 6,
  excludeSlug,
}: TiendaProductCardsProps) {
  let products: Awaited<ReturnType<typeof productService.getByCategory>> = []

  for (const cat of categories) {
    const result = await productService.getByCategory(cat, excludeSlug ?? "", fetchLimit)
    products = [...products, ...result]
    if (products.length >= fetchLimit) break
  }

  if (products.length === 0) return null

  return (
    <TiendaProductCardsClient
      products={products}
      amazonTag={AMAZON_TAG}
      display={display}
    />
  )
}
