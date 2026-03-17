import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, ArrowLeft, BookOpen, Share2, Tag } from "lucide-react"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { blogService } from "@/lib/database"
import { BlogPost } from "@prisma/client"

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await blogService.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedBlogPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    const posts = await blogService.getRecent(limit + 1);
    return posts.filter((post) => post.slug !== currentSlug).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Artículo no encontrado | Spider-World",
      description: "El artículo que buscas no está disponible.",
    }
  }

  const description = post.excerpt 
    ? post.excerpt.substring(0, 155) + '...'
    : `Lee ${post.title}, artículo especializado sobre Spider-Man con análisis profundo y contenido exclusivo.`;

  return {
    title: `${post.title} | Spider-World Blog`,
    description,
    keywords: ['Spider-Man', 'blog', 'análisis', post.title, 'Marvel', 'artículo'],
    openGraph: {
      title: `${post.title} | Spider-World Blog`,
      description,
      images: post.image ? [post.image] : [],
      type: "article",
      publishedTime: post.publishDate.toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Spider-World Blog`,
      description,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Obtener artículos relacionados
  const relatedPosts = await getRelatedBlogPosts(slug);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-orange-900/30 to-black/80"></div>
        <div className="absolute inset-0">
          <Image
            src={post.image ?? '/placeholder.jpg'}
            alt={`${post.title} - Blog Spider-World`}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Blog
              </Button>
            </Link>
            <Badge className="bg-orange-600 text-white px-6 py-3 text-lg font-semibold">
              {post.category || 'Artículo'}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
            {post.title}
          </h1>
          
          {post.subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed italic">
              "{post.subtitle}"
            </p>
          )}
          
          {post.excerpt && (
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              {post.excerpt.length > 200 ? post.excerpt.substring(0, 200) + '...' : post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-500" />
              <span>{new Date(post.publishDate || post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {post.author && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                <span>{post.author}</span>
              </div>
            )}
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                <span>{post.readTime}</span>
              </div>
            )}
            {post.views && (
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-500" />
                <span>{post.views}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Leer Artículo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Compartir
            </Button>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      {/* Article Content */}
      <section className="py-20 bg-gradient-to-b from-black to-orange-950/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-orange-600/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Información del Artículo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Título</span>
                        <div className="text-white font-semibold">{post.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="text-gray-400 text-sm">Fecha de publicación</span>
                        <div className="text-white font-semibold">
                          {new Date(post.publishDate || post.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    {post.author && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-orange-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Autor</span>
                          <div className="text-white font-semibold">{post.author}</div>
                        </div>
                      </div>
                    )}
                    {post.category && (
                      <div className="flex items-center space-x-3">
                        <Tag className="w-5 h-5 text-orange-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Categoría</span>
                          <div className="text-white font-semibold">{post.category}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {post.readTime && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Tiempo de lectura</span>
                          <div className="text-white font-semibold">{post.readTime}</div>
                        </div>
                      </div>
                    )}
                    {post.views && (
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="text-gray-400 text-sm">Visualizaciones</span>
                          <div className="text-white font-semibold">{post.views}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              {post.excerpt && (
                <div className="mt-8 bg-gray-900/50 border border-orange-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Resumen</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Article Content */}
              {post.content && (
                <div className="mt-8 bg-gray-900/50 border border-orange-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Contenido</h3>
                  <div className="blog-content text-gray-300 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 bg-gray-900/50 border border-orange-600/20 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} className="bg-orange-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Article Image */}
                <div className="bg-gray-900/30 rounded-lg p-6 border border-orange-600/20">
                  <Image
                    src={post.image ?? '/placeholder.jpg'}
                    alt={`${post.title} - Imagen del artículo`}
                    width={300}
                    height={200}
                    className="w-full rounded-lg"
                  />
                </div>
                
                {/* Ad */}
                <SidebarAd />
                
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-gray-900/30 rounded-lg p-6 border border-orange-600/20">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      📚 Artículos Relacionados
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Card key={relatedPost.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                          <CardContent className="p-4">
                            <Link href={`/blog/${relatedPost.slug}`} className="block">
                              <Image
                                src={relatedPost.image ?? '/placeholder.jpg'}
                                alt={relatedPost.title}
                                width={300}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                              <h4 className="text-white font-semibold mb-2 line-clamp-2 hover:text-orange-400 transition-colors">
                                {relatedPost.title}
                              </h4>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(relatedPost.publishDate || relatedPost.createdAt).toLocaleDateString('es-ES')}
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 