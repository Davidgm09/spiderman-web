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

const tmdb = (id) => `https://image.tmdb.org/t/p/w1280/${id}.jpg`;
const figure = (id, alt, cap) => `<figure>
  <img src="${tmdb(id)}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;
const peli = (slug, title) => `<a href="/peliculas/${slug}"><em>${title}</em></a>`;

const ORDEN_PELICULAS = {
  slug: 'orden-ver-peliculas-spider-man',
  title: 'En qué orden ver las películas de Spider-Man',
  subtitle: 'Por estreno, por sagas y por cronología del MCU: todas las películas, de Tobey Maguire a Brand New Day',
  excerpt:
    'Tres Spider-Man de carne y hueso, un Spider-Verso animado y un universo de villanos de Sony: te explicamos en qué orden ver todas las películas de Spider-Man y qué necesitas haber visto antes de Brand New Day.',
  category: 'Guías',
  readTime: '8 min',
  publishDate: new Date('2026-10-16'),
  image: tmdb('tPpYGm2mVecue7Bk3gNVoSPA5qn'),
  seoTitle: 'Orden de las películas de Spider-Man: guía completa (2026)',
  seoDescription:
    'En qué orden ver las películas de Spider-Man: por estreno, por sagas y en cronología del MCU, del Spider-Man de Raimi a Brand New Day y el Spider-Verso.',
  keywords: ['orden películas Spider-Man', 'películas Spider-Man en orden', 'orden cronológico Spider-Man', 'Spider-Man MCU orden', 'Brand New Day', 'Spider-Verse'],
  tags: ['guía', 'películas', 'MCU', 'Spider-Verse', 'Brand New Day', 'Tom Holland'],
  content: `
<p>Desde 2002, Spider-Man ha tenido <strong>tres actores en imagen real</strong> —Tobey Maguire, Andrew Garfield y Tom Holland—, una trilogía animada que ha cambiado el cine de animación y un universo paralelo de Sony centrado en Venom y otros personajes de su mundo. Son muchas películas, y no todas se conectan entre sí, así que es normal no saber por dónde empezar.</p>

<p>En esta guía te damos el orden de estreno completo, el orden por sagas (el que recomendamos para una primera vez) y la cronología interna del MCU. Al final te contamos qué necesitas haber visto antes de <em>Brand New Day</em>.</p>

<h2>Todas las películas por orden de estreno</h2>
<p>Si quieres verlas todas tal y como llegaron a los cines, este es el orden:</p>
<table>
  <thead><tr><th>Año</th><th>Película</th><th>Saga</th></tr></thead>
  <tbody>
    <tr><td>2002</td><td>${peli('spider-man-2002', 'Spider-Man')}</td><td>Sam Raimi</td></tr>
    <tr><td>2004</td><td>${peli('spider-man-2-2004', 'Spider-Man 2')}</td><td>Sam Raimi</td></tr>
    <tr><td>2007</td><td>${peli('spider-man-3-2007', 'Spider-Man 3')}</td><td>Sam Raimi</td></tr>
    <tr><td>2012</td><td>${peli('the-amazing-spider-man-2012', 'The Amazing Spider-Man')}</td><td>Marc Webb</td></tr>
    <tr><td>2014</td><td>${peli('the-amazing-spider-man-2-el-poder-de-electro-2014', 'The Amazing Spider-Man 2: El poder de Electro')}</td><td>Marc Webb</td></tr>
    <tr><td>2016</td><td><em>Capitán América: Civil War</em></td><td>MCU (debut de Holland)</td></tr>
    <tr><td>2017</td><td>${peli('spider-man-homecoming-2017', 'Spider-Man: Homecoming')}</td><td>MCU</td></tr>
    <tr><td>2018</td><td><em>Vengadores: Infinity War</em></td><td>MCU</td></tr>
    <tr><td>2018</td><td>${peli('venom-2018', 'Venom')}</td><td>Universo Sony</td></tr>
    <tr><td>2018</td><td>${peli('spider-man-un-nuevo-universo-2018', 'Spider-Man: Un nuevo universo')}</td><td>Spider-Verso</td></tr>
    <tr><td>2019</td><td><em>Vengadores: Endgame</em></td><td>MCU</td></tr>
    <tr><td>2019</td><td>${peli('spider-man-lejos-de-casa-2019', 'Spider-Man: Lejos de casa')}</td><td>MCU</td></tr>
    <tr><td>2021</td><td>${peli('venom-habra-matanza-2021', 'Venom: Habrá Matanza')}</td><td>Universo Sony</td></tr>
    <tr><td>2021</td><td>${peli('spider-man-no-way-home-2021', 'Spider-Man: No Way Home')}</td><td>MCU</td></tr>
    <tr><td>2022</td><td>${peli('morbius-2022', 'Morbius')}</td><td>Universo Sony</td></tr>
    <tr><td>2023</td><td>${peli('spider-man-cruzando-el-multiverso-2023', 'Spider-Man: Cruzando el Multiverso')}</td><td>Spider-Verso</td></tr>
    <tr><td>2024</td><td>${peli('madame-web-2024', 'Madame Web')}</td><td>Universo Sony</td></tr>
    <tr><td>2024</td><td>${peli('venom-el-ultimo-baile-2024', 'Venom: El último baile')}</td><td>Universo Sony</td></tr>
    <tr><td>2024</td><td>${peli('kraven-the-hunter-2024', 'Kraven el cazador')}</td><td>Universo Sony</td></tr>
    <tr><td>2026</td><td>${peli('spider-man-brand-new-day-2026', 'Spider-Man: Brand New Day')}</td><td>MCU</td></tr>
  </tbody>
</table>
<p>Las tres películas de los Vengadores no son de Spider-Man, pero sí son importantes para entender al Peter Parker de Tom Holland. Hablamos de ellas más abajo.</p>

<h2>El orden que recomendamos: por sagas</h2>
<p>Las sagas de Maguire, Garfield y Holland son <strong>independientes entre sí</strong> (hasta que <em>No Way Home</em> las junta), así que la forma más cómoda de verlas por primera vez es saga a saga, en orden de estreno.</p>

<h3>1. La trilogía de Sam Raimi (Tobey Maguire)</h3>
${figure('faV0HuR6WnQoLrVq3r6mhjaABL9', 'Spider-Man contra el Doctor Octopus en el tren de Spider-Man 2', 'La pelea del tren de Spider-Man 2 (2004), una de las mejores escenas de acción del cine de superhéroes.')}
<ol>
  <li>${peli('spider-man-2002', 'Spider-Man')} (2002): el origen, con Willem Dafoe como Duende Verde.</li>
  <li>${peli('spider-man-2-2004', 'Spider-Man 2')} (2004): Alfred Molina como Doctor Octopus. Para muchos, la mejor película de Spider-Man (te contamos por qué en <a href="/blog/spider-man-2-2004-analisis-mejor-pelicula-superheroes">nuestro análisis</a>).</li>
  <li>${peli('spider-man-3-2007', 'Spider-Man 3')} (2007): el simbionte, el Hombre de Arena y el nuevo Duende.</li>
</ol>

<h3>2. The Amazing Spider-Man (Andrew Garfield)</h3>
${figure('HVcza6tJtWFrLriuh3Ano4Vt46', 'Spider-Man y Gwen Stacy en The Amazing Spider-Man', 'Andrew Garfield y Emma Stone: la relación entre Peter y Gwen es el corazón de la saga de Marc Webb.')}
<ol>
  <li>${peli('the-amazing-spider-man-2012', 'The Amazing Spider-Man')} (2012): un nuevo origen, con el Lagarto como villano.</li>
  <li>${peli('the-amazing-spider-man-2-el-poder-de-electro-2014', 'The Amazing Spider-Man 2: El poder de Electro')} (2014): Electro, el Duende Verde de Harry Osborn y el final más duro de la saga.</li>
</ol>
<p>Se quedó en dos películas: Sony canceló la tercera y llegó a un acuerdo con Marvel Studios para llevar a Spider-Man al MCU. Si te quedaste con mal sabor de boca, quizá te interese <a href="/blog/the-amazing-spider-man-2012-revaloracion-andrew-garfield">nuestra revisión de la etapa de Garfield</a>.</p>

<h3>3. Spider-Man en el MCU (Tom Holland)</h3>
${figure('Bwh7Lol5k3hSqYOtqXWxbbJVMx', 'Spider-Man y el Doctor Strange en Spider-Man: No Way Home', 'Tom Holland y Benedict Cumberbatch en No Way Home (2021), la película que abrió el multiverso.')}
<ol>
  <li><em>Capitán América: Civil War</em> (2016): primera aparición de Holland, reclutado por Tony Stark.</li>
  <li>${peli('spider-man-homecoming-2017', 'Spider-Man: Homecoming')} (2017): con el Buitre de Michael Keaton.</li>
  <li><em>Vengadores: Infinity War</em> (2018) y <em>Vengadores: Endgame</em> (2019): no son películas de Spider-Man, pero lo que le pasa a Peter en ellas explica todo lo que viene después.</li>
  <li>${peli('spider-man-lejos-de-casa-2019', 'Spider-Man: Lejos de casa')} (2019): Mysterio y el final que revela al mundo quién es Spider-Man.</li>
  <li>${peli('spider-man-no-way-home-2021', 'Spider-Man: No Way Home')} (2021): el multiverso se abre y vuelven Maguire, Garfield y sus villanos.</li>
  <li>${peli('spider-man-brand-new-day-2026', 'Spider-Man: Brand New Day')} (2026): Peter empieza de cero, solo y sin que nadie recuerde quién es.</li>
</ol>

<h3>4. El Spider-Verso animado (Miles Morales)</h3>
${figure('9xfDWXAUbFXQK585JvByT5pEAhe', 'Miles Morales rodeado de Spider-Men en Cruzando el Multiverso', 'Las películas del Spider-Verso se pueden ver en cualquier momento: no dependen de ninguna otra saga.')}
<ol>
  <li>${peli('spider-man-un-nuevo-universo-2018', 'Spider-Man: Un nuevo universo')} (2018): ganadora del Óscar a la mejor película de animación.</li>
  <li>${peli('spider-man-cruzando-el-multiverso-2023', 'Spider-Man: Cruzando el Multiverso')} (2023): termina con un «continuará», así que ojo.</li>
  <li><em>Spider-Man: Beyond the Spider-Verse</em>: cierra la trilogía en junio de 2027. Te contamos <a href="/blog/beyond-spider-verse-actualizacion-2025">todo lo que se sabe</a>.</li>
</ol>

<h3>5. El universo de Sony (Venom y compañía)</h3>
${figure('hNsYUryiwxcdeTMkaBcPF3iEg0p', 'Tom Hardy como Eddie Brock y Venom', 'Tom Hardy protagonizó las tres películas de Venom, la parte más exitosa del universo de Sony.')}
<p>Sony también lanzó su propio universo con personajes del mundo de Spider-Man, pero <strong>sin Spider-Man</strong>. Es la saga más prescindible: si solo te interesa el trepamuros, puedes saltártela entera. Si quieres verla, este es su orden:</p>
<ol>
  <li>${peli('venom-2018', 'Venom')} (2018)</li>
  <li>${peli('venom-habra-matanza-2021', 'Venom: Habrá Matanza')} (2021): su escena poscréditos conecta directamente con <em>No Way Home</em>.</li>
  <li>${peli('morbius-2022', 'Morbius')} (2022): aparece el Buitre de Michael Keaton, llegado del MCU.</li>
  <li>${peli('madame-web-2024', 'Madame Web')} (2024)</li>
  <li>${peli('venom-el-ultimo-baile-2024', 'Venom: El último baile')} (2024): cierra la historia de Eddie Brock.</li>
  <li>${peli('kraven-the-hunter-2024', 'Kraven el cazador')} (2024): la última película de este universo, que Sony dio por terminado tras su estreno.</li>
</ol>

<h2>Cronología del MCU: ¿cambia algo?</h2>
<p>En el caso de Spider-Man, el orden cronológico dentro del MCU coincide con el de estreno: <em>Civil War</em> y <em>Homecoming</em> transcurren en 2016; tras el salto de cinco años de <em>Endgame</em> llegan <em>Lejos de casa</em> y <em>No Way Home</em>, que va justo a continuación; y <em>Brand New Day</em> arranca cuatro años después de <em>No Way Home</em>.</p>
<p>La única excepción son las escenas poscréditos que cruzan universos: la de <em>Venom: Habrá Matanza</em> enlaza con la de <em>No Way Home</em>, así que, si quieres verlas en orden, mira <em>Habrá Matanza</em> antes.</p>

<h2>¿Qué tengo que ver antes de Brand New Day?</h2>
${figure('34jW8LvjRplM8Pv06cBFDpLlenR', 'Spider-Man colgado boca abajo en Venecia en Lejos de casa', 'Lejos de casa (2019) termina con el secreto de Peter al descubierto, lo que desencadena No Way Home.')}
<p>Lo imprescindible es la etapa de Tom Holland, sobre todo <strong>No Way Home</strong>, porque <em>Brand New Day</em> parte directamente de su final. Si tienes poco tiempo:</p>
<ul>
  <li><strong>Mínimo:</strong> ${peli('spider-man-no-way-home-2021', 'No Way Home')}.</li>
  <li><strong>Recomendado:</strong> ${peli('spider-man-homecoming-2017', 'Homecoming')}, ${peli('spider-man-lejos-de-casa-2019', 'Lejos de casa')} y ${peli('spider-man-no-way-home-2021', 'No Way Home')}.</li>
  <li><strong>Completo:</strong> además, las películas de Maguire y Garfield, para disfrutar de verdad del reencuentro de <em>No Way Home</em>.</li>
</ul>
<p>Un extra: el Punisher de Jon Bernthal llega a <em>Brand New Day</em> después de su paso por la serie <em>Daredevil: Born Again</em>. No es necesario verla, pero ayuda a situar al personaje. Y si ya has visto la película, tienes nuestro <a href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers">análisis sin spoilers</a> y lo que se sabe sobre <a href="/blog/futuro-spider-man-mcu-despues-brand-new-day">el futuro de Spider-Man en el MCU</a>.</p>

<h2>¿Y lo que viene?</h2>
<p>Las próximas citas son <em>Vengadores: Doomsday</em> (diciembre de 2026), aunque Tom Holland no figura en su reparto anunciado; <em>Spider-Man: Beyond the Spider-Verse</em> (junio de 2027); y <em>Vengadores: Secret Wars</em> (diciembre de 2027), donde los rumores sitúan el próximo regreso de Peter Parker. Actualizaremos esta guía a medida que se confirmen.</p>

<p>Tienes la ficha de cada película, con reparto, curiosidades y tráiler, en nuestra sección de <a href="/peliculas">películas</a>.</p>
`,
};

// Fuentes (16/10/2026): Wikipedia (sinopsis y reparto), NME, Gizmodo, entrevistas a Jacob Batalon (The Hollywood Reporter / SYFY)
const FINAL_BND = {
  slug: 'spider-man-brand-new-day-final-explicado',
  title: 'Spider-Man: Brand New Day, final explicado (con spoilers)',
  subtitle: 'Jean Grey, Control de Daños, el disparo del Punisher, el apretón de manos de Ned y la escena poscréditos',
  excerpt:
    'Quién es de verdad el villano, qué le pasa a Peter con sus poderes, cómo sobrevive al disparo, si Ned le recuerda y qué significa la escena poscréditos. Todo el final de Brand New Day explicado, con spoilers.',
  category: 'Películas',
  readTime: '8 min',
  publishDate: new Date('2026-10-16'),
  image: tmdb('subj7knTn4DeS6KS7qI66EQKe9i'),
  seoTitle: 'Spider-Man: Brand New Day, final explicado (spoilers)',
  seoDescription:
    'El final de Spider-Man: Brand New Day explicado: Jean Grey, Control de Daños, el disparo del Punisher, Ned y la escena poscréditos en el espacio.',
  keywords: ['Brand New Day final explicado', 'Spider-Man Brand New Day final', 'escena poscréditos Brand New Day', 'Jean Grey Spider-Man', 'Ned recuerda a Peter', 'Spider-Man 4 final'],
  tags: ['Brand New Day', 'final explicado', 'spoilers', 'Tom Holland', 'MCU', 'Jean Grey'],
  content: `
<blockquote><strong>Aviso: este artículo contiene spoilers de todo <em>Spider-Man: Brand New Day</em>, incluido el final y la escena poscréditos.</strong> Si todavía no la has visto, te recomendamos nuestro <a href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers">análisis sin spoilers</a>.</blockquote>

<p><em>Brand New Day</em> es la película más personal del Spider-Man de Tom Holland: menos multiverso y más calle, con un Peter Parker que lleva cuatro años completamente solo. Pero su final deja varias preguntas abiertas a propósito. Vamos por partes.</p>

<h2>Resumen rápido de la trama</h2>
<p>Cuatro años después del hechizo de <a href="/peliculas/spider-man-no-way-home-2021"><em>No Way Home</em></a>, nadie recuerda a Peter Parker. Él patrulla Nueva York a tiempo completo, se gana la confianza de la detective Jean DeWolff y visita a menudo la tumba de la tía May. Mientras tanto, alguien ataca instalaciones del <strong>Departamento de Control de Daños</strong> buscando algo llamado «V-Max»: un telépata capaz de saltar de cuerpo en cuerpo, que incluso usa al Escorpión (Michael Mando) para escapar de prisión, pero que no consigue entrar en la mente de Peter. Yelena Belova le pasa la información; Bill Metzger, el director de Control de Daños, niega saber nada.</p>
<p>A la vez, el cuerpo de Peter empieza a cambiar: sus sentidos se disparan y le salen hileras en las muñecas que producen <strong>telaraña orgánica</strong>. Tras perder el control y dar una paliza brutal al Escorpión, acude a Bruce Banner, que le ayuda a construir un <strong>inhibidor</strong> para contener la mutación.</p>

