import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Play, BookOpen, Gamepad2, Monitor, ShoppingBag, TrendingUp } from "lucide-react"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { movieService, comicService, gameService, seriesService, blogService, productService, prisma } from "@/lib/database"
import { PeterParkerIntro } from "@/components/home/PeterParkerIntro"
import { SITE_URL } from "@/lib/config"
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
    const [movies, comics, games, series, blogPosts, products, movieCount, comicCount, gameCount, seriesCount] = await Promise.all([
      movieService.getFeatured(4),
      comicService.getFeatured(4),
      gameService.getFeatured(20),
      seriesService.getFeatured(4),
      blogService.getRecent(4),
      productService.getFeatured(4),
      prisma.movie.count(),
      prisma.comic.count(),
      prisma.game.count(),
      prisma.series.count(),
    ])

    // Poner "Cruzando el Multiverso" como película destacada (primera)
    const cruzandoIdx = movies.findIndex((m) => m.slug.includes('cruzando'))
    const orderedMovies = cruzandoIdx > 0
      ? [movies[cruzandoIdx], ...movies.filter((_, i) => i !== cruzandoIdx)]
      : movies

    // Juegos destacados seleccionados manualmente para mostrar variedad de épocas
    const featuredSlugs = [
      'spider-man-2-enter-electro-2001',
      'spider-man-shattered-dimensions-2010',
      'spider-man-2-the-game-2004',
      'marvel-s-spider-man-2-2023',
    ]
    const diverseGames = (featuredSlugs
      .map(slug => games.find(g => g.slug === slug))
      .filter(Boolean) as typeof games)
      .sort((a, b) => b.year - a.year)

    return {
      movies: orderedMovies,
      comics,
      games: diverseGames.length === 4 ? diverseGames : games.slice(0, 4),
      series,
      blogPosts,
      products,
      counts: { movies: movieCount, comics: comicCount, games: gameCount, series: seriesCount }
    }
  } catch (error) {
    console.error('Error fetching featured content:', error)
    return {
      movies: [],
      comics: [],
      games: [],
      series: [],
      blogPosts: [],
      products: [],
      counts: { movies: 0, comics: 0, games: 0, series: 0 }
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
  const { counts } = featuredContent

  const BASE_URL = SITE_URL

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Spider-World',
    url: BASE_URL,
    description: 'La guía definitiva de Spider-Man: películas, cómics, videojuegos, series y más.',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Spider-World',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icons/spider-512.svg`,
      width: 512,
      height: 512,
    },
    description: 'Spider-World es la guía definitiva del universo Spider-Man en español: análisis de películas, cómics, videojuegos, series y personajes.',
    inLanguage: 'es',
    foundingDate: '2024',
    areaServed: { '@type': 'Country', name: 'Spain' },
    knowsAbout: ['Spider-Man', 'Marvel Comics', 'Cómics', 'Películas de superhéroes', 'Videojuegos Marvel'],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
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
            <Link href="/personajes">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                Explorar el Universo
              </Button>
            </Link>
            <Link href="/peliculas">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Películas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Peter Parker Introduction */}
      <PeterParkerIntro counts={counts} />

      {/* Navegación rápida por categorías */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { href: "#peliculas",    icon: Play,       label: "Películas",    color: "text-red-400",    bg: "hover:bg-red-500/10 hover:border-red-500/40" },
            { href: "#comics",       icon: BookOpen,   label: "Cómics",       color: "text-blue-400",   bg: "hover:bg-blue-500/10 hover:border-blue-500/40" },
            { href: "#videojuegos",  icon: Gamepad2,   label: "Videojuegos",  color: "text-green-400",  bg: "hover:bg-green-500/10 hover:border-green-500/40" },
            { href: "#series",       icon: Monitor,    label: "Series",       color: "text-purple-400", bg: "hover:bg-purple-500/10 hover:border-purple-500/40" },
            { href: "#blog",         icon: TrendingUp, label: "Blog",         color: "text-orange-400", bg: "hover:bg-orange-500/10 hover:border-orange-500/40" },
            { href: "#tienda",       icon: ShoppingBag,label: "Tienda",       color: "text-yellow-400", bg: "hover:bg-yellow-500/10 hover:border-yellow-500/40" },
          ].map(({ href, icon: Icon, label, color, bg }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border border-white/10 bg-gray-900/40 transition-all duration-200 group ${bg}`}
            >
              <Icon className={`w-7 h-7 ${color} group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Movies */}
      <section id="peliculas" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-red-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Play className="w-8 h-8 mr-3 text-red-500" />
            Películas Destacadas
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/peliculas">Ver todas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Película destacada grande */}
          {featuredContent.movies[0] && (
            <Link href={`/peliculas/${featuredContent.movies[0].slug}`} className="lg:col-span-1 group">
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[420px] shadow-xl">
                <Image
                  src={featuredContent.movies[0].image}
                  alt={`${featuredContent.movies[0].title} - Película de Spider-Man`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <Badge className="mb-3 bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {featuredContent.movies[0].rating}
                  </Badge>
                  <h3 className="text-white text-2xl font-bold mb-2 leading-tight">
                    {featuredContent.movies[0].title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{featuredContent.movies[0].description}</p>
                  <div className="flex gap-3 mt-3 text-sm text-gray-400">
                    <span>{featuredContent.movies[0].year}</span>
                    <span>{featuredContent.movies[0].duration}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 3 películas pequeñas apiladas */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {featuredContent.movies.slice(1).map((movie: Movie) => (
              <Link key={movie.id} href={`/peliculas/${movie.slug}`} className="group">
                <div className="flex gap-4 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 rounded-xl p-3 transition-all">
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={movie.image}
                      alt={`${movie.title} - Película de Spider-Man`}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <Badge className="bg-yellow-600 w-fit mb-2 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.rating}
                    </Badge>
                    <h3 className="text-white font-semibold line-clamp-1 group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{movie.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Featured Comics */}
      <section id="comics" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-blue-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
            Cómics Destacados
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/comics">Ver todos</Link>
          </Button>
        </div>

        {/* Grid que ocupa toda la sección */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredContent.comics.map((comic: Comic) => (
            <Link
              key={comic.id}
              href={`/comics/${comic.slug}`}
              className="group"
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg shadow-blue-900/30">
                <Image
                  src={comic.image}
                  alt={`${comic.title} - Cómic de Spider-Man`}
                  width={400}
                  height={600}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-2 right-2 bg-yellow-600 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {comic.rating}
                </Badge>
                <Badge className="absolute top-2 left-2 bg-green-600 text-xs">
                  {comic.price}
                </Badge>
              </div>
              <div className="mt-3 px-1">
                <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {comic.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{comic.writer} · {comic.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section id="videojuegos" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-green-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Gamepad2 className="w-8 h-8 mr-3 text-green-500" />
            Videojuegos Destacados
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/videojuegos">Ver todos</Link>
          </Button>
        </div>

        {/* 2 columnas con cards landscape grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredContent.games.map((game: Game) => (
            <Link key={game.id} href={`/videojuegos/${game.slug}`} className="group">
              <div className="relative rounded-2xl overflow-hidden h-52 shadow-xl shadow-green-900/20">
                <Image
                  src={game.image}
                  alt={`${game.title} - Videojuego de Spider-Man`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Badge className="bg-yellow-600 w-fit mb-2 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {game.rating}
                  </Badge>
                  <h3 className="text-white text-xl font-bold leading-tight group-hover:text-green-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-1 mt-1">{game.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>{game.developer}</span>
                    <span>{game.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Series */}
      <section id="series" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-purple-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Monitor className="w-8 h-8 mr-3 text-purple-500" />
            Series Destacadas
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/series">Ver todas</Link>
          </Button>
        </div>

        {/* 3 pequeñas izquierda + destacada grande derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3 series pequeñas con borde púrpura */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {featuredContent.series.slice(1).map((serie: Series) => (
              <Link key={serie.id} href={`/series/${serie.slug}`} className="group">
                <div className="flex gap-4 bg-gray-900/60 hover:bg-purple-950/40 border-l-4 border-l-purple-600 border border-gray-700/50 rounded-xl p-4 transition-all">
                  <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={serie.image}
                      alt={`${serie.title} - Serie de Spider-Man`}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-black/70 rounded text-center text-xs text-purple-300 py-0.5">
                      {serie.seasons} temp.
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors text-base">
                      {serie.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{serie.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                        <Star className="w-3 h-3 fill-yellow-400" />{serie.rating}
                      </span>
                      <span className="text-gray-500 text-xs">{serie.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Serie destacada grande a la derecha con glow púrpura */}
          {featuredContent.series[0] && (
            <Link href={`/series/${featuredContent.series[0].slug}`} className="lg:col-span-1 group">
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[420px] shadow-xl shadow-purple-900/40 ring-1 ring-purple-700/30">
                <Image
                  src={featuredContent.series[0].image}
                  alt={`${featuredContent.series[0].title} - Serie de Spider-Man`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <Badge className="mb-3 bg-purple-700 border-purple-500">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {featuredContent.series[0].rating}
                  </Badge>
                  <h3 className="text-white text-2xl font-bold mb-2 leading-tight group-hover:text-purple-300 transition-colors">
                    {featuredContent.series[0].title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{featuredContent.series[0].description}</p>
                  <div className="flex gap-3 mt-3 text-sm text-gray-400">
                    <span>{featuredContent.series[0].seasons} temporadas</span>
                    <span>{featuredContent.series[0].year}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section id="blog" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-orange-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-orange-500" />
            Últimas Noticias
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/blog">Ver todas</Link>
          </Button>
        </div>

        {/* Artículo grande izquierda + lista de 3 derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {featuredContent.blogPosts[0] && (
            <Link href={`/blog/${featuredContent.blogPosts[0].slug}`} className="lg:col-span-3 group h-full">
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] shadow-xl">
                <Image
                  src={featuredContent.blogPosts[0].image || "/placeholder.svg?height=300&width=600"}
                  alt={`${featuredContent.blogPosts[0].title} - Blog Spider-World`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 mb-3 text-orange-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(featuredContent.blogPosts[0].publishDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <h3 className="text-white text-xl font-bold line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {featuredContent.blogPosts[0].title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mt-2">{featuredContent.blogPosts[0].excerpt}</p>
                </div>
              </div>
            </Link>
          )}

          <div className="lg:col-span-2 flex flex-col gap-4">
            {featuredContent.blogPosts.slice(1).map((post: BlogPost) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 rounded-xl p-4 transition-all">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg?height=80&width=80"}
                    alt={`${post.title} - Blog Spider-World`}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="tienda" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-yellow-950/20 -z-10" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-yellow-500" />
            Productos Destacados
          </h2>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
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

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

    </div>
  )
}
