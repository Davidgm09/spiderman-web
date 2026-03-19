"use client"

import { useState } from "react"
import Image from "next/image"

const PETER_DATA = {
  image: "/images/image.png",
  alt: "Peter Parker - Ultimate Spider-Man cómic",
  tag: "Peter Parker · Ultimate Marvel · Earth-1610",
  title: "Hola, soy Peter Parker",
  paragraphs: [
    "Soy un chico normal de Queens. Estudiante del Instituto Midtown, friki de la ciencia y fotógrafo del Daily Bugle. Vivo con mi tía May.",
    "Me picó una araña radiactiva en una excursión escolar y desde entonces... bueno, digamos que mi vida cambió bastante. No siempre en el buen sentido.",
    "Aunque a veces las cosas se complican un poco. Pero eso es harina de otro costal.",
  ],
  cta: "¿Quieres saber más sobre mi historia? Explora los cómics y películas.",
  buttonText: "Revelar identidad secreta",
  accent: "red" as const,
}

const SPIDER_DATA = {
  image: "/images/spiderman.jpg",
  alt: "Ultimate Spider-Man - Earth-1610",
  tag: "Spider-Man · Ultimate Marvel · El Vecino Amistoso",
  title: "Tu vecino amistoso Spider-Man",
  paragraphs: [
    "Sí, era yo todo el tiempo. Con un gran poder viene una gran responsabilidad. Aprendí eso a las malas, pero es lo que me hace seguir.",
    "Protejo Queens cada día. Sentido arácnido, telarañas, escalar paredes... no está mal para un chaval de instituto que todavía tiene que entregar deberes.",
    "Bienvenido a Spider-World: el lugar donde encontrarás todo sobre mi universo. Cómics, películas, videojuegos, series y mucho más.",
  ],
  cta: "Explora todo el universo Ultimate y más en Spider-World.",
  buttonText: "Volver a mi identidad",
  accent: "blue" as const,
}

interface Props {
  counts: { movies: number; comics: number; games: number; series: number }
}

export function PeterParkerIntro({ counts }: Props) {
  const [side, setSide] = useState<"peter" | "spider">("peter")
  const [angle, setAngle] = useState(0)
  const [duration, setDuration] = useState(300)
  const [busy, setBusy] = useState(false)

  const data = side === "peter" ? PETER_DATA : SPIDER_DATA
  const isBlue = data.accent === "blue"

  function handleFlip() {
    if (busy) return
    setBusy(true)

    // Fase 1: rotar hasta 90° (de canto)
    setDuration(300)
    setAngle(90)

    setTimeout(() => {
      // Fase 2: swap instantáneo desde -90°
      setDuration(0)
      setSide(prev => prev === "peter" ? "spider" : "peter")
      setAngle(-90)

      // Fase 3: volver a 0° con el nuevo contenido
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setDuration(300)
        setAngle(0)
        setTimeout(() => setBusy(false), 300)
      }))
    }, 300)
  }

  return (
    <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div style={{ perspective: "1200px" }}>
        <div
          style={{
            transform: `rotateY(${angle}deg)`,
            transition: `transform ${duration}ms ${duration === 300 && angle === 0 ? "ease-out" : "ease-in"}`,
          }}
        >
          <div className={`
            grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
            rounded-3xl p-8 md:p-12
            bg-gray-900/60 backdrop-blur-sm
            border transition-colors duration-300
            ${isBlue ? "border-blue-500/40" : "border-red-500/40"}
            shadow-2xl
          `}>
            {/* Imagen */}
            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-red-900/30">
                <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl overflow-hidden">
                  <Image
                    src={data.image}
                    alt={data.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <button
                  onClick={handleFlip}
                  className={`
                    absolute bottom-4 left-1/2 -translate-x-1/2
                    px-5 py-2.5 rounded-full text-sm font-semibold
                    backdrop-blur-sm border transition-all duration-300
                    ${isBlue
                      ? "bg-blue-600/80 border-blue-400/50 text-white hover:bg-blue-500/90"
                      : "bg-red-600/80 border-red-400/50 text-white hover:bg-red-500/90"
                    }
                    shadow-lg hover:scale-105 active:scale-95
                  `}
                >
                  {data.buttonText}
                </button>
              </div>

              <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-20 -z-10 transition-colors duration-300 ${
                isBlue ? "bg-blue-600" : "bg-red-600"
              }`} />
            </div>

            {/* Texto */}
            <div>
              <span className={`inline-block text-sm font-semibold tracking-widest uppercase mb-3 ${
                isBlue ? "text-blue-400" : "text-red-400"
              }`}>
                {data.tag}
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {data.title}
              </h2>

              <div className="space-y-4">
                {data.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed text-lg">{p}</p>
                ))}
              </div>

              <p className={`mt-6 text-sm italic ${isBlue ? "text-blue-300" : "text-red-300"}`}>
                {data.cta}
              </p>

              <div className={`mt-8 pt-6 border-t flex flex-wrap gap-6 ${
                isBlue ? "border-blue-500/20" : "border-red-500/20"
              }`}>
                {[
                  { value: counts.movies, label: "Películas" },
                  { value: counts.comics, label: "Cómics" },
                  { value: counts.games, label: "Videojuegos" },
                  { value: counts.series, label: "Series" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className={`text-xl font-bold ${isBlue ? "text-blue-400" : "text-red-400"}`}>
                      {value}+
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}