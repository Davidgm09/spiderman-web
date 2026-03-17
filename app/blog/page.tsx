import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { blogService } from "@/lib/database"
import type { Metadata } from "next"
import { BlogPost } from "@prisma/client"

export const metadata: Metadata = {
  title: "Blog Spider-Man - Análisis, Noticias y Contenido Exclusivo | Spider-World",
  description:
    "Las últimas noticias, análisis profundos y contenido exclusivo del Spider-Verse. Artículos especializados para fans verdaderos de Spider-Man.",
  keywords: ["blog Spider-Man", "noticias Spider-Man", "análisis Marvel", "Spider-Verse", "contenido exclusivo"]
}

// Función para formatear fecha
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para obtener categorías con conteo
function getCategoriesWithCount(posts: BlogPost[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  posts.forEach(post => {
    if (post.category) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }
  });
  
  return Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    color: getColorForCategory(name)
  }));
}

// Función para asignar colores a categorías
function getColorForCategory(category: string): string {
  const colorMap: { [key: string]: string } = {
    'Películas': 'red',
    'Cómics': 'blue', 
    'Videojuegos': 'purple',
    'Series': 'green',
    'Análisis': 'orange',
    'Noticias': 'yellow',
    'Teorías': 'pink'
  };
  
  return colorMap[category] || 'gray';
}

export default async function BlogPage() {
  // Obtener posts del blog de la base de datos
  const allPosts = await blogService.getAll();
  
  // Obtener el post destacado (el más reciente o con más views)
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  
  // Obtener posts recientes (excluyendo el destacado)
  const recentPosts = allPosts.slice(1, 7);
  
  // Obtener categorías con conteo
  const categories = getCategoriesWithCount(allPosts);
  
  const popularTags = [
    "Spider-Man MCU",
    "Tom Holland", 
    "Tobey Maguire",
    "Andrew Garfield",
    "Miles Morales",
    "Venom",
    "Green Goblin",
    "Spider-Verse",
    "PS5",
    "Marvel"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Blog Spider-World
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Las últimas noticias, análisis profundos y contenido exclusivo del Spider-Verse
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2">
              {allPosts.length} Artículos
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Contenido Exclusivo
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Análisis Profundos
            </Badge>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Artículo Destacado</h2>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4 bg-red-600">{featuredPost.category}</Badge>
                <CardTitle className="text-white mb-4 text-2xl leading-tight hover:text-red-400 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </CardTitle>
                <CardDescription className="text-gray-300 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(featuredPost.publishDate.toString())}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {featuredPost.views}
                    </div>
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Leer Artículo Completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-white mb-8">Últimos Artículos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg?height=250&width=400"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-600">
                        {post.category}
                      </Badge>
                      <div className="absolute bottom-2 right-2 flex items-center bg-black/70 rounded px-2 py-1 text-xs text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <CardTitle className="text-white mb-2 line-clamp-2 hover:text-red-400 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    
                    <CardDescription className="text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(post.publishDate.toString())}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                Cargar Más Artículos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Popular Tags */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags Populares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{category.name}</span>
                        <Badge className="bg-gray-600 text-white">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Ad */}
              <SidebarAd />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Estadísticas del Blog
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">{allPosts.length}</div>
              <div className="text-gray-400">Artículos Publicados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{categories.length}</div>
              <div className="text-gray-400">Categorías</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {allPosts.reduce((total, post) => total + (post.views || 0), 0)}
              </div>
              <div className="text-gray-400">Visualizaciones Totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {Math.round(allPosts.reduce((total, post) => {
                  const readTime = parseInt(post.readTime?.replace(' min', '') || '0');
                  return total + readTime;
                }, 0) / allPosts.length) || 0}
              </div>
              <div className="text-gray-400">Tiempo Promedio de Lectura</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
