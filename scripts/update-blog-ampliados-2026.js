/**
 * Versiones ampliadas (octubre de 2026) de artículos antiguos del blog que eran demasiado cortos.
 * Mantienen el mismo slug para no perder lo que ya tienen en Google.
 *
 * Uso: node scripts/update-blog-ampliados-2026.js (volver a ejecutar tras populate-blog.js --clean)
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const shot = (path) => `https://media.rawg.io/media/screenshots/${path}.jpg`;
const figure = (path, alt, cap) => `<figure>
  <img src="${shot(path)}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;
const juego = (slug, title) => `<a href="/videojuegos/${slug}"><em>${title}</em></a>`;

const MEJORES_JUEGOS = {
  slug: 'mejores-juegos-spider-man-ranking',
  title: 'Los 10 mejores juegos de Spider-Man de la historia: ranking definitivo',
  subtitle: 'De Maximum Carnage en Super Nintendo a Marvel\'s Spider-Man 2 en PS5: los juegos del trepamuros que de verdad merecen la pena',
  excerpt:
    'Spider-Man lleva más de treinta años en los videojuegos. Repasamos los 10 mejores, de los clásicos de 16 bits a la saga de Insomniac, con lo que hace especial a cada uno y por cuál empezar.',
  readTime: '11 min',
  seoTitle: 'Los 10 mejores juegos de Spider-Man: ranking (2026)',
  seoDescription:
    'Ranking de los 10 mejores juegos de Spider-Man: de Maximum Carnage y el clásico de Neversoft a Spider-Man 2 (2004) y la saga de Insomniac en PS4 y PS5.',
  keywords: ['mejores juegos de Spider-Man', 'ranking juegos Spider-Man', 'Marvel\'s Spider-Man 2', 'Spider-Man PS4', 'Spider-Man 2 2004', 'Ultimate Spider-Man juego', 'Web of Shadows'],
  tags: ['ranking', 'videojuegos', 'Insomniac', 'PS5', 'PS4', 'retro'],
  content: `
<p>Spider-Man lleva más de tres décadas protagonizando videojuegos, y pocos superhéroes tienen una historia tan buena en las consolas. Ha habido de todo: beat 'em ups de 16 bits, adaptaciones de películas, juegos de mundo abierto que se adelantaron a su tiempo y, desde 2018, la saga de Insomniac, que ha convertido al trepamuros en uno de los iconos de PlayStation.</p>

<p>En este ranking nos quedamos con los 10 que de verdad merecen la pena hoy, ya sea por lo bien que han envejecido o por lo que aportaron en su momento. Al final te decimos por cuál empezar según lo que busques.</p>

<h2>El ranking, de un vistazo</h2>
<table>
  <thead><tr><th>#</th><th>Juego</th><th>Año</th><th>Estudio</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>${juego('marvel-s-spider-man-2-2023', 'Marvel\'s Spider-Man 2')}</td><td>2023</td><td>Insomniac Games</td></tr>
    <tr><td>2</td><td>${juego('marvel-s-spider-man-2018', 'Marvel\'s Spider-Man')}</td><td>2018</td><td>Insomniac Games</td></tr>
    <tr><td>3</td><td>${juego('marvel-s-spider-man-miles-morales-2020', 'Marvel\'s Spider-Man: Miles Morales')}</td><td>2020</td><td>Insomniac Games</td></tr>
    <tr><td>4</td><td>${juego('spider-man-2-the-game-2004', 'Spider-Man 2')}</td><td>2004</td><td>Treyarch</td></tr>
    <tr><td>5</td><td>${juego('ultimate-spider-man-2005', 'Ultimate Spider-Man')}</td><td>2005</td><td>Treyarch</td></tr>
    <tr><td>6</td><td>${juego('spider-man-2000-2000', 'Spider-Man')}</td><td>2000</td><td>Neversoft</td></tr>
    <tr><td>7</td><td>${juego('spider-man-web-of-shadows-2008', 'Spider-Man: Web of Shadows')}</td><td>2008</td><td>Shaba Games</td></tr>
    <tr><td>8</td><td>${juego('spider-man-shattered-dimensions-2010', 'Spider-Man: Shattered Dimensions')}</td><td>2010</td><td>Beenox</td></tr>
    <tr><td>9</td><td>${juego('spider-man-and-venom-maximum-carnage-1994', 'Spider-Man and Venom: Maximum Carnage')}</td><td>1994</td><td>Software Creations</td></tr>
    <tr><td>10</td><td>${juego('spider-man-2-enter-electro-2001', 'Spider-Man 2: Enter Electro')}</td><td>2001</td><td>Vicarious Visions</td></tr>
  </tbody>
</table>

<h2>10. Spider-Man 2: Enter Electro (2001)</h2>
<p>La secuela directa del juego de Neversoft llegó a la primera PlayStation de la mano de Vicarious Visions. Mantiene el motor y la estructura de niveles del original, con Electro como gran villano y algunos trajes alternativos muy celebrados. No sorprende tanto como su predecesor, pero es el cierre perfecto de la etapa del personaje en PSX y un buen plan para una tarde de nostalgia.</p>

<h2>9. Spider-Man and Venom: Maximum Carnage (1994)</h2>
${figure('843/843f7eb6758f3ec2fd3f0a0839693c64', 'Escena de introducción de Maximum Carnage en el manicomio de Ravencroft', 'La introducción de Maximum Carnage, en el instituto Ravencroft, con viñetas que imitan a las del cómic.')}
<p>Un beat 'em up para Super Nintendo y Mega Drive que adapta la saga de cómics <em>Maximum Carnage</em> (1993). Spider-Man y Venom, aliados por necesidad, se abren paso a puñetazos por Nueva York contra Carnage y su «familia» de villanos, con escenas narradas con viñetas de cómic. Es duro como pocos juegos de su época, y en Super Nintendo se recuerda también por su cartucho rojo. Si quieres saber más del villano, aquí tienes la ficha de <a href="/personajes/carnage-cletus-kasady-alt">Carnage</a>.</p>

<h2>8. Spider-Man: Shattered Dimensions (2010)</h2>
${figure('a01/a01323c8718d00fef71ebcb8a3750b37', 'Spider-Man Noir en un escenario en blanco y negro', 'El nivel de Spider-Man Noir: sigilo, sombras y un mundo casi en blanco y negro.')}
<p>Beenox tuvo una idea que hoy parece una premonición del Spider-Verso: cuatro Spider-Man de universos distintos (el clásico, Noir, 2099 y Ultimate), cada uno con su propio estilo visual y su forma de jugar. El nivel de <a href="/personajes/spider-man-noir-peter-parker-alt">Spider-Man Noir</a>, basado en el sigilo, es de lo mejor del juego, y la historia la narra el propio Stan Lee.</p>

<h2>7. Spider-Man: Web of Shadows (2008)</h2>
${figure('61f/61f2407952808976856e18ca5959b1ba', 'Spider-Man con el traje negro lanzando tentáculos de simbionte', 'En Web of Shadows se puede cambiar en cualquier momento entre el traje rojo y el traje negro, mucho más agresivo.')}
<p>Una invasión de simbiontes convierte Nueva York en una zona de guerra, y Spider-Man puede cambiar al instante entre el traje rojo, más ágil, y el traje negro, más brutal. Tenía un combate aéreo espectacular para su época, aliados como Lobezno o la Gata Negra y decisiones morales que cambian el final. Fue el único juego de Spider-Man de Shaba Games, y por eso le dedicamos <a href="/blog/spider-man-web-of-shadows-analisis-juego-olvidado">un análisis propio</a>: es el gran olvidado de la saga.</p>

<h2>6. Spider-Man (2000)</h2>
${figure('772/7726b749fb283d2d22851ce48f615cff', 'Spider-Man frente al Doctor Octopus en el juego de 2000', 'El Doctor Octopus, el gran villano del juego de Neversoft de 2000.')}
<p>El juego que demostró que Spider-Man funcionaba en 3D. Neversoft, el estudio de <em>Tony Hawk's Pro Skater</em>, aprovechó su motor para crear un juego por niveles con balanceo, combate y una enorme galería de villanos, del Doctor Octopus a Venom y Carnage. Stan Lee hacía de narrador, y los trucos y trajes desbloqueables lo convirtieron en un clásico de la primera PlayStation.</p>

<h2>5. Ultimate Spider-Man (2005)</h2>
${figure('6c1/6c17ca038dc6cbc8080d20012dd50a00', 'Venom luchando en una calle de Nueva York en Ultimate Spider-Man', 'En Ultimate Spider-Man se juega también con Venom, que salta, destroza y lanza coches.')}
<p>Treyarch tomó el balanceo de <em>Spider-Man 2</em> y lo vistió con un aspecto de cómic con cel shading, con viñetas en pantalla incluidas. La historia la escribió Brian Michael Bendis, guionista del cómic <em>Ultimate Spider-Man</em>, y la gran novedad era que también se jugaba con Venom, en partes donde el objetivo era destrozarlo todo. Es el juego que mejor ha capturado el aspecto de los cómics.</p>

<h2>4. Spider-Man 2 (2004)</h2>
${figure('61b/61b8412b13e1836501dd5c8ffbb3f428', 'Spider-Man balanceándose entre rascacielos de noche', 'Spider-Man 2 (2004): por primera vez, cada telaraña se engancha a un edificio de verdad.')}
<p>Para muchos jugadores sigue siendo el mejor balanceo de la historia. El juego de la película de Sam Raimi fue el primero en usar una física real: cada telaraña se engancha a un edificio concreto, y la velocidad depende de la altura y del impulso. Con una Manhattan entera para recorrer, fue uno de los primeros grandes juegos de superhéroes en mundo abierto. Además del Doctor Octopus, aparecen Mysterio y la Gata Negra, y Bruce Campbell hace de narrador en los tutoriales.</p>

<h2>3. Marvel's Spider-Man: Miles Morales (2020)</h2>
${figure('e20/e2007d863194a66053c79d325401950f', 'Miles Morales golpeando a un enemigo con su descarga bioeléctrica', 'Las descargas bioeléctricas «venom» son el gran añadido de Miles al combate.')}
<p>Más corto que el juego de Peter, pero redondo. ${juego('marvel-s-spider-man-miles-morales-2020', 'Miles Morales')} llegó con el lanzamiento de PS5 y cuenta cómo Miles se convierte en el protector de Harlem en Navidad, enfrentado a la corporación Roxxon y a un misterioso Tinkerer. Sus descargas bioeléctricas y su invisibilidad cambian el combate y el sigilo, y la historia, más íntima y familiar, convirtió a Miles en un icono. Lo analizamos a fondo en <a href="/blog/spider-man-miles-morales-ps5-analisis">nuestro análisis del juego</a>.</p>

<h2>2. Marvel's Spider-Man (2018)</h2>
${figure('331/331ba5164c5c53a5d59aad3fe9771ac7', 'Spider-Man balanceándose bajo la lluvia en Nueva York', 'Marvel\'s Spider-Man (2018): un Peter Parker veterano y una Nueva York que da gusto recorrer.')}
<p>El juego que lo cambió todo. Insomniac presentó a un Peter Parker de 23 años, con ocho años de experiencia como Spider-Man, y una historia original con el Doctor Octopus y Mister Negativo que estaba a la altura de cualquier película. Su balanceo es fluido y espectacular, y su Nueva York, una delicia. Vendió 3,3 millones de copias en sus tres primeros días, un récord para un juego de PlayStation en aquel momento. Tienes <a href="/blog/marvels-spider-man-ps4-2018-analisis-insomniac">nuestro análisis completo</a>.</p>

<h2>1. Marvel's Spider-Man 2 (2023)</h2>
${figure('89b/89b077deb2a3ce38e071fdb5caae69c0', 'Miles Morales y Peter Parker juntos con sus trajes', 'Peter y Miles comparten protagonismo en Marvel\'s Spider-Man 2.')}
<p>La suma de todo lo anterior. En ${juego('marvel-s-spider-man-2-2023', 'Marvel\'s Spider-Man 2')} se controla a Peter y a Miles, con un mapa que añade Queens y Brooklyn, las alas de telaraña para planear y una historia que enfrenta a los dos Spider-Man con Kraven y con Venom. El simbionte, además, permite jugar con el traje negro y unos poderes mucho más salvajes. Vendió 2,5 millones de copias en 24 horas, el mejor estreno de un juego de PlayStation Studios hasta entonces, y en 2025 llegó también a PC. Lo contamos en <a href="/blog/marvels-spider-man-2-ps5-analisis">nuestro análisis</a>.</p>

<h2>¿Por cuál empiezo?</h2>
<ul>
  <li><strong>Si tienes PS5 o PC:</strong> empieza por <em>Marvel's Spider-Man</em> (en su versión Remastered), sigue con <em>Miles Morales</em> y termina con <em>Marvel's Spider-Man 2</em>. Es una sola historia, y vale la pena jugarla en orden.</li>
  <li><strong>Si te gusta lo retro:</strong> <em>Spider-Man 2</em> (2004) sigue siendo una gozada para balancearse, y <em>Maximum Carnage</em> es un reto de los de antes.</li>
  <li><strong>Si te gustó el Spider-Verso:</strong> <em>Shattered Dimensions</em> es lo más parecido en videojuego, con cuatro Spider-Man de universos distintos.</li>
</ul>
<p>¿Y lo próximo? Insomniac ya prepara la tercera entrega; te contamos <a href="/blog/marvels-spider-man-3-insomniac-todo-lo-que-sabemos">todo lo que sabemos de Marvel's Spider-Man 3</a>. Y si quieres poner a prueba lo que sabes de los juegos del trepamuros, prueba nuestro <a href="/juegos/test-spider-man">test de Spider-Man</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuál es el mejor juego de Spider-Man?</h3>
<p>Para nosotros, <em>Marvel's Spider-Man 2</em> (2023), aunque el de 2018 y el <em>Spider-Man 2</em> de 2004 tienen muchos defensores.</p>
<h3>¿En qué orden se juegan los Spider-Man de Insomniac?</h3>
<p><em>Marvel's Spider-Man</em> (2018), después <em>Miles Morales</em> (2020) y por último <em>Marvel's Spider-Man 2</em> (2023).</p>
<h3>¿Se pueden jugar en PC?</h3>
<p>Sí: los tres juegos de Insomniac están en PC. <em>Marvel's Spider-Man 2</em> fue el último en llegar, en 2025.</p>
`,
};

const POSTS = [MEJORES_JUEGOS];

(async () => {
  for (const { slug, ...data } of POSTS) {
    const r = await prisma.blogPost.update({ where: { slug }, data });
    console.log('ok', r.slug, `(${data.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} palabras)`);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
