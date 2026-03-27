import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ShoppingCart, Calendar, User, ArrowLeft, Users, History, Eye, Camera, Palette, TrendingUp, Star, Building, Award } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { comicService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import { generateAmazonUrl, parseJson } from "@/lib/content-helpers"
import { AmazonProductCard } from "@/components/affiliate/AmazonProductCard"
import { TiendaProductCards } from "@/components/affiliate/TiendaProductCards"
import { Breadcrumb } from "@/components/breadcrumb"
import type { ConceptArtItem, CoverVariant, ArtistPhoto, PagePreview } from "@/lib/json-types"
import { ComicTagSection } from "@/components/comics/ComicTagSection"
import { ComicEditorialAnalysis } from "@/components/comics/ComicEditorialAnalysis"
import { ComicSameCollection } from "@/components/comics/ComicSameCollection"
import { ComicCharacters } from "@/components/comics/ComicCharacters"
import { characterService } from "@/lib/database"

export const revalidate = 3600

export async function generateStaticParams() {
  const comics = await comicService.getAll()
  return comics.map((c) => ({ slug: c.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

// Función para renderizar estrellas

// Función para obtener color de importancia
const getImportanceColor = (_importance: string) => {
  switch (_importance.toLowerCase()) {
    case 'origen': return 'bg-gradient-to-r from-red-600 to-orange-600'
    case 'esencial': return 'bg-gradient-to-r from-purple-600 to-pink-600'
    case 'primera serie': return 'bg-gradient-to-r from-blue-600 to-cyan-600'
    case 'debut villano': return 'bg-gradient-to-r from-green-600 to-emerald-600'
    case 'evento importante': return 'bg-gradient-to-r from-yellow-600 to-amber-600'
    default: return 'bg-gradient-to-r from-gray-600 to-slate-600'
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comic = await comicService.getBySlug(slug).catch(() => null)

  if (!comic) {
    return {
      title: "Cómic no encontrado | Spider-World",
      description: "El cómic que buscas no está disponible.",
    }
  }

  const description = comic.description
    ? comic.description.substring(0, 155) + '...'
    : `Descubre ${comic.title}, cómic de Spider-Man con análisis completo, escritores y dónde comprarlo.`;

  const url = `${SITE_URL}/comics/${comic.slug}`;
  const title = `${comic.title} (${comic.year}) - Análisis Completo | Spider-World`;

  return {
    title,
    description,
    keywords: comic.keywords?.length ? comic.keywords : ['Spider-Man', 'Marvel Comics', 'cómic', comic.title, comic.year, 'análisis'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      images: [comic.image],
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [comic.image],
    },
  }
}

export default async function ComicPage({ params }: Props) {
  const { slug } = await params
  const comic = await comicService.getBySlug(slug).catch(() => null)

  if (!comic) {
    notFound()
  }

  comicService.incrementViews(slug).catch(() => {})

  const url = `${SITE_URL}/comics/${comic.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: comic.title,
    description: comic.seoDescription || comic.description,
    image: comic.image ? { '@type': 'ImageObject', url: comic.image, width: 300, height: 450 } : undefined,
    url,
    datePublished: comic.year,
    author: comic.writer ? { '@type': 'Person', name: comic.writer } : undefined,
    publisher: { '@type': 'Organization', name: 'Marvel Comics' },
    genre: 'Comic Book',
    inLanguage: 'en',
    aggregateRating: comic.rating ? {
      '@type': 'AggregateRating',
      ratingValue: comic.rating,
      bestRating: 10,
      worstRating: 0,
      ratingCount: Math.max(comic.views || 0, 50),
    } : undefined,
  }

  // Obtener cómics relacionados
  const relatedComics = await comicService.getRelated({ slug, writer: comic.writer ?? '', importance: comic.importance ?? '' }).catch(() => [])

  // Obtener otros números de la misma colección
  const storyline = comic.storylines?.[0]
  const sameCollection = storyline
    ? await comicService.getByStoryline(storyline, slug, 12).catch(() => [])
    : []

  const allCharacters = await characterService.getAll().catch(() => [])

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Fondo: portada muy difuminada */}
        <div className="absolute inset-0 scale-110">
          <Image src={comic.image} alt="" fill sizes="100vw" className="object-cover opacity-20 blur-md" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Columna izquierda: info */}
            <div className="flex-1 max-w-2xl">
              <Breadcrumb items={[{ label: "Cómics", href: "/comics" }, { label: comic.title }]} />

              <div className="flex flex-wrap items-center gap-2 mt-4 mb-5">
                <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Marvel Comics · {comic.year}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                {comic.title}
              </h1>

              {comic.subtitle && (
                <p className="text-lg text-blue-300 italic mb-4">"{comic.subtitle}"</p>
              )}

              {comic.description && (
                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-xl">
                  {(() => { const dot = comic.description.indexOf('. '); return dot > 0 ? comic.description.substring(0, dot + 1) : comic.description.substring(0, 200) + '…' })()}
                </p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> {comic.year}
                </div>
                {comic.writer && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <User className="w-3.5 h-3.5 text-purple-400" /> {comic.writer}
                  </div>
                )}
                {comic.artist && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Users className="w-3.5 h-3.5 text-green-400" /> {comic.artist}
                  </div>
                )}
                {comic.pages && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <BookOpen className="w-3.5 h-3.5 text-orange-400" /> {comic.pages} págs.
                  </div>
                )}
                {comic.views > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-gray-300">
                    <Eye className="w-3.5 h-3.5 text-gray-400" /> {comic.views.toLocaleString()} vistas
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                <a href="#analisis" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  <BookOpen className="w-4 h-4" /> Ver análisis
                </a>
                <a
                  href={generateAmazonUrl(`${comic.title} Marvel Comics`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Comprar en Amazon
                </a>
                <Link href="/comics" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium px-5 py-3 rounded-xl transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Volver
                </Link>
              </div>
            </div>

            {/* Columna derecha: portada */}
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-full" />
                <Image
                  src={comic.image}
                  alt={comic.title}
                  width={280}
                  height={420}
                  className="relative rounded-2xl shadow-2xl shadow-black/60 w-52 md:w-64 lg:w-72"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Información Principal */}
      <section id="analisis" className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Info cards */}
              <div className="flex flex-wrap gap-3">
                {comic.writer && (
                  <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl px-5 py-4">
                    <User className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">Guionista</p>
                      <p className="text-white font-bold">{comic.writer}</p>
                    </div>
                  </div>
                )}
                {comic.artist && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4">
                    <Users className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">Artista</p>
                      <p className="text-white font-bold">{comic.artist}</p>
                    </div>
                  </div>
                )}
                {comic.importance && (
                  <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-5 py-4">
                    <Award className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">Importancia</p>
                      <p className="text-white font-bold">{comic.importance}</p>
                    </div>
                  </div>
                )}
                {comic.publisher && (
                  <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-5 py-4">
                    <Building className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">Editorial</p>
                      <p className="text-white font-bold">{comic.publisher}</p>
                    </div>
                  </div>
                )}
                {comic.pages && (
                  <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-4">
                    <BookOpen className="w-5 h-5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">Páginas</p>
                      <p className="text-white font-bold">{comic.pages}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Arcos narrativos — destacado */}
              {(comic.storylines ?? []).length > 0 && (
                <div className="pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-purple-500 to-purple-800" />
                    <h3 className="text-white font-bold text-lg">Arcos Narrativos</h3>
                    <span className="ml-auto text-xs text-purple-400 font-semibold">{(comic.storylines ?? []).length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(comic.storylines ?? []).map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-purple-500/30 bg-purple-500/10 text-purple-300 font-medium">
                        <History className="w-3.5 h-3.5" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <ComicCharacters
                characterNames={comic.characters ?? []}
                allCharacters={allCharacters}
              />

              <ComicTagSection
                title="Primeras Apariciones"
                Icon={TrendingUp}
                items={comic.firstAppearances ?? []}
                colors={{ gradient: 'to-green-950/20', border: 'border-green-500/30', iconBg: 'bg-green-500/20', iconText: 'text-green-400', pillBorder: 'border-green-500/20 hover:border-green-500/40' }}
              />

              <ComicEditorialAnalysis
                title={comic.title}
                year={comic.year}
                writer={comic.writer}
                artist={comic.artist}
                importance={comic.importance}
                rating={comic.rating}
                characters={comic.characters}
                longDescription={comic.longDescription}
              />

              {storyline && (
                <ComicSameCollection storyline={storyline} comics={sameCollection} />
              )}

              {/* Galería de Portadas Variantes */}
              {comic.coverVariants && Array.isArray(comic.coverVariants) && comic.coverVariants.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-red-950/20 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Camera className="w-8 h-8 mr-3 text-red-400" />
                    Portadas Variantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parseJson<CoverVariant>(comic.coverVariants).map((cover, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={cover.url}
                            alt={cover.title}
                            width={300}
                            height={450}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{cover.title}</h4>
                          <p className="text-gray-400 text-sm">{cover.description}</p>
                          {cover.artist && (
                            <p className="text-red-400 text-xs mt-1">Artista: {cover.artist}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fotos de Artistas */}
              {comic.artistPhotos && Array.isArray(comic.artistPhotos) && comic.artistPhotos.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-purple-950/20 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-purple-400" />
                    Equipo Creativo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parseJson<ArtistPhoto>(comic.artistPhotos).map((artist, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center group hover:bg-gray-800/70 transition-colors">
                        <div className="relative mb-4">
                          <Image
                            src={artist.photo || '/placeholder-user.jpg'}
                            alt={artist.name}
                            width={120}
                            height={120}
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-1">{artist.name}</h4>
                          <p className="text-purple-400 text-sm mb-2">{artist.role}</p>
                          {artist.bio && (
                            <p className="text-gray-400 text-xs leading-relaxed">{artist.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                        </div>
                      </div>
                    )}

              {/* Vista Previa de Páginas */}
              {comic.pagePreview && Array.isArray(comic.pagePreview) && comic.pagePreview.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
                    Vista Previa de Páginas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parseJson<PagePreview>(comic.pagePreview).map((page, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={page.url}
                            alt={`Página ${page.pageNumber}`}
                            width={300}
                            height={400}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-blue-600/90 text-white text-xs">
                              Página {page.pageNumber}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">Página {page.pageNumber}</h4>
                          <p className="text-gray-400 text-sm">{page.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Arte Conceptual */}
              {comic.conceptArt && Array.isArray(comic.conceptArt) && comic.conceptArt.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-green-950/20 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Palette className="w-8 h-8 mr-3 text-green-400" />
                    Arte Conceptual
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parseJson<ConceptArtItem>(comic.conceptArt).map((concept, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={concept.url}
                            alt={concept.title}
                            width={300}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Palette className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{concept.title}</h4>
                          <p className="text-gray-400 text-sm">{concept.description}</p>
                          {concept.artist && (
                            <p className="text-green-400 text-xs mt-1">Artista: {concept.artist}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              )}
            </div>

            {/* Sidebar Mejorado */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Portada del Cómic */}
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={comic.image}
                    alt={`${comic.title} (${comic.year}) - Portada`}
                    width={300}
                    height={450}
                    className="w-full"
                  />
                  <div className="px-4 py-3 bg-gray-950 flex items-center justify-between">
                    <span className="text-gray-500 text-xs uppercase tracking-widest">Vistas</span>
                    <span className="text-white font-bold text-sm flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" /> {comic.views.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                <AmazonProductCard
                  title={`${comic.title} — Edición Completa`}
                  image={comic.image}
                  href={generateAmazonUrl(`${comic.title} Marvel comic español`)}
                  badge="Cómic"
                  subtitle={comic.writer ? `Por ${comic.writer}` : undefined}
                />
                <TiendaProductCards categories={["Cómics", "Figuras", "Coleccionables"]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómics Relacionados */}
      {relatedComics.length > 0 && (
        <section className="py-16 border-t border-white/5 bg-gradient-to-b from-gray-950 to-black">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
              <h2 className="text-xl font-bold text-white">Cómics Relacionados</h2>
              <span className="ml-auto text-xs text-blue-400 font-semibold">{relatedComics.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedComics.map((relatedComic) => (
                <Link key={relatedComic.id} href={`/comics/${relatedComic.slug}`} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-lg ring-1 ring-white/5 group-hover:ring-blue-500/40 group-hover:-translate-y-1 transition-all duration-200">
                    <Image
                      src={relatedComic.image}
                      alt={relatedComic.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {relatedComic.importance && (
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${relatedComic.importance === 'Alta' ? 'bg-red-600/90 text-white' : relatedComic.importance === 'Buena' ? 'bg-yellow-600/90 text-white' : 'bg-gray-700/90 text-gray-300'}`}>
                          {relatedComic.importance}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {relatedComic.title}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{relatedComic.year}</span>
                    {relatedComic.writer && (
                      <span className="text-gray-600 text-xs truncate">· {relatedComic.writer}</span>
                    )}
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