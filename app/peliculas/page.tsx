export const revalidate = 3600

import Image from "next/image"
import Link from "next/link"
import { Play, Star, Clock, Award } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { CountdownTimer } from "@/components/movies/CountdownTimer"
import { movieService } from "@/lib/database"
import { Movie } from "@prisma/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Películas de Spider-Man - Todas las Sagas | Spider-World",
  description:
    "Todas las películas de Spider-Man: Trilogía de Raimi, Amazing Spider-Man, MCU y Spider-Verse. Análisis completos, ratings y dónde verlas.",
  keywords: ["Spider-Man películas", "Tobey Maguire", "Andrew Garfield", "Tom Holland", "Spider-Verse", "Marvel", "Sony"],
  alternates: { canonical: '/peliculas' },
  openGraph: {
    title: "Películas de Spider-Man - Todas las Sagas | Spider-World",
    description: "Todas las películas de Spider-Man: Trilogía de Raimi, Amazing Spider-Man, MCU y Spider-Verse.",
    type: 'website',
    url: '/peliculas',
    images: ['https://image.tmdb.org/t/p/w500/xRMZikjAHNFebD1FLRqgDZeGV4a.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Películas de Spider-Man - Todas las Sagas | Spider-World",
    description: "Todas las películas de Spider-Man: Trilogía de Raimi, Amazing Spider-Man, MCU y Spider-Verse.",
    images: ['https://image.tmdb.org/t/p/w500/xRMZikjAHNFebD1FLRqgDZeGV4a.jpg'],
  },
}

const MILES_KEYWORDS = ['nuevo universo', 'cruzando el multiverso', 'beyond the spider-verse', 'into the spider-verse', 'across the spider-verse']
const AMAZING_KEYWORDS = ['amazing spider-man']
const MCU_KEYWORDS = ['homecoming', 'lejos de casa', 'no way home']
const RELATED_KEYWORDS = ['venom', 'morbius', 'kraven', 'madame web']
const RAIMI_YEARS = new Set([2002, 2004, 2007])

const UNIVERSE_CONFIG = {
  raimi:   { title: "Trilogía Sam Raimi",              subtitle: "Tobey Maguire · 2002–2007", accent: "from-red-600",    border: "border-red-500/40",    glow: "shadow-red-900/40" },
  amazing: { title: "The Amazing Spider-Man",           subtitle: "Andrew Garfield · 2012–2014", accent: "from-blue-600",  border: "border-blue-500/40",   glow: "shadow-blue-900/40" },
  mcu:     { title: "Marvel Cinematic Universe",        subtitle: "Tom Holland · 2017–presente", accent: "from-purple-600",border: "border-purple-500/40", glow: "shadow-purple-900/40" },
  miles:   { title: "Spider-Verse Animado",             subtitle: "Miles Morales · 2018–presente", accent: "from-green-600", border: "border-green-500/40",  glow: "shadow-green-900/40" },
  related: { title: "Universo Sony",                    subtitle: "Venom · Morbius · Kraven · 2018–2024", accent: "from-orange-600",border: "border-orange-500/40",glow: "shadow-orange-900/40" },
}

function organizeMoviesByUniverse(movies: Movie[]) {
  const universes = Object.fromEntries(
    Object.entries(UNIVERSE_CONFIG).map(([key, cfg]) => [key, { ...cfg, movies: [] as Movie[] }])
  ) as Record<string, typeof UNIVERSE_CONFIG[keyof typeof UNIVERSE_CONFIG] & { movies: Movie[] }>

  movies.forEach(movie => {
    const t = movie.title.toLowerCase()
    if (MILES_KEYWORDS.some(k => t.includes(k)))        universes.miles.movies.push(movie)
    else if (RELATED_KEYWORDS.some(k => t.includes(k))) universes.related.movies.push(movie)
    else if (MCU_KEYWORDS.some(k => t.includes(k)))     universes.mcu.movies.push(movie)
    else if (AMAZING_KEYWORDS.some(k => t.includes(k))) universes.amazing.movies.push(movie)
    else if (RAIMI_YEARS.has(movie.year))                universes.raimi.movies.push(movie)
    else                                                 universes.mcu.movies.push(movie)
  })

  Object.values(universes).forEach(u => u.movies.sort((a, b) => a.year - b.year))
  return universes
}

