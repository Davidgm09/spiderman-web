import Image from "next/image"
import Link from "next/link"
import { Calendar, Play, ShoppingCart, Star, Clock, Award, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { SpiderManMovie, AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { movieService } from "@/lib/database"

export const metadata = {
  title: "Películas de Spider-Man - Todas las Sagas | Spider-World",
  description:
    "Todas las películas de Spider-Man: Trilogía de Raimi, Amazing Spider-Man, MCU y Spider-Verse. Análisis completos, ratings y dónde verlas.",
  keywords: ["Spider-Man películas", "Tobey Maguire", "Andrew Garfield", "Tom Holland", "Spider-Verse", "Marvel", "Sony"],
}

// Función para organizar películas por universo
function organizeMoviesByUniverse(movies: any[]) {
  const universes = {
    raimi: {
      title: "Trilogía de Sam Raimi (Tobey Maguire)",
      description: "La saga original que definió el cine de superhéroes moderno",
      color: "red",
      years: "2002-2007",
      movies: [] as any[]
    },
    amazing: {
      title: "The Amazing Spider-Man (Andrew Garfield)",
      description: "Una nueva visión moderna y emotiva del héroe arácnido",
      color: "blue",
      years: "2012-2014",
      movies: [] as any[]
    },
    mcu: {
      title: "Marvel Cinematic Universe (Tom Holland)",
      description: "Spider-Man se une al universo cinematográfico de Marvel",
      color: "purple",
      years: "2016-2024",
      movies: [] as any[]
    },
    spiderverse: {
      title: "Spider-Verse (Animación)",
      description: "La revolución animada que cambió el cine de superhéroes",
      color: "green",
      years: "2018-2024",
      movies: [] as any[]
    },
    related: {
      title: "Universo Relacionado",
      description: "Venom, Morbius y otros personajes del Spider-Verse",
      color: "orange",
      years: "2018-2024",
      movies: [] as any[]
    }
  };

  movies.forEach(movie => {
    const title = movie.title.toLowerCase();
    const year = movie.year;
    
    if (title.includes('into the spider-verse') || title.includes('across the spider-verse') || title.includes('beyond the spider-verse') || title.includes('spider-verse')) {
      universes.spiderverse.movies.push(movie);
    } else if (title.includes('amazing spider-man')) {
      universes.amazing.movies.push(movie);
    } else if (title.includes('homecoming') || title.includes('far from home') || title.includes('no way home')) {
      universes.mcu.movies.push(movie);
    } else if (title.includes('venom') || title.includes('morbius') || title.includes('kraven') || title.includes('madame web')) {
      universes.related.movies.push(movie);
    } else if (year >= 2002 && year <= 2007 && title.includes('spider-man')) {
      universes.raimi.movies.push(movie);
    } else {
      // Si no encaja en ninguna categoría específica, añadir al MCU por defecto
      universes.mcu.movies.push(movie);
    }
  });

  // Ordenar películas por año dentro de cada universo
  Object.values(universes).forEach(universe => {
    universe.movies.sort((a, b) => a.year - b.year);
  });

  return universes;
}

// Función para formatear fecha
function formatDate(year: number): string {
  return year.toString();
}

// Función para formatear duración
function formatRuntime(duration?: string): string {
  return duration || 'Duración no disponible';
}

// Función para formatear recaudación
function formatRevenue(boxOffice?: string): string {
  return boxOffice || 'No disponible';
}

// Función para generar URL de Amazon para una película
function generateAmazonMovieUrl(title: string, year: string): string {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const query = encodeURIComponent(`${title} ${year} película blu-ray`);
  return `https://www.amazon.com/s?k=${query}&tag=${amazonTag}`;
}

export default async function PeliculasPage() {
  // Obtener películas de la base de datos
  const movies = await movieService.getAll();
  
  // Organizar por universos
  const universes = organizeMoviesByUniverse(movies);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Películas de Spider-Man
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Todas las películas del trepamuros: desde Sam Raimi hasta el Spider-Verse
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2">
              {movies.length} Películas
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Múltiples Universos
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2">
              Análisis Completos
            </Badge>
          </div>
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Movies by Universe */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.entries(universes).map(([key, universe]) => {
          if (universe.movies.length === 0) return null;
          
          const colorClasses = {
            red: "from-red-600/20 to-red-800/20 border-red-600/30",
            blue: "from-blue-600/20 to-blue-800/20 border-blue-600/30", 
            purple: "from-purple-600/20 to-purple-800/20 border-purple-600/30",
            green: "from-green-600/20 to-green-800/20 border-green-600/30",
            orange: "from-orange-600/20 to-orange-800/20 border-orange-600/30"
          };

          return (
            <section key={key} className="mb-16">
              <div className={`bg-gradient-to-r ${colorClasses[universe.color as keyof typeof colorClasses]} border rounded-lg p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {universe.title}
                    </h2>
                    <p className="text-gray-300 mb-2">{universe.description}</p>
                    <Badge className="bg-gray-700 text-gray-300">
                      {universe.years}
                    </Badge>
                  </div>
                  <Badge className="bg-white/10 text-white text-lg px-4 py-2">
                    {universe.movies.length} película{universe.movies.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {universe.movies.map((movie: any) => (
                  <Card key={movie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image
                          src={movie.image}
                          alt={`${movie.title} - Película de Spider-Man`}
                          width={400}
                          height={600}
                          className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Rating Badge */}
                        <Badge className="absolute top-2 right-2 bg-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          {movie.rating}
                        </Badge>
                        
                        {/* Year Badge */}
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                          {movie.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2 line-clamp-2">
                        <Link href={`/peliculas/${movie.slug}`} className="hover:text-red-400 transition-colors">
                          {movie.title}
                        </Link>
                      </CardTitle>
                      
                      {movie.subtitle && (
                        <CardDescription className="text-gray-400 text-sm mb-2">
                          {movie.subtitle}
                        </CardDescription>
                      )}
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {movie.description}
                      </p>
                      
                      {/* Movie Details */}
                      <div className="space-y-2 mb-4">
                        {movie.director && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Award className="w-4 h-4 mr-2" />
                            <span>Director: {movie.director}</span>
                          </div>
                        )}
                        
                        {movie.duration && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{formatRuntime(movie.duration)}</span>
                          </div>
                        )}
                        
                        {movie.boxOffice && (
                          <div className="flex items-center text-sm text-gray-400">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>Recaudación: {formatRevenue(movie.boxOffice)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/peliculas/${movie.slug}`}>
                            <Play className="w-4 h-4 mr-1" />
                            Ver Análisis
                          </Link>
                        </Button>
                        
                        <Button 
                          asChild 
                          size="sm" 
                          variant="outline"
                          className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                        >
                          <a 
                            href={generateAmazonMovieUrl(movie.title, movie.year.toString())}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Comprar
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Productos Relacionados con Spider-Man
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SpiderManMovie title="Spider-Man" year="2002" />
          <SpiderManMovie title="Spider-Man Into the Spider-Verse" year="2018" />
          <SpiderManMovie title="Spider-Man No Way Home" year="2021" />
          <SpiderManMovie title="Spider-Man Across the Spider-Verse" year="2023" />
        </div>
      </section>

      {/* Sidebar Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SidebarAd />
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Estadísticas del Spider-Verse Cinematográfico
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">{movies.length}</div>
              <div className="text-gray-400">Películas Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {Object.values(universes).filter(u => u.movies.length > 0).length}
              </div>
              <div className="text-gray-400">Universos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">3</div>
              <div className="text-gray-400">Spider-Man Actores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">20+</div>
              <div className="text-gray-400">Años de Historia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}