${figure('h84nJuyZrgqXinN3oNDHb8u3JEu', 'Spider-Man contra el Escorpión en una imagen promocional de Brand New Day', 'El Escorpión de Michael Mando vuelve con armadura y cola mecánica: es el primer peón que usa la telépata.')}

<h2>¿Quién es el villano de verdad?</h2>
<p>La telépata resulta ser <strong>Jean Grey</strong> (Sadie Sink). Pero la película juega a que no es una villana al uso: Jean busca a su hermana <strong>Sara</strong>, también telépata, a la que secuestró Control de Daños para experimentar con ella. Ese «V-Max» que Jean persigue está ligado a los experimentos secretos de Metzger con personas con poderes.</p>
<p>Por eso hay debate sobre quién es el antagonista. Jean es la amenaza a la que se enfrenta Peter durante casi toda la película —llega a poseer a MJ y a Bruce Banner, desatando a un Hulk salvaje que Spider-Man tiene que calmar—, pero el verdadero villano es <strong>Bill Metzger</strong> (Tramell Tillman), el hombre que la dejó sin hermana. En los cómics, Jean Grey es una de las fundadoras de la Patrulla-X, así que su presentación aquí abre la puerta a los mutantes en el MCU.</p>

<h2>El clímax: Roosevelt Island</h2>
<p>Control de Daños captura a Jean. En una de sus instalaciones de Roosevelt Island, ella desata un <strong>campo psiónico</strong> que deja paralizados a todos… menos a Peter. Jean le ataca con los ninjas de La Mano, poseídos, y Peter se quita el inhibidor de Banner: sin él, sus poderes mutados le hacen mucho más fuerte, lo justo para vencerlos.</p>
<p>Cuando llega hasta Jean, ella está a punto de matar a Metzger. Y aquí está la clave de la película: en vez de pelear, <strong>Peter se quita la máscara y la deja entrar en su mente</strong>. Jean ve un recuerdo de la tía May aceptando a Peter tal y como es, con sus poderes. Es el mismo duelo que arrastra Peter desde <em>No Way Home</em>, y es lo que consigue calmarla.</p>

<h2>El disparo del Punisher</h2>
<p>Justo entonces, Frank Castle (Jon Bernthal) dispara a Jean desde otro edificio. <strong>Peter se interpone y recibe el balazo</strong>. Herido de gravedad, sobrevive porque Jean le mantiene con vida con sus poderes hasta que llega la ayuda.</p>
<p>Peter despierta en el hospital junto a Castle, que se disculpa. Y en uno de los momentos más celebrados de la película, el Punisher se pone la máscara de Spider-Man y se asoma a la ventana para distraer a todo el mundo mientras Peter sale del hospital sin que nadie descubra quién es.</p>

${figure('qeQJx07rK2xm8SD2sJxFKhE7gs0', 'Peter Parker con el traje de Spider-Man bajo la chaqueta', 'Peter termina la película con una idea clara: ya no quiere ser Spider-Man solo.')}

<h2>¿Qué pasa con Jean y con Control de Daños?</h2>
<ul>
  <li><strong>Jean Grey</strong> se marcha de Nueva York. Queda libre, y con la puerta abierta a volver.</li>
  <li><strong>Bill Metzger</strong> desaparece: sigue en paradero desconocido al final de la película.</li>
  <li><strong>Control de Daños</strong> queda bajo investigación por sus experimentos.</li>
</ul>

<h2>¿Y MJ?</h2>
<p>Es probablemente la parte más amarga del final. Peter le cuenta a MJ la verdad, pero ella <strong>no recupera sus recuerdos</strong>: ahora tiene pareja, y aunque llega a conectar de nuevo con Peter, la película no fuerza una reconciliación. Su historia queda en el aire.</p>

<h2>El final: ¿Ned recuerda a Peter?</h2>
<p>Tras todo lo vivido, Peter decide que no quiere seguir haciéndolo todo solo. Se encuentra con Ned en una tienda, se presenta… y Ned, casi sin darse cuenta, <strong>le hace su apretón de manos secreto</strong>, el mismo que inventaron en <em>Homecoming</em>. Termina con un «¿Peter?».</p>
<p>¿Significa que Ned ha recuperado la memoria? La película no lo dice. El propio Jacob Batalon lo ha descrito como un final abierto: puede que Ned solo recuerde el apretón de manos por pura memoria muscular, o que haya un pequeño destello de reconocimiento. Lo que sí está claro es que el hechizo de Strange no ha borrado del todo el vínculo entre los dos amigos.</p>

<h2>La escena poscréditos, explicada</h2>
<p>Hay una sola escena, al final de los créditos. Vemos la aplicación de Ned para seguir a Spider-Man: primero le sitúa en Nueva York, como siempre, pero de repente falla, el mapa se aleja de la Tierra y <strong>la ubicación de Spider-Man aparece en el espacio</strong>. Después, el rótulo: «Spider-Man volverá».</p>
<p>No hay explicación oficial, y el director Destin Daniel Cretton ha dejado claro que la escena es ambigua a propósito. Las teorías principales son:</p>
<ul>
  <li><strong>Vengadores: Secret Wars</strong> (diciembre de 2027): la más popular. En los cómics, las <em>Secret Wars</em> originales llevaron a Spider-Man a otro planeta, donde consiguió el traje negro que acabó siendo el simbionte.</li>
  <li><strong>Vengadores: Doomsday</strong> (diciembre de 2026): posible, aunque Tom Holland no figura en el reparto anunciado.</li>
  <li><strong>El multiverso</strong>: que la aplicación haya localizado a otro Spider-Man, no al nuestro.</li>
</ul>
<p>Te contamos todo lo que se sabe de los próximos pasos en <a href="/blog/futuro-spider-man-mcu-despues-brand-new-day">el futuro de Spider-Man en el MCU</a>.</p>

<h2>Lo que deja abierto Brand New Day</h2>
<ul>
  <li>La <strong>mutación</strong> de Peter: sus poderes han evolucionado y la telaraña ya es orgánica. ¿Seguirá cambiando?</li>
  <li><strong>Jean Grey</strong> y la llegada de los mutantes.</li>
  <li><strong>Bill Metzger</strong>, en libertad.</li>
  <li>La relación de Peter con <strong>Ned y MJ</strong>, que por fin puede reconstruirse.</li>
  <li>Y, claro, <strong>dónde está Spider-Man</strong> en esa escena poscréditos.</li>
</ul>
<p>¿Te has perdido algún guiño? Repasa los <a href="/blog/brand-new-day-trailer-easter-eggs-detalles-ocultos">detalles ocultos de los tráileres</a>, mira en qué <a href="/blog/orden-ver-peliculas-spider-man">orden ver todas las películas de Spider-Man</a> o consulta <a href="/peliculas/spider-man-brand-new-day-2026">la ficha de la película</a>.</p>
`,
};

// Ediciones comprobadas en Amazon.es el 16/10/2026 (título, disponibilidad e imagen)
const edicion = (asin, name, imgId, text) => gift({ asin, name, img: `https://m.media-amazon.com/images/I/${imgId}._SL500_.jpg`, text });

const MEJORES_COMICS = {
  slug: 'mejores-comics-spider-man-historia',
  title: 'Los 10 mejores cómics de Spider-Man de la historia (y dónde leerlos en español)',
  subtitle: 'De la muerte de Gwen Stacy a Toda una vida: las historias esenciales del trepamuros, con su edición actual de Panini',
  excerpt:
    'Seis décadas de cómics dan para mucho. Estas son las diez historias de Spider-Man que todo fan debería leer, por qué son importantes y en qué edición puedes encontrarlas hoy en español.',
  category: 'Cómics',
  readTime: '10 min',
  publishDate: new Date('2026-10-16'),
  image: '/images/mejores-comics-spider-man.jpg',
  seoTitle: 'Los 10 mejores cómics de Spider-Man y dónde leerlos en español',
  seoDescription:
    'Los mejores cómics de Spider-Man de la historia: la muerte de Gwen Stacy, La última cacería de Kraven, Azul, Ultimate y más, con su edición en español.',
  keywords: ['mejores cómics Spider-Man', 'cómics Spider-Man imprescindibles', 'mejores historias Spider-Man', 'Spider-Man Panini', 'qué cómic de Spider-Man leer'],
  tags: ['cómics', 'ranking', 'Panini', 'guía', 'Marvel', 'lectura'],
  content: `
<p><em>Como afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.</em></p>

<p>Spider-Man lleva protagonizando cómics desde 1962, y en ese tiempo ha vivido algunas de las mejores historias de la historia del medio. Esta lista reúne las <strong>diez imprescindibles</strong>: no son necesariamente las más fáciles para empezar —para eso tienes nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía para nuevos lectores</a>—, sino las que mejor definen al personaje y las que más han influido en todo lo que vino después.</p>
<p>Para cada una te indicamos la <strong>edición que puedes encontrar hoy en español</strong>. Las hemos comprobado una a una en Amazon.</p>

<h2>1. La muerte de Gwen Stacy (1973)</h2>
<p><em>The Amazing Spider-Man</em> #121-122 · Gerry Conway, Gil Kane y John Romita</p>
<p>El Duende Verde secuestra a Gwen Stacy y la arroja desde lo alto de un puente. Spider-Man la atrapa con su telaraña… y el frenazo brusco, acompañado de un seco «snap», parece romperle el cuello. Fue la primera vez que un cómic de superhéroes se atrevía a matar a la pareja del protagonista, y el número siguiente se cierra con la aparente muerte del propio Norman Osborn. Para muchos historiadores, aquí terminó la Edad de Plata de los cómics. Lo contamos con detalle en <a href="/blog/legado-muerte-gwen-stacy-50-anos">el legado de la muerte de Gwen Stacy</a>.</p>
${edicion('841101522X', 'El Asombroso Spiderman 6: ¡La muerte de Gwen Stacy! (Marvel Gold)', '714OtI6uOAL', 'El tomo de la colección Marvel Gold que recoge esta etapa clásica, con la historia completa y los números que la rodean.')}

<h2>2. La última cacería de Kraven (1987)</h2>
<p>Seis números entre <em>Web of Spider-Man</em>, <em>The Amazing Spider-Man</em> y <em>The Spectacular Spider-Man</em> · J. M. DeMatteis y Mike Zeck</p>
<p>Kraven derrota a Spider-Man, lo entierra vivo y se pone su traje para demostrar que puede ser mejor que él. Una historia oscura y casi poética sobre la obsesión y la muerte, que muchos consideran la mejor de Spider-Man jamás escrita. Te la analizamos en <a href="/blog/kravens-last-hunt-analisis-mejor-arco-spider-man">nuestro artículo sobre Kraven's Last Hunt</a>.</p>
${edicion('8413349354', 'Spiderman: La última cacería de Kraven (Marvel Must Have)', '71U7xm0EKXL', 'La historia completa en un solo tomo de la colección Must Have, la puerta de entrada más asequible a los grandes clásicos de Marvel.')}

<h2>3. ¡Si éste es mi destino…! (1965-1966)</h2>
<p><em>The Amazing Spider-Man</em> #31-33 · Stan Lee y Steve Ditko</p>
<p>La tía May se está muriendo y Peter necesita un suero para salvarla, pero acaba atrapado bajo toneladas de maquinaria en la guarida del Planificador Maestro —el Doctor Octopus—. La escena en la que Peter, al límite, levanta el peso a fuerza de pura voluntad es una de las páginas más famosas de la historia del cómic. Es la esencia de Spider-Man: no se rinde nunca.</p>
${edicion('8490247633', 'El Asombroso Spiderman: ¡Si éste es mi destino…! (Panini)', '81ujNMgEvuL', 'Edición de Panini dedicada a esta etapa de Lee y Ditko, en el mejor momento de la pareja creativa original del personaje.')}

<h2>4. La etapa de Roger Stern (1982-1984)</h2>
<p><em>The Amazing Spider-Man</em>, desde el #224 · Roger Stern, John Romita Jr. y otros</p>
<p>Una de las etapas más queridas por los fans veteranos. En apenas dos años, Stern dejó tres clásicos: <strong>«¡Nada puede detener al Juggernaut!»</strong> (#229-230), en la que Spider-Man se enfrenta a alguien literalmente imparable; la primera aparición del <strong>Duende</strong> (Hobgoblin) en el #238, que abrió uno de los grandes misterios de la serie; y <strong>«El niño que coleccionaba a Spider-Man»</strong> (#248), una historia corta que todavía emociona.</p>
${edicion('1302928376', 'Spider-Man by Roger Stern Omnibus (en inglés)', '91NFFNGmqAL', 'Ahora mismo, la forma más completa de leer esta etapa es este ómnibus en inglés de Marvel. Las ediciones en español de Panini se agotan con facilidad: si ves alguna disponible, merece la pena.')}

<h2>5. Spider-Man: Azul (2002)</h2>
<p>Seis números · Jeph Loeb y Tim Sale</p>
<p>En el día de San Valentín, Peter graba un mensaje para Gwen Stacy recordando cómo se enamoraron. Loeb y Sale, que ya habían hecho lo mismo con Batman y Daredevil, firman una carta de amor a la etapa clásica y al primer gran amor de Peter. Es más un romance que una historia de acción, y por eso mismo funciona tan bien.</p>
${edicion('8411507017', 'Spiderman: Azul (Marvel Must Have)', '818-ZibukRL', 'La historia completa en un tomo. Ideal para quien busca el lado más emocional del personaje.')}

<h2>6. Ultimate Spider-Man: Poder y responsabilidad (2000)</h2>
<p><em>Ultimate Spider-Man</em> #1-7 · Brian Michael Bendis y Mark Bagley</p>
<p>El origen de Spider-Man contado de nuevo para el siglo XXI, con un Peter Parker de 15 años, torpe y muy humano. Bendis se toma su tiempo —el tío Ben no muere hasta bien avanzada la historia—, y ese ritmo pausado es lo que la hace tan especial. Fue la base de muchas adaptaciones posteriores. Te lo contamos en <a href="/blog/ultimate-spider-man-bendis-analisis-run-completa">nuestro análisis de la etapa de Bendis</a>, y tienes la ficha del <a href="/comics/ultimate-spider-man-1-2000">primer número</a>.</p>
${edicion('8411016846', 'Ultimate Spiderman: Poder y responsabilidad (Panini)', '71KpSi-IqhL', 'El primer arco de la serie, perfecto tanto para veteranos como para quien no ha leído nunca un cómic de Spider-Man.')}

<h2>7. Vuelta a casa (2001)</h2>
<p><em>The Amazing Spider-Man</em> vol. 2 #30-35 · J. Michael Straczynski y John Romita Jr.</p>
<p>Un misterioso Ezekiel le plantea a Peter una pregunta incómoda: ¿y si la picadura de la araña no fue un accidente? Mientras tanto, Morlun, un ser que se alimenta de los «tótems» animales, viene a por él. Straczynski renovó la serie con ideas nuevas y un Peter adulto que trabaja como profesor en su antiguo instituto.</p>
${edicion('8413348536', 'Spiderman: Vuelta a casa (Marvel Must Have)', '91o9txbFgBS', 'La primera historia de la etapa de Straczynski en un tomo de la colección Must Have. Si te gusta, la etapa continúa en la colección Marvel Saga.')}

<h2>8. Superior Spider-Man: Mi peor enemigo (2013)</h2>
<p><em>Superior Spider-Man</em> · Dan Slott y Ryan Stegman</p>
<p>El Doctor Octopus, moribundo, cambia su mente por la de Peter Parker y se queda con su cuerpo. A partir de ahí, Otto decide demostrar que puede ser un Spider-Man «superior»: más eficaz, más implacable y bastante más arrogante. Una premisa arriesgada que salió muy bien. Te lo explicamos en <a href="/blog/superior-spider-man-doctor-octopus-analisis">nuestro análisis</a>.</p>
${edicion('8413340632', 'El Asombroso Spiderman 39: Spiderman Superior. Mi peor enemigo (Marvel Saga)', '71PNI985jPS', 'El inicio de la etapa Superior Spider-Man dentro de la colección Marvel Saga.')}

<h2>9. Miles Morales: El nuevo Spiderman (2011)</h2>
<p><em>Ultimate Comics: Spider-Man</em> · Brian Michael Bendis y Sara Pichelli</p>
<p>Tras la muerte del Peter Parker del universo Ultimate, un chico de Brooklyn llamado Miles Morales recibe la picadura de otra araña y decide tomar el relevo. Es el origen del Spider-Man que años después protagonizaría <em>Un nuevo universo</em> y que hoy es tan popular como el original.</p>
${edicion('8491677208', 'Miles Morales. Spiderman: El nuevo Spiderman 1 (Panini)', '81QY6DarCAL', 'El comienzo de la historia de Miles, por los mismos creadores que lo inventaron.')}

<h2>10. Spiderman: Toda una vida (2019)</h2>
<p>Seis números · Chip Zdarsky y Mark Bagley</p>
<p>¿Y si Spider-Man hubiera envejecido en tiempo real desde 1962? Cada número transcurre en una década distinta, desde los años sesenta hasta la de 2010, y reimagina los grandes momentos del personaje con un Peter que cumple años, se casa, tiene hijos y envejece. Es la mejor historia moderna de Spider-Man y un homenaje a toda su trayectoria.</p>
${edicion('8413342597', 'Spiderman: Toda una vida (100% Marvel HC)', '61bFzjxfvYL', 'Edición en tapa dura de Panini con la miniserie completa. Si ya conoces la historia del personaje, la disfrutarás el doble.')}

<h2>Menciones de honor</h2>
<ul>
  <li><strong>Tormento</strong> (1990), de Todd McFarlane: la historia más oscura del Lagarto y un festival del dibujo de los noventa. <a href="${amazon('8411016404')}" ${REL}>Ver en Amazon</a>.</li>
  <li><strong>Matanza Máxima</strong> (1993): el gran crossover de Carnage, con Spider-Man obligado a aliarse con Venom. <a href="${amazon('8411010430')}" ${REL}>Ver en Amazon</a>.</li>
  <li><strong>Spider-Verse</strong> (2014), de Dan Slott: la reunión de Spider-Men de todo el multiverso, con el mismo espíritu que las películas animadas del Spider-Verso.</li>
  <li><strong>Las primeras historias de Lee y Ditko</strong> (1962-1966): si te gustan los clásicos, empieza por el principio, con la <a href="/comics/the-amazing-spider-man-1-1963">ficha de The Amazing Spider-Man #1</a>.</li>
</ul>

<h2>¿Por cuál empiezo?</h2>
<p>Si nunca has leído cómics de Spider-Man, <strong>Ultimate Spider-Man</strong> o <strong>Azul</strong> son las entradas más fáciles. Si prefieres lo clásico, <strong>¡Si éste es mi destino…!</strong> y <strong>La muerte de Gwen Stacy</strong>. Y si buscas algo más adulto, <strong>La última cacería de Kraven</strong>. Para una selección pensada solo para principiantes, echa un vistazo a nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía para nuevos lectores</a>, y si buscas regalar alguno, a nuestra <a href="/blog/regalos-spider-man-navidad-guia">guía de regalos</a>.</p>
`,
};

