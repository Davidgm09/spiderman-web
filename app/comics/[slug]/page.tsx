import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ShoppingCart, Calendar, User, Building, ArrowLeft, Users, Award, Zap, History, Eye, Camera, Palette, Star, BookmarkPlus, TrendingUp } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { comicService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import { renderStars, generateAmazonUrl, parseJson } from "@/lib/content-helpers"
import { Breadcrumb } from "@/components/breadcrumb"
import type { ConceptArtItem, CoverVariant, ArtistPhoto, PagePreview } from "@/lib/json-types"

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
const getImportanceColor = (importance: string) => {
  switch (importance.toLowerCase()) {
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
    keywords: ['Spider-Man', 'Marvel Comics', 'cómic', comic.title, comic.year, 'análisis'],
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

  comicService.incrementViews(slug).catch(console.error)

  // Obtener cómics relacionados
  const relatedComics = await comicService.getFeatured(4, slug).catch(() => []);

  return (
    <div className="pt-16">
      {/* Hero Section Mejorado */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fondo con múltiples capas */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/40 to-red-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>
        
        {/* Imagen de fondo con efecto parallax */}
        <div className="absolute inset-0 scale-110">
          <Image
            src={comic.image}
            alt={`${comic.title} - Portada del cómic`}
            fill
            sizes="100vw"
            className="object-cover opacity-30 blur-sm"
            priority
          />
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: "Cómics", href: "/comics" }, { label: comic.title }]} />
          {/* Navegación y badges */}
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/comics">
              <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Cómics
              </Button>
            </Link>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className={`${getImportanceColor(comic.importance)} text-white px-4 py-2 text-sm font-bold shadow-lg`}>
                <Award className="w-4 h-4 mr-1" />
                {comic.importance}
              </Badge>
              
              {comic.views > 0 && (
                <Badge className="bg-gray-700/80 text-gray-300 px-3 py-2 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {comic.views.toLocaleString()} vistas
              </Badge>
            )}
              
              <Badge className="bg-yellow-600/80 text-white px-3 py-2 text-sm">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {comic.rating}/10
              </Badge>
            </div>
          </div>
          
          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-red-400 via-blue-400 to-red-400 bg-clip-text text-transparent leading-tight">
            {comic.title}
          </h1>
          
          {/* Subtítulo */}
          {comic.subtitle && (
            <p className="text-2xl md:text-3xl mb-8 text-blue-300 max-w-4xl mx-auto leading-relaxed font-light italic">
              "{comic.subtitle}"
            </p>
          )}
          
          {/* Descripción breve */}
          {comic.description && (
            <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
              {comic.description.length > 250 ? comic.description.substring(0, 250) + '...' : comic.description}
            </p>
          )}

          {/* Información clave en formato visual */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-gray-300">
            <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              <span className="font-semibold">{comic.year}</span>
            </div>
            {comic.writer && (
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm">
                <User className="w-5 h-5 mr-2 text-purple-400" />
                <span className="font-semibold">{comic.writer}</span>
              </div>
            )}
            {comic.artist && (
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                <span className="font-semibold">{comic.artist}</span>
              </div>
            )}
            {comic.pages && (
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 mr-2 text-orange-400" />
                <span className="font-semibold">{comic.pages} páginas</span>
              </div>
            )}
          </div>

          {/* Botones de acción mejorados */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-10 py-4 text-lg font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
              <a href="#analisis">
                  <BookOpen className="mr-2 h-5 w-5" />
                Leer Análisis Completo
                </a>
              </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-10 py-4 text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href={generateAmazonUrl(`${comic.title} comic marvel`)} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar en Amazon
              </a>
            </Button>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Información Principal */}
      <section id="analisis" className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Ficha Técnica Mejorada */}
              <div className="bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
                  Información del Cómic
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm font-medium">Título Completo</span>
                        <div className="text-white font-bold text-lg">{comic.title}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                        <div>
                        <span className="text-gray-400 text-sm font-medium">Año de Publicación</span>
                        <div className="text-white font-bold text-lg">{comic.year}</div>
                      </div>
                    </div>
                    
                    {comic.writer && (
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <User className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Guionista</span>
                          <div className="text-white font-bold text-lg">{comic.writer}</div>
                        </div>
                      </div>
                    )}
                    
                    {comic.artist && (
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Artista</span>
                          <div className="text-white font-bold text-lg">{comic.artist}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm font-medium">Calificación</span>
                        <div className="text-white font-bold text-lg flex items-center">
                          {renderStars(comic.rating)}
                        </div>
                      </div>
                    </div>
                    
                    {comic.publisher && (
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <Building className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Editorial</span>
                          <div className="text-white font-bold text-lg">{comic.publisher}</div>
                        </div>
                      </div>
                    )}
                    
                    {comic.pages && (
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <BookOpen className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Páginas</span>
                          <div className="text-white font-bold text-lg">{comic.pages}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <Award className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm font-medium">Importancia Histórica</span>
                        <div className="text-white font-bold text-lg">{comic.importance}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personajes Principales */}
              {comic.characters && comic.characters.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-red-950/20 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-red-400" />
                    Personajes Principales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comic.characters.map((character, index) => (
                      <div key={index} className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="p-2 bg-red-500/20 rounded-full mr-3">
                            <Zap className="w-4 h-4 text-red-400" />
                          </div>
                          <span className="text-white font-semibold">{character}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Storylines */}
              {comic.storylines && comic.storylines.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-purple-950/20 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <History className="w-8 h-8 mr-3 text-purple-400" />
                    Arcos Narrativos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comic.storylines.map((storyline, index) => (
                      <div key={index} className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                            <BookmarkPlus className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-white font-semibold">{storyline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primeras Apariciones */}
              {comic.firstAppearances && comic.firstAppearances.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/80 to-green-950/20 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-8 h-8 mr-3 text-green-400" />
                    Primeras Apariciones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comic.firstAppearances.map((appearance, index) => (
                      <div key={index} className="bg-black/40 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-500/20 rounded-full mr-3">
                            <Star className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="text-white font-semibold">{appearance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Análisis Completo */}
              {comic.longDescription && (
                <div className="bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
                    Análisis Completo
                  </h3>
                  <div 
                    className="text-gray-300 text-lg leading-relaxed max-w-none
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-6
                      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-blue-400 [&>h3]:mb-3 [&>h3]:mt-5
                      [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed
                      [&>p:first-of-type]:text-xl [&>p:first-of-type]:text-gray-200 [&>p:first-of-type]:font-medium
                      [&>strong]:text-white [&>strong]:font-semibold
                      [&>em]:text-gray-200 [&>em]:italic
                      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                      [&>li]:mb-2 [&>li]:text-gray-300
                      [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-200 [&>blockquote]:bg-gray-800/30 [&>blockquote]:py-2 [&>blockquote]:rounded-r
                    "
                    dangerouslySetInnerHTML={{ __html: comic.longDescription }}
                  />
                </div>
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
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm">
                  <div className="relative group">
                    <Image
                      src={comic.image}
                      alt={`${comic.title} (${comic.year}) - Portada`}
                      width={300}
                      height={450}
                      className="w-full rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Información rápida */}
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Calificación</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-white font-bold">{comic.rating}/10</span>
                      </div>
                    </div>
                    
                    {comic.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Precio Estimado</span>
                        <span className="text-green-400 font-bold">{comic.price}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Vistas</span>
                      <span className="text-blue-400 font-bold">{comic.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                {/* Productos Recomendados Mejorados */}
                <div className="bg-gradient-to-br from-gray-900/50 to-orange-950/20 rounded-xl p-6 border border-orange-500/20 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2 text-orange-400" />
                    Productos del Cómic
                  </h3>
                  <div className="space-y-4">
                    <AmazonProduct
                      title={`${comic.title} TPB`}
                      description="Edición en tapa blanda"
                      price="$19.99"
                      originalPrice="$24.99"
                      discount={20}
                      category="Cómic"
                      tags={['Spider-Man', 'Marvel', 'Cómic']}
                      searchQuery={`${comic.title} trade paperback`}
                      className="max-w-none"
                    />
                    <AmazonProduct
                      title={`${comic.title} Hardcover`}
                      description="Edición de lujo en tapa dura"
                      price="$39.99"
                      category="Cómic"
                      tags={['Spider-Man', 'Marvel', 'Hardcover']}
                      searchQuery={`${comic.title} hardcover omnibus`}
                      className="max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómics Relacionados Mejorados */}
      {relatedComics.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-white mb-16 text-center bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Cómics Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedComics.map((relatedComic) => (
                <Card key={relatedComic.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group transform hover:scale-105">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedComic.image}
                        alt={`${relatedComic.title} (${relatedComic.year})`}
                        width={300}
                        height={450}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-yellow-600/90 text-white shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {relatedComic.rating}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      <Link href={`/comics/${relatedComic.slug}`}>
                        {relatedComic.title} ({relatedComic.year})
                      </Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {relatedComic.description}
                    </p>
                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700">
                      <Link href={`/comics/${relatedComic.slug}`}>
                        <BookOpen className="w-4 h-4 mr-1" />
                        Ver Análisis
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 