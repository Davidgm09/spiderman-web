import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { Aranadle } from "@/components/juegos/Aranadle"
import { OtherGames } from "@/components/juegos/OtherGames"
import type { GameCharacter } from "@/lib/juegos"
import personajes from "@/data/juegos/personajes.json"

// La imagen de /juegos (definir openGraph aquí anula la heredada)
const OG_IMAGE = "/juegos/opengraph-image.jpg"
const TITLE = "Arañadle: adivina el personaje de Spider-Man del día"
const DESCRIPTION =
  "Cada día, un personaje secreto del universo de Spider-Man. Tienes 8 intentos y pistas de colores para adivinarlo. Comparte tu resultado y mantén la racha."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/juegos/aranadle" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/juegos/aranadle", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
}

const LEGEND = [
  { color: "bg-green-600", text: "Coincide con el personaje secreto" },
  { color: "bg-yellow-500", text: "Coincide en parte (algún creador o grupo en común)" },
  { color: "bg-red-900", text: "No coincide" },
]

export default function AranadlePage() {
  const characters = personajes as GameCharacter[]

  return (
    <div className="pt-24 pb-16">
      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos", href: "/juegos" }, { label: "Arañadle" }]} />

        <header className="text-center my-8">
          <p className="font-pixel text-[10px] text-yellow-300 tracking-widest mb-5">01 · Reto diario</p>
          <h1 className="font-pixel text-3xl md:text-5xl mb-5">
            <span className="text-white">ARAÑA</span><span className="neon-red">DLE</span>
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
            <h2 className="font-pixel text-xs text-white mb-4">Cómo se juega</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Escribe el nombre de cualquier personaje (en inglés o en español) y elígelo de la lista.</li>
              <li>Cada casilla te dice si ese dato coincide con el del personaje secreto.</li>
              <li>En <strong>Debut</strong>, la flecha indica si el personaje secreto apareció antes (↓) o después (↑).</li>
              <li>Tras 4 fallos recibes una pista y, tras 6, una imagen borrosa.</li>
              <li>Tienes 8 intentos. El personaje cambia cada día a medianoche (hora peninsular).</li>
            </ul>
          </div>
          <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-5">
            <h2 className="font-pixel text-xs text-white mb-4">Los colores</h2>
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
