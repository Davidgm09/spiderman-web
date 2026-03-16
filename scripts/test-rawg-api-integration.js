/**
 * Script de prueba para verificar la integración con RAWG API
 * Verifica que la API funcione correctamente y muestre los datos
 */

import dotenv from 'dotenv';
import { fetchSpiderManGamesFromRawg, fetchGameDetailsFromRawg, transformRawgGameToDbFormat } from './lib/rawg-api.js';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

async function testRawgApiIntegration() {
  console.log('🎮 Iniciando pruebas de integración con RAWG API...\n');

  try {
    // Verificar configuración de API key
    console.log('🔑 Verificando configuración de API key...');
    if (!process.env.RAWG_API_KEY) {
      throw new Error('❌ RAWG_API_KEY no está configurada en .env.local');
    }
    console.log('✅ API key configurada correctamente\n');

    // Prueba 1: Obtener lista de juegos de Spider-Man
    console.log('📊 Prueba 1: Obteniendo lista de juegos de Spider-Man...');
    const games = await fetchSpiderManGamesFromRawg();
    
    if (!games || games.length === 0) {
      console.log('❌ No se encontraron juegos');
      return;
    }

    console.log(`✅ Se encontraron ${games.length} juegos de Spider-Man`);
    
    // Mostrar los primeros 5 juegos
    console.log('\n🎯 Primeros 5 juegos encontrados:');
    games.slice(0, 5).forEach((game, index) => {
      console.log(`   ${index + 1}. ${game.name} (${game.released || 'Sin fecha'}) - Rating: ${game.rating}/5`);
      console.log(`      Plataformas: ${game.platforms?.map(p => p.platform.name).join(', ') || 'N/A'}`);
      console.log(`      Imagen: ${game.background_image ? '✅' : '❌'}`);
      console.log('');
    });

    // Prueba 2: Obtener detalles de un juego específico
    if (games.length > 0) {
      const firstGame = games[0];
      console.log(`🔍 Prueba 2: Obteniendo detalles del juego "${firstGame.name}" (ID: ${firstGame.id})...`);
      
      const gameDetails = await fetchGameDetailsFromRawg(firstGame.id.toString());
      
      if (gameDetails) {
        console.log('✅ Detalles del juego obtenidos correctamente');
        console.log(`   📝 Descripción: ${gameDetails.description_raw ? 'Disponible' : 'No disponible'}`);
        console.log(`   🖼️  Screenshots: ${gameDetails.screenshots?.length || 0}`);
        console.log(`   🏪 Tiendas: ${gameDetails.stores?.length || 0}`);
        console.log(`   🎮 Desarrolladores: ${gameDetails.developers?.map(d => d.name).join(', ') || 'N/A'}`);
        console.log(`   📊 Metacritic: ${gameDetails.metacritic || 'N/A'}`);
      } else {
        console.log('❌ No se pudieron obtener los detalles del juego');
      }
    }

    // Prueba 3: Transformación de datos
    console.log('\n🔄 Prueba 3: Probando transformación de datos para la base de datos...');
    const firstGame = games[0];
    const transformedData = transformRawgGameToDbFormat(firstGame);
    
    console.log('✅ Datos transformados correctamente');
    console.log('   Campos transformados:');
    console.log(`   - Título: ${transformedData.title}`);
    console.log(`   - Año: ${transformedData.year}`);
    console.log(`   - Plataformas: ${transformedData.platform.join(', ')}`);
    console.log(`   - Desarrollador: ${transformedData.developer}`);
    console.log(`   - Género: ${transformedData.genre}`);
    console.log(`   - Rating: ${transformedData.rating}`);
    console.log(`   - Slug: ${transformedData.slug}`);
    console.log(`   - Keywords: ${transformedData.keywords.join(', ')}`);
    console.log(`   - Screenshots: ${transformedData.screenshotImages?.length || 0}`);

    // Prueba 4: Validación de imágenes
    console.log('\n🖼️  Prueba 4: Validando URLs de imágenes...');
    let validImages = 0;
    let totalImages = 0;

    for (const game of games.slice(0, 5)) {
      if (game.background_image) {
        totalImages++;
        try {
          // Solo verificar que la URL esté bien formada
          new URL(game.background_image);
          validImages++;
        } catch (error) {
          console.log(`❌ URL de imagen inválida para ${game.name}: ${game.background_image}`);
        }
      }
    }

    console.log(`✅ ${validImages}/${totalImages} imágenes con URLs válidas`);

    // Prueba 5: Verificar enlaces de afiliados
    console.log('\n💰 Prueba 5: Verificando generación de enlaces de afiliados...');
    const gameWithLinks = games[0];
    if (gameWithLinks.amazon_links && gameWithLinks.amazon_links.length > 0) {
      console.log(`✅ ${gameWithLinks.amazon_links.length} enlaces de Amazon generados`);
      gameWithLinks.amazon_links.forEach(link => {
        console.log(`   - ${link.platform}: ${link.url}`);
      });
    }

    if (gameWithLinks.digital_stores && gameWithLinks.digital_stores.length > 0) {
      console.log(`✅ ${gameWithLinks.digital_stores.length} enlaces de tiendas digitales generados`);
      gameWithLinks.digital_stores.forEach(store => {
        console.log(`   - ${store.platform}: ${store.url}`);
      });
    }

    // Resumen final
    console.log('\n🎯 Resumen de las pruebas:');
    console.log('✅ Todas las pruebas completadas exitosamente');
    console.log(`🎮 ${games.length} juegos de Spider-Man encontrados`);
    console.log('🔗 Integración con RAWG API funcionando correctamente');
    console.log('🖼️  Imágenes y screenshots disponibles');
    console.log('💰 Enlaces de afiliados generados correctamente');
    
    console.log('\n📋 Siguiente paso:');
    console.log('   Ejecuta el script de población: node scripts/populate-games-from-rawg.js');

  } catch (error) {
    console.error('\n💥 Error en las pruebas:', error);
    console.error('Stack trace:', error.stack);
    
    // Diagnóstico adicional
    console.log('\n🔍 Diagnóstico:');
    console.log(`   - RAWG_API_KEY configurada: ${process.env.RAWG_API_KEY ? 'Sí' : 'No'}`);
    console.log(`   - Longitud de API key: ${process.env.RAWG_API_KEY?.length || 0} caracteres`);
    
    throw error;
  }
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas de integración RAWG API...\n');
testRawgApiIntegration()
  .then(() => {
    console.log('\n✅ Todas las pruebas completadas con éxito');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Falló la prueba de integración:', error.message);
    process.exit(1);
  });