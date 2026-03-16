/**
 * Script to debug trailer URL formats
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function debugTrailerUrls() {
  console.log('🔍 Debugging trailer URL formats...');
  
  try {
    const games = await prisma.game.findMany({
      select: {
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
      take: 5 // Solo los primeros 5 para debug
    });
    
    console.log(`📊 Sample of ${games.length} games:\n`);
    
    games.forEach(game => {
      console.log(`🎮 ${game.title} (${game.year})`);
      console.log(`   📹 Original URL: ${game.playUrl}`);
      
      // Test URL conversion
      let embedUrl = game.playUrl;
      if (embedUrl.includes('youtube.com/watch?v=')) {
        embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      console.log(`   🔗 Embed URL: ${embedUrl}`);
      console.log(`   📝 Slug: ${game.slug}`);
      console.log(`   🌐 Page URL: http://localhost:3000/videojuegos/${game.slug}\n`);
    });
    
  } catch (error) {
    console.error('Error debugging URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTrailerUrls().catch(console.error);