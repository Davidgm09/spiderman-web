export const revalidate = 3600

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Star, ShoppingCart } from "lucide-react"
import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { comicService } from "@/lib/database"
import { generateAmazonUrl } from "@/lib/content-helpers"
import { Comic } from "@prisma/client"

export const metadata: Metadata = {
  title: "Cómics de Spider-Man - Colección Completa | Spider-World",
  description:
    "Descubre los mejores cómics de Spider-Man: desde Amazing Spider-Man hasta Ultimate Spider-Man. Análisis, ratings y enlaces de compra.",
  keywords: ["Spider-Man cómics", "Marvel Comics", "Amazing Spider-Man", "Ultimate Spider-Man", "Stan Lee", "Steve Ditko"],
  alternates: { canonical: '/comics' },
  openGraph: {
    title: "Cómics de Spider-Man - Colección Completa | Spider-World",
    description: "Descubre los mejores cómics de Spider-Man: desde Amazing Spider-Man hasta Ultimate Spider-Man.",
    type: 'website',
    url: '/comics',
    images: ['https://comicvine.gamespot.com/a/uploads/original/0/40/102225-7257-107616-1-ultimate-spider-man.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cómics de Spider-Man - Colección Completa | Spider-World",
    description: "Descubre los mejores cómics de Spider-Man: desde Amazing Spider-Man hasta Ultimate Spider-Man.",
    images: ['https://comicvine.gamespot.com/a/uploads/original/0/40/102225-7257-107616-1-ultimate-spider-man.jpg'],
  },
}

const ERA_CONFIG = {
  clasica:       { title: "Era Clásica",       subtitle: "1962–1970 · Los orígenes",                    accent: "from-blue-600",   border: "border-blue-500/40",   glow: "shadow-blue-900/40" },
  bronce:        { title: "Era de Bronce",      subtitle: "1970–1985 · Maduración del personaje",        accent: "from-green-600",  border: "border-green-500/40",  glow: "shadow-green-900/40" },
  moderna:       { title: "Era Moderna",        subtitle: "1985–2000 · Venom, Carnage y más",            accent: "from-red-600",    border: "border-red-500/40",    glow: "shadow-red-900/40" },
  contemporanea: { title: "Era Contemporánea",  subtitle: "2000+ · Ultimate, Spider-Verse y más allá",   accent: "from-purple-600", border: "border-purple-500/40", glow: "shadow-purple-900/40" },
}

const ESSENTIAL_READS = [
  {
    slug: 'giant-size-spider-man-1-1974',
    title: 'Giant-Size Spider-Man #1',
    year: '1974',
    label: 'Formato Especial',
    accent: 'from-yellow-600 to-orange-600',
    border: 'border-yellow-500/30',
    description: 'Los especiales de gran formato de los 70. Spider-Man junto a Dracula en una aventura irrepetible.',
    amazonQuery: 'Giant Size Spider-Man Marvel omnibus 1970s',
  },
  {
    slug: 'the-amazing-spider-man-100-1971',
    title: 'The Amazing Spider-Man #100',
    year: '1971',
    label: 'Número Especial',
    accent: 'from-blue-600 to-indigo-600',
    border: 'border-blue-500/30',
    description: 'El número 100. Peter Parker decide en una encrucijada vital si seguir siendo Spider-Man.',
    amazonQuery: 'Amazing Spider-Man Night Gwen Stacy Died Marvel omnibus',
  },
  {
    slug: 'spider-gwen-1-2015',
    title: 'Spider-Gwen #1',
    year: '2015',
    label: 'Debut Icónico',
    accent: 'from-green-700 to-emerald-600',
    border: 'border-green-500/30',
    description: 'Gwen Stacy como Spider-Woman en su universo propio. El debut que conquistó a toda una generación.',
    amazonQuery: 'Spider-Gwen Vol 1 Marvel Comics omnibus',
  },
  {
    slug: 'ultimate-spider-man-1-2000',
    title: 'Ultimate Spider-Man #1',
    year: '2000',
    label: 'Nueva Era',
    accent: 'from-red-600 to-rose-600',
    border: 'border-red-500/30',
    description: 'Brian Michael Bendis reinventa a Peter Parker para el siglo XXI. Perfecta para nuevos lectores.',
    amazonQuery: 'Ultimate Spider-Man Omnibus Bendis Bagley Marvel',
  },
  {
    slug: 'edge-of-spider-verse-2-2014',
    title: 'Spider-Verse',
    year: '2014',
    label: 'El Multiverso',
    accent: 'from-purple-600 to-violet-600',
    border: 'border-purple-500/30',
    description: 'Todos los Spider-Man del multiverso unidos. El evento que inspiró las películas de animación.',
    amazonQuery: 'Spider-Verse Marvel Comics omnibus',
  },
  {
    slug: 'spectacular-spider-man-1-2003',
    title: 'Spectacular Spider-Man (2003)',
    year: '2003',
    label: 'Imprescindible',
    accent: 'from-cyan-600 to-sky-600',
    border: 'border-cyan-500/30',
    description: 'Paul Jenkins lleva la vida personal de Peter Parker a primer plano. Emotivo y humano.',
    amazonQuery: 'Spectacular Spider-Man Jenkins Marvel comics',
  },
]

function isSpecialIssue(title: string) {
  const t = title.toLowerCase()
  if (t.includes('annual'))                        return { label: 'Anual',         color: 'bg-blue-600' }
  if (t.includes('#1') && !t.includes('#10') && !t.includes('#11') && !t.includes('#12') && !t.includes('#13') && !t.includes('#14') && !t.includes('#15') && !t.includes('#16') && !t.includes('#17') && !t.includes('#18') && !t.includes('#19'))
                                                   return { label: 'Nº 1',          color: 'bg-green-600' }
  if (t.includes('amazing fantasy'))               return { label: 'Origen',        color: 'bg-yellow-600' }
  if (t.includes('omnibus') || t.includes('epic') || t.includes('masterwork') || t.includes('hardcover'))
                                                   return { label: 'Colección',     color: 'bg-purple-600' }
  return null
}

function isValidImage(url: string) {
  if (!url) return false
  if (url.includes('placeholder')) return false
  return ['comicvine.gamespot.com', 'i.annihil.us', 'cdn.marvel.com', 'm.media-amazon.com', 'image.tmdb.org'].some(d => url.includes(d))
}

function organizeComicsByEra(comics: Comic[]) {
  const eras = Object.fromEntries(
    Object.entries(ERA_CONFIG).map(([key, cfg]) => [key, { ...cfg, comics: [] as Comic[] }])
  ) as Record<string, typeof ERA_CONFIG[keyof typeof ERA_CONFIG] & { comics: Comic[] }>

  comics.filter(c => isValidImage(c.image)).forEach(comic => {
    const year = parseInt(comic.year) || 2024
    if (year <= 1970)      eras.clasica.comics.push(comic)
    else if (year <= 1985) eras.bronce.comics.push(comic)
    else if (year <= 2000) eras.moderna.comics.push(comic)
    else                   eras.contemporanea.comics.push(comic)
  })

  Object.values(eras).forEach(e => e.comics.sort((a, b) => parseInt(a.year) - parseInt(b.year)))
  return eras
}

export default async function ComicsPage() {
  const allComics = await comicService.getAll()
  const eras = organizeComicsByEra(allComics)
  const featuredComic = allComics.find(c => c.slug === 'the-amazing-spider-man-1-1963')

  const totalComics = Object.values(eras).reduce((t, e) => t + e.comics.length, 0)
  const totalEras   = Object.values(eras).filter(e => e.comics.length > 0).length
  const coverComics = allComics.filter(c => isValidImage(c.image))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-red-950">

      {/* Hero con mosaico de portadas */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-5 md:grid-cols-8 gap-1 opacity-40 scale-110">
          {[...coverComics, ...coverComics].slice(0, 16).map((comic, i) => (
            <div key={i} className="relative h-full min-h-[300px]">
              <Image src={comic.image} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-gray-900/80 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-blue-950" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Cómics</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Cómics de<br />
            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">Spider-Man</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Desde Amazing Fantasy #15 hasta el Spider-Verse. Seis décadas de historias arácnidas.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalComics} cómics</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">{totalEras} eras</Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm">1962 – hoy</Badge>
          </div>

          {/* Filtros de era */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(eras).filter(([, e]) => e.comics.length > 0).map(([key, era]) => (
              <a
                key={key}
                href={`#era-${key}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 bg-gradient-to-r ${era.accent} to-transparent ${era.border} text-white hover:scale-105`}
              >
                {era.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Banner cómic destacado */}
      {featuredComic && (
        <div className="max-w-7xl mx-auto px-4 pt-12 mb-8">
          <Link href={`/comics/${featuredComic.slug}`}>
            <div className="group relative rounded-3xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl shadow-black/60 hover:border-white/20 transition-all duration-300">
              {/* Número año decorativo */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[140px] md:text-[220px] font-black text-white/15 select-none leading-none">
                {featuredComic.year}
              </div>
              <div className="relative flex items-center gap-8 md:gap-12 px-8 md:px-12 py-8">
                {/* Portada */}
                <div className="relative shrink-0">
                  <Image
                    src={featuredComic.image}
                    alt={featuredComic.title}
                    width={140}
                    height={210}
                    className="relative rounded-2xl shadow-2xl shadow-black/60 group-hover:scale-105 transition-transform duration-500 w-28 md:w-40"
                  />
                </div>
                {/* Texto */}
                <div className="flex-1">
                  <Badge className="bg-blue-600 text-white w-fit mb-4 text-xs tracking-widest uppercase">Cómic Esencial</Badge>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">{featuredComic.title}</h2>
                  <p className="text-gray-400 text-sm md:text-base line-clamp-2 max-w-lg mb-4">
                    {featuredComic.description?.replace('Descripción general', '').trim()}
                  </p>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">{featuredComic.year} · Stan Lee & Steve Ditko</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Lecturas Esenciales */}
      <div className="max-w-7xl mx-auto px-4 pt-4 mb-4">
        <div className="flex items-end gap-4 mb-6">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-yellow-500 to-orange-600" />
          <div>
            <h2 className="text-2xl font-bold text-white">Lecturas Esenciales</h2>
            <p className="text-gray-500 text-sm mt-0.5">Los cómics imprescindibles de Spider-Man</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ESSENTIAL_READS.map((pick) => {
            const comic = allComics.find(c => c.slug === pick.slug)
            return (
              <div key={pick.slug} className={`group relative rounded-2xl border ${pick.border} bg-gray-950 overflow-hidden flex gap-5 p-5 hover:border-white/20 transition-all duration-200`}>
                {/* Portada */}
                {comic?.image && isValidImage(comic.image) ? (
                  <Link href={`/comics/${pick.slug}`} className="shrink-0">
                    <div className="relative w-28 h-[168px] rounded-xl overflow-hidden shadow-xl">
                      <Image src={comic.image} alt={pick.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  </Link>
                ) : (
                  <div className={`shrink-0 w-28 h-[168px] rounded-xl bg-gradient-to-br ${pick.accent} flex items-center justify-center shadow-xl`}>
                    <BookOpen className="w-10 h-10 text-white/60" />
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Badge className={`bg-gradient-to-r ${pick.accent} text-white text-xs px-2.5 py-1 mb-3 w-fit`}>{pick.label}</Badge>
                    <h3 className="text-white font-bold text-base leading-snug mb-2">{pick.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{pick.description}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    {comic && (
                      <Link href={`/comics/${pick.slug}`} className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Ver análisis
                      </Link>
                    )}
                    <a
                      href={generateAmazonUrl(pick.amazonQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r ${pick.accent} text-white hover:opacity-90 transition-opacity`}
                    >
                      <ShoppingCart className="w-4 h-4" /> Comprar
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <InContentAd />
      </div>

      {/* Eras */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-20">
        {Object.entries(eras).map(([key, era]) => {
          if (era.comics.length === 0) return null
          return (
            <section key={key} id={`era-${key}`} className="scroll-mt-24">
              {/* Cabecera de era */}
              <div className="flex items-end gap-4 mb-8 pb-4 border-b border-white/10">
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${era.accent} to-transparent`} />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{era.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{era.subtitle}</p>
                </div>
                <Badge className="ml-auto bg-white/5 border-white/10 text-gray-400 text-sm">
                  {era.comics.length} cómic{era.comics.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Grid de portadas */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {era.comics.map((comic: Comic) => (
                  <Link key={comic.id} href={`/comics/${comic.slug}`} className="group">
                    <div className={`relative rounded-2xl overflow-hidden shadow-xl ${era.glow} shadow-lg`}>
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={comic.image}
                          alt={`${comic.title} - Cómic de Spider-Man`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Título + año siempre visibles */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                          <h3 className="text-white text-xs font-bold line-clamp-2 leading-tight text-center drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                            {comic.title}
                          </h3>
                        </div>

                        {/* Info en hover */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {comic.writer && (
                            <p className="text-gray-300 text-xs text-center mb-2 line-clamp-1">{comic.writer}</p>
                          )}
                          <div className="w-full flex items-center justify-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-2 rounded-lg">
                            <BookOpen className="w-3 h-3" />
                            Ver análisis
                          </div>
                        </div>

                        {/* Año arriba */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-gray-300 text-xs">{comic.year}</span>
                        </div>

                        {/* Badge número especial */}
                        {isSpecialIssue(comic.title) && (
                          <div className={`absolute top-2 right-2 ${isSpecialIssue(comic.title)!.color} backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1`}>
                            <Star className="w-3 h-3 text-white fill-white" />
                            <span className="text-white text-xs font-semibold">{isSpecialIssue(comic.title)!.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

    </div>
  )
}