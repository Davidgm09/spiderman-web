import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CacheManager, ErrorLogger } from '@/lib/database';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Spider-Man movie keywords and search terms
const SPIDER_MAN_KEYWORDS = [
  'spider-man',
  'spider man',
  'spiderman',
  'spider-verse',
  'into the spider-verse',
  'across the spider-verse',
  'beyond the spider-verse',
  'no way home',
  'far from home',
  'homecoming',
  'amazing spider-man',
  'venom',
  'morbius'
];

// Enhanced movie data structure
interface MovieData {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
  
  // Additional data we'll add
  trailer_url?: string;
  imdb_id?: string;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: Array<{ id: number; name: string; logo_path: string }>;
  revenue?: number;
  budget?: number;
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

// Fetch Spider-Man movies
async function fetchSpiderManMovies(page: number = 1) {
  const cacheKey = `movies-spiderman-page-${page}`;
  
  // Try cache first (6 hours for movies)
  const cached = await CacheManager.getExternalCache('tmdb', 'movies', cacheKey);
  if (cached) {
    console.log('🎬 Using cached Spider-Man movies data');
    return cached;
  }

  try {
    console.log('🌐 Fetching Spider-Man movies from TMDB');

    // Search for Spider-Man movies
    const searchResults = await Promise.all(
      SPIDER_MAN_KEYWORDS.slice(0, 3).map(keyword => // Limit to avoid rate limits
        axios.get(`${TMDB_BASE_URL}/search/movie`, {
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
    const allMovies = new Map<number, MovieData>();
    
    searchResults.forEach(response => {
      response.data.results.forEach((movie: any) => {
        // Filter for actual Spider-Man movies
        const title = movie.title.toLowerCase();
        const overview = movie.overview?.toLowerCase() || '';
        
        if (
          title.includes('spider') || 
          title.includes('venom') || 
          title.includes('morbius') ||
          overview.includes('spider') ||
          overview.includes('peter parker')
        ) {
          allMovies.set(movie.id, movie);
        }
      });
    });

    const movies = Array.from(allMovies.values())
      .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      .slice(0, 20); // Top 20 most recent

    // Enhance with additional data for popular movies
    const enhancedMovies = await Promise.all(
      movies.slice(0, 10).map(async (movie) => { // Enhance top 10
        try {
          const detailsResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${movie.id}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                language: 'es-ES',
                append_to_response: 'videos,external_ids'
              }
            }
          );

          const details = detailsResponse.data;
          
          // Find trailer
          const trailer = details.videos?.results?.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );

          return {
            ...movie,
            runtime: details.runtime,
            genres: details.genres,
            production_companies: details.production_companies,
            revenue: details.revenue,
            budget: details.budget,
            tagline: details.tagline,
            homepage: details.homepage,
            imdb_id: details.external_ids?.imdb_id,
            trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            
            // Generate affiliate links (you'll need to implement this based on your Amazon setup)
            amazon_link: generateAmazonLink(movie.title, movie.release_date),
            digital_purchase_links: generateDigitalLinks(movie.title, details.external_ids?.imdb_id)
          };
        } catch (error) {
          console.warn(`Failed to enhance movie ${movie.id}:`, error);
          return movie;
        }
      })
    );

    // Cache for 6 hours
    await CacheManager.cacheExternalData('tmdb', 'movies', cacheKey, enhancedMovies, 6);

    console.log(`✅ Fetched and cached ${enhancedMovies.length} Spider-Man movies`);
    return enhancedMovies;

  } catch (error) {
    console.error('💥 Error fetching Spider-Man movies:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      '/search/movie',
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return [];
  }
}

// Get specific movie details
async function fetchMovieDetails(movieId: string) {
  const cacheKey = `movie-details-${movieId}`;
  
  // Try cache first
  const cached = await CacheManager.getExternalCache('tmdb', 'movie', movieId);
  if (cached) {
    console.log(`🎬 Using cached movie details for ${movieId}`);
    return cached;
  }

  try {
    console.log(`🌐 Fetching movie details for ${movieId} from TMDB`);

    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES',
          append_to_response: 'videos,external_ids,credits,similar,reviews'
        }
      }
    );

    const movie = response.data;

    // Find trailer
    const trailer = movie.videos?.results?.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    const enhancedMovie = {
      ...movie,
      trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      amazon_link: generateAmazonLink(movie.title, movie.release_date),
      digital_purchase_links: generateDigitalLinks(movie.title, movie.external_ids?.imdb_id)
    };

    // Cache for 24 hours (movie details are stable)
    await CacheManager.cacheExternalData('tmdb', 'movie', movieId, enhancedMovie, 24);

    console.log(`✅ Fetched and cached movie details for ${movieId}`);
    return enhancedMovie;

  } catch (error) {
    console.error(`💥 Error fetching movie ${movieId}:`, error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      `/movie/${movieId}`,
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return null;
  }
}

// Generate Amazon affiliate links
function generateAmazonLink(title: string, releaseDate: string): string {
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const searchQuery = encodeURIComponent(`${title} ${new Date(releaseDate).getFullYear()}`);
  
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${amazonTag}`;
}

// Generate digital purchase links
function generateDigitalLinks(title: string, imdbId?: string): Array<{platform: string; url: string}> {
  const encodedTitle = encodeURIComponent(title);
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  
  const links = [
    {
      platform: 'Amazon Prime',
      url: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video&tag=${amazonTag}`
    },
    {
      platform: 'Apple TV',
      url: `https://tv.apple.com/search?term=${encodedTitle}`
    },
    {
      platform: 'Google Play',
      url: `https://play.google.com/store/search?q=${encodedTitle}&c=movies`
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
    const movieId = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');

    // Validate API key
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    if (movieId) {
      // Fetch specific movie
      const movie = await fetchMovieDetails(movieId);
      
      if (!movie) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        result: movie,
        cached: true
      });
    } else {
      // Fetch movies list
      const movies = (await fetchSpiderManMovies(page)) as unknown[];

      return NextResponse.json({
        results: movies,
        count: movies.length,
        page,
        cached: true
      });
    }

  } catch (error) {
    console.error('Movies API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'tmdb',
      '/api/external/movies',
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