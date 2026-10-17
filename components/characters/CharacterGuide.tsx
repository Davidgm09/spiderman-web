import Link from 'next/link'
import { Film, HelpCircle } from 'lucide-react'
import fichas from '@/data/personajes/fichas.json'

// Contenido ampliado de un personaje (data/personajes/fichas.json), escrito y revisado a mano.
// Si un personaje no tiene ficha, la página muestra solo su historia corta de la base de datos.
export interface CharacterFicha {
  nombre?: string // nombre en español para los títulos («La Viuda Negra»)
  secciones: { titulo: string; html: string }[]
  pantalla?: { titulo: string; anio: number; actor: string; enlace?: string }[]
  faqs?: { q: string; a: string }[]
}

export function getFicha(slug: string): CharacterFicha | undefined {
  return (fichas as Record<string, CharacterFicha>)[slug]
}

// Datos estructurados de las preguntas frecuentes, sin el HTML de las respuestas
export function fichaFaqJsonLd(ficha: CharacterFicha) {
  if (!ficha.faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ficha.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  }
}

function Heading({ children, bar, icon }: { children: React.ReactNode; bar: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${bar}`} />
      {icon}
      <h2 className="text-2xl font-bold text-white">{children}</h2>
    </div>
  )
}

export function CharacterGuide({ ficha, name, bar }: { ficha: CharacterFicha; name: string; bar: string }) {
  return (
    <div className="space-y-10">
      {ficha.secciones.map((s) => (
        <section key={s.titulo}>
          <Heading bar={bar}>{s.titulo}</Heading>
          <div className="blog-content text-lg" dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}

      {ficha.pantalla && ficha.pantalla.length > 0 && (
        <section>
          <Heading bar={bar} icon={<Film className="w-5 h-5 text-gray-400" />}>{ficha.nombre ?? name} en el cine y la televisión</Heading>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Año</th>
                  <th className="text-left font-medium px-4 py-3">Título</th>
                  <th className="text-left font-medium px-4 py-3">Intérprete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ficha.pantalla.map((p) => (
                  <tr key={`${p.titulo}-${p.anio}`} className="text-gray-200">
                    <td className="px-4 py-3 text-gray-400">{p.anio}</td>
                    <td className="px-4 py-3">
                      {p.enlace ? (
                        <Link href={p.enlace} className="text-red-400 hover:text-red-300 underline underline-offset-2">{p.titulo}</Link>
                      ) : (
                        <em>{p.titulo}</em>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {ficha.faqs && ficha.faqs.length > 0 && (
        <section>
          <Heading bar={bar} icon={<HelpCircle className="w-5 h-5 text-gray-400" />}>Preguntas frecuentes</Heading>
          <div className="space-y-4">
            {ficha.faqs.map((f) => (
              <div key={f.q} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                <p className="text-gray-300 leading-relaxed [&_a]:text-red-400 [&_a]:underline" dangerouslySetInnerHTML={{ __html: f.a }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
