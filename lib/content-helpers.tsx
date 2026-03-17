import { Star } from 'lucide-react';

/**
 * Renders a 5-star rating row (input scale 0–10).
 * Used by peliculas, videojuegos, series, and comics detail pages.
 */
export function renderStars(rating: number) {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
      {hasHalfStar && <Star className="w-4 h-4 text-yellow-400 fill-current opacity-50" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />
      ))}
      <span className="ml-2 text-white font-semibold">{rating}/10</span>
    </div>
  );
}

/**
 * Builds an Amazon affiliate search URL.
 * Pass the full search query (title + relevant keywords).
 */
export function generateAmazonUrl(searchQuery: string): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=${tag}`;
}

/**
 * Converts any YouTube URL variant to an embed URL.
 * Returns the original URL unchanged if it's not a recognizable YouTube URL.
 */
export function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  } catch {
    return url;
  }
}
