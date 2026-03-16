const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

// Configuración del sistema de validación
const IMAGE_VALIDATION_CONFIG = {
  minWidth: 300,
  minHeight: 300,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  timeout: 10000, // 10 segundos
  retries: 3
};

// Utilidades
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para validar imagen completa
async function validateImage(url, retries = IMAGE_VALIDATION_CONFIG.retries) {
  if (!url || url.includes('placeholder') || url.startsWith('/images/')) {
    return {
      valid: false,
      reason: 'local-placeholder',
      url: url
    };
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_VALIDATION_CONFIG.timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Validar tipo de contenido
    if (!IMAGE_VALIDATION_CONFIG.allowedTypes.some(type => contentType?.includes(type))) {
      return {
        valid: false,
        reason: 'invalid-content-type',
        contentType: contentType,
        url: url
      };
    }
    
    // Validar tamaño de archivo
    if (contentLength && parseInt(contentLength) > IMAGE_VALIDATION_CONFIG.maxFileSize) {
      return {
        valid: false,
        reason: 'file-too-large',
        size: parseInt(contentLength),
        url: url
      };
    }
    
    // Si es una imagen de Marvel, verificar que no sea "image not available"
    if (url.includes('i.annihil.us') && url.includes('image_not_available')) {
      return {
        valid: false,
        reason: 'marvel-not-available',
        url: url
      };
    }
    
    return {
      valid: true,
      contentType: contentType,
      size: contentLength ? parseInt(contentLength) : null,
      url: url
    };
    
  } catch (error) {
    if (retries > 0) {
      console.log(`    ⏳ Reintentando... (${retries} intentos restantes)`);
      await delay(1000);
      return validateImage(url, retries - 1);
    }
    
    return {
      valid: false,
      reason: 'network-error',
      error: error.message,
      url: url
    };
  }
}

