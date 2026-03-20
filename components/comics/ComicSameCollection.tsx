import Image from 'next/image'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface ComicItem {
  slug: string
  title: string
  image: string
  year: string
}

interface ComicSameCollectionProps {
  storyline: string
  comics: ComicItem[]
}

export function ComicSameCollection({ storyline, comics }: ComicSameCollectionProps) {
  if (!comics || comics.length === 0) return null

  return (
    <div className="mt-8 bg-gray-900/50 border border-blue-600/20 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-blue-400" />
        Más de <span className="text-blue-400">{storyline}</span>
      </h3>
      <p className="text-gray-500 text-sm mb-6">Otros números de esta colección ordenados cronológicamente</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {comics.map((c) => (
          <Link key={c.slug} href={`/comics/${c.slug}`} className="group">
            <div className="relative overflow-hidden rounded-lg border border-gray-700/50 group-hover:border-blue-500/60 transition-all duration-300">
              <Image
                src={c.image}
                alt={c.title}
                width={150}
                height={225}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{c.title}</p>
                <p className="text-blue-400 text-xs mt-0.5">{c.year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