const localFigure = (src, alt, cap) => `<figure>
  <img src="${src}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;

const JUEGOS_POST = {
  slug: 'juegos-spider-man-aranadle-test-quiz',
  title: 'Nuevos juegos de Spider-Man: Arañadle, test de cultura y ¿qué Spider-Man eres?',
  subtitle: 'Un personaje secreto cada día, un test de 10 preguntas y un quiz de personalidad. Gratis y sin registro',
  excerpt:
    'Estrenamos sección de juegos: Arañadle, para adivinar el personaje del día; un test para demostrar cuánto sabes de Spider-Man; y un quiz para descubrir qué Spider-Man del multiverso eres.',
  category: 'Noticias',
  readTime: '3 min',
  publishDate: new Date('2026-10-16'),
  image: '/images/juegos-aranadle.jpg',
  seoTitle: 'Juegos de Spider-Man: Arañadle, test y quiz de personalidad',
  seoDescription:
    'Juega gratis a Arañadle, el reto diario de adivinar el personaje de Spider-Man, al test de cultura arácnida y al quiz ¿Qué Spider-Man eres?',
  keywords: ['juegos Spider-Man', 'Arañadle', 'adivina el personaje Spider-Man', 'test Spider-Man', 'qué Spider-Man eres', 'quiz Spider-Man'],
  tags: ['juegos', 'Arañadle', 'test', 'quiz', 'novedades'],
  content: `
<p>Sentido Arácnido estrena <a href="/juegos">sección de juegos</a>. Son tres minijuegos para el navegador, gratis y sin necesidad de registrarse, construidos con los mismos datos que usamos en nuestras fichas de personajes, películas y cómics.</p>

<h2>Arañadle: adivina el personaje del día</h2>
<p>Si has jugado a Wordle, te sonará la idea. Cada día hay un <strong>personaje secreto</strong> del universo de Spider-Man, el mismo para todo el mundo. Escribe cualquier personaje y la tabla te dirá en qué se parece al secreto: género, si es héroe arácnido, villano u otro héroe de Marvel, su universo, el año de su debut, sus creadores y los grupos a los que pertenece.</p>
${localFigure('/images/juegos-aranadle.jpg', 'Una partida de Arañadle con tres intentos', 'Verde si coincide, amarillo si coincide en parte, rojo si no. La flecha del debut indica si el personaje secreto es más antiguo o más reciente.')}
<p>Tienes <strong>8 intentos</strong>, una pista tras el cuarto fallo y una imagen borrosa tras el sexto. Al terminar puedes compartir tu resultado con emojis, sin destripar la solución, y el juego lleva la cuenta de tus partidas y de tu racha. El personaje cambia cada día a medianoche. <a href="/juegos/aranadle">Juega al reto de hoy</a>.</p>

<h2>Test de cultura arácnida</h2>
<p>Diez preguntas al azar sobre películas, cómics, series, videojuegos y personajes, de más fácil a más difícil. Cada vez que juegas te salen preguntas distintas, y después de responder cada una te explicamos el dato.</p>
${localFigure('/images/juegos-test.jpg', 'Una pregunta del test de cultura arácnida', 'Tras cada respuesta, una breve explicación. Al final, tu nota, tu rango y un repaso de los fallos con enlaces para saber más.')}
<p>Según tu nota, conseguirás un rango, de «Vecino de Queens» a «Spider-Man Superior». <a href="/juegos/test-spider-man">¿Cuánto sabes de Spider-Man?</a></p>

<h2>¿Qué Spider-Man eres?</h2>
<p>Ocho preguntas sobre tu forma de ser —qué haces un sábado, qué música escuchas, cómo te enfrentas a un problema— y un resultado entre ocho Spider-Man del multiverso: Peter Parker, Miles Morales, Gwen Stacy, Miguel O'Hara, Spider-Man Noir, Spider-Ham, Pavitr Prabhakar o Mayday Parker.</p>
${localFigure('/images/juegos-quiz.jpg', 'Resultado de Miles Morales en el quiz ¿Qué Spider-Man eres?', 'Cada resultado tiene su propia descripción y enlaza a la ficha del personaje. Y si lo compartes, el enlace muestra tu resultado.')}
<p><a href="/juegos/que-spider-man-eres">Descubre qué Spider-Man eres</a>.</p>

<h2>Tus datos, solo en tu navegador</h2>
<p>Las estadísticas (partidas, rachas y mejores notas) se guardan únicamente en tu navegador: no hace falta cuenta y no recogemos ningún dato personal. Si borras los datos del navegador o juegas en modo incógnito, simplemente empezarás de cero.</p>

<p>Iremos ampliando los juegos con más personajes y preguntas. Si encuentras un dato que no cuadra o tienes una idea, <a href="/contacto">escríbenos</a>.</p>
`,
};

// Fuentes (17/10/2026): créditos de vestuario (Den of Geek, entrevista a Deborah Lynn Scott) y declaraciones
// de Tom Holland y Destin Daniel Cretton sobre el traje de Brand New Day (TheWrap, /Film)
const TRAJES = {
  slug: 'trajes-spider-man-peliculas',
  title: 'Todos los trajes de Spider-Man en las películas, de Tobey Maguire a Brand New Day',
  subtitle: 'Del disfraz de lucha libre de 2002 al traje «de calle» de Tom Holland: la evolución completa, película a película',
  excerpt:
    'Spider-Man ha estrenado más de una docena de trajes en el cine. Repasamos todos, de la trilogía de Sam Raimi al traje de Brand New Day, con lo que hace especial a cada uno.',
  category: 'Películas',
  readTime: '9 min',
  publishDate: new Date('2026-10-17'),
  image: tmdb('w1oD1MzHjnBJc5snKupIQaSBLIh'),
  seoTitle: 'Todos los trajes de Spider-Man en las películas (2002-2026)',
  seoDescription:
    'La evolución de los trajes de Spider-Man en el cine: Tobey Maguire, Andrew Garfield, Tom Holland y el Spider-Verso, hasta el nuevo traje de Brand New Day.',
  keywords: ['trajes de Spider-Man', 'trajes Spider-Man películas', 'traje Brand New Day', 'Iron Spider', 'traje integrado', 'traje negro Spider-Man'],
  tags: ['trajes', 'películas', 'MCU', 'Tom Holland', 'Brand New Day', 'Spider-Verse'],
  content: `
<p>Pocos superhéroes han cambiado tanto de vestuario en el cine como Spider-Man. Entre las películas de Tobey Maguire, Andrew Garfield y Tom Holland, el trepamuros ha estrenado más de una docena de trajes: caseros, tecnológicos, alienígenas, mágicos… y, en <em>Brand New Day</em>, uno que vuelve a sus raíces. Este es el repaso completo, película a película.</p>

<h2>La trilogía de Sam Raimi (2002-2007)</h2>
${figure('w1oD1MzHjnBJc5snKupIQaSBLIh', 'El traje rojo y el traje negro de Spider-Man 3', 'El traje clásico frente al traje negro: el gran conflicto visual de Spider-Man 3 (2007).')}

<h3>1. El disfraz de lucha libre (<em>Spider-Man</em>, 2002)</h3>
<p>Antes del traje de verdad, Peter se fabrica un disfraz improvisado —con una araña dibujada en el pecho y un pasamontañas— para ganar dinero en un combate de lucha libre. Es ahí, de hecho, donde nace el nombre de «Spider-Man».</p>

<h3>2. El traje clásico (<em>Spider-Man</em> y <em>Spider-Man 2</em>)</h3>
<p>El diseño de James Acheson, responsable del vestuario de toda la trilogía, marcó a una generación: rojo y azul, con la <strong>telaraña plateada en relieve</strong> y lentes reflectantes. Muchos fans lo siguen considerando el mejor traje de Spider-Man en imagen real, y su telaraña en relieve ha inspirado a casi todos los que vinieron después. En <em>Spider-Man 2</em> se mantuvo con pequeños retoques.</p>

<h3>3. El traje negro (<em>Spider-Man 3</em>, 2007)</h3>
<p>El simbionte alienígena cubre el traje de Peter y lo vuelve negro, con la telaraña también en relieve. Más fuerte, sí, pero también más agresivo: el traje saca la peor versión de Peter. Cuando por fin se lo quita, acaba en Eddie Brock y da lugar a Venom. Lo contamos en <a href="/blog/simbionte-historia-evolucion-venom">la historia del simbionte</a>.</p>

<h2>The Amazing Spider-Man (2012-2014)</h2>
${figure('HVcza6tJtWFrLriuh3Ano4Vt46', 'Spider-Man y Gwen Stacy en The Amazing Spider-Man', 'El traje de 2012, diseñado por Kym Barrett, buscaba un Spider-Man más atlético y distinto del de Raimi.')}

<h3>4. El traje de <em>The Amazing Spider-Man</em> (2012)</h3>
<p>Diseñado por Kym Barrett, con la tarea de ser «distinto, pero no demasiado». Peter lo fabrica él mismo, con una textura que recuerda a la de un balón, la araña negra grande en el pecho y, como novedad frente a Raimi, <strong>lanzarredes mecánicos</strong> que construye Peter, como en los cómics.</p>

<h3>5. El traje de <em>The Amazing Spider-Man 2</em> (2014)</h3>
${figure('k0hlAzTryCYX1O1LyC6P8tAa8s0', 'Spider-Man en The Amazing Spider-Man 2: El poder de Electro', 'Lentes blancas grandes y un azul más vivo: el traje de 2014 es de los más fieles a los cómics.')}
<p>Deborah Lynn Scott, ganadora del Óscar al mejor vestuario, rediseñó el traje para la secuela: <strong>lentes blancas y grandes</strong>, azul más brillante y un aspecto mucho más cercano al de los cómics. Para muchos fans, es el traje más fiel que ha tenido el personaje en imagen real.</p>

<h2>Tom Holland en el MCU (2016-2026)</h2>
${figure('tPpYGm2mVecue7Bk3gNVoSPA5qn', 'Peter Parker con el traje de Stark y una sudadera en Homecoming', 'El traje de Stark en Homecoming (2017), con sus ojos móviles y una inteligencia artificial propia.')}

<h3>6. El traje casero (<em>Capitán América: Civil War</em> y <em>Homecoming</em>)</h3>
<p>Una sudadera roja, unas gafas y mucha imaginación: el primer traje del Peter de Holland, el que llevaba antes de conocer a Tony Stark. En <em>Homecoming</em> tiene que volver a ponérselo cuando Stark le quita el suyo.</p>

<h3>7. El traje de Stark (<em>Civil War</em> y <em>Homecoming</em>)</h3>
<p>El regalo de Tony Stark: rojo y azul, con <strong>ojos que se mueven</strong> como en los cómics. En <em>Homecoming</em> descubrimos todo lo que esconde: una inteligencia artificial, Karen; un «protocolo de ruedines» para limitar sus funciones; alas de telaraña para planear y cientos de combinaciones para los lanzarredes.</p>

<h3>8. La Armadura de Hierro, «Iron Spider» (<em>Infinity War</em> y <em>Endgame</em>)</h3>
<p>El traje que Peter rechaza al final de <em>Homecoming</em> y acaba usando en <em>Vengadores: Infinity War</em>: hecho de nanotecnología, se despliega solo y tiene <strong>cuatro patas mecánicas</strong> en la espalda. Es el traje con el que Peter pelea contra Thanos.</p>

<h3>9. El traje sigiloso (<em>Lejos de casa</em>, 2019)</h3>
<p>Un traje negro que Nick Fury le proporciona en Europa para pasar desapercibido. Con él, Peter se convierte por unos días en un misterioso héroe europeo que acaba conociéndose como «Night Monkey».</p>

<h3>10. El traje rojo y negro (<em>Lejos de casa</em>)</h3>
${figure('34jW8LvjRplM8Pv06cBFDpLlenR', 'Spider-Man colgado boca abajo en Venecia en Lejos de casa', 'El traje rojo y negro de Lejos de casa, el primero que Peter diseña él solo con tecnología de Stark.')}
<p>El primer traje que <strong>Peter diseña él solo</strong>, con el fabricador de Stark a bordo del avión de Happy. Cambia el azul por el negro y fue uno de los más populares entre los fans.</p>

<h3>11. El traje integrado (<em>No Way Home</em>, 2021)</h3>
${figure('Bwh7Lol5k3hSqYOtqXWxbbJVMx', 'Spider-Man con el traje integrado y el Doctor Strange en No Way Home', 'El traje integrado de No Way Home combina el rojo y el azul con detalles dorados.')}
<p>Rojo, azul y con detalles <strong>dorados</strong>: combina la nanotecnología de la Armadura de Hierro con el diseño de <em>Lejos de casa</em>. Además, Peter usa una variante <strong>negra y dorada</strong> en algunas escenas de la película.</p>

<h3>12. El traje cosido a mano (final de <em>No Way Home</em>)</h3>
<p>Después del hechizo de Strange, sin dinero y sin nadie que le recuerde, Peter se cose un traje nuevo en su piso: rojo y azul brillante, con la telaraña en relieve. Es el primer traje del Peter de Holland <strong>sin tecnología de Stark</strong>, y el más parecido a los cómics hasta ese momento. Ese plano final, con Peter balanceándose por Nueva York, es el punto de partida de todo lo que viene después.</p>

<h3>13. El traje de <em>Brand New Day</em> (2026)</h3>
${figure('4tjxYg2AbOzzG9G1YuiT2NzYhlH', 'Spider-Man con su traje de Brand New Day', 'Imagen promocional de Brand New Day: un traje más sencillo y «de calle», con la telaraña en relieve.')}
<p>El nuevo traje sigue el camino del final de <em>No Way Home</em>: nada de tecnología punta. Tom Holland lo describió como una mezcla de los trajes de Tobey Maguire y Andrew Garfield, un «hijo arácnido» de los tres, con la <strong>telaraña en relieve</strong> y una <strong>araña más grande en el pecho</strong>. El director, Destin Daniel Cretton, explicó que querían un traje más práctico y con arrugas visibles, para que se notara la persona que hay debajo. En algunos planos de los tráileres, además, los ojos se vuelven rojos y negros; lo contamos en <a href="/blog/brand-new-day-trailer-easter-eggs-detalles-ocultos">los detalles ocultos de los tráileres</a>.</p>

<h2>Y en el Spider-Verso</h2>
${figure('8mnXR9rey5uQ08rZAvzojKWbDQS', 'Miles Morales con su traje en Spider-Man: Un nuevo universo', 'El traje negro y rojo de Miles, uno de los más reconocibles del cine de animación.')}
<p>Las películas animadas tienen su propio desfile de trajes. El de <strong>Miles Morales</strong> en <em>Un nuevo universo</em> —negro con la araña roja, que Miles personaliza con spray— se ha convertido en un icono por sí mismo. A su lado, el traje blanco con capucha de <strong>Gwen Stacy</strong>, el de <strong>Spider-Man Noir</strong> en blanco y negro y, en <em>Cruzando el Multiverso</em>, cientos de variantes, de Spider-Punk al traje del <strong>Spider-Man 2099</strong> de Miguel O'Hara.</p>

<h2>¿Cuál es el mejor?</h2>
<p>No hay una respuesta única, pero hay tres que se repiten en casi todas las listas de fans: el <strong>traje clásico de Raimi</strong> por su telaraña en relieve, el de <strong>The Amazing Spider-Man 2</strong> por su fidelidad a los cómics y el <strong>traje cosido a mano de No Way Home</strong>, por todo lo que significa para el personaje. El de Brand New Day, que mezcla lo mejor de los anteriores, aspira a unirse al club.</p>

