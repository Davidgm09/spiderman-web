/**
 * Script to find recent Spider-Man games
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function findRecentGames() {
  console.log('🔍 Finding recent Spider-Man games...');
  
  try {
    const games = await prisma.game.findMany({
      select: {
        title: true,
        year: true,
        playUrl: true,
        slug: true
      },
      where: {
        year: {
          gte: 2015 // Games from 2015 onwards
        }
      },
      orderBy: {
        year: 'desc'
      }
    });
    
    console.log(`📊 Found ${games.length} recent games:\n`);
    
    games.forEach(game => {
      console.log(`🎮 ${game.title} (${game.year})`);
      console.log(`   📝 Slug: ${game.slug}`);
      console.log(`   📹 Has trailer: ${game.playUrl ? '✅' : '❌'}`);
      console.log(`   🌐 URL: http://localhost:3000/videojuegos/${game.slug}\n`);
    });
    
  } catch (error) {
    console.error('Error finding games:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findRecentGames().catch(console.error);