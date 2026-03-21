export const revalidate = 3600

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Gamepad2, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { gameService, blogService } from "@/lib/database"
import { Game } from "@prisma/client"

export const metadata: Metadata = {
  title: "Videojuegos de Spider-Man - Colección Completa | Spider-World",
  description:
    "Todos los videojuegos de Spider-Man: desde clásicos arcade hasta PS5. Reseñas completas, gameplay, plataformas y enlaces de compra.",
  keywords: ["Spider-Man videojuegos", "Marvel's Spider-Man", "Spider-Man PS4", "Spider-Man PS5", "Insomniac Games", "videojuegos Marvel"],
  alternates: { canonical: '/videojuegos' },
  openGraph: {
    title: "Videojuegos de Spider-Man - Colección Completa | Spider-World",
    description: "Todos los videojuegos de Spider-Man: desde clásicos arcade hasta PS5. Reseñas completas, gameplay y plataformas.",
    type: 'website',
    url: '/videojuegos',
    images: ['https://media.rawg.io/media/games/5f1/5f1399f755ed3a40b04a9195f4c06be5.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Videojuegos de Spider-Man - Colección Completa | Spider-World",
    description: "Todos los videojuegos de Spider-Man: desde clásicos arcade hasta PS5. Reseñas completas, gameplay y plataformas.",
    images: ['https://media.rawg.io/media/games/5f1/5f1399f755ed3a40b04a9195f4c06be5.jpg'],
  },
}

const ERA_CONFIG = {
  clasica:      { title: "Era Clásica",         subtitle: "1982–1999 · Los primeros juegos en arcade y consolas retro", accent: "from-blue-600",   border: "border-blue-500/40",   glow: "shadow-blue-900/40" },
  moderna:      { title: "Era Moderna",          subtitle: "2000–2009 · Transición al 3D y las primeras aventuras de mundo abierto", accent: "from-red-600",    border: "border-red-500/40",    glow: "shadow-red-900/40" },
  dorada:       { title: "Era Dorada",           subtitle: "2010–2017 · Los juegos más ambiciosos antes de Insomniac", accent: "from-yellow-600", border: "border-yellow-500/40", glow: "shadow-yellow-900/40" },
  insomniac:    { title: "Era Insomniac",        subtitle: "2018–Presente · La nueva generación que redefinió Spider-Man", accent: "from-green-600",  border: "border-green-500/40",  glow: "shadow-green-900/40" },
}

function organizeGamesByEra(games: Game[]) {
  const eras = Object.fromEntries(
    Object.entries(ERA_CONFIG).map(([key, cfg]) => [key, { ...cfg, games: [] as Game[] }])
  ) as Record<string, typeof ERA_CONFIG[keyof typeof ERA_CONFIG] & { games: Game[] }>

  games.forEach(game => {
    const year = game.year
    const name = game.title.toLowerCase()

    if (name.includes("marvel's spider-man") || year >= 2018) {
      eras.insomniac.games.push(game)
    } else if (year >= 1982 && year <= 1999) {
      eras.clasica.games.push(game)
    } else if (year >= 2000 && year <= 2009) {
      eras.moderna.games.push(game)
    } else {
      eras.dorada.games.push(game)
    }
  })

  Object.values(eras).forEach(era => {
    era.games.sort((a, b) => b.year - a.year)
  })

  return eras
}

export default async function VideojuegosPage() {
  const allGames = await gameService.getAll()
  const eras = organizeGamesByEra(allGames)
  const featuredPost = await blogService.getBySlug('marvels-spider-man-3-insomniac-todo-lo-que-sabemos').catch(() => null)

  const totalGames = allGames.length
  const totalEras = Object.values(eras).filter(e => e.games.length > 0).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">

      {/* Hero con mosaico de portadas */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-8 gap-1 opacity-35 scale-110">
          {[...allGames, ...allGames].slice(0, 16).map((game, i) => (
            <div key={i} className="relative h-full min-h-[300px]">
              <Image src={game.image} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-gray-900/80 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-red-950" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Videojuegos</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Videojuegos de<br />
            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">Spider-Man</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Desde los primeros arcades de 1982 hasta las obras maestras de Insomniac. Más de cuatro décadas balanceándose entre rascacielos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalGames} juegos</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalEras} eras</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">1982 – hoy</Badge>
          </div>

          {/* Filtros de era */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(eras).filter(([, e]) => e.games.length > 0).map(([key, era]) => (
              <a
                key={key}
                href={`#era-${key}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 bg-gradient-to-r ${era.accent} to-transparent ${era.border} text-white hover:scale-105`}
              >
                {era.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Banner noticia destacada */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 pt-12 mb-8">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 cursor-pointer">
              {/* Imagen de fondo */}
              <div className="relative aspect-[21/9] md:aspect-[3/1]">
                <Image
                  src={featuredPost.image ?? ''}
                  alt={featuredPost.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradientes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </div>

              {/* Contenido sobre la imagen */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Próximamente
                  </span>
                  <span className="text-gray-400 text-xs">{featuredPost.readTime} de lectura</span>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 max-w-3xl drop-shadow-lg">
                  {featuredPost.title}
                </h2>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl mb-5 hidden md:block">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors duration-200 group-hover:bg-blue-500">
                    Leer artículo
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                  <span className="text-gray-400 text-xs hidden md:block">Insomniac Games · PS5</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <InContentAd />
      </div>

      {/* Eras */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-20">
        {Object.entries(eras).map(([key, era]) => {
          if (era.games.length === 0) return null
          return (
            <section key={key} id={`era-${key}`} className="scroll-mt-24">
              {/* Cabecera de era */}
              <div className="flex items-end gap-4 mb-8 pb-4 border-b border-white/10">
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${era.accent} to-transparent`} />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{era.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{era.subtitle}</p>
                </div>
                <Badge className="ml-auto bg-white/5 border-white/10 text-gray-400 text-sm">
                  {era.games.length} juego{era.games.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Grid de portadas */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {era.games.map((game: Game) => (
                  <Link key={game.id} href={`/videojuegos/${game.slug}`} className="group">
                    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${era.glow} shadow-lg`}>
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={game.image}
                          alt={`${game.title} - Videojuego de Spider-Man`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Título siempre visible */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                          <h3 className="text-white text-xs font-bold line-clamp-2 leading-tight text-center drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                            {game.title}
                          </h3>
                        </div>

                        {/* Info en hover */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {game.developer && (
                            <p className="text-gray-300 text-xs text-center mb-2 line-clamp-1">{game.developer}</p>
                          )}
                          <div className="w-full flex items-center justify-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-2 rounded-lg">
                            <Gamepad2 className="w-3 h-3" />
                            Ver análisis
                          </div>
                        </div>

                        {/* Año */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-gray-300 text-xs">{game.year}</span>
                        </div>

                        {/* Rating badge */}
                        {game.rating && game.rating >= 8.5 && (
                          <div className="absolute top-2 right-2 bg-yellow-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-white fill-white" />
                            <span className="text-white text-xs font-semibold">{game.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

    </div>
  )
}