import Link from "next/link"
import { CalendarDays, Brain, Sparkles, type LucideIcon } from "lucide-react"

export interface GameInfo {
  slug: string
  title: string
  tagline: string
  description: string
  icon: LucideIcon
  accent: string
}

export const JUEGOS: GameInfo[] = [
  {
    slug: "aranadle",
    title: "Arañadle",
    tagline: "Un personaje nuevo cada día",
    description: "Adivina el personaje secreto del universo de Spider-Man con pistas de colores. Ocho intentos, un reto al día.",
    icon: CalendarDays,
    accent: "from-red-600 to-red-900",
  },
  {
    slug: "test-spider-man",
    title: "Test de cultura arácnida",
    tagline: "10 preguntas, ¿cuántas aciertas?",
    description: "Películas, cómics, videojuegos y personajes: demuestra cuánto sabes de Spider-Man y compara tu nota.",
    icon: Brain,
    accent: "from-blue-600 to-blue-900",
  },
  {
    slug: "que-spider-man-eres",
    title: "¿Qué Spider-Man eres?",
    tagline: "Descubre tu Spider-Man del multiverso",
    description: "Responde 8 preguntas sobre tu forma de ser y descubre con qué Spider-Man del multiverso te identificas.",
    icon: Sparkles,
    accent: "from-purple-600 to-fuchsia-900",
  },
]

export function GameCard({ game }: { game: GameInfo }) {
  const Icon = game.icon
  return (
    <Link
      href={`/juegos/${game.slug}`}
      className="group block rounded-xl overflow-hidden border border-gray-800 bg-gray-900/70 hover:border-red-500/60 transition-colors"
    >
      <div className={`h-28 bg-gradient-to-br ${game.accent} flex items-center justify-center`}>
        <Icon className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform" />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">{game.tagline}</p>
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        <p className="text-sm text-gray-400">{game.description}</p>
      </div>
    </Link>
  )
}

export function OtherGames({ current }: { current: string }) {
  const others = JUEGOS.filter((g) => g.slug !== current)
  return (
    <section className="max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-white mb-5">Más juegos de Spider-Man</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {others.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </section>
  )
}
