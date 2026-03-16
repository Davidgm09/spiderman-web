'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Tv, User, Globe, Info, MoreHorizontal } from 'lucide-react';
import { MarvelCharacter, getHighQualityImageUrl } from '@/lib/marvel-api';

interface MarvelCharacterCardProps {
  character: MarvelCharacter;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export function MarvelCharacterCard({ 
  character, 
  size = 'small', 
  showDetails = false 
}: MarvelCharacterCardProps) {
  // Use the highest quality image available
  const imageUrl = getHighQualityImageUrl(character.thumbnail, 'portrait_fantastic');
  
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-40',
    large: 'h-48'
  };

  const handleCharacterDetails = () => {
    // Create a simple modal or navigate to character detail page
    alert(`Información de ${character.name}:\n\n${character.description || 'No hay descripción disponible.'}\n\nCómics: ${character.comics.available}\nSeries: ${character.series.available}`);
  };

  const handleWikiLink = () => {
    // Search for the character on Wikipedia
    const searchQuery = encodeURIComponent(character.name + ' Marvel Comics');
    window.open(`https://es.wikipedia.org/wiki/Special:Search?search=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };

  const handleComicsLink = () => {
    // Search for character comics on Marvel's official site
    const searchQuery = encodeURIComponent(character.name);
    window.open(`https://www.marvel.com/search?query=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group cursor-pointer" onClick={handleCharacterDetails}>
      {/* Ultra compact card */}
      <Card className="bg-gray-900/40 border-gray-700/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative">
            <Image
              src={imageUrl}
              alt={character.name}
              width={200}
              height={300}
              className={`w-full ${sizeClasses[size]} object-cover group-hover:scale-110 transition-transform duration-300`}
              priority={false}
              quality={85}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallbackUrl = getHighQualityImageUrl(character.thumbnail, 'portrait_xlarge');
                if (target.src !== fallbackUrl) {
                  target.src = fallbackUrl;
                } else {
                  target.src = '/images/marvel-placeholder.svg';
                }
              }}
            />
            
            {/* Minimal overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Info className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Compact stats badge */}
            <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {character.comics.available}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-2">
          <CardTitle className="text-white text-sm font-medium text-center truncate">
            {character.name}
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for displaying multiple characters in a grid
interface MarvelCharacterGridProps {
  characters: MarvelCharacter[];
  title?: string;
  maxItems?: number;
}

export function MarvelCharacterGrid({ 
  characters, 
  title = "Personajes Marvel", 
  maxItems = 20 
}: MarvelCharacterGridProps) {
  const displayCharacters = characters.slice(0, maxItems);

  if (displayCharacters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No se encontraron personajes</p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <h2 className="text-2xl font-medium mb-4 text-center text-white">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        {displayCharacters.map((character, index) => (
          <MarvelCharacterCard 
            key={`${character.id}-${index}`}
            character={character} 
            size="small"
            showDetails={false}
          />
        ))}
      </div>
    </section>
  );
} 