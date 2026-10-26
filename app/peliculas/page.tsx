export const revalidate = 3600

import Image from "next/image"
import Link from "next/link"
import { Play, Star, Clock, Award, ChevronRight, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { CountdownTimer } from "@/components/movies/CountdownTimer"
import { blogService, movieService } from "@/lib/database"
import { tituloLatam } from "@/lib/latam-titles"
import { ADS_ENABLED } from "@/lib/config"
import { Movie } from "@prisma/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Todas las películas de Spider-Man por sagas | Sentido Arácnido",
  description:
    "Todas las películas de Spider-Man en orden: Tobey Maguire, Andrew Garfield, Tom Holland, el Spider-Verso y el universo de Sony, con su título en Latinoamérica.",
  keywords: ["películas de Spider-Man", "películas de Spiderman", "todas las películas de Spider-Man", "películas de El Hombre Araña", "Tobey Maguire", "Andrew Garfield", "Tom Holland", "Spider-Verse"],
  alternates: { canonical: '/peliculas' },
  openGraph: {
    title: "Todas las películas de Spider-Man por sagas | Sentido Arácnido",
    description: "Todas las películas de Spider-Man en orden: Tobey Maguire, Andrew Garfield, Tom Holland, el Spider-Verso y el universo de Sony.",
    type: 'website',
    url: '/peliculas',
    images: ['https://image.tmdb.org/t/p/w500/xRMZikjAHNFebD1FLRqgDZeGV4a.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Todas las películas de Spider-Man por sagas | Sentido Arácnido",
    description: "Todas las películas de Spider-Man en orden: Tobey Maguire, Andrew Garfield, Tom Holland, el Spider-Verso y el universo de Sony.",
    images: ['https://image.tmdb.org/t/p/w500/xRMZikjAHNFebD1FLRqgDZeGV4a.jpg'],
  },
}

const MILES_KEYWORDS = ['nuevo universo', 'cruzando el multiverso', 'beyond the spider-verse', 'into the spider-verse', 'across the spider-verse']
const AMAZING_KEYWORDS = ['amazing spider-man']
const MCU_KEYWORDS = ['homecoming', 'lejos de casa', 'no way home', 'brand new day']
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

  // Guía en texto del final: todas en orden, guías relacionadas y preguntas frecuentes
  const BADGE: Record<string, string> = {
    raimi: 'text-red-300 border-red-500/40 bg-red-500/10',
    amazing: 'text-blue-300 border-blue-500/40 bg-blue-500/10',
    mcu: 'text-purple-300 border-purple-500/40 bg-purple-500/10',
    miles: 'text-green-300 border-green-500/40 bg-green-500/10',
    related: 'text-orange-300 border-orange-500/40 bg-orange-500/10',
  }
  const PROTAGONISTA: Record<string, string> = {
    raimi: 'Tobey Maguire',
    amazing: 'Andrew Garfield',
    mcu: 'Tom Holland',
    miles: 'Animación · Miles Morales',
    related: 'Universo Sony · sin Spider-Man',
  }
  const sagaDe = new Map<string, string>()
  Object.entries(universes).forEach(([key, u]) => u.movies.forEach(m => sagaDe.set(m.slug, key)))
  const enOrden = [...movies].sort((a, b) => a.year - b.year || (a.releaseDate ?? '').localeCompare(b.releaseDate ?? ''))
  const deSpiderMan = enOrden.filter(m => sagaDe.get(m.slug) !== 'related').length
  const deSony = enOrden.length - deSpiderMan

  const GUIAS = [
    { slug: 'orden-ver-peliculas-spider-man', etiqueta: 'Guía', texto: 'Por estreno, por sagas y en cronología del MCU.' },
    { slug: 'tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man', etiqueta: 'Comparativa', texto: 'Tobey, Andrew o Tom: quién es el mejor Spider-Man.' },
    { slug: 'spider-man-brand-new-day-streaming-donde-ver', etiqueta: 'Dónde ver', texto: 'Dónde ver Brand New Day (Un nuevo día) en España y Latinoamérica.' },
    { slug: 'villanos-spider-man-peliculas-ranking', etiqueta: 'Ranking', texto: 'Los villanos del cine de Spider-Man, del peor al mejor.' },
  ]
  const guias = (await Promise.all(GUIAS.map(async g => {
    const post = await blogService.getBySlug(g.slug).catch(() => null)
    return post ? { ...g, title: post.title, image: post.image } : null
  }))).filter((g): g is NonNullable<typeof g> => g !== null)

  const ultima = enOrden.filter(m => sagaDe.get(m.slug) !== 'related').at(-1)
  const faqs = [
    {
      q: '¿Cuántas películas de Spider-Man hay?',
      a: `${deSpiderMan} películas protagonizadas por Spider-Man: tres de Tobey Maguire, dos de Andrew Garfield, las de Tom Holland y las del Spider-Verso animado. Además, el universo de Sony tiene ${deSony} películas de personajes de su mundo, como Venom, pero sin Spider-Man.`,
    },
    {
      q: '¿Cuál es la última película de Spider-Man?',
      a: ultima
        ? `${ultima.title} (${ultima.year})${tituloLatam(ultima.slug) ? `, que en Latinoamérica se titula «${tituloLatam(ultima.slug)!.titulo}»` : ''}. La próxima es Spider-Man: Beyond the Spider-Verse, que cerrará la trilogía animada de Miles Morales en junio de 2027.`
        : 'La próxima es Spider-Man: Beyond the Spider-Verse, en junio de 2027.',
    },
    {
      q: '¿En qué orden ver las películas de Spider-Man?',
      a: 'Lo más cómodo es verlas saga a saga: primero la trilogía de Sam Raimi, después las dos de Andrew Garfield y luego las de Tom Holland, que conviene ver antes de No Way Home. El Spider-Verso se puede ver en cualquier momento. Lo explicamos paso a paso en nuestra guía del orden de las películas.',
    },
    {
      q: '¿Cuál es la mejor película de Spider-Man?',
      a: 'Para nosotros, Spider-Man 2 (2004), con Alfred Molina como Doctor Octopus, y Spider-Man: Un nuevo universo (2018), que ganó el Óscar a la mejor película de animación.',
    },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

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
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Sentido Arácnido · Cine</p>
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
            <Badge className="bg-red-600 w-fit mb-4 text-xs tracking-widest uppercase">Último estreno</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
              Spider-Man:<br />Brand New Day
            </h2>
            <p className="text-gray-300 text-sm mb-2">
              Tom Holland regresa como Peter Parker en una nueva aventura donde nadie recuerda quién es.
            </p>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-1">Estrenada en julio de 2026 · La más taquillera de Spider-Man</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/peliculas/spider-man-brand-new-day-2026"
                className="w-fit inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 border border-red-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/40"
              >
                <Play className="w-4 h-4 fill-white" />
                Ver la película
              </Link>
              <Link
                href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers"
                className="w-fit inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all duration-200"
              >
                Taquilla y críticas
              </Link>
            </div>
          </div>
        </div>

        {/* Próximo estreno: Beyond the Spider-Verse */}
        <div className="relative rounded-3xl overflow-hidden min-h-[300px] shadow-2xl shadow-purple-900/40 mb-8">
          <Image
            src="https://image.tmdb.org/t/p/w1280/7tT2w75p69nll5PvALpWFCYx5dU.jpg"
            alt="Spider-Man: Beyond the Spider-Verse"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 max-w-2xl">
            <Badge className="bg-purple-600 w-fit mb-4 text-xs tracking-widest uppercase">Próximo estreno</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
              Spider-Man:<br />Beyond the Spider-Verse
            </h2>
            <p className="text-gray-300 text-sm mb-2">
              El cierre de la trilogía animada de Miles Morales.
            </p>
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-1">Estreno en EE. UU. · 18 Jun 2027</p>
            <CountdownTimer releaseDate="2027-06-18T00:00:00" />
          </div>
        </div>
      </div>


      {ADS_ENABLED && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <InContentAd />
        </div>
      )}

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

      {/* Guía en texto: todas las películas en orden, guías relacionadas y preguntas frecuentes */}
      <section className="max-w-5xl mx-auto px-4 pb-24 text-gray-300">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="flex items-center gap-4 mb-3">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-500 to-blue-500" />
          <h2 className="text-2xl md:text-4xl font-bold text-white">Todas las películas de Spider-Man en orden</h2>
        </div>
        <p className="mb-8 text-gray-400 md:ml-5">
          Por orden de estreno, con la saga a la que pertenece cada una y su título en Latinoamérica cuando es distinto.
          ¿No sabes por dónde empezar? Tienes{' '}
          <Link href="/blog/orden-ver-peliculas-spider-man" className="text-red-400 hover:text-red-300 underline">nuestra guía del orden para verlas</Link>.
        </p>

        <ol className="grid md:grid-cols-2 gap-3 mb-16">
          {enOrden.map((movie, i) => {
            const saga = sagaDe.get(movie.slug) ?? 'mcu'
            const latam = tituloLatam(movie.slug)
            return (
              <li key={movie.id}>
                <Link
                  href={`/peliculas/${movie.slug}`}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-colors"
                >
                  <span className="w-7 text-center font-black text-xl text-gray-500 group-hover:text-red-400 transition-colors">{i + 1}</span>
                  <div className="relative w-12 h-[72px] shrink-0 rounded-md overflow-hidden bg-gray-800">
                    <Image src={movie.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white leading-snug group-hover:text-red-300 transition-colors">{movie.title}</p>
                    {latam && <p className="text-xs text-gray-400 mt-0.5">En Latinoamérica: {latam.titulo}</p>}
                    <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
                    <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${BADGE[saga]}`}>{PROTAGONISTA[saga]}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-red-400 shrink-0 transition-colors" />
                </Link>
              </li>
            )
          })}
        </ol>

        {guias.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-500 to-blue-500" />
              <h2 className="text-2xl md:text-4xl font-bold text-white">Guías y análisis</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {guias.map(g => (
                <Link
                  key={g.slug}
                  href={`/blog/${g.slug}`}
                  className="group flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-red-500/50 transition-colors"
                >
                  <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                    {g.image && <Image src={g.image} alt="" fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-red-400">{g.etiqueta}</span>
                    <span className="font-bold text-white mt-1 leading-snug line-clamp-2">{g.title}</span>
                    <span className="text-sm text-gray-400 mt-1">{g.texto}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-500 to-blue-500" />
          <h2 className="text-2xl md:text-4xl font-bold text-white">Preguntas frecuentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-xl bg-white/5 border border-white/10 open:border-red-500/40">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg font-semibold text-white">{f.q}</h3>
                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 -mt-1 text-gray-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  )
}