<h2>Lleva tu traje favorito a la estantería</h2>
${gift({ asin: 'B0G1TXWSG4', name: 'Marvel Legends · Spider-Man (Brand New Day)', img: 'https://m.media-amazon.com/images/I/610AmlzYxvL._AC_SL500_.jpg', text: 'El traje nuevo de Brand New Day a escala de 15 cm, con manos intercambiables y efectos de telaraña.' })}
${gift({ asin: 'B0FPNH2G4P', name: 'Funko Pop! · Spider-Man traje casero de No Way Home', img: 'https://m.media-amazon.com/images/I/81-+7FhxC9L._AC_SL500_.jpg', text: 'El traje que Peter se cose al final de No Way Home, en la colección Funko de Brand New Day.' })}
${gift({ asin: 'B08T5XCJ5L', name: 'Funko Pop! · Spider-Man traje integrado (No Way Home)', img: 'https://m.media-amazon.com/images/I/71Wwc55Sy5L._AC_SL500_.jpg', text: 'El traje rojo, azul y dorado de No Way Home.' })}
${gift({ asin: 'B0FHKY4D5M', name: 'Marvel Legends · The Amazing Spider-Man (No Way Home)', img: 'https://m.media-amazon.com/images/I/613SU5JvFrL._AC_SL500_.jpg', text: 'El traje de Andrew Garfield tal como aparece en No Way Home.' })}
<p><em>Como afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.</em> Tienes más figuras y Funko de Spider-Man en <a href="/tienda">nuestra tienda</a>.</p>

<p>¿Quieres verlas todas en orden? Te lo contamos en <a href="/blog/orden-ver-peliculas-spider-man">en qué orden ver las películas de Spider-Man</a>.</p>
`,
};

const villano = (n, name, actor, film, text) => `<h3>${n}. ${name}</h3>
<p><strong>${actor}</strong> · ${film}</p>
<p>${text}</p>`;

const VILLANOS_CINE = {
  slug: 'villanos-spider-man-peliculas-ranking',
  title: 'Los villanos de Spider-Man en el cine, de peor a mejor',
  subtitle: 'Del Rino de Paul Giamatti al Doctor Octopus de Alfred Molina: todos los grandes villanos de las películas, ordenados',
  excerpt:
    'Ordenamos a los villanos de las películas de Spider-Man, de Sam Raimi a Tom Holland pasando por el Spider-Verso, del menos al más memorable. ¿Coincides con nuestro número uno?',
  category: 'Películas',
  readTime: '9 min',
  publishDate: new Date('2026-10-17'),
  image: tmdb('fn4n6uOYcB6Uh89nbNPoU2w80RV'),
  seoTitle: 'Villanos de Spider-Man en el cine: ranking de peor a mejor',
  seoDescription:
    'Ranking de los villanos de las películas de Spider-Man, de peor a mejor: Doctor Octopus, Duende Verde, el Buitre, Mysterio, Venom, Electro y más.',
  keywords: ['villanos Spider-Man películas', 'ranking villanos Spider-Man', 'mejor villano Spider-Man', 'Doctor Octopus Alfred Molina', 'Duende Verde Willem Dafoe', 'Buitre Michael Keaton'],
  tags: ['villanos', 'ranking', 'películas', 'MCU', 'Sam Raimi', 'Spider-Verse'],
  content: `
<p>Un héroe es tan bueno como sus villanos, y Spider-Man tiene la mejor galería de enemigos de Marvel. Pero en el cine no todos han tenido la misma suerte: algunos son de los mejores villanos del género y otros apenas tuvieron unos minutos. Este es nuestro ranking de los villanos de las películas de Spider-Man, <strong>de peor a mejor</strong>.</p>
<p>Hemos dejado fuera a los villanos del universo de Sony sin Spider-Man y los de <em>Brand New Day</em>, para no destripar nada a quien todavía no la haya visto. Si lo que buscas es el ranking de los villanos de los cómics, lo tienes en <a href="/blog/mejores-villanos-spider-man-ranking-definitivo">los 10 mejores villanos de Spider-Man</a>.</p>

<h2>Los que merecían más</h2>
${villano(14, 'El Rino', 'Paul Giamatti', '<em>The Amazing Spider-Man 2</em> (2014)', 'Abre y cierra la película, pero apenas tiene minutos en pantalla. Giamatti se lo pasa en grande con el acento ruso y la armadura robótica del final promete una pelea que nunca llega a verse.')}
${villano(13, 'Shocker', 'Logan Marshall-Green y Bokeem Woodbine', '<em>Spider-Man: Homecoming</em> (2017)', 'En <em>Homecoming</em> hay dos Shocker, los secuaces del Buitre que usan su guantelete. Cumplen como rivales de barrio para un Spider-Man novato, pero no pasan de ahí.')}
${villano(12, 'Venom', 'Topher Grace', '<em>Spider-Man 3</em> (2007)', 'Es de sobra conocido que Sam Raimi no quería incluir a Venom, y se nota: llega tarde, comparte película con otros dos villanos y apenas tiene tiempo para ser una amenaza. Topher Grace hace un Eddie Brock interesante como rival de Peter en el periódico, pero el personaje merecía su propia historia.')}
${villano(11, 'El Duende Verde (Harry Osborn)', 'Dane DeHaan', '<em>The Amazing Spider-Man 2</em> (2014)', 'La transformación de Harry es demasiado rápida para que funcione del todo, aunque su papel en el desenlace de la película, el que cambia para siempre la vida de Peter, es uno de los momentos más duros de la saga.')}
${villano(10, 'El Lagarto', 'Rhys Ifans', '<em>The Amazing Spider-Man</em> (2012)', 'El Dr. Curt Connors tiene una buena base —el científico que quiere recuperar su brazo—, pero su plan de convertir a toda la ciudad en reptiles y su diseño digital lo dejan a medio camino. Volvió brevemente en <em>No Way Home</em>.')}

<h2>La zona media</h2>
${figure('u7SeO6Y42P7VCTWLhpnL96cyOqd', 'Spider-Man frente a Electro y el Duende Verde en The Amazing Spider-Man 2', 'The Amazing Spider-Man 2 reunió a Electro, el Duende Verde y el Rino en una sola película.')}
${villano(9, 'Electro', 'Jamie Foxx', '<em>The Amazing Spider-Man 2</em> (2014) y <em>No Way Home</em> (2021)', 'Max Dillon, el trabajador invisible que se obsesiona con Spider-Man, tiene una idea interesante detrás y una de las bandas sonoras más recordadas de la saga. Su segunda oportunidad en <em>No Way Home</em>, con un aspecto más clásico y mucho más carisma, le sienta de maravilla.')}
${villano(8, 'El Nuevo Duende (Harry Osborn)', 'James Franco', '<em>Spider-Man 3</em> (2007)', 'Tres películas de amistad rota dan peso a su arco: el hijo que culpa a su mejor amigo de la muerte de su padre. Su final, sacrificándose para salvar a Peter, cierra la trilogía con emoción.')}
${villano(7, 'El Hombre de Arena', 'Thomas Haden Church', '<em>Spider-Man 3</em> (2007)', 'Flint Marko es un villano trágico: un padre desesperado por pagar el tratamiento de su hija. La escena de su «nacimiento» en la arena es de lo mejor de la película y su redención final le da una dimensión que pocos villanos tienen.')}
${villano(6, 'La Mancha', 'Jason Schwartzman (voz)', '<em>Spider-Man: Cruzando el Multiverso</em> (2023)', 'Empieza como un chiste —«un villano de la semana»— y acaba convertido en una amenaza para todo el multiverso. Su evolución es uno de los grandes aciertos de la película, y la historia sigue en <em>Beyond the Spider-Verse</em>.')}

<h2>Los mejores</h2>
${villano(5, 'Kingpin', 'Liev Schreiber (voz)', '<em>Spider-Man: Un nuevo universo</em> (2018)', 'Un diseño enorme y desproporcionado, casi una mole, y una motivación sorprendentemente humana: abrir el multiverso para recuperar a la mujer y al hijo que perdió. Uno de los villanos animados más memorables del cine de superhéroes.')}
${figure('vamhMTvh9m9zFHDoR0v1nRtf6T4', 'Mysterio y Spider-Man en Lejos de casa', 'El Mysterio de Jake Gyllenhaal: el maestro de las ilusiones que se gana la confianza de Peter.')}
${villano(4, 'Mysterio', 'Jake Gyllenhaal', '<em>Spider-Man: Lejos de casa</em> (2019)', 'Quentin Beck se presenta como un héroe de otra Tierra y resulta ser un antiguo empleado de Stark experto en ilusiones. La secuencia en la que atrapa a Peter en sus ilusiones es de las más creativas del MCU, y su venganza final —revelar al mundo quién es Spider-Man— cambia el rumbo de la saga.')}
${villano(3, 'El Buitre', 'Michael Keaton', '<em>Spider-Man: Homecoming</em> (2017)', 'Adrian Toomes es un villano de clase trabajadora con motivos comprensibles. Y tiene la mejor escena de tensión del MCU: el trayecto en coche en el que Peter descubre que el padre de su cita para el baile es el hombre al que lleva toda la película persiguiendo.')}
${villano(2, 'El Duende Verde (Norman Osborn)', 'Willem Dafoe', '<em>Spider-Man</em> (2002) y <em>No Way Home</em> (2021)', 'La escena del espejo, en la que Norman discute con su otra personalidad, lo dice todo: Dafoe es aterrador y divertido a la vez. Casi veinte años después volvió en <em>No Way Home</em> en plena forma y protagonizó el momento más doloroso de la película.')}
${figure('faV0HuR6WnQoLrVq3r6mhjaABL9', 'Spider-Man contra el Doctor Octopus en el tren de Spider-Man 2', 'La pelea del tren de Spider-Man 2, con el Doctor Octopus de Alfred Molina.')}
${villano(1, 'Doctor Octopus', 'Alfred Molina', '<em>Spider-Man 2</em> (2004) y <em>No Way Home</em> (2021)', 'Otto Octavius es un genio amable y un mentor para Peter hasta que su experimento de fusión fracasa y los brazos mecánicos toman el control de su mente. Es un villano trágico, con una pelea del tren que sigue siendo de las mejores del género y un final, sacrificándose para destruir su propio reactor, a la altura. Para nosotros, y para buena parte de los fans, el mejor villano de Spider-Man en el cine. Te lo contamos en <a href="/blog/spider-man-2-2004-analisis-mejor-pelicula-superheroes">nuestro análisis de Spider-Man 2</a>.')}

<h2>Menciones</h2>
<ul>
  <li><strong>El Escorpión</strong> (Michael Mando): debutó como Mac Gargan en <em>Homecoming</em>, con una escena poscréditos que prometía su transformación, y por fin aparece como villano en <em>Brand New Day</em>.</li>
  <li><strong>El Merodeador</strong> de <em>Un nuevo universo</em>: más que un villano, es el giro más doloroso de la película para Miles.</li>
  <li>Los villanos de <strong>Brand New Day</strong>: si ya la has visto, te lo contamos todo en <a href="/blog/spider-man-brand-new-day-final-explicado">el final explicado</a> (con spoilers).</li>
</ul>

<p>¿Y tú, con cuál te quedas? Si quieres repasar las películas en orden, aquí tienes <a href="/blog/orden-ver-peliculas-spider-man">en qué orden ver las películas de Spider-Man</a>, y si te van los villanos en la estantería, en <a href="/tienda">nuestra tienda</a> tienes al Duende Verde, a Carnage o a Hulk en figura y Funko Pop.</p>
`,
};

// Figuras comprobadas en Amazon.es el 17/10/2026 (stock, título, descripción del fabricante e imagen)
const figura = (asin, name, imgId, text) => gift({ asin, name, img: `https://m.media-amazon.com/images/I/${imgId}._AC_SL500_.jpg`, text });

const MARVEL_LEGENDS = {
  slug: 'mejores-figuras-marvel-legends-spider-man',
  title: 'Las mejores figuras Marvel Legends de Spider-Man (guía 2026)',
  subtitle: 'Películas, Spider-Verso, cómics y videojuegos: las figuras de 15 cm que merecen un hueco en tu estantería, todas disponibles en Amazon',
  excerpt:
    'Marvel Legends es la línea de referencia para coleccionar a Spider-Man. Te ayudamos a elegir entre las figuras disponibles ahora mismo: de Brand New Day a los diseños retro de los cómics.',
  category: 'Guías',
  readTime: '8 min',
  publishDate: new Date('2026-10-17'),
  image: '/images/mejores-figuras-marvel-legends.jpg',
  seoTitle: 'Las mejores figuras Marvel Legends de Spider-Man (2026)',
  seoDescription:
    'Guía de figuras Marvel Legends de Spider-Man: Brand New Day, No Way Home, Spider-Verso, Retro de los cómics y Gamerverse. Todas disponibles en Amazon.',
  keywords: ['Marvel Legends Spider-Man', 'figuras Spider-Man', 'mejores figuras Marvel Legends', 'Marvel Legends Retro', 'figura Spider-Man coleccionista', 'Hasbro Spider-Man'],
  tags: ['figuras', 'Marvel Legends', 'coleccionismo', 'guía', 'regalos', 'Hasbro'],
  content: `
<p><em>Como afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios cambian a menudo, así que consúltalos en Amazon antes de comprar.</em></p>

<p><strong>Marvel Legends</strong> es la línea de figuras de Hasbro para coleccionistas: personajes de unos <strong>15 cm</strong>, con muchos puntos de articulación y accesorios para recrear sus poses más famosas (manos intercambiables, efectos de telaraña, cabezas alternativas…). Y Spider-Man es, con diferencia, uno de los personajes con más figuras de toda la colección.</p>
<p>Hay tantas que elegir no es fácil. Hemos repasado las que están disponibles ahora mismo en Amazon y las hemos ordenado por lo que más le gusta a cada fan: el cine, el Spider-Verso, los cómics o los videojuegos.</p>

<h2>Antes de elegir: las tres «familias»</h2>
<ul>
  <li><strong>Marvel Legends Series:</strong> la línea principal, con personajes de las películas, de las series y de los cómics.</li>
  <li><strong>Retro:</strong> figuras que vienen en un blíster de cartón ilustrado, como los juguetes de los años 90. Muchos coleccionistas las guardan sin abrir porque la caja luce casi tanto como la figura.</li>
  <li><strong>Gamerverse:</strong> personajes y trajes de los videojuegos de Insomniac.</li>
</ul>
<p>Todas comparten la misma escala, así que puedes mezclarlas sin problema en la misma estantería.</p>

<h2>Si solo vas a comprar una</h2>
${figura('B0G1TXWSG4', 'Marvel Legends · Spider-Man (Brand New Day)', '610AmlzYxvL', 'El traje nuevo de Tom Holland, con manos intercambiables y dos efectos de telaraña. Es la figura más actual y la que mejor representa al Spider-Man de hoy. Si dudas, empieza por esta.')}

<h2>Las del cine</h2>
${figura('B0FHKY4D5M', 'Marvel Legends · The Amazing Spider-Man (No Way Home)', '613SU5JvFrL', 'El Spider-Man de Andrew Garfield tal como aparece en No Way Home, en una pose de acción muy dinámica. Para quien se emocionó con su regreso.')}
${figura('B0G3T46ZPJ', 'Marvel Legends · Duende Verde Deluxe (No Way Home)', '61dD5O+tvuL', 'El Norman Osborn de Willem Dafoe con su armadura original, en formato deluxe: incluye el planeador, cabezas y efectos de explosión. Uno de los villanos mejor resueltos de la línea.')}
${figura('B0G1TXHCM1', 'Marvel Legends · Hulk (Brand New Day)', '61h9wTwV00L', 'El Hulk de Brand New Day, con cabeza y manos intercambiables. Es más grande que el resto, así que impone en cualquier vitrina junto al Spider-Man de la película.')}

<h2>Las del Spider-Verso</h2>
<p>Las películas animadas tienen algunos de los diseños más llamativos de toda la colección. Si te gustó <a href="/blog/across-the-spider-verse-analisis">Cruzando el Multiverso</a>, aquí hay para elegir:</p>
${figura('B09QXRBY7F', 'Marvel Legends · Miles Morales (Cruzando el Multiverso)', '71NHqnd84LL', 'El Miles de la película, con su traje negro y rojo. Imprescindible si solo quieres una figura del Spider-Verso.')}
${figura('B0CSHFF23B', 'Marvel Legends · Spider-Gwen (Cruzando el Multiverso)', '61VhHf5q4PL', 'Gwen Stacy con su traje blanco y capucha, con cabeza sin máscara intercambiable.')}
${figura('B0CSGVG9GT', 'Marvel Legends · Pavitr Prabhakar (Cruzando el Multiverso)', '61M-Lu8WR5L', 'El Spider-Man India de la película, con cabeza alternativa sin máscara. Uno de los personajes más queridos de la secuela.')}
${figura('B0CSGZH1QJ', 'Marvel Legends · Miles G. Morales (Cruzando el Multiverso)', '71Uuz+sJQUL', 'El Miles alternativo de la Tierra-42, convertido en el Merodeador. El giro final de la película, ahora en tu estantería.')}

<h2>Las de los cómics y la animación (Retro)</h2>
${figura('B0FHKYK8B2', 'Marvel Legends Retro · Spider-Man 2099', '81SNLLMg45L', "Miguel O'Hara con su diseño clásico de los cómics de los 90, en blíster ilustrado. De las más bonitas para guardar sin abrir.")}
${figura('B0FJRDMYHV', 'Marvel Legends Retro · Spider-Man Noir', '81JMtnfiiHL', 'El Spider-Man de los años 30 inspirado en los cómics, con una caja en blanco y negro que es una pequeña obra de arte.')}
${figura('B0FHL22V6X', 'Marvel Legends Retro · Spider-Venom (traje negro)', '81WKyBKMLYL', 'Spider-Man con el traje negro alienígena de los cómics, el que acabaría convirtiéndose en Venom. Te contamos su historia en <a href="/blog/simbionte-historia-evolucion-venom">la historia del simbionte</a>.')}
${figura('B09H14KKZM', 'Marvel Legends · Spider-Man estilo animación', '61hB0GhWkyL', 'Un Spider-Man clásico con acabado que imita los dibujos animados y seis accesorios. Un homenaje a las series animadas, en caja retro.')}
${figura('B0CYTJWSNS', 'Marvel Legends Retro · El Merodeador (serie animada de 1994)', '712WvNcz7XL', 'El Prowler tal como aparecía en Spider-Man: La serie animada de los 90. Para los que crecieron con ella; te la recordamos en <a href="/blog/spider-man-animated-series-1994-analisis">nuestro análisis de la serie</a>.')}

<h2>Las de los videojuegos (Gamerverse)</h2>
${figura('B0FQJ2KN6Q', 'Marvel Legends Gamerverse · Peter Parker traje Velocity', '51U3U3gG3pL', "El Peter Parker del Marvel's Spider-Man de Insomniac con el traje Velocity, uno de los más populares del juego.")}
${figura('B0D9ZTC95M', 'Marvel Legends Gamerverse · Miles Morales traje mejorado', '61AprYtHQCL', "Miles con el traje mejorado de Marvel's Spider-Man 2, con efectos de su descarga bioeléctrica y manos intercambiables.")}
${figura('B0D9ZMGCSN', 'Marvel Legends Gamerverse · Miles Morales traje Boricua', '41hdpAXGiLL', 'El traje con los colores de la bandera de Puerto Rico que Miles puede llevar en Spider-Man 2, un guiño a sus raíces.')}

<h2>Para empezar una colección de golpe</h2>
${figura('B09VYJ6KKP', 'Marvel Legends · Pack de 5 figuras de Spider-Man (exclusivo Amazon)', '61IcCNfSTXL', 'Spider-Man con el traje negro y cuatro villanos clásicos de los cómics: Silvermane, la Mosca Humana, Molten Man y Razorback. Una forma rápida de llenar una estantería con personajes que rara vez tienen figura.')}

<h2>Consejos antes de comprar</h2>
<ul>
  <li><strong>Mira quién lo vende.</strong> Si lo vende y lo envía Amazon, la compra y las devoluciones son más sencillas. Algunas figuras solo las ofrecen otros vendedores, a veces más caras.</li>
  <li><strong>Los precios bailan mucho.</strong> Las Marvel Legends suelen bajar en momentos concretos del año, y el <strong>Black Friday</strong> (este año, el 27 de noviembre) es uno de ellos.</li>
  <li><strong>Las Retro, mejor en caja.</strong> Si te gusta exponerlas sin abrir, busca las de blíster ilustrado; si las quieres para posar, cualquier figura de la línea te dará mucho juego.</li>
  <li><strong>¿Es para un niño?</strong> Las Marvel Legends son figuras de coleccionista y tienen piezas pequeñas. Para jugar, mejor la línea Titan Hero o las figuras Bend and Flex; las tienes en nuestra <a href="/blog/regalos-spider-man-navidad-guia">guía de regalos</a>.</li>
</ul>

<p>Tienes estas y otras figuras en <a href="/tienda?categoria=Figuras">nuestra tienda</a>. Y si quieres saber de dónde salen todos estos trajes, te lo contamos en <a href="/blog/trajes-spider-man-peliculas">todos los trajes de Spider-Man en las películas</a>.</p>
`,
};

