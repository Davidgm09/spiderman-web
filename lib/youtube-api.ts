/**
 * YouTube API integration for fetching game trailers
 * Searches for official game trailers using YouTube Data API v3
 */

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

interface YouTubeSearchResult {
  success: boolean;
  trailerUrl?: string;
  video?: YouTubeVideo;
  error?: string;
}

/**
 * Search for game trailers on YouTube
 * @param gameTitle - The title of the game
 * @param gameYear - The year the game was released
 * @param platform - The platform(s) the game is available on
 * @returns Promise with trailer URL or error
 */
export async function searchGameTrailer(
  gameTitle: string, 
  gameYear?: number,
  platform?: string | string[]
): Promise<YouTubeSearchResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not found. Please add YOUTUBE_API_KEY to your environment variables.');
    return { success: false, error: 'YouTube API key not configured' };
  }

  try {
    // Build search query with game title and relevant keywords
    const searchTerms = [
      gameTitle,
      'trailer',
      'official',
      gameYear ? gameYear.toString() : '',
      platform ? (Array.isArray(platform) ? platform[0] : platform) : ''
    ].filter(Boolean);

    const searchQuery = encodeURIComponent(searchTerms.join(' '));
    
    // YouTube Data API v3 search endpoint
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${searchQuery}&type=video&maxResults=10&order=relevance&key=${apiKey}`;

    console.log(`🔍 Searching YouTube for: ${searchTerms.join(' ')}`);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'No trailers found' };
    }

    // Filter and rank results to find the best trailer
    const bestTrailer = findBestTrailer(data.items, gameTitle);
    
    if (!bestTrailer) {
      return { success: false, error: 'No suitable trailer found' };
    }

    const trailerUrl = `https://www.youtube.com/watch?v=${bestTrailer.id.videoId}`;
    
    const video: YouTubeVideo = {
      id: bestTrailer.id.videoId,
      title: bestTrailer.snippet.title,
      description: bestTrailer.snippet.description,
      thumbnails: bestTrailer.snippet.thumbnails,
      channelTitle: bestTrailer.snippet.channelTitle,
      publishedAt: bestTrailer.snippet.publishedAt
    };

    console.log(`✅ Found trailer: ${video.title} by ${video.channelTitle}`);
    
    return { success: true, trailerUrl, video };
    
  } catch (error) {
    console.error('Error searching for game trailer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Find the best trailer from YouTube search results
 * @param items - YouTube search results
 * @param gameTitle - Original game title for matching
 * @returns Best trailer item or null
 */
function findBestTrailer(items: any[], gameTitle: string): any | null {
  // Scoring criteria for trailer quality
  const scoreTrailer = (item: any): number => {
    let score = 0;
    const title = item.snippet.title.toLowerCase();
    const description = item.snippet.description.toLowerCase();
    const channelTitle = item.snippet.channelTitle.toLowerCase();
    const gameTitleLower = gameTitle.toLowerCase();
    
    // Title matching
    if (title.includes(gameTitleLower)) score += 10;
    if (title.includes('trailer')) score += 8;
    if (title.includes('official')) score += 6;
    if (title.includes('gameplay')) score += 4;
    if (title.includes('launch')) score += 5;
    if (title.includes('announce')) score += 3;
    
    // Channel credibility
    const officialChannels = [
      'sony', 'playstation', 'xbox', 'nintendo', 'activision', 'ubisoft',
      'electronic arts', 'ea', 'warner bros', 'square enix', 'capcom',
      'insomniac games', 'marvel', 'spider-man', 'gamespot', 'ign'
    ];
    
    if (officialChannels.some(channel => channelTitle.includes(channel))) {
      score += 7;
    }
    
    // Description matching
    if (description.includes(gameTitleLower)) score += 3;
    if (description.includes('trailer')) score += 2;
    if (description.includes('official')) score += 2;
    
    // Penalty for non-English content (basic check)
    if (!/[a-zA-Z]/.test(title)) score -= 3;
    
    return score;
  };
  
  // Score all items and find the best one
  const scoredItems = items.map(item => ({
    item,
    score: scoreTrailer(item)
  }));
  
  // Sort by score (descending) and return the best one
  scoredItems.sort((a, b) => b.score - a.score);
  
  console.log(`📊 Top trailer candidates:`);
  scoredItems.slice(0, 3).forEach((scored, index) => {
    console.log(`${index + 1}. "${scored.item.snippet.title}" by ${scored.item.snippet.channelTitle} (Score: ${scored.score})`);
  });
  
  return scoredItems.length > 0 ? scoredItems[0].item : null;
}

/**
 * Get detailed video information including duration and view count
 * @param videoId - YouTube video ID
 * @returns Promise with detailed video info
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails?.duration,
      viewCount: video.statistics?.viewCount
    };
    
  } catch (error) {
    console.error('Error getting video details:', error);
    return null;
  }
}

/**
 * Convert YouTube watch URL to embed URL
 * @param watchUrl - YouTube watch URL
 * @returns Embed URL or original URL if conversion fails
 */
export function convertToEmbedUrl(watchUrl: string): string {
  try {
    const url = new URL(watchUrl);
    const videoId = url.searchParams.get('v');
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return watchUrl;
  } catch (error) {
    console.error('Error converting URL:', error);
    return watchUrl;
  }
}

/**
 * Validate if a YouTube URL is accessible
 * @param url - YouTube URL to validate
 * @returns Promise with validation result
 */
export async function validateYouTubeUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating YouTube URL:', error);
    return false;
  }
}