import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { JUEGOS, GameCard } from "@/components/juegos/OtherGames"
import { SITE_URL } from "@/lib/config"

const TITLE = "Juegos de Spider-Man: reto diario, test y quiz"
const DESCRIPTION =
  "Minijuegos de Spider-Man gratis en el navegador: adivina el personaje del día en Arañadle, pon a prueba tus conocimientos en el test y descubre qué Spider-Man eres."

export const metadata: Metadata = {
  title: `${TITLE} | Sentido Arácnido`,
  description: DESCRIPTION,
  alternates: { canonical: "/juegos" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/juegos" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

const RULES = [
  { icon: "♥", title: "Gratis y sin registro", text: "Entra y juega. No hace falta cuenta ni descargar nada." },
  { icon: "★", title: "Tu progreso, contigo", text: "Rachas, récords y resultados se guardan solo en tu navegador." },
  { icon: "?", title: "Datos de verdad", text: "Todo sale de nuestras fichas de personajes, películas y cómics, revisadas una a una." },
]

export default function JuegosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Juegos de Spider-Man",
    itemListElement: JUEGOS.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: `${SITE_URL}/juegos/${g.slug}`,
    })),
  }

  return (
    <div className="pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <Breadcrumb items={[{ label: "Juegos" }]} />

        <header className="text-center mt-10 mb-12">
          <p className="font-pixel text-[10px] sm:text-xs text-yellow-300 mb-6 tracking-widest">Sentido Arácnido · Arcade</p>
          <h1 className="font-pixel text-3xl sm:text-5xl leading-tight mb-6">
            <span className="neon-red">ELIGE</span> <span className="text-white">TU</span> <span className="neon-blue">JUEGO</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Un reto nuevo cada día, un desafío para demostrar cuánto sabes y un test para descubrir tu Spider-Man del multiverso.
          </p>
          <p className="font-pixel text-[10px] sm:text-xs text-white mt-8 arcade-blink" aria-hidden>
            ▼ PULSA PARA JUGAR ▼
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {JUEGOS.map((g, i) => <GameCard key={g.slug} game={g} index={i} />)}
        </div>

        <section className="mt-16 grid sm:grid-cols-3 gap-4">
          {RULES.map((r) => (
            <div key={r.title} className="rounded-xl bg-black/50 border-2 border-gray-800 p-5">
              <span className="font-pixel text-lg neon-red">{r.icon}</span>
              <h2 className="font-pixel text-[11px] leading-relaxed text-white mt-3 mb-2">{r.title.toUpperCase()}</h2>
              <p className="text-sm text-gray-400">{r.text}</p>
            </div>
          ))}
        </section>

        <div className="mt-12">
          <InContentAd />
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          ¿Has fallado alguna pregunta? Cada respuesta enlaza a nuestras fichas de{" "}
          <Link href="/personajes" className="text-red-400 hover:text-red-300 underline">personajes</Link>,{" "}
          <Link href="/peliculas" className="text-red-400 hover:text-red-300 underline">películas</Link> y{" "}
          <Link href="/comics" className="text-red-400 hover:text-red-300 underline">cómics</Link> para que sigas aprendiendo.
        </p>
      </div>
    </div>
  )
}
