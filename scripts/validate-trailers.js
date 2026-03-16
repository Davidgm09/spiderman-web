/**
 * Script to validate if YouTube trailer URLs are working
 */

import { PrismaClient } from '@prisma/client';
import { validateYouTubeUrl } from '../lib/youtube-api.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function validateTrailers() {
  console.log('🔍 Validating YouTube trailer URLs...');
  
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        playUrl: true,
        slug: true
      },
      where: {
        playUrl: {
          not: null
        }
      },
      orderBy: {
        year: 'desc'
      }
    });
    
    console.log(`📊 Validating ${games.length} game trailers...`);
    
    let validCount = 0;
    let invalidCount = 0;
    const invalidTrailers = [];
    
    for (const game of games) {
      try {
        console.log(`🔍 Validating: ${game.title} (${game.year})`);
        
        const isValid = await validateYouTubeUrl(game.playUrl);
        
        if (isValid) {
          console.log(`✅ Valid: ${game.playUrl}`);
          validCount++;
        } else {
          console.log(`❌ Invalid: ${game.playUrl}`);
          invalidCount++;
          invalidTrailers.push({
            game: game.title,
            year: game.year,
            slug: game.slug,
            url: game.playUrl
          });
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`💥 Error validating ${game.title}:`, error.message);
        invalidCount++;
        invalidTrailers.push({
          game: game.title,
          year: game.year,
          slug: game.slug,
          url: game.playUrl,
          error: error.message
        });
      }
    }
    
    console.log(`\n📊 Validation Summary:`);
    console.log(`✅ Valid trailers: ${validCount}`);
    console.log(`❌ Invalid trailers: ${invalidCount}`);
    console.log(`📈 Success rate: ${Math.round((validCount / games.length) * 100)}%`);
    
    if (invalidTrailers.length > 0) {
      console.log(`\n⚠️  Invalid trailers found:`);
      invalidTrailers.forEach(trailer => {
        console.log(`   ❌ ${trailer.game} (${trailer.year})`);
        console.log(`      🔗 ${trailer.url}`);
        console.log(`      📝 Slug: ${trailer.slug}`);
        if (trailer.error) {
          console.log(`      ❓ Error: ${trailer.error}`);
        }
      });
      
      console.log(`\n💡 To fix invalid trailers:`);
      console.log(`   1. Search for new trailers manually`);
      console.log(`   2. Use the YouTube search to find replacements:`);
      invalidTrailers.forEach(trailer => {
        console.log(`      npx tsx scripts/update-game-trailers.js --game ${trailer.slug}`);
      });
    }
    
  } catch (error) {
    console.error('Error validating trailers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateTrailers().catch(console.error);