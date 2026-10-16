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
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos" }]} />

        <header className="text-center my-10">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Sentido Arácnido · Juegos</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Juegos de <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Spider-Man</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Un reto nuevo cada día, un test para demostrar cuánto sabes y un quiz para descubrir tu Spider-Man del multiverso.
            Gratis, sin registro y en el navegador.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {JUEGOS.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>

        <div className="mt-12">
          <InContentAd />
        </div>

        <section className="mt-12 max-w-3xl mx-auto text-gray-300 space-y-4">
          <h2 className="text-2xl font-bold text-white">Juegos hechos por fans, para fans</h2>
          <p>
            Todos los juegos usan los datos de nuestras fichas de{" "}
            <Link href="/personajes" className="text-red-400 hover:text-red-300 underline">personajes</Link>,{" "}
            <Link href="/peliculas" className="text-red-400 hover:text-red-300 underline">películas</Link> y{" "}
            <Link href="/comics" className="text-red-400 hover:text-red-300 underline">cómics</Link>, revisados uno a uno.
            Si fallas una pregunta, siempre tienes a mano el artículo donde se explica la respuesta.
          </p>
          <p>
            Tus estadísticas (partidas, rachas y mejores notas) se guardan solo en tu navegador: no necesitas cuenta
            ni compartimos ningún dato.
          </p>
        </section>
      </div>
    </div>
  )
}
