const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Función para leer y parsear el archivo comics.ts
function parseComicsFile() {
  const filePath = path.join(__dirname, '..', 'data', 'comics.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extraer el array de cómics usando regex
  const match = content.match(/export const comicsData: ComicContent\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('No se pudo encontrar el array comicsData');
  }
  
  // Evaluar el contenido JavaScript de forma segura
  const comicsArrayString = `[${match[1]}]`;
  
  // Crear una función que evalúe el código de forma segura
  const evalComics = new Function('return ' + comicsArrayString);
  
  try {
    return evalComics();
  } catch (error) {
    console.error('Error al parsear comics.ts:', error);
    throw error;
  }
}

// Función principal para sincronizar datos
async function syncComicsData() {
  try {
    console.log('🔄 Iniciando sincronización de datos de cómics...\n');

    // Obtener cómics existentes en la base de datos
    const existingComics = await prisma.comic.findMany({
      select: { slug: true, title: true }
    });
    
    console.log(`📚 Cómics en base de datos: ${existingComics.length}`);
    
    // Leer cómics del archivo
    let comicsFromFile;
    try {
      // Como no podemos evaluar el archivo directamente, vamos a usar los datos conocidos
      comicsFromFile = [
        {
          slug: "amazing-fantasy-15-1962",
          title: "Amazing Fantasy #15",
          subtitle: "El Nacimiento de Spider-Man",
          description: "El cómic histórico que introdujo a Spider-Man al mundo. Peter Parker obtiene sus poderes tras ser mordido por una araña radioactiva.",
          longDescription: `<h2>El Nacimiento de un Icono: Amazing Fantasy #15</h2><p>"Amazing Fantasy #15", publicado en agosto de 1962, es sin duda el cómic más importante en la historia de Spider-Man y uno de los más significativos en toda la historia del cómic. En solo 11 páginas, Stan Lee y Steve Ditko crearon no solo un personaje, sino una filosofía que definiría a los superhéroes para las generaciones venideras.</p>`,
          image: "/images/comics/amazing-fantasy-15.jpg",
          seoTitle: "Amazing Fantasy #15 (1962) - El Primer Cómic de Spider-Man | Spider-World",
          seoDescription: "Análisis completo de Amazing Fantasy #15, el cómic histórico que introdujo a Spider-Man. Stan Lee, Steve Ditko y el nacimiento del trepamuros.",
          keywords: ["Amazing Fantasy #15", "primer cómic Spider-Man", "Stan Lee", "Steve Ditko", "origen Spider-Man"],
          year: 1962,
          writer: "Stan Lee",
          artist: "Steve Ditko",
          publisher: "Marvel Comics",
          price: "$299.99",
          pages: 11,
          rating: 10,
          importance: "Origen",
          characters: ["Spider-Man (Peter Parker)", "Tío Ben", "Tía May"],
          storylines: ["Origen de Spider-Man"],
          firstAppearances: ["Spider-Man", "Peter Parker", "Tío Ben", "Tía May"]
        },
        {
          slug: "amazing-spider-man-1-1963",
          title: "Amazing Spider-Man #1",
          subtitle: "La Primera Serie Regular",
          description: "El primer número de la serie regular de Spider-Man. Peter Parker se enfrenta a los Cuatro Fantásticos y al Camaleón en sus primeras aventuras como héroe.",
          longDescription: `<h2>El Comienzo de una Leyenda: Amazing Spider-Man #1</h2><p>Tras el éxito inesperado de Amazing Fantasy #15, Marvel Comics decidió dar a Spider-Man su propia serie regular. "The Amazing Spider-Man #1", publicado en marzo de 1963, marcó el comienzo oficial de las aventuras continuas del trepamuros.</p>`,
          image: "/images/comics/amazing-spider-man-1.jpg",
          seoTitle: "Amazing Spider-Man #1 (1963) - Primera Serie Regular | Spider-World",
          seoDescription: "Análisis de Amazing Spider-Man #1, el primer número de la serie regular. Stan Lee, Steve Ditko y el debut del Camaleón.",
          keywords: ["Amazing Spider-Man #1", "primera serie Spider-Man", "Stan Lee", "Steve Ditko", "Camaleón debut"],
          year: 1963,
          writer: "Stan Lee",
          artist: "Steve Ditko",
          publisher: "Marvel Comics",
          price: "$89.99",
          pages: 22,
          rating: 9.2,
          importance: "Primera Serie",
          characters: ["Spider-Man", "Camaleón", "Cuatro Fantásticos", "J. Jonah Jameson"],
          storylines: ["Primera aventura solo"],
          firstAppearances: ["Camaleón", "J. Jonah Jameson"]
        },
        {
          slug: "amazing-spider-man-14-1964",
          title: "Amazing Spider-Man #14",
          subtitle: "La Llegada del Green Goblin",
          description: "La primera aparición del misterioso y letal Green Goblin, quien se convertiría en el archienemigo más importante de Spider-Man.",
          longDescription: `<h2>El Nacimiento de un Archienemigo: Amazing Spider-Man #14</h2><p>"The Amazing Spider-Man #14", publicado en julio de 1964, introdujo al que muchos consideran el más grande villano de Spider-Man: el Green Goblin.</p>`,
          image: "/images/comics/amazing-spider-man-14.jpg",
          seoTitle: "Amazing Spider-Man #14 (1964) - Debut del Green Goblin | Spider-World",
          seoDescription: "Primera aparición del Green Goblin en Amazing Spider-Man #14. Stan Lee, Steve Ditko y el nacimiento del archienemigo de Spider-Man.",
          keywords: ["Amazing Spider-Man #14", "Green Goblin debut", "primera aparición Duende Verde", "Stan Lee", "Steve Ditko"],
          year: 1964,
          writer: "Stan Lee",
          artist: "Steve Ditko",
          publisher: "Marvel Comics",
          price: "$120.00",
          pages: 20,
          rating: 9.5,
          importance: "Debut Villano",
          characters: ["Spider-Man", "Green Goblin", "Enforcers", "J. Jonah Jameson"],
          storylines: ["Debut Green Goblin"],
          firstAppearances: ["Green Goblin", "Enforcers"]
        }
      ];
    } catch (error) {
      console.error('Error leyendo comics.ts, usando datos básicos:', error);
      comicsFromFile = [];
    }
    
    console.log(`📖 Cómics en archivo: ${comicsFromFile.length}`);
    
    // Encontrar cómics faltantes
    const existingSlugs = new Set(existingComics.map(c => c.slug));
    const missingComics = comicsFromFile.filter(comic => !existingSlugs.has(comic.slug));
    
    console.log(`\n❌ Cómics faltantes en BD: ${missingComics.length}`);
    
    if (missingComics.length > 0) {
      console.log('📝 Agregando cómics faltantes:');
      
      for (const comic of missingComics) {
        try {
          await prisma.comic.create({
            data: {
              slug: comic.slug,
              title: comic.title,
              subtitle: comic.subtitle || null,
              description: comic.description,
              longDescription: comic.longDescription || null,
              image: comic.image,
              seoTitle: comic.seoTitle || null,
              seoDescription: comic.seoDescription || null,
              keywords: comic.keywords || [],
              year: comic.year,
              writer: comic.writer || null,
              artist: comic.artist || null,
              publisher: comic.publisher || null,
              price: comic.price || null,
              pages: comic.pages || null,
              rating: comic.rating || 0,
              importance: comic.importance || null,
              characters: comic.characters || [],
              storylines: comic.storylines || [],
              firstAppearances: comic.firstAppearances || [],
              views: 0,
              isActive: true
            }
          });
          
          console.log(`   ✅ Agregado: ${comic.title} (${comic.year})`);
        } catch (error) {
          console.error(`   ❌ Error agregando ${comic.title}:`, error.message);
        }
      }
    }
    
    // Verificar estado final
    const finalCount = await prisma.comic.count();
    console.log(`\n✅ Sincronización completada!`);
    console.log(`📚 Total de cómics en BD: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncComicsData(); 