// Sets comprobados en Amazon.es el 17/10/2026 (stock, título, edad y contenido según el fabricante, imagen)
const MEJORES_LEGO = {
  slug: 'mejores-sets-lego-spider-man',
  title: 'Los mejores sets de LEGO de Spider-Man por edades (2026)',
  subtitle: 'De los LEGO Duplo para los más pequeños al Daily Bugle para coleccionistas: qué set elegir según la edad y el fan',
  excerpt:
    'Hay sets de LEGO de Spider-Man para todas las edades, de los 2 años a los coleccionistas adultos. Los ordenamos por edad para que aciertes, con los nuevos sets de Brand New Day incluidos.',
  category: 'Guías',
  readTime: '8 min',
  publishDate: new Date('2026-10-17'),
  image: '/images/mejores-lego-spider-man.jpg',
  seoTitle: 'Los mejores sets de LEGO de Spider-Man por edades (2026)',
  seoDescription:
    'Guía de sets de LEGO de Spider-Man por edades: Duplo y Spidey para peques, sets de Brand New Day y el Daily Bugle para coleccionistas. Todos en Amazon.',
  keywords: ['LEGO Spider-Man', 'mejores sets LEGO Spider-Man', 'LEGO Spider-Man por edades', 'LEGO Daily Bugle', 'LEGO Spidey', 'LEGO Brand New Day'],
  tags: ['LEGO', 'regalos', 'guía', 'niños', 'coleccionismo', 'Brand New Day'],
  content: `
<p><em>Como afiliados de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios cambian a menudo, así que consúltalos en Amazon antes de comprar.</em></p>

<p>LEGO tiene sets de Spider-Man para casi cualquier edad: bloques grandes para los que aún no saben leer, persecuciones y batallas para los que empiezan a montar solos, escenas de las películas y auténticas maquetas de exposición para adultos. Los hemos ordenado por la <strong>edad que recomienda LEGO</strong>, que es la mejor pista para acertar.</p>

<h2>Para los más pequeños (de 2 a 5 años)</h2>
<p>La línea <strong>Spidey</strong> está basada en la serie de animación <em>Spidey y su superequipo</em> de Disney Junior. Usa piezas grandes y fáciles de encajar, pensadas para que los peques monten casi solos.</p>
${figura('B01N5B2OKI', 'LEGO Duplo 10464 · Aracnocuartel de Spidey y su Superequipo', '81Msc-HyBfL', 'Para los más pequeños, a partir de 2 años: piezas Duplo grandes, Miles en su moto, Rino y un cuartel lleno de accesorios para jugar a los superhéroes.')}
${figura('B0FPXDYJYK', 'LEGO Spidey 11206 · Spidey en su moto vs. Rino', '81YWo7OvlJL', 'A partir de 4 años. Un set pequeño y rápido de montar, con las minifiguras de Spidey y Rino. Perfecto como primer LEGO.')}
${figura('B0DHSB8HP8', 'LEGO Spidey 11198 · Spin y Electro: duelo de vehículos dinosaurio', '81YggWErRzL', 'A partir de 4 años. Miles («Spin») persigue a Electro en coches con forma de dinosaurio; cada vehículo viene en su propia bolsa para que monten paso a paso.')}
${figura('B0FMK5H64X', 'LEGO Spidey 11208 · Barco pirata del Equipo Spidey', '81puGDduiRL', 'A partir de 4 años. Un barco pirata para recuperar el tesoro que ha robado el Duende Verde, con Spidey, Spider Fantasma, Spin y el Duende Verde.')}

<h2>De 6 a 7 años: armaduras y persecuciones</h2>
${figura('B0FPXGZQ1Y', 'LEGO Marvel 76337 · Armadura robótica de Miles Morales vs. Spider-Man 2099', '81ctpWlvKoL', 'A partir de 6 años. Una armadura articulada con cabina para Miles y la minifigura del Spider-Man 2099, inspirada en Cruzando el Multiverso.')}
${figura('B0FPXFPLRZ', 'LEGO Marvel 76338 · Batalla de armaduras robóticas: Spider-Man vs. Doc Ock', '81fxKlQFTUL', 'A partir de 6 años. Dos armaduras articuladas, una para Spider-Man y otra para Doc Ock, con Spider Fantasma de refuerzo.')}
${figura('B0DHSC1BF8', 'LEGO Marvel 76309 · Spider-Man vs. coche brutal de Venom', '811uRAsOuSL', 'A partir de 7 años. Venom huye con un botín de lingotes de oro en su coche venomizado, y Spider-Man y Spider-Woman (Julia Carpenter) salen tras él.')}
${figura('B0CFW281JH', 'LEGO Marvel 76279 · Coche de carreras de Spider-Man y Duende Verde venomizado', '81G2yryswfL', 'A partir de 7 años. El coche de Spider-Man contra el planeador del Duende Verde, con Spider Fantasma en monopatín.')}

<h2>Los sets de Brand New Day (8 años en adelante)</h2>
<p>La nueva película de Tom Holland también ha llegado a LEGO, con algunos de sus personajes más inesperados:</p>
${figura('B0FTFSDHK7', 'LEGO Marvel 76350 · Spider-Man vs. Hulk: choque épico', '81iW4XviFML', 'A partir de 8 años. Un edificio cuya fachada salta por los aires para que aparezca Hulk, con las minifiguras de Spider-Man, Tarántula, el Escorpión y Bumerán. El set más espectacular de la película.')}
${figura('B0FRSMF77X', 'LEGO Marvel 76349 · Spider-Man: persecución del furgón penitenciario', '81LbwDXJ+tL', 'A partir de 8 años. Un furgón blindado de seis ruedas con prisión a bordo, Spider-Man, Lápida, Tarántula y un guardia del Departamento de Control de Daños.')}

<h2>Escenas de las películas (9 años en adelante)</h2>
${figura('B0DWF13RP3', 'LEGO Marvel 76321 · Spider-Man vs. Doc Ock: escena del tren', '81NL3dD1QML', 'A partir de 9 años. La pelea del tren de Spider-Man 2 (2004), con Spider-Man, Doc Ock, J. Jonah Jameson y la tía May. Un guiño a la que para muchos es la mejor escena del cine de Spider-Man.')}
${figura('B0FPXDZ53R', 'LEGO Marvel 76334 · Batalla legendaria: Spider-Man vs. Sandman', '81+zV0MzraL', 'A partir de 9 años. Una pequeña escena de Spider-Man 3 con Spider-Man, Venom y el Hombre de Arena, pensada tanto para jugar como para exponer.')}
${figura('B0FPXG5S99', 'LEGO Marvel 76342 · Spider-Man vs. Mysterio: el Daily Bugle', '91wzuHrIlvL', 'A partir de 10 años. Un Daily Bugle de cuatro plantas, más pequeño que el gran set de coleccionista y pensado también para jugar, con siete minifiguras: Spider-Man, Miles, Spider Fantasma, J. Jonah Jameson, Mysterio y más.')}

<h2>Figuras para construir</h2>
<p>Una alternativa a las minifiguras: Spider-Man grande, articulado y montado pieza a pieza.</p>
${figura('B09QFWKFS1', 'LEGO Marvel 76226 · Figura articulada de Spider-Man', '91A1b-4we-L', 'A partir de 8 años. Un Spider-Man de unos 24 cm totalmente articulado, para montar, posar y llevar a cualquier parte.')}
${figura('B09QFXWTVQ', 'LEGO Marvel 76225 · Figura articulada de Miles Morales', '91f4KT9lhqL', 'A partir de 8 años. El compañero perfecto del anterior: Miles Morales de unos 23 cm, también articulado.')}
${figura('B0FR9QQ1B1', 'LEGO Marvel 76346 · Figura de héroe: Spider-Man (Brand New Day)', '81aWzJIdxTL', 'A partir de 12 años. El Spider-Man de Brand New Day a lo grande: unos 36 cm y 24 puntos de articulación, con una minifigura de regalo.')}

<h2>Para adultos y coleccionistas</h2>
${figura('B09FM3RWP2', 'LEGO Marvel 76178 · Daily Bugle', '81ZyiKnKhRL', 'El set definitivo de Spider-Man: 3.772 piezas y 25 minifiguras, de Doctor Octopus y Venom a Spider-Gwen, Black Cat, Daredevil o el Punisher. Para mayores de 18 años y con espacio en la estantería.')}
${figura('B08GYFKMS7', 'LEGO Marvel 76187 · Venom', '81q8FIboqjS', 'Una maqueta de la cabeza de Venom con su mandíbula y su lengua, sobre una base con placa informativa. Para mayores de 18 años; queda muy bien junto a otros bustos LEGO.')}

<h2>Consejos para acertar</h2>
<ul>
  <li><strong>Respeta la edad de la caja.</strong> No es solo por las piezas pequeñas: indica también lo difícil que es el montaje. Un set de 9 años puede frustrar a un niño de 6.</li>
  <li><strong>Las minifiguras importan.</strong> Para muchos niños (y no tan niños), lo mejor del set son los personajes que trae. Fíjate en cuáles incluye cada uno.</li>
  <li><strong>Black Friday.</strong> LEGO suele bajar de precio en esas fechas; este año es el <strong>27 de noviembre</strong>.</li>
  <li><strong>Mira quién lo vende.</strong> Si lo vende y lo envía Amazon, la compra y las devoluciones son más sencillas.</li>
</ul>

<p>¿Buscas más ideas? Tienes nuestra <a href="/blog/regalos-spider-man-navidad-guia">guía de regalos de Spider-Man</a>, <a href="/blog/mejores-figuras-marvel-legends-spider-man">las mejores figuras Marvel Legends</a> y todos los productos en <a href="/tienda?categoria=Juguetes">nuestra tienda</a>.</p>
`,
};

const pj = (slug, name) => `<a href="/personajes/${slug}">${name}</a>`;

const TRES_SPIDERMAN = {
  slug: 'tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man',
  title: 'Tobey Maguire vs. Andrew Garfield vs. Tom Holland: ¿quién es el mejor Spider-Man?',
  subtitle: 'Peter Parker, Spider-Man, villanos, historias de amor y taquilla: comparamos a los tres trepamuros del cine, categoría a categoría',
  excerpt:
    'Es el gran debate de los fans: ¿Tobey Maguire, Andrew Garfield o Tom Holland? Comparamos a los tres Spider-Man del cine en siete categorías, con datos, para ver quién gana en qué.',
  category: 'Películas',
  readTime: '9 min',
  publishDate: new Date('2026-10-17'),
  image: tmdb('4tjxYg2AbOzzG9G1YuiT2NzYhlH'),
  seoTitle: 'Maguire vs. Garfield vs. Holland: ¿quién es el mejor Spider-Man?',
  seoDescription:
    'Comparamos a Tobey Maguire, Andrew Garfield y Tom Holland como Spider-Man: Peter Parker, villanos, historias de amor, taquilla y mejores películas.',
  keywords: ['mejor Spider-Man', 'Tobey Maguire vs Andrew Garfield vs Tom Holland', 'quién es el mejor Spider-Man', 'Spider-Man actores', 'Tom Holland Spider-Man', 'Andrew Garfield Spider-Man', 'Tobey Maguire Spider-Man'],
  tags: ['películas', 'Tobey Maguire', 'Andrew Garfield', 'Tom Holland', 'comparativa', 'MCU'],
  content: `
<p>Desde 2002, tres actores se han puesto el traje de Spider-Man en imagen real: <strong>Tobey Maguire</strong>, <strong>Andrew Garfield</strong> y <strong>Tom Holland</strong>. Cada uno llegó en un momento distinto del cine de superhéroes y cada uno tiene su generación de fans, así que la pregunta de «¿quién es el mejor Spider-Man?» lleva años encendiendo discusiones. <em>No Way Home</em> los juntó en la misma película y lo dejó claro: los tres son Peter Parker, pero muy distintos.</p>

<p>Aquí no vamos a dar un ganador a dedo. Los comparamos en siete categorías, con datos donde los hay, y al final te damos nuestro veredicto. Si quieres verlas todas antes, aquí tienes <a href="/blog/orden-ver-peliculas-spider-man">el orden para ver las películas de Spider-Man</a>.</p>

<h2>Los tres Spider-Man, de un vistazo</h2>
<table>
  <thead><tr><th></th><th>Tobey Maguire</th><th>Andrew Garfield</th><th>Tom Holland</th></tr></thead>
  <tbody>
    <tr><td><strong>Etapa</strong></td><td>2002-2007</td><td>2012-2014</td><td>Desde 2016</td></tr>
    <tr><td><strong>Director</strong></td><td>Sam Raimi</td><td>Marc Webb</td><td>Jon Watts y Destin Daniel Cretton</td></tr>
    <tr><td><strong>Películas propias</strong></td><td>3</td><td>2</td><td>4</td></tr>
    <tr><td><strong>Edad en su estreno</strong></td><td>26 años</td><td>28 años</td><td>19 años</td></tr>
    <tr><td><strong>Su gran amor</strong></td><td>Mary Jane (Kirsten Dunst)</td><td>Gwen Stacy (Emma Stone)</td><td>MJ (Zendaya)</td></tr>
    <tr><td><strong>Lanzarredes</strong></td><td>Orgánicos</td><td>Mecánicos, inventados por él</td><td>Mecánicos, inventados por él (y traje de Stark)</td></tr>
    <tr><td><strong>Taquilla mundial de sus películas</strong></td><td>Unos 2.500 millones $</td><td>Unos 1.470 millones $</td><td>Más de 6.400 millones $</td></tr>
  </tbody>
</table>
<p><small>Las cifras de taquilla son aproximadas, en dólares y sin ajustar a la inflación (Box Office Mojo). En el caso de Holland solo cuentan sus cuatro películas en solitario, no las de los Vengadores.</small></p>

<h2>Tobey Maguire: el Peter Parker clásico</h2>
${figure('zQ8AxTPiCiS5nnwXpwTBPBHSaa5', 'Spider-Man trepando por la fachada de un rascacielos en la película de 2002', 'El Spider-Man de 2002 trepando por un rascacielos: la imagen que definió al personaje en el cine.')}
<p>${peli('spider-man-2002', 'Spider-Man')} (2002) fue la película que demostró que un superhéroe podía arrasar en taquilla y emocionar a la vez. El Peter de Maguire es el de los cómics de Stan Lee y Steve Ditko: tímido, torpe, siempre sin dinero y aplastado por la responsabilidad. Su vida como Peter Parker es un desastre constante, y ese es el corazón de la trilogía.</p>
<p>${peli('spider-man-2-2004', 'Spider-Man 2')} (2004), que ganó el Óscar a los mejores efectos visuales, es para muchos la mejor película de Spider-Man jamás hecha, con el Doctor Octopus de Alfred Molina y la mítica escena del tren. ${peli('spider-man-3-2007', 'Spider-Man 3')} (2007) quiso abarcar demasiado, con tres villanos, pero dejó momentos que hoy son memes de culto, como el baile de Peter con el traje negro.</p>

<h2>Andrew Garfield: el Spider-Man más Spider-Man</h2>
${figure('k0hlAzTryCYX1O1LyC6P8tAa8s0', 'Spider-Man de espaldas frente a Rino, el Duende Verde y Electro en Times Square', 'The Amazing Spider-Man 2 (2014): Spider-Man frente a Rino, el Duende Verde y Electro.')}
<p>El Peter de Garfield es más listo, más rebelde y más solitario: un chico que va en monopatín, que fabrica sus propios lanzarredes y que busca la verdad sobre sus padres. Pero donde de verdad brilla es con la máscara puesta. Su Spider-Man <strong>bromea sin parar</strong> mientras pelea, se mueve como una araña y tiene una agilidad muy de cómic.</p>
<p>${peli('the-amazing-spider-man-2012', 'The Amazing Spider-Man')} (2012) y ${peli('the-amazing-spider-man-2-el-poder-de-electro-2014', 'The Amazing Spider-Man 2')} (2014) no tuvieron la acogida que esperaba Sony, y la tercera se canceló. Aun así, su química con Emma Stone sigue siendo de lo más recordado del cine arácnido. Lo contamos en <a href="/blog/the-amazing-spider-man-2012-revaloracion-andrew-garfield">nuestra revisión de su etapa</a>.</p>

<h2>Tom Holland: el Spider-Man adolescente del MCU</h2>
${figure('tPpYGm2mVecue7Bk3gNVoSPA5qn', 'Spider-Man tumbado en un muro junto al río, con sudadera amarilla y auriculares', 'Spider-Man: Homecoming (2017): un Peter adolescente, con sudadera y auriculares, al que le queda mucho por aprender.')}
<p>Holland debutó en <em>Capitán América: Civil War</em> (2016) con 19 años, y es el Peter Parker más joven del cine: un chaval de instituto, entusiasta y algo atolondrado, que quiere impresionar a Tony Stark. Su evolución es la más larga de los tres: pasa de ${peli('spider-man-homecoming-2017', 'Homecoming')} (2017) y ${peli('spider-man-lejos-de-casa-2019', 'Lejos de casa')} (2019) a perderlo todo en ${peli('spider-man-no-way-home-2021', 'No Way Home')} (2021).</p>
<p>La crítica más habitual a su etapa era que dependía demasiado de Iron Man y de la tecnología. ${peli('spider-man-brand-new-day-2026', 'Brand New Day')} (2026) responde a eso con un Peter solo, en la calle y con un traje hecho a mano. Ha sido además la película más taquillera de la historia del personaje, con unos 2.500 millones de dólares en todo el mundo.</p>

<h2>Categoría a categoría</h2>

<h3>1. Mejor Peter Parker: Tobey Maguire</h3>
<p>Maguire clava la parte más difícil del personaje: el chico normal al que la vida no le da un respiro. Pierde trabajos, suspende, llega tarde a todo y aun así elige hacer lo correcto. Garfield está más cerca de un Peter «guay» y Holland de un Peter niño, pero el Parker de los cómics clásicos es el de Maguire.</p>

<h3>2. Mejor Spider-Man con la máscara: Andrew Garfield</h3>
<p>La forma de moverse, las bromas en mitad de la pelea, la manera de proteger a la gente normal… El Spider-Man de Garfield es el que más se parece al de las viñetas. Holland también tiene mucho humor, pero en sus primeras películas el traje de Stark hace buena parte del trabajo.</p>

<h3>3. Mejor arco de personaje: Tom Holland</h3>
<p>Ninguno ha recorrido tanto camino. Holland empieza como un chaval que quiere ser Vengador y acaba, en <em>No Way Home</em>, renunciando a que nadie le recuerde para salvar el mundo. Es la versión más completa del «un gran poder conlleva una gran responsabilidad», y sin tío Ben: esa lección se la da la tía May.</p>

<h3>4. Mejores villanos: Tobey Maguire</h3>
${figure('faV0HuR6WnQoLrVq3r6mhjaABL9', 'Spider-Man y el Doctor Octopus luchando sobre el techo de un tren', 'La pelea en el tren de Spider-Man 2 (2004), con el Doctor Octopus de Alfred Molina.')}
<p>El Duende Verde de Willem Dafoe y el Doctor Octopus de Alfred Molina siguen en lo más alto de cualquier ranking, y por algo volvieron en <em>No Way Home</em>. Holland tiene al Buitre de Michael Keaton y al Mysterio de Jake Gyllenhaal, muy buenos también, y Garfield, al Lagarto y a Electro. Lo tienes todo en <a href="/blog/villanos-spider-man-peliculas-ranking">nuestro ranking de villanos del cine</a>.</p>

<h3>5. Mejor historia de amor: Andrew Garfield</h3>
<p>Garfield y Emma Stone eran pareja también fuera de la pantalla, y se nota. La historia de Peter y Gwen es natural, divertida y, por su final, la más dolorosa. El beso de Maguire y Kirsten Dunst bajo la lluvia es más icónico, y la relación de Holland y Zendaya tiene un final precioso, pero la química de Garfield y Stone no tiene rival.</p>

<h3>6. Mejor película: empate entre Maguire y Holland</h3>
<p>Según la nota media de los usuarios de TMDB, la mejor valorada de las tres sagas es <em>No Way Home</em> (7,9), por delante de <em>Lejos de casa</em> (7,4) y de <em>Spider-Man 2</em> (7,3). Pero muchos críticos siguen señalando <em>Spider-Man 2</em> como la mejor película del personaje. Las dos son imprescindibles; las de Garfield se quedan en 6,7 y 6,5.</p>

<h3>7. Taquilla: Tom Holland, de largo</h3>
<p>Con el MCU detrás, no hay comparación posible: las cuatro películas de Holland superan los 6.400 millones de dólares, y <em>No Way Home</em> y <em>Brand New Day</em> pasaron, cada una, de los 1.900 millones. Eso sí, la trilogía de Maguire fue un fenómeno enorme para su época, sin universo compartido ni multiverso.</p>

<h2>No Way Home: los tres juntos</h2>
${figure('Bwh7Lol5k3hSqYOtqXWxbbJVMx', 'Spider-Man con el traje Iron Spider junto al Doctor Strange frente a un portal', 'No Way Home (2021): el hechizo del Doctor Strange abre el multiverso y trae de vuelta a los Spider-Man anteriores.')}
<p>La mejor respuesta al debate quizá la dio la propia película. En <em>No Way Home</em>, Maguire hace de hermano mayor sabio, Garfield encuentra su redención al salvar a MJ (lo que no pudo hacer con Gwen) y Holland aprende de los dos. Entre ellos se llaman «Peter 1», «Peter 2» y «Peter 3». Si quieres ver cómo cambió el traje de cada uno, lo tienes en <a href="/blog/trajes-spider-man-peliculas">todos los trajes de Spider-Man en las películas</a>.</p>

<h2>Nuestro veredicto</h2>
<ul>
  <li><strong>Tobey Maguire</strong> es el mejor <strong>Peter Parker</strong> y tiene la película que muchos consideran la mejor de todas.</li>
  <li><strong>Andrew Garfield</strong> es el mejor <strong>Spider-Man</strong> con la máscara y el que tuvo menos suerte con sus películas.</li>
  <li><strong>Tom Holland</strong> tiene la <strong>historia más completa</strong> y la etapa más exitosa, y con <em>Brand New Day</em> por fin es el Spider-Man de barrio que pedían los fans.</li>
</ul>
<p>Si tuviéramos que elegir uno solo… depende de con cuál creciste. Y ese es justo el mejor resumen del personaje: cada generación tiene su Spider-Man. ¿Cuánto sabes de los tres? Ponte a prueba con nuestro <a href="/juegos/test-spider-man">test de Spider-Man</a> o descubre <a href="/juegos/que-spider-man-eres">qué Spider-Man eres</a>. Y si quieres saber más del personaje, empieza por la ficha de ${pj('spider-man-peter-parker-alt', 'Peter Parker')}.</p>
`,
};

// Datos verificados el 17/10/2026: digital confirmado (Vandal, AVPasión); suscripción y formato físico sin fecha oficial
const BND_STREAMING = {
  slug: 'spider-man-brand-new-day-streaming-donde-ver',
  title: 'Dónde ver Spider-Man: Brand New Day: digital, streaming y Blu-ray',
  subtitle: 'Ya se puede alquilar y comprar en digital. Te contamos dónde, cuándo podría llegar a Netflix, Movistar Plus+ o Disney+ y qué se sabe del Blu-ray',
  excerpt:
    'Spider-Man: Brand New Day ya está disponible en alquiler y compra digital en España desde el 6 de octubre. Te contamos en qué tiendas, cuándo podría llegar a las plataformas de suscripción y qué se sabe del formato físico.',
  category: 'Noticias',
  readTime: '5 min',
  publishDate: new Date('2026-10-17'),
  image: tmdb('r08LxMJCbf1SiJIWeyH9aJmdqwC'),
  seoTitle: 'Dónde ver Spider-Man: Brand New Day en streaming (2026)',
  seoDescription:
    'Spider-Man: Brand New Day ya está en alquiler y compra digital desde el 6 de octubre. Dónde verla, cuándo podría llegar a Netflix, Movistar Plus+ o Disney+ y el Blu-ray.',
  keywords: ['Brand New Day streaming', 'dónde ver Spider-Man Brand New Day', 'Brand New Day Disney+', 'Brand New Day Netflix', 'Brand New Day digital', 'Brand New Day Blu-ray'],
  tags: ['Brand New Day', 'streaming', 'noticias', 'Tom Holland', 'MCU', 'dónde ver'],
  content: `
<p><em>Última actualización: 17 de octubre de 2026.</em></p>

<p>Después de arrasar en los cines, con más de 2.500 millones de dólares de taquilla, ${peli('spider-man-brand-new-day-2026', 'Spider-Man: Brand New Day')} ya se puede ver en casa. Estas son todas las opciones que hay ahora mismo en España y lo que se sabe (y lo que no) de su llegada a las plataformas de suscripción.</p>

<h2>Resumen rápido</h2>
<table>
  <thead><tr><th>Formato</th><th>Estado en España</th></tr></thead>
  <tbody>
    <tr><td><strong>Alquiler y compra digital</strong></td><td>Disponible desde el 6 de octubre de 2026</td></tr>
    <tr><td><strong>Plataformas de suscripción</strong></td><td>Sin fecha oficial</td></tr>
    <tr><td><strong>4K, Blu-ray y DVD</strong></td><td>Sin fecha oficial en España</td></tr>
  </tbody>
</table>

<h2>Dónde verla ya: alquiler y compra digital</h2>
${figure('r08LxMJCbf1SiJIWeyH9aJmdqwC', 'Peter Parker y su reflejo como Spider-Man en Brand New Day', 'Brand New Day arranca con un Peter Parker solo, al que nadie recuerda tras No Way Home.')}
<p>Desde el <strong>6 de octubre de 2026</strong>, la película está disponible para alquilar o comprar en las principales tiendas digitales: <strong>Apple TV</strong>, <strong>Prime Video</strong> y <strong>Rakuten TV</strong>, en calidad 4K y con audio en castellano. Al alquilarla tienes un tiempo limitado para verla; al comprarla, se queda en tu biblioteca. El precio puede variar entre tiendas y con las ofertas, así que conviene comprobarlo en cada una.</p>

<h2>¿Cuándo llega a Netflix, Movistar Plus+ o Disney+?</h2>
<p>Aquí no hay nada oficial: Sony no ha anunciado todavía en qué plataforma de suscripción se estrenará en España ni cuándo. Lo que sí sabemos es cómo suelen funcionar las películas de Sony:</p>
<ul>
  <li><strong>Primero, la «ventana de pago».</strong> Varios medios españoles apuntan a que, como otras películas recientes de Sony, llegaría primero a Movistar Plus+, unos siete meses después de su estreno en cines; eso la situaría hacia finales de febrero o marzo de 2027. Es una estimación, no un anuncio.</li>
  <li><strong>Después, Netflix o Disney+.</strong> En Estados Unidos, las películas de Sony pasan primero por Netflix y más tarde por Disney+. En España, su llegada a estas plataformas podría tardar bastante más, y tampoco hay fecha.</li>
</ul>
<p>En cuanto haya una fecha oficial, actualizaremos este artículo.</p>

<h2>¿Y en Blu-ray o 4K?</h2>
<p>En España no hay fecha confirmada para la edición física. En Estados Unidos, la edición en 4K y Blu-ray tiene fecha anunciada para mediados de diciembre de 2026, así que es probable que llegue a las tiendas españolas en una fecha parecida, aunque no está confirmado. Si te gusta coleccionar, en nuestra <a href="/tienda">tienda</a> tienes una selección de productos de <em>Brand New Day</em> revisados uno a uno.</p>

<h2>Antes de verla</h2>
<p><em>Brand New Day</em> continúa justo donde terminó ${peli('spider-man-no-way-home-2021', 'No Way Home')}, así que conviene haberla visto; tienes el contexto en <a href="/blog/spider-man-no-way-home-analisis">nuestro análisis de No Way Home</a>. Si quieres repasar toda la saga, aquí tienes <a href="/blog/orden-ver-peliculas-spider-man">el orden para ver las películas de Spider-Man</a>. Y cuando la veas, te esperan <a href="/blog/spider-man-brand-new-day-final-explicado">el final explicado</a> y <a href="/blog/trajes-spider-man-peliculas">todos los trajes de Spider-Man en el cine</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Dónde puedo ver Spider-Man: Brand New Day?</h3>
<p>En alquiler o compra digital en Apple TV, Prime Video y Rakuten TV, desde el 6 de octubre de 2026.</p>
<h3>¿Está Brand New Day en Disney+ o en Netflix?</h3>
<p>Todavía no, y no hay fecha oficial para ninguna plataforma de suscripción en España.</p>
<h3>¿Está incluida en Prime Video sin pagar más?</h3>
<p>No: en Prime Video se puede alquilar o comprar, pero no está incluida en la suscripción.</p>
`,
};

const cvImg = (path) => `https://comicvine.gamespot.com/a/uploads/scale_medium/${path}`;
const cvFig = (path, alt, cap) => `<figure>
  <img src="${cvImg(path)}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;
const pjLink = (slug, name) => `<a href="/personajes/${slug}">${name}</a>`;

const SCARLET_SPIDER = {
  slug: 'scarlet-spider-ben-reilly-kaine-diferencias',
  title: 'Scarlet Spider: quién es Ben Reilly, quién es Kaine y en qué se diferencian',
  subtitle: 'Los dos clones de Peter Parker que han llevado el nombre de Scarlet Spider: origen, poderes, trajes, cómics imprescindibles y apariciones en el cine',
  excerpt:
    'Ben Reilly y Kaine son clones de Peter Parker y los dos han sido Scarlet Spider, pero son personajes muy distintos. Te explicamos quién es cada uno, en qué se diferencian y qué cómics leer.',
  category: 'Cómics',
  readTime: '9 min',
  publishDate: new Date('2026-10-19'),
  image: cvImg('6/67663/5819599-01.jpg'),
  seoTitle: 'Scarlet Spider: Ben Reilly y Kaine, diferencias y origen',
  seoDescription:
    'Quién es Scarlet Spider: Ben Reilly y Kaine Parker, los dos clones de Peter Parker. Origen, poderes, trajes, diferencias, cómics para leer y su papel en el cine.',
  keywords: ['Scarlet Spider', 'Ben Reilly', 'Kaine Parker', 'Kaine Scarlet Spider', 'clones de Peter Parker', 'saga del clon'],
  tags: ['cómics', 'Scarlet Spider', 'Ben Reilly', 'Kaine', 'saga del clon', 'personajes'],
  content: `
<p>Si has buscado «Scarlet Spider» y te has encontrado con dos nombres, no estás solo: <strong>Ben Reilly y Kaine Parker han llevado los dos el nombre de Scarlet Spider</strong>, los dos son clones de Peter Parker y los dos nacieron en el laboratorio del mismo villano. Pero son personajes muy distintos. Aquí te lo aclaramos todo.</p>

<h2>Las diferencias, de un vistazo</h2>
<table>
  <thead><tr><th></th><th>Ben Reilly</th><th>Kaine Parker</th></tr></thead>
  <tbody>
    <tr><td><strong>Qué es</strong></td><td>Un clon casi perfecto de Peter</td><td>El primer clon de Peter, imperfecto</td></tr>
    <tr><td><strong>Primera aparición</strong></td><td>The Amazing Spider-Man #149 (1975)</td><td>Web of Spider-Man #119 (1994)</td></tr>
    <tr><td><strong>Scarlet Spider</strong></td><td>Desde 1994, en plena saga del clon</td><td>Desde 2012, en Houston</td></tr>
    <tr><td><strong>Personalidad</strong></td><td>Un héroe como Peter, con su misma moral</td><td>Un antihéroe duro y violento que busca redimirse</td></tr>
    <tr><td><strong>Traje</strong></td><td>Malla roja con sudadera azul sin mangas</td><td>Traje rojo y negro de una sola pieza</td></tr>
    <tr><td><strong>¿Fue Spider-Man?</strong></td><td>Sí, en varias etapas</td><td>No</td></tr>
  </tbody>
</table>

<h2>El origen: los clones del Chacal</h2>
<p>Los dos nacieron del mismo hombre: ${pjLink('jackal-miles-warren-alt', 'Miles Warren, el Chacal')}, el profesor de Peter obsesionado con Gwen Stacy y con la clonación. En los años 70 creó copias de Peter Parker para enfrentarlas a él, y durante décadas nadie supo cuántas había ni cuál era el original. De ahí salió la famosa <strong>saga del clon</strong> de los años 90, una de las historias más largas y polémicas de Spider-Man.</p>

<h2>Ben Reilly, el Scarlet Spider original</h2>
<figure>
  <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/Scarlet_Spider_%28Ben_Reilly%29.png" alt="Ben Reilly con el traje de Scarlet Spider: malla roja y sudadera azul sin mangas" loading="lazy" />
  <figcaption>El traje de Scarlet Spider de Ben Reilly: malla roja con una sudadera azul sin mangas, uno de los diseños más recordados de los años 90.</figcaption>
</figure>
<p>${pjLink('ben-reilly-scarlet-spider-alt', 'Ben Reilly')} apareció en <em>The Amazing Spider-Man</em> #149 (1975) como un clon de Peter que se dio por muerto. En 1994 volvió: había pasado años vagando por el país con el nombre de Ben Reilly (el apellido de soltera de la tía May) y, al regresar a Nueva York, adoptó la identidad de <strong>Scarlet Spider</strong>, con su sudadera azul hecha a mano.</p>
${cvFig('11/117763/2451938-webss1.jpg', 'Portada de Web of Scarlet Spider #1 con Scarlet Spider saltando', 'Web of Scarlet Spider #1 (1995): durante unos meses, las series de Spider-Man pasaron a llamarse Scarlet Spider.')}
<p>Durante la saga del clon se llegó a contar que Ben era el Peter original, y en 1995 las series de Spider-Man pasaron a llamarse Scarlet Spider durante unos meses. Después, Ben se convirtió en el nuevo <strong>Spider-Man</strong>, con traje propio, mientras Peter se retiraba. Su etapa terminó en 1996, cuando murió en una pelea con el Duende Verde, y su cuerpo se deshizo en polvo: la prueba definitiva de que el clon era él.</p>
${cvFig('6/67663/5819599-01.jpg', 'Portada de Ben Reilly: The Scarlet Spider #1 con Scarlet Spider colgado de una telaraña', 'Ben Reilly: The Scarlet Spider #1 (2017): el regreso de Ben como Scarlet Spider, ahora en Las Vegas.')}
<p>Pero los clones nunca mueren del todo. Ben volvió en <em>La conspiración del clon</em> (2016), recuperó su identidad de Scarlet Spider en una serie propia ambientada en Las Vegas (2017) y, años después, llegó a ser Spider-Man otra vez.</p>

<h2>Kaine, el clon imperfecto</h2>
${cvFig('6/67663/3501562-01a.jpg', 'Portada de Scarlet Spider #1 de 2012 con Kaine envuelto en telarañas', 'Scarlet Spider #1 (2012): Kaine estrena su etapa como héroe en Houston, con su traje rojo y negro.')}
<p>${pjLink('kaine-parker-scarlet-spider-alt', 'Kaine')} fue el <strong>primer clon</strong> que creó el Chacal, y le salió mal: su cuerpo se degeneraba poco a poco y sus poderes eran distintos de los de Peter. Apareció en <em>Web of Spider-Man</em> #119 (1994), como un asesino que perseguía a Ben Reilly y que dejaba quemada en la cara de sus víctimas la «marca de Kaine». Durante la saga del clon llegó a matar al Doctor Octopus.</p>
<p>Su redención llegó mucho después. Tras morir y regresar durante <em>La isla arácnida</em> (2011), Kaine quedó curado de su degeneración y se marchó a Houston, donde, en 2012, se convirtió en el nuevo <strong>Scarlet Spider</strong>, con un traje rojo y negro. Su serie, escrita por Christopher Yost, muestra a un antihéroe brusco que intenta hacer el bien aunque no le salga natural.</p>

<h2>Poderes</h2>
<ul>
  <li><strong>Ben Reilly:</strong> los mismos que Peter (fuerza, agilidad, sentido arácnido y trepar paredes), con lanzarredes mecánicos y unos «aguijones» de impacto en las muñecas.</li>
  <li><strong>Kaine:</strong> los poderes de Spider-Man, con más fuerza, aguijones que salen de sus muñecas, un sentido arácnido que llega a mostrarle visiones del futuro y la capacidad de quemar su huella en la piel de sus enemigos.</li>
</ul>

<h2>Scarlet Spider en el cine, las series y los videojuegos</h2>
<ul>
  <li><strong>${peli('spider-man-cruzando-el-multiverso-2023', 'Spider-Man: Cruzando el Multiverso')} (2023):</strong> Ben Reilly aparece como un Scarlet Spider muy intenso, con la voz original de Andy Samberg.</li>
  <li><strong><a href="/series/spider-noir"><em>Spider-Noir</em></a>:</strong> Nicolas Cage interpreta a una versión de los años 30 de Ben Reilly.</li>
  <li><strong><a href="/blog/spider-man-animated-series-1994-analisis">Serie animada de 1994</a>:</strong> Scarlet Spider aparece en las Guerras Arácnidas, el final de la serie.</li>
  <li><strong><a href="/blog/marvels-spider-man-ps4-2018-analisis-insomniac">Marvel's Spider-Man</a> (2018):</strong> Peter puede ponerse los trajes de Scarlet Spider de Ben y de Kaine.</li>
</ul>

<h2>Qué cómics leer</h2>
<ol>
  <li><strong>La saga del clon (1994-1996):</strong> el regreso de Ben Reilly y la llegada de Kaine. Larga e irregular, pero imprescindible para entender a los dos.</li>
  <li><strong>Scarlet Spider (2012-2014):</strong> la etapa de Kaine en Houston, la mejor para conocerle.</li>
  <li><strong>Ben Reilly: The Scarlet Spider (2017):</strong> el regreso de Ben, más oscuro y en solitario.</li>
</ol>
<p>Si te interesan las grandes sagas del personaje, tienes <a href="/blog/mejores-comics-spider-man-historia">los 10 mejores cómics de Spider-Man</a> y nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía para nuevos lectores</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Quién es Scarlet Spider?</h3>
<p>Es el nombre heroico que han usado dos clones de Peter Parker: Ben Reilly, desde 1994, y Kaine, desde 2012.</p>
<h3>¿Ben Reilly y Kaine son la misma persona?</h3>
<p>No. Los dos son clones de Peter creados por el Chacal, pero Kaine fue el primero e imperfecto, y Ben un clon casi perfecto.</p>
<h3>¿Quién es el Scarlet Spider de Cruzando el Multiverso?</h3>
<p>Ben Reilly, con la voz original de Andy Samberg.</p>
<h3>¿Ben Reilly fue Spider-Man?</h3>
<p>Sí: tras la saga del clon fue Spider-Man entre 1995 y 1996, y volvió a serlo años después.</p>
`,
};

const VENGADORES = {
  slug: 'spider-man-vengadores-relacion-con-cada-uno',
  title: 'Spider-Man y los Vengadores: su relación con cada uno, en los cómics y en el cine',
  subtitle: 'Iron Man, el Capitán América, la Viuda Negra, Ojo de Halcón, Ant-Man, Hulk, Pantera Negra, Doctor Strange y más: cómo se lleva Spider-Man con cada Vengador',
  excerpt:
    'Spider-Man tardó décadas en ser Vengador, pero hoy es inseparable de ellos. Repasamos su relación con cada uno, de Tony Stark a Hulk, en los cómics y en el MCU.',
  category: 'Cómics',
  readTime: '10 min',
  publishDate: new Date('2026-10-19'),
  image: tmdb('Bwh7Lol5k3hSqYOtqXWxbbJVMx'),
  seoTitle: 'Spider-Man y los Vengadores: su relación con cada uno',
  seoDescription:
    'La relación de Spider-Man con cada Vengador: Iron Man, Capitán América, Viuda Negra, Ojo de Halcón, Ant-Man, Hulk y más, en los cómics y en las películas del MCU.',
  keywords: ['Spider-Man Vengadores', 'Spider-Man y Iron Man', 'Spider-Man Avengers', 'Spider-Man MCU', 'Spider-Man Civil War', 'Nuevos Vengadores Spider-Man'],
  tags: ['Vengadores', 'MCU', 'cómics', 'Iron Man', 'Capitán América', 'personajes'],
  content: `
<p>Spider-Man siempre ha sido un héroe de barrio, más preocupado por pagar el alquiler que por salvar el universo. Por eso tardó décadas en ser Vengador de verdad. Hoy, sin embargo, es inseparable de ellos: en los cómics forma parte del equipo desde 2005 y, en el cine, su historia en el MCU no se entiende sin Iron Man. Repasamos su relación con cada Vengador.</p>

<h2>Un Vengador que tardó en llegar</h2>
<p>En <em>The Amazing Spider-Man Annual</em> #3 (1966), los Vengadores le ofrecieron una prueba de acceso: capturar a Hulk. Peter acabó dejándole marchar y se quedó fuera del equipo. Durante años fue miembro de reserva y colaborador ocasional, hasta que en 2005 se unió a los <strong>Nuevos Vengadores</strong> de Brian Michael Bendis, junto a Lobezno, el Capitán América, Iron Man y Luke Cage, entre otros. En el cine, Tony Stark le nombró Vengador en <em>Vengadores: Infinity War</em> (2018).</p>

<h2>Iron Man (Tony Stark): el mentor</h2>
${cvFig('11174/111743204/9372918-invincibleironman%231vol5kaelngu.jpg', 'Iron Man con su armadura disparando energía con las manos', 'Iron Man, el gran mentor del Spider-Man del MCU.')}
<p>Es la relación más importante del Spider-Man de Tom Holland. ${pjLink('iron-man-tony-stark-alt', 'Tony Stark')} lo recluta en <em>Capitán América: Civil War</em> (2016), le regala su traje en ${peli('spider-man-homecoming-2017', 'Homecoming')} y su muerte en <em>Endgame</em> marca a Peter en ${peli('spider-man-lejos-de-casa-2019', 'Lejos de casa')}. En los cómics, durante <em>Civil War</em> (2006), Tony convenció a Peter para ponerse de su lado, le regaló la armadura Iron Spider y le animó a revelar su identidad ante todo el mundo, una decisión que le salió muy cara.</p>

<h2>Capitán América (Steve Rogers): el referente moral</h2>
${cvFig('12/124259/8459983-rco031_1650495781.jpg', 'El Capitán América lanzando su escudo', 'El Capitán América, un referente moral para los héroes jóvenes como Peter.')}
<p>Para muchos héroes jóvenes, ${pjLink('captain-america-steve-rogers-alt', 'Steve Rogers')} es un ejemplo a seguir. En los cómics se enfrentaron en <em>Civil War</em> (2006), cuando Peter apoyó primero a Tony; acabó cambiando de bando. En el cine se ven las caras en la famosa pelea del aeropuerto de <em>Civil War</em>, y Steve aparece en tono de humor en los vídeos educativos del instituto de Peter en <em>Homecoming</em>.</p>

<h2>La Viuda Negra (Natasha Romanoff): un traje de Spider-Man</h2>
${cvFig('11156/111564182/9646599-widow2.jpg', 'La Viuda Negra con su traje negro', 'La Viuda Negra estrenó su famoso traje negro en un cómic de Spider-Man.')}
<p>${pjLink('black-widow-natasha-romanoff-alt', 'Natasha Romanoff')} le debe a Spider-Man su aspecto más famoso: fue en <em>The Amazing Spider-Man</em> #86 (1970), dibujado por John Romita, donde estrenó el traje negro con el que la reconocemos desde entonces. En el cine coincidieron en <em>Civil War</em> y en las dos últimas películas de los Vengadores.</p>

<h2>Ojo de Halcón (Clint Barton): rivales en el aeropuerto</h2>
${cvFig('11156/111564182/9384867-thunderbolts_vol_4_1_trading_card_variant_textless.jpg', 'Ojo de Halcón con su arco entre rascacielos', 'Ojo de Halcón, el arquero sin superpoderes.')}
<p>${pjLink('hawkeye-clint-barton-alt', 'Clint Barton')} y Spider-Man han coincidido muchas veces como Vengadores, pero su cruce más recordado es en el cine: en la pelea del aeropuerto de <em>Civil War</em>, Ojo de Halcón lucha en el bando del Capitán América, frente a un Spider-Man recién reclutado por Tony Stark.</p>

<h2>Ant-Man (Scott Lang): el gigante derribado</h2>
${cvFig('14/149570/4153676-ant-man-samnee-variant-a2299.jpg', 'Ant-Man sobre una hormiga voladora', 'Ant-Man, compañero de Peter en los Vengadores y en la Fundación Futuro.')}
<p>En los cómics, ${pjLink('ant-man-scott-lang-alt', 'Scott Lang')} y Peter coincidieron en los Vengadores y en la Fundación Futuro, el grupo de jóvenes genios de los Cuatro Fantásticos. En el cine protagonizaron uno de los momentos más divertidos de <em>Civil War</em>: en el aeropuerto, Scott se convierte en un gigante y Spider-Man lo derriba enredándole las piernas con su telaraña.</p>

<h2>Hulk (Bruce Banner): la prueba de acceso</h2>
${cvFig('1/15776/9971293-hulk.jpg', 'Hulk rugiendo', 'Hulk, protagonista de la prueba de acceso de Spider-Man a los Vengadores.')}
<p>Se conocen desde muy pronto: Spider-Man se cruzó con ${pjLink('hulk-bruce-banner-alt', 'Hulk')} por primera vez en <em>The Amazing Spider-Man</em> #14 (1964), el mismo número en el que debutó el Duende Verde, y su prueba para entrar en los Vengadores fue capturarle. En el cine, Bruce Banner aparece en ${peli('spider-man-brand-new-day-2026', 'Spider-Man: Brand New Day')} (2026) como profesor universitario.</p>

<h2>Y el resto del equipo</h2>
<ul>
  <li><strong>${pjLink('doctor-strange-stephen-strange-alt', 'Doctor Strange')}:</strong> Spider-Man recurre a él cuando la amenaza escapa a la ciencia. En ${peli('spider-man-no-way-home-2021', 'No Way Home')} lanza el hechizo que hace que el mundo olvide a Peter Parker y abre el multiverso.</li>
  <li><strong>${pjLink('black-panther-tchalla-alt', 'Pantera Negra')}:</strong> han coincidido muchas veces como Vengadores, y en el cine luchó en el mismo bando que Spider-Man en el aeropuerto de <em>Civil War</em>.</li>
  <li><strong>${pjLink('thor-odinson-alt', 'Thor')}:</strong> compañeros en los Vengadores; en el cine, los dos luchan en la batalla final de <em>Endgame</em>.</li>
  <li><strong>${pjLink('wolverine-james-howlett-alt', 'Lobezno')}:</strong> el bromista y el gruñón coincidieron en los Nuevos Vengadores desde 2005 y protagonizaron juntos miniseries de aventuras.</li>
  <li><strong>${pjLink('human-torch-johnny-storm-alt', 'La Antorcha Humana')}:</strong> no es Vengador, sino de los Cuatro Fantásticos, pero es el mejor amigo y rival de Peter desde los años 60.</li>
</ul>

<h2>Spider-Man en las películas de los Vengadores</h2>
<table>
  <thead><tr><th>Año</th><th>Película</th><th>Qué pasa</th></tr></thead>
  <tbody>
    <tr><td>2016</td><td><em>Capitán América: Civil War</em></td><td>Tony Stark le recluta; pelea del aeropuerto</td></tr>
    <tr><td>2017</td><td>${peli('spider-man-homecoming-2017', 'Spider-Man: Homecoming')}</td><td>Tony le hace de mentor y le regala su traje</td></tr>
    <tr><td>2018</td><td><em>Vengadores: Infinity War</em></td><td>Tony le nombra Vengador; desaparece con el chasquido de Thanos</td></tr>
    <tr><td>2019</td><td><em>Vengadores: Endgame</em></td><td>Vuelve para la batalla final</td></tr>
    <tr><td>2021</td><td>${peli('spider-man-no-way-home-2021', 'Spider-Man: No Way Home')}</td><td>El hechizo de Doctor Strange abre el multiverso</td></tr>
  </tbody>
</table>
<p>Tienes el orden completo en <a href="/blog/orden-ver-peliculas-spider-man">en qué orden ver las películas de Spider-Man</a>, y todos los personajes en nuestra sección de <a href="/personajes">personajes</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Spider-Man es un Vengador?</h3>
<p>Sí. En los cómics se unió a los Nuevos Vengadores en 2005, y en el cine Tony Stark le nombró Vengador en <em>Infinity War</em> (2018).</p>
<h3>¿Quién es el mentor de Spider-Man en el MCU?</h3>
<p>Tony Stark, Iron Man.</p>
<h3>¿En qué película se enfrentan Spider-Man y el Capitán América?</h3>
<p>En <em>Capitán América: Civil War</em> (2016), en la pelea del aeropuerto.</p>
`,
};

// Verificado el 19/10/2026: estreno 25/05/2026 en MGM+ y 27/05 en Prime Video (THR en español, SensaCine);
// cancelada tras una temporada en septiembre de 2026 (The Hollywood Reporter, Deadline); TMDB: 8 episodios, creada por Oren Uziel
const serie = (slug, title) => `<a href="/series/${slug}"><em>${title}</em></a>`;

const SPIDER_NOIR = {
  slug: 'spider-noir-serie-nicolas-cage-donde-ver-temporada-2',
  title: 'Spider-Noir: dónde ver la serie de Nicolas Cage, reparto y si habrá temporada 2',
  subtitle: 'Ocho episodios en la Nueva York de los años 30, en blanco y negro o en color: todo sobre la serie de Spider-Man Noir',
  excerpt:
    'Spider-Noir, la serie de imagen real con Nicolas Cage, se puede ver en Prime Video. Te contamos de qué va, quién sale, cómo verla en blanco y negro o en color y qué pasa con la temporada 2.',
  category: 'Series',
  readTime: '6 min',
  publishDate: new Date('2026-10-19'),
  image: tmdb('qfbVc3kuVqBEgxpon1nBRF1t9KT'),
  seoTitle: 'Spider-Noir: dónde ver la serie, reparto y temporada 2',
  seoDescription:
    'Spider-Noir, la serie de Nicolas Cage: dónde verla (Prime Video), de qué va, reparto, episodios, versión en blanco y negro o color y si habrá temporada 2.',
  keywords: ['Spider-Noir', 'Spider-Noir serie', 'Spider-Noir Nicolas Cage', 'Spider-Noir temporada 2', 'dónde ver Spider-Noir', 'Spider-Man Noir serie'],
  tags: ['series', 'Spider-Noir', 'Nicolas Cage', 'Prime Video', 'Ben Reilly', 'dónde ver'],
  content: `
<p><em>Última actualización: 19 de octubre de 2026.</em></p>

<p>${serie('spider-noir', 'Spider-Noir')} es la primera serie de imagen real de Spider-Man, y la protagoniza Nicolas Cage, que ya había puesto voz a ${pjLink('spider-man-noir-peter-parker-alt', 'Spider-Man Noir')} en ${peli('spider-man-un-nuevo-universo-2018', 'Un nuevo universo')}. Aquí tienes todo lo que necesitas saber: dónde verla, de qué va, quién sale y qué ha pasado con la segunda temporada.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Dónde verla</strong></td><td>Prime Video (en Estados Unidos, también en MGM+)</td></tr>
    <tr><td><strong>Estreno</strong></td><td>25 de mayo de 2026 en MGM+; 27 de mayo en Prime Video en todo el mundo</td></tr>
    <tr><td><strong>Episodios</strong></td><td>8, de unos 40 minutos, todos disponibles a la vez</td></tr>
    <tr><td><strong>Creador</strong></td><td>Oren Uziel</td></tr>
    <tr><td><strong>Protagonista</strong></td><td>Nicolas Cage</td></tr>
    <tr><td><strong>Temporada 2</strong></td><td>No: la serie se canceló en septiembre de 2026</td></tr>
  </tbody>
</table>

<h2>¿De qué va?</h2>
${figure('mkwVoyP9bFSmfVqU8FJyem52hVR', 'Un hombre con sombrero y gabardina camina por una calle mojada de noche', 'La Nueva York de los años 30 de Spider-Noir: calles mojadas, sombras y cine negro.')}
<p>La serie está ambientada en la Nueva York de los años 30. Nicolas Cage interpreta a <strong>Ben Reilly</strong>, un investigador privado veterano y venido a menos, al que una tragedia personal obliga a enfrentarse a su pasado como el único superhéroe de la ciudad. No es el Peter Parker Noir del Spider-Verso, sino una nueva versión del personaje, inspirada en el cine negro clásico: detectives, gánsteres, humo y gabardinas. Si te lías con el nombre, te contamos quién es el ${pjLink('ben-reilly-scarlet-spider-alt', 'Ben Reilly')} de los cómics en <a href="/blog/scarlet-spider-ben-reilly-kaine-diferencias">Scarlet Spider: Ben Reilly y Kaine</a>.</p>

<h2>Reparto</h2>
<ul>
  <li><strong>Nicolas Cage</strong> como Ben Reilly, Spider-Noir.</li>
  <li><strong>Lamorne Morris</strong> como Robbie Robertson.</li>
  <li><strong>Li Jun Li</strong> como Cat Hardy.</li>
  <li><strong>Jack Huston</strong> como Flint Marko.</li>
  <li><strong>Brendan Gleeson</strong> como Silvermane.</li>
</ul>
<p>Muchos nombres sonarán a los lectores de cómics: Robbie Robertson es el editor del Daily Bugle, Flint Marko es el ${pjLink('sandman-william-baker-alt', 'Hombre de Arena')} y Cat Hardy recuerda a Felicia Hardy, la ${pjLink('black-cat-felicia-hardy-alt', 'Gata Negra')}.</p>

<h2>¿En blanco y negro o en color?</h2>
${figure('reAZlLG6YMkBuxPT1XKuCH97TM1', 'Primer plano en blanco y negro de Spider-Noir con máscara, sombrero y ojos brillantes', 'Spider-Noir en blanco y negro, la versión que mejor encaja con el cine negro de los años 30.')}
<p>La serie se hizo en dos versiones: una en <strong>blanco y negro</strong>, como las películas de cine negro de la época, y otra en <strong>color</strong>. Si buscas la experiencia más fiel al personaje, la versión en blanco y negro es la más recomendable; la de color es más accesible si no te convence el formato.</p>
${figure('6t2FvBr9DS8MOq0m5FAwPBCdAW5', 'Spider-Noir agachado sobre una cornisa, en color, con la ciudad de fondo', 'La versión en color de Spider-Noir.')}

<h2>¿Forma parte del MCU?</h2>
<p>No. La produce Sony Pictures Television y es una historia independiente: no está conectada con las películas de Tom Holland ni con el Spider-Verso animado, aunque comparta actor con Spider-Man Noir. Se puede ver sin conocer nada más.</p>

<h2>¿Habrá temporada 2?</h2>
<p><strong>No.</strong> Prime Video canceló la serie tras su primera temporada en septiembre de 2026, sin dar un motivo concreto. Durante unos meses se habló de una segunda temporada, pero esa posibilidad quedó descartada con la cancelación. La primera temporada, eso sí, se puede ver completa: son solo ocho episodios.</p>

<h2>¿Merece la pena?</h2>
<p>Si te gustan el cine negro y las versiones distintas de Spider-Man, sí: es corta, tiene una estética muy cuidada y un Nicolas Cage en su salsa. Y si te quedas con ganas de más, en nuestra sección de <a href="/series">series</a> tienes todas las de Spider-Man, de la <a href="/blog/spider-man-animated-series-1994-analisis">serie animada de 1994</a> a <a href="/blog/spectacular-spider-man-serie-analisis">The Spectacular Spider-Man</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Dónde puedo ver Spider-Noir?</h3>
<p>En Prime Video, donde están disponibles los ocho episodios.</p>
<h3>¿Cuántos episodios tiene Spider-Noir?</h3>
<p>Ocho, de unos 40 minutos cada uno.</p>
<h3>¿Habrá segunda temporada de Spider-Noir?</h3>
<p>No: Prime Video la canceló tras la primera temporada, en septiembre de 2026.</p>
<h3>¿Quién es el protagonista de Spider-Noir?</h3>
<p>Nicolas Cage, que interpreta a Ben Reilly, un detective privado de la Nueva York de los años 30.</p>
`,
};

const juego = (slug, title) => `<a href="/videojuegos/${slug}"><em>${title}</em></a>`;

const DOC_OCK_VERSIONES = {
  slug: 'doctor-octopus-cine-series-videojuegos-versiones',
  title: 'Doctor Octopus: todas sus versiones en el cine, las series y los videojuegos',
  subtitle: 'De Alfred Molina a la Doc Ock del Spider-Verso: cómo ha cambiado el villano de los cuatro brazos fuera de los cómics',
  excerpt:
    'Alfred Molina lo convirtió en uno de los mejores villanos del cine, pero el Doctor Octopus ha tenido muchas más versiones. Las repasamos todas: películas, series animadas y videojuegos.',
  category: 'Películas',
  readTime: '8 min',
  publishDate: new Date('2026-10-19'),
  image: tmdb('faV0HuR6WnQoLrVq3r6mhjaABL9'),
  seoTitle: 'Doctor Octopus: todas sus versiones en cine, series y juegos',
  seoDescription:
    'Doctor Octopus fuera de los cómics: Alfred Molina en Spider-Man 2 y No Way Home, la Doc Ock del Spider-Verso, sus voces en las series animadas y los videojuegos.',
  keywords: ['Doctor Octopus', 'Doc Ock', 'Alfred Molina Doctor Octopus', 'Doctor Octopus películas', 'Otto Octavius', 'Doctor Octopus No Way Home'],
  tags: ['villanos', 'Doctor Octopus', 'Alfred Molina', 'películas', 'series', 'videojuegos'],
  content: `
<p>El ${pjLink('doctor-octopus-otto-octavius-alt', 'Doctor Octopus')} es uno de los villanos más reconocibles de Spider-Man: un científico brillante y arrogante unido a cuatro brazos mecánicos que controla con la mente. Debutó en <em>The Amazing Spider-Man</em> #3 (1963), de Stan Lee y Steve Ditko, y desde entonces ha dado el salto al cine, a casi todas las series animadas del personaje y a los videojuegos. Estas son todas sus versiones.</p>

<h2>Todas sus versiones, de un vistazo</h2>
<table>
  <thead><tr><th>Año</th><th>Dónde</th><th>Quién le da vida</th></tr></thead>
  <tbody>
    <tr><td>1994</td><td>Serie animada de Spider-Man</td><td>Voz original: Efrem Zimbalist Jr.</td></tr>
    <tr><td>2004</td><td>${peli('spider-man-2-2004', 'Spider-Man 2')}</td><td>Alfred Molina</td></tr>
    <tr><td>2008</td><td><em>The Spectacular Spider-Man</em></td><td>Voz original: Peter MacNicol</td></tr>
    <tr><td>2012</td><td><em>Ultimate Spider-Man</em></td><td>Voz original: Tom Kenny</td></tr>
    <tr><td>2018</td><td>${juego('marvel-s-spider-man-2018', "Marvel's Spider-Man")} (videojuego)</td><td>Voz original: William Salyers</td></tr>
    <tr><td>2018</td><td>${peli('spider-man-un-nuevo-universo-2018', 'Spider-Man: Un nuevo universo')}</td><td>Olivia Octavius, voz original de Kathryn Hahn</td></tr>
    <tr><td>2021</td><td>${peli('spider-man-no-way-home-2021', 'Spider-Man: No Way Home')}</td><td>Alfred Molina</td></tr>
  </tbody>
</table>

<h2>Alfred Molina en Spider-Man 2 (2004): el gran Doc Ock</h2>
${figure('faV0HuR6WnQoLrVq3r6mhjaABL9', 'Spider-Man y el Doctor Octopus luchando sobre el techo de un tren', 'La pelea en el tren de Spider-Man 2 (2004), con el Doctor Octopus de Alfred Molina.')}
<p>Para muchos, la versión definitiva. El Otto Octavius de Sam Raimi es un científico bondadoso que admira a Peter y que pierde a su mujer y el control de sí mismo cuando su experimento de fusión falla y los brazos, que debían obedecerle gracias a un chip, acaban dominándole. Alfred Molina hace un villano trágico, humano y temible a la vez, y la pelea en el tren es una de las mejores escenas de acción del cine de superhéroes. Te lo contamos en <a href="/blog/spider-man-2-2004-analisis-mejor-pelicula-superheroes">nuestro análisis de Spider-Man 2</a>.</p>

<h2>Su regreso en No Way Home (2021)</h2>
<p>Diecisiete años después, Molina volvió al papel en <em>No Way Home</em>, cuando el hechizo de Doctor Strange trae a los villanos de otros universos. Su Otto llega justo desde el momento de su muerte en <em>Spider-Man 2</em>, reconoce a Peter Parker… y descubre que no es «su» Peter. El Spider-Man de Tom Holland consigue curarle y devolverle el control de sus brazos, y Otto acaba ayudando a los tres Spider-Man en la batalla final. Lo analizamos en <a href="/blog/spider-man-no-way-home-analisis">nuestro análisis de No Way Home</a>.</p>

<h2>Olivia Octavius, la Doc Ock del Spider-Verso</h2>
<p>En ${peli('spider-man-un-nuevo-universo-2018', 'Un nuevo universo')} (2018), el Doctor Octopus es una mujer: Olivia «Liv» Octavius, una científica de Alchemax que trabaja para Kingpin en el colisionador que abre el multiverso. Con la voz original de Kathryn Hahn, es una de las versiones más originales del personaje y uno de los villanos más divertidos de la película.</p>

<h2>En las series animadas</h2>
${cvFig('12/124259/7925693-rco025_1619001753.jpg', 'El Doctor Octopus con sus cuatro brazos mecánicos', 'El Doctor Octopus de los cómics, con su clásico traje verde y sus cuatro brazos mecánicos.')}
<p>Doc Ock ha aparecido en casi todas las series de Spider-Man, desde la primera, de 1967. En la <a href="/blog/spider-man-animated-series-1994-analisis">serie de 1994</a> fue uno de los villanos clásicos, con la voz de Efrem Zimbalist Jr. En <a href="/blog/spectacular-spider-man-serie-analisis">The Spectacular Spider-Man</a> (2008) es al principio un científico tímido y maltratado por sus jefes, una versión muy humana del personaje. Y en <a href="/blog/ultimate-spider-man-2012-serie-animada-analisis">Ultimate Spider-Man</a> (2012) es uno de los enemigos recurrentes de Peter y de S.H.I.E.L.D.</p>

<h2>En los videojuegos</h2>
<p>En el ${juego('spider-man-2000-2000', 'Spider-Man')} de Neversoft (2000) es el gran villano final, y en el juego de ${juego('spider-man-2-the-game-2004', 'Spider-Man 2')} (2004) vuelve a ser el enemigo principal, con la voz del propio Alfred Molina. Pero su mejor versión en un videojuego es la de ${juego('marvel-s-spider-man-2018', "Marvel's Spider-Man")} (2018): un Otto mentor de Peter, al que el juego dedica horas antes de mostrar su caída, con un final muy emotivo. Lo tienes en <a href="/blog/marvels-spider-man-ps4-2018-analisis-insomniac">nuestro análisis del juego</a>.</p>

<h2>Y en los cómics…</h2>
${cvFig('6/67663/3548171-01.jpg', 'Portada de Superior Spider-Man #1 con un Spider-Man de traje oscurecido', 'Superior Spider-Man (2013): Otto Octavius en el cuerpo de Peter Parker.')}
<p>Fuera de la pantalla, el Doctor Octopus fundó los Seis Siniestros, estuvo a punto de casarse con la tía May y llegó a quedarse con el cuerpo de Peter Parker para convertirse en el <a href="/blog/superior-spider-man-doctor-octopus-analisis">Superior Spider-Man</a>. Ocupa el segundo puesto en nuestro <a href="/blog/mejores-villanos-spider-man-ranking-definitivo">ranking de los mejores villanos de Spider-Man</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Quién interpreta al Doctor Octopus en las películas?</h3>
<p>Alfred Molina, en Spider-Man 2 (2004) y en Spider-Man: No Way Home (2021).</p>
<h3>¿Por qué el Doctor Octopus es una mujer en Un nuevo universo?</h3>
<p>Porque es una versión de otro universo: Olivia Octavius, una científica de Alchemax que trabaja para Kingpin.</p>
<h3>¿Cuál es el nombre real del Doctor Octopus?</h3>
<p>Otto Octavius.</p>
`,
};

const POSTS = [GUIA_REGALOS, ORDEN_PELICULAS, FINAL_BND, MEJORES_COMICS, JUEGOS_POST, TRAJES, VILLANOS_CINE, MARVEL_LEGENDS, MEJORES_LEGO, TRES_SPIDERMAN, BND_STREAMING, SCARLET_SPIDER, VENGADORES, SPIDER_NOIR, DOC_OCK_VERSIONES];

(async () => {
  for (const p of POSTS) {
    const data = { ...p, author: 'Redacción Sentido Arácnido', isPublished: true };
    const r = await prisma.blogPost.upsert({ where: { slug: p.slug }, update: data, create: data });
    console.log('ok', r.slug);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
