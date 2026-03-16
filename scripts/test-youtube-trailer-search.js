/**
 * Script de prueba para la búsqueda de tráilers en YouTube
 * Prueba la funcionalidad de búsqueda de tráilers antes de la implementación completa
 */

import { searchGameTrailer, getVideoDetails, convertToEmbedUrl } from '../lib/youtube-api.ts';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

// Juegos de prueba para testear la búsqueda
const testGames = [
  {
    title: "Spider-Man 2",
    year: 2023,
    platform: ["PlayStation 5"]
  },
  {
    title: "Marvel's Spider-Man: Miles Morales",
    year: 2020,
    platform: ["PlayStation 5", "PlayStation 4"]
  },
  {
    title: "Marvel's Spider-Man",
    year: 2018,
    platform: ["PlayStation 4"]
  },
  {
    title: "Spider-Man: Shattered Dimensions",
    year: 2010,
    platform: ["PlayStation 3", "Xbox 360"]
  },
  {
    title: "The Amazing Spider-Man 2",
    year: 2014,
    platform: ["PlayStation 4", "Xbox One"]
  }
];

async function testYouTubeTrailerSearch() {
  console.log('🧪 Iniciando pruebas de búsqueda de tráilers en YouTube...');
  
  // Verificar configuración
  if (!process.env.YOUTUBE_API_KEY) {
    console.error('❌ YOUTUBE_API_KEY no está configurada en .env');
    console.log('Please add your YouTube API key to .env file');
    console.log('Get your API key from: https://console.developers.google.com/');
    return;
  }

  if (process.env.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.error('❌ YOUTUBE_API_KEY needs to be replaced with a real API key');
    console.log('Please replace YOUR_YOUTUBE_API_KEY_HERE with your actual YouTube API key');
    return;
  }

  console.log('✅ YouTube API key configured');
  
  let successCount = 0;
  let errorCount = 0;

  for (const game of testGames) {
    console.log(`\n🎮 Probando: ${game.title} (${game.year})`);
    console.log(`📱 Plataformas: ${game.platform.join(', ')}`);
    
    try {
      // Buscar tráiler
      const result = await searchGameTrailer(game.title, game.year, game.platform);
      
      if (result.success) {
        console.log(`✅ Tráiler encontrado: ${result.trailerUrl}`);
        
        if (result.video) {
          console.log(`   📺 Título: ${result.video.title}`);
          console.log(`   🎬 Canal: ${result.video.channelTitle}`);
          console.log(`   📅 Publicado: ${new Date(result.video.publishedAt).toLocaleDateString()}`);
          
          // Convertir a URL embed
          const embedUrl = convertToEmbedUrl(result.trailerUrl);
          console.log(`   🔗 URL embed: ${embedUrl}`);
          
          // Obtener detalles adicionales del video
          const videoDetails = await getVideoDetails(result.video.id);
          if (videoDetails) {
            console.log(`   👀 Vistas: ${videoDetails.viewCount ? parseInt(videoDetails.viewCount).toLocaleString() : 'N/A'}`);
            console.log(`   ⏱️  Duración: ${videoDetails.duration || 'N/A'}`);
          }
        }
        
        successCount++;
      } else {
        console.log(`❌ No se encontró tráiler: ${result.error}`);
        errorCount++;
      }
      
      // Pausa entre búsquedas para respetar rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`💥 Error buscando tráiler para ${game.title}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Resumen de pruebas:`);
  console.log(`✅ Éxitos: ${successCount}/${testGames.length}`);
  console.log(`❌ Errores: ${errorCount}/${testGames.length}`);
  console.log(`📈 Tasa de éxito: ${Math.round((successCount / testGames.length) * 100)}%`);
  
  if (successCount > 0) {
    console.log('\n🎉 ¡La integración con YouTube funciona correctamente!');
    console.log('Puedes proceder a actualizar los tráilers de los juegos ejecutando:');
    console.log('   node scripts/update-game-trailers.js');
  } else {
    console.log('\n⚠️  No se encontraron tráilers. Verifica:');
    console.log('   - Que tu API key de YouTube sea válida');
    console.log('   - Que tengas cuota disponible en tu proyecto de Google Cloud');
    console.log('   - Que la YouTube Data API v3 esté habilitada');
  }
}

// Función para probar una búsqueda individual
async function testSingleGame(title, year, platform) {
  console.log(`🎮 Probando búsqueda individual para: ${title}`);
  
  try {
    const result = await searchGameTrailer(title, year, platform);
    
    if (result.success) {
      console.log(`✅ Tráiler encontrado: ${result.trailerUrl}`);
      console.log(`📺 Título: ${result.video?.title}`);
      console.log(`🎬 Canal: ${result.video?.channelTitle}`);
    } else {
      console.log(`❌ No se encontró tráiler: ${result.error}`);
    }
  } catch (error) {
    console.error(`💥 Error:`, error.message);
  }
}

// Ejecutar pruebas
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧪 YouTube Trailer Search Test

Usage: node scripts/test-youtube-trailer-search.js [options]

Options:
  --help, -h           Show this help message
  --single <title>     Test search for a single game
  --year <year>        Specify year for single game test
  --platform <platform> Specify platform for single game test

Examples:
  node scripts/test-youtube-trailer-search.js
  node scripts/test-youtube-trailer-search.js --single "Spider-Man 2" --year 2023
`);
    return;
  }
  
  if (args.includes('--single')) {
    const title = args[args.indexOf('--single') + 1];
    const year = args.includes('--year') ? parseInt(args[args.indexOf('--year') + 1]) : undefined;
    const platform = args.includes('--platform') ? args[args.indexOf('--platform') + 1] : undefined;
    
    if (title) {
      await testSingleGame(title, year, platform);
    } else {
      console.error('❌ Please provide a game title with --single');
    }
  } else {
    await testYouTubeTrailerSearch();
  }
}

// Solo ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testYouTubeTrailerSearch, testSingleGame };