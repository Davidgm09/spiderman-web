import { NextRequest, NextResponse } from 'next/server';
import { CacheManager, ErrorLogger } from '@/lib/database';
import { fetchSpiderManGamesFromRawg, fetchGameDetailsFromRawg } from '@/lib/rawg-api';

const RAWG_API_KEY = process.env.RAWG_API_KEY;

// RAWG API doesn't require OAuth authentication, just an API key

// Game data structure is now handled by RAWG API service

// Fetch Spider-Man games using RAWG API
async function fetchSpiderManGames() {
  return await fetchSpiderManGamesFromRawg();
}

// Get specific game details using RAWG API
async function fetchGameDetails(gameId: string) {
  return await fetchGameDetailsFromRawg(gameId);
}

// Link generation functions are now handled by RAWG API service

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('id');

    // Validate API credentials
    if (!RAWG_API_KEY) {
      return NextResponse.json(
        { error: 'RAWG API key not configured' },
        { status: 500 }
      );
    }

    if (gameId) {
      // Fetch specific game
      const game = await fetchGameDetails(gameId);
      
      if (!game) {
        return NextResponse.json(
          { error: 'Game not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        result: game,
        cached: true
      });
    } else {
      // Fetch games list
      const games = (await fetchSpiderManGames()) as unknown[];

      return NextResponse.json({
        results: games,
        count: games.length,
        cached: true
      });
    }

  } catch (error) {
    console.error('Games API Route Error:', error);
    
    await ErrorLogger.logApiError(
      'rawg',
      '/api/external/games',
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