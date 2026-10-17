/**
 * Corrige los datos de videojuegos importados de RAWG:
 * - Desarrolladoras y distribuidoras mal asignadas (Wikipedia: Spider-Man 2000 → Neversoft; Web of Shadows → Shaba Games).
 * - Sinopsis: RAWG daba traducciones automáticas rotas («Doo Dok», «la olp», frases partidas) y descripciones
 *   largas en inglés. Aquí van sinopsis propias, revisadas a mano, que sustituyen a description y longDescription.
 *
 * Uso: node scripts/fix-videojuegos-2026.js (volver a ejecutar tras populate-games-from-rawg.js)
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const FIXES = {
  'spider-man-2000-2000': { developer: 'Neversoft', publisher: 'Activision' },
  'ultimate-spider-man-2005': { developer: 'Treyarch', publisher: 'Activision' },
  'spider-man-web-of-shadows-2008': { developer: 'Shaba Games', publisher: 'Activision' },
};

// Sinopsis propias (2-4 frases): lo que es el juego y por qué destaca
const SINOPSIS = {
  'the-amazing-spider-man-vs-the-kingpin-1990':
    'Juego de plataformas de Sega para Mega Drive, Master System, Game Gear y Mega-CD. Kingpin ha incriminado a Spider-Man y ha escondido una bomba en Nueva York, y el héroe tiene que conseguir las llaves que la desactivan enfrentándose a villanos clásicos como el Doctor Octopus, el Lagarto, Mysterio o Venom. Es uno de los primeros grandes juegos del personaje en consolas de 16 bits.',
  'spider-man-and-venom-maximum-carnage-1994':
    'Beat \'em up para Super Nintendo y Mega Drive basado en la saga de cómics Maximum Carnage (1993). Spider-Man y Venom, aliados por necesidad, se abren paso por las calles de Nueva York contra Carnage y su «familia» de villanos, con escenas narradas con viñetas de cómic y la ayuda puntual de héroes como el Capitán América o la Gata Negra. En Super Nintendo se recuerda también por su cartucho rojo.',
  'spider-man-2000-2000':
    'El juego que demostró que Spider-Man funcionaba en 3D. Neversoft, el estudio de Tony Hawk\'s Pro Skater, creó una aventura por niveles en la que Spider-Man tiene que limpiar su nombre tras ser acusado de un robo, enfrentándose a una larga lista de villanos, del Doctor Octopus a Venom y Carnage. Stan Lee hace de narrador, y sus trajes desbloqueables y trucos lo convirtieron en un clásico de la primera PlayStation.',
  'spider-man-mysterio-s-menace-2001':
    'Juego de acción y plataformas para Game Boy Advance, desarrollado por Vicarious Visions. Mysterio prepara un gran golpe en Nueva York y Spider-Man tiene que detenerlo, enfrentándose por el camino a otros villanos clásicos en niveles de desarrollo lateral. Fue uno de los juegos de Spider-Man más completos de la portátil de Nintendo.',
  'spider-man-2-enter-electro-2001':
    'Secuela directa del Spider-Man de 2000 para PlayStation, desarrollada por Vicarious Visions. Spider-Man intenta impedir que Electro se haga con un artefacto llamado Bio-Nexus, que multiplicaría su poder, y por el camino se enfrenta a Shocker, Cabeza de Martillo, el Lagarto y el Hombre de Arena. Su nivel final se modificó tras los atentados del 11 de septiembre de 2001.',
  'spider-man-2-the-game-2004':
    'El juego de la película Spider-Man 2 (2004). Dos años después de convertirse en Spider-Man, Peter Parker se enfrenta al Doctor Octopus mientras recorre una Manhattan entera en mundo abierto. Su balanceo con física real, en el que cada telaraña se engancha a un edificio, sigue siendo uno de los más recordados de la historia del personaje. También aparecen Mysterio y la Gata Negra.',
  'ultimate-spider-man-2005':
    'Adaptación del universo Ultimate, con una historia escrita por Brian Michael Bendis, el guionista del cómic. Peter Parker se reencuentra con Eddie Brock, convertido en Venom, y el juego permite controlar a los dos: a Spider-Man, ágil y acrobático, y a Venom, que lo destroza todo. Su aspecto de cómic, con viñetas en pantalla y animación con estilo de dibujo, sigue siendo de lo más llamativo de la saga.',
  'spider-man-web-of-shadows-2008':
    'Una invasión de simbiontes convierte Nueva York en una zona de guerra, y Spider-Man puede cambiar en cualquier momento entre el traje rojo, ágil, y el traje negro, mucho más brutal. Sus decisiones a lo largo de la historia, y los aliados que elige, como Lobezno, Luke Cage o la Gata Negra, cambian cómo le trata la ciudad y qué final ve. Es el juego de Spider-Man más oscuro de su época, y hoy tiene muchos fans.',
  'spider-man-shattered-dimensions-2010':
    'Una tabla mística se rompe en pedazos que caen en cuatro universos distintos, y cuatro Spider-Man tienen que recuperarlos: el clásico, Spider-Man Noir, Spider-Man 2099 y el Spider-Man Ultimate. Cada uno tiene su propio estilo visual y su forma de jugar, desde la acción del clásico al sigilo de Noir. Se adelantó años a la idea del Spider-Verso, y la historia la narra Stan Lee.',
  'marvel-s-spider-man-2018':
    'Un Peter Parker de 23 años, con ocho años de experiencia como Spider-Man, trabaja como ayudante del científico Otto Octavius mientras protege Nueva York. Tras la detención de Kingpin, la banda de Mister Negativo se hace con las calles, y la historia va sumando villanos clásicos hasta un final que no se olvida. El balanceo, el combate y la Nueva York de Insomniac lo convirtieron en uno de los grandes juegos de superhéroes.',
  'marvel-s-spider-man-the-city-that-never-sleeps-2018':
    'Contenido descargable de Marvel\'s Spider-Man formado por tres capítulos: The Heist, Turf Wars y Silver Lining. Transcurre después del juego principal, cuando las familias criminales de la Maggia luchan por ocupar el vacío que ha dejado Kingpin, con Cabeza de Martillo como gran amenaza. Por el camino, Spider-Man se cruza con la Gata Negra y con Silver Sable.',
  'marvel-s-spider-man-the-heist-2018':
    'Primer capítulo de The City That Never Sleeps. Tras el juego principal, las familias de la Maggia se disputan el control de Nueva York, y Spider-Man vuelve a cruzarse con la Gata Negra, que roba algo escondido en un cuadro de un museo. Es el capítulo más interesante del DLC, gracias a la relación entre Peter y Felicia.',
  'marvel-s-spider-man-silver-lining-2018':
    'Tercer y último capítulo de The City That Never Sleeps. Cabeza de Martillo se ha hecho con el armamento de Sable International y es más peligroso que nunca, así que Spider-Man tiene que aliarse con Silver Sable, aunque no comparte sus métodos. Cierra la historia del DLC y deja preparada la siguiente aventura.',
  'marvel-s-spider-man-remastered-2020':
    'Versión remasterizada de Marvel\'s Spider-Man (2018) para PS5, que después llegó también a PC. Mejora los gráficos, añade trazado de rayos y tiempos de carga casi instantáneos, e incluye los tres capítulos de The City That Never Sleeps. Es la mejor forma de jugar hoy a la primera aventura de Insomniac.',
  'marvel-s-spider-man-miles-morales-2020':
    'Un año después de Marvel\'s Spider-Man, Miles Morales se queda como único Spider-Man de Nueva York en plena Navidad. En su nuevo barrio, Harlem, tiene que enfrentarse a la corporación Roxxon y a la banda del misterioso Tinkerer, mientras descubre sus propios poderes: las descargas bioeléctricas y el camuflaje. Más corto que el juego de Peter, pero redondo y muy emotivo.',
  'marvel-s-spider-man-2-2023':
    'Peter Parker y Miles Morales comparten protagonismo en la secuela de Insomniac para PS5. Kraven el Cazador convierte Nueva York en su coto de caza, y el simbionte de Venom amenaza a los dos Spider-Man. El mapa añade Queens y Brooklyn, las alas de telaraña permiten planear por la ciudad y el traje negro da a Peter unos poderes mucho más brutales.',
  'marvel-s-spider-man-2-pc-port-2025':
    'Versión para PC de Marvel\'s Spider-Man 2, publicada el 30 de enero de 2025. Peter Parker y Miles Morales se enfrentan a Kraven el Cazador y a Venom en una Nueva York más grande que nunca, con Queens y Brooklyn, y con las mejoras gráficas propias de PC. Llegó con algunos problemas técnicos que se fueron corrigiendo con parches.',
};

(async () => {
  for (const [slug, data] of Object.entries(FIXES)) {
    await prisma.game.update({ where: { slug }, data });
    console.log('ok créditos', slug, '→', data.developer);
  }
  const missing = [];
  for (const [slug, text] of Object.entries(SINOPSIS)) {
    const game = await prisma.game.findUnique({ where: { slug }, select: { id: true } });
    if (!game) { missing.push(slug); continue; }
    await prisma.game.update({ where: { slug }, data: { description: text, longDescription: text } });
  }
  const active = await prisma.game.findMany({ where: { isActive: true }, select: { slug: true } });
  const sinSinopsis = active.map((g) => g.slug).filter((s) => !SINOPSIS[s]);
  console.log(`ok sinopsis: ${Object.keys(SINOPSIS).length - missing.length}`);
  if (missing.length) console.warn('No existen:', missing.join(', '));
  if (sinSinopsis.length) console.warn('Juegos activos sin sinopsis revisada:', sinSinopsis.join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
