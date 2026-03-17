import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Calendar, Tv, Clock, Users, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { seriesService } from "@/lib/database"
import { colorClasses } from "@/lib/theme"
import { Series } from "@prisma/client"

export const metadata: Metadata = {
  title: "Series de Spider-Man - Animadas y Live-Action | Spider-World",
  description:
    "Todas las series de Spider-Man desde 1967 hasta hoy. Series animadas clásicas, live-action y dónde verlas. Guía completa con fechas de estreno y análisis.",
  keywords: ["Spider-Man series", "series animadas Spider-Man", "The Spectacular Spider-Man", "Spider-Man 1994", "series Marvel"]
}

// Función para organizar series por era
function organizeSeriesByEra(series: Series[]) {
  const eras = {
    classic: {
      title: "Series Animadas Clásicas (1967-1999)",
      description: "Las primeras series animadas que definieron a Spider-Man en TV",
      color: "red",
      years: "1967-1999",
      series: [] as Series[]
    },
    modern: {
      title: "Era Moderna Animada (2000-2015)",
      description: "Series con animación mejorada y narrativas más maduras",
      color: "blue", 
      years: "2000-2015",
      series: [] as Series[]
    },
    current: {
      title: "Era Actual (2015-Presente)",
      description: "Las series más recientes con animación de vanguardia",
      color: "purple",
      years: "2015-2024",
      series: [] as Series[]
    },
    liveaction: {
      title: "Live-Action y Especiales",
      description: "Series y especiales con actores reales",
      color: "green",
      years: "1977-2024",
      series: [] as Series[]
    }
  };

  series.forEach(serie => {
    const year = parseInt(serie.year, 10) || 0;
    const title = serie.title.toLowerCase();

    if (title.includes('live') || title.includes('freshman') || title.includes('noir') || (year < 1980 && year > 1970)) {
      eras.liveaction.series.push(serie);
    } else if (year >= 1967 && year <= 1999) {
      eras.classic.series.push(serie);
    } else if (year >= 2000 && year <= 2015) {
      eras.modern.series.push(serie);
    } else {
      eras.current.series.push(serie);
    }
  });

  // Ordenar series por año dentro de cada era
  Object.values(eras).forEach(era => {
    era.series.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));
  });

  return eras;
}



export default async function SeriesPage() {
  // Obtener series de la base de datos
  const allSeries = await seriesService.getAll();
  
  // Organizar por eras
  const seriesByEra = organizeSeriesByEra(allSeries);

  const viewingGuides = [
    {
      title: "Para Nuevos Fans",
      description: "Las mejores series para empezar",
      icon: "🎬",
      series: ["The Spectacular Spider-Man", "Spider-Man (1994)", "Ultimate Spider-Man"]
    },
    {
      title: "Orden Cronológico",
      description: "Ver por orden de lanzamiento",
      icon: "📅", 
      series: ["Spider-Man (1967)", "Amazing Friends", "Spider-Man (1994)"]
    },
    {
      title: "Solo lo Mejor",
      description: "Las series más aclamadas",
      icon: "⭐",
      series: ["The Spectacular Spider-Man", "Spider-Man (1994)", "Amazing Friends"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Series de Spider-Man
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Desde las series animadas clásicas hasta las producciones más recientes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2">
              {allSeries.length} Series
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              50+ Años de Historia
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Animadas y Live-Action
            </Badge>
          </div>
        </div>
      </section>

      {/* Viewing Guides */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Guías de Visualización</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {viewingGuides.map((guide, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <ul className="space-y-1">
                  {guide.series.map((serie, i) => (
                    <li key={i} className="text-sm text-red-400">
                      • {serie}
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

      {/* Series by Era */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.entries(seriesByEra).map(([key, era]) => {
          if (era.series.length === 0) return null;
          
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
                    {era.series.length} serie{era.series.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {era.series.map((serie: Series) => (
                  <Card key={serie.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image
                          src={serie.image}
                          alt={`${serie.title} - Serie de Spider-Man`}
                          width={400}
                          height={500}
                          className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Rating Badge */}
                        <Badge className="absolute top-2 right-2 bg-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          {serie.rating}
                        </Badge>
                        
                        {/* Year Badge */}
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                          {serie.year}
                        </Badge>
                        
                        {/* Status Badge */}
                        <Badge className={`absolute bottom-2 right-2 ${
                          serie.status === 'En emisión' ? 'bg-green-600' :
                          serie.status === 'Finalizada' ? 'bg-gray-600' :
                          'bg-blue-600'
                        }`}>
                          {serie.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <CardTitle className="text-white mb-2 line-clamp-2">
                        <Link href={`/series/${serie.slug}`} className="hover:text-red-400 transition-colors">
                          {serie.title}
                        </Link>
                      </CardTitle>
                      
                      {serie.subtitle && (
                        <CardDescription className="text-gray-400 text-sm mb-2">
                          {serie.subtitle}
                        </CardDescription>
                      )}
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {serie.description}
                      </p>
                      
                      {/* Series Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Año: {serie.year}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Tv className="w-4 h-4 mr-2" />
                          <span>Temporadas: {serie.seasons}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Episodios: {serie.episodes}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <Play className="w-4 h-4 mr-2" />
                          <span>Red/Plataforma: {serie.network ?? 'N/A'}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/series/${serie.slug}`}>
                            <Tv className="w-4 h-4 mr-1" />
                            Ver Detalles
                          </Link>
                        </Button>
                        
                        {serie.homepage && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                          >
                            <a
                              href={serie.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Ver
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sidebar Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SidebarAd />
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Estadísticas Series Spider-Man
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">{allSeries.length}</div>
              <div className="text-gray-400">Series Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {Object.values(seriesByEra).filter(e => e.series.length > 0).length}
              </div>
              <div className="text-gray-400">Eras Cubiertas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">50+</div>
              <div className="text-gray-400">Años de Historia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {allSeries.reduce((total: number, serie) => total + (serie.episodes ?? 0), 0)}
              </div>
              <div className="text-gray-400">Episodios Totales</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
