import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CacheManager, ErrorLogger } from '@/lib/database';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Spider-Man series keywords and search terms
const SPIDER_MAN_SERIES_KEYWORDS = [
  'spider-man',
  'spectacular spider-man',
  'ultimate spider-man',
  'amazing spider-man',
  'spider-man animated',
  'spidey amazing friends',
  'spider-man new animated series'
];

// Enhanced series data structure
interface SeriesData {
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
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  origin_country: string[];
  
  // Additional data we'll add
  trailer_url?: string;
  imdb_id?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: Array<{ id: number; name: string; logo_path: string }>;
  created_by?: Array<{ id: number; name: string; profile_path: string }>;
  networks?: Array<{ id: number; name: string; logo_path: string }>;
  status?: string;
  type?: string;
  tagline?: string;
  homepage?: string;
  
  // Affiliate opportunities
  amazon_link?: string;
  digital_purchase_links?: Array<{
    platform: string;
    url: string;
    price?: string;
  }>;
}

// Fetch Spider-Man series
async function fetchSpiderManSeries(page: number = 1) {
  const cacheKey = `series-spiderman-page-${page}`;
  
  // Try cache first (6 hours for series)
  const cached = await CacheManager.getExternalCache('tmdb', 'series', cacheKey);
  if (cached) {
    console.log('📺 Using cached Spider-Man series data');
    return cached;
  }

  try {
    console.log('🌐 Fetching Spider-Man series from TMDB');

    // Search for Spider-Man series
    const searchResults = await Promise.all(
      SPIDER_MAN_SERIES_KEYWORDS.slice(0, 3).map(keyword => // Limit to avoid rate limits
        axios.get(`${TMDB_BASE_URL}/search/tv`, {
          params: {
            api_key: TMDB_API_KEY,
            query: keyword,
            page: 1,
            include_adult: false,
            language: 'es-ES' // Spanish for your audience
          }
        })
      )
    );

    // Combine and deduplicate results
    const allSeries = new Map<number, SeriesData>();
    
    searchResults.forEach(response => {
      response.data.results.forEach((series: any) => {
        // Filter for actual Spider-Man series
        const name = series.name.toLowerCase();
        const overview = series.overview?.toLowerCase() || '';
        
        if (
          name.includes('spider') || 
          overview.includes('spider') ||
          overview.includes('peter parker') ||
          name.includes('spidey')
        ) {
          allSeries.set(series.id, series);
        }
      });
    });

    const series = Array.from(allSeries.values())
      .sort((a, b) => new Date(b.first_air_date || '1900-01-01').getTime() - new Date(a.first_air_date || '1900-01-01').getTime())
      .slice(0, 20); // Top 20 most recent

    // Enhance with additional data for popular series
    const enhancedSeries = await Promise.all(
      series.slice(0, 10).map(async (seriesItem) => { // Enhance top 10
        try {
          const detailsResponse = await axios.get(
            `${TMDB_BASE_URL}/tv/${seriesItem.id}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                language: 'es-ES',
                append_to_response: 'videos,external_ids,credits'
              }
            }
          );

          const details = detailsResponse.data;
          
          // Find trailer
          const trailer = details.videos?.results?.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );

          return {
            ...seriesItem,
            number_of_seasons: details.number_of_seasons,
            number_of_episodes: details.number_of_episodes,
            genres: details.genres,
            production_companies: details.production_companies,
            created_by: details.created_by,
            networks: details.networks,
            status: details.status,
            type: details.type,
            tagline: details.tagline,
            homepage: details.homepage,
            imdb_id: details.external_ids?.imdb_id,
            trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            
            // Generate affiliate links
            amazon_link: generateAmazonSeriesLink(seriesItem.name, seriesItem.first_air_date),
            digital_purchase_links: generateDigitalSeriesLinks(seriesItem.name, details.external_ids?.imdb_id)
          };
        } catch (error) {
          console.warn(`Failed to enhance series ${seriesItem.id}:`, error);
          return seriesItem;
        }
      })
    );

    // Cache for 6 hours
    await CacheManager.cacheExternalData('tmdb', 'series', cacheKey, enhancedSeries, 6);

    console.log(`✅ Fetched and cached ${enhancedSeries.length} Spider-Man series`);
    return enhancedSeries;

  } catch (error) {
    console.error('💥 Error fetching Spider-Man series:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      '/search/tv',
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return [];
  }
}

// Get specific series details
async function fetchSeriesDetails(seriesId: string) {
  const cacheKey = `series-details-${seriesId}`;
  
  // Try cache first
  const cached = await CacheManager.getExternalCache('tmdb', 'tv', seriesId);
  if (cached) {
    console.log(`📺 Using cached series details for ${seriesId}`);
    return cached;
  }

  try {
    console.log(`🌐 Fetching series details for ${seriesId} from TMDB`);

    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${seriesId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES',
          append_to_response: 'videos,external_ids,credits,similar,reviews,seasons'
        }
      }
    );

    const series = response.data;

    // Find trailer
    const trailer = series.videos?.results?.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    const enhancedSeries = {
      ...series,
      trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      amazon_link: generateAmazonSeriesLink(series.name, series.first_air_date),
      digital_purchase_links: generateDigitalSeriesLinks(series.name, series.external_ids?.imdb_id)
    };

    // Cache for 24 hours (series details are stable)
    await CacheManager.cacheExternalData('tmdb', 'tv', seriesId, enhancedSeries, 24);

    console.log(`✅ Fetched and cached series details for ${seriesId}`);
    return enhancedSeries;

  } catch (error) {
    console.error(`💥 Error fetching series ${seriesId}:`, error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/tv/${seriesId}`,
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
  const searchQuery = encodeURIComponent(`${name} ${year} serie tv`);
  
  return `https://www.amazon.com/s?k=${searchQuery}&i=instant-video&tag=${amazonTag}`;
}

// Generate digital purchase links for series
function generateDigitalSeriesLinks(name: string, imdbId?: string): Array<{platform: string; url: string}> {
  const encodedName = encodeURIComponent(name + ' serie');
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  
  const links = [
    {
      platform: 'Amazon Prime',
      url: `https://www.amazon.com/s?k=${encodedName}&i=instant-video&tag=${amazonTag}`
    },
    {
      platform: 'Apple TV',
      url: `https://tv.apple.com/search?term=${encodedName}`
    },
    {
      platform: 'Google Play',
      url: `https://play.google.com/store/search?q=${encodedName}&c=movies`
    },
    {
      platform: 'Netflix',
      url: `https://www.netflix.com/search?q=${encodedName}`
    }
  ];

  if (imdbId) {
    links.push({
      platform: 'IMDb',
      url: `https://www.imdb.com/title/${imdbId}/`
    });
  }

  return links;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');

    // Validate API key
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    if (seriesId) {
      // Fetch specific series
      const series = await fetchSeriesDetails(seriesId);
      
      if (!series) {
        return NextResponse.json(
          { error: 'Series not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        result: series,
        cached: true
      });
    } else {
      // Fetch series list
      const series = await fetchSpiderManSeries(page);
      
      return NextResponse.json({
        results: series,
        count: series.length,
        page,
        cached: true
      });
    }

  } catch (error) {
    console.error('Series API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      '/api/external/series',
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