"use client"

import { useState } from "react"
import { Play } from "lucide-react"

// Acepta watch?v=, youtu.be/ o /embed/ y devuelve el ID del vídeo
function getVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  return match ? match[1] : null
}

// Muestra la miniatura y solo carga el reproductor de YouTube (~1 MB de JS) al pulsar play
export function YouTubeLite({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const id = getVideoId(url)

  if (!id) {
    return <iframe src={url} title={title} loading="lazy" className="w-full h-full border-0" allowFullScreen />
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir ${title}`}
      className="group relative w-full h-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 group-hover:scale-110 transition-all shadow-2xl">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </span>
      </span>
    </button>
  )
}
