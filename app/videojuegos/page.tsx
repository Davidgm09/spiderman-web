import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Gamepad2, ShoppingCart, Calendar, Monitor, Zap, Award, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { SpiderManGame, AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { gameService } from "@/lib/database"

export const metadata: Metadata = {
  title: "Videojuegos de Spider-Man - Colección Completa | Spider-World",
  description:
    "Todos los videojuegos de Spider-Man: desde clásicos arcade hasta PS5. Reseñas completas, gameplay, plataformas y enlaces de compra.",
  keywords: ["Spider-Man videojuegos", "Marvel's Spider-Man", "Spider-Man PS4", "Spider-Man PS5", "Insomniac Games", "videojuegos Marvel"],
}

// Función para organizar juegos por era
function organizeGamesByEra(games: any[]) {
  const eras = {
    classic: {
      title: "Era Clásica (1982-1999)",
      description: "Los primeros juegos de Spider-Man en arcade y consolas retro",
      color: "red",
      years: "1982-1999",
      games: [] as any[]
    },
    modern_early: {
      title: "Era Moderna Temprana (2000-2009)",
      description: "Transición al 3D y las primeras aventuras de mundo abierto",
      color: "blue",
      years: "2000-2009",
      games: [] as any[]
    },
    golden_age: {
      title: "Era Dorada (2010-2017)",
      description: "Los juegos más ambiciosos antes de la llegada de Insomniac",
      color: "purple",
      years: "2010-2017",
      games: [] as any[]
    },
    insomniac: {
      title: "Era Insomniac (2018-Presente)",
      description: "La nueva generación que redefinió los juegos de Spider-Man",
      color: "green",
      years: "2018-2024",
      games: [] as any[]
    }
  };

  games.forEach(game => {
    const year = game.year;
    const name = game.title.toLowerCase();
    
    if (name.includes("marvel's spider-man") || name.includes("insomniac") || year >= 2018) {
      eras.insomniac.games.push(game);
    } else if (year >= 1982 && year <= 1999) {
      eras.classic.games.push(game);
    } else if (year >= 2000 && year <= 2009) {
      eras.modern_early.games.push(game);
    } else if (year >= 2010 && year <= 2017) {
      eras.golden_age.games.push(game);
    } else {
      eras.modern_early.games.push(game);
    }
  });

  // Ordenar juegos por año dentro de cada era
  Object.values(eras).forEach(era => {
    era.games.sort((a, b) => b.year - a.year);
  });

  return eras;
}

// Función para formatear plataformas
function formatPlatforms(platforms: string[] | string): string {
  if (Array.isArray(platforms)) {
    return platforms.join(', ');
  }
  return platforms || 'Múltiples plataformas';
}

// Función para generar URL de Amazon para un juego
function generateAmazonGameUrl(gameName: string, platforms?: string[] | string): string {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const platformStr = Array.isArray(platforms) ? platforms[0] : platforms || 'PS5';
  const query = encodeURIComponent(`${gameName} ${platformStr} videojuego`);
  return `https://www.amazon.com/s?k=${query}&tag=${amazonTag}`;
}

export default async function VideojuegosPage() {
  // Obtener videojuegos de la base de datos
  const allGames = await gameService.getAll();
  
  // Organizar por eras
  const gamesByEra = organizeGamesByEra(allGames);

  const gamingGuides = [
    {
      title: "Para Nuevos Jugadores",
      description: "Los mejores juegos para empezar",
      icon: "🎮",
      games: ["Marvel's Spider-Man", "Spider-Man 2", "Spider-Man: Miles Morales"]
    },
    {
      title: "Clásicos Imperdibles",
      description: "Los juegos que marcaron historia",
      icon: "🕹️",
      games: ["Spider-Man 2 (2004)", "Ultimate Spider-Man", "Web of Shadows"]
    },
    {
      title: "Experiencia Completa",
      description: "Para vivir la saga completa",
      icon: "🏆",
      games: ["Toda la saga de Insomniac", "Spider-Man: Shattered Dimensions", "Spider-Man (2000)"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-blue-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Videojuegos de Spider-Man
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Desde los clásicos arcade hasta las obras maestras modernas de Insomniac Games
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-green-600 text-white px-4 py-2">
              {allGames.length} Videojuegos
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Múltiples Plataformas
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              40+ Años de Historia
            </Badge>
          </div>
        </div>
      </section>

      {/* Gaming Guides */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Guías de Juego</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {gamingGuides.map((guide, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <ul className="space-y-1">
                  {guide.games.map((game, i) => (
                    <li key={i} className="text-sm text-green-400">
                      • {game}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Games by Era */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.entries(gamesByEra).map(([key, era]) => {
          if (era.games.length === 0) return null;
          
          const colorClasses = {
            red: "from-red-600/20 to-red-800/20 border-red-600/30",
            blue: "from-blue-600/20 to-blue-800/20 border-blue-600/30", 
            purple: "from-purple-600/20 to-purple-800/20 border-purple-600/30",
            green: "from-green-600/20 to-green-800/20 border-green-600/30"
          };

          return (
            <section key={key} className="mb-16">
              <div className={`bg-gradient-to-r ${colorClasses[era.color as keyof typeof colorClasses]} border rounded-lg p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {era.title}
                    </h2>
                    <p className="text-gray-300 mb-2">{era.description}</p>
                    <Badge className="bg-gray-700 text-gray-300">
                      {era.years}
                    </Badge>
                  </div>
                  <Badge className="bg-white/10 text-white text-lg px-4 py-2">
                    {era.games.length} juego{era.games.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {era.games.map((game: any) => (
                  <Card key={game.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image
                          src={game.image}
                          alt={`${game.title} - Videojuego de Spider-Man`}
                          width={400}
                          height={500}
                          className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Rating Badge */}
                        <Badge className="absolute top-2 right-2 bg-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          {game.rating}
                        </Badge>
                        
                        {/* Year Badge */}
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                          {game.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2 line-clamp-2">
                        <Link href={`/videojuegos/${game.slug}`} className="hover:text-green-400 transition-colors">
                          {game.title}
                        </Link>
                      </CardTitle>
                      
                      {game.subtitle && (
                        <CardDescription className="text-gray-400 text-sm mb-2">
                          {game.subtitle}
                        </CardDescription>
                      )}
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {game.description}
                      </p>
                      
                      {/* Game Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Desarrollador: {game.developer}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Award className="w-4 h-4 mr-2" />
                          <span>Publicado por: {game.publisher}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Monitor className="w-4 h-4 mr-2" />
                          <span>Plataformas: {formatPlatforms(game.platform)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Zap className="w-4 h-4 mr-2" />
                          <span>Género: {game.genre}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/videojuegos/${game.slug}`}>
                            <Gamepad2 className="w-4 h-4 mr-1" />
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
                            href={generateAmazonGameUrl(game.title, game.platform)}
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
          Videojuegos Recomendados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SpiderManGame title="Marvel's Spider-Man" platform="PS5" />
          <SpiderManGame title="Spider-Man: Miles Morales" platform="PS5" />
          <SpiderManGame title="Marvel's Spider-Man 2" platform="PS5" />
          <SpiderManGame title="Spider-Man Remastered" platform="PC" />
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
            Estadísticas Gaming Spider-Man
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">{allGames.length}</div>
              <div className="text-gray-400">Videojuegos Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {Object.values(gamesByEra).filter(e => e.games.length > 0).length}
              </div>
              <div className="text-gray-400">Eras Gaming</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">10+</div>
              <div className="text-gray-400">Plataformas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">40+</div>
              <div className="text-gray-400">Años de Historia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}