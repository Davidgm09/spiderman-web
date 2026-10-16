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

const POSTS = [GUIA_REGALOS, ORDEN_PELICULAS, FINAL_BND];

(async () => {
  for (const p of POSTS) {
    const data = { ...p, author: 'Redacción Sentido Arácnido', isPublished: true };
    const r = await prisma.blogPost.upsert({ where: { slug: p.slug }, update: data, create: data });
    console.log('ok', r.slug);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
