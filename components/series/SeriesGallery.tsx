'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type SceneImage = {
  url: string
  title: string
  description: string
  type: 'still' | 'backdrop'
  season?: number
  episode?: number
}

interface Props {
  tmdbId: number | null
  seriesImage: string
  seriesTitle: string
  logoImage?: string | null
}

export function SeriesGallery({ tmdbId, seriesImage, seriesTitle, logoImage }: Props) {
  const [images, setImages] = useState<SceneImage[]>([])
  const [loading, setLoading] = useState(!!tmdbId)

  useEffect(() => {
    if (!tmdbId) {
      setLoading(false)
      return
    }

    fetch(`/api/external/series/${tmdbId}/images`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const gallery: SceneImage[] = data?.result?.gallery || []
        setImages(gallery)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tmdbId])

  // Construir lista final de imágenes a mostrar
  const toDisplay: SceneImage[] = [
    ...images,
    ...(logoImage ? [{ url: logoImage, title: 'Logo Oficial de la Serie', description: 'El logo icónico de la serie animada', type: 'backdrop' as const }] : []),
    ...(images.length === 0 ? [{ url: seriesImage, title: `Imagen principal de ${seriesTitle}`, description: 'La imagen oficial de la serie', type: 'backdrop' as const }] : []),
  ].slice(0, 9)

  if (!loading && toDisplay.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
        <h3 className="text-2xl font-bold text-white">Galería de Escenas</h3>
        {!loading && images.length > 0 && (
          <span className="ml-auto text-xs text-gray-500">{images.length} imágenes</span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`rounded-xl bg-gray-800/60 animate-pulse ${i === 0 ? 'col-span-2 row-span-2 aspect-video' : 'aspect-video'}`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {toDisplay.map((img, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <div className="relative w-full aspect-video">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.type === 'still' && img.season && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-gray-300 text-xs">T{img.season}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-white text-xs font-medium line-clamp-1">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
