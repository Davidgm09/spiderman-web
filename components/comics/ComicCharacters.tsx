import Image from 'next/image'
import Link from 'next/link'
import { Character } from '@prisma/client'

interface ComicCharactersProps {
  characterNames: string[]
  allCharacters: Character[]
}

function matchCharacter(name: string, characters: Character[]): Character | null {
  const n = name.toLowerCase()
  // Exact match first
  let match = characters.find(c => c.name.toLowerCase() === n)
  if (match) return match
  // DB name includes comic name (e.g. "Spider-Man (Peter Parker)" includes "Spider-Man")
  match = characters.find(c => c.name.toLowerCase().includes(n))
  if (match) return match
  // Comic name includes DB name
  match = characters.find(c => n.includes(c.name.toLowerCase().split(' (')[0].toLowerCase()))
  return match ?? null
}

export function ComicCharacters({ characterNames, allCharacters }: ComicCharactersProps) {
  if (!characterNames || characterNames.length === 0) return null

  const matched = characterNames
    .map(name => ({ name, character: matchCharacter(name, allCharacters) }))
    .filter(item => item.character !== null) as { name: string; character: Character }[]

  const unmatched = characterNames.filter(
    name => !matchCharacter(name, allCharacters)
  )

  if (matched.length === 0 && unmatched.length === 0) return null

  return (
    <div className="pb-6 border-b border-white/5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
        <h3 className="text-white font-bold text-lg">Personajes Principales</h3>
        <span className="ml-auto text-xs text-red-400 font-semibold">{characterNames.length}</span>
      </div>
      <div className="flex flex-wrap gap-5">
        {matched.map(({ character }) => (
          <Link
            key={character.slug}
            href={`/personajes/${character.slug}`}
            className="group flex flex-col items-center gap-3 w-32"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-red-500/60 transition-all duration-200 shrink-0">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="112px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-gray-400 text-sm text-center leading-tight group-hover:text-white transition-colors line-clamp-2 font-medium">
              {character.name.split(' (')[0]}
            </span>
          </Link>
        ))}
        {unmatched.map(name => (
          <div key={name} className="flex flex-col items-center gap-3 w-32">
            <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-gray-500 text-lg font-bold">{name[0]}</span>
            </div>
            <span className="text-gray-500 text-sm text-center leading-tight line-clamp-2">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}