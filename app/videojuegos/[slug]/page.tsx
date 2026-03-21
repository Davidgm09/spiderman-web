import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Play, ShoppingCart, User, Monitor, ArrowLeft, Award, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { gameService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import { generateAmazonUrl, convertToEmbedUrl, parseJson } from "@/lib/content-helpers"
import { Breadcrumb } from "@/components/breadcrumb"
import type { GalleryImage, ConceptArtItem, CharacterImage } from "@/lib/json-types"
import { gameAnalysis } from "@/lib/editorial-analysis"

export const revalidate = 3600

export async function generateStaticParams() {
  const games = await gameService.getAll()
  return games.map((g) => ({ slug: g.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = await gameService.getBySlug(slug).catch(() => null)

  if (!game) {
    return {
      title: "Videojuego no encontrado | Spider-World",
      description: "El videojuego que buscas no está disponible.",
    }
  }

  const description = game.description
    ? game.description.substring(0, 155) + '...'
    : `Descubre ${game.title}, videojuego de Spider-Man con análisis completo, gameplay y dónde comprarlo.`

  const url = `${SITE_URL}/videojuegos/${game.slug}`

  return {
    title: `${game.title} (${game.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: game.keywords?.length ? game.keywords : ['Spider-Man', 'videojuego', game.title, game.year.toString(), 'análisis', 'gameplay'],
    alternates: { canonical: url },
    openGraph: {
      title: `${game.title} (${game.year}) - Análisis Completo | Spider-World`,
      description,
      images: [game.image],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} (${game.year}) - Análisis Completo | Spider-World`,
      description,
      images: [game.image],
    },
  }
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params
  const game = await gameService.getBySlug(slug).catch(() => null)

  if (!game) notFound()

  gameService.incrementViews(slug).catch(() => {})

  const relatedGames = await gameService.getFeatured(4, slug).catch(() => [])

  const platformStr = Array.isArray(game.platform) ? game.platform.join(', ') : game.platform ?? ''
  const platformFirst = Array.isArray(game.platform) ? game.platform[0] : game.platform ?? 'PS5'

  const screenshotImages = parseJson<GalleryImage>(game.screenshotImages)
  const characterImages = parseJson<CharacterImage>(game.characterImages)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.seoDescription || game.description,
    image: game.image ? { '@type': 'ImageObject', url: game.image, width: 300, height: 450 } : undefined,
    url: `${SITE_URL}/videojuegos/${game.slug}`,
    datePublished: game.year?.toString(),
    genre: game.genre,
    gamePlatform: game.platform,
    author: { '@type': 'Organization', name: game.developer },
    aggregateRating: game.rating ? {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: Math.max(game.views || 0, 50),
    } : undefined,
    inLanguage: 'es',
  }

  return (
    <div className="pt-16 bg-gradient-to-b from-black via-gray-950 to-black" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 10% 50%, rgba(0,80,220,0.12) 0%, transparent 70%), radial-gradient(ellipse 70% 40% at 90% 70%, rgba(0,80,220,0.18) 0%, transparent 70%)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={game.image} alt="" fill sizes="100vw" className="object-cover scale-110 blur-sm opacity-30" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center">

            {/* Columna izquierda */}
            <div>
              <Breadcrumb items={[{ label: "Videojuegos", href: "/videojuegos" }, { label: game.title }]} />

              <div className="flex items-center gap-3 mt-6 mb-4">
                <Badge className="bg-blue-600 text-white text-xs tracking-widest uppercase px-3 py-1">
                  {game.rating >= 9 ? 'Juego Esencial' : 'Spider-Man Game'}
                </Badge>
                <span className="text-gray-500 text-sm">{game.year}</span>
                {platformFirst && <span className="text-gray-500 text-sm">· {platformFirst}</span>}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {game.title}
              </h1>

              {game.subtitle && (
                <p className="text-lg text-gray-400 italic mb-4">"{game.subtitle}"</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(game.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-yellow-400 font-bold ml-1">{game.rating}</span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>

              {game.description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                  {(() => {
                    const firstDot = game.description.indexOf('. ')
                    return firstDot > 0 && firstDot < 300
                      ? game.description.substring(0, firstDot + 1)
                      : game.description.length > 250
                        ? game.description.substring(0, 250) + '…'
                        : game.description
                  })()}
                </p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {game.developer && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {game.developer}
                  </div>
                )}
                {platformStr && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Monitor className="w-3.5 h-3.5 text-gray-400" />
                    {platformStr}
                  </div>
                )}
                {game.genre && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Award className="w-3.5 h-3.5 text-gray-400" />
                    {game.genre}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                {game.playUrl && (
                  <a
                    href="#trailer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-900/40"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Ver tráiler
                  </a>
                )}
                <a
                  href={generateAmazonUrl(`${game.title} ${platformFirst} videojuego`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar en Amazon
                </a>
                <Link href="/videojuegos" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-full transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Link>
              </div>
            </div>

            {/* Columna derecha: portada */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/10 blur-2xl rounded-3xl" />
                <Image
                  src={game.image}
                  alt={`${game.title} - Portada oficial`}
                  width={320}
                  height={480}
                  className="relative rounded-2xl shadow-2xl w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <InContentAd />

      {/* Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Contenido principal */}
            <div className="lg:col-span-3">

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-white/10">
                {[
                  { label: "Año", value: game.year },
                  game.developer ? { label: "Desarrollador", value: game.developer } : null,
                  game.publisher ? { label: "Publisher", value: game.publisher } : null,
                  game.rating ? { label: "Puntuación", value: `${game.rating}/10` } : null,
                  game.genre ? { label: "Género", value: game.genre } : null,
                ].filter(Boolean).map((item, i, arr) => (
                  <div key={item!.label} className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-bold text-white">{item!.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{item!.label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Sinopsis */}
              {game.description && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <h3 className="text-2xl font-bold text-white">Sinopsis</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{game.description}</p>
                </div>
              )}

              {/* Trailer */}
              {game.playUrl && (
                <div id="trailer" className="mt-10 scroll-mt-24 bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <h3 className="text-2xl font-bold text-white">Tráiler Oficial</h3>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    <iframe
                      src={convertToEmbedUrl(game.playUrl)}
                      title={`Tráiler de ${game.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Análisis Editorial */}
              <div className="mt-10 bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                  <h3 className="text-2xl font-bold text-white">Análisis Editorial</h3>
                  <Award className="w-5 h-5 text-blue-400 ml-auto" />
                </div>
                {(() => {
                  const data = gameAnalysis[game.slug] ?? {
                    propuesta: `${game.title} ofrece una experiencia de juego centrada en el universo de Spider-Man, desarrollada por ${game.developer} con las herramientas y tecnología disponibles en ${game.year}.`,
                    recepcion: `El juego encontró su público entre los fans del trepamuros y contribuyó al catálogo de adaptaciones del personaje en el mundo de los videojuegos.`,
                    legado: `Como parte de la historia de Spider-Man en videojuegos, ${game.title} ocupa su lugar en la evolución de un personaje que lleva décadas siendo uno de los más adaptados al medio interactivo.`,
                  }
                  return (
                    <div className="space-y-8">
                      {[
                        { num: "01", title: "Propuesta Jugable",         text: data.propuesta, color: "text-green-500" },
                        { num: "02", title: "Recepción y Repercusión",   text: data.recepcion, color: "text-blue-500" },
                        { num: "03", title: "Legado en el Spider-Verse", text: data.legado,    color: "text-purple-500" },
                      ].map(({ num, title, text, color }) => (
                        <div key={num} className="flex gap-6 items-start">
                          <span className={`text-5xl font-black leading-none ${color} opacity-25 select-none shrink-0 w-14 text-right`}>{num}</span>
                          <div>
                            <h4 className={`text-lg font-bold ${color} mb-2`}>{title}</h4>
                            <p className="text-gray-300 leading-relaxed">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>

              {/* Galería de capturas */}
              {screenshotImages.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <h3 className="text-2xl font-bold text-white">Galería de Capturas</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {screenshotImages.map((shot, i) => (
                      <div key={i} className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                        <div className="relative w-full aspect-video">
                          <Image src={shot.url} alt={shot.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <p className="text-white text-xs font-medium line-clamp-1">{shot.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personajes */}
              {characterImages.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <h3 className="text-2xl font-bold text-white">Personajes Principales</h3>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {characterImages.slice(0, 12).map((char, i) => (
                      <div key={i} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={char.image || '/placeholder-user.jpg'}
                            alt={char.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 16vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white font-semibold text-xs leading-tight">{char.name}</p>
                            <p className="text-blue-400 text-xs mt-0.5">{char.role || 'Personaje'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Arte conceptual */}
              {game.conceptArt && Array.isArray(game.conceptArt) && game.conceptArt.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <h3 className="text-2xl font-bold text-white">Arte Conceptual</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {parseJson<ConceptArtItem>(game.conceptArt).map((art, i) => (
                      <div key={i} className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                        <div className="relative w-full aspect-video">
                          <Image src={art.url} alt={art.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <p className="text-white text-xs font-medium line-clamp-1">{art.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="bg-gray-950/60 border border-white/5 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Comprar en Amazon</h3>
                  {[
                    { label: `${game.title} — ${platformFirst}`,     query: `${game.title} ${platformFirst} game`,          icon: "🎮" },
                    { label: `Edición Coleccionista`,                 query: `${game.title} collector edition`,              icon: "🏆" },
                    { label: `Funko Pop Spider-Man`,                  query: `funko pop spider-man gaming`,                  icon: "🕷️" },
                  ].map(({ label, query, icon }) => (
                    <a
                      key={label}
                      href={generateAmazonUrl(query)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 group"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{label}</span>
                      <ShoppingCart className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Juegos relacionados */}
      {relatedGames.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-blue-950/10 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
              <h2 className="text-2xl font-bold text-white">Más videojuegos de Spider-Man</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedGames.map((item) => (
                <Link key={item.id} href={`/videojuegos/${item.slug}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="relative aspect-[3/4]">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-white text-sm font-bold line-clamp-2 text-center leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                          {item.title}
                        </h3>
                      </div>
                      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full flex items-center justify-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-2 rounded-lg">
                          <Play className="w-3 h-3" />
                          Ver análisis
                        </div>
                      </div>
                      {item.rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs font-semibold">{item.rating}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-gray-300 text-xs">{item.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}