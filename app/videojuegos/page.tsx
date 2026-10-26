export const revalidate = 3600

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Gamepad2, Star, ChevronRight, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { gameService, blogService } from "@/lib/database"
import { Game } from "@prisma/client"

export const metadata: Metadata = {
  title: "Todos los videojuegos de Spider-Man | Sentido Arácnido",
  description:
    "Todos los videojuegos de Spider-Man en orden, de los clásicos a PS5 y PC: cuál es el mejor, por cuál empezar y en qué orden jugar los de Insomniac.",
  keywords: ["juegos de Spider-Man", "videojuegos de Spiderman", "Spider-Man videojuegos", "Marvel's Spider-Man", "Spider-Man PS4", "Spider-Man PS5", "Insomniac Games", "videojuegos Marvel"],
  alternates: { canonical: '/videojuegos' },
  openGraph: {
    title: "Todos los videojuegos de Spider-Man | Sentido Arácnido",
    description: "Todos los videojuegos de Spider-Man: desde clásicos arcade hasta PS5. Reseñas completas, gameplay y plataformas.",
    type: 'website',
    url: '/videojuegos',
    images: ['https://media.rawg.io/media/games/5f1/5f1399f755ed3a40b04a9195f4c06be5.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Todos los videojuegos de Spider-Man | Sentido Arácnido",
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

  // Guía en texto del final: todos en orden, por cuál empezar y preguntas frecuentes
  const BADGE: Record<string, string> = {
    clasica: 'text-blue-300 border-blue-500/40 bg-blue-500/10',
    moderna: 'text-red-300 border-red-500/40 bg-red-500/10',
    dorada: 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10',
    insomniac: 'text-green-300 border-green-500/40 bg-green-500/10',
  }
  const eraDe = new Map<string, { title: string; badge: string }>()
  Object.entries(eras).forEach(([key, era]) => era.games.forEach(g => eraDe.set(g.slug, { title: era.title, badge: BADGE[key] })))
  const enOrden = [...allGames].sort((a, b) => a.year - b.year)
  const bySlug = new Map(allGames.map(g => [g.slug, g]))
  const plataformas = (g: Game) => (Array.isArray(g.platform) ? g.platform : []).slice(0, 3).join(', ')

  const recomendaciones = [
    { slug: 'marvel-s-spider-man-remastered-2020', etiqueta: 'Para empezar', titulo: "Marvel's Spider-Man", texto: 'El juego que redefinió a Spider-Man en los videojuegos. En PS4 y, remasterizado, en PS5 y PC.', enlace: '/blog/marvels-spider-man-ps4-2018-analisis-insomniac', enlaceTexto: 'Leer el análisis' },
    { slug: 'marvel-s-spider-man-miles-morales-2020', etiqueta: 'Corto e intenso', titulo: "Marvel's Spider-Man: Miles Morales", texto: 'Una aventura más breve, perfecta entre el primero y el segundo.', enlace: '/blog/spider-man-miles-morales-ps5-analisis', enlaceTexto: 'Leer el análisis' },
    { slug: 'marvel-s-spider-man-2-2023', etiqueta: 'El más reciente', titulo: "Marvel's Spider-Man 2", texto: 'Peter y Miles juntos contra Kraven y Venom. En PS5 y PC.', enlace: '/blog/marvels-spider-man-2-ps5-analisis', enlaceTexto: 'Leer el análisis' },
    { slug: 'spider-man-web-of-shadows-2008', etiqueta: 'Un clásico olvidado', titulo: 'Spider-Man: Web of Shadows', texto: 'Mundo abierto, el simbionte y decisiones morales, mucho antes de Insomniac.', enlace: '/blog/spider-man-web-of-shadows-analisis-juego-olvidado', enlaceTexto: 'Leer el análisis' },
  ].map(r => ({ ...r, juego: bySlug.get(r.slug) }))

  const faqs = [
    {
      q: '¿Cuál es el mejor juego de Spider-Man?',
      a: "Para la mayoría, Marvel's Spider-Man (2018) de Insomniac y su secuela, Marvel's Spider-Man 2 (2023). Entre los clásicos, Spider-Man 2 (2004) cambió para siempre la forma de balancearse por la ciudad. Los ordenamos todos en nuestro ranking de los mejores juegos de Spider-Man.",
    },
    {
      q: '¿En qué orden jugar los juegos de Spider-Man de Insomniac?',
      a: "Primero Marvel's Spider-Man (2018) o su versión Remastered, después Marvel's Spider-Man: Miles Morales (2020) y por último Marvel's Spider-Man 2 (2023).",
    },
    {
      q: '¿Qué juegos de Spider-Man hay para PC?',
      a: "Los tres de Insomniac: Marvel's Spider-Man Remastered, Miles Morales y Marvel's Spider-Man 2, que llegó a PC en enero de 2025. También salieron en PC clásicos como Spider-Man (2000), Spider-Man 2 (2004) o Web of Shadows, aunque hoy son difíciles de conseguir.",
    },
    {
      q: "¿Habrá un Marvel's Spider-Man 3?",
      a: 'Todo apunta a que es el siguiente proyecto de Insomniac después de Marvel\'s Wolverine. Te contamos todo lo que se sabe en nuestro artículo sobre Marvel\'s Spider-Man 3.',
    },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

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
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Sentido Arácnido · Videojuegos</p>
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

      {/* Guía en texto: todos los juegos en orden, por cuál empezar y preguntas frecuentes */}
      <section className="max-w-7xl mx-auto px-4 pb-24 text-gray-300">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="flex items-center gap-4 mb-3">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-blue-500 to-red-500" />
          <h2 className="text-2xl md:text-4xl font-bold text-white">Todos los juegos de Spider-Man en orden</h2>
        </div>
        <p className="mb-8 text-gray-400 md:ml-5">
          Por orden de lanzamiento, con su estudio y sus plataformas. Si buscas los mejores, tienes{' '}
          <Link href="/blog/mejores-juegos-spider-man-ranking" className="text-red-400 hover:text-red-300 underline">nuestro ranking de los 10 mejores juegos de Spider-Man</Link>.
        </p>

        <ol className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-16">
          {enOrden.map((game, i) => {
            const era = eraDe.get(game.slug)
            return (
              <li key={game.id}>
                <Link
                  href={`/videojuegos/${game.slug}`}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-colors"
                >
                  <span className="w-7 text-center font-black text-xl text-gray-500 group-hover:text-red-400 transition-colors">{i + 1}</span>
                  <div className="relative w-20 h-[52px] shrink-0 rounded-md overflow-hidden bg-gray-800">
                    <Image src={game.image} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white leading-snug group-hover:text-red-300 transition-colors">{game.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {game.year}{game.developer ? ` · ${game.developer}` : ''}
                    </p>
                    {plataformas(game) && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{plataformas(game)}</p>}
                    {era && (
                      <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${era.badge}`}>{era.title}</span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-red-400 shrink-0 transition-colors" />
                </Link>
              </li>
            )
          })}
        </ol>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-blue-500 to-red-500" />
          <h2 className="text-2xl md:text-4xl font-bold text-white">¿Por cuál empezar?</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {recomendaciones.map(r => (
            <Link
              key={r.slug}
              href={r.enlace}
              className="group flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-red-500/50 transition-colors"
            >
              <div className="relative w-28 h-[84px] shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                {r.juego && <Image src={r.juego.image} alt={r.juego.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">{r.etiqueta}</span>
                <span className="text-lg font-bold text-white mt-1 leading-snug">{r.titulo}</span>
                <span className="text-sm text-gray-400 mt-1">{r.texto}</span>
                <span className="mt-auto pt-2 text-sm font-semibold text-red-400 group-hover:text-red-300 inline-flex items-center gap-1">
                  {r.enlaceTexto} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-16 text-sm">
          <span className="text-gray-400 mr-1">Más:</span>
          {[
            ['/blog/mejores-juegos-spider-man-ranking', 'Los 10 mejores juegos de Spider-Man'],
            ['/blog/marvels-spider-man-3-insomniac-todo-lo-que-sabemos', "Todo sobre Marvel's Spider-Man 3"],
            ['/juegos', 'Nuestros minijuegos: Arañadle y más'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:border-red-500/50 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-blue-500 to-red-500" />
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