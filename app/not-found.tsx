import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Film, Gamepad2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Página no encontrada | Spider-World",
  description: "Esta página no existe. Vuelve al inicio de Spider-World.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">

        {/* Spider web SVG decorativo */}
        <div className="relative mb-8 inline-block">
          <div className="text-[10rem] leading-none select-none">🕷️</div>
          <div className="absolute -top-4 -right-4 text-5xl select-none animate-bounce">🕸️</div>
        </div>

        {/* Número 404 */}
        <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¡Esta página se perdió en el multiverso!
        </h2>

        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Parece que has caído en una dimensión alternativa. La página que buscas no existe
          o ha sido trasladada a otro punto del Spider-Verse.
        </p>

        {/* Botón principal */}
        <div className="mb-10">
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold">
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Accesos rápidos */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm mb-5">O explora el Spider-Verse:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Blog
              </Button>
            </Link>
            <Link href="/peliculas">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Film className="w-4 h-4 mr-2" />
                Películas
              </Button>
            </Link>
            <Link href="/comics">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Cómics
              </Button>
            </Link>
            <Link href="/videojuegos">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Videojuegos
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
