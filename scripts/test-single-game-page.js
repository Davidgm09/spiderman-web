/**
 * Script to test a single game page rendering
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function testSingleGamePage() {
  console.log('🎮 Testing single game page data...');
  
  try {
    // Get Spider-Man 2018 data
    const game = await prisma.game.findUnique({
      where: { slug: 'marvel-s-spider-man-2018' }
    });
    
    if (!game) {
      console.error('❌ Game not found: marvels-spider-man-2018');
      return;
    }
    
    console.log(`✅ Found game: ${game.title} (${game.year})`);
    console.log(`📹 PlayURL: ${game.playUrl}`);
    console.log(`🔗 Slug: ${game.slug}`);
    
    // Test URL conversion
    let embedUrl = game.playUrl;
    if (embedUrl && embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
      console.log(`🔄 Converted to embed: ${embedUrl}`);
    }
    
    // Test if playUrl exists and would show trailer
    const shouldShowTrailer = Boolean(game.playUrl);
    console.log(`🎬 Should show trailer: ${shouldShowTrailer}`);
    
    if (shouldShowTrailer) {
      console.log(`✅ Trailer section should be visible`);
      console.log(`   - Button "Ver Tráiler" should appear`);
      console.log(`   - Iframe section should be rendered`);
      console.log(`   - Iframe src: ${embedUrl}`);
    } else {
      console.log(`❌ Trailer section will be hidden`);
    }
    
    // Check page URL
    console.log(`🌐 Page URL: http://localhost:3000/videojuegos/${game.slug}`);
    
  } catch (error) {
    console.error('Error testing game page:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSingleGamePage().catch(console.error);