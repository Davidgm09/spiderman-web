export const revalidate = 3600

import Image from "next/image"
import Link from "next/link"
import { Play, Tv, Star } from "lucide-react"
import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { seriesService } from "@/lib/database"
import { Series } from "@prisma/client"

export const metadata: Metadata = {
  title: "Series de Spider-Man - Animadas y Live-Action | Spider-World",
  description:
    "Todas las series de Spider-Man desde 1967 hasta hoy. Series animadas clásicas, live-action y dónde verlas. Guía completa con fechas de estreno y análisis.",
  keywords: ["Spider-Man series", "series animadas Spider-Man", "The Spectacular Spider-Man", "Spider-Man 1994", "series Marvel"],
  alternates: { canonical: '/series' },
  openGraph: {
    title: "Series de Spider-Man - Animadas y Live-Action | Spider-World",
    description: "Todas las series de Spider-Man desde 1967 hasta hoy. Series animadas clásicas, live-action y dónde verlas.",
    type: 'website',
    url: '/series',
    images: ['https://image.tmdb.org/t/p/w500/957mnVq6w3xIZwhO1isb4RWPatr.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Series de Spider-Man - Animadas y Live-Action | Spider-World",
    description: "Todas las series de Spider-Man desde 1967 hasta hoy. Series animadas clásicas, live-action y dónde verlas.",
    images: ['https://image.tmdb.org/t/p/w500/957mnVq6w3xIZwhO1isb4RWPatr.jpg'],
  },
}

const ERA_CONFIG = {
  clasica:    { title: "Series Clásicas",      subtitle: "1967–1999 · Los primeros años en televisión", accent: "from-blue-600",   border: "border-blue-500/40",   glow: "shadow-blue-900/40" },
  moderna:    { title: "Era Moderna",           subtitle: "2000–2015 · Animación madura y narrativas más complejas", accent: "from-red-600",    border: "border-red-500/40",    glow: "shadow-red-900/40" },
  actual:     { title: "Era Actual",            subtitle: "2016–Presente · Las series más recientes",  accent: "from-purple-600", border: "border-purple-500/40", glow: "shadow-purple-900/40" },
  liveaction: { title: "Live-Action y Especiales", subtitle: "Series y especiales con actores reales", accent: "from-green-600",  border: "border-green-500/40",  glow: "shadow-green-900/40" },
}

function organizeSeriesByEra(series: Series[]) {
  const eras = Object.fromEntries(
    Object.entries(ERA_CONFIG).map(([key, cfg]) => [key, { ...cfg, series: [] as Series[] }])
  ) as Record<string, typeof ERA_CONFIG[keyof typeof ERA_CONFIG] & { series: Series[] }>

  series.forEach(serie => {
    const year = parseInt(serie.year, 10) || 0
    const title = serie.title.toLowerCase()

    if (title.includes('live') || title.includes('freshman') || title.includes('noir') || (year >= 1977 && year <= 1979)) {
      eras.liveaction.series.push(serie)
    } else if (year >= 1967 && year <= 1999) {
      eras.clasica.series.push(serie)
    } else if (year >= 2000 && year <= 2015) {
      eras.moderna.series.push(serie)
    } else {
      eras.actual.series.push(serie)
    }
  })

  Object.values(eras).forEach(era => {
    era.series.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10))
  })

  return eras
}

