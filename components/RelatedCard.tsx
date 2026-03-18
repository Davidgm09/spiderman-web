import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RelatedItem {
  id: number | string
  slug: string
  title: string
  description?: string | null
  image: string
  year: number | string
  rating: number
}

interface RelatedCardProps {
  item: RelatedItem
  basePath: string
  icon: LucideIcon
}

export function RelatedCard({ item, basePath, icon: Icon }: RelatedCardProps) {
  const href = `/${basePath}/${item.slug}`
  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={item.image}
            alt={`${item.title} (${item.year})`}
            width={300}
            height={450}
            className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-yellow-600">
            <Star className="w-3 h-3 mr-1" />
            {item.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-white mb-2 line-clamp-2">
          <Link href={href} className="hover:text-red-400 transition-colors">
            {item.title} ({item.year})
          </Link>
        </CardTitle>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href={href}>
            <Icon className="w-4 h-4 mr-1" />
            Ver Análisis
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