export default async function PeliculasPage() {
  const movies = await movieService.getAll()
  const universes = organizeMoviesByUniverse(movies)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Header con mosaico de pósters */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        {/* Mosaico de pósters como fondo */}
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-8 gap-1 opacity-50 scale-110">
          {[...movies, ...movies].slice(0, 16).map((movie, i) => (
            <div key={i} className="relative h-full min-h-[300px]">
              <Image
                src={movie.image}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-gray-900/80 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-red-950" />

        {/* Contenido */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Cine</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Películas de<br />
            <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Spider-Man</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Desde Sam Raimi hasta el Spider-Verse. Todas las sagas, todos los universos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{movies.length} películas</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{Object.values(universes).filter(u => u.movies.length > 0).length} universos</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">3 Spider-Man actores</Badge>
          </div>

          {/* Filtros por universo integrados en el hero */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(universes).filter(([, u]) => u.movies.length > 0).map(([key, universe]) => (
              <a
                key={key}
                href={`#universo-${key}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 bg-gradient-to-r ${universe.accent} to-transparent ${universe.border} text-white hover:scale-105`}
              >
                {universe.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Brand New Day */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="relative rounded-3xl overflow-hidden h-auto min-h-[360px] md:min-h-[380px] shadow-2xl shadow-red-900/40 mb-8">
          <Image
            src="/images/spiderman-brand-new-day-v0-31e6vv2f5rhf1.webp"
            alt="Spider-Man: Brand New Day"
            fill
            sizes="100vw"
            className="object-cover object-[center_65%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 max-w-2xl">
            <Badge className="bg-red-600 w-fit mb-4 text-xs tracking-widest uppercase">Próximamente</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
              Spider-Man:<br />Brand New Day
            </h2>
            <p className="text-gray-300 text-sm mb-2">
              Tom Holland regresa como Peter Parker en una nueva aventura donde nadie recuerda quién es.
            </p>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-1">Cuenta atrás para el estreno · 31 Jul 2026</p>
            <CountdownTimer />
            <Link
              href="/blog/spider-man-brand-new-day-trailer-oficial"
              className="mt-5 w-fit inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 border border-red-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/40"
            >
              <Play className="w-4 h-4 fill-white" />
              Ver análisis del tráiler
            </Link>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-4">
        <InContentAd />
      </div>

      {/* Universos */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-20">
        {Object.entries(universes).map(([key, universe]) => {
          if (universe.movies.length === 0) return null

          return (
            <section key={key} id={`universo-${key}`} className="scroll-mt-32">
              {/* Cabecera del universo */}
              <div className="flex items-end gap-4 mb-8 pb-4 border-b border-white/10">
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${universe.accent} to-transparent`} />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{universe.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{universe.subtitle}</p>
                </div>
                <Badge className="ml-auto bg-white/5 border-white/10 text-gray-400 text-sm">
                  {universe.movies.length} película{universe.movies.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Grid de pósters */}
              <div className={`grid gap-4 ${universe.movies.length <= 3 ? 'grid-cols-2 md:grid-cols-3 max-w-2xl' : universe.movies.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
                {universe.movies.map((movie: Movie) => (
                  <Link key={movie.id} href={`/peliculas/${movie.slug}`} className="group">
                    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${universe.glow} shadow-lg`}>
                      {/* Póster */}
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.image}
                          alt={`${movie.title} - Película de Spider-Man`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Gradiente permanente inferior */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Título siempre visible, se oculta en hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                          <h3 className="text-white text-base font-bold line-clamp-2 leading-tight text-center drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                            {movie.title}
                          </h3>
                        </div>

                        {/* Info extra en hover */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {movie.director && (
                            <div className="flex items-center gap-1 text-gray-300 text-xs mb-1">
                              <Award className="w-3 h-3" />
                              {movie.director}
                            </div>
                          )}
                          {movie.duration && (
                            <div className="flex items-center gap-1 text-gray-300 text-xs mb-2">
                              <Clock className="w-3 h-3" />
                              {movie.duration}
                            </div>
                          )}
                          <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 text-xs mt-1">
                            <Play className="w-3 h-3 mr-1" />
                            Ver análisis
                          </Button>
                        </div>

                        {/* Rating siempre visible */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs font-semibold">{movie.rating}</span>
                        </div>

                        {/* Año siempre visible */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-gray-300 text-xs">{movie.year}</span>
                        </div>
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