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

  // La portada y el ISBN son de la colección Must Have, no de Marvel Saga
  'el-asombroso-spiderman-1-vuelta-a-casa-marvel-saga-panini': {
    slug: 'spiderman-vuelta-a-casa-must-have-panini',
    description: 'La primera historia de la etapa de J. Michael Straczynski y John Romita Jr. en un solo tomo de la colección Marvel Must Have de Panini. Si te gusta, la etapa continúa en la colección Marvel Saga.',
    features: ['Editorial: Panini España', 'Idioma: español', 'Guion: J. Michael Straczynski', 'Dibujo: John Romita Jr.', 'Colección: Marvel Must Have'],
    seoTitle: 'Spiderman: Vuelta a casa (Marvel Must Have) | Amazon.es',
    seoDescription: 'Spiderman: Vuelta a casa, de Straczynski y Romita Jr., en la colección Marvel Must Have de Panini. Disponible en Amazon.es.',
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

// Títulos cortos y con el mismo formato en toda la tienda: «Marca · Producto (detalle)».
// Clave: slug actual (ya corregido arriba). El seoTitle de cada ficha conserva la versión larga.
const TITLES = {
  'disney-marvel-spider-man-botella-aluminio-600ml': 'Kids Licensing · Botella de aluminio de Spider-Man',
  'marvel-spider-man-cartera-web-hero': 'Marvel · Cartera de Spider-Man Web Hero',
  'marvel-comics-spider-man-llavero-metalico': 'SeDi · Llavero metálico de Spider-Man',
  'marvel-spider-man-mochila-escolar-infantil': 'Marvel · Mochila escolar de Spider-Man',
  'paladone-marvel-spider-man-taza-ceramica-550ml': 'Paladone · Taza de Spider-Man con viñetas de cómic',
  'stor-spider-man-sandwichera-infantil-3-compartimentos': 'Stor · Sandwichera de Spider-Man (3 compartimentos)',
  'funko-pop-anti-venom-peter-parker-spider-man-2': "Funko Pop! · Anti-Venom (Marvel's Spider-Man 2)",
  'funko-pop-carnage-venom-habra-matanza': 'Funko Pop! · Carnage (Venom: Habrá Matanza)',
  'funko-pop-spider-man-integrated-suit-no-way-home-913': 'Funko Pop! · Spider-Man traje integrado (No Way Home)',
  'funko-pop-spider-man-noir-spider-verse-406': 'Funko Pop! · Spider-Man Noir (Un nuevo universo)',
  'funko-pop-spider-man-primera-aparicion-diamond-glitter-593': 'Funko Pop! · Spider-Man Diamond Glitter (#593)',
  'funko-pop-spider-man-traje-casero-homecoming': 'Funko Pop! · Spider-Man traje casero (Homecoming)',
  'funko-pop-miguel-ohara-across-spider-verse': "Funko Pop! · Miguel O'Hara (Cruzando el Multiverso)",
  'funko-pop-miles-morales-across-spider-verse': 'Funko Pop! · Miles Morales (Cruzando el Multiverso)',
  'funko-pop-spider-gwen-sin-mascara-152': 'Funko Pop! · Spider-Gwen sin máscara (#152)',
  'spiderman-vuelta-a-casa-must-have-panini': 'Panini · Spiderman: Vuelta a casa (Must Have)',
  'el-asombroso-spiderman-2-hasta-que-las-estrellas-se-congelen': 'Panini · Hasta que las estrellas se congelen (Marvel Saga 2)',
  'el-asombroso-spiderman-39-superior-mi-peor-enemigo': 'Panini · Spiderman Superior: Mi peor enemigo (Marvel Saga 39)',
  'miles-morales-nuevo-spiderman-vol-1-bendis-panini': 'Panini · Miles Morales: El nuevo Spiderman 1',
  'spider-man-1-tormento-todd-mcfarlane-panini': 'Panini · Spiderman: Tormento (Must Have)',
  'spider-man-by-roger-stern-omnibus': 'Marvel · Spider-Man by Roger Stern Omnibus (inglés)',
  'spider-man-maximum-carnage-panini': 'Panini · Matanza Máxima (Marvel Héroes)',
  'spiderman-azul-jeph-loeb-tim-sale-panini': 'Panini · Spiderman: Azul (Must Have)',
  'spiderman-grandes-poderes-grandes-enemigos-mi-primer-comic': 'Panini · Mi primer cómic: Grandes poderes, grandes enemigos',
  'spiderman-ultima-caceria-kraven-must-have-panini': 'Panini · La última cacería de Kraven (Must Have)',
  'amazing-spider-man-omnibus-vol-1-stan-lee-ditko': 'Marvel · The Amazing Spider-Man Omnibus Vol. 1 (inglés)',
  'hasbro-marvel-legends-5-pack-spider-man-universe-exclusivo-amazon': 'Marvel Legends · Pack de 5 figuras de Spider-Man',
  'hasbro-marvel-legends-miles-morales-spider-verse': 'Marvel Legends · Miles Morales (Cruzando el Multiverso)',
  'hasbro-spider-man-bend-flex-15cm': 'Hasbro · Spider-Man Bend and Flex (15 cm)',
  'hasbro-marvel-legends-gamerverse-velocity-suit': 'Marvel Legends · Peter Parker traje Velocity (Gamerverse)',
  'hasbro-marvel-legends-duende-verde-deluxe-no-way-home': 'Marvel Legends · Duende Verde Deluxe (No Way Home)',
  'hasbro-marvel-legends-spider-gwen-across-spider-verse': 'Marvel Legends · Spider-Gwen (Cruzando el Multiverso)',
  'hasbro-marvel-legends-spider-man-estilo-animacion': 'Marvel Legends · Spider-Man estilo animación',
  'hasbro-marvel-legends-amazing-spider-man-no-way-home': 'Marvel Legends · The Amazing Spider-Man (No Way Home)',
  'hasbro-marvel-spider-man-mascara-electronica-miles-morales': 'Hasbro · Máscara electrónica de Miles Morales',
  'hasbro-marvel-spider-man-spider-mobile-miles-morales': 'Hasbro · Spider-Mobile con figura de Miles Morales',
  'hasbro-marvel-spider-man-titan-hero-series-30cm': 'Hasbro · Spider-Man Titan Hero Series (30 cm)',
  'hasbro-spider-man-guante-lanzatelaranas-electronico': 'Hasbro · Guante lanzatelarañas electrónico',
  'hasbro-spider-man-lanzador-aracnido-supremo': 'Hasbro · Lanzador Arácnido Supremo',
  'lego-marvel-76178-daily-bugle-coleccionista': 'LEGO 76178 · Daily Bugle',
  'lego-marvel-76226-figura-articulada-spider-man': 'LEGO 76226 · Figura articulada de Spider-Man',
  'lego-marvel-76279-spider-man-coche-carreras': 'LEGO 76279 · Coche de carreras de Spider-Man',
  'marvel-spider-man-peluche-hablador-30cm': 'Marvel · Peluche hablador de Spider-Man',
  'marvel-spiderman-logo-camiseta-hombre-algodon': 'Marvel · Camiseta retro The Amazing Spider-Man',
  'marvel-spider-man-camiseta-manga-larga-nino': 'Marvel · Camiseta de manga larga de Spider-Man (niño)',
  'marvel-pack-2-camisetas-spider-man-nino-manga-corta': 'Marvel · Pack de 2 camisetas de Spider-Man (niño)',
  'marvel-spider-man-pack-3-calcetines-nino': 'Marvel · Pack de 3 calcetines de Spider-Man (niño)',
  'marvel-spider-man-pijama-nino-conjunto-2-piezas': 'Marvel · Pijama de Spider-Man (niño)',
  'marvel-spider-man-miles-morales-gorro-beanie-adulto': 'Concept One · Gorro de punto de Miles Morales',
  'marvel-spider-man-sudadera-capucha-hombre': 'Marvel · Sudadera con capucha Spider-Man Web',
};

// Descripciones: qué es, para quién y por qué merece la pena, sin datos que no se puedan comprobar
// (capacidades, materiales, tallas o accesorios que Amazon no confirma)
const DESCRIPTIONS = {
  'disney-marvel-spider-man-botella-aluminio-600ml': 'Botella de aluminio reutilizable con asa y cierre de clic, decorada con Spider-Man. Un regalo práctico para el cole o el entrenamiento de los peques.',
  'marvel-spider-man-cartera-web-hero': 'Cartera con licencia de Marvel y diseño de Spider-Man. Un detalle útil para el día a día, perfecto como complemento de otro regalo.',
  'marvel-spider-man-mochila-escolar-infantil': 'Mochila escolar de Spider-Man con doble compartimento y bolsillo lateral. Para que la vuelta al cole sea un poco más arácnida.',
  'paladone-marvel-spider-man-taza-ceramica-550ml': 'Taza grande de cerámica de Paladone decorada con viñetas de los cómics de Spider-Man. El clásico que nunca falla en un amigo invisible.',
  'marvel-comics-spider-man-llavero-metalico': 'Llavero metálico de SeDi con el diseño de Spider-Man de los cómics. Un detalle pequeño y barato para acompañar otro regalo.',
  'stor-spider-man-sandwichera-infantil-3-compartimentos': 'Sandwichera de Stor con tres compartimentos para separar el almuerzo, decorada con Spider-Man. Ideal para los niños que llevan comida al cole.',
  'funko-pop-anti-venom-peter-parker-spider-man-2': "Peter Parker con el traje de Anti-Venom que estrena en Marvel's Spider-Man 2 de PS5. Para fans del juego de Insomniac que quieran un recuerdo en la estantería.",
  'funko-pop-carnage-venom-habra-matanza': 'El Carnage de Woody Harrelson en Venom: Habrá Matanza, en versión Funko Pop!. Porque toda colección necesita también a sus villanos.',
  'funko-pop-miguel-ohara-across-spider-verse': "Miguel O'Hara, el Spider-Man 2099 que lidera la Sociedad Araña en Cruzando el Multiverso. Para quien salió del cine pidiendo más Spider-Verso.",
  'funko-pop-miles-morales-across-spider-verse': 'Miles Morales con su traje de Cruzando el Multiverso, en una edición exclusiva de Amazon. Uno de los Funko favoritos de los fans más jóvenes.',
  'funko-pop-spider-gwen-sin-mascara-152': 'Gwen Stacy como Spider-Gwen, con la capucha puesta y la máscara retirada, tal como se diseñó en los cómics. Un clásico de las colecciones del Spider-Verso.',
  'funko-pop-spider-man-primera-aparicion-diamond-glitter-593': 'Spider-Man con su traje clásico rojo y azul en la versión Diamond Glitter, con acabado brillante. De las favoritas de los coleccionistas de Funko.',
  'funko-pop-spider-man-noir-spider-verse-406': 'El Spider-Man Noir de Un nuevo universo, en blanco y negro y con su sombrero. Uno de los Funko más bonitos del Spider-Verso.',
  'funko-pop-spider-man-traje-casero-homecoming': 'El Peter de Tom Holland con el traje casero de sudadera y gafas de Homecoming, el de sus primeros pasos como héroe. Un guiño para los fans del MCU.',
  'funko-pop-spider-man-integrated-suit-no-way-home-913': 'El traje rojo, azul y dorado que lleva Tom Holland en No Way Home, en versión Funko Pop!. El número 913 de la línea Marvel.',
  'spider-man-by-roger-stern-omnibus': 'La etapa de Roger Stern a principios de los 80 en un solo volumen: la primera aparición del Duende (Hobgoblin), «¡Nada puede detener al Juggernaut!» y «El niño que coleccionaba a Spider-Man». En inglés, para lectores veteranos.',
  'amazing-spider-man-omnibus-vol-1-stan-lee-ditko': 'Los primeros años de Spider-Man por Stan Lee y Steve Ditko, desde Amazing Fantasy #15, en un ómnibus enorme de tapa dura. El gran regalo para un lector de clásicos, en inglés.',
  'el-asombroso-spiderman-2-hasta-que-las-estrellas-se-congelen': 'Segundo tomo de la etapa de J. Michael Straczynski y John Romita Jr. en la colección Marvel Saga, la continuación directa de «Vuelta a casa».',
  'spiderman-ultima-caceria-kraven-must-have-panini': 'Kraven entierra a Spider-Man y ocupa su lugar en la historia de J. M. DeMatteis y Mike Zeck, para muchos la mejor de Spider-Man. Completa en un tomo Must Have, para lectores que buscan algo oscuro y adulto.',
  'spider-man-maximum-carnage-panini': 'El crossover de 1993 en el que Carnage y su «familia» siembran el caos en Nueva York y Spider-Man tiene que aliarse con Venom. Acción noventera de principio a fin.',
  'spiderman-grandes-poderes-grandes-enemigos-mi-primer-comic': 'Historias cortas y sencillas de Spider-Man de la colección Mi primer cómic de Panini, pensada para los lectores que empiezan. Una buena puerta de entrada a los cómics.',
  'miles-morales-nuevo-spiderman-vol-1-bendis-panini': 'El origen de Miles Morales por sus creadores, Brian Michael Bendis y Sara Pichelli. El regalo perfecto para quien conoció a Miles en las películas y quiere leer sus cómics.',
  'el-asombroso-spiderman-39-superior-mi-peor-enemigo': 'El Doctor Octopus se queda con el cuerpo de Peter Parker y decide ser un Spider-Man «superior». El inicio de la etapa de Dan Slott, dentro de la colección Marvel Saga.',
  'spiderman-azul-jeph-loeb-tim-sale-panini': 'Peter recuerda cómo se enamoró de Gwen Stacy en esta historia de Jeph Loeb y Tim Sale. Más romance que acción: ideal para quien busca el lado más emocional del personaje.',
  'spider-man-1-tormento-todd-mcfarlane-panini': 'La historia más oscura del Lagarto, escrita y dibujada por Todd McFarlane en 1990. Un clásico del dibujo noventero en un tomo Must Have.',
  'spiderman-vuelta-a-casa-must-have-panini': 'La primera historia de la etapa de J. Michael Straczynski y John Romita Jr., con Morlun y Ezekiel, en un tomo Must Have. Si te gusta, la etapa continúa en la colección Marvel Saga.',
  'hasbro-spider-man-bend-flex-15cm': 'Figura flexible de Hasbro de 15 cm: brazos y piernas se doblan para crear cualquier pose. Resistente y pensada para jugar, ideal para los más pequeños.',
  'hasbro-marvel-legends-duende-verde-deluxe-no-way-home': 'El Duende Verde de Willem Dafoe en No Way Home, en formato deluxe de Marvel Legends y con su armadura original. Para coleccionistas del MCU.',
  'hasbro-marvel-legends-miles-morales-spider-verse': 'Miles Morales con su traje de Cruzando el Multiverso y la articulación de la línea Marvel Legends a escala de 15 cm. Queda espectacular en cualquier vitrina.',
  'hasbro-marvel-legends-5-pack-spider-man-universe-exclusivo-amazon': 'Cinco figuras Marvel Legends a escala de 15 cm en un solo pack exclusivo de Amazon. Una forma rápida de empezar o ampliar una colección.',
  'hasbro-marvel-legends-gamerverse-velocity-suit': 'El Peter Parker de los juegos de Insomniac con el traje Velocity, en la subserie Gamerverse de Marvel Legends. Para quien ha jugado a Marvel\'s Spider-Man.',
  'hasbro-marvel-legends-spider-gwen-across-spider-verse': 'Spider-Gwen con su diseño de Cruzando el Multiverso en la línea Marvel Legends. Para coleccionistas del Spider-Verso.',
  'hasbro-marvel-legends-spider-man-estilo-animacion': 'Spider-Man en la línea Marvel Legends con un acabado que imita la animación clásica, a escala de 15 cm y con accesorios. Un guiño para los fans de las series animadas.',
  'hasbro-marvel-legends-amazing-spider-man-no-way-home': 'El Spider-Man de Andrew Garfield tal como aparece en No Way Home, en la línea Marvel Legends. Para quien se emocionó con su regreso.',
  'hasbro-spider-man-lanzador-aracnido-supremo': 'Lanzador de muñeca de Hasbro que dispara agua o fluido arácnido y se puede recargar. Para jugar a ser Spider-Man en casa o en el parque.',
  'hasbro-marvel-spider-man-mascara-electronica-miles-morales': 'Máscara electrónica de Miles Morales de Hasbro, para jugar a ser Spider-Man por casa (y para Carnaval). De las que más éxito tienen entre los fans de Un nuevo universo.',
  'hasbro-marvel-spider-man-titan-hero-series-30cm': 'La figura grande de toda la vida: un Spider-Man de 30 cm de la línea Titan Hero Series, resistente y a buen precio. Recomendada a partir de 4 años.',
  'hasbro-marvel-spider-man-spider-mobile-miles-morales': 'Vehículo Spider-Mobile con su figura de Miles Morales, pensado para jugar. Un regalo resistente para los fans más pequeños.',
  'lego-marvel-76178-daily-bugle-coleccionista': 'El edificio del Daily Bugle en versión LEGO: 3.772 piezas y 25 minifiguras del universo de Spider-Man. El set definitivo para coleccionistas adultos con espacio en la estantería.',
  'lego-marvel-76226-figura-articulada-spider-man': 'Una figura de Spider-Man construida con piezas LEGO y articulada para ponerla en cualquier pose. Sirve tanto para montar como para exponer.',
  'lego-marvel-76279-spider-man-coche-carreras': 'Set sencillo de LEGO Marvel con el coche de carreras de Spider-Man y un Duende Verde venomizado. Un buen primer LEGO de superhéroes.',
  'marvel-spider-man-peluche-hablador-30cm': 'Peluche de Spider-Man con sonidos, blandito y pensado para los más pequeños de la casa.',
  'marvel-spider-man-miles-morales-gorro-beanie-adulto': 'Gorro de punto para adulto de Concept One inspirado en el traje de Miles Morales. Útil, barato y fácil de acertar en invierno.',
  'marvel-spider-man-camiseta-manga-larga-nino': 'Camiseta infantil de manga larga con estampado de Spider-Man y licencia de Marvel, en varias tallas.',
  'marvel-spiderman-logo-camiseta-hombre-algodon': 'Camiseta de estilo retro inspirada en los cómics clásicos de The Amazing Spider-Man. Funciona tanto para fans veteranos como para los que no lo son tanto.',
  'marvel-pack-2-camisetas-spider-man-nino-manga-corta': 'Dos camisetas infantiles de manga corta de Spider-Man, una azul y otra roja. Un regalo práctico para los más pequeños.',
  'marvel-spider-man-pack-3-calcetines-nino': 'Tres pares de calcetines infantiles de Spider-Man con licencia de Marvel. El complemento perfecto para otro regalo.',
  'marvel-spider-man-pijama-nino-conjunto-2-piezas': 'Pijama de Spider-Man de dos piezas para niño. Para los que no se quitarían el traje ni para dormir.',
  'marvel-spider-man-sudadera-capucha-hombre': 'Sudadera con capucha y diseño de telaraña de Spider-Man, un básico de invierno con licencia de Marvel en varias tallas y colores.',
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

  let t = 0;
  for (const [slug, title] of Object.entries(TITLES)) {
    const r = await prisma.product.updateMany({ where: { slug }, data: { title } });
    if (!r.count) console.log(`⚠️  Título sin producto: ${slug}`);
    t += r.count;
  }
  // Los de Brand New Day tienen título propio en add-tienda-brand-new-day.js
  const missing = await prisma.product.findMany({ where: { slug: { notIn: Object.keys(TITLES) }, NOT: { slug: { contains: 'brand-new-day' } } }, select: { slug: true } });
  missing.forEach((p) => console.log(`⚠️  Sin título nuevo: ${p.slug}`));
  console.log(`${t} títulos unificados`);

  let d = 0;
  for (const [slug, description] of Object.entries(DESCRIPTIONS)) {
    const r = await prisma.product.updateMany({ where: { slug }, data: { description, seoDescription: description.slice(0, 155) } });
    if (!r.count) console.log(`⚠️  Descripción sin producto: ${slug}`);
    d += r.count;
  }
  console.log(`${d} descripciones reescritas`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
