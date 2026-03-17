import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, ShoppingCart, Calendar, Monitor, User, ArrowLeft, Award, Camera, Users, BookOpen, Play, Mail, CheckCircle } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { gameService } from "@/lib/database"
import { renderStars, generateAmazonUrl, convertToEmbedUrl } from "@/lib/content-helpers"


type Props = {
  params: Promise<{ slug: string }>
}

// Función para obtener videojuego por slug desde la base de datos
async function getGameBySlug(slug: string) {
  try {
    return await gameService.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
}


// Función para obtener videojuegos relacionados
async function getRelatedGames(currentSlug: string, limit: number = 4) {
  try {
    const games = await gameService.getFeatured(limit + 1);
    return games.filter((game: any) => game.slug !== currentSlug).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related games:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = await getGameBySlug(slug)
  
  if (!game) {
    return {
      title: "Videojuego no encontrado | Spider-World",
      description: "El videojuego que buscas no está disponible.",
    }
  }

  const description = game.description 
    ? game.description.substring(0, 155) + '...'
    : `Descubre ${game.title}, videojuego de Spider-Man con análisis completo, gameplay y dónde comprarlo.`;

  return {
    title: `${game.title} (${game.year}) - Análisis Completo | Spider-World`,
    description,
    keywords: ['Spider-Man', 'videojuego', game.title, game.year.toString(), 'análisis', 'gameplay'],
    openGraph: {
      title: `${game.title} (${game.year}) - Análisis Completo | Spider-World`,
      description,
      images: [game.image],
      type: "article",
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
  const game = await getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  // Obtener videojuegos relacionados
  const relatedGames = await getRelatedGames(slug);


  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/30 to-black/80"></div>
        <div className="absolute inset-0">
          <Image
            src={game.image}
            alt={`${game.title} - Videojuego de Spider-Man`}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Link href="/videojuegos">
              <Button variant="outline" size="sm" className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Videojuegos
              </Button>
            </Link>
            <Badge className="bg-green-600 text-white px-6 py-3 text-lg font-semibold">
              {(game.importance ?? 0) >= 9 ? 'Juego Esencial' : 'Videojuego Spider-Man'}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
            {game.title}
          </h1>
          
          {game.subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {game.subtitle}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              <span>{game.year}</span>
            </div>
            <div className="flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-blue-500" />
              <span>{Array.isArray(game.platform) ? game.platform.join(", ") : game.platform}</span>
            </div>
            {game.developer && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                <span>{game.developer}</span>
              </div>
            )}
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{game.rating}/10</span>
            </div>
          </div>

          {game.description && (
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              {game.description.length > 200 ? game.description.substring(0, 200) + '...' : game.description}
            </p>
          )}

          <div className="mb-8">{renderStars(game.rating)}</div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {game.playUrl && (
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                asChild
              >
                <a href={game.playUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Tráiler
                </a>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
              asChild
            >
              <a href={generateAmazonUrl(`${game.title} ${Array.isArray(game.platform) ? game.platform[0] : game.platform} game`)} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar Ahora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Game Info */}
      <section className="py-20 bg-gradient-to-b from-black to-green-950/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Información del Videojuego</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Gamepad2 className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Título</span>
                        <div className="text-white font-semibold">{game.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Año de lanzamiento</span>
                        <div className="text-white font-semibold">{game.year}</div>
                      </div>
                    </div>
                    {game.developer && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Desarrollador</span>
                          <div className="text-white font-semibold">{game.developer}</div>
                        </div>
                      </div>
                    )}
                    {game.publisher && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Distribuidor</span>
                          <div className="text-white font-semibold">{game.publisher}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Plataformas</span>
                        <div className="text-white font-semibold">
                          {Array.isArray(game.platform) ? game.platform.join(", ") : game.platform}
                        </div>
                      </div>
                    </div>
                    {game.genre && (
                      <div className="flex items-center space-x-3">
                        <Gamepad2 className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Género</span>
                          <div className="text-white font-semibold">
                            {game.genre || 'No especificado'}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Calificación</span>
                        <div className="text-white font-semibold">{game.rating}/10</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-red-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Importancia</span>
                        <div className="text-white font-semibold">
                          {(game.importance ?? 0) >= 9 ? 'Esencial' : (game.importance ?? 0) >= 7 ? 'Muy Importante' : 'Importante'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sinopsis */}
              {game.description && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Sinopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {game.description}
                  </p>
                </div>
              )}

              {/* Tráiler del Juego */}
              {game.playUrl && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Play className="w-8 h-8 mr-3 text-green-500" />
                    Tráiler Oficial
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={convertToEmbedUrl(game.playUrl)}
                      title={`Tráiler de ${game.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-3 text-center">
                    Tráiler oficial de {game.title} ({game.year})
                  </p>
                </div>
              )}

              {/* Análisis Completo */}
              {game.longDescription && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Award className="w-8 h-8 mr-3 text-green-500" />
                    Análisis Editorial
                  </h3>
                  <div 
                    className="text-gray-300 text-lg leading-relaxed max-w-none
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-6
                      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-green-400 [&>h3]:mb-3 [&>h3]:mt-5
                      [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed
                      [&>p:first-of-type]:text-xl [&>p:first-of-type]:text-gray-200 [&>p:first-of-type]:font-medium
                      [&>strong]:text-white [&>strong]:font-semibold
                      [&>em]:text-gray-200 [&>em]:italic
                      [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
                      [&>li]:mb-2 [&>li]:text-gray-300
                      [&>blockquote]:border-l-4 [&>blockquote]:border-green-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-200 [&>blockquote]:bg-gray-800/30 [&>blockquote]:py-2 [&>blockquote]:rounded-r
                    "
                    dangerouslySetInnerHTML={{ __html: game.longDescription }}
                  />
                </div>
              )}

              {/* Galería de Capturas */}
              {game.screenshotImages && Array.isArray(game.screenshotImages) && game.screenshotImages.length > 0 && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Camera className="w-8 h-8 mr-3 text-blue-500" />
                    Galería de Capturas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {game.screenshotImages.map((screenshot: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={screenshot.url}
                            alt={screenshot.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{screenshot.title}</h4>
                          <p className="text-gray-400 text-sm">{screenshot.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personajes Principales */}
              {game.characterImages && Array.isArray(game.characterImages) && game.characterImages.length > 0 && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-purple-500" />
                    Personajes Principales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {game.characterImages.slice(0, 6).map((character: any, index: number) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center group hover:bg-gray-800/70 transition-colors">
                        <div className="relative mb-4">
                          <Image
                            src={character.image || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'}
                            alt={character.name}
                            width={120}
                            height={120}
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-green-500/30 group-hover:border-green-500 transition-colors"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-1">{character.name}</h4>
                          <p className="text-green-400 text-sm mb-2">{character.role || 'Personaje'}</p>
                          {character.description && (
                            <p className="text-gray-400 text-xs leading-relaxed">{character.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Arte Conceptual */}
              {game.conceptArt && Array.isArray(game.conceptArt) && game.conceptArt.length > 0 && (
                <div className="mt-8 bg-gray-900/50 border border-green-600/20 rounded-lg p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Palette className="w-8 h-8 mr-3 text-green-400" />
                    Arte Conceptual
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {game.conceptArt.map((art: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={art.url}
                            alt={art.title}
                            width={400}
                            height={225}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Palette className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-white font-semibold">{art.title}</h4>
                          <p className="text-gray-400 text-sm">{art.description}</p>
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
                {/* Game Cover */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-green-600/20">
                  <Image
                    src={game.image}
                    alt={`${game.title} (${game.year}) - Portada`}
                    width={300}
                    height={450}
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4 text-center">{renderStars(game.rating)}</div>
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                {/* Newsletter */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-lg p-6">
                  <div className="text-center">
                    <Mail className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-3">
                      ¿Te gustó este análisis?
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm">
                      Recibe análisis exclusivos de videojuegos Spider-Man.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm"
                      />
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Suscribirse
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Productos Recomendados */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-green-600/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🎮 Productos del Juego
                  </h3>
                  <div className="space-y-4">
                    <AmazonProduct
                      title={`${game.title} - ${Array.isArray(game.platform) ? game.platform[0] : game.platform}`}
                      description="Versión física del videojuego"
                      price="$49.99"
                      originalPrice="$59.99"
                      discount={17}
                      category="Videojuego"
                      tags={['Spider-Man', 'Gaming', Array.isArray(game.platform) ? game.platform[0] : game.platform]}
                      searchQuery={`${game.title} ${Array.isArray(game.platform) ? game.platform[0] : game.platform} game`}
                      className="max-w-none"
                    />
                    <AmazonProduct
                      title={`${game.title} Collector's Edition`}
                      description="Edición de coleccionista con extras"
                      price="$149.99"
                      category="Videojuego"
                      tags={['Spider-Man', 'Collector', 'Gaming']}
                      searchQuery={`${game.title} collector edition`}
                      className="max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-green-950/10 to-red-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Videojuegos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame: any) => (
                <Card key={relatedGame.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={relatedGame.image}
                        alt={`${relatedGame.title} (${relatedGame.year})`}
                        width={300}
                        height={450}
                        className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        {relatedGame.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-white mb-2 line-clamp-2">
                      <Link href={`/videojuegos/${relatedGame.slug}`} className="hover:text-green-400 transition-colors">
                        {relatedGame.title} ({relatedGame.year})
                      </Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {relatedGame.description}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/videojuegos/${relatedGame.slug}`}>
                        <Gamepad2 className="w-4 h-4 mr-1" />
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
              <h3 className="text-xl font-bold text-white mb-4">🎮 Análisis Completo</h3>
              <p className="text-gray-400">
                Análisis profundo de {game.title} con crítica especializada, 
                gameplay detallado y contexto dentro del universo Spider-Man.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🕷️ Spider-Verse Gaming</h3>
              <p className="text-gray-400">
                Descubre cómo {game.title} se conecta con otros videojuegos del Spider-Verse 
                y su evolución en la historia del gaming.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🛒 Gaming Store</h3>
              <p className="text-gray-400">
                Encuentra {game.title}, DLCs, ediciones especiales y merchandise 
                en nuestras tiendas afiliadas al mejor precio.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              {game.title} ({game.year}) | Análisis y review completo en Spider-World | 
              La web definitiva sobre videojuegos Spider-Man | Gaming, análisis, tráilers y más
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 