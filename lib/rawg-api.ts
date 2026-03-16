import axios from 'axios';
import { CacheManager, ErrorLogger } from './database';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// Enhanced game data structure for RAWG API
interface RawgGameData {
  id: number;
  name: string;
  slug: string;
  released: string;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number;
  playtime: number;
  description_raw?: string;
  description?: string;
  platforms: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  genres: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stores: Array<{
    id: number;
    store: {
      id: number;
      name: string;
      slug: string;
      domain: string;
    };
  }>;
  developers: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  publishers: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  screenshots?: Array<{
    id: number;
    image: string;
  }>;
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  };
  
  // Enhanced fields for our application
  amazon_links?: Array<{
    platform: string;
    url: string;
    price?: string;
  }>;
  digital_stores?: Array<{
    platform: string;
    url: string;
  }>;
}

// Fetch Spider-Man games from RAWG API
export async function fetchSpiderManGamesFromRawg() {
  const cacheKey = 'rawg-games-spiderman-all';
  
  // Try cache first (12 hours for games)
  const cached = await CacheManager.getExternalCache('rawg', 'games', cacheKey);
  if (cached) {
    console.log('🎮 Using cached Spider-Man games data from RAWG');
    return cached;
  }

  try {
    console.log('🌐 Fetching Spider-Man games from RAWG API');
    
    if (!RAWG_API_KEY) {
      throw new Error('RAWG API key not configured');
    }

    // Search for Spider-Man games with multiple queries
    const searchQueries = [
      'spider-man',
      'spiderman',
      'marvel spider',
      'venom',
      'miles morales'
    ];

    const allGames = new Map<number, RawgGameData>();

    for (const query of searchQueries) {
      const response = await axios.get(`${RAWG_BASE_URL}/games`, {
        params: {
          key: RAWG_API_KEY,
          search: query,
          ordering: '-rating',
          page_size: 40,
          metacritic: '60,100' // Only high-quality games
        }
      });

      const games = response.data.results || [];
      
      // Filter and merge Spider-Man related games
      games.forEach((game: any) => {
        if (isSpiderManGame(game)) {
          allGames.set(game.id, game);
        }
      });
    }

    // Convert to array and enhance with additional data
    const spiderManGames = Array.from(allGames.values()).map(game => ({
      ...game,
      // Generate affiliate links
      amazon_links: generateGameAmazonLinks(game.name, game.platforms),
      digital_stores: generateGameStoreLinks(game.name, game.platforms)
    }));

    // Sort by release date (newest first)
    spiderManGames.sort((a, b) => {
      const dateA = new Date(a.released || '1900-01-01').getTime();
      const dateB = new Date(b.released || '1900-01-01').getTime();
      return dateB - dateA;
    });

    // Cache for 12 hours
    await CacheManager.cacheExternalData('rawg', 'games', cacheKey, spiderManGames, 12);

    console.log(`✅ Fetched and cached ${spiderManGames.length} Spider-Man games from RAWG`);
    return spiderManGames;

  } catch (error) {
    console.error('💥 Error fetching Spider-Man games from RAWG:', error);
    
    await ErrorLogger.logApiError(
      'rawg',
      '/games',
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return [];
  }
}

// Get specific game details from RAWG
export async function fetchGameDetailsFromRawg(gameId: string) {
  const cacheKey = `rawg-game-details-${gameId}`;
  
  // Try cache first
  const cached = await CacheManager.getExternalCache('rawg', 'game', gameId);
  if (cached) {
    console.log(`🎮 Using cached game details for ${gameId} from RAWG`);
    return cached;
  }

  try {
    console.log(`🌐 Fetching game details for ${gameId} from RAWG`);
    
    if (!RAWG_API_KEY) {
      throw new Error('RAWG API key not configured');
    }

    // Fetch game details
    const gameResponse = await axios.get(`${RAWG_BASE_URL}/games/${gameId}`, {
      params: {
        key: RAWG_API_KEY
      }
    });

    // Fetch game screenshots
    const screenshotsResponse = await axios.get(`${RAWG_BASE_URL}/games/${gameId}/screenshots`, {
      params: {
        key: RAWG_API_KEY
      }
    });

    const game = gameResponse.data;
    const screenshots = screenshotsResponse.data.results || [];

    if (!game) {
      return null;
    }

    // Enhance with screenshots and affiliate links
    const enhancedGame = {
      ...game,
      screenshots: screenshots.map((screenshot: any) => ({
        id: screenshot.id,
        image: screenshot.image
      })),
      amazon_links: generateGameAmazonLinks(game.name, game.platforms),
      digital_stores: generateGameStoreLinks(game.name, game.platforms)
    };

    // Cache for 24 hours
    await CacheManager.cacheExternalData('rawg', 'game', gameId, enhancedGame, 24);

    console.log(`✅ Fetched and cached game details for ${gameId} from RAWG`);
    return enhancedGame;

  } catch (error) {
    console.error(`💥 Error fetching game ${gameId} from RAWG:`, error);
    
    await ErrorLogger.logApiError(
      'rawg',
      `/games/${gameId}`,
      'fetch_error',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return null;
  }
}

// Check if a game is Spider-Man related
function isSpiderManGame(game: any): boolean {
  const name = game.name?.toLowerCase() || '';
  const tags = game.tags?.map((tag: any) => tag.name?.toLowerCase()).join(' ') || '';
  
  // More comprehensive Spider-Man game detection
  const spiderManKeywords = [
    'spider-man',
    'spiderman',
    'spider man',
    'peter parker',
    'miles morales',
    'venom',
    'web of shadows',
    'edge of time',
    'shattered dimensions',
    'ultimate spider-man',
    'amazing spider-man',
    'spectacular spider-man',
    'marvel\'s spider-man',
    'spider-verse'
  ];

  const marvelKeywords = [
    'marvel',
    'marvel\'s',
    'marvel universe',
    'marvel comics'
  ];

  const hasSpiderManKeyword = spiderManKeywords.some(keyword => 
    name.includes(keyword) || tags.includes(keyword)
  );

  const hasMarvelKeyword = marvelKeywords.some(keyword => 
    name.includes(keyword) || tags.includes(keyword)
  );

  // Must have Spider-Man keyword or (Marvel keyword AND spider reference)
  return hasSpiderManKeyword || (hasMarvelKeyword && (
    name.includes('spider') || 
    tags.includes('spider') ||
    name.includes('web') ||
    tags.includes('web-slinging')
  ));
}

// Generate Amazon affiliate links for games
function generateGameAmazonLinks(gameName: string, platforms?: any[]): Array<{platform: string; url: string}> {
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const links: Array<{platform: string; url: string}> = [];

  if (!platforms) {
    platforms = [{ platform: { name: 'PC', slug: 'pc' } }];
  }

  platforms.forEach(platformObj => {
    const platform = platformObj.platform;
    const searchQuery = encodeURIComponent(`${gameName} ${platform.name}`);
    links.push({
      platform: platform.name,
      url: `https://www.amazon.com/s?k=${searchQuery}&tag=${amazonTag}`
    });
  });

  return links;
}

// Generate digital store links based on platforms
function generateGameStoreLinks(gameName: string, platforms?: any[]): Array<{platform: string; url: string}> {
  const encodedName = encodeURIComponent(gameName);
  const links = [];

  if (!platforms) {
    return [];
  }

  // Steam (PC)
  if (platforms.some(p => p.platform.slug === 'pc')) {
    links.push({
      platform: 'Steam',
      url: `https://store.steampowered.com/search/?term=${encodedName}`
    });
  }

  // PlayStation Store
  if (platforms.some(p => p.platform.slug.includes('playstation'))) {
    links.push({
      platform: 'PlayStation Store',
      url: `https://store.playstation.com/search/${encodedName}`
    });
  }

  // Xbox Store
  if (platforms.some(p => p.platform.slug.includes('xbox'))) {
    links.push({
      platform: 'Xbox Store',
      url: `https://www.xbox.com/games/store/search?q=${encodedName}`
    });
  }

  // Nintendo eShop
  if (platforms.some(p => p.platform.slug.includes('nintendo'))) {
    links.push({
      platform: 'Nintendo eShop',
      url: `https://www.nintendo.com/us/search/?q=${encodedName}`
    });
  }

  return links;
}

// Transform RAWG game data to match our database schema
export function transformRawgGameToDbFormat(rawgGame: RawgGameData): any {
  return {
    title: rawgGame.name,
    year: rawgGame.released ? new Date(rawgGame.released).getFullYear() : new Date().getFullYear(),
    platform: rawgGame.platforms?.map(p => p.platform.name) || [],
    developer: rawgGame.developers?.[0]?.name || 'Unknown',
    publisher: rawgGame.publishers?.[0]?.name || rawgGame.developers?.[0]?.name || 'Unknown',
    genre: rawgGame.genres?.map(g => g.name).join(', ') || 'Action',
    rating: rawgGame.rating || 0,
    importance: rawgGame.metacritic ? rawgGame.metacritic / 10 : rawgGame.rating || 0,
    image: rawgGame.background_image || '',
    description: rawgGame.description_raw || rawgGame.name,
    longDescription: rawgGame.description || rawgGame.description_raw || `${rawgGame.name} is a Spider-Man video game developed by ${rawgGame.developers?.[0]?.name || 'Unknown'}.`,
    slug: rawgGame.slug || rawgGame.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    seoTitle: `${rawgGame.name} - Spider-Man Game Review`,
    seoDescription: rawgGame.description_raw ? 
      rawgGame.description_raw.substring(0, 155) + '...' : 
      `Play ${rawgGame.name}, an amazing Spider-Man game with rating ${rawgGame.rating}/5.`,
    keywords: [
      'spider-man',
      'spiderman',
      'videojuegos',
      'games',
      rawgGame.name.toLowerCase(),
      ...(rawgGame.genres?.map(g => g.name.toLowerCase()) || []),
      ...(rawgGame.platforms?.map(p => p.platform.name.toLowerCase()) || [])
    ],
    screenshotImages: rawgGame.screenshots?.map(s => ({
      url: s.image,
      title: `${rawgGame.name} Screenshot`,
      description: `In-game screenshot from ${rawgGame.name}`
    })) || [],
    isActive: true,
    views: 0
  };
}

// Export game data for external use
export { RawgGameData };