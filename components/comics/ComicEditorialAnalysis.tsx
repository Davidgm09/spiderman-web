import { Award } from 'lucide-react'

interface ComicEditorialAnalysisProps {
  title: string
  year: string
  writer?: string | null
  artist?: string | null
  importance: string
  rating: number
  characters?: string[] | null
  longDescription?: string | null
}

const cleanHtml = (html: string) =>
  html.replace(/<a[^>]*>([\s\S]*?)<\/a>/g, '$1').replace(/<h2>[^<]*<\/h2>/g, '')

export function ComicEditorialAnalysis({
  title, year, writer, artist, importance, rating, characters, longDescription
}: ComicEditorialAnalysisProps) {
  const strippedLong = longDescription?.replace(/<[^>]*>/g, '').trim() ?? ''
  const hasRichContent = strippedLong.length > 300

  const yearNum = parseInt(year)
  const eraTexto = yearNum < 1970
    ? 'los primeros años del Hombre Araña, cuando Stan Lee y Steve Ditko construían las bases del universo Marvel'
    : yearNum < 1980
    ? 'la Edad de Bronce del cómic americano, una etapa de mayor madurez narrativa y personajes más complejos'
    : yearNum < 1995
    ? 'la Edad de Cobre, marcada por la experimentación visual y guiones más oscuros y adultos'
    : yearNum < 2010
    ? 'la era moderna del cómic Marvel, con narrativas más ambiciosas y conexiones entre series'
    : 'la era contemporánea de Marvel, donde las grandes historias de Spider-Man conviven con el universo cinematográfico'

  const importanciaTexto = importance === 'Alta'
    ? 'Sus eventos dejaron una huella duradera en la continuidad del personaje y es considerado lectura obligatoria para cualquier fan del trepamuros.'
    : importance === 'Buena'
    ? 'Contribuye de forma significativa al desarrollo del universo arácnido, con momentos que los fans recuerdan con cariño.'
    : 'Completa el panorama del universo Spider-Man con su propia aportación al conjunto de historias del personaje.'

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-white/5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
        <h3 className="text-white font-bold text-lg">Análisis Editorial</h3>
        <Award className="w-4 h-4 text-blue-400 ml-auto" />
      </div>

      {/* Contenido */}
      <div className="px-6 py-6">
        {hasRichContent && longDescription ? (
          <div
            className="max-w-none
              [&>p]:mb-5 [&>p]:text-gray-300 [&>p]:leading-[1.85] [&>p]:text-base
              [&>p:first-of-type]:text-lg [&>p:first-of-type]:text-gray-100 [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:pl-4 [&>p:first-of-type]:border-l-2 [&>p:first-of-type]:border-blue-500/50 [&>p:first-of-type]:italic
              [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-blue-400 [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:uppercase [&>h3]:tracking-widest [&>h3]:text-xs
              [&>strong]:text-white [&>strong]:font-semibold
              [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul]:space-y-1 [&>ul]:text-gray-300 [&>ul]:text-sm
              [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol]:text-gray-300 [&>ol]:text-sm"
            dangerouslySetInnerHTML={{ __html: cleanHtml(longDescription) }}
          />
        ) : (
          <div className="space-y-6">
            <p className="text-gray-100 text-base leading-relaxed pl-4 border-l-2 border-blue-500/50 italic">
              {title} se publicó en {year}, durante {eraTexto}.
              {writer ? ` El guion corrió a cargo de ${writer}` : ''}
              {artist ? `, con arte de ${artist}` : ''}.
            </p>
            <p className="text-gray-300 leading-relaxed text-base">
              {rating >= 9
                ? 'Una obra excepcional dentro del catálogo de Spider-Man. Su combinación de guion y arte crea una experiencia de lectura que ha perdurado en la memoria colectiva de los fans durante décadas.'
                : rating >= 7
                ? 'Una entrega sólida dentro del canon arácnido que equilibra bien acción, emoción y desarrollo de personajes en el formato del cómic de superhéroes.'
                : 'Una propuesta que aporta su perspectiva particular al universo Spider-Man con elementos de interés para los seguidores del personaje.'
              }
            </p>
            <p className="text-gray-300 leading-relaxed text-base">{importanciaTexto}</p>
          </div>
        )}
      </div>
    </div>
  )
}
