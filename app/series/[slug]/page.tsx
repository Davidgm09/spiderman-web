import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Play, ShoppingCart, Users, Tv, ArrowLeft, Award, Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { seriesService } from "@/lib/database"
import { SITE_URL, AMAZON_TAG } from "@/lib/config"
import { generateAmazonUrl, parseJson } from "@/lib/content-helpers"
import type { CastMember, EpisodeImage } from "@/lib/json-types"
import { SeriesGallery } from "@/components/series/SeriesGallery"
import { seriesAnalysis } from "@/lib/editorial-analysis"
import { Breadcrumb } from "@/components/breadcrumb"
import { AmazonProductCard } from "@/components/affiliate/AmazonProductCard"
import { TiendaProductCards } from "@/components/affiliate/TiendaProductCards"
import { StickyAffiliateSidebar } from "@/components/affiliate/StickyAffiliateSidebar"

export const revalidate = 3600

export async function generateStaticParams() {
  const series = await seriesService.getAll()
  return series.map((s) => ({ slug: s.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = await seriesService.getBySlug(slug).catch(() => null)

  if (!series) {
    return {
      title: "Serie no encontrada | Spider-World",
      description: "La serie que buscas no está disponible.",
    }
  }

  const description = series.description
    ? series.description.substring(0, 155) + '...'
    : `Descubre ${series.title}, serie de Spider-Man con análisis completo, episodios y dónde verla.`

  const url = `${SITE_URL}/series/${series.slug}`

  return {
    title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: series.keywords?.length ? series.keywords : ['Spider-Man', 'serie animada', series.title, series.year.toString(), 'análisis', 'episodios'],
    alternates: { canonical: url },
    openGraph: {
      title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
      description,
      images: [series.image],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
      description,
      images: [series.image],
    },
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params
  const series = await seriesService.getBySlug(slug).catch(() => null)

  if (!series) notFound()

  seriesService.incrementViews(slug).catch(() => {})

  const relatedSeries = await seriesService.getFeatured(4, slug).catch(() => [])

  const castData: CastMember[] = parseJson<CastMember>(series.castPhotos)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: series.title,
    description: series.seoDescription || series.description,
    image: series.image ? { '@type': 'ImageObject', url: series.image, width: 300, height: 450 } : undefined,
    url: `${SITE_URL}/series/${series.slug}`,
    startDate: series.firstAirDate || series.year?.toString(),
    numberOfSeasons: series.seasons || undefined,
    numberOfEpisodes: series.episodes || undefined,
    genre: series.genre,
    aggregateRating: series.rating ? {
      '@type': 'AggregateRating',
      ratingValue: series.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: Math.max(series.views || 0, 50),
    } : undefined,
    inLanguage: 'es',
  }

  return (
    <div className="pt-16 bg-gradient-to-b from-black via-gray-950 to-black" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 10% 50%, rgba(180,0,0,0.15) 0%, transparent 70%), radial-gradient(ellipse 70% 40% at 90% 70%, rgba(80,0,180,0.18) 0%, transparent 70%)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={series.image} alt="" fill sizes="100vw" className="object-cover scale-110 blur-sm opacity-30" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center">

            {/* Columna izquierda */}
            <div>
              <Breadcrumb items={[{ label: "Series", href: "/series" }, { label: series.title }]} />

              <div className="flex items-center gap-3 mt-6 mb-4">
                <Badge className="bg-red-600 text-white text-xs tracking-widest uppercase px-3 py-1">
                  {series.rating >= 8 ? 'Serie Esencial' : 'Serie Spider-Man'}
                </Badge>
                <span className="text-gray-500 text-sm">{series.year}</span>
                {series.status && (
                  <span className={`text-sm font-medium ${series.status === 'En emisión' ? 'text-green-400' : 'text-gray-500'}`}>
                    · {series.status}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {series.title}
              </h1>

              {series.subtitle && (
                <p className="text-lg text-gray-400 italic mb-4">"{series.subtitle}"</p>
              )}

              {/* Rating estrellas */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(series.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-yellow-400 font-bold ml-1">{series.rating}</span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>

              {series.description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                  {(() => {
                    const firstDot = series.description.indexOf('. ')
                    return firstDot > 0 && firstDot < 300
                      ? series.description.substring(0, firstDot + 1)
                      : series.description.length > 250
                        ? series.description.substring(0, 250) + '…'
                        : series.description
                  })()}
                </p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {series.creators && series.creators.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {series.creators[0]}
                  </div>
                )}
                {series.network && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Tv className="w-3.5 h-3.5 text-gray-400" />
                    {series.network}
                  </div>
                )}
                {series.episodes && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {series.episodes} episodios
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                {series.trailerUrl && (
                  <a
                    href="#trailer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/40"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Ver tráiler
                  </a>
                )}
                <a
                  href={series.amazonLink ?? generateAmazonUrl(`${series.title} DVD Spider-Man`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar en Amazon
                </a>
                <Link href="/series" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-full transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Link>
              </div>
            </div>

            {/* Columna derecha: poster */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-600/15 blur-2xl rounded-3xl" />
                <Image
                  src={series.image}
                  alt={`${series.title} - Poster oficial`}
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
                  { label: "Año", value: series.year },
                  series.seasons ? { label: "Temporadas", value: series.seasons } : null,
                  series.episodes ? { label: "Episodios", value: series.episodes } : null,
                  series.rating ? { label: "Puntuación", value: `${series.rating}/10` } : null,
                  series.network ? { label: "Canal", value: series.network } : null,
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
              {series.description && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Sinopsis</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{series.description}</p>
                </div>
              )}

              {/* Trailer */}
              {series.trailerUrl && (
                <div id="trailer" className="mt-10 scroll-mt-24 bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Tráiler Oficial</h3>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    <iframe
                      src={series.trailerUrl.replace('watch?v=', 'embed/')}
                      title={`Tráiler de ${series.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Análisis Editorial */}
              <div className="mt-10 bg-gradient-to-br from-gray-900/80 to-red-950/20 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                  <h3 className="text-2xl font-bold text-white">Análisis Editorial</h3>
                  <Award className="w-5 h-5 text-red-400 ml-auto" />
                </div>
                {(() => {
                  const data = seriesAnalysis[series.slug] ?? {
                    contexto: `${series.title} se inscribe en la larga tradición de adaptaciones televisivas del universo de Spider-Man, aportando su propia visión del personaje para una nueva generación de espectadores.`,
                    recepcion: `La serie encontró su público entre los fans del trepamuros y generó debate sobre la dirección creativa de las adaptaciones animadas del universo arácnido.`,
                    legado: `Como parte del catálogo animado de Spider-Man, ${series.title} ocupa su lugar en la historia de un personaje que lleva décadas siendo uno de los más adaptados de la cultura popular.`,
                  }
                  return (
                    <div className="space-y-8">
                      {[
                        { num: "01", title: "Contexto y Propuesta",       text: data.contexto,   color: "text-red-500" },
                        { num: "02", title: "Recepción y Repercusión",     text: data.recepcion,  color: "text-blue-500" },
                        { num: "03", title: "Legado en el Spider-Verse",   text: data.legado,     color: "text-purple-500" },
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

              {/* Galería de escenas (TMDB) */}
              <div className="mt-10">
                <SeriesGallery
                  tmdbId={series.tmdbId ?? null}
                  seriesImage={series.image}
                  seriesTitle={series.title}
                  logoImage={series.logo ?? null}
                />
              </div>

              {/* Episodios destacados */}
              {series.episodeImages && Array.isArray(series.episodeImages) && series.episodeImages.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Episodios Destacados</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {parseJson<EpisodeImage>(series.episodeImages).map((ep, i) => (
                      <div key={i} className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                        <div className="relative w-full aspect-video">
                          <Image src={ep.url} alt={ep.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-600/90 text-white text-xs">{ep.episode}</Badge>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <p className="text-white text-xs font-medium line-clamp-1">{ep.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reparto y Voces */}
              {castData.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Reparto y Voces</h3>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {castData.slice(0, 12).map((actor, i) => (
                      <div key={i} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={actor.image || actor.photo || '/placeholder-user.jpg'}
                            alt={actor.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 16vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white font-semibold text-xs leading-tight">{actor.name}</p>
                            <p className="text-red-400 text-xs mt-0.5">{actor.character}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <SidebarAd />
              <AmazonProductCard
                title={`${series.title} — Serie Completa`}
                image={series.image}
                href={series.amazonLink ?? generateAmazonUrl(`${series.title} complete series DVD blu-ray`)}
                badge="DVD / Blu-ray"
                asin={series.amazonLink ? (series.amazonLink.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? undefined) : undefined}
              />
              <TiendaProductCards categories={["Figuras", "Coleccionables", "Juguetes"]} limit={2} />
            </div>

          </div>
        </div>
      </section>

      {/* Series relacionadas */}
      {relatedSeries.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-red-950/10 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
              <h2 className="text-2xl font-bold text-white">Más series de Spider-Man</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedSeries.map((item) => (
                <Link key={item.id} href={`/series/${item.slug}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="relative aspect-[2/3]">
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
                          Ver detalles
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