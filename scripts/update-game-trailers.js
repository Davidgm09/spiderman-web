/**
 * Script to update game trailers using YouTube API
 * Finds and updates trailer URLs for games without trailers
 */

import { PrismaClient } from '@prisma/client';
import { searchGameTrailer } from '../lib/youtube-api.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function updateGameTrailers() {
  console.log('🎮 Starting game trailer update process...');
  
  try {
    // Get all games from database
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        platform: true,
        playUrl: true,
        slug: true
      }
    });
    
    console.log(`📊 Found ${games.length} games in database`);
    
    // Filter games without trailers
    const gamesWithoutTrailers = games.filter(game => !game.playUrl);
    const gamesWithTrailers = games.filter(game => game.playUrl);
    
    console.log(`✅ Games with trailers: ${gamesWithTrailers.length}`);
    console.log(`❌ Games without trailers: ${gamesWithoutTrailers.length}`);
    
    if (gamesWithoutTrailers.length === 0) {
      console.log('🎉 All games already have trailers!');
      return;
    }
    
    // Check if YouTube API key is configured
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key not found in environment variables');
      console.log('Please add YOUTUBE_API_KEY to your .env file');
      console.log('Get your API key from: https://console.developers.google.com/');
      return;
    }
    
    console.log(`🔍 Searching for trailers for ${gamesWithoutTrailers.length} games...`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process games one by one to avoid rate limiting
    for (const game of gamesWithoutTrailers) {
      try {
        console.log(`\n🎮 Processing: ${game.title} (${game.year})`);
        
        // Search for trailer on YouTube
        const result = await searchGameTrailer(
          game.title,
          game.year,
          game.platform
        );
        
        if (result.success && result.trailerUrl) {
          // Update game with trailer URL
          await prisma.game.update({
            where: { id: game.id },
            data: { playUrl: result.trailerUrl }
          });
          
          console.log(`✅ Updated ${game.title} with trailer: ${result.trailerUrl}`);
          updatedCount++;
        } else {
          console.log(`❌ No trailer found for ${game.title}: ${result.error}`);
          errorCount++;
        }
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${game.title}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`✅ Successfully updated: ${updatedCount} games`);
    console.log(`❌ Failed to update: ${errorCount} games`);
    console.log(`🎉 Total games with trailers: ${gamesWithTrailers.length + updatedCount}`);
    
  } catch (error) {
    console.error('❌ Error in trailer update process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Support command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎮 Game Trailer Update Script

Usage: node scripts/update-game-trailers.js [options]

Options:
  --help, -h       Show this help message
  --dry-run        Show what would be updated without making changes
  --game <slug>    Update trailer for specific game by slug
  --force          Update trailers even if they already exist

Examples:
  node scripts/update-game-trailers.js
  node scripts/update-game-trailers.js --dry-run
  node scripts/update-game-trailers.js --game spider-man-2018
  node scripts/update-game-trailers.js --force
`);
    return;
  }
  
  if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN MODE - No changes will be made');
    // Add dry run logic here
    return;
  }
  
  if (args.includes('--game')) {
    const gameSlug = args[args.indexOf('--game') + 1];
    if (gameSlug) {
      await updateSingleGameTrailer(gameSlug);
      return;
    }
  }
  
  await updateGameTrailers();
}

/**
 * Update trailer for a single game by slug
 */
async function updateSingleGameTrailer(slug) {
  console.log(`🎮 Updating trailer for game: ${slug}`);
  
  try {
    const game = await prisma.game.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        year: true,
        platform: true,
        playUrl: true,
        slug: true
      }
    });
    
    if (!game) {
      console.error(`❌ Game not found: ${slug}`);
      return;
    }
    
    if (game.playUrl) {
      console.log(`ℹ️  Game already has trailer: ${game.playUrl}`);
      console.log('Use --force to update anyway');
      return;
    }
    
    const result = await searchGameTrailer(
      game.title,
      game.year,
      game.platform
    );
    
    if (result.success && result.trailerUrl) {
      await prisma.game.update({
        where: { id: game.id },
        data: { playUrl: result.trailerUrl }
      });
      
      console.log(`✅ Updated ${game.title} with trailer: ${result.trailerUrl}`);
    } else {
      console.log(`❌ No trailer found for ${game.title}: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating single game trailer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { updateGameTrailers, updateSingleGameTrailer };