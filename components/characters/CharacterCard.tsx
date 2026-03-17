'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, BookOpen, Monitor, Eye } from 'lucide-react';

// Tipo para personaje de la base de datos
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
}

interface CharacterCardProps {
  character: DatabaseCharacter;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export function CharacterCard({ 
  character, 
  size = 'small', 
  showDetails = false 
}: CharacterCardProps) {
  
  const sizeClasses = {
    small: 'h-44',
    medium: 'h-52',
    large: 'h-60'
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spider-verse':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'spider-villains':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      case 'marvel-universe':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'spider-verse':
        return 'Spider-Verse';
      case 'spider-villains':
        return 'Villano';
      case 'marvel-universe':
        return 'Marvel';
      default:
        return category.replace('-', ' ').toUpperCase();
    }
  };

  return (
    <Link href={`/personajes/${character.slug}`}>
      <div className="group cursor-pointer">
        <Card className="bg-gray-900/40 border-gray-700/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative">
              <Image
                src={character.image}
                alt={`${character.name} - Personaje Marvel`}
                width={200}
                height={300}
                className={`w-full ${sizeClasses[size]} object-cover object-top group-hover:scale-110 transition-transform duration-300`}
                priority={false}
                quality={85}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/marvel-placeholder.svg';
                }}
              />
              
              {/* Category badge */}
              <div className="absolute top-1 left-1">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(character.category)}`}>
                  {getCategoryLabel(character.category)}
                </Badge>
              </div>

              {/* Rating badge */}
              <div className="absolute top-1 right-1">
                <Badge variant="outline" className="bg-black/70 border-yellow-500 text-yellow-400 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {character.rating.toFixed(1)}
                </Badge>
              </div>
              
              {/* Hover overlay with stats */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white text-xs space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{character.comicsCount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Monitor className="w-3 h-3" />
                    <span>{character.seriesCount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{character.views}</span>
                  </div>
                </div>
              </div>

              {/* Featured indicator */}
              {character.isFeatured && (
                <div className="absolute bottom-1 left-1">
                  <Badge className="bg-yellow-600 text-black text-xs">
                    ⭐ Destacado
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-2">
            <CardTitle className="text-white text-sm font-medium text-center truncate">
              {character.name}
            </CardTitle>
            {character.realName && character.realName !== character.name && (
              <p className="text-gray-400 text-xs text-center truncate mt-1">
                {character.realName}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

// Component for displaying multiple characters in a grid
interface CharacterGridProps {
  characters: DatabaseCharacter[];
  title?: string;
  maxItems?: number;
}

export function CharacterGrid({ 
  characters, 
  title = "Personajes", 
  maxItems = 20 
}: CharacterGridProps) {
  const displayCharacters = characters.slice(0, maxItems);

  if (displayCharacters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No se encontraron personajes en esta categoría.</p>
      </div>
    );
  }

  return (
    <section className="py-4">
      {title && (
        <h2 className="text-2xl font-medium mb-6 text-center text-white">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayCharacters.map((character) => (
          <CharacterCard 
            key={character.id}
            character={character} 
            size="small"
            showDetails={false}
          />
        ))}
      </div>

      {characters.length > maxItems && (
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Mostrando {displayCharacters.length} de {characters.length} personajes
          </p>
        </div>
      )}
    </section>
  );
}

// Export type for use in other components
export type { DatabaseCharacter };