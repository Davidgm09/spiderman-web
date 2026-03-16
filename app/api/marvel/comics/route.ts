import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { CacheManager, ErrorLogger } from '@/lib/database';

const MARVEL_PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY || '';
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || '';
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

// Generate Marvel API authentication hash
function generateAuthHash(): { ts: string; hash: string } {
  const ts = Date.now().toString();
  const hash = crypto
    .createHash('md5')
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest('hex');
  
  return { ts, hash };
}

// Build Marvel API URL with authentication
function buildMarvelUrl(endpoint: string, params: Record<string, string> = {}): string {
  const { ts, hash } = generateAuthHash();
  
  const searchParams = new URLSearchParams({
    apikey: MARVEL_PUBLIC_KEY,
    ts,
    hash,
    ...params
  });

  return `${MARVEL_BASE_URL}${endpoint}?${searchParams.toString()}`;
}

// Fetch Marvel comics with intelligent caching
async function fetchSpiderManComics(
  limit: string = '20',
  offset: string = '0',
  orderBy: string = '-onsaleDate'
) {
  const cacheKey = `comics-spiderman-${limit}-${offset}-${orderBy}`;
  
  // Try cache first
  const cached = await CacheManager.getMarvelCache(cacheKey);
  if (cached) {
    console.log('📚 Using cached Spider-Man comics data');
    return cached;
  }

  try {
    console.log('🌐 Fetching Spider-Man comics from Marvel API');
    const url = buildMarvelUrl('/comics', {
      characters: '1009610', // Spider-Man character ID
      orderBy,
      limit,
      offset,
      format: 'comic',
      formatType: 'comic',
      noVariants: 'true' // Exclude variant covers for cleaner results
    });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Spider-World Web App',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      await ErrorLogger.logApiError(
        'marvel',
        '/comics',
        response.status.toString(),
        `HTTP ${response.status}: ${response.statusText}`
      );
      throw new Error(`Marvel API error: ${response.status}`);
    }

    const data = await response.json();
    const comics = data.data.results;

    // Filter for quality and relevant comics
    const filteredComics = comics.filter((comic: any) => {
      // Exclude comics without proper images
      if (comic.thumbnail?.path?.includes('image_not_available')) {
        return false;
      }
      
      // Include only comics with descriptions or recent issues
      return comic.description || new Date(comic.dates?.[0]?.date) > new Date('2000-01-01');
    });

    // Cache the results for 6 hours (comics don't change often)
    await CacheManager.cacheMarvelData(cacheKey, 'comic', filteredComics, 6);

    console.log(`✅ Fetched and cached ${filteredComics.length} Spider-Man comics`);
    return filteredComics;

  } catch (error) {
    console.error('💥 Error fetching Spider-Man comics:', error);
    
    await ErrorLogger.logApiError(
      'marvel',
      '/comics',
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    // Return fallback empty array
    return [];
  }
}

// Fetch specific comic by ID
async function fetchComicById(comicId: string) {
  const cacheKey = `comic-${comicId}`;
  
  // Try cache first
  const cached = await CacheManager.getMarvelCache(cacheKey);
  if (cached) {
    console.log(`📚 Using cached comic data for ID ${comicId}`);
    return cached;
  }

  try {
    console.log(`🌐 Fetching comic ${comicId} from Marvel API`);
    const url = buildMarvelUrl(`/comics/${comicId}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Spider-World Web App',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      await ErrorLogger.logApiError(
        'marvel',
        `/comics/${comicId}`,
        response.status.toString(),
        `HTTP ${response.status}: ${response.statusText}`
      );
      throw new Error(`Marvel API error: ${response.status}`);
    }

    const data = await response.json();
    const comic = data.data.results[0];

    if (comic) {
      // Cache for 24 hours (individual comics are stable)
      await CacheManager.cacheMarvelData(cacheKey, 'comic', comic, 24);
      console.log(`✅ Fetched and cached comic ${comicId}`);
    }

    return comic || null;

  } catch (error) {
    console.error(`💥 Error fetching comic ${comicId}:`, error);
    
    await ErrorLogger.logApiError(
      'marvel',
      `/comics/${comicId}`,
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const comicId = searchParams.get('id');
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const orderBy = searchParams.get('orderBy') || '-onsaleDate';

    // Validate API keys
    if (!MARVEL_PUBLIC_KEY || !MARVEL_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Marvel API keys not configured' },
        { status: 500 }
      );
    }

    let result;

    if (comicId) {
      // Fetch specific comic
      result = await fetchComicById(comicId);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Comic not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        result,
        cached: true // We always try cache first
      });
    } else {
      // Fetch comics list
      result = await fetchSpiderManComics(limit, offset, orderBy);
      
      return NextResponse.json({
        results: result,
        count: result.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        cached: true
      });
    }

  } catch (error) {
    console.error('Comics API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'marvel',
      '/api/marvel/comics',
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

// Helper endpoint for getting series
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesId } = body;

    if (!seriesId) {
      return NextResponse.json(
        { error: 'Series ID required' },
        { status: 400 }
      );
    }

    const cacheKey = `series-${seriesId}`;
    
    // Try cache first
    let cached = await CacheManager.getMarvelCache(cacheKey);
    if (cached) {
      return NextResponse.json({ result: cached, cached: true });
    }

    // Fetch from API
    const url = buildMarvelUrl(`/series/${seriesId}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status}`);
    }

    const data = await response.json();
    const series = data.data.results[0];

    if (series) {
      await CacheManager.cacheMarvelData(cacheKey, 'series', series, 24);
    }

    return NextResponse.json({
      result: series,
      cached: false
    });

  } catch (error) {
    console.error('Series API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}