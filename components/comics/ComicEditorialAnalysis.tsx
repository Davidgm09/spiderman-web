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
    <div className="bg-gradient-to-br from-gray-900/80 to-blue-950/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
      <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
        <Award className="w-8 h-8 mr-3 text-blue-400" />
        Análisis Editorial
      </h3>

      {hasRichContent && longDescription ? (
        <div
          className="text-gray-300 text-lg leading-relaxed max-w-none
            [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-blue-400 [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:border-b [&>h3]:border-blue-500/20 [&>h3]:pb-2
            [&>p]:mb-4 [&>p]:text-gray-300 [&>p]:leading-relaxed
            [&>p:first-of-type]:text-lg [&>p:first-of-type]:text-gray-200
            [&>strong]:text-white [&>strong]:font-semibold
            [&>em]:text-gray-200 [&>em]:italic
            [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul]:space-y-1
            [&>li]:text-gray-300
            [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4"
          dangerouslySetInnerHTML={{ __html: cleanHtml(longDescription) }}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h4 className="text-xl font-semibold text-blue-400 mb-3 border-b border-blue-500/20 pb-2">
              Contexto de Publicación
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {title} se publicó en {year}, durante {eraTexto}.
              {writer ? ` El guion corrió a cargo de ${writer}` : ''}
              {artist ? `, con arte de ${artist}` : ''}.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-blue-400 mb-3 border-b border-blue-500/20 pb-2">
              Valor Narrativo
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {rating >= 9
                ? 'Una obra excepcional dentro del catálogo de Spider-Man. Su combinación de guion y arte crea una experiencia de lectura que ha perdurado en la memoria colectiva de los fans durante décadas.'
                : rating >= 7
                ? 'Una entrega sólida dentro del canon arácnido que equilibra bien acción, emoción y desarrollo de personajes en el formato del cómic de superhéroes.'
                : 'Una propuesta que aporta su perspectiva particular al universo Spider-Man con elementos de interés para los seguidores del personaje.'
              }
              {characters && characters.length > 0
                ? ` Protagonizada por ${characters.slice(0, 3).join(', ')}${characters.length > 3 ? ` y otros ${characters.length - 3} personajes` : ''}.`
                : ''
              }
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-blue-400 mb-3 border-b border-blue-500/20 pb-2">
              Importancia en el Canon
            </h4>
            <p className="text-gray-300 leading-relaxed">{importanciaTexto}</p>
          </div>
        </div>
      )}
    </div>
  )
}
