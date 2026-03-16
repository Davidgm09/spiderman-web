/**
 * Script to check the status of game trailers
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function checkTrailersStatus() {
  console.log('🔍 Checking game trailers status...');
  
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        playUrl: true,
        slug: true
      },
      orderBy: {
        year: 'desc'
      }
    });
    
    console.log(`📊 Total games: ${games.length}`);
    
    const gamesWithTrailers = games.filter(game => game.playUrl);
    const gamesWithoutTrailers = games.filter(game => !game.playUrl);
    
    console.log(`✅ Games with trailers: ${gamesWithTrailers.length}`);
    console.log(`❌ Games without trailers: ${gamesWithoutTrailers.length}`);
    
    if (gamesWithTrailers.length > 0) {
      console.log('\n🎥 Games with trailers:');
      gamesWithTrailers.forEach(game => {
        console.log(`   ✅ ${game.title} (${game.year})`);
        console.log(`      📹 ${game.playUrl}`);
      });
    }
    
    if (gamesWithoutTrailers.length > 0) {
      console.log('\n⚠️  Games without trailers:');
      gamesWithoutTrailers.forEach(game => {
        console.log(`   ❌ ${game.title} (${game.year}) - ${game.slug}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking trailers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTrailersStatus().catch(console.error);