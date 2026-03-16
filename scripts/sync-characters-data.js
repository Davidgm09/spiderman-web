const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeo de categorías
const CHARACTER_CATEGORIES = {
  'spider-verse': [
    'Spider-Man',
    'Spider-Gwen', 
    'Miles Morales',
    'Spider-Woman',
    'Spider-Man 2099',
    'Silk',
    'Scarlet Spider',
    'Spider-Girl',
    'Spider-Man (Ben Reilly)',
    'Spider-Man (Ultimate)',
    'Spider-Man (Noir)',
    'Spider-Woman (Julia Carpenter)',
    'Spider-Woman (Mattie Franklin)',
    'Spider-Girl (Anya Corazon)',
    'Spider-Man (1602)',
    'Spider-Man (Kaine)',
    'Arachne'
  ],
  'spider-villains': [
    'Green Goblin',
    'Doctor Octopus',
    'Venom',
    'Carnage',
    'Sandman',
    'Electro',
    'Rhino',
    'Lizard',
    'Mysterio',
    'Vulture',
    'Kraven the Hunter',
    'Black Cat',
    'Kingpin',
    'Hobgoblin',
    'Scorpion'
  ],
  'marvel-universe': [
    'Iron Man',
    'Captain America',
    'Thor',
    'Hulk',
    'Black Widow',
    'Hawkeye',
    'Daredevil',
    'Punisher',
    'Deadpool',
    'Wolverine',
    'Doctor Strange',
    'Black Panther',
    'Captain Marvel',
    'Ant-Man',
    'Wasp'
  ]
};

// Función para generar slug único
function generateSlug(name) {
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return baseSlug;
}

// Función para obtener imagen de alta calidad
function getHighQualityImage(thumbnail) {
  if (!thumbnail || !thumbnail.path || thumbnail.path.includes('image_not_available')) {
    return '/images/marvel-placeholder.svg';
  }
  
  return `${thumbnail.path.replace('http://', 'https://')}/detail.${thumbnail.extension}`;
}

// Función para sincronizar personajes de una categoría
async function syncCategoryCharacters(category, characters) {
  console.log(`\n🔄 Sincronizando ${characters.length} personajes de la categoría: ${category}`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const character of characters) {
    try {
      // Verificar si ya existe
      const existingCharacter = await prisma.character.findUnique({
        where: { marvelId: character.id }
      });

      const slug = generateSlug(character.name);
      
      // Preparar datos del personaje
      const characterData = {
        marvelId: character.id,
        name: character.name,
        description: character.description || `Descubre todo sobre ${character.name}, uno de los personajes más fascinantes del universo Marvel y Spider-Man.`,
        longDescription: character.description ? 
          `${character.description}\n\nConoce más sobre ${character.name}, sus poderes únicos, historia fascinante y todas sus apariciones en el universo Marvel. Desde sus primeras apariciones en los cómics hasta sus adaptaciones en películas y series.` :
          `${character.name} es uno de los personajes más importantes del universo ${category === 'spider-verse' ? 'Spider-Verse' : 'Marvel'}. Descubre su historia completa, poderes, habilidades y todas sus apariciones en cómics, películas y series. Una guía completa para fans y nuevos lectores.`,
        image: getHighQualityImage(character.thumbnail),
        thumbnailPath: character.thumbnail?.path,
        thumbnailExtension: character.thumbnail?.extension,
        powers: getPowersFromDescription(character.description, character.name),
        abilities: getAbilitiesFromDescription(character.description, character.name),
        affiliation: getAffiliationFromCategory(category, character.name),
        creators: ['Marvel Comics'], // Información básica
        universe: 'Marvel-616', // Por defecto
        category: category,
        rating: generateRating(character.name, category),
        comicsCount: character.comics?.available || 0,
        seriesCount: character.series?.available || 0,
        slug: slug,
        seoTitle: `${character.name} - Personaje ${category === 'spider-verse' ? 'Spider-Verse' : 'Marvel'} | Spider-World`,
        seoDescription: character.description ? 
          character.description.substring(0, 155) + '...' :
          `Descubre todo sobre ${character.name}: poderes, historia, cómics y apariciones. Guía completa del universo ${category === 'spider-verse' ? 'Spider-Verse' : 'Marvel'}.`,
        keywords: [
          character.name, 
          'Marvel', 
          category === 'spider-verse' ? 'Spider-Man' : 'superhéroe',
          category === 'spider-verse' ? 'Spider-Verse' : 'Marvel Comics',
          'cómics', 
          'superhéroe',
          'personaje'
        ],
        urls: character.urls || null,
        isFeatured: isFeaturedCharacter(character.name),
        isActive: true
      };

      if (existingCharacter) {
        // Actualizar personaje existente
        await prisma.character.update({
          where: { marvelId: character.id },
          data: characterData
        });
        console.log(`  ✅ Actualizado: ${character.name}`);
      } else {
        // Crear nuevo personaje
        await prisma.character.create({
          data: characterData
        });
        console.log(`  🆕 Creado: ${character.name}`);
      }
      
      successCount++;
      
      // Pequeña pausa para no sobrecargar la base de datos
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`  ❌ Error con ${character.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`📊 Categoría ${category}: ${successCount} exitosos, ${errorCount} errores`);
  return { successCount, errorCount };
}

// Función para obtener poderes basándose en la descripción
function getPowersFromDescription(description, name) {
  const powers = [];
  
  if (!description) return getDefaultPowers(name);
  
  const desc = description.toLowerCase();
  
  // Poderes comunes de Spider-Man
  if (desc.includes('spider') || desc.includes('web') || name.toLowerCase().includes('spider')) {
    powers.push('Proporcional fuerza de araña', 'Sentido arácnido', 'Agilidad sobrehumana', 'Adhesión a superficies');
    if (desc.includes('web')) powers.push('Lanzatelarañas');
  }
  
  // Otros poderes comunes
  if (desc.includes('super strength') || desc.includes('strength')) powers.push('Superfuerza');
  if (desc.includes('flight') || desc.includes('fly')) powers.push('Vuelo');
  if (desc.includes('speed')) powers.push('Supervelocidad');
  if (desc.includes('telepat')) powers.push('Telepatía');
  if (desc.includes('invisible')) powers.push('Invisibilidad');
  if (desc.includes('regenerat') || desc.includes('healing')) powers.push('Factor de curación');
  
  return powers.length > 0 ? powers : getDefaultPowers(name);
}

// Función para obtener habilidades
function getAbilitiesFromDescription(description, name) {
  const abilities = [];
  
  if (name.toLowerCase().includes('spider')) {
    abilities.push('Combate acrobático', 'Estrategia de combate', 'Ciencia', 'Inventiva');
  }
  
  if (name.toLowerCase().includes('iron')) {
    abilities.push('Genio tecnológico', 'Ingeniería avanzada', 'Estrategia empresarial');
  }
  
  if (name.toLowerCase().includes('captain')) {
    abilities.push('Liderazgo', 'Estrategia militar', 'Combate cuerpo a cuerpo');
  }
  
  return abilities.length > 0 ? abilities : ['Combate', 'Estrategia', 'Heroísmo'];
}

// Función para obtener afiliación
function getAffiliationFromCategory(category, name) {
  const affiliations = [];
  
  if (category === 'spider-verse') {
    affiliations.push('Spider-Verse');
    if (name.toLowerCase().includes('spider-man') || name === 'Spider-Man') {
      affiliations.push('Avengers', 'Fantastic Four');
    }
  } else if (category === 'marvel-universe') {
    affiliations.push('Avengers');
    if (name.includes('X-Men') || name.includes('Wolverine')) {
      affiliations.push('X-Men');
    }
  } else if (category === 'spider-villains') {
    affiliations.push('Sinister Six');
  }
  
  return affiliations;
}

// Función para generar rating realista
function generateRating(name, category) {
  // Personajes principales tienen mejor rating
  const mainCharacters = ['Spider-Man', 'Iron Man', 'Captain America', 'Thor'];
  const popularCharacters = ['Spider-Gwen', 'Miles Morales', 'Venom', 'Deadpool'];
  
  if (mainCharacters.includes(name)) {
    return 4.5 + Math.random() * 0.5; // 4.5-5.0
  } else if (popularCharacters.includes(name)) {
    return 4.0 + Math.random() * 0.5; // 4.0-4.5
  } else {
    return 3.5 + Math.random() * 1.0; // 3.5-4.5
  }
}

// Función para determinar si es personaje destacado
function isFeaturedCharacter(name) {
  const featured = [
    'Spider-Man', 'Spider-Gwen', 'Miles Morales', 'Spider-Woman', 'Spider-Man 2099',
    'Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow',
    'Green Goblin', 'Doctor Octopus', 'Venom', 'Carnage'
  ];
  
  return featured.includes(name);
}

// Función para poderes por defecto
function getDefaultPowers(name) {
  if (name.toLowerCase().includes('spider')) {
    return ['Proporcional fuerza de araña', 'Sentido arácnido', 'Agilidad sobrehumana', 'Adhesión a superficies'];
  }
  return ['Habilidades sobrehumanas'];
}

// Función para obtener datos mock de personajes
async function getMockCharacterData() {
  return [
    // Spider-Verse Characters
    {
      id: 1009610,
      name: "Spider-Man",
      description: "Peter Parker was bitten by a radioactive spider as a teenager, granting him spider-like powers. After the death of his Uncle Ben, Peter learned that with great power, there must also come great responsibility, and he became the Amazing Spider-Man.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
        extension: "jpg"
      },
      comics: { available: 4000 },
      series: { available: 150 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009610/spider-man" }]
    },
    {
      id: 1016181,
      name: "Spider-Gwen",
      description: "Gwen Stacy from Earth-65, where she was bitten by a radioactive spider instead of Peter Parker. She balances being a superhero with her career as a drummer in the band The Mary Janes.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5480465f8c2b5",
        extension: "jpg"
      },
      comics: { available: 50 },
      series: { available: 10 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/spider-gwen" }]
    },
    {
      id: 1016182,
      name: "Miles Morales",
      description: "Miles Morales is a teenager from Brooklyn who was bitten by a spider and gained spider-like powers similar to Spider-Man. He has additional abilities like invisibility and bio-electric venom blasts.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/f/50/537bcfa1eed73",
        extension: "jpg"
      },
      comics: { available: 200 },
      series: { available: 20 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/miles-morales" }]
    },
    {
      id: 1009608,
      name: "Spider-Woman",
      description: "Jessica Drew, the original Spider-Woman with unique spider-powers including pheromone abilities, flight, and bio-electric blasts. She's been both an agent of HYDRA and S.H.I.E.L.D.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
        extension: "jpg"
      },
      comics: { available: 300 },
      series: { available: 25 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman" }]
    },
    {
      id: 1011347,
      name: "Spider-Man 2099",
      description: "Miguel O'Hara, the Spider-Man of the year 2099 with enhanced spider abilities, talons, and fangs. He leads the Spider-Society and protects the multiverse from threats.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/4/60/52696929dc721",
        extension: "jpg"
      },
      comics: { available: 150 },
      series: { available: 15 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-2099" }]
    },
    {
      id: 1017603,
      name: "Silk",
      description: "Cindy Moon was bitten by the same spider that gave Peter Parker his powers. She has organic webbing abilities and an enhanced 'silk sense' that's even stronger than Spider-Man's spider-sense.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/9/90/5480462f5aec6",
        extension: "jpg"
      },
      comics: { available: 80 },
      series: { available: 8 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/silk" }]
    },
    // Villanos
    {
      id: 1014985,
      name: "Green Goblin",
      description: "Norman Osborn, the original Green Goblin and one of Spider-Man's greatest enemies. Enhanced by the Goblin formula, he possesses superhuman strength and a twisted intellect.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/5/e0/528d31dd2b2d3",
        extension: "jpg"
      },
      comics: { available: 200 },
      series: { available: 30 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/green-goblin" }]
    },
    {
      id: 1009263,
      name: "Doctor Octopus",
      description: "Dr. Otto Octavius, a brilliant scientist who gained four mechanical arms fused to his spine after a laboratory accident. He's one of Spider-Man's most dangerous and recurring enemies.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/6/00/5261586a8c9a3",
        extension: "jpg"
      },
      comics: { available: 180 },
      series: { available: 25 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/doctor-octopus" }]
    },
    {
      id: 1010788,
      name: "Venom",
      description: "The symbiotic alien costume that bonded with Eddie Brock, creating one of Spider-Man's most formidable foes. Venom possesses all of Spider-Man's powers without triggering his spider-sense.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/5269608c1be7a",
        extension: "jpg"
      },
      comics: { available: 250 },
      series: { available: 20 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/venom" }]
    },
    // Marvel Universe
    {
      id: 1009368,
      name: "Iron Man",
      description: "Tony Stark, genius billionaire inventor who built a powered suit of armor to escape captivity and became the armored superhero Iron Man. Leader of the Avengers.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55",
        extension: "jpg"
      },
      comics: { available: 2000 },
      series: { available: 80 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/iron-man" }]
    },
    {
      id: 1009220,
      name: "Captain America",
      description: "Steve Rogers, the first Avenger. Enhanced to the peak of human perfection by an experimental serum, he fought for his country in World War II and leads the Avengers today.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087",
        extension: "jpg"
      },
      comics: { available: 1800 },
      series: { available: 70 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/captain-america" }]
    },
    {
      id: 1009664,
      name: "Thor",
      description: "The Asgardian God of Thunder, wielder of the mystical hammer Mjolnir. Thor is one of the founding members of the Avengers and protector of both Earth and Asgard.",
      thumbnail: {
        path: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350",
        extension: "jpg"
      },
      comics: { available: 1500 },
      series: { available: 60 },
      urls: [{ type: "detail", url: "http://marvel.com/characters/thor" }]
    }
  ];
}

// Función principal
async function syncAllCharacters() {
  console.log('🚀 Iniciando sincronización de personajes Marvel...\n');
  
  const totalStats = {
    totalSuccess: 0,
    totalErrors: 0
  };

  try {
    console.log('📡 Sincronizando personajes desde datos mock...');
    
    // Usar datos mock directamente en lugar de Marvel API por simplicidad
    const mockCharacters = await getMockCharacterData();
    
    const spiderVerseChars = mockCharacters.filter(c => 
      CHARACTER_CATEGORIES['spider-verse'].some(name => 
        c.name.toLowerCase().includes(name.toLowerCase().split(' ')[0].toLowerCase())
      )
    );
    
    const spiderVillainsChars = mockCharacters.filter(c => 
      CHARACTER_CATEGORIES['spider-villains'].some(name => 
        c.name.toLowerCase().includes(name.toLowerCase().split(' ')[0].toLowerCase())
      )
    );
    
    const marvelUniverseChars = mockCharacters.filter(c => 
      CHARACTER_CATEGORIES['marvel-universe'].some(name => 
        c.name.toLowerCase().includes(name.toLowerCase().split(' ')[0].toLowerCase())
      )
    );

    console.log(`📊 Personajes obtenidos:`);
    console.log(`  - Spider-Verse: ${spiderVerseChars.length}`);
    console.log(`  - Spider Villains: ${spiderVillainsChars.length}`);
    console.log(`  - Marvel Universe: ${marvelUniverseChars.length}`);

    // Sincronizar cada categoría
    if (spiderVerseChars.length > 0) {
      const stats = await syncCategoryCharacters('spider-verse', spiderVerseChars);
      totalStats.totalSuccess += stats.successCount;
      totalStats.totalErrors += stats.errorCount;
    }

    if (spiderVillainsChars.length > 0) {
      const stats = await syncCategoryCharacters('spider-villains', spiderVillainsChars);
      totalStats.totalSuccess += stats.successCount;
      totalStats.totalErrors += stats.errorCount;
    }

    if (marvelUniverseChars.length > 0) {
      const stats = await syncCategoryCharacters('marvel-universe', marvelUniverseChars);
      totalStats.totalSuccess += stats.successCount;
      totalStats.totalErrors += stats.errorCount;
    }

    // Mostrar estadísticas finales
    console.log(`\n🎉 Sincronización completada!`);
    console.log(`📈 Total sincronizados: ${totalStats.totalSuccess}`);
    console.log(`❌ Total errores: ${totalStats.totalErrors}`);

    // Mostrar estadísticas de la base de datos
    const dbStats = await prisma.character.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    console.log(`\n📋 Estadísticas finales de la base de datos:`);
    dbStats.forEach(stat => {
      console.log(`  - ${stat.category}: ${stat._count.id} personajes`);
    });

  } catch (error) {
    console.error('💥 Error durante la sincronización:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  syncAllCharacters()
    .then(() => {
      console.log('\n✅ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { syncAllCharacters, syncCategoryCharacters };