import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, ArrowRight, Tag, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { blogService } from "@/lib/database"
import type { Metadata } from "next"
import { BlogPost } from "@prisma/client"

const POSTS_PER_PAGE = 6

export const metadata: Metadata = {
  title: "Blog Spider-Man - Análisis, Noticias y Contenido Exclusivo | Spider-World",
  description:
    "Las últimas noticias, análisis profundos y contenido exclusivo del Spider-Verse. Artículos especializados para fans verdaderos de Spider-Man.",
  keywords: ["blog Spider-Man", "noticias Spider-Man", "análisis Marvel", "Spider-Verse", "contenido exclusivo"],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: "Blog Spider-Man - Análisis, Noticias y Contenido Exclusivo | Spider-World",
    description: "Las últimas noticias, análisis profundos y contenido exclusivo del Spider-Verse.",
    type: 'website',
    url: '/blog',
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog Spider-Man - Análisis, Noticias y Contenido Exclusivo | Spider-World",
    description: "Las últimas noticias, análisis profundos y contenido exclusivo del Spider-Verse.",
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getCategoriesWithCount(posts: BlogPost[]) {
  const counts: Record<string, number> = {}
  posts.forEach(p => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}

const CATEGORY_ACCENT: Record<string, { gradient: string; border: string }> = {
  'Películas':   { gradient: 'from-red-600',    border: 'border-red-500/40' },
  'Cómics':      { gradient: 'from-blue-600',   border: 'border-blue-500/40' },
  'Videojuegos': { gradient: 'from-purple-600', border: 'border-purple-500/40' },
  'Series':      { gradient: 'from-green-600',  border: 'border-green-500/40' },
  'Análisis':    { gradient: 'from-orange-600', border: 'border-orange-500/40' },
  'Noticias':    { gradient: 'from-yellow-600', border: 'border-yellow-500/40' },
  'Teorías':     { gradient: 'from-pink-600',   border: 'border-pink-500/40' },
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category: activeCategory, tag: activeTag, page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const allPosts = await blogService.getAll()
  const categories = getCategoriesWithCount(allPosts)

  const tagCounts: Record<string, number> = {}
  allPosts.forEach(p => p.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)

  const filteredPosts = allPosts.filter(p => {
    if (activeCategory && p.category !== activeCategory) return false
    if (activeTag && !p.tags.includes(activeTag)) return false
    return true
  })

  const featuredPost = !activeCategory && !activeTag && currentPage === 1 && filteredPosts.length > 0
    ? filteredPosts[0]
    : null

  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts
  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = gridPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  function pageUrl(p: number) {
    const params = new URLSearchParams()
    if (activeCategory) params.set('category', activeCategory)
    if (activeTag) params.set('tag', activeTag)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/blog${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">

      {/* Hero con mosaico de imágenes */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-8 gap-1 opacity-30 scale-110">
          {[...allPosts, ...allPosts].slice(0, 16).map((post, i) => (
            <div key={i} className="relative h-full min-h-[300px]">
              <Image src={post.image || ''} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-gray-900/80 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-red-950" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Blog</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Blog<br />
            <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Spider-World</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Análisis profundos, noticias y contenido exclusivo del Spider-Verse.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{allPosts.length} artículos</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{categories.length} categorías</Badge>
          </div>

          {/* Filtros de categoría */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Link
              href="/blog"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 text-white hover:scale-105 ${
                !activeCategory && !activeTag
                  ? 'bg-red-600 border-red-500/60'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => {
              const accent = CATEGORY_ACCENT[cat.name] ?? { gradient: 'from-gray-600', border: 'border-gray-500/40' }
              const isActive = activeCategory === cat.name
              return (
                <Link
                  key={cat.name}
                  href={isActive ? '/blog' : `/blog?category=${encodeURIComponent(cat.name)}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 text-white hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${accent.gradient} to-transparent ${accent.border}`
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Artículo Destacado */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 pt-12 mb-8">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-950 to-red-950/40 border border-red-500/20 shadow-2xl shadow-black/60 hover:border-red-400/40 transition-all duration-300">
              <div className="relative flex flex-col md:flex-row items-stretch gap-0">
                <div className="relative md:w-72 shrink-0 h-48 md:h-auto overflow-hidden">
                  <Image
                    src={featuredPost.image || ''}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/80 hidden md:block" />
                </div>
                <div className="flex-1 px-8 md:px-10 py-8 flex flex-col justify-center">
                  <Badge className="bg-red-600 text-white w-fit mb-4 text-xs tracking-widest uppercase">Artículo Destacado</Badge>
                  <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3">{featuredPost.title}</h2>
                  <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-xl mb-5">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(featuredPost.publishDate.toString())}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{featuredPost.readTime}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" />{featuredPost.views} lecturas</span>
                  </div>
                  <div className="flex items-center gap-2 w-fit px-5 py-2.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium group-hover:bg-red-600/30 transition-colors">
                    Leer artículo <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <InContentAd />
      </div>

      {/* Grid + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Posts */}
          <div className="lg:col-span-3">
            {(activeCategory || activeTag) && (
              <div className="flex items-end gap-4 mb-8 pb-4 border-b border-white/10">
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-red-600 to-transparent" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {activeCategory ?? `#${activeTag}`}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginatedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-950/60 border border-white/5 hover:border-white/15 transition-all duration-300 shadow-lg h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <Image
                        src={post.image || ''}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {post.category && (
                        <span className="absolute top-3 left-3 text-xs bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/10">
                          {post.category}
                        </span>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-300">
                        <Eye className="w-3 h-3" /> {post.views}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-white font-bold line-clamp-2 leading-snug mb-2 group-hover:text-red-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(post.publishDate.toString())}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {paginatedPosts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No hay artículos en esta categoría todavía.
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                <Link
                  href={pageUrl(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </div>
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={pageUrl(p)}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        p === currentPage
                          ? 'bg-red-600 text-white'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}>
                        {p}
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href={pageUrl(currentPage + 1)}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors">
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Tags */}
              <div className="rounded-2xl bg-gray-950/60 border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-red-400" />
                  <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link key={tag} href={activeTag === tag ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}>
                      <span className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        activeTag === tag
                          ? 'border-red-500 bg-red-600/20 text-red-300'
                          : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
                      }`}>
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categorías */}
              <div className="rounded-2xl bg-gray-950/60 border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Categorías</h3>
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={activeCategory === cat.name ? '/blog' : `/blog?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className={`text-sm ${activeCategory === cat.name ? 'text-red-400 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.name ? 'bg-red-600/30 text-red-400' : 'bg-white/5 text-gray-500'}`}>
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <SidebarAd />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
