import { Award } from 'lucide-react'
import type { Character } from '@prisma/client'
import { comicContext, comicSeriesName, cleanArcName } from '@/lib/comic-context'
import { matchCharacter } from '@/lib/comic-characters'

interface ComicEditorialAnalysisProps {
  slug: string
  title: string
  year: string
  writer?: string | null
  artist?: string | null
  characters?: string[] | null
  storylines?: string[] | null
  firstAppearances?: string[] | null
  longDescription?: string | null
  allCharacters: Character[]
}

const cleanHtml = (html: string) =>
  html.replace(/<a[^>]*>([\s\S]*?)<\/a>/g, '$1').replace(/<h2>[^<]*<\/h2>/g, '')

// "A, B y C"
const listEs = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`

// Las sinopsis importadas se recortaron a 500 caracteres: se cortan en la última frase completa
const toLastSentence = (text: string) => {
  if (/[.!?…»"')]$/.test(text)) return text
  const cut = Math.max(text.lastIndexOf('. '), text.lastIndexOf('! '), text.lastIndexOf('? '))
  return cut > 80 ? text.slice(0, cut + 1) : `${text}…`
}

// Nombres que ya acaban en punto ("John Romita Sr.") no deben llevar otro
const endSentence = (s: string) => (s.endsWith('.') ? s : `${s}.`)

// Texto de relleno que dejó la importación cuando Comic Vine no traía sinopsis
const isPlaceholder = (text: string) => /^Cómic .* de Marvel Comics\.?$/.test(text.trim())

// Todo lo que se muestra sale de datos reales del número; si no hay nada, la sección no aparece
export function ComicEditorialAnalysis({
  slug, title, year, writer, artist, characters, storylines, firstAppearances, longDescription, allCharacters,
}: ComicEditorialAnalysisProps) {
  const synopsisText = longDescription?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
  const hasSynopsis = !!synopsisText && !isPlaceholder(synopsisText.replace(title, '').trim()) && !isPlaceholder(synopsisText)
  // HTML simple (título + un párrafo, lo habitual en la importación): texto plano cortado en la última frase
  const isSimple = !!longDescription && !/<(ul|ol|h3|strong|br)/i.test(longDescription) && (longDescription.match(/<p>/g) ?? []).length <= 1
  const synopsisPlain = hasSynopsis && isSimple ? toLastSentence(synopsisText.replace(title, '').trim()) : null
  const synopsis = hasSynopsis && !isSimple ? cleanHtml(longDescription!) : null

  const context = comicContext(slug, title, year)

  // Datos concretos del número
  const facts: string[] = []
  const realWriter = writer && writer !== 'Marvel Comics' ? writer : null
  const realArtist = artist && artist !== 'Marvel Comics' ? artist : null
  if (realWriter && realArtist) facts.push(endSentence(`Lleva guion de ${realWriter} y dibujo de ${realArtist}`))
  else if (realWriter) facts.push(endSentence(`Lleva guion de ${realWriter}`))
  else if (realArtist) facts.push(endSentence(`Lleva dibujo de ${realArtist}`))

  const series = comicSeriesName(title)
  const arcs = (storylines ?? []).map(cleanArcName).filter((s) => s && s !== series)
  if (arcs.length) facts.push(`Forma parte ${arcs.length > 1 ? 'de los arcos' : 'del arco'} ${listEs(arcs.map((a) => `«${a}»`))}.`)

  // Personajes con ficha en la web primero (los reconocibles), sin repetir a Spider-Man
  const names = (characters ?? []).filter((n) => n !== 'Spider-Man')
  const notable = names
    .map((n) => matchCharacter(n, allCharacters))
    .filter((c): c is Character => !!c && c.slug !== 'spider-man-peter-parker-alt')
    .map((c) => c.name.split(' (')[0])
    .filter((n, i, arr) => arr.indexOf(n) === i)
  const shown = notable.length ? notable.slice(0, 5) : names.slice(0, 4)
  if (shown.length === 1) facts.push(endSentence(`Cuenta con la aparición de ${shown[0]}`))
  else if (shown.length) facts.push(endSentence(`${notable.length ? 'Entre los personajes destacados aparecen' : 'Aparecen, entre otros,'} ${listEs(shown)}`))

  const firsts = firstAppearances ?? []
  if (firsts.length) facts.push(`Incluye la primera aparición de ${listEs(firsts)}.`)

  if (!synopsis && !synopsisPlain && !context && facts.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-white/5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
        <h3 className="text-white font-bold text-lg">Sobre este cómic</h3>
        <Award className="w-4 h-4 text-blue-400 ml-auto" />
      </div>

      <div className="px-6 py-6 space-y-6">
        {synopsisPlain && (
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Sinopsis</h4>
            <p className="text-gray-200 leading-[1.85] text-base">{synopsisPlain}</p>
          </div>
        )}

        {synopsis && (
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Sinopsis</h4>
            <div
              className="max-w-none
                [&>p]:mb-4 [&>p]:text-gray-200 [&>p]:leading-[1.85] [&>p]:text-base
                [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-blue-400 [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:uppercase [&>h3]:tracking-widest
                [&>strong]:text-white [&>strong]:font-semibold
                [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul]:space-y-1 [&>ul]:text-gray-300 [&>ul]:text-sm
                [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol]:text-gray-300 [&>ol]:text-sm"
              dangerouslySetInnerHTML={{ __html: synopsis }}
            />
          </div>
        )}

        {(context || facts.length > 0) && (
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Contexto</h4>
            {context && <p className="text-gray-300 leading-relaxed text-base mb-4">{context}</p>}
            {facts.length > 0 && <p className="text-gray-300 leading-relaxed text-base">{facts.join(' ')}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
