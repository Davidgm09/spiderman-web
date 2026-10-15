'use client';

import { useState } from 'react';
import { AMAZON_TAG } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface AmazonProductProps {
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  inStock?: boolean;
  asin?: string; // si se pasa, enlaza a la ficha del producto en vez de a una búsqueda
  searchQuery?: string; // Para búsqueda dinámica
  className?: string;
}

export function AmazonProduct({
  title,
  description,
  imageUrl,
  category,
  tags,
  inStock = true,
  asin,
  searchQuery,
  className = ''
}: AmazonProductProps) {
  const [isClicked, setIsClicked] = useState(false);
  const amazonTag = AMAZON_TAG;

  // Generate Amazon affiliate link
  const generateAmazonLink = () => {
    if (asin) return `https://www.amazon.es/dp/${asin}?tag=${amazonTag}`;
    const query = searchQuery || title;
    const encodedQuery = encodeURIComponent(query);
    return `https://www.amazon.es/s?k=${encodedQuery}&tag=${amazonTag}`;
  };

  // Track affiliate click
  const handleAffiliateClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  const affiliateLink = generateAmazonLink();

  return (
    <Card className={`bg-gray-900/50 border-orange-600/20 hover:border-orange-600/50 transition-all duration-300 ${className}`}>
      <CardHeader className="p-0">
        <div className="relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={300}
              height={300}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-t-lg flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-orange-400 opacity-50" />
            </div>
          )}
          
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive">Agotado</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-white mb-2 text-sm leading-tight">
          {title}
        </CardTitle>
        
        {description && (
          <CardDescription className="text-gray-400 text-xs mb-3 line-clamp-2">
            {description}
          </CardDescription>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white transition-all duration-300 ${
            isClicked ? 'scale-95' : 'hover:scale-105'
          }`}
          onClick={handleAffiliateClick}
          disabled={!inStock}
          asChild
        >
          <a 
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? 'Ver precio en Amazon' : 'No disponible'}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>

        {/* Category */}
        <div className="text-center mt-2">
          <Badge className="bg-gray-700 text-gray-300 text-xs">
            {category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick product components for specific categories
export function SpiderManComic({ title, issue, year }: { title: string; issue?: string; year?: string }) {
  return (
    <AmazonProduct
      title={`${title}${issue ? ` #${issue}` : ''}${year ? ` (${year})` : ''}`}
      searchQuery={`${title} comic spider-man marvel${issue ? ` ${issue}` : ''}`}
      category="Cómic"
      tags={['Spider-Man', 'Marvel', 'Cómic']}
      className="max-w-sm"
    />
  );
}

export function SpiderManMovie({ title, year, format = 'Blu-ray' }: { title: string; year: string; format?: string }) {
  return (
    <AmazonProduct
      title={`${title} (${year}) - ${format}`}
      searchQuery={`${title} ${year} ${format} spider-man`}
      category="Película"
      tags={['Spider-Man', 'Marvel', 'Película', format]}
      className="max-w-sm"
    />
  );
}

export function SpiderManGame({ title, platform, year }: { title: string; platform: string; year?: string }) {
  return (
    <AmazonProduct
      title={`${title}${year ? ` (${year})` : ''} - ${platform}`}
      searchQuery={`${title} ${platform} spider-man game`}
      category="Videojuego"
      tags={['Spider-Man', 'Videojuego', platform]}
      className="max-w-sm"
    />
  );
}

export function SpiderManMerchandise({ title, type }: { title: string; type: string }) {
  return (
    <AmazonProduct
      title={title}
      searchQuery={`${title} spider-man marvel ${type}`}
      category={type}
      tags={['Spider-Man', 'Marvel', type]}
      className="max-w-sm"
    />
  );
}