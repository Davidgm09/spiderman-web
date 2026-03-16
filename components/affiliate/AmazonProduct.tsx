'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingCart, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import { AnalyticsManager } from '@/lib/database';
import { usePathname } from 'next/navigation';

interface AmazonProductProps {
  title: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  category: string;
  tags: string[];
  prime?: boolean;
  inStock?: boolean;
  searchQuery?: string; // Para búsqueda dinámica
  className?: string;
}

export function AmazonProduct({
  title,
  description,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  imageUrl,
  category,
  tags,
  prime = false,
  inStock = true,
  searchQuery,
  className = ''
}: AmazonProductProps) {
  const pathname = usePathname();
  const [isClicked, setIsClicked] = useState(false);
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';

  // Generate Amazon affiliate link
  const generateAmazonLink = () => {
    const query = searchQuery || title;
    const encodedQuery = encodeURIComponent(query);
    return `https://www.amazon.com/s?k=${encodedQuery}&tag=${amazonTag}&linkCode=ll2&linkId=affiliate-link`;
  };

  // Track affiliate click
  const handleAffiliateClick = async () => {
    setIsClicked(true);
    
    try {
      await AnalyticsManager.trackAffiliateClick(pathname);
      console.log('📊 Affiliate click tracked');
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
    }

    // Reset click state after animation
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
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {discount && (
              <Badge className="bg-red-600 text-white">
                -{discount}%
              </Badge>
            )}
            {prime && (
              <Badge className="bg-blue-600 text-white flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Prime
              </Badge>
            )}
            {rating && (
              <Badge className="bg-orange-600 text-white flex items-center gap-1">
                <Star className="w-3 h-3" />
                {rating.toFixed(1)}
              </Badge>
            )}
          </div>

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

        {/* Price section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {price && (
              <span className="text-orange-400 font-bold text-lg">{price}</span>
            )}
            {originalPrice && originalPrice !== price && (
              <span className="text-gray-500 line-through text-sm">{originalPrice}</span>
            )}
          </div>
          {reviews && (
            <span className="text-gray-400 text-xs">({reviews} reseñas)</span>
          )}
        </div>

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
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? 'Ver en Amazon' : 'No disponible'}
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
      prime={true}
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