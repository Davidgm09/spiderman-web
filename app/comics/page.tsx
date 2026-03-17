import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ShoppingCart, Star, Calendar, Users, Award, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { SpiderManComic, AmazonProduct } from "@/components/affiliate/AmazonProduct"
import { comicService } from "@/lib/database"

export const metadata = {
  title: "Cómics de Spider-Man - Colección Completa | Spider-World",
  description:
    "Descubre los mejores cómics de Spider-Man: desde Amazing Spider-Man hasta Ultimate Spider-Man. Análisis, ratings y enlaces de compra.",
  keywords: ["Spider-Man cómics", "Marvel Comics", "Amazing Spider-Man", "Ultimate Spider-Man", "Stan Lee", "Steve Ditko"],
}

// Función para generar URL de Amazon para un cómic
function generateAmazonComicUrl(title: string): string {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const searchQuery = encodeURIComponent(`${title} comic marvel`);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${amazonTag}`;
}

// Función para verificar si una imagen es válida
function isValidImage(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // Excluir placeholders locales
  if (imageUrl.includes('placeholder.svg') || imageUrl.includes('marvel-placeholder')) {
    return false;
  }
  
  // Aceptar imágenes de dominios válidos
  const validDomains = [
    'i.annihil.us',              // Marvel CDN
    'cdn.marvel.com',            // Marvel CDN
    'm.media-amazon.com',        // Amazon
    'image.tmdb.org',            // TMDB
    'comicvine.gamespot.com',    // Comic Vine
    'via.placeholder.com'
  ];

  return validDomains.some(domain => imageUrl.includes(domain));
}

// Función para organizar cómics por eras cronológicas
function organizeComicsByEra(comics: any[]) {
  // Filtrar solo comics con imágenes válidas
  const comicsWithValidImages = comics.filter(comic => isValidImage(comic.image));
  
  const eras = {
    clasica: {
      title: "Era Clásica (1962-1970)",
      description: "Los orígenes de Spider-Man y las bases del mythos arácnido",
      color: "blue",
      icon: "🕷️",
      yearRange: "1962-1970",
      comics: [] as any[]
    },
    bronce: {
      title: "Era de Bronce (1970-1985)",
      description: "Maduración del personaje y eventos que cambiaron todo",
      color: "green", 
      icon: "⚡",
      yearRange: "1970-1985",
      comics: [] as any[]
    },
    moderna: {
      title: "Era Moderna (1985-2000)",
      description: "Venom, Carnage y las historias más oscuras de Spider-Man",
      color: "red",
      icon: "🖤",
      yearRange: "1985-2000",
      comics: [] as any[]
    },
    contemporanea: {
      title: "Era Contemporánea (2000+)",
      description: "Ultimate Spider-Man, multiverso y nuevas generaciones",
      color: "purple",
      icon: "🌌",
      yearRange: "2000+",
      comics: [] as any[]
    }
  };

  comicsWithValidImages.forEach(comic => {
    const year = parseInt(comic.year) || 2024;
    
    if (year >= 1962 && year <= 1970) {
      eras.clasica.comics.push(comic);
    } else if (year >= 1970 && year <= 1985) {
      eras.bronce.comics.push(comic);
    } else if (year >= 1985 && year <= 2000) {
      eras.moderna.comics.push(comic);
    } else if (year >= 2000) {
      eras.contemporanea.comics.push(comic);
    }
  });

  // Ordenar por año dentro de cada era
  Object.values(eras).forEach(era => {
    era.comics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  });

  return eras;
}

export default async function ComicsPage() {
  // Obtener cómics de la base de datos
  const allComics = await comicService.getAll();
  
  // Organizar por eras cronológicas (solo comics con imágenes válidas)
  const comicsByEra = organizeComicsByEra(allComics);
  
  // Calcular totales dinámicos
  const totalValidComics = Object.values(comicsByEra).reduce((total, era) => total + era.comics.length, 0);
  const totalEras = Object.values(comicsByEra).filter(era => era.comics.length > 0).length;

  const readingGuides = [
    {
      title: "Empezar desde el Origen",
      description: "Comienza con la Era Clásica (1962-1970)",
      icon: "🕷️",
      comics: ["Amazing Fantasy #15", "Amazing Spider-Man #1", "Amazing Spider-Man #33", "Amazing Spider-Man #50"]
    },
    {
      title: "Historias Oscuras",
      description: "Era de Bronce y Moderna (1970-2000)",
      icon: "🖤",
      comics: ["Muerte de Gwen Stacy", "Kraven's Last Hunt", "Venom", "Carnage"]
    },
    {
      title: "Nuevas Generaciones",
      description: "Era Contemporánea (2000+)",
      icon: "🌟",
      comics: ["Ultimate Spider-Man", "Spider-Verse", "Miles Morales", "Spider-Gwen"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-red-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
            Cómics de Spider-Man
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {totalValidComics} cómics con imágenes de alta calidad organizados en {totalEras} eras cronológicas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blue-600 text-white px-4 py-2">
              {totalValidComics} Cómics con Imágenes
            </Badge>
            <Badge className="bg-red-600 text-white px-4 py-2">
              {totalEras} Eras Históricas
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2">
              1962-2024
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Imágenes Únicas
            </Badge>
          </div>
        </div>
      </section>

      {/* Reading Guides */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Guías de Lectura</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {readingGuides.map((guide, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <ul className="space-y-1">
                  {guide.comics.map((comic, i) => (
                    <li key={i} className="text-sm text-blue-400">
                      • {comic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Era Overview */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Las 4 Eras de Spider-Man</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(comicsByEra).map(([key, era]) => (
            <Card key={key} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{era.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{era.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{era.yearRange}</p>
                <Badge className="mb-3 bg-blue-600">
                  {era.comics.length} cómics
                </Badge>
                <p className="text-sm text-gray-400">{era.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Comics by Era */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.entries(comicsByEra).map(([key, era]) => {
          if (era.comics.length === 0) return null;
          
          const colorClasses = {
            red: "from-red-600/20 to-red-800/20 border-red-600/30",
            blue: "from-blue-600/20 to-blue-800/20 border-blue-600/30", 
            green: "from-green-600/20 to-green-800/20 border-green-600/30",
            purple: "from-purple-600/20 to-purple-800/20 border-purple-600/30"
          };

          return (
            <section key={key} className="mb-16">
              <div className={`bg-gradient-to-r ${colorClasses[era.color as keyof typeof colorClasses]} border rounded-lg p-6 mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{era.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {era.title}
                      </h2>
                      <p className="text-gray-300 mb-2">{era.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-white/20 text-white">
                          📅 {era.yearRange}
                        </Badge>
                        <Badge className="bg-white/20 text-white">
                          📚 {era.comics.length} cómics
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white text-lg px-4 py-2">
                    {era.comics.length}/15
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {era.comics.map((comic: any) => (
                  <Card key={comic.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image
                          src={comic.image}
                          alt={`${comic.title} - Cómic de Spider-Man`}
                          width={300}
                          height={450}
                          className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Rating Badge */}
                        <Badge className="absolute top-2 right-2 bg-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          {comic.rating}
                        </Badge>
                        
                        {/* Price Badge */}
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          {comic.price}
                        </Badge>
                        
                        {/* Importance Badge */}
                        {comic.importance >= 9 && (
                          <Badge className="absolute bottom-2 left-2 bg-red-600">
                            <Award className="w-3 h-3 mr-1" />
                            Esencial
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2 line-clamp-2">
                        <Link href={`/comics/${comic.slug}`} className="hover:text-blue-400 transition-colors">
                          {comic.title}
                        </Link>
                      </CardTitle>
                      
                      {comic.subtitle && (
                        <CardDescription className="text-gray-400 text-sm mb-2">
                          {comic.subtitle}
                        </CardDescription>
                      )}
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {comic.description}
                      </p>
                      
                      {/* Comic Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Guión: {comic.writer}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>Arte: {comic.artist}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{comic.year}</span>
                        </div>
                        
                        {comic.publisher && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Award className="w-4 h-4 mr-2" />
                            <span>{comic.publisher}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/comics/${comic.slug}`}>
                            <BookOpen className="w-4 h-4 mr-1" />
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
                            href={generateAmazonComicUrl(comic.title)}
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
          Cómics Recomendados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SpiderManComic title="Amazing Spider-Man Omnibus Vol. 1" />
          <SpiderManComic title="Ultimate Spider-Man Collection" />
          <SpiderManComic title="Spider-Verse Complete Story" />
          <SpiderManComic title="Spider-Man: Blue Complete Series" />
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
            Estadísticas de la Colección
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{totalValidComics}</div>
              <div className="text-gray-400">Cómics con Imágenes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">
                {totalEras}
              </div>
              <div className="text-gray-400">Eras Históricas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {Object.values(comicsByEra).reduce((total, era) => 
                  total + era.comics.filter((c: any) => c.importance === 'Esencial').length, 0
                )}
              </div>
              <div className="text-gray-400">Cómics Esenciales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">100%</div>
              <div className="text-gray-400">Imágenes Únicas</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}