import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, User, Tv, ArrowLeft, Award, Star } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { movieService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import { generateAmazonUrl, parseJson } from "@/lib/content-helpers"
import { AMAZON_TAG } from "@/lib/config"
import type { GalleryImage, CastMember } from "@/lib/json-types"
import { movieAnalysis } from "@/lib/editorial-analysis"
import { AmazonProductCard } from "@/components/affiliate/AmazonProductCard"
import { TiendaProductCards } from "@/components/affiliate/TiendaProductCards"
import { StickyAffiliateSidebar } from "@/components/affiliate/StickyAffiliateSidebar"

export const revalidate = 3600

export async function generateStaticParams() {
  const movies = await movieService.getAll()
  return movies.map((m) => ({ slug: m.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const movie = await movieService.getBySlug(slug).catch(() => null)
  
  if (!movie) {
    return {
      title: "Película no encontrada | Spider-World",
      description: "La película que buscas no está disponible.",
    }
  }

  const description = movie.description 
    ? movie.description.substring(0, 155) + '...'
    : `Descubre ${movie.title}, película de Spider-Man con análisis completo, reparto y dónde verla.`;

  const url = `${SITE_URL}/peliculas/${movie.slug}`;

  return {
    title: `${movie.title} (${movie.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: movie.keywords?.length ? movie.keywords : ['Spider-Man', 'película', movie.title, movie.year.toString(), 'análisis', 'reparto'],
    alternates: { canonical: url },
    openGraph: {
      title: `${movie.title} (${movie.year}) - Análisis Completo | Spider-World`,
      description,
      images: [movie.image],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} (${movie.year}) - Análisis Completo | Spider-World`,
      description,
      images: [movie.image],
    },
  }
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params
  const movie = await movieService.getBySlug(slug).catch(() => null)

  if (!movie) {
    notFound()
  }

  movieService.incrementViews(slug).catch(() => {})

  // Obtener películas relacionadas
  const relatedMovies = await movieService.getFeatured(4, slug).catch(() => []);

  const BASE_URL = SITE_URL
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.seoDescription || movie.description,
    image: movie.image ? {
      '@type': 'ImageObject',
      url: movie.image,
      width: 300,
      height: 450,
    } : undefined,
    url: `${BASE_URL}/peliculas/${movie.slug}`,
    datePublished: movie.releaseDate || movie.year?.toString(),
    director: movie.director ? { '@type': 'Person', name: movie.director } : undefined,
    actor: movie.actors?.slice(0, 3).map((name: string) => ({ '@type': 'Person', name })),
    genre: movie.genre,
    aggregateRating: movie.rating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: Math.max(movie.views || 0, 50),
    } : undefined,
    inLanguage: 'es',
  }

  // Usar datos reales de la base de datos o fallback
  const sceneGallery: GalleryImage[] = parseJson<GalleryImage>(movie.sceneImages).length > 0
    ? parseJson<GalleryImage>(movie.sceneImages)
    : [
        { url: movie.image, title: `Escena icónica de ${movie.title}`, description: "Una de las escenas más memorables de la película" },
        { url: movie.image, title: `Momento épico de ${movie.title}`, description: "Acción y emoción en su máxima expresión" },
        { url: movie.image, title: `Gran final de ${movie.title}`, description: "El clímax que todos esperábamos" },
      ];

  // Usar datos reales del reparto o fallback
  const castData: CastMember[] = parseJson<CastMember>(movie.castWithPhotos).length > 0
    ? parseJson<CastMember>(movie.castWithPhotos)
    : movie.actors?.map((actor: string) => ({
        name: actor,
        character: "Personaje",
        photo: '/placeholder-user.jpg',
        bio: `Actor en ${movie.title}`
      })) || [];

  return (
    <div className="pt-16 bg-gradient-to-b from-black via-gray-950 to-black" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 10% 50%, rgba(180,0,0,0.18) 0%, transparent 70%), radial-gradient(ellipse 70% 40% at 90% 70%, rgba(0,80,220,0.22) 0%, transparent 70%)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Fondo: póster desenfocado */}
        <div className="absolute inset-0">
          <Image
            src={movie.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover scale-110 blur-sm opacity-30"
            priority
          />
        </div>
        {/* Gradientes de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center">

            {/* Columna izquierda: info */}
            <div>
              <Link href="/peliculas" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Volver a Películas
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white text-xs tracking-widest uppercase px-3 py-1">
                  {movie.rating >= 8 ? 'Película Esencial' : 'Spider-Man'}
                </Badge>
                <span className="text-gray-500 text-sm">{movie.year}</span>
                {movie.duration && <span className="text-gray-500 text-sm">· {movie.duration}</span>}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {movie.title}
              </h1>

              {movie.subtitle && (
                <p className="text-lg text-gray-400 italic mb-4">"{movie.subtitle}"</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(movie.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-yellow-400 font-bold ml-1">{movie.rating}</span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>

              {movie.description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                  {(() => {
                    const firstDot = movie.description.indexOf('. ')
                    return firstDot > 0 && firstDot < 300
                      ? movie.description.substring(0, firstDot + 1)
                      : movie.description.length > 250
                        ? movie.description.substring(0, 250) + '…'
                        : movie.description
                  })()}
                </p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {movie.director && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {movie.director}
                  </div>
                )}
                {movie.genre && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Tv className="w-3.5 h-3.5 text-gray-400" />
                    {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}
                  </div>
                )}
                {movie.boxOffice && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Award className="w-3.5 h-3.5 text-gray-400" />
                    {movie.boxOffice}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <a
                    href="#trailer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-red-900/40"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Ver tráiler
                  </a>
                )}
                <a
                  href={movie.amazonAsin ? `https://www.amazon.es/dp/${movie.amazonAsin}?tag=${AMAZON_TAG}` : generateAmazonUrl(`${movie.title} ${movie.year} 4K blu-ray`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar en Amazon
                </a>
              </div>
            </div>

            {/* Columna derecha: póster */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-3xl" />
                <Image
                  src={movie.image}
                  alt={`${movie.title} - Póster oficial`}
                  width={320}
                  height={480}
                  className="relative rounded-2xl shadow-2xl w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Movie Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Ficha técnica — stats grandes */}
              <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-white/10">
                {[
                  { label: "Año", value: movie.year },
                  movie.duration ? { label: "Duración", value: movie.duration } : null,
                  movie.rating ? { label: "Puntuación", value: `${movie.rating}/10` } : null,
                  movie.boxOffice ? { label: "Recaudación", value: movie.boxOffice } : null,
                  movie.platform ? { label: "Plataforma", value: movie.platform } : null,
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
              {movie.description && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Sinopsis</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* Trailer */}
              {movie.trailerUrl && (
                <div id="trailer" className="mt-10 scroll-mt-24 bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Tráiler Oficial</h3>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    <iframe
                      src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                      title={`Tráiler de ${movie.title}`}
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
                </div>
                {(() => {
                  const data = movieAnalysis[movie.slug] ?? {
                    contexto: `${movie.title} se inscribe en la larga tradición de adaptaciones cinematográficas del universo de Spider-Man, aportando su propia visión del personaje y su mundo.`,
                    recepcion: `La película encontró su público entre los fans del trepamuros y generó debate sobre la dirección creativa de las adaptaciones del universo arácnido en el cine.`,
                    legado: `Como parte del catálogo de Spider-Man en el cine, ${movie.title} ocupa su lugar en la historia de un personaje que lleva décadas siendo uno de los más queridos y adaptados de la cultura popular.`,
                  }

                  return (
                    <div className="space-y-8">
                      {[
                        { num: "01", title: "Contexto Cinematográfico", text: data.contexto, color: "text-red-500" },
                        { num: "02", title: "Recepción y Repercusión",  text: data.recepcion, color: "text-blue-500" },
                        { num: "03", title: "Legado en el Spider-Verse", text: data.legado,   color: "text-purple-500" },
                      ].map(({ num, title, text, color }) => (
                        <div key={num} className="flex gap-6 items-start">
                          <span className={`text-5xl font-black leading-none ${color} opacity-25 select-none shrink-0 w-14 text-right`}>
                            {num}
                          </span>
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

              {/* Galería de Escenas */}
              {Array.isArray(sceneGallery) && sceneGallery.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Galería de Escenas</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {sceneGallery.map((scene, index) => (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-xl ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                      >
                        <div className={`relative w-full ${index === 0 ? 'aspect-video' : 'aspect-video'}`}>
                          <Image
                            src={scene.url}
                            alt={scene.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <p className="text-white text-xs font-medium line-clamp-1">{scene.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reparto Principal */}
              {Array.isArray(castData) && castData.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
                    <h3 className="text-2xl font-bold text-white">Reparto Principal</h3>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {castData.slice(0, 12).map((actor, index) => (
                      <div key={index} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                        <div className="relative aspect-[3/4]">
                          <Image
                            src={actor.image || actor.photo || '/placeholder-user.jpg'}
                            alt={actor.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white font-semibold text-sm leading-tight">{actor.name}</p>
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
                title={`${movie.title} (${movie.year})`}
                image={movie.image}
                href={movie.amazonAsin ? `https://www.amazon.es/dp/${movie.amazonAsin}?tag=${AMAZON_TAG}` : generateAmazonUrl(`${movie.title} ${movie.year} 4K blu-ray`)}
                badge="Blu-ray"
                asin={movie.amazonAsin ?? undefined}
              />
              <TiendaProductCards categories={["Figuras", "Coleccionables", "Juguetes"]} limit={2} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-red-950/10 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Más películas de Spider-Man</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedMovies.map((item) => (
                <Link key={item.id} href={`/peliculas/${item.slug}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Título siempre visible */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-white text-sm font-bold line-clamp-2 text-center leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                          {item.title}
                        </h3>
                      </div>

                      {/* Info en hover */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Ver análisis
                        </Button>
                      </div>

                      {/* Rating */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-semibold">{item.rating}</span>
                      </div>

                      {/* Año */}
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