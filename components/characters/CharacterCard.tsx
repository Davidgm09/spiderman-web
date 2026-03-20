'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, Zap } from 'lucide-react';

interface DatabaseCharacter {
  id: string;
  marvelId: number;
  name: string;
  realName?: string | null;
  description: string;
  longDescription?: string | null;
  image: string;
  category: string;
  rating: number;
  comicsCount: number;
  seriesCount: number;
  slug: string;
  affiliation: string[];
  powers: string[];
  abilities: string[];
  universe: string;
  isFeatured: boolean;
  views: number;
  firstAppearance?: string | null;
}

const CATEGORY_STYLES: Record<string, { label: string; color: string; border: string; dot: string }> = {
  'spider-verse':   { label: 'Spider-Verse', color: 'text-red-400',    border: 'border-red-500/50',    dot: 'bg-red-400' },
  'spider-villains':{ label: 'Villano',      color: 'text-orange-400', border: 'border-orange-500/50', dot: 'bg-orange-400' },
  'marvel-universe':{ label: 'Marvel',       color: 'text-blue-400',   border: 'border-blue-500/50',   dot: 'bg-blue-400' },
}

export function CharacterCard({ character }: { character: DatabaseCharacter }) {
  const style = CATEGORY_STYLES[character.category] ?? { label: character.category, color: 'text-gray-400', border: 'border-gray-500/50', dot: 'bg-gray-400' }

  return (
    <Link href={`/personajes/${character.slug}`} className="group">
      <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/50 border border-white/5 hover:border-white/20 transition-colors duration-300">

        {/* Imagen con aspect ratio fijo */}
        <div className="relative aspect-[3/4]">
          <Image
            src={character.image}
            alt={`${character.name} - Personaje Marvel`}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            quality={85}
          />

          {/* Gradiente inferior para el info panel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 z-10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">{character.rating.toFixed(1)}</span>
          </div>

          {/* Info panel — sobre la imagen en la parte baja */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10 group-hover:opacity-0 transition-opacity duration-300">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
              <span className={`text-xs font-medium ${style.color}`}>{style.label}</span>
            </div>
            <h3 className="text-white text-sm font-bold leading-tight line-clamp-1">
              {character.name}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 min-h-[1rem]">
              {character.realName && character.realName !== character.name ? character.realName : ''}
            </p>
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
              {character.powers.length > 0 && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">{character.powers.length}</span>
                </div>
              )}
              {character.comicsCount > 0 && (
                <div className="flex items-center gap-1 text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span className="text-xs">{character.comicsCount}</span>
                </div>
              )}
              {character.firstAppearance && (
                <span className="text-gray-600 text-xs ml-auto">{character.firstAppearance.match(/\d{4}/)?.[0]}</span>
              )}
            </div>
          </div>

          {/* Hover overlay — cubre toda la imagen */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              Ver perfil
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

interface CharacterGridProps {
  characters: DatabaseCharacter[];
  maxItems?: number;
}

export function CharacterGrid({ characters, maxItems = 20 }: CharacterGridProps) {
  const displayed = characters.slice(0, maxItems);

  if (displayed.length === 0) {
    return <p className="text-center text-gray-500 py-10">No se encontraron personajes en esta categoría.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {displayed.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}

export type { DatabaseCharacter };
