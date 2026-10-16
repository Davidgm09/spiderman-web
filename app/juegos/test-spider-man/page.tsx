import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { TestSpiderMan, type Question } from "@/components/juegos/TestSpiderMan"
import { OtherGames } from "@/components/juegos/OtherGames"
import preguntas from "@/data/juegos/preguntas.json"

const TITLE = "Test de Spider-Man: ¿cuánto sabes del trepamuros?"
const DESCRIPTION =
  "10 preguntas sobre películas, cómics, series, videojuegos y personajes de Spider-Man. Descubre tu nivel de fan y comparte tu nota."

export const metadata: Metadata = {
  title: `${TITLE} | Sentido Arácnido`,
  description: DESCRIPTION,
  alternates: { canonical: "/juegos/test-spider-man" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/juegos/test-spider-man" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function TestPage() {
  const questions = preguntas as Question[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-red-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos", href: "/juegos" }, { label: "Test de cultura arácnida" }]} />

        <header className="text-center my-8">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">Test</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">¿Cuánto sabes de Spider-Man?</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            10 preguntas al azar de entre {questions.length}, de más fácil a más difícil. Cada partida es distinta.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <TestSpiderMan questions={questions} />
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <InContentAd />
        </div>

        <OtherGames current="test-spider-man" />
      </div>
    </div>
  )
}
