import Link from "next/link"
import type { GameCharacter } from "@/lib/juegos"
import personajes from "@/data/juegos/personajes.json"
import quiz from "@/data/juegos/que-spider-man-eres.json"
import { PlayerChip } from "./PlayerChip"

export interface GameInfo {
  slug: string
  title: string
  mode: string
  description: string
  stats: string[]
  glow: string
  accent: string
  art: string[] // slugs de personajes para el arte del cartucho
}

export const JUEGOS: GameInfo[] = [
  {
    slug: "aranadle",
    title: "Arañadle",
    mode: "Reto diario",
    description: "Adivina el personaje secreto del día con pistas de colores.",
    stats: ["45 personajes", "8 vidas"],
    glow: "#ef4444",
    accent: "from-red-600/90 to-red-950",
    art: ["spider-man-2099-miguel-ohara-alt"],
  },
  {
    slug: "test-spider-man",
    title: "Test arácnido",
    mode: "Desafío",
    description: "10 preguntas de películas, cómics y juegos. ¿Llegarás al pleno?",
    stats: ["78 preguntas", "10 rondas"],
    glow: "#3b82f6",
    accent: "from-blue-600/90 to-blue-950",
    art: ["doctor-octopus-otto-octavius-alt", "green-goblin-norman-osborn-alt", "venom-eddie-brock-alt", "mysterio-quentin-beck-alt"],
  },
  {
    slug: "que-spider-man-eres",
    title: "¿Qué Spider-Man eres?",
    mode: "Personalidad",
    description: "8 preguntas sobre ti y un Spider-Man del multiverso a tu medida.",
    stats: ["8 preguntas", "8 finales"],
    glow: "#a855f7",
    accent: "from-purple-600/90 to-fuchsia-950",
    art: ["spider-gwen-gwen-stacy-alt", "spider-man-miles-morales-alt", "spider-man-noir-peter-parker-alt"],
  },
]

const images = new Map((personajes as GameCharacter[]).map((c) => [c.slug, c.image]))
const quizNames = Object.fromEntries(Object.entries(quiz.profiles).map(([id, p]) => [id, p.name]))

/* eslint-disable @next/next/no-img-element */
function CartridgeArt({ game }: { game: GameInfo }) {
  const srcs = game.art.map((s) => images.get(s)).filter(Boolean) as string[]
  if (game.slug === "aranadle") {
    return (
      <div className="relative h-full">
        <img src={srcs[0]} alt="" className="absolute inset-0 w-full h-full object-cover blur-[6px] brightness-[0.35] saturate-0 scale-110" loading="lazy" />
        <span className="absolute inset-0 flex items-center justify-center font-pixel text-7xl neon-red">?</span>
      </div>
    )
  }
  if (game.slug === "test-spider-man") {
    return (
      <div className="grid grid-cols-4 h-full">
        {srcs.map((src) => (
          <img key={src} src={src} alt="" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition" loading="lazy" />
        ))}
      </div>
    )
  }
  return (
    <div className="relative h-full flex items-center justify-center">
      {srcs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="absolute w-24 h-32 object-cover rounded-md border-2 border-white/80 shadow-xl transition-transform duration-200"
          style={{ transform: `translateX(${(i - 1) * 64}px) rotate(${(i - 1) * 10}deg)`, zIndex: i === 1 ? 2 : 1 }}
        />
      ))}
    </div>
  )
}

export function GameCard({ game, index }: { game: GameInfo; index: number }) {
  return (
    <Link
      href={`/juegos/${game.slug}`}
      className="cartridge group relative z-10 flex flex-col rounded-xl overflow-hidden bg-gray-950 border-2 border-gray-800 outline-none"
      style={{ ["--glow" as string]: game.glow }}
    >
      {/* Pantalla */}
      <div className={`relative h-44 bg-gradient-to-b ${game.accent} overflow-hidden`}>
        <CartridgeArt game={game} />
        <span className="absolute top-2 left-2 font-pixel text-[9px] px-2 py-1 bg-black/70 text-white rounded">
          {String(index + 1).padStart(2, "0")} · {game.mode}
        </span>
      </div>
      {/* Etiqueta del cartucho */}
      <div className="flex flex-col flex-1 p-5 gap-3 border-t-2 border-black">
        <h3 className="font-pixel text-sm sm:text-base leading-relaxed text-white">{game.title}</h3>
        <p className="text-sm text-gray-400 flex-1">{game.description}</p>
        <div className="flex flex-wrap gap-2">
          {game.stats.map((s) => (
            <span key={s} className="font-pixel text-[9px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">{s.toUpperCase()}</span>
          ))}
        </div>
        <PlayerChip game={game.slug} names={quizNames} />
        <span
          className="font-pixel text-xs text-center py-3 rounded-lg text-white border-b-4 border-black/60 group-hover:brightness-110 transition"
          style={{ backgroundColor: game.glow }}
        >
          ▶ JUGAR
        </span>
      </div>
    </Link>
  )
}

export function OtherGames({ current }: { current: string }) {
  const others = JUEGOS.filter((g) => g.slug !== current)
  return (
    <section className="relative z-10 max-w-4xl mx-auto mt-14">
      <h2 className="font-pixel text-base sm:text-lg text-white mb-6">
        <span className="neon-blue">▶</span> Más juegos
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {others.map((g) => <GameCard key={g.slug} game={g} index={JUEGOS.indexOf(g)} />)}
      </div>
    </section>
  )
}
