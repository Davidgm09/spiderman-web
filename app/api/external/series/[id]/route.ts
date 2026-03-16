import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CacheManager, ErrorLogger } from '@/lib/database';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Enhanced series data with full details
interface SeriesDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string }>;
  created_by: Array<{ id: number; name: string; profile_path: string }>;
  networks: Array<{ id: number; name: string; logo_path: string }>;
  status: string;
  type: string;
  tagline: string;
  homepage: string;
  original_language: string;
  origin_country: string[];
  adult: boolean;
  
  // Enhanced data
  trailer_url?: string;
  imdb_id?: string;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string;
    }>;
  };
  seasons?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    episode_count: number;
    air_date: string;
  }>;
  
  // Affiliate opportunities
  amazon_link?: string;
  digital_purchase_links?: Array<{
    platform: string;
    url: string;
    price?: string;
  }>;
}

// Get complete series details
async function fetchCompleteSeriesDetails(seriesId: string): Promise<SeriesDetails | null> {
  const cacheKey = `complete-series-${seriesId}`;
  
  // Try cache first (24 hours)
  const cached = await CacheManager.getExternalCache('tmdb', 'tv-complete', seriesId);
  if (cached) {
    console.log(`📺 Using cached complete series details for ${seriesId}`);
    return cached;
  }

  try {
    console.log(`🌐 Fetching complete series details for ${seriesId} from TMDB`);

    // Parallel requests for comprehensive data
    const [detailsResponse, creditsResponse, seasonsData] = await Promise.all([
      // Main series details with videos and external IDs
      axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES',
          append_to_response: 'videos,external_ids,similar,reviews'
        }
      }),
      // Credits (cast and crew)
      axios.get(`${TMDB_BASE_URL}/tv/${seriesId}/credits`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES'
        }
      }),
      // Seasons data
      axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES'
        }
      }).then(response => response.data.seasons || [])
    ]);

    const series = detailsResponse.data;
    const credits = creditsResponse.data;

    // Find trailer
    const trailer = series.videos?.results?.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    // Find best quality images
    const posterPath = series.poster_path;
    const backdropPath = series.backdrop_path;

    const completeSeriesData: SeriesDetails = {
      ...series,
      
      // Enhanced media
      trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined,
      imdb_id: series.external_ids?.imdb_id,
      
      // Cast and crew
      credits: {
        cast: credits.cast?.slice(0, 20) || [], // Top 20 cast members
        crew: credits.crew?.filter((person: any) => 
          ['Director', 'Creator', 'Executive Producer', 'Writer'].includes(person.job)
        ).slice(0, 10) || [] // Key crew members
      },
      
      // Seasons information
      seasons: seasonsData,
      
      // Affiliate links
      amazon_link: generateAmazonSeriesLink(series.name, series.first_air_date),
      digital_purchase_links: generateDigitalSeriesLinks(series.name, series.external_ids?.imdb_id)
    };

    // Cache for 24 hours
    await CacheManager.cacheExternalData('tmdb', 'tv-complete', seriesId, completeSeriesData, 24);

    console.log(`✅ Fetched and cached complete series details for ${seriesId}`);
    return completeSeriesData;

  } catch (error) {
    console.error(`💥 Error fetching complete series details ${seriesId}:`, error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/tv/${seriesId}/complete`,
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return null;
  }
}

// Generate Amazon affiliate links for series
function generateAmazonSeriesLink(name: string, firstAirDate: string): string {
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const year = firstAirDate ? new Date(firstAirDate).getFullYear() : '';
  const searchQuery = encodeURIComponent(`${name} ${year} serie completa`);
  
  return `https://www.amazon.com/s?k=${searchQuery}&i=instant-video&tag=${amazonTag}`;
}

// Generate digital purchase links for series with pricing estimates
function generateDigitalSeriesLinks(name: string, imdbId?: string): Array<{platform: string; url: string; price?: string}> {
  const encodedName = encodeURIComponent(name);
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  
  const links = [
    {
      platform: 'Amazon Prime Video',
      url: `https://www.amazon.com/s?k=${encodedName}&i=instant-video&tag=${amazonTag}`,
      price: 'Desde $19.99'
    },
    {
      platform: 'Apple TV',
      url: `https://tv.apple.com/search?term=${encodedName}`,
      price: 'Desde $14.99'
    },
    {
      platform: 'Google Play',
      url: `https://play.google.com/store/search?q=${encodedName}&c=movies`,
      price: 'Desde $12.99'
    },
    {
      platform: 'Netflix',
      url: `https://www.netflix.com/search?q=${encodedName}`,
      price: 'Incluido con suscripción'
    },
    {
      platform: 'Disney+',
      url: `https://www.disneyplus.com/search?q=${encodedName}`,
      price: 'Incluido con suscripción'
    }
  ];

  if (imdbId) {
    links.push({
      platform: 'IMDb',
      url: `https://www.imdb.com/title/${imdbId}/`,
      price: 'Información'
    });
  }

  return links;
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

    // Fetch complete series details
    const series = await fetchCompleteSeriesDetails(seriesId);
    
    if (!series) {
      return NextResponse.json(
        { error: 'Series not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: series,
      cached: true,
      tmdb_id: series.id,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Series Details API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/api/external/series/${seriesId}`,
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