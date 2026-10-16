/**
 * Corrige la tienda tras revisar los 50 productos en Amazon.es (16/10/2026):
 *  - fichas cuyo ASIN llevaba a otro producto,
 *  - productos agotados sustituidos por el mismo artículo (u otro equivalente) disponible,
 *  - datos de ficha que no coincidían con el producto real.
 * Busca cada producto por su slug antiguo o por el nuevo, así que se puede ejecutar varias veces.
 * Volver a ejecutar tras `populate-tienda-products.js --clean`.
 *
 * Uso: node scripts/fix-tienda-productos-2026.js
 */

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const img = (id, ext = 'jpg') => `https://m.media-amazon.com/images/I/${id}._AC_SL500_.${ext}`;

// Clave: slug antiguo. `slug` solo cuando cambia.
const FIXES = {
  // ── ASIN que llevaba a otro producto ─────────────────────────────────────────
  'hasbro-marvel-legends-spider-man-integrated-suit-15cm': {
    slug: 'hasbro-marvel-legends-duende-verde-deluxe-no-way-home',
    asin: 'B0G3T46ZPJ',
    title: 'Marvel Legends Series Duende Verde Deluxe - Spider-Man: No Way Home (15 cm)',
    description:
      'Figura deluxe de la línea Marvel Legends del Duende Verde de Willem Dafoe en Spider-Man: No Way Home, a escala de 15 cm y con la armadura original del personaje.',
    features: ['Línea Marvel Legends Series de Hasbro', 'Escala de 15 cm', 'Duende Verde de Spider-Man: No Way Home', 'Formato deluxe con armadura original', 'Para coleccionistas'],
    image: img('61dD5O+tvuL'),
    seoTitle: 'Marvel Legends Duende Verde Deluxe No Way Home | Amazon.es',
    seoDescription: 'Figura Marvel Legends deluxe del Duende Verde de Spider-Man: No Way Home, escala 15 cm, con su armadura original.',
    keywords: ['marvel legends duende verde', 'no way home', 'green goblin', 'figura 15 cm', 'willem dafoe'],
  },
  'marvel-spider-man-camiseta-manga-larga-nino': {
    asin: 'B07TWLWJQ8',
    title: 'Marvel Camiseta de Manga Larga Spider-Man para Niño',
    description: 'Camiseta infantil de manga larga con licencia oficial de Marvel y estampado de Spider-Man. Disponible en varias tallas.',
    features: ['Licencia oficial Marvel', 'Manga larga', 'Estampado de Spider-Man', 'Varias tallas infantiles'],
    image: img('91GXo8cGx-L'),
    seoTitle: 'Camiseta Manga Larga Spider-Man Niño Marvel | Amazon.es',
    seoDescription: 'Camiseta de manga larga para niño con licencia oficial de Marvel y estampado de Spider-Man, en varias tallas.',
    keywords: ['camiseta spider-man niño', 'manga larga', 'ropa marvel niño'],
  },
  'el-superior-spider-man-1-gran-cerebro-dan-slott-panini': {
    slug: 'el-asombroso-spiderman-39-superior-mi-peor-enemigo',
    title: 'El Asombroso Spiderman 39: Spiderman Superior. Mi peor enemigo (Marvel Saga)',
    description:
      'El doctor Octopus ocupa el cuerpo de Peter Parker y decide ser un Spider-Man «superior». Primer tomo de la etapa de Dan Slott en Superior Spider-Man, dentro de la colección Marvel Saga de Panini.',
    features: ['Colección Marvel Saga de Panini', 'Guion de Dan Slott', 'Inicio de la etapa Superior Spider-Man', 'Edición en español'],
    seoTitle: 'Spiderman Superior: Mi peor enemigo (Marvel Saga 39) | Amazon.es',
    seoDescription: 'Marvel Saga El Asombroso Spiderman 39: el inicio de Superior Spider-Man de Dan Slott, con Otto Octavius en el cuerpo de Peter Parker.',
    keywords: ['superior spider-man', 'marvel saga', 'dan slott', 'doctor octopus', 'panini'],
  },
  'el-asombroso-spiderman-2-voces-del-pasado-marvel-saga': {
    slug: 'el-asombroso-spiderman-2-hasta-que-las-estrellas-se-congelen',
    asin: '8490945314',
    title: 'El Asombroso Spiderman 2: Hasta que las estrellas se congelen (Marvel Saga)',
    description:
      'Segundo tomo de la etapa de J. Michael Straczynski y John Romita Jr. en la colección Marvel Saga de Panini, continuación directa de «Vuelta a casa».',
    features: ['Colección Marvel Saga de Panini', 'Guion de J. Michael Straczynski', 'Dibujo de John Romita Jr.', 'Continúa «Vuelta a casa»', 'Edición en español'],
    image: img('61dlqf0aHEL').replace('_AC_SL500_', '_SL500_'),
    seoTitle: 'El Asombroso Spiderman 2: Hasta que las estrellas se congelen | Amazon.es',
    seoDescription: 'Marvel Saga El Asombroso Spiderman 2, la etapa de Straczynski y Romita Jr. que sigue a Vuelta a casa.',
    keywords: ['marvel saga spiderman', 'straczynski', 'romita jr', 'panini', 'el asombroso spiderman'],
  },

  // ── Agotados: mismo producto u otro equivalente disponible ───────────────────
  'spiderman-azul-jeph-loeb-tim-sale-panini': {
    asin: '8411507017',
    title: 'Spiderman: Azul - Jeph Loeb y Tim Sale (Marvel Must Have)',
    image: img('818-ZibukRL'),
  },
  'el-asombroso-spider-man-roger-stern-marvel-heroes-panini': {
    slug: 'spider-man-by-roger-stern-omnibus',
    asin: '1302928376',
    title: 'Spider-Man by Roger Stern Omnibus (en inglés)',
    description:
      'Recopilación en un solo volumen de la etapa de Roger Stern como guionista de Spider-Man a principios de los 80, la que presentó al Duende (Hobgoblin) e incluye clásicos como «¡Nada puede detener al Juggernaut!». Edición en inglés.',
    features: ['Formato ómnibus de Marvel', 'Guion de Roger Stern', 'Primera aparición del Duende (Hobgoblin)', 'Edición en inglés'],
    image: img('91NFFNGmqAL'),
    seoTitle: 'Spider-Man by Roger Stern Omnibus | Amazon.es',
    seoDescription: 'La etapa completa de Roger Stern en Spider-Man en un ómnibus en inglés: el origen del Duende y Nada puede detener al Juggernaut.',
    keywords: ['roger stern', 'spider-man omnibus', 'hobgoblin', 'cómic en inglés'],
  },
  'funko-pop-miles-morales-spider-verse-402': {
    slug: 'funko-pop-miles-morales-across-spider-verse',
    asin: 'B0BQ3V78X1',
    title: 'Funko Pop! Miles Morales - Spider-Man: Cruzando el Multiverso (exclusivo Amazon)',
    description: 'Funko Pop! de Miles Morales con el traje de Spider-Man: Cruzando el Multiverso, en edición exclusiva de Amazon.',
    features: ['Figura de vinilo Funko Pop!', 'Miles Morales de Cruzando el Multiverso', 'Exclusivo de Amazon', 'Caja con ventana'],
    image: img('31bJ4UPT9zL'),
    seoTitle: 'Funko Pop Miles Morales Cruzando el Multiverso | Amazon.es',
    seoDescription: 'Funko Pop! de Miles Morales de Spider-Man: Cruzando el Multiverso, edición exclusiva de Amazon.',
    keywords: ['funko pop miles morales', 'across the spider-verse', 'cruzando el multiverso', 'exclusivo amazon'],
  },
  'funko-pop-spider-gwen-spider-verse-405': {
    slug: 'funko-pop-spider-gwen-sin-mascara-152',
    asin: 'B01HFELY0S',
    title: 'Funko Pop! Spider-Gwen sin máscara (152)',
    description: 'Funko Pop! de Gwen Stacy como Spider-Gwen, con la capucha puesta y la máscara retirada, inspirada en el diseño de los cómics.',
    features: ['Figura de vinilo Funko Pop!', 'Spider-Gwen sin máscara', 'Número 152 de la línea Marvel', 'Caja con ventana'],
    image: img('71DGR7WOwFL'),
    seoTitle: 'Funko Pop Spider-Gwen sin máscara 152 | Amazon.es',
    seoDescription: 'Funko Pop! de Spider-Gwen sin máscara (152), Gwen Stacy con su traje de los cómics.',
    keywords: ['funko pop spider-gwen', 'gwen stacy', 'funko 152', 'coleccionable'],
  },
  'funko-pop-spider-man-venom-2-pack': {
    slug: 'funko-pop-anti-venom-peter-parker-spider-man-2',
    asin: 'B0CYCHTXD2',
    title: 'Funko Pop! Anti-Venom Peter Parker - Marvel\'s Spider-Man 2',
    description: 'Funko Pop! de Peter Parker con el traje de Anti-Venom que lleva en el videojuego Marvel\'s Spider-Man 2 de PS5.',
    features: ['Figura de vinilo Funko Pop!', 'Línea Games', 'Peter Parker como Anti-Venom', 'Inspirado en Marvel\'s Spider-Man 2'],
    image: img('61xMSOHxDSL'),
    seoTitle: 'Funko Pop Anti-Venom Peter Parker Spider-Man 2 | Amazon.es',
    seoDescription: 'Funko Pop! de Peter Parker con el traje de Anti-Venom del videojuego Marvel\'s Spider-Man 2.',
    keywords: ['funko pop anti-venom', 'spider-man 2 ps5', 'funko games', 'venom'],
  },
  'hasbro-marvel-legends-gamerverse-spider-man-2-15cm': {
    slug: 'hasbro-marvel-legends-gamerverse-velocity-suit',
    asin: 'B0FQJ2KN6Q',
    title: 'Marvel Legends Gamerverse Peter Parker Traje Velocity (15 cm)',
    description: 'Figura Marvel Legends de la subserie Gamerverse con el Peter Parker de los juegos de Insomniac y su traje Velocity, a escala de 15 cm.',
    features: ['Línea Marvel Legends Gamerverse', 'Inspirada en los juegos de Insomniac', 'Traje Velocity', 'Escala de 15 cm'],
    image: img('51U3U3gG3pL'),
    seoTitle: 'Marvel Legends Gamerverse Spider-Man Traje Velocity | Amazon.es',
    seoDescription: 'Figura Marvel Legends Gamerverse de Peter Parker con el traje Velocity de los juegos de Spider-Man de Insomniac.',
    keywords: ['marvel legends gamerverse', 'velocity suit', 'spider-man ps5', 'insomniac'],
  },
  'hasbro-marvel-legends-retro-spider-man-clasico': {
    slug: 'hasbro-marvel-legends-spider-man-estilo-animacion',
    asin: 'B09H14KKZM',
    title: 'Marvel Legends Series Spider-Man con estilo de animación (15 cm, 6 accesorios)',
    description: 'Figura Marvel Legends de Spider-Man con acabado que imita la animación clásica, escala de 15 cm y seis accesorios.',
    features: ['Línea Marvel Legends Series', 'Acabado de estilo animado', 'Escala de 15 cm', '6 accesorios incluidos'],
    image: img('61hB0GhWkyL'),
    seoTitle: 'Marvel Legends Spider-Man estilo animación 15 cm | Amazon.es',
    seoDescription: 'Figura Marvel Legends de Spider-Man con acabado de animación clásica, 15 cm y 6 accesorios.',
    keywords: ['marvel legends spider-man', 'estilo animado', 'figura 15 cm', 'hasbro'],
  },
  'hasbro-marvel-legends-spider-gwen-across-spider-verse': {
    asin: 'B0CSHFF23B',
    title: 'Marvel Legends Series Spider-Gwen - Spider-Man: Cruzando el Multiverso (15 cm)',
    image: img('61VhHf5q4PL'),
  },
  'hasbro-marvel-legends-spider-man-no-way-home-15cm': {
    slug: 'hasbro-marvel-legends-amazing-spider-man-no-way-home',
    asin: 'B0FHKY4D5M',
    title: 'Marvel Legends Series The Amazing Spider-Man - Spider-Man: No Way Home (15 cm)',
    description: 'Figura Marvel Legends del Spider-Man de Andrew Garfield tal como aparece en Spider-Man: No Way Home, a escala de 15 cm.',
    features: ['Línea Marvel Legends Series', 'Spider-Man de Andrew Garfield', 'Versión de No Way Home', 'Escala de 15 cm'],
    image: img('613SU5JvFrL'),
    seoTitle: 'Marvel Legends Amazing Spider-Man No Way Home | Amazon.es',
    seoDescription: 'Figura Marvel Legends del Spider-Man de Andrew Garfield en No Way Home, escala 15 cm.',
    keywords: ['marvel legends no way home', 'andrew garfield', 'amazing spider-man', 'figura 15 cm'],
  },
  'hasbro-marvel-spider-man-web-shooter-gear-lanzarredes': {
    slug: 'hasbro-spider-man-lanzador-aracnido-supremo',
    asin: 'B0CBKQXWPK',
    title: 'Hasbro Spider-Man Lanzador Arácnido Supremo (2 en 1, agua y fluido)',
    description: 'Lanzador de muñeca de Hasbro para jugar a ser Spider-Man: dispara agua o fluido arácnido y es recargable. Pensado para niños.',
    features: ['Juguete oficial Hasbro', 'Lanzador de muñeca 2 en 1', 'Dispara agua o fluido arácnido', 'Recargable'],
    image: img('81-mqNnd10L'),
    seoTitle: 'Spider-Man Lanzador Arácnido Supremo Hasbro | Amazon.es',
    seoDescription: 'Lanzador de muñeca Spider-Man de Hasbro, 2 en 1: dispara agua o fluido arácnido. Recargable.',
    keywords: ['lanzatelarañas spider-man', 'hasbro', 'juguete spider-man', 'lanzador arácnido'],
  },
  'marvel-spider-man-billetera-cuero-vegano': {
    slug: 'marvel-spider-man-cartera-web-hero',
    asin: 'B0HHLM12S9',
    title: 'Marvel Cartera de Spider-Man Web Hero',
    description: 'Cartera con licencia oficial de Marvel y diseño de Spider-Man.',
    features: ['Licencia oficial Marvel', 'Diseño Spider-Man Web Hero', 'Cartera con ranuras para tarjetas'],
    image: img('81WYYNLvgHL'),
    seoTitle: 'Cartera Spider-Man Web Hero Marvel | Amazon.es',
    seoDescription: 'Cartera de Spider-Man con licencia oficial de Marvel, diseño Web Hero.',
    keywords: ['cartera spider-man', 'billetera marvel', 'regalo spider-man'],
  },
  'marvel-spider-man-mochila-escolar-infantil': {
    asin: 'B0H6N4Y2FV',
    title: 'Mochila Escolar Spider-Man para Niño - Licencia Oficial Marvel',
    description: 'Mochila escolar infantil de Spider-Man con licencia oficial de Marvel, doble compartimento con cremallera y bolsillo lateral.',
    features: ['Licencia oficial Marvel', 'Doble compartimento con cremalleras', 'Bolsillo lateral', 'Colores rojo y azul'],
    image: img('61Wi40bGu2L'),
  },
  'marvel-spider-man-pijama-nino-conjunto-2-piezas': {
    asin: 'B0BSV813DG',
    title: 'Marvel Pijama de Spider-Man para Niño (conjunto 2 piezas)',
    image: img('81iqEzuRZJL'),
  },
  'stor-spider-man-sandwichera-infantil-3-compartimentos': {
    asin: 'B0DXKGQXTQ',
    title: 'Stor Sandwichera Infantil Spider-Man con 3 compartimentos',
    image: img('71OGRzqbfVL'),
  },
  // Solo quedan imitaciones sin licencia: se retira de la tienda
  'hasbro-spider-man-guante-lanzatelaranas-electronico': { inStock: false },

  // ── Promesas de envío o ediciones que no podemos garantizar ─────────────────
  'funko-pop-spider-man-integrated-suit-no-way-home-913': {
    seoDescription: 'Funko Pop! Marvel Spider-Man Integrated Suit No Way Home #913. Figura de vinilo de unos 9,5 cm. Disponible en Amazon.es.',
  },
  'marvel-pack-2-camisetas-spider-man-nino-manga-corta': {
    seoDescription: 'Pack de 2 camisetas infantiles de Spider-Man con licencia de Marvel, azul y roja con estampados. Disponible en Amazon.es.',
  },
  'amazing-spider-man-omnibus-vol-1-stan-lee-ditko': {
    features: ['Recoge los primeros números de The Amazing Spider-Man de Stan Lee', 'Arte original de Steve Ditko', 'Formato ómnibus de gran tamaño con tapa dura', 'Edición en inglés'],
  },
  'funko-pop-spider-man-primera-aparicion-diamond-glitter-593': {
    seoDescription: 'Funko Pop! Spider-Man #593 en versión Diamond Glitter, con el traje clásico rojo y azul. Disponible en Amazon.es.',
    features: ['Versión Diamond Glitter con acabado brillante', 'Traje clásico rojo y azul de Spider-Man', 'Número 593 de la colección Pop! Marvel', 'Caja con ventana'],
  },
  'miles-morales-nuevo-spiderman-vol-1-bendis-panini': {
    features: ['Origen completo de Miles Morales como Spider-Man', 'Guion de Brian Michael Bendis con arte de Sara Pichelli', 'Edición en español de Panini Comics', 'Primeros números de Ultimate Comics: Spider-Man (2011)'],
  },

  // ── Datos de ficha que no coincidían con el producto ────────────────────────
  'funko-pop-spider-man-2099-blanco-exclusiva-amazon-961': {
    slug: 'funko-pop-miguel-ohara-across-spider-verse',
    title: 'Funko Pop! Miguel O\'Hara (Spider-Man 2099) - Cruzando el Multiverso',
    description: 'Funko Pop! de Miguel O\'Hara, el Spider-Man 2099 líder de la Sociedad Araña en Spider-Man: Cruzando el Multiverso.',
    features: ['Figura de vinilo Funko Pop!', 'Miguel O\'Hara / Spider-Man 2099', 'De Spider-Man: Cruzando el Multiverso', 'Caja con ventana'],
    image: img('81tzRAuFH0L'),
    seoTitle: 'Funko Pop Miguel O\'Hara Spider-Man 2099 Across | Amazon.es',
    seoDescription: 'Funko Pop! de Miguel O\'Hara, Spider-Man 2099, de Spider-Man: Cruzando el Multiverso.',
    keywords: ['funko pop spider-man 2099', 'miguel o\'hara', 'across the spider-verse', 'cruzando el multiverso'],
  },
  'marvel-spider-man-pack-3-calcetines-hombre': {
    slug: 'marvel-spider-man-pack-3-calcetines-nino',
    title: 'Marvel Pack de 3 Calcetines de Spider-Man para Niño',
    description: 'Pack de tres pares de calcetines infantiles de Spider-Man con licencia oficial de Marvel.',
    features: ['Licencia oficial Marvel', 'Pack de 3 pares', 'Tallas infantiles', 'Diseños de Spider-Man'],
    seoTitle: 'Pack 3 Calcetines Spider-Man Niño Marvel | Amazon.es',
    seoDescription: 'Pack de tres pares de calcetines de Spider-Man para niño, con licencia oficial de Marvel.',
    keywords: ['calcetines spider-man', 'calcetines niño', 'ropa marvel niño'],
  },
};

async function main() {
  let n = 0;
  for (const [oldSlug, fix] of Object.entries(FIXES)) {
    const p = await prisma.product.findFirst({ where: { slug: { in: [oldSlug, fix.slug].filter(Boolean) } } });
    if (!p) {
      console.log(`⚠️  No existe: ${oldSlug}`);
      continue;
    }
    await prisma.product.update({ where: { id: p.id }, data: { inStock: true, ...fix } });
    console.log(`🛒 ${fix.slug || oldSlug}`);
    n++;
  }
  console.log(`\n${n} productos corregidos`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
