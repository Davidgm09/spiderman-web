import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { Aranadle } from "@/components/juegos/Aranadle"
import { OtherGames } from "@/components/juegos/OtherGames"
import type { GameCharacter } from "@/lib/juegos"
import personajes from "@/data/juegos/personajes.json"

const TITLE = "Arañadle: adivina el personaje de Spider-Man del día"
const DESCRIPTION =
  "Cada día, un personaje secreto del universo de Spider-Man. Tienes 8 intentos y pistas de colores para adivinarlo. Comparte tu resultado y mantén la racha."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/juegos/aranadle" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/juegos/aranadle" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

const LEGEND = [
  { color: "bg-green-600", text: "Coincide con el personaje secreto" },
  { color: "bg-yellow-500", text: "Coincide en parte (algún creador o grupo en común)" },
  { color: "bg-red-900", text: "No coincide" },
]

export default function AranadlePage() {
  const characters = personajes as GameCharacter[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos", href: "/juegos" }, { label: "Arañadle" }]} />

        <header className="text-center my-8">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-2">Juego diario</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Araña<span className="text-red-500">dle</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Adivina el personaje del universo de Spider-Man de hoy. Cada intento te dice en qué se parece al personaje secreto.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <Aranadle characters={characters} />
        </div>

        <section className="max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-white mb-3">Cómo se juega</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Escribe el nombre de cualquier personaje (en inglés o en español) y elígelo de la lista.</li>
              <li>Cada casilla te dice si ese dato coincide con el del personaje secreto.</li>
              <li>En <strong>Debut</strong>, la flecha indica si el personaje secreto apareció antes (↓) o después (↑).</li>
              <li>Tras 4 fallos recibes una pista y, tras 6, una imagen borrosa.</li>
              <li>Tienes 8 intentos. El personaje cambia cada día a medianoche (hora peninsular).</li>
            </ul>
          </div>
          <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-white mb-3">Qué significa cada color</h2>
            <ul className="space-y-2">
              {LEGEND.map((l) => (
                <li key={l.text} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded ${l.color} shrink-0`} />
                  {l.text}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-400">
              Los datos salen de nuestras <Link href="/personajes" className="text-red-400 hover:text-red-300 underline">fichas de personajes</Link>:
              {" "}{characters.length} héroes, villanos y Spider-Men del multiverso.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto mt-10">
          <InContentAd />
        </div>

        <OtherGames current="aranadle" />
      </div>
    </div>
  )
}