export default async function SeriesPage() {
  const allSeries = await seriesService.getAll()
  const eras = organizeSeriesByEra(allSeries)
  const featuredSerie = allSeries.find(s => s.slug === 'the-spectacular-spider-man-2008')
    ?? allSeries.find(s => s.rating >= 8)
    ?? allSeries[0]
  const featuredNew = allSeries.find(s => s.slug === 'tu-amigo-y-vecino-spider-man')

  const totalSeries = allSeries.length
  const totalEras = Object.values(eras).filter(e => e.series.length > 0).length
  const totalEpisodes = allSeries.reduce((t, s) => t + (s.episodes ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">

      {/* Hero con mosaico de posters */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-8 gap-1 opacity-35 scale-110">
          {[...allSeries, ...allSeries].slice(0, 16).map((serie, i) => (
            <div key={i} className="relative h-full min-h-[300px]">
              <Image src={serie.image} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-gray-900/80 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-red-950" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Series</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Series de<br />
            <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Spider-Man</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Desde las primeras series animadas de 1967 hasta las producciones más recientes. Más de cinco décadas en pantalla.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalSeries} series</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalEras} eras</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalEpisodes}+ episodios</Badge>
          </div>

          {/* Filtros de era */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(eras).filter(([, e]) => e.series.length > 0).map(([key, era]) => (
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

      {/* Banner serie destacada */}
      {featuredSerie && (
        <div className="max-w-7xl mx-auto px-4 pt-12 mb-8">
          <Link href={`/series/${featuredSerie.slug}`}>
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-950 to-red-950/40 border border-red-500/20 shadow-2xl shadow-black/60 hover:border-red-400/40 transition-all duration-300">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[140px] md:text-[220px] font-black text-white/10 select-none leading-none">
                {featuredSerie.year}
              </div>
              <div className="relative flex items-center gap-8 md:gap-12 px-8 md:px-12 py-8">
                <div className="relative shrink-0">
                  <Image
                    src={featuredSerie.image}
                    alt={featuredSerie.title}
                    width={140}
                    height={210}
                    className="relative rounded-2xl shadow-2xl shadow-black/60 group-hover:scale-105 transition-transform duration-500 w-28 md:w-40"
                  />
                </div>
                <div className="flex-1">
                  <Badge className="bg-red-600 text-white w-fit mb-4 text-xs tracking-widest uppercase">Serie Destacada</Badge>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">{featuredSerie.title}</h2>
                  <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-lg mb-4">
                    {featuredSerie.description?.substring(0, 180)}
                  </p>
                  <p className="text-red-400 text-sm font-semibold uppercase tracking-widest">
                    {featuredSerie.year}
                    {featuredSerie.seasons ? ` · ${featuredSerie.seasons} temporada${featuredSerie.seasons !== 1 ? 's' : ''}` : ''}
                    {featuredSerie.episodes ? ` · ${featuredSerie.episodes} episodios` : ''}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Banner serie nueva */}
      {featuredNew && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <Link href={`/series/${featuredNew.slug}`}>
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-l from-gray-950 to-blue-950/40 border border-blue-500/20 shadow-2xl shadow-black/60 hover:border-blue-400/40 transition-all duration-300">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[140px] md:text-[220px] font-black text-white/10 select-none leading-none">
                {featuredNew.year}
              </div>
              <div className="relative flex items-center gap-8 md:gap-12 px-8 md:px-12 py-8">
                <div className="relative shrink-0">
                  <Image
                    src={featuredNew.image}
                    alt={featuredNew.title}
                    width={140}
                    height={210}
                    className="relative rounded-2xl shadow-2xl shadow-black/60 group-hover:scale-105 transition-transform duration-500 w-28 md:w-40"
                  />
                </div>
                <div className="flex-1">
                  <Badge className="bg-blue-600 text-white w-fit mb-4 text-xs tracking-widest uppercase">Estreno 2025</Badge>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">{featuredNew.title}</h2>
                  <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-lg mb-4">
                    {featuredNew.description?.substring(0, 180)}
                  </p>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
                    {featuredNew.year}
                    {featuredNew.seasons ? ` · ${featuredNew.seasons} temporada${featuredNew.seasons !== 1 ? 's' : ''}` : ''}
                    {featuredNew.episodes ? ` · ${featuredNew.episodes} episodios` : ''}
                  </p>
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
          if (era.series.length === 0) return null
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
                  {era.series.length} serie{era.series.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Grid de posters */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {era.series.map((serie: Series) => (
                  <Link key={serie.id} href={`/series/${serie.slug}`} className="group">
                    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${era.glow} shadow-lg`}>
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={serie.image}
                          alt={`${serie.title} - Serie de Spider-Man`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Título siempre visible */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                          <h3 className="text-white text-xs font-bold line-clamp-2 leading-tight text-center drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                            {serie.title}
                          </h3>
                        </div>

                        {/* Info en hover */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {serie.seasons && (
                            <p className="text-gray-300 text-xs text-center mb-1">{serie.seasons} temp. · {serie.episodes} ep.</p>
                          )}
                          <div className="w-full flex items-center justify-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-2 rounded-lg">
                            <Play className="w-3 h-3" />
                            Ver detalles
                          </div>
                        </div>

                        {/* Año arriba */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-gray-300 text-xs">{serie.year}</span>
                        </div>

                        {/* Badge rating */}
                        {serie.rating && serie.rating >= 8 && (
                          <div className="absolute top-2 right-2 bg-yellow-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-white fill-white" />
                            <span className="text-white text-xs font-semibold">{serie.rating}</span>
                          </div>
                        )}

                        {/* Badge estado */}
                        {serie.status === 'En emisión' && (
                          <div className="absolute bottom-2 right-2">
                            <Tv className="w-4 h-4 text-green-400 drop-shadow-lg" />
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