import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CacheManager, ErrorLogger } from '@/lib/database';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';

interface SeriesImages {
  backdrops: Array<{
    aspect_ratio: number;
    height: number;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
    full_url: string;
  }>;
  stills: Array<{
    aspect_ratio: number;
    height: number;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
    full_url: string;
    season_number?: number;
    episode_number?: number;
  }>;
  gallery: Array<{
    url: string;
    title: string;
    description: string;
    type: 'backdrop' | 'still';
    season?: number;
    episode?: number;
  }>;
}

// Fetch series images from TMDB
async function fetchSeriesImages(seriesId: string): Promise<SeriesImages | null> {
  const cacheKey = `series-images-${seriesId}`;
  
  // Try cache first (12 hours)
  const cached = await CacheManager.getExternalCache('tmdb', 'tv-images', seriesId);
  if (cached) {
    console.log(`📺 Using cached series images for ${seriesId}`);
    return cached;
  }

  try {
    console.log(`🖼️ Fetching series images for ${seriesId} from TMDB`);

    // Get series details first for context
    const [seriesResponse, imagesResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES'
        }
      }),
      // Get all images for the series
      axios.get(`${TMDB_BASE_URL}/tv/${seriesId}/images`, {
        params: {
          api_key: TMDB_API_KEY,
          include_image_language: 'es,en,null'
        }
      })
    ]);

    const series = seriesResponse.data;
    const images = imagesResponse.data;

    // Process backdrops with full URLs
    const backdrops = (images.backdrops || [])
      .filter((img: any) => img.file_path)
      .sort((a: any, b: any) => b.vote_average - a.vote_average)
      .slice(0, 12) // Top 12 backdrops
      .map((img: any) => ({
        ...img,
        full_url: `${TMDB_IMAGE_BASE}${img.file_path}`
      }));

    // Try to get episode stills from different seasons
    let stills: any[] = [];
    if (series.number_of_seasons && series.number_of_seasons > 0) {
      // Get stills from first 3 seasons
      const seasonPromises = [];
      for (let season = 1; season <= Math.min(3, series.number_of_seasons); season++) {
        seasonPromises.push(
          axios.get(`${TMDB_BASE_URL}/tv/${seriesId}/season/${season}/images`, {
            params: {
              api_key: TMDB_API_KEY,
              include_image_language: 'es,en,null'
            }
          }).catch(() => ({ data: { stills: [] } })) // Handle season not found
        );
      }

      const seasonResults = await Promise.all(seasonPromises);
      stills = seasonResults.flatMap((result, index) => 
        (result.data.stills || []).map((still: any) => ({
          ...still,
          full_url: `${TMDB_IMAGE_BASE}${still.file_path}`,
          season_number: index + 1
        }))
      );

      // Sort by vote average and take best ones
      stills = stills
        .filter((img: any) => img.file_path)
        .sort((a: any, b: any) => b.vote_average - a.vote_average)
        .slice(0, 8); // Top 8 stills
    }

    // Create gallery mixing backdrops and stills
    const gallery = [];
    
    // Add best backdrops as scene images
    backdrops.slice(0, 4).forEach((backdrop, index) => {
      gallery.push({
        url: backdrop.full_url,
        title: `Escena icónica de ${series.name}`,
        description: `Una de las escenas más memorables de la serie`,
        type: 'backdrop' as const
      });
    });

    // Add stills as episode scenes
    stills.slice(0, 4).forEach((still, index) => {
      gallery.push({
        url: still.full_url,
        title: still.season_number ? 
          `Temporada ${still.season_number} - Momento épico` : 
          `Momento épico de ${series.name}`,
        description: still.season_number ? 
          `Escena destacada de la temporada ${still.season_number}` :
          `Acción y emoción en su máxima expresión`,
        type: 'still' as const,
        season: still.season_number,
        episode: still.episode_number
      });
    });

    // If we don't have enough images, fill with remaining backdrops
    while (gallery.length < 8 && backdrops.length > gallery.length) {
      const backdrop = backdrops[gallery.length];
      gallery.push({
        url: backdrop.full_url,
        title: `${series.name} - Escena ${gallery.length + 1}`,
        description: `Momentos visuales impactantes de la serie`,
        type: 'backdrop' as const
      });
    }

    const seriesImages: SeriesImages = {
      backdrops,
      stills,
      gallery: gallery.slice(0, 8) // Ensure we have max 8 images
    };

    // Cache for 12 hours
    await CacheManager.cacheExternalData('tmdb', 'tv-images', seriesId, seriesImages, 12);

    console.log(`✅ Fetched ${backdrops.length} backdrops and ${stills.length} stills for series ${seriesId}`);
    return seriesImages;

  } catch (error) {
    console.error(`💥 Error fetching series images ${seriesId}:`, error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/tv/${seriesId}/images`,
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: seriesId } = await params;

    // Validate API key
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    // Validate series ID
    if (!seriesId || isNaN(Number(seriesId))) {
      return NextResponse.json(
        { error: 'Valid series ID is required' },
        { status: 400 }
      );
    }

    // Fetch series images
    const images = await fetchSeriesImages(seriesId);
    
    if (!images) {
      return NextResponse.json(
        { error: 'Images not found for this series' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: images,
      cached: true,
      tmdb_id: Number(seriesId),
      image_count: {
        backdrops: images.backdrops.length,
        stills: images.stills.length,
        gallery: images.gallery.length
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Series Images API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/api/external/series/${seriesId}/images`,
      'route_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}