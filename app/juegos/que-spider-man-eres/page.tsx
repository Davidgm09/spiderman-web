import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { InContentAd } from "@/components/ads/GoogleAdsense"
import { QueSpiderManEres, type Profile, type PersonalityQuestion } from "@/components/juegos/QueSpiderManEres"
import { OtherGames } from "@/components/juegos/OtherGames"
import type { GameCharacter } from "@/lib/juegos"
import data from "@/data/juegos/que-spider-man-eres.json"
import personajes from "@/data/juegos/personajes.json"

// La imagen de /juegos (definir openGraph aquí anula la heredada)
const OG_IMAGE = "/juegos/opengraph-image.jpg"
const TITLE = "¿Qué Spider-Man eres? Test de personalidad del multiverso"
const DESCRIPTION =
  "Responde 8 preguntas y descubre si eres Peter Parker, Miles Morales, Gwen Stacy, Miguel O'Hara, Spider-Man Noir, Spider-Ham, Pavitr o Mayday Parker."

const images = new Map((personajes as GameCharacter[]).map((c) => [c.slug, c.image]))
const PROFILES: Record<string, Profile> = Object.fromEntries(
  Object.entries(data.profiles).map(([id, p]) => [id, { ...p, image: images.get(p.slug) || "/images/spiderman.jpg" }])
)

interface PageProps {
  searchParams: Promise<{ r?: string }>
}

// Los enlaces compartidos (?r=miles) muestran el resultado en la vista previa de redes sociales
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { r } = await searchParams
  const p = r ? PROFILES[r] : undefined
  const title = p ? `Soy ${p.name}: «${p.title}». ¿Qué Spider-Man eres tú?` : TITLE
  const description = p ? p.text : DESCRIPTION
  return {
    title: p ? title : `${TITLE} | Sentido Arácnido`,
    description,
    alternates: { canonical: "/juegos/que-spider-man-eres" },
    openGraph: { title, description, type: "website", url: "/juegos/que-spider-man-eres", images: [p ? p.image : OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [p ? p.image : OG_IMAGE] },
  }
}

export default async function QueSpiderManEresPage({ searchParams }: PageProps) {
  const { r } = await searchParams

  return (
    <div className="pt-24 pb-16">
      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <Breadcrumb items={[{ label: "Juegos", href: "/juegos" }, { label: "¿Qué Spider-Man eres?" }]} />

        <header className="text-center my-8">
          <p className="font-pixel text-[10px] text-yellow-300 tracking-widest mb-5">03 · Personalidad</p>
          <h1 className="font-pixel text-2xl md:text-4xl leading-snug mb-5"><span className="text-white">¿Qué</span> <span className="neon-red">Spider-Man</span> <span className="text-white">eres?</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Ocho preguntas, ocho Spider-Man del multiverso. Responde con sinceridad y descubre con cuál te identificas.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <QueSpiderManEres profiles={PROFILES} questions={data.questions as unknown as PersonalityQuestion[]} initialResult={r} />
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <InContentAd />
        </div>

        <OtherGames current="que-spider-man-eres" />
      </div>
    </div>
  )
}
