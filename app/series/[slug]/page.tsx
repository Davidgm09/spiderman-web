import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, Calendar, Tv, Users, Clock, ArrowLeft, Award, Camera, BookOpen, Eye, Star, Palette } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { seriesService } from "@/lib/database"
import { Series } from "@prisma/client"
import { renderStars, generateAmazonUrl } from "@/lib/content-helpers"


type SceneImage = {
  url: string;
  title: string;
  description: string;
  type: 'still' | 'backdrop';
  season?: number;
  episode?: number;
};

type Props = {
  params: Promise<{ slug: string }>
}

// Función para obtener serie por slug desde la base de datos
async function getSeriesBySlug(slug: string): Promise<Series | null> {
  try {
    return await seriesService.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching series:', error);
    return null;
  }
}

// Función para obtener imágenes de galería desde TMDB
async function getSeriesGalleryImages(tmdbId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/external/series/${tmdbId}/images`, {
      next: { revalidate: 43200 } // 12 hours cache
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.result?.gallery || null;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return null;
  }
}


// Función para obtener series relacionadas
async function getRelatedSeries(currentSlug: string, limit: number = 4) {
  try {
    const allSeries = await seriesService.getAll();
    return allSeries
      .filter((serie: Series) => serie.slug !== currentSlug)
      .sort((a: Series, b: Series) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related series:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)
  
  if (!series) {
    return {
      title: "Serie no encontrada | Spider-World",
      description: "La serie que buscas no está disponible.",
    }
  }

  const description = series.description 
    ? series.description.substring(0, 155) + '...'
    : `Descubre ${series.title}, serie de Spider-Man con análisis completo, episodios y dónde verla.`;

  return {
    title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: ['Spider-Man', 'serie animada', series.title, series.year.toString(), 'análisis', 'episodios'],
    openGraph: {
      title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
      description,
      images: [series.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${series.title} (${series.year}) - Análisis Completo | Spider-World`,
      description,
      images: [series.image],
    },
  }
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)

  if (!series) {
    notFound()
  }

  // Obtener series relacionadas
  const relatedSeries = await getRelatedSeries(slug);
  
  // Obtener imágenes de galería desde TMDB si hay tmdbId
  const galleryImages = series.tmdbId ? await getSeriesGalleryImages(series.tmdbId.toString()) : null;


  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-green-900/30 to-black/80"></div>
        <div className="absolute inset-0">
          <Image
            src={series.image}
            alt={`${series.title} - Serie de Spider-Man`}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Link href="/series">
              <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Series
              </Button>
            </Link>
            <Badge className="bg-purple-600 text-white px-6 py-3 text-lg font-semibold">
              Serie Spider-Man
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
            {series.title}
          </h1>
          
          {series.subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {series.subtitle}
          </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              <span>{series.year}</span>
            </div>
            {series.seasons && (
            <div className="flex items-center">
              <Tv className="w-5 h-5 mr-2 text-blue-500" />
              <span>{series.seasons} temporadas</span>
            </div>
            )}
            {series.episodes && (
            <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
              <span>{series.episodes} episodios</span>
            </div>
            )}
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{series.rating}/10</span>
            </div>
          </div>

          {series.description && (
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              {series.description.length > 200 ? series.description.substring(0, 200) + '...' : series.description}
          </p>
          )}

          <div className="mb-8">{renderStars(series.rating)}</div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {series.trailerUrl && (
            <Button
              size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                asChild
            >
                <a href={series.trailerUrl} target="_blank" rel="noopener noreferrer">
              <Play className="mr-2 h-5 w-5" />
                  Ver Serie
                </a>
            </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
              asChild
            >
              <a href={generateAmazonUrl(`${series.title} DVD series Spider-Man`)} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar DVD
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Series Info */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Información de la Serie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                      <Tv className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="text-gray-400 text-sm">Título</span>
                    <div className="text-white font-semibold">{series.title}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                        <span className="text-gray-400 text-sm">Año de estreno</span>
                        <div className="text-white font-semibold">{series.year}</div>
                      </div>
                    </div>
                    {series.creators && series.creators.length > 0 && (
                <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="text-gray-400 text-sm">Creador</span>
                    <div className="text-white font-semibold">{series.creators.join(', ')}</div>
                  </div>
                </div>
                    )}
                    {series.seasons && (
                <div className="flex items-center space-x-3">
                        <Tv className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="text-gray-400 text-sm">Temporadas</span>
                    <div className="text-white font-semibold">{series.seasons}</div>
                  </div>
                </div>
                    )}
              </div>
              <div className="space-y-4">
                    {series.episodes && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="text-gray-400 text-sm">Episodios</span>
                    <div className="text-white font-semibold">{series.episodes}</div>
                        </div>
                      </div>
                    )}
                    {series.network && (
                      <div className="flex items-center space-x-3">
                        <Play className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Canal/Plataforma</span>
                          <div className="text-white font-semibold">{series.network}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Calificación</span>
                        <div className="text-white font-semibold">{series.rating}/10</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-red-500" />
                  <div>
                        <span className="text-gray-400 text-sm">Importancia</span>
                        <div className="text-white font-semibold">
                          {series.rating >= 9 ? 'Esencial' : series.rating >= 7 ? 'Muy Importante' : 'Importante'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {series.description && (
                <div className="mt-8 bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Sinopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {series.description}
                  </p>
                </div>
              )}

              {/* Genre */}
              {series.genre && (
                <div className="mt-8 bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Géneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(series.genre) 
                      ? series.genre.map((g: any, index: any) => (
                          <Badge key={index} className="bg-purple-600 text-white">
                            {g}
                          </Badge>
                        ))
                      : <Badge className="bg-purple-600 text-white">{series.genre}</Badge>
                    }
                  </div>
                </div>
              )}

              {/* Tráiler */}
              {series.trailerUrl && (
                <div className="mt-8 bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Play className="w-8 h-8 mr-3 text-green-500" />
                    Tráiler Oficial
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={series.trailerUrl.replace('watch?v=', 'embed/')}
                      title={`Tráiler de ${series.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-3 text-center">
                    Tráiler oficial de {series.title} ({series.year})
                  </p>
                </div>
              )}

              {/* Análisis Editorial */}
              {series.longDescription && (
                <div className="mt-8 bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-purple-500" />
                    Análisis Editorial
                  </h3>
                  {(() => {
                    // Detectar si longDescription es simplemente una copia de description
                    const isBasicContent = series.longDescription.includes(`<h2>${series.title}</h2><p>${series.description}</p>`) || 
                                          series.longDescription.replace(/<[^>]*>/g, '').trim() === series.description?.trim();
                    
                    if (isBasicContent) {
                      // Generar análisis editorial enriquecido
                      return (
                        <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                          <p className="text-xl text-gray-200 font-medium mb-6">
                            {series.title} representa un capítulo significativo en la evolución de Spider-Man en el medio televisivo, 
                            ofreciendo una perspectiva única del universo arácnido que merece un análisis detallado.
                          </p>
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-xl font-semibold text-purple-400 mb-3">Impacto Narrativo</h3>
                              <p className="text-gray-300 leading-relaxed">
                                {parseInt(series.year) < 2000 
                                  ? "Esta serie estableció las bases narrativas que definirían las adaptaciones posteriores de Spider-Man, introduciendo elementos que se convertirían en estándares del género."
                                  : parseInt(series.year) < 2010
                                  ? "Aprovechando la evolución de la animación digital, esta serie logró expandir el universo Spider-Man con técnicas visuales más sofisticadas y narrativas complejas."
                                  : "Como parte de la nueva generación de series animadas, esta producción incorpora elementos modernos tanto en su narrativa como en su estilo visual, adaptándose a las expectativas contemporáneas."
                                }
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-purple-400 mb-3">Desarrollo de Personajes</h3>
                              <p className="text-gray-300 leading-relaxed">
                                La serie destaca por su {(series.seasons && series.seasons > 1) ? 'desarrollo progresivo' : 'enfoque concentrado'} en la evolución de Peter Parker, 
                                {(series.episodes && series.episodes > 20) 
                                  ? ' permitiendo una exploración profunda de sus relaciones y conflictos internos a lo largo de múltiples episodios.'
                                  : ' condensando eficientemente los elementos esenciales del personaje en un formato más compacto.'
                                }
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-purple-400 mb-3">Legado y Relevancia</h3>
                              <p className="text-gray-300 leading-relaxed">
                                {series.rating >= 8.0 
                                  ? "Con una calificación sobresaliente, esta serie ha demostrado su capacidad para resonar tanto con fanáticos de larga data como con nuevas audiencias, estableciéndose como una referencia en el género."
                                  : series.rating >= 7.0
                                  ? "A pesar de su recepción mixta inicial, la serie ha encontrado su lugar en el canon de Spider-Man, contribuyendo elementos únicos al mito del trepamuros."
                                  : "Aunque no alcanzó el reconocimiento universal, esta serie ofrece perspectivas interesantes sobre el universo Spider-Man que merecen ser consideradas por los entusiastas del personaje."
                                }
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-purple-400 mb-3">Contexto Histórico</h3>
                              <p className="text-gray-300 leading-relaxed">
                                Lanzada en {series.year}, esta serie {series.network ? `a través de ${series.network}` : 'en su plataforma correspondiente'} 
                                representa un momento específico en la evolución de las adaptaciones de Spider-Man, 
                                {(series.creators && series.creators.length > 0) ? ` bajo la visión creativa de ${series.creators.join(', ')},` : ''} contribuyendo al rico tapiz de interpretaciones del icónico superhéroe.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Usar longDescription original si es contenido rico
                      return (
                        <div 
                          className="text-gray-300 text-lg leading-relaxed max-w-none
                            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-6
                            [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-purple-400 [&>h3]:mb-3 [&>h3]:mt-5
                            [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed
                            [&>p:first-of-type]:text-xl [&>p:first-of-type]:text-gray-200 [&>p:first-of-type]:font-medium
                            [&>strong]:text-white [&>strong]:font-semibold
                            [&>em]:text-gray-200 [&>em]:italic
                            [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                            [&>li]:mb-2 [&>li]:text-gray-300
                            [&>blockquote]:border-l-4 [&>blockquote]:border-purple-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-200 [&>blockquote]:bg-gray-800/30 [&>blockquote]:py-2 [&>blockquote]:rounded-r
                          "
                          dangerouslySetInnerHTML={{ __html: series.longDescription }}
                        />
                      );
                    }
                  })()}
                </div>
              )}

              {/* Galería de Escenas */}
              <div className="mt-8 bg-gray-900/50 border border-purple-600/20 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Camera className="w-8 h-8 mr-3 text-blue-500" />
                  Galería de Escenas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    // Use TMDB gallery images if available, otherwise fallback to default structure
                    const imagesToDisplay: SceneImage[] = [
                      // Use the gallery images from API directly (they already have complete URLs)
                      ...(galleryImages || []).map((img: any, index: number) => ({
                        url: img.url, // API already provides complete URLs
                        title: img.title || `Escena ${index + 1}`,
                        description: img.description || "Una imagen de la serie",
                        type: img.type as 'still' | 'backdrop' || 'backdrop',
                        season: img.season,
                        episode: img.episode
                      })),
                      // Add series logo if available
                      ...(series.logo ? [{
                        url: series.logo,
                        title: "Logo Oficial de la Serie",
                        description: "El logo icónico de la serie animada",
                        type: 'backdrop' as const
                      }] : []),
                      // Add main series image as fallback
                      ...((!galleryImages || galleryImages.length === 0) ? [{
                        url: series.image,
                        title: `Imagen principal de ${series.title}`,
                        description: "La imagen oficial de la serie",
                        type: 'backdrop' as const
                      }] : [])
                    ];

                    return imagesToDisplay.map((scene: SceneImage, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={scene.url}
                            alt={scene.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-purple-600/90 text-white text-xs">
                              {scene.season && scene.episode 
                                ? `S${scene.season}E${scene.episode}`
                                : scene.type === 'still' 
                                  ? `S${Math.floor(index / 2) + 1}E${(index % 2) + 1}`
                                  : `Escena ${index + 1}`
                              }
                            </Badge>
                          </div>
                          {scene.type === 'still' && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-blue-600/90 text-white text-xs">
                                Episodio
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{scene.title}</h4>
                          <p className="text-gray-400 text-sm">{scene.description}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                {galleryImages && galleryImages.length > 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">
                      ✨ Imágenes oficiales obtenidas desde TMDB - {galleryImages.length} escenas disponibles
                    </p>
                  </div>
                )}
              </div>

              {/* Galería de Episodios */}
              {series.episodeImages && Array.isArray(series.episodeImages) && series.episodeImages.length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-red-950/20 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Camera className="w-8 h-8 mr-3 text-red-400" />
                    Episodios Destacados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.episodeImages.map((episode: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={episode.url}
                            alt={episode.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-600/90 text-white text-xs">
                              {episode.episode}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{episode.title}</h4>
                          <p className="text-gray-400 text-sm">{episode.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fotos del Reparto */}
              {series.castPhotos && Array.isArray(series.castPhotos) && series.castPhotos.length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-purple-950/20 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-purple-400" />
                    Reparto y Voces
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.castPhotos.map((actor: any, index: number) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center group hover:bg-gray-800/70 transition-colors">
                        <div className="relative mb-4">
                          <Image
                            src={actor.image || actor.photo || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'}
                            alt={actor.name}
                            width={120}
                            height={120}
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors"
                          />
                        </div>
                  <div>
                          <h4 className="text-white font-semibold text-lg mb-1">{actor.name}</h4>
                          <p className="text-purple-400 text-sm mb-2">{actor.character}</p>
                          {actor.bio && (
                            <p className="text-gray-400 text-xs leading-relaxed">{actor.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detrás de Cámaras */}
              {series.behindScenes && Array.isArray(series.behindScenes) && series.behindScenes.length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Eye className="w-8 h-8 mr-3 text-blue-400" />
                    Detrás de Cámaras
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.behindScenes.map((behind: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={behind.url}
                            alt={behind.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-blue-600/90 text-white text-xs">
                              {behind.season}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{behind.title}</h4>
                          <p className="text-gray-400 text-sm">{behind.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Arte Conceptual */}
              {series.conceptArt && Array.isArray(series.conceptArt) && series.conceptArt.length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-green-950/20 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Palette className="w-8 h-8 mr-3 text-green-400" />
                    Arte Conceptual
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.conceptArt.map((concept: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={concept.url}
                            alt={concept.title}
                            width={300}
                            height={300}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Series Poster */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-purple-600/20">
                  <Image
                    src={series.image}
                    alt={`${series.title} (${series.year}) - Poster`}
                    width={300}
                    height={450}
                    className="w-full rounded-lg"
                  />
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                {/* Productos Recomendados */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-purple-600/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    📺 Productos de la Serie
                  </h3>
                  <div className="space-y-4">
                    <AmazonProduct
                      title={`${series.title} DVD Colección`}
                      description="Temporadas completas en DVD"
                      price="$29.99"
                      originalPrice="$39.99"
                      discount={25}
                      category="Serie"
                      tags={['Spider-Man', 'DVD', 'Serie']}
                      searchQuery={`${series.title} complete series DVD`}
                      className="max-w-none"
                    />
                    <AmazonProduct
                      title={`${series.title} Blu-ray`}
                      description="Edición remasterizada en Blu-ray"
                      price="$49.99"
                      category="Serie"
                      tags={['Spider-Man', 'Blu-ray', 'Serie']}
                      searchQuery={`${series.title} blu-ray complete`}
                      className="max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Series */}
      {relatedSeries.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-purple-950/10 to-red-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Series Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedSeries.map((relatedSerie: any) => (
                <Card key={relatedSerie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={relatedSerie.image}
                        alt={`${relatedSerie.title} (${relatedSerie.year})`}
                        width={300}
                        height={450}
                        className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        {relatedSerie.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-white mb-2 line-clamp-2">
                      <Link href={`/series/${relatedSerie.slug}`} className="hover:text-purple-400 transition-colors">
                        {relatedSerie.title} ({relatedSerie.year})
                      </Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {relatedSerie.description}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/series/${relatedSerie.slug}`}>
                        <Play className="w-4 h-4 mr-1" />
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