"use client"

import { Button } from "@/components/ui/button"
import { Play, ShoppingCart, BookOpen, Tv, ExternalLink } from "lucide-react"
import type { Content } from "@/types/content"

interface ContentActionsProps {
  content?: Content
}

/**
 * Muestra botones de acción contextuales según el tipo de contenido
 * (película, cómic, videojuego, etc.).
 */
export function ContentActions({ content }: ContentActionsProps) {
  if (!content) return null // ← evita el crash

  const getActionButtons = () => {
    switch (content.type) {
      case "movie":
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver en {(content as Extract<Content, { type: "movie" }>).platform}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar en Amazon
            </Button>
          </div>
        )

      case "game":
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Gameplay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar por {(content as Extract<Content, { type: "game" }>).price}
            </Button>
          </div>
        )

      case "comic":
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Leer Online
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar por {(content as Extract<Content, { type: "comic" }>).price}
            </Button>
          </div>
        )

      case "series":
        const series = content as Extract<Content, { type: "series" }>
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4"
            >
              <Tv className="mr-2 h-5 w-5" />
              Ver en {series.platforms[0]}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-4"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Ver Trailer
            </Button>
          </div>
        )

      case "blog":
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Compartir Artículo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-8 py-4"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Más del Autor
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="flex justify-center py-8">{getActionButtons()}</div>
}

export default ContentActions
