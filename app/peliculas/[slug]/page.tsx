import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, Calendar, Clock, User, Tv, ArrowLeft, Award, Camera, Mail, CheckCircle } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { movieService } from "@/lib/database"
import { renderStars, generateAmazonUrl } from "@/lib/content-helpers"

type Props = {
  params: Promise<{ slug: string }>
}

// Función para obtener película por slug desde la base de datos
async function getMovieBySlug(slug: string) {
  try {
    return await movieService.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

function formatRuntime(duration?: string): string {
  return duration || 'Duración no disponible';
}

function formatRevenue(boxOffice?: string): string {
  return boxOffice || 'No disponible';
}

// Función para obtener películas relacionadas
async function getRelatedMovies(currentSlug: string, limit: number = 4) {
  try {
    const movies = await movieService.getFeatured(limit + 1);
    return movies.filter((movie: any) => movie.slug !== currentSlug).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const movie = await getMovieBySlug(slug)
  
  if (!movie) {
    return {
      title: "Película no encontrada | Spider-World",
      description: "La película que buscas no está disponible.",
    }
  }

  const description = movie.description 
    ? movie.description.substring(0, 155) + '...'
    : `Descubre ${movie.title}, película de Spider-Man con análisis completo, reparto y dónde verla.`;

  return {
    title: `${movie.title} (${movie.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: ['Spider-Man', 'película', movie.title, movie.year.toString(), 'análisis', 'reparto'],
    openGraph: {
      title: `${movie.title} (${movie.year}) - Análisis Completo | Spider-World`,
      description,
      images: [movie.image],
      type: "article",
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
  const movie = await getMovieBySlug(slug)

  if (!movie) {
    notFound()
  }

  // Obtener películas relacionadas
  const relatedMovies = await getRelatedMovies(slug);


  // Usar datos reales de la base de datos o fallback
  const sceneGallery = Array.isArray(movie.sceneImages) 
    ? movie.sceneImages 
    : movie.sceneImages && typeof movie.sceneImages === 'string'
    ? JSON.parse(movie.sceneImages)
    : [
        {
          url: movie.image,
          title: `Escena icónica de ${movie.title}`,
          description: "Una de las escenas más memorables de la película"
        },
        {
          url: movie.image,
          title: `Momento épico de ${movie.title}`,
          description: "Acción y emoción en su máxima expresión"
        },
        {
          url: movie.image,  
          title: `Gran final de ${movie.title}`,
          description: "El clímax que todos esperábamos"
        }
      ];

  // Usar datos reales del reparto o fallback
  const castData = Array.isArray(movie.castWithPhotos)
    ? movie.castWithPhotos
    : movie.castWithPhotos && typeof movie.castWithPhotos === 'string'
    ? JSON.parse(movie.castWithPhotos)
    : movie.actors?.map((actor: string) => ({
        name: actor,
        character: "Personaje",
        photo: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face`,
        bio: `Actor en ${movie.title}`
      })) || [];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/30 to-black/80"></div>
        <div className="absolute inset-0">
          <Image
            src={movie.image}
            alt={`${movie.title} (${movie.year}) - Película de Spider-Man`}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Link href="/peliculas">
              <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Películas
              </Button>
            </Link>
            <Badge className="bg-red-600 text-white px-6 py-3 text-lg font-semibold">
              {movie.rating >= 8 ? 'Película Esencial' : 'Película Spider-Man'}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
            {movie.title} ({movie.year})
          </h1>
          
          {movie.subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed italic">
              "{movie.subtitle}"
            </p>
          )}
          
          {movie.description && (
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              {movie.description.length > 200 ? movie.description.substring(0, 200) + '...' : movie.description}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-red-500" />
              <span>{movie.year}</span>
            </div>
            {movie.duration && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                <span>{movie.duration}</span>
              </div>
            )}
            {movie.director && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                <span>{movie.director}</span>
              </div>
            )}
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{movie.rating}/10</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {movie.platform && (
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                asChild
              >
                <a href={generateAmazonUrl(`${movie.title} ${movie.year} 4K blu-ray`)} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  Ver en {movie.platform}
                </a>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
              asChild
            >
              <a href={generateAmazonUrl(`${movie.title} ${movie.year} 4K blu-ray`)} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar en Amazon
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Movie Info */}
      <section className="py-20 bg-gradient-to-b from-black to-red-950/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Información de la Película</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-red-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Título</span>
                        <div className="text-white font-semibold">{movie.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Año de estreno</span>
                        <div className="text-white font-semibold">{movie.year}</div>
                      </div>
                    </div>
                    {movie.duration && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Duración</span>
                          <div className="text-white font-semibold">{movie.duration}</div>
                        </div>
                      </div>
                    )}
                    {movie.director && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Director</span>
                          <div className="text-white font-semibold">{movie.director}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Calificación</span>
                        <div className="text-white font-semibold">{movie.rating}/10</div>
                      </div>
                    </div>
                    {movie.genre && (
                      <div className="flex items-center space-x-3">
                        <Tv className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Género</span>
                          <div className="text-white font-semibold">
                            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                          </div>
                        </div>
                      </div>
                    )}
                    {movie.boxOffice && (
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Recaudación</span>
                          <div className="text-white font-semibold">{movie.boxOffice}</div>
                        </div>
                      </div>
                    )}
                    {movie.platform && (
                      <div className="flex items-center space-x-3">
                        <Tv className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Plataforma</span>
                          <div className="text-white font-semibold">{movie.platform}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sinopsis */}
              {movie.description && (
                <div className="mt-8 bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Sinopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* Trailer */}
              {movie.trailerUrl && (
                <div className="mt-8 bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Play className="w-8 h-8 mr-3 text-green-500" />
                    Tráiler Oficial
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                      title={`Tráiler de ${movie.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-3 text-center">
                    Tráiler oficial de {movie.title} ({movie.year})
                  </p>
                </div>
              )}

              {/* Análisis Editorial */}
              {movie.longDescription && (
                <div className="mt-8 bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-red-500" />
                    Análisis Editorial
                  </h3>
                  <div 
                    className="text-gray-300 text-lg leading-relaxed max-w-none
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-6
                      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-red-400 [&>h3]:mb-3 [&>h3]:mt-5
                      [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed
                      [&>p:first-of-type]:text-xl [&>p:first-of-type]:text-gray-200 [&>p:first-of-type]:font-medium
                      [&>strong]:text-white [&>strong]:font-semibold
                      [&>em]:text-gray-200 [&>em]:italic
                      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                      [&>li]:mb-2 [&>li]:text-gray-300
                      [&>blockquote]:border-l-4 [&>blockquote]:border-red-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-200 [&>blockquote]:bg-gray-800/30 [&>blockquote]:py-2 [&>blockquote]:rounded-r
                    "
                    dangerouslySetInnerHTML={{ __html: movie.longDescription }}
                  />
                </div>
              )}

              {/* Galería de Escenas */}
              <div className="mt-8 bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Camera className="w-8 h-8 mr-3 text-blue-500" />
                  Galería de Escenas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(sceneGallery) && sceneGallery.map((scene: any, index: number) => (
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
                      </div>
                      <div className="mt-3">
                        <h4 className="text-white font-semibold">{scene.title}</h4>
                        <p className="text-gray-400 text-sm">{scene.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reparto Principal */}
              {Array.isArray(castData) && castData.length > 0 && (
                <div className="mt-8 bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <User className="w-8 h-8 mr-3 text-purple-500" />
                    Reparto Principal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {castData.slice(0, 6).map((actor: any, index: number) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center group hover:bg-gray-800/70 transition-colors">
                        <div className="relative mb-4">
                          <Image
                            src={actor.image || actor.photo || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'}
                            alt={actor.name}
                            width={120}
                            height={120}
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-red-500/30 group-hover:border-red-500 transition-colors"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-1">{actor.name}</h4>
                          <p className="text-red-400 text-sm mb-2">{actor.character}</p>
                          {actor.bio && (
                            <p className="text-gray-400 text-xs leading-relaxed">{actor.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="mt-8 bg-gradient-to-r from-red-900/20 to-blue-900/20 border border-red-600/30 rounded-lg p-8">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    ¿Te gustó este análisis?
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Suscríbete a nuestro newsletter y recibe análisis exclusivos, noticias del Spider-Verse y contenido premium directamente en tu email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    />
                    <Button className="bg-red-600 hover:bg-red-700 px-8">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Suscribirse
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Sin spam. Solo contenido de calidad sobre Spider-Man.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Movie Poster */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-red-600/20">
                  <Image
                    src={movie.image}
                    alt={`${movie.title} (${movie.year}) - Póster`}
                    width={300}
                    height={450}
                    className="w-full rounded-lg"
                  />
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                {/* Productos Recomendados */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-red-600/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🎥 Productos de la Película
                  </h3>
                  <div className="space-y-4">
                    <AmazonProduct
                      title={`${movie.title} 4K Blu-ray`}
                      description="Edición de coleccionista en 4K Ultra HD"
                      price="$29.99"
                      originalPrice="$39.99"
                      discount={25}
                      category="Blu-ray"
                      tags={['Spider-Man', '4K', 'Película']}
                      searchQuery={`${movie.title} ${movie.year} 4K blu-ray`}
                      className="max-w-none"
                    />
                    <AmazonProduct
                      title={`${movie.title} Poster`}
                      description="Póster oficial de la película"
                      price="$14.99"
                      category="Póster"
                      tags={['Spider-Man', 'Poster', 'Wall Art']}
                      searchQuery={`${movie.title} movie poster official`}
                      className="max-w-none"
                    />
                    <AmazonProduct
                      title="Spider-Man Funko Pop"
                      description="Figura coleccionable de Spider-Man"
                      price="$12.99"
                      category="Figura"
                      tags={['Spider-Man', 'Funko', 'Coleccionable']}
                      searchQuery="Spider-Man Funko Pop figure"
                      className="max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-red-950/10 to-blue-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Películas Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMovies.map((relatedMovie: any) => (
                <Card key={relatedMovie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={relatedMovie.image}
                        alt={`${relatedMovie.title} (${relatedMovie.year})`}
                        width={300}
                        height={450}
                        className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        {relatedMovie.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-white mb-2 line-clamp-2">
                      <Link href={`/peliculas/${relatedMovie.slug}`} className="hover:text-red-400 transition-colors">
                        {relatedMovie.title} ({relatedMovie.year})
                      </Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {relatedMovie.description}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/peliculas/${relatedMovie.slug}`}>
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

      {/* SEO Footer Content */}
      <section className="py-16 bg-gray-900/30 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🎬 Análisis Completo</h3>
              <p className="text-gray-400">
                Análisis profundo de {movie.title} con crítica especializada, 
                datos técnicos y contexto dentro del universo Spider-Man.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🕷️ Spider-Verse</h3>
              <p className="text-gray-400">
                Descubre cómo {movie.title} se conecta con el resto del Spider-Verse 
                y su importancia en la cronología del trepamuros.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🛒 Productos Oficiales</h3>
              <p className="text-gray-400">
                Encuentra merchandise oficial, ediciones especiales y productos 
                coleccionables de {movie.title} en nuestra tienda afiliada.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              {movie.title} ({movie.year}) | Análisis y reseña completa en Spider-World | 
              La web definitiva sobre el universo Spider-Man | Películas, cómics, series y más
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 