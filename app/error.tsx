'use client'

import Link from "next/link"
import { useEffect } from "react"
import { Home, RefreshCw, Film, BookOpen, Gamepad2, Users, Tv } from "lucide-react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">

        {/* Icono */}
        <div className="relative mb-8 inline-block">
          <div className="text-[10rem] leading-none select-none">🕸️</div>
        </div>

        {/* Código de error */}
        <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          500
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Algo se rompió en el Spider-Verse
        </h2>

        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Ha ocurrido un error inesperado. Puedes intentar recargar la página
          o volver al inicio.
        </p>

        {/* Acciones */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Accesos rápidos */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-gray-500 text-sm mb-5">O explora el Spider-Verse:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/personajes",  icon: Users,    label: "Personajes" },
              { href: "/peliculas",   icon: Film,     label: "Películas" },
              { href: "/series",      icon: Tv,       label: "Series" },
              { href: "/comics",      icon: BookOpen, label: "Cómics" },
              { href: "/videojuegos", icon: Gamepad2, label: "Videojuegos" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
