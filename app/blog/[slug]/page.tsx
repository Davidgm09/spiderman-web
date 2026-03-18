import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, ArrowLeft, Tag } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { SidebarAd } from "@/components/ads/GoogleAdsense"
import { blogService } from "@/lib/database"
import { SITE_URL } from "@/lib/config"
import { BlogPost } from "@prisma/client"
import { ViewTracker } from "@/components/blog/ViewTracker"
import { ShareButtons } from "@/components/blog/ShareButtons"

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await blogService.getAll()
  return posts.map((p) => ({ slug: p.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await blogService.getBySlug(slug)
  if (!post) return { title: "Artículo no encontrado | Spider-World" }

  const description = post.seoDescription || post.excerpt.substring(0, 155)
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.seoTitle || `${post.title} | Spider-World Blog`,
    description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      images: post.image ? [post.image] : [],
      type: "article",
      url,
      publishedTime: post.publishDate.toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await blogService.getBySlug(slug)
  if (!post) notFound()

  const relatedPosts = await blogService.getByCategory(post.category, slug, 3)

  const BASE_URL = SITE_URL
  const postUrl = `${BASE_URL}/blog/${post.slug}`

  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.image ? {
      '@type': 'ImageObject',
      url: post.image,
      width: 1200,
      height: 630,
    } : undefined,
    url: postUrl,
    datePublished: post.publishDate.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spider-World',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/placeholder-logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'es',
    wordCount,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={post.slug} />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="relative z-10 w-full px-4 pb-10 max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.category, href: `/blog?categoria=${post.category}` }, { label: post.title }]} />
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Blog
            </Button>
          </Link>
          <Badge className="mb-3 bg-red-600 text-white">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-lg text-gray-300 italic mb-4">{post.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(post.publishDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {post.views} vistas
            </span>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Artículo */}
          <article className="lg:col-span-2">
            {/* Excerpt destacado */}
            <p className="text-lg text-gray-300 leading-relaxed border-l-4 border-red-600 pl-4 mb-10 italic">
              {post.excerpt}
            </p>

            {/* Contenido HTML */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Compartir */}
            <div className="mt-10 pt-6 border-t border-gray-800">
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Nav inferior */}
            <div className="mt-6">
              <Link href="/blog">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al blog
                </Button>
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">

              {/* Artículos relacionados */}
              {relatedPosts.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Más en {post.category}
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related: BlogPost) => (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="flex gap-3 group">
                        {related.image && (
                          <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={related.image}
                              alt={related.title}
                              width={80}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                            {related.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{related.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords SEO */}
              {post.keywords.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                    Temas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.slice(0, 8).map((kw) => (
                      <span key={kw} className="text-xs text-gray-400 bg-gray-900/60 border border-gray-700 rounded px-2 py-1">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <SidebarAd />
            </div>
          </aside>

        </div>
      </section>
    </div>
  )
}
