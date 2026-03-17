import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Clock, Play, BookOpen, Gamepad2, Monitor, ShoppingBag, ShoppingCart, Users, TrendingUp, Award } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { movieService, comicService, gameService, seriesService, blogService, productService } from "@/lib/database"
import { Movie, Comic, Game, Series, BlogPost, Product } from "@prisma/client"

export const metadata = {
  title: "Spider-World - El Universo Completo de Spider-Man",
  description: "Descubre todo sobre Spider-Man: películas, cómics, videojuegos, series y productos oficiales. La guía definitiva del trepamuros.",
  keywords: ["Spider-Man", "Marvel", "cómics", "películas", "videojuegos", "Peter Parker", "Spider-Verse"],
  openGraph: {
    title: "Spider-World - El Universo Completo de Spider-Man",
    description: "La guía definitiva de Spider-Man con análisis, reseñas y productos oficiales",
    images: ["https://image.tmdb.org/t/p/w1200/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"],
  }
}

// Función para obtener datos destacados
async function getFeaturedContent() {
  try {
    const [movies, comics, games, series, blogPosts, products] = await Promise.all([
      movieService.getFeatured(4),
      comicService.getFeatured(4), 
      gameService.getFeatured(4),
      seriesService.getFeatured(4),
      blogService.getRecent(4),
      productService.getFeatured(4)
    ])

    return {
      movies,
      comics,
      games,
      series,
      blogPosts,
      products
    }
  } catch (error) {
    console.error('Error fetching featured content:', error)
    return {
      movies: [],
      comics: [],
      games: [],
      series: [],
      blogPosts: [],
      products: []
    }
  }
}

// Componente simple para el hero con efecto breathing
function SimpleHero() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fondo base */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/inihero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Capa con efecto breathing */}
      <div 
        className="absolute inset-0 animate-spider-breathe"
        style={{
          backgroundImage: "url('/images/inihero.jpg')",
          backgroundSize: '105% 105%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8,
        }}
      />
      
      {/* Capa con efecto pulse */}
      <div 
        className="absolute inset-0 animate-spider-pulse"
        style={{
          backgroundImage: "url('/images/inihero.jpg')",
          backgroundSize: '102% 102%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Efecto shimmer sutil */}
      <div className="absolute inset-0 web-shimmer opacity-30" />
      
      {/* Partículas de telaraña temáticas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Partícula 1 - como una gota de telaraña */}
        <div className="absolute top-1/4 left-1/4 w-2 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '5s' }} />
        
        {/* Partícula 2 - como hilo de telaraña */}
        <div className="absolute top-1/3 right-1/3 w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '6s' }} />
        
        {/* Partícula 3 - punto de anclaje */}
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse shadow-white/50 shadow-lg" 
             style={{ animationDelay: '4s', animationDuration: '4s' }} />
        
        {/* Partícula 4 - hilo diagonal */}
        <div className="absolute bottom-1/3 right-1/4 w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rotate-45" 
             style={{ animationDelay: '1s', animationDuration: '7s' }} />
      </div>
    </div>
  )
}

export default async function HomePage() {
  const featuredContent = await getFeaturedContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Hero Section */}
     {/* Hero Section */}
     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-blue-900/30"></div>
        <div className="absolute inset-0">
          <SimpleHero />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
            Spider-Man: Todo sobre Películas, Cómics, Juegos y Más
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explora el universo arácnido, desde sus inicios hasta lo último en multiverso. Tu portal definitivo al
            Spider-Verse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tienda">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ver Productos Recomendados
              </Button>
            </Link>
            <Link href="/peliculas">
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Explorar Películas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Play className="w-8 h-8 mr-3 text-red-500" />
            Películas Destacadas
          </h2>
          <Button asChild variant="outline">
            <Link href="/peliculas">Ver todas</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.movies.map((movie: Movie) => (
            <Card key={movie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={movie.image}
                    alt={`${movie.title} - Película de Spider-Man`}
                    width={300}
                    height={450}
                    className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {movie.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">
                  <Link href={`/peliculas/${movie.slug}`}>{movie.title}</Link>
                </CardTitle>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{movie.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Featured Comics */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
            Cómics Destacados
          </h2>
          <Button asChild variant="outline">
            <Link href="/comics">Ver todos</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.comics.map((comic: Comic) => (
            <Card key={comic.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={comic.image}
                    alt={`${comic.title} - Cómic de Spider-Man`}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {comic.rating}
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-green-600">
                    {comic.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">
                  <Link href={`/comics/${comic.slug}`}>{comic.title}</Link>
                </CardTitle>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{comic.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{comic.writer}</span>
                  <span>{comic.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Gamepad2 className="w-8 h-8 mr-3 text-green-500" />
            Videojuegos Destacados
          </h2>
          <Button asChild variant="outline">
            <Link href="/videojuegos">Ver todos</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.games.map((game: Game) => (
            <Card key={game.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={game.image}
                    alt={`${game.title} - Videojuego de Spider-Man`}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {game.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">
                  <Link href={`/videojuegos/${game.slug}`}>{game.title}</Link>
                </CardTitle>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{game.developer}</span>
                  <span>{game.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Series */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Monitor className="w-8 h-8 mr-3 text-purple-500" />
            Series Destacadas
          </h2>
          <Button asChild variant="outline">
            <Link href="/series">Ver todas</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.series.map((serie: Series) => (
            <Card key={serie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={serie.image}
                    alt={`${serie.title} - Serie de Spider-Man`}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {serie.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">
                  <Link href={`/series/${serie.slug}`}>{serie.title}</Link>
                </CardTitle>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{serie.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{serie.seasons} temporadas</span>
                  <span>{serie.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-orange-500" />
            Últimas Noticias
          </h2>
          <Button asChild variant="outline">
            <Link href="/blog">Ver todas</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.blogPosts.map((post: BlogPost) => (
            <Card key={post.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={post.image || "/placeholder.svg?height=300&width=400"}
                    alt={`${post.title} - Blog Spider-World`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-yellow-500" />
            Productos Destacados
          </h2>
          <Button asChild variant="outline">
            <Link href="/tienda">Ver tienda</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContent.products.map((product: Product) => (
            <AmazonProduct
              key={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice ?? undefined}
              rating={product.rating}
              reviews={parseInt(product.reviews)}
              imageUrl={product.image}
              category={product.category}
              tags={product.keywords || []}
              discount={product.discount ? parseInt(product.discount.replace('%', '').replace(' OFF', '')) : undefined}
              inStock={product.inStock}
            />
          ))}
        </div>
      </section>

      {/* Sidebar Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SidebarAd />
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-3xl font-bold text-red-500 mb-2">{featuredContent.movies.length}+</div>
            <div className="text-gray-400">Películas Analizadas</div>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold text-blue-500 mb-2">{featuredContent.comics.length}+</div>
            <div className="text-gray-400">Cómics Reseñados</div>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold text-green-500 mb-2">{featuredContent.games.length}+</div>
            <div className="text-gray-400">Videojuegos Cubiertos</div>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold text-purple-500 mb-2">{featuredContent.series.length}+</div>
            <div className="text-gray-400">Series Documentadas</div>
          </div>
        </div>
      </section>
    </div>
  )
}
