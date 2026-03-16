#!/usr/bin/env node

/**
 * Download Game Images
 * Descarga automática de imágenes de videojuegos desde fuentes confiables
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuración
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'games');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TIMEOUT = 30000; // 30 segundos

// URLs de imágenes de alta calidad desde fuentes públicas
const HIGH_QUALITY_SOURCES = {
  'marvels-spider-man-2018': [
    'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg',
    'https://howlongtobeat.com/games/57507_Spider-Man.jpg',
    'https://upload.wikimedia.org/wikipedia/en/e/e1/Spider-Man_PS4_cover.jpg'
  ],
  'spider-man-2-2004': [
    'https://cdn.cloudflare.steamstatic.com/steam/apps/940960/header.jpg',
    'https://howlongtobeat.com/games/8866_Spider-Man_2.jpg',
    'https://upload.wikimedia.org/wikipedia/en/2/2e/Spider-Man_2_Game_Cover.jpg'
  ],
  'spider-man-3-2007': [
    'https://howlongtobeat.com/games/8867_Spider-Man_3.jpg',
    'https://upload.wikimedia.org/wikipedia/en/4/4e/Spider-Man_3_Game_Cover.jpg'
  ],
  'ultimate-spider-man-2005': [
    'https://howlongtobeat.com/games/10644_Ultimate_Spider-Man.jpg',
    'https://upload.wikimedia.org/wikipedia/en/f/fe/Ultimate_Spider-Man_Coverart.png'
  ],
  'the-amazing-spider-man-2012': [
    'https://howlongtobeat.com/games/9848_The_Amazing_Spider-Man.jpg',
    'https://upload.wikimedia.org/wikipedia/en/9/91/The_Amazing_Spider-Man_video_game_cover.jpg'
  ],
  'spider-man-web-of-shadows': [
    'https://howlongtobeat.com/games/8869_Spider-Man_Web_of_Shadows.jpg',
    'https://upload.wikimedia.org/wikipedia/en/4/47/Spider-Man_Web_of_Shadows_Cover.jpg'
  ],
  'spider-man-shattered-dimensions': [
    'https://howlongtobeat.com/games/8868_Spider-Man_Shattered_Dimensions.jpg',
    'https://upload.wikimedia.org/wikipedia/en/9/91/Spider-Man_Shattered_Dimensions_Cover.jpg'
  ]
};

// Crear directorio si no existe
function ensureDirectoryExists() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${IMAGES_DIR}`);
  }
}

// Descargar imagen desde URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const filePath = path.join(IMAGES_DIR, filename);
    
    console.log(`⬇️  Descargando: ${url}`);
    
    const request = protocol.get(url, { timeout: TIMEOUT }, (response) => {
      // Verificar código de respuesta
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      // Verificar tipo de contenido
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('image')) {
        reject(new Error(`Tipo de contenido inválido: ${contentType}`));
        return;
      }

      // Verificar tamaño
      const contentLength = parseInt(response.headers['content-length']);
      if (contentLength && contentLength > MAX_FILE_SIZE) {
        reject(new Error(`Archivo muy grande: ${contentLength} bytes`));
        return;
      }

      // Crear stream de escritura
      const fileStream = fs.createWriteStream(filePath);
      let downloadedBytes = 0;

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (downloadedBytes > MAX_FILE_SIZE) {
          fileStream.destroy();
          fs.unlinkSync(filePath);
          reject(new Error('Archivo muy grande durante descarga'));
          return;
        }
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Descargado: ${filename} (${downloadedBytes} bytes)`);
        resolve(filePath);
      });

      fileStream.on('error', (error) => {
        fs.unlinkSync(filePath);
        reject(error);
      });

    }).on('error', reject);

    // Timeout para la solicitud
    request.setTimeout(TIMEOUT, () => {
      request.destroy();
      reject(new Error('Timeout en la descarga'));
    });
  });
}

// Intentar descargar desde múltiples fuentes
async function downloadFromSources(gameSlug, sources) {
  for (let i = 0; i < sources.length; i++) {
    try {
      const url = sources[i];
      const extension = path.extname(new URL(url).pathname) || '.jpg';
      const filename = `${gameSlug}${extension}`;
      
      const filePath = await downloadImage(url, filename);
      return `/images/games/${filename}`;
      
    } catch (error) {
      console.log(`❌ Fallo fuente ${i + 1}: ${error.message}`);
      if (i === sources.length - 1) {
        throw new Error(`Todas las fuentes fallaron para ${gameSlug}`);
      }
    }
  }
}

// Descargar todas las imágenes
async function downloadAllGameImages() {
  console.log('🎮 Iniciando descarga automática de imágenes de videojuegos...\n');
  
  ensureDirectoryExists();

  const results = {
    downloaded: 0,
    failed: 0,
    skipped: 0
  };

  for (const [gameSlug, sources] of Object.entries(HIGH_QUALITY_SOURCES)) {
    try {
      console.log(`\n🎯 Procesando: ${gameSlug}`);
      
      // Verificar si ya existe
      const existingFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(gameSlug));
      if (existingFiles.length > 0) {
        console.log(`⏭️  Ya existe: ${existingFiles[0]}`);
        results.skipped++;
        continue;
      }

      // Descargar desde fuentes
      const localPath = await downloadFromSources(gameSlug, sources);
      
      // Actualizar base de datos
      await prisma.game.updateMany({
        where: { slug: gameSlug },
        data: { image: localPath }
      });

      console.log(`🎉 Completado: ${gameSlug} -> ${localPath}`);
      results.downloaded++;

    } catch (error) {
      console.error(`❌ Error con ${gameSlug}: ${error.message}`);
      results.failed++;
    }
  }

  // Resumen
  console.log(`\n📊 Resumen de descarga:`);
  console.log(`   ✅ Descargadas: ${results.downloaded}`);
  console.log(`   ⏭️  Omitidas: ${results.skipped}`);
  console.log(`   ❌ Fallos: ${results.failed}`);
  console.log(`   📁 Directorio: ${IMAGES_DIR}`);

  return results;
}

// Limpiar imágenes rotas
async function cleanBrokenImages() {
  console.log('\n🧹 Limpiando imágenes rotas...');
  
  const files = fs.readdirSync(IMAGES_DIR);
  let cleaned = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stats = fs.statSync(filePath);
    
    // Eliminar archivos muy pequeños (probablemente rotos)
    if (stats.size < 1024) { // Menos de 1KB
      fs.unlinkSync(filePath);
      console.log(`🗑️  Eliminado: ${file} (${stats.size} bytes)`);
      cleaned++;
    }
  }

  console.log(`✨ Limpieza completada: ${cleaned} archivos eliminados`);
}

// Comando principal
async function main() {
  try {
    await downloadAllGameImages();
    await cleanBrokenImages();
    console.log('\n🎉 Proceso completado exitosamente!');
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { downloadAllGameImages, downloadImage };