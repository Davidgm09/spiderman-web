/**
 * Artículos de la categoría "Guías" (crea o actualiza por slug, conserva las visitas).
 * Productos comprobados en Amazon.es el 16/10/2026: ASIN, título y disponibilidad.
 * Uso: node scripts/add-blog-guias-2026.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const TAG = process.env.AMAZON_AFFILIATE_TAG || 'sentidoaracni-21';
const amazon = (asin) => `https://www.amazon.es/dp/${asin}?tag=${TAG}`;
const search = (q) => `https://www.amazon.es/s?k=${encodeURIComponent(q)}&tag=${TAG}`;
const REL = 'rel="sponsored nofollow noopener" target="_blank"';

// Ficha de producto dentro del artículo (estilos .gift en app/globals.css)
const gift = ({ asin, name, img, text }) => `
<div class="gift">
  <a href="${amazon(asin)}" ${REL} class="gift-img"><img src="${img}" alt="${name}" loading="lazy" /></a>
  <div>
    <h3>${name}</h3>
    <p>${text}</p>
    <a href="${amazon(asin)}" ${REL} class="gift-btn">Ver en Amazon</a>
  </div>
</div>`;

const img = (id, ext = 'jpg') => `https://m.media-amazon.com/images/I/${id}._AC_SL500_.${ext}`;

const REGALOS = {
  peques: [
    { asin: 'B0CFW281JH', name: 'LEGO Marvel: coche de carreras de Spider-Man y Duende Verde venomizado', img: img('81G2yryswfL'),
      text: 'Un set pequeño y fácil de montar con persecución incluida: el coche de Spider-Man contra un Duende Verde poseído por el simbionte. Ideal como primer LEGO de superhéroes.' },
    { asin: 'B08DLND8LG', name: 'Máscara electrónica de Miles Morales (Hasbro)', img: img('71IP2QU-AyL'),
      text: 'Para los que se saben de memoria <em>Un nuevo universo</em>. Es de las que más éxito tienen para jugar a ser Spider-Man por casa (y para Carnaval).' },
    { asin: 'B09H1CJWFT', name: 'Spider-Mobile con figura de Miles Morales (Hasbro)', img: img('81GoD7auuiL'),
      text: 'Vehículo de 15 cm con su figura de Miles. Resistente y pensado para jugar, no para la estantería.' },
    { asin: 'B08P22GX79', name: 'Spider-Man Titan Hero Series, 30 cm', img: img('61YWZBsxBVL').replace('_AC_SL500_', '_SL500_'),
      text: 'La figura grande de toda la vida: 30 cm, articulada y a un precio contenido. Recomendada a partir de 4 años.' },
    { asin: 'B0BSMY1JHV', name: 'Peluche hablador de Spider-Man', img: img('81yeVKgG6kL'),
      text: 'Para los más pequeños de la casa: blandito y con frases del personaje.' },
    { asin: '849167182X', name: 'Spiderman. Grandes poderes, grandes enemigos (Mi primer cómic)', img: img('91aVTNIGZ3L').replace('_AC_SL500_', '_SL500_'),
      text: 'Historias cortas y sencillas de la colección de Panini pensada para primeros lectores. Una forma estupenda de empezar con los cómics.' },
  ],
  coleccionistas: [
    { asin: 'B09VYJ6KKP', name: 'Marvel Legends: pack de 5 figuras de Spider-Man (exclusivo Amazon)', img: img('61IcCNfSTXL'),
      text: 'Cinco figuras de la línea Marvel Legends a escala de 15 cm en un solo pack. Es exclusivo de Amazon y suele agotarse, así que si lo ves disponible, no lo dejes pasar.' },
    { asin: 'B09QXRBY7F', name: 'Marvel Legends: Miles Morales de Cruzando el Multiverso', img: img('71NHqnd84LL'),
      text: 'El traje de Miles en <em>Across the Spider-Verse</em> con la calidad de articulación de Marvel Legends. Queda espectacular en cualquier vitrina.' },
    { asin: 'B09QFWKFS1', name: 'LEGO Marvel 76226: figura articulada de Spider-Man', img: img('91A1b-4we-L'),
      text: 'Una figura de Spider-Man construida con piezas LEGO y totalmente articulable. Sirve tanto para montar como para exponer.' },
    { asin: 'B0BG3B8KZK', name: 'Funko Pop! Miguel O\'Hara (Cruzando el Multiverso)', img: img('81tzRAuFH0L'),
      text: 'El Spider-Man 2099 de la película, el líder de la Sociedad Araña. Para quien se quedó con ganas de más tras <em>Across the Spider-Verse</em>.' },
    { asin: 'B07DFBSVDW', name: 'Funko Pop! Spider-Man Noir', img: img('81iXCjQfwJL'),
      text: 'En blanco y negro, como su universo. Uno de los Funko más bonitos de la saga del Spider-Verso.' },
    { asin: 'B08T5XCJ5L', name: 'Funko Pop! Spider-Man con traje integrado (No Way Home)', img: img('71Wwc55Sy5L'),
      text: 'El traje rojo, azul y dorado de Tom Holland en <em>No Way Home</em>.' },
    { asin: 'B0BSF7XNQH', name: 'Funko Pop! Spider-Man Diamond Collection (593)', img: img('718Ga56ARZL'),
      text: 'La edición con acabado de purpurina de la colección Diamond, de las favoritas entre coleccionistas de Funko.' },
    { asin: 'B08T67T7C4', name: 'Funko Pop! Carnage (Venom: Habrá Matanza)', img: img('71tZhmlCyrL'),
      text: 'Porque a todo fan le gusta tener también a los villanos. Este es el Carnage de la película de Woody Harrelson.' },
  ],
  lectores: [
    { asin: '1302919377', name: 'The Amazing Spider-Man Omnibus Vol. 1', img: img('81V6z9dZanL').replace('_AC_SL500_', '_SL500_'),
      text: 'El gran regalo para un lector veterano: los primeros 38 números de Stan Lee y Steve Ditko, desde <em>Amazing Fantasy #15</em>, en un volumen enorme. Está en inglés.' },
    { asin: '8411016404', name: 'Spiderman: Tormento (Todd McFarlane)', img: img('71YHoLEau-L').replace('_AC_SL500_', '_SL500_'),
      text: 'La historia más oscura del Lagarto, escrita y dibujada por McFarlane en 1990 para estrenar la colección <em>Spider-Man</em>. Un clásico del dibujo noventero.' },
    { asin: '8411010430', name: 'El Asombroso Spiderman: Matanza Máxima (Marvel Héroes)', img: img('91v6+HUj9eL').replace('_AC_SL500_', '_SL500_'),
      text: 'El crossover de 1993 en el que Carnage y su «familia» siembran el caos en Nueva York y Spider-Man tiene que aliarse con Venom. Todo en un tomo.' },
    { asin: '8491677208', name: 'Miles Morales. El nuevo Spiderman 1', img: img('81QY6DarCAL').replace('_AC_SL500_', '_SL500_'),
      text: 'Los orígenes de Miles por Brian Michael Bendis y Sara Pichelli. El regalo perfecto para quien conoció a Miles por las películas y quiere leer los cómics.' },
  ],
  vestir: [
    { asin: 'B08GPD5ZKV', name: 'Sudadera con capucha Spider-Man Web', img: 'https://m.media-amazon.com/images/I/B1D6UUCtZNL._CLa%7C2140%2C2000%7CB1yhnvLuEjL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SL500_.png',
      text: 'Un básico de invierno con licencia oficial, en varias tallas y colores.' },
    { asin: 'B08GR7ZV94', name: 'Camiseta retro Amazing Spider-Man', img: 'https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7CA1nMTmNV0-L.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SL500_.png',
      text: 'Diseño de estilo vintage inspirado en los cómics clásicos. Funciona tanto para fans veteranos como para los que no lo son tanto.' },
    { asin: 'B09TFXBYFH', name: 'Gorro de punto de Miles Morales', img: img('81xeCMNx3-L'),
      text: 'Gorro de invierno para adulto inspirado en el traje de Miles. Útil, barato y muy fácil de acertar.' },
  ],
  detalles: [
    { asin: 'B0D8C19NT9', name: 'Taza de cerámica Spider-Man con collage de cómic (Paladone)', img: img('51jc4Q5M0nL'),
      text: 'El clásico que nunca falla en el amigo invisible: una taza grande con viñetas de los cómics.' },
    { asin: 'B017SHTJAY', name: 'Llavero metálico de Spider-Man', img: 'https://m.media-amazon.com/images/I/51g6jv1lnKL._AC_SL500_.jpg',
      text: 'Un detalle pequeño para complementar otro regalo o para quien lo lleva todo encima.' },
    { asin: 'B0CPVKC6CW', name: 'Botella de aluminio de Spider-Man', img: img('71cYe2WN1PL'),
      text: 'Para el cole o el entrenamiento. Sin BPA y con asa y cierre de clic.' },
  ],
};

const section = (items) => items.map(gift).join('\n');

const GUIA_REGALOS = {
  slug: 'regalos-spider-man-navidad-guia',
  title: 'Regalos de Spider-Man para Navidad: guía para todos los fans',
  subtitle: 'Figuras, LEGO, cómics, ropa y detalles para acertar con cualquier fan del trepamuros, de 4 a 99 años',
  excerpt:
    'Hemos elegido los mejores regalos de Spider-Man para esta Navidad, ordenados por tipo de fan: los más pequeños, los coleccionistas, los lectores de cómics y quien solo busca un detalle.',
  category: 'Guías',
  readTime: '7 min',
  publishDate: new Date('2026-10-16'),
  image: 'https://image.tmdb.org/t/p/w1280/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg',
  seoTitle: 'Regalos de Spider-Man para Navidad 2026: guía por tipo de fan',
  seoDescription:
    'Los mejores regalos de Spider-Man para Navidad: LEGO, figuras Marvel Legends, Funko Pop, cómics y ropa. Ideas para niños, coleccionistas y lectores.',
  keywords: ['regalos Spider-Man', 'regalos Navidad Spider-Man', 'LEGO Spider-Man', 'Marvel Legends', 'Funko Pop Spider-Man', 'cómics Spider-Man'],
  tags: ['regalos', 'Navidad', 'guía', 'figuras', 'cómics', 'LEGO'],
  content: `
<p><em>Como afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios cambian a menudo, así que consúltalos en Amazon antes de comprar.</em></p>

<p>Spider-Man llega a esta Navidad en uno de sus mejores momentos: <em>Brand New Day</em> ha sido la película de Spider-Man más taquillera de la historia, Miles Morales sigue arrasando entre los más jóvenes y los cómics clásicos viven una segunda juventud en las ediciones de Panini. Eso significa que hay muchísimo donde elegir, y también muchas formas de equivocarse.</p>

<p>Para ponértelo fácil, hemos ordenado esta guía por <strong>tipo de fan</strong>. Todos los productos están disponibles en Amazon España y los hemos revisado uno a uno.</p>

<figure>
  <img src="https://image.tmdb.org/t/p/w1280/9xfDWXAUbFXQK585JvByT5pEAhe.jpg" alt="Miles Morales y Gwen Stacy en Spider-Man: Cruzando el Multiverso" loading="lazy" />
  <figcaption>Gracias al Spider-Verso, Miles Morales y Gwen Stacy son ya tan populares entre los niños como Peter Parker.</figcaption>
</figure>

<h2>Para los más pequeños</h2>
<p>Juguetes resistentes, pensados para jugar y no para la estantería. Si dudas sobre la edad, fíjate en la recomendación de cada fabricante.</p>
${section(REGALOS.peques)}

<h2>Para coleccionistas</h2>
<p>Para el fan adulto que tiene una vitrina (o quiere empezarla). La línea <strong>Marvel Legends</strong> de Hasbro es la referencia en figuras articuladas de 15 cm; los <strong>Funko Pop!</strong> son la opción más asequible para ampliar colección.</p>
${section(REGALOS.coleccionistas)}

<h2>Para lectores de cómics</h2>
<p>Un buen tomo es un regalo que dura años. Si la persona a la que regalas no ha leído nunca cómics de Spider-Man, échale un vistazo antes a nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía para empezar a leer Spider-Man</a>.</p>
${section(REGALOS.lectores)}
<p>¿Buscas algo concreto? En nuestra sección de <a href="/comics">cómics</a> tienes las fichas de más de 180 números clave, y si dudas entre arcos, te recomendamos leer antes nuestros análisis de <a href="/blog/kravens-last-hunt-analisis-mejor-arco-spider-man">La última cacería de Kraven</a> o de <a href="/blog/ultimate-spider-man-bendis-analisis-run-completa">Ultimate Spider-Man de Bendis</a>.</p>

<h2>Para vestir</h2>
<p>La ropa es un regalo seguro siempre que aciertes con la talla. Si no la sabes, el gorro es la apuesta segura.</p>
${section(REGALOS.vestir)}

<h2>Detalles y amigo invisible</h2>
<p>Pequeños regalos para complementar otro mayor o para el amigo invisible de la oficina.</p>
${section(REGALOS.detalles)}

<h2>¿Y videojuegos o películas?</h2>
<p>Si la persona tiene una PlayStation 5, <strong>Marvel's Spider-Man 2</strong> sigue siendo la mejor aventura del personaje (te contamos por qué en <a href="/blog/marvels-spider-man-2-ps5-analisis">nuestro análisis</a>); si aún no ha jugado al primero, <strong>Marvel's Spider-Man: Miles Morales</strong> es más corto y perfecto para empezar. Puedes verlos en Amazon: <a href="${search("Marvel's Spider-Man 2 PS5")}" ${REL}>Spider-Man 2</a> · <a href="${search('Spider-Man Miles Morales PS5')}" ${REL}>Miles Morales</a>.</p>
<p>Y para una tarde de cine en familia, las dos películas del Spider-Verso son un acierto seguro: <a href="${search('Spider-Man Un nuevo universo Blu-ray')}" ${REL}>Un nuevo universo</a> · <a href="${search('Spider-Man Cruzando el Multiverso Blu-ray')}" ${REL}>Cruzando el Multiverso</a>.</p>

<h2>Consejo final</h2>
<p>Pregunta antes qué Spider-Man es «el suyo». Para un niño de ocho años puede ser Miles Morales; para alguien que creció en los 2000, el de Tobey Maguire; para un lector de cómics, el de Ditko. Acertar con <em>su</em> Spider-Man es la mitad del regalo. Si no lo tienes claro, nuestra <a href="/personajes">galería de personajes</a> te puede dar pistas.</p>

<p>Y si quieres ver más opciones, tienes todos nuestros productos en <a href="/tienda">la tienda</a>.</p>
`,
};

const POSTS = [GUIA_REGALOS];

(async () => {
  for (const p of POSTS) {
    const data = { ...p, author: 'Redacción Sentido Arácnido', isPublished: true };
    const r = await prisma.blogPost.upsert({ where: { slug: p.slug }, update: data, create: data });
    console.log('ok', r.slug);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
