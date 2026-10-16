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
    <div className="pt-24 pb-16">
      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos", href: "/juegos" }, { label: "Test de cultura arácnida" }]} />

        <header className="text-center my-8">
          <p className="font-pixel text-[10px] text-yellow-300 tracking-widest mb-5">02 · Desafío</p>
          <h1 className="font-pixel text-2xl md:text-4xl leading-snug mb-5"><span className="text-white">¿Cuánto sabes de</span> <span className="neon-blue">Spider-Man?</span></h1>
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