// Función para obtener dimensiones de imagen (opcional, requiere descarga parcial)
async function getImageDimensions(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-2048', // Solo primeros 2KB para leer headers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const buffer = await response.buffer();
      
      // Detectar dimensiones básicas según el tipo de imagen
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        // JPEG
        return extractJPEGDimensions(buffer);
      } else if (buffer[0] === 0x89 && buffer[1] === 0x50) {
        // PNG
        return extractPNGDimensions(buffer);
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Funciones auxiliares para extraer dimensiones (simplificadas)
function extractJPEGDimensions(buffer) {
  // Implementación básica para JPEG
  for (let i = 0; i < buffer.length - 8; i++) {
    if (buffer[i] === 0xFF && buffer[i + 1] === 0xC0) {
      const height = (buffer[i + 5] << 8) | buffer[i + 6];
      const width = (buffer[i + 7] << 8) | buffer[i + 8];
      return { width, height };
    }
  }
  return null;
}

function extractPNGDimensions(buffer) {
  // PNG dimensions are at bytes 16-23
  if (buffer.length >= 24) {
    const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
    const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
    return { width, height };
  }
  return null;
}

// Función para generar imágenes alternativas de alta calidad
function generateAlternativeUrls(character) {
  const alternatives = [];
  
  // Si tiene datos de Marvel API, generar diferentes tamaños
  if (character.thumbnailPath && character.thumbnailExtension) {
    const sizes = [
      'portrait_fantastic', // 168x252
      'portrait_uncanny',   // 300x450
      'portrait_incredible', // 216x326
      'standard_fantastic', // 250x250
      'landscape_incredible' // 464x261
    ];
    
    const basePath = character.thumbnailPath.replace('http://', 'https://');
    sizes.forEach(size => {
      alternatives.push(`${basePath}/${size}.${character.thumbnailExtension}`);
    });
  }
  
  // URLs alternativas basadas en el nombre del personaje
  const cleanName = character.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  // Marvel.com URLs
  alternatives.push(
    `https://terrigen-cdn-dev.marvel.com/content/prod/1x/${cleanName}.jpg`,
    `https://terrigen-cdn-dev.marvel.com/content/prod/2x/${cleanName}.jpg`
  );
  
  // Marvel Database URLs
  alternatives.push(
    `https://static.wikia.nocookie.net/marveldatabase/images/thumb/${cleanName}.jpg/300px-${cleanName}.jpg`,
    `https://static.wikia.nocookie.net/marveldatabase/images/${cleanName}.jpg`
  );
  
  return alternatives;
}

// Función principal de validación
async function validateAllImages() {
  console.log('🔍 Iniciando validación completa de imágenes...\n');
  
  try {
    const characters = await prisma.character.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    
    console.log(`📊 Validando ${characters.length} personajes...\n`);
    
    let stats = {
      valid: 0,
      invalid: 0,
      fixed: 0,
      placeholders: 0,
      errors: []
    };
    
    // Crear directorio de logs si no existe
    const logsDir = path.join(__dirname, '../logs');
    try {
      await fs.mkdir(logsDir, { recursive: true });
    } catch (e) {}
    
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const progress = `[${i + 1}/${characters.length}]`;
      
      console.log(`${progress} 🎭 ${character.name}`);
      console.log(`  📸 Validando: ${character.image}`);
      
      const validation = await validateImage(character.image);
      
      if (validation.valid) {
        console.log(`  ✅ Imagen válida (${validation.contentType})`);
        if (validation.size) {
          console.log(`     Tamaño: ${(validation.size / 1024).toFixed(1)}KB`);
        }
        stats.valid++;
      } else {
        console.log(`  ❌ Imagen inválida: ${validation.reason}`);
        stats.invalid++;
        
        // Intentar encontrar una alternativa
        console.log(`  🔄 Buscando alternativas...`);
        const alternatives = generateAlternativeUrls(character);
        let foundValid = false;
        
        for (const altUrl of alternatives) {
          console.log(`    🔍 Probando: ${altUrl.substring(0, 60)}...`);
          const altValidation = await validateImage(altUrl);
          
          if (altValidation.valid) {
            console.log(`    ✅ Alternativa válida encontrada!`);
            
            // Actualizar en la base de datos
            await prisma.character.update({
              where: { id: character.id },
              data: { image: altUrl }
            });
            
            stats.fixed++;
            foundValid = true;
            break;
          }
          
          await delay(500); // Rate limiting
        }
        
        if (!foundValid) {
          console.log(`    ⚠️  No se encontraron alternativas válidas`);
          
          // Usar placeholder si no hay alternativas
          const placeholderUrl = '/images/marvel-placeholder.svg';
          await prisma.character.update({
            where: { id: character.id },
            data: { image: placeholderUrl }
          });
          
          stats.placeholders++;
          
          // Guardar error para reporte
          stats.errors.push({
            character: character.name,
            originalUrl: character.image,
            reason: validation.reason,
            category: character.category
          });
        }
      }
      
      // Rate limiting
      await delay(1000);
    }
    
    // Generar reporte detallado
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: characters.length,
        valid: stats.valid,
        invalid: stats.invalid,
        fixed: stats.fixed,
        placeholders: stats.placeholders,
        successRate: ((stats.valid + stats.fixed) / characters.length * 100).toFixed(2) + '%'
      },
      errors: stats.errors,
      recommendations: generateRecommendations(stats)
    };
    
    // Guardar reporte
    await fs.writeFile(
      path.join(logsDir, 'image-validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📈 RESUMEN DE VALIDACIÓN:');
    console.log(`  ✅ Imágenes válidas: ${stats.valid}`);
    console.log(`  🔄 Imágenes reparadas: ${stats.fixed}`);
    console.log(`  ❌ Imágenes inválidas: ${stats.invalid}`);
    console.log(`  ⚠️  Placeholders usados: ${stats.placeholders}`);
    console.log(`  📊 Tasa de éxito: ${report.summary.successRate}`);
    
    console.log('\n🎉 Validación completada! Reporte guardado en /logs/image-validation-report.json');
    
  } catch (error) {
    console.error('❌ Error durante la validación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Generar recomendaciones basadas en los resultados
function generateRecommendations(stats) {
  const recommendations = [];
  
  if (stats.placeholders > 0) {
    recommendations.push({
      type: 'missing-images',
      priority: 'high',
      message: `${stats.placeholders} personajes necesitan imágenes reales. Considere configurar APIs adicionales o buscar imágenes manualmente.`
    });
  }
  
  if (stats.invalid > stats.fixed) {
    recommendations.push({
      type: 'broken-images',
      priority: 'medium',
      message: 'Algunas imágenes no pudieron ser reparadas automáticamente. Revise el reporte de errores.'
    });
  }
  
  if (stats.valid / (stats.valid + stats.invalid) < 0.8) {
    recommendations.push({
      type: 'image-quality',
      priority: 'medium',
      message: 'La calidad general de las imágenes es baja. Considere implementar un CDN o sistema de respaldo.'
    });
  }
  
  return recommendations;
}

// Función para optimizar imágenes existentes
async function optimizeImages() {
  console.log('⚡ Iniciando optimización de imágenes...\n');
  
  const characters = await prisma.character.findMany({
    where: {
      image: {
        not: {
          contains: 'placeholder'
        }
      }
    }
  });
  
  for (const character of characters) {
    console.log(`🔧 Optimizando: ${character.name}`);
    
    // Si es imagen de Marvel, asegurar que use la mejor calidad
    if (character.image.includes('i.annihil.us') && character.thumbnailPath) {
      const optimizedUrl = character.thumbnailPath.replace('http://', 'https://') + 
                          '/portrait_uncanny.' + character.thumbnailExtension;
      
      const validation = await validateImage(optimizedUrl);
      if (validation.valid) {
        await prisma.character.update({
          where: { id: character.id },
          data: { image: optimizedUrl }
        });
        console.log(`  ✅ Optimizada a portrait_uncanny`);
      }
    }
    
    await delay(500);
  }
  
  console.log('⚡ Optimización completada!');
}

// Ejecutar según argumentos de línea de comandos
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--optimize')) {
    optimizeImages();
  } else {
    validateAllImages();
  }
}

module.exports = { 
  validateAllImages, 
  validateImage, 
  optimizeImages,
  generateAlternativeUrls 
};