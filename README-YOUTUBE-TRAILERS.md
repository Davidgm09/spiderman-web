# YouTube Trailer Integration for Spider-World Games

This document explains how to set up and use the YouTube API integration to automatically fetch game trailers for the Spider-World website.

## Overview

The YouTube trailer integration automatically searches for and fetches official game trailers from YouTube using the YouTube Data API v3. This solves the problem of missing trailers in the game database.

## Setup Instructions

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Create credentials (API Key)
5. Copy your API key

### 2. Configure Environment Variables

Add your YouTube API key to the `.env` file:

```bash
# Add this line to .env
YOUTUBE_API_KEY="your_actual_youtube_api_key_here"
```

Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key.

### 3. Install Dependencies

The integration uses existing project dependencies. No additional installation required.

## Usage

### Test the Integration

Before updating all games, test the YouTube search functionality:

```bash
node scripts/test-youtube-trailer-search.js
```

This will test trailer search for 5 sample Spider-Man games and show the results.

### Update Game Trailers

#### Update All Games Without Trailers

```bash
node scripts/update-game-trailers.js
```

#### Update a Specific Game

```bash
node scripts/update-game-trailers.js --game spider-man-2018
```

#### Preview Changes (Dry Run)

```bash
node scripts/update-game-trailers.js --dry-run
```

### Automatic Integration

The trailer search is now integrated into the game population script. When you run:

```bash
node scripts/populate-games-from-rawg.js
```

It will automatically search for YouTube trailers for new games that don't have trailers.

## How It Works

### Search Algorithm

The system searches YouTube using these criteria:

1. **Search Query**: Combines game title, year, platform, and keywords like "trailer" and "official"
2. **Result Scoring**: Ranks results based on:
   - Title matching
   - Presence of keywords ("trailer", "official", "gameplay")
   - Channel credibility (official publishers, gaming channels)
   - Content quality indicators

### Example Search Process

For "Spider-Man 2 (2023)":
1. Search: `"Spider-Man 2 2023 PlayStation 5 trailer official"`
2. Get top 10 results
3. Score each result based on relevance
4. Select the best trailer
5. Store the YouTube URL in the database

### Quality Filters

The system prioritizes trailers from:
- **Official Publishers**: Sony, PlayStation, Marvel, Activision, etc.
- **Gaming Media**: GameSpot, IGN, etc.
- **Content Type**: Official trailers over gameplay videos
- **Relevance**: Exact title matches over similar games

## File Structure

```
lib/youtube-api.ts              # YouTube API integration functions
scripts/update-game-trailers.js # Script to update game trailers
scripts/test-youtube-trailer-search.js # Test script
scripts/populate-games-from-rawg.js # Enhanced with YouTube integration
```

## API Functions

### `searchGameTrailer(title, year, platform)`

Searches for a game trailer on YouTube.

**Parameters:**
- `title`: Game title
- `year`: Release year (optional)
- `platform`: Platform(s) (optional)

**Returns:**
- `success`: Boolean indicating if a trailer was found
- `trailerUrl`: YouTube watch URL
- `video`: Video details (title, channel, thumbnail, etc.)
- `error`: Error message if failed

### `getVideoDetails(videoId)`

Gets detailed information about a YouTube video.

### `convertToEmbedUrl(watchUrl)`

Converts a YouTube watch URL to an embed URL for iframe display.

## Rate Limiting

The system includes rate limiting to respect YouTube API quotas:
- 1-second delay between requests
- Batched processing for multiple games
- Error handling for quota exceeded

## Troubleshooting

### Common Issues

1. **"YouTube API key not configured"**
   - Add `YOUTUBE_API_KEY` to your `.env` file
   - Make sure the key is not the placeholder value

2. **"No trailers found"**
   - The game might not have official trailers on YouTube
   - Try searching with different keywords
   - Check if the game title spelling is correct

3. **"YouTube API error: 403"**
   - Your API key might be invalid
   - You may have exceeded your quota
   - Make sure YouTube Data API v3 is enabled

4. **"YouTube API error: 400"**
   - Invalid search parameters
   - Check game title formatting

### Quota Management

YouTube API has daily quotas:
- **Free tier**: 10,000 queries per day
- **Search operation**: ~100 quota units per search
- **Video details**: ~1 quota unit per video

This means you can search for ~100 games per day on the free tier.

## Examples

### Successful Search Result

```javascript
{
  success: true,
  trailerUrl: "https://www.youtube.com/watch?v=abc123",
  video: {
    id: "abc123",
    title: "Marvel's Spider-Man 2 - Official Launch Trailer",
    channelTitle: "PlayStation",
    publishedAt: "2023-10-15T10:00:00Z",
    thumbnails: { ... }
  }
}
```

### Failed Search Result

```javascript
{
  success: false,
  error: "No trailers found"
}
```

## Next Steps

1. **Set up your YouTube API key**
2. **Run the test script** to verify everything works
3. **Update game trailers** using the update script
4. **Monitor results** and adjust search parameters if needed

The integration will automatically find trailers for most Spider-Man games and keep your database up-to-date with official trailer content.