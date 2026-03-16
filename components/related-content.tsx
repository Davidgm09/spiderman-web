import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RelatedItem {
  title: string
  description: string
  image: string
  href: string
  category: string
}

interface RelatedContentProps {
  items: RelatedItem[]
}

export function RelatedContent({ items }: RelatedContentProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-red-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Más sobre Spider-Man
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explora más contenido del Spider-Verse que te puede interesar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-white mb-3 hover:text-red-400 transition-colors">
                  <Link href={item.href}>{item.title}</Link>
                </CardTitle>
                <CardDescription className="text-gray-300 mb-4 leading-relaxed">{item.description}</CardDescription>
                <Link href={item.href}>
                  <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedContent
