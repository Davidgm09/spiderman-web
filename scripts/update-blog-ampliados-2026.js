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

const cv = (path) => `https://comicvine.gamespot.com/a/uploads/${path}`;
const cvFigure = (path, alt, cap) => `<figure>
  <img src="${cv(path)}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;
const pj = (slug, name) => `<a href="/personajes/${slug}-alt">${name}</a>`;

const MEJORES_VILLANOS = {
  slug: 'mejores-villanos-spider-man-ranking-definitivo',
  title: 'Los 10 mejores villanos de Spider-Man: ranking definitivo',
  subtitle: 'Del Duende Verde a Electro: la galería de villanos más rica de los cómics, con su origen, su mejor historia y por qué funcionan',
  excerpt:
    'Spider-Man tiene la mejor galería de villanos de Marvel. Repasamos los 10 más importantes de los cómics, con su primera aparición, su mejor historia y lo que les hace únicos.',
  readTime: '12 min',
  seoTitle: 'Los 10 mejores villanos de Spider-Man: ranking definitivo',
  seoDescription:
    'Los mejores villanos de Spider-Man en los cómics: Duende Verde, Doctor Octopus, Venom, Kraven, Kingpin, Carnage y más, con su origen y su mejor historia.',
  keywords: ['villanos de Spider-Man', 'mejores villanos de Spider-Man', 'enemigos de Spider-Man', 'Duende Verde', 'Doctor Octopus', 'Venom', 'Kraven'],
  tags: ['ranking', 'villanos', 'cómics', 'Duende Verde', 'Venom', 'Doctor Octopus'],
  content: `
<p>Spider-Man tiene algo que pocos superhéroes pueden presumir: una galería de villanos en la que casi cualquiera podría protagonizar su propia saga. Muchos nacieron en los primeros años de la serie, de la mano de Stan Lee y Steve Ditko, y siguen siendo igual de importantes más de sesenta años después.</p>

<p>Lo que los hace especiales es que casi todos son un reflejo de Peter Parker: científicos que usaron mal su talento, gente corriente a la que la vida trató peor que a él o personas que tuvieron poder y eligieron la irresponsabilidad. En este ranking nos centramos en los cómics; si te interesa el cine, tenemos <a href="/blog/villanos-spider-man-peliculas-ranking">el ranking de villanos de las películas</a>.</p>

<h2>El ranking, de un vistazo</h2>
<table>
  <thead><tr><th>#</th><th>Villano</th><th>Debut</th><th>Su mejor historia</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>${pj('green-goblin-norman-osborn', 'Duende Verde')}</td><td>1964</td><td>La noche en que murió Gwen Stacy</td></tr>
    <tr><td>2</td><td>${pj('doctor-octopus-otto-octavius', 'Doctor Octopus')}</td><td>1963</td><td>Superior Spider-Man</td></tr>
    <tr><td>3</td><td>${pj('venom-eddie-brock', 'Venom')}</td><td>1988</td><td>The Amazing Spider-Man #300</td></tr>
    <tr><td>4</td><td>${pj('kraven-the-hunter-sergei-kravinoff', 'Kraven el Cazador')}</td><td>1964</td><td>La última cacería de Kraven</td></tr>
    <tr><td>5</td><td>${pj('kingpin-wilson-fisk', 'Kingpin')}</td><td>1967</td><td>Spider-Man No More!</td></tr>
    <tr><td>6</td><td>${pj('carnage-cletus-kasady', 'Carnage')}</td><td>1992</td><td>Maximum Carnage</td></tr>
    <tr><td>7</td><td>${pj('mysterio-quentin-beck', 'Mysterio')}</td><td>1964</td><td>Sus ilusiones de los años 60</td></tr>
    <tr><td>8</td><td>${pj('vulture-adrian-toomes', 'El Buitre')}</td><td>1963</td><td>The Amazing Spider-Man #2</td></tr>
    <tr><td>9</td><td>${pj('lizard-curtis-connors', 'El Lagarto')}</td><td>1963</td><td>The Amazing Spider-Man #6</td></tr>
    <tr><td>10</td><td>${pj('electro-maxwell-dillon', 'Electro')}</td><td>1964</td><td>The Amazing Spider-Man #9</td></tr>
  </tbody>
</table>

<h2>10. Electro (Max Dillon)</h2>
<p>Max Dillon era un electricista que trabajaba en un tendido eléctrico cuando le alcanzó un rayo. Sobrevivió convertido en un generador viviente y decidió usar su poder para robar. Debutó en <em>The Amazing Spider-Man</em> #9 (1964) y, aunque en los cómics suele ser un villano de segunda fila, su resentimiento de «hombre corriente al que nadie hace caso» le ha dado mucho juego, sobre todo en el cine con Jamie Foxx.</p>

<h2>9. El Lagarto (Curt Connors)</h2>
${cvFigure('scale_medium/11144/111442876/8791115-dfgeges.jpg', 'El Lagarto con su bata de laboratorio', 'El Lagarto conserva la bata de laboratorio del doctor Connors: el monstruo nunca borra del todo al científico.')}
<p>Curt Connors perdió un brazo en la guerra, donde servía como cirujano, y quiso regenerarlo con ADN de reptil. Funcionó… demasiado bien. Debutó en <em>The Amazing Spider-Man</em> #6 (1963) y es uno de los villanos más trágicos de la serie: Connors es un buen hombre, amigo y mentor de Peter, con una mujer y un hijo, al que su propio experimento convierte en un monstruo.</p>

<h2>8. El Buitre (Adrian Toomes)</h2>
<p>El segundo villano de la serie, en <em>The Amazing Spider-Man</em> #2 (1963). Adrian Toomes era un ingeniero brillante al que su socio estafó, y usó su arnés de vuelo para vengarse y robar. Es un villano poco habitual: un anciano que demuestra que la edad no le quita ni un ápice de peligro. Michael Keaton le dio en <em>Homecoming</em> su mejor versión fuera de los cómics.</p>

<h2>7. Mysterio (Quentin Beck)</h2>
${cvFigure('scale_medium/3/33913/997983-113_web_of_spider_man_4.jpg', 'Mysterio con su casco de cristal lleno de humo', 'El casco de cristal de Mysterio, una de las siluetas más reconocibles de la galería de villanos de Spider-Man.')}
<p>Quentin Beck era un experto en efectos especiales de Hollywood que decidió que se haría famoso derrotando a Spider-Man. Debutó en <em>The Amazing Spider-Man</em> #13 (1964) y su arma son las ilusiones: hologramas, gases alucinógenos y trucos de escenario. Con los años ha protagonizado algunas de las historias más perturbadoras de la serie, y en <em>Lejos de casa</em> (2019) dio pie a uno de los mejores villanos del MCU.</p>

<h2>6. Carnage (Cletus Kasady)</h2>
${cvFigure('scale_medium/12/124259/8056391-extreme_carnage_alpha_vol_1_1_lee_retailer_shared_exclusive_virgin_variant.jpg', 'Carnage con sus tentáculos rojos bajo la luna', 'Carnage: el simbionte rojo, hijo del de Venom, unido a un asesino en serie.')}
<p>Cletus Kasady era el compañero de celda de Eddie Brock. Cuando el simbionte de Venom fue a rescatar a Eddie, dejó atrás una «cría» que se unió a Kasady, y así nació Carnage en 1992. Si Venom tiene un código moral retorcido, Carnage no tiene ninguno: es caos puro. Su gran saga, <em>Maximum Carnage</em> (1993), obligó a Spider-Man a aliarse con Venom, y hasta tuvo su propio videojuego.</p>

<h2>5. Kingpin (Wilson Fisk)</h2>
<p>El rey del crimen de Nueva York debutó en <em>The Amazing Spider-Man</em> #50 (1967), el número de la famosa portada de Peter tirando su traje a la basura. Fisk no tiene superpoderes, pero no le hacen falta: es un luchador formidable y, sobre todo, un estratega que siempre va diez pasos por delante. Es tan buen villano que acabó siendo el gran enemigo de Daredevil.</p>

<h2>4. Kraven el Cazador (Sergei Kravinoff)</h2>
${cvFigure('scale_medium/11125/111253436/6733787-b.jpg', 'Kraven el Cazador con su chaleco de piel de león y una lanza', 'Kraven, con su chaleco de piel de león: un cazador que considera a Spider-Man la presa definitiva.')}
<p>Kraven debutó en <em>The Amazing Spider-Man</em> #15 (1964) como un cazador de fieras que quería probarse cazando a la presa más peligrosa de todas. Durante años fue un villano más, hasta que <em>La última cacería de Kraven</em> (1987), de J. M. DeMatteis y Mike Zeck, lo convirtió en leyenda: Kraven derrota a Spider-Man, lo entierra vivo y ocupa su lugar para demostrar que es mejor que él. Es una de las mejores historias de la historia del personaje; la tienes en <a href="/blog/kravens-last-hunt-analisis-mejor-arco-spider-man">nuestro análisis</a>.</p>

<h2>3. Venom (Eddie Brock)</h2>
${cvFigure('scale_medium/11125/111253436/6733785-9.jpg', 'Venom agazapado sobre una cornisa de Nueva York', 'Venom: el traje que Peter rechazó, unido a un hombre que le odiaba.')}
<p>Peter consiguió un traje negro alienígena en <em>Secret Wars</em> (1984), descubrió que era un ser vivo y se libró de él en el campanario de una iglesia. Allí mismo estaba Eddie Brock, un periodista que culpaba a Spider-Man de haber arruinado su carrera, y el simbionte encontró en él a su pareja perfecta. Venom debutó del todo en <em>The Amazing Spider-Man</em> #300 (1988) y fue un fenómeno: conoce todos los secretos de Peter, su sentido arácnido no lo detecta y es mucho más fuerte. Con los años pasó de villano a antihéroe con serie propia. Te lo contamos en <a href="/blog/simbionte-historia-evolucion-venom">la historia del simbionte</a>.</p>

<h2>2. Doctor Octopus (Otto Octavius)</h2>
${cvFigure('scale_medium/12/124259/7925693-rco025_1619001753.jpg', 'El Doctor Octopus con sus cuatro brazos mecánicos', 'Otto Octavius y sus brazos mecánicos, unidos a su cuerpo tras un accidente en el laboratorio.')}
<p>Un científico brillante, arrogante y acomplejado al que un accidente de laboratorio dejó unido a sus cuatro brazos mecánicos. Debutó en <em>The Amazing Spider-Man</em> #3 (1963), fue el líder de los Seis Siniestros y llegó incluso a estar a punto de casarse con la tía May. Pero su gran momento llegó en 2013, cuando se apoderó del cuerpo de Peter Parker y se convirtió en el <a href="/blog/superior-spider-man-doctor-octopus-analisis">Superior Spider-Man</a>, un intento de ser un héroe «mejor» que Peter que acabó demostrando lo que de verdad significa serlo.</p>

<h2>1. El Duende Verde (Norman Osborn)</h2>
${cvFigure('scale_large/1/12840/1704865-genetic_construct_gg.jpg', 'El Duende Verde volando en su planeador en una viñeta clásica', 'El Duende Verde en su planeador, en una viñeta de cómic clásica.')}
<p>No hay debate. El Duende Verde debutó en <em>The Amazing Spider-Man</em> #14 (1964) como un misterio con máscara, y en 1966 se reveló que era Norman Osborn, el padre de Harry, el mejor amigo de Peter. Conoce la identidad secreta de Spider-Man, ataca siempre lo que más le duele y protagonizó el momento más importante de la historia del personaje: la muerte de Gwen Stacy en <em>The Amazing Spider-Man</em> #121 (1973). Lo contamos en <a href="/blog/legado-muerte-gwen-stacy-50-anos">el legado de La noche en que murió Gwen Stacy</a>.</p>
<p>Murió en el número siguiente, empalado por su propio planeador, pero regresó en los años 90 y ha seguido siendo una amenaza: llegó a dirigir los Vengadores Oscuros. Ningún otro villano ha hecho tanto daño a Peter Parker.</p>

<h2>Menciones de honor</h2>
<ul>
  <li>${pj('hobgoblin-roderick-kingsley', 'Hobgoblin')}: el heredero del Duende y el gran misterio de los años 80.</li>
  <li>${pj('sandman-william-baker', 'El Hombre de Arena')}: un criminal con más corazón de lo que parece, que llegó a ser aliado de Spider-Man.</li>
  <li>${pj('rhino-aleksei-sytsevich', 'Rino')}, ${pj('scorpion-mac-gargan', 'el Escorpión')} y ${pj('shocker-herman-schultz', 'Shocker')}: la fuerza bruta clásica de la galería.</li>
  <li>${pj('mister-negative-martin-li', 'Mister Negativo')}, ${pj('morlun', 'Morlun')} y ${pj('jackal-miles-warren', 'el Chacal')}: villanos más recientes, o más raros, que protagonizaron grandes sagas.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuál es el peor enemigo de Spider-Man?</h3>
<p>El Duende Verde, Norman Osborn: conoce su identidad secreta y mató a Gwen Stacy.</p>
<h3>¿Quién fue el primer villano de Spider-Man?</h3>
<p>En <em>Amazing Fantasy</em> #15 (1962) Peter se enfrenta al ladrón que mata al tío Ben. El primer supervillano llegó en <em>The Amazing Spider-Man</em> #1 (1963): el Camaleón.</p>
<h3>¿Quiénes son los Seis Siniestros?</h3>
<p>El grupo de villanos que formó el Doctor Octopus en 1964: Buitre, Electro, Kraven, Mysterio y el Hombre de Arena, además del propio Octopus.</p>
`,
};

const SPIDERMAN_PS4 = {
  slug: 'marvels-spider-man-ps4-2018-analisis-insomniac',
  title: 'Marvel\'s Spider-Man (PS4, 2018): análisis del juego que lo cambió todo',
  subtitle: 'Balanceo, historia, combate, DLC y versiones: por qué el Spider-Man de Insomniac sigue siendo imprescindible',
  excerpt:
    'Marvel\'s Spider-Man (2018) convirtió al trepamuros en un icono de PlayStation. Analizamos su balanceo, su historia con Doctor Octopus, el combate, los DLC y qué versión jugar hoy.',
  readTime: '10 min',
  seoTitle: 'Marvel\'s Spider-Man (PS4): análisis completo del juego',
  seoDescription:
    'Análisis de Marvel\'s Spider-Man (2018) de Insomniac: balanceo, historia sin spoilers, combate, villanos, DLC The City That Never Sleeps y qué versión jugar hoy.',
  keywords: ['Marvel\'s Spider-Man análisis', 'Spider-Man PS4', 'Spider-Man 2018', 'Spider-Man Remastered', 'Insomniac Games', 'Spider-Man PS4 DLC'],
  tags: ['análisis', 'videojuegos', 'Insomniac', 'PS4', 'PS5', 'PC'],
  content: `
<p>Cuando <em>Marvel's Spider-Man</em> llegó a PS4 el 7 de septiembre de 2018, el listón de los juegos de superhéroes lo marcaba la saga <em>Batman: Arkham</em>. Insomniac Games, el estudio de <em>Ratchet &amp; Clank</em>, no solo lo igualó: creó el Spider-Man que muchos llevaban años esperando. Vendió 3,3 millones de copias en tres días, un récord para un juego de PlayStation en aquel momento, y dio pie a toda una saga. Este es nuestro análisis, sin spoilers.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estudio</strong></td><td>Insomniac Games</td></tr>
    <tr><td><strong>Lanzamiento</strong></td><td>7 de septiembre de 2018 (PS4)</td></tr>
    <tr><td><strong>Otras versiones</strong></td><td>Remastered para PS5 (2020) y PC (2022)</td></tr>
    <tr><td><strong>Duración</strong></td><td>Unas 20 horas la historia; bastantes más si lo completas</td></tr>
    <tr><td><strong>Villanos</strong></td><td>Doctor Octopus, Mister Negativo, Kingpin y los Seis Siniestros</td></tr>
    <tr><td><strong>Ficha</strong></td><td>${juego('marvel-s-spider-man-2018', 'Marvel\'s Spider-Man')}</td></tr>
  </tbody>
</table>

<h2>El balanceo que lo cambia todo</h2>
${figure('331/331ba5164c5c53a5d59aad3fe9771ac7', 'Spider-Man balanceándose bajo la lluvia', 'El balanceo de Insomniac: cada telaraña se engancha a un edificio y el movimiento tiene peso real.')}
<p>El gran logro del juego es moverse por Manhattan. Cada telaraña se engancha a un edificio de verdad, el impulso se nota y el juego premia encadenar balanceos, saltos y carreras por las fachadas. Es fácil de aprender pero tiene mucha profundidad, y después de horas sigue siendo un placer cruzar la ciudad sin usar el viaje rápido. No es tan exigente como el de <a href="/videojuegos/spider-man-2-the-game-2004"><em>Spider-Man 2</em> (2004)</a>, pero sí más espectacular.</p>

<h2>Un Peter Parker adulto</h2>
<p>El Peter de Insomniac tiene 23 años y lleva ocho siendo Spider-Man. Ya no es el adolescente que descubre sus poderes: es un adulto que trabaja como ayudante del científico Otto Octavius, llega tarde a todo, no tiene dinero para el alquiler y acaba de romper con Mary Jane. Esta versión madura permite contar algo distinto a la historia de origen de siempre.</p>
<p>La trama arranca con la detención de Kingpin, lo que deja un vacío de poder en Nueva York que aprovecha Mister Negativo y su banda, los Demonios Interiores. A partir de ahí, la historia va encadenando villanos clásicos hasta un tercer acto que se atreve con algo que pocas historias de superhéroes hacen: consecuencias permanentes, que duelen de verdad.</p>
<p>Hay también fases en las que se controla a Mary Jane, ahora periodista, y a un joven Miles Morales, centradas en el sigilo. Son el punto más flojo del juego, pero ayudan a construir el mundo y preparan el terreno para <em>Miles Morales</em>.</p>

<h2>Combate y gadgets</h2>
${figure('a15/a15b42bd8a652a3733c6ad419ebb24bd', 'Spider-Man saltando sobre un camión frente a un atracador armado', 'El combate es rápido y acrobático: aquí, frenando un atraco a un furgón blindado.')}
<p>El combate bebe de los <em>Arkham</em>, pero con mucha más verticalidad: Spider-Man se lanza al aire con los enemigos, usa el entorno para lanzarles objetos y combina golpes con gadgets como las telarañas eléctricas o las minas de telaraña. El sentido arácnido avisa de los ataques y permite esquivar con elegancia. A medida que avanza el juego aparecen enemigos con escudos, lanzacohetes y armaduras que obligan a variar.</p>
<p>Fuera de la historia hay crímenes que frenar, bases enemigas que limpiar, retos de Taskmaster y las mochilas que Peter escondió por toda la ciudad, llenas de recuerdos de su pasado. Y un buen puñado de trajes, de los clásicos de los cómics a los de las películas, cada uno con una habilidad especial.</p>

<h2>Los villanos</h2>
${figure('80e/80e7335a1e0b17b56cf33d51dcd92511', 'Spider-Man esquivando la cola del Escorpión bajo la lluvia', 'Uno de los combates contra los villanos de la última parte del juego, bajo la lluvia.')}
<p>El gran acierto es Otto Octavius. El juego se toma su tiempo para presentarlo como un científico brillante y bondadoso, mentor de Peter, y su caída es la parte más emotiva de la historia. ${pj('mister-negative-martin-li', 'Mister Negativo')} es un villano poco conocido fuera de los cómics, y el juego lo convierte en un antagonista muy sólido. Y cuando llegan los Seis Siniestros, el juego sube de ritmo hasta un final espectacular.</p>

<h2>El DLC: The City That Never Sleeps</h2>
<p>Tras el lanzamiento llegaron tres capítulos descargables, reunidos en ${juego('marvel-s-spider-man-the-city-that-never-sleeps-2018', 'The City That Never Sleeps')}: ${juego('marvel-s-spider-man-the-heist-2018', 'The Heist')}, con la Gata Negra; <em>Turf Wars</em>, con Cabeza de Martillo; y ${juego('marvel-s-spider-man-silver-lining-2018', 'Silver Lining')}, con Silver Sable. Son una buena excusa para volver a la ciudad, aunque el primero es el más interesante.</p>

<h2>¿Qué versión jugar hoy?</h2>
<ul>
  <li><strong>PS5:</strong> ${juego('marvel-s-spider-man-remastered-2020', 'Marvel\'s Spider-Man Remastered')} (2020) mejora los gráficos, añade trazado de rayos y tiempos de carga casi instantáneos, e incluye todos los DLC. Ojo: cambió la cara de Peter Parker por la de otro actor.</li>
  <li><strong>PC:</strong> la versión Remastered llegó en 2022, con muy buen rendimiento.</li>
  <li><strong>PS4:</strong> el original sigue funcionando perfectamente si no tienes otra plataforma.</li>
</ul>

<h2>El legado</h2>
<p>Junto con <a href="/blog/spider-man-miles-morales-ps5-analisis"><em>Miles Morales</em></a>, la saga superaba ya los 33 millones de copias en mayo de 2022, y continuó con <a href="/blog/marvels-spider-man-2-ps5-analisis"><em>Marvel's Spider-Man 2</em></a> en 2023. Pero su verdadero legado es haber demostrado que un juego de superhéroes puede tener la misma ambición narrativa que las mejores aventuras. En nuestro <a href="/blog/mejores-juegos-spider-man-ranking">ranking de los mejores juegos de Spider-Man</a> ocupa el segundo puesto.</p>

<h2>Veredicto</h2>
<p><strong>Lo mejor:</strong> el balanceo, Otto Octavius, la Nueva York de Insomniac y un tercer acto que no se olvida.<br />
<strong>Lo peor:</strong> las fases de sigilo con Mary Jane y Miles, y unas actividades secundarias que se repiten.</p>
<p><strong>Puntuación: 9/10.</strong> Imprescindible si te gusta Spider-Man, y el mejor punto de partida para la saga de Insomniac.</p>
`,
};

const SPIDERMAN_2_PS5 = {
  slug: 'marvels-spider-man-2-ps5-analisis',
  title: 'Marvel\'s Spider-Man 2 (PS5): análisis completo',
  subtitle: 'Peter y Miles, Kraven y Venom: Insomniac firma el juego de Spider-Man más ambicioso hasta la fecha',
  excerpt:
    'Marvel\'s Spider-Man 2 junta a Peter Parker y Miles Morales contra Kraven y Venom. Analizamos su mapa, el combate con el simbionte, la historia sin spoilers, sus fallos y la versión de PC.',
  readTime: '11 min',
  seoTitle: 'Marvel\'s Spider-Man 2 (PS5): análisis completo',
  seoDescription:
    'Análisis de Marvel\'s Spider-Man 2: Peter y Miles contra Kraven y Venom, el nuevo mapa con Queens y Brooklyn, las alas de telaraña, el traje simbionte y la versión de PC.',
  keywords: ['Marvel\'s Spider-Man 2 análisis', 'Spider-Man 2 PS5', 'Spider-Man 2 PC', 'Venom Spider-Man 2', 'Kraven Spider-Man 2', 'Insomniac Games'],
  tags: ['análisis', 'videojuegos', 'Insomniac', 'PS5', 'PC', 'Venom'],
  content: `
<p>Insomniac Games lanzó <em>Marvel's Spider-Man 2</em> el 20 de octubre de 2023 en PS5, con una promesa tan sencilla como ambiciosa: tomar todo lo que funcionaba en <a href="/blog/marvels-spider-man-ps4-2018-analisis-insomniac">Marvel's Spider-Man</a> y en <a href="/blog/spider-man-miles-morales-ps5-analisis">Miles Morales</a> y llevarlo un paso más allá. Vendió 2,5 millones de copias en 24 horas y 5 millones en 11 días, el mejor estreno de un juego de PlayStation Studios hasta entonces, y después superó los 10 millones. Este es nuestro análisis, sin spoilers importantes.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estudio</strong></td><td>Insomniac Games</td></tr>
    <tr><td><strong>Lanzamiento</strong></td><td>20 de octubre de 2023 (PS5); 30 de enero de 2025 (PC)</td></tr>
    <tr><td><strong>Protagonistas</strong></td><td>Peter Parker y Miles Morales</td></tr>
    <tr><td><strong>Villanos</strong></td><td>Kraven el Cazador y Venom, entre otros</td></tr>
    <tr><td><strong>Duración</strong></td><td>Unas 20 horas la historia; unas 35 si lo completas</td></tr>
    <tr><td><strong>Ficha</strong></td><td>${juego('marvel-s-spider-man-2-2023', 'Marvel\'s Spider-Man 2')}</td></tr>
  </tbody>
</table>

<h2>Nueva York, ahora más grande</h2>
${figure('f38/f382f7af6b972ef2adf129faad54625e', 'Miles Morales balanceándose sobre Queens, con un estadio de béisbol al fondo', 'El nuevo mapa suma Queens y Brooklyn a Manhattan: barrios más bajos, con más espacio para planear.')}
<p>La ciudad de Spider-Man 2 es mucho más grande que la de los juegos anteriores: Queens y Brooklyn se suman a Manhattan, con barrios más bajos y abiertos que cambian la forma de moverse. Para cruzarlos, Insomniac añadió las <strong>alas de telaraña</strong>, que permiten planear y aprovechar las corrientes de aire. Junto con el balanceo, que es más fluido que nunca, recorrer la ciudad sigue siendo el gran placer del juego.</p>

<h2>Dos Spider-Man, una historia</h2>
${figure('89b/89b077deb2a3ce38e071fdb5caae69c0', 'Miles Morales y Peter Parker juntos con sus trajes', 'Peter y Miles comparten protagonismo: el juego alterna entre los dos a lo largo de la historia.')}
<p>El juego alterna entre Peter y Miles. En la historia, cada misión tiene un protagonista; en el mundo abierto, se puede cambiar de uno a otro cuando quieras desde el mapa. Cada uno tiene su propio árbol de habilidades y su estilo: Miles sigue siendo el rey de las descargas bioeléctricas, y Peter, con sus brazos mecánicos de araña primero y con el simbionte después, gana un combate mucho más contundente.</p>

<h2>El traje simbionte</h2>
${figure('74e/74e29808dd23446aae1ab61bb5a429fc', 'Spider-Man con brazos mecánicos de araña atacando a un enemigo en una calle de neón', 'Antes del simbionte, Peter pelea con unos brazos mecánicos de araña que salen de su traje.')}
<p>La historia de Peter con el traje negro es el corazón del juego. El simbionte le da poderes brutales, con tentáculos que golpean a varios enemigos a la vez, pero también saca lo peor de él. Insomniac no tiene miedo de enseñar a un Peter Parker inquietante, que trata mal a quienes le quieren, y funciona precisamente porque los juegos anteriores nos han hecho querer a este personaje. Si te interesa la historia de este alienígena en los cómics, tienes <a href="/blog/simbionte-historia-evolucion-venom">la historia del simbionte</a>.</p>

<h2>Kraven y Venom</h2>
${figure('c71/c718076de2326247d29ea5ed32e67c6c', 'El rostro de Venom en la oscuridad', 'Venom, con la voz original de Tony Todd: la versión más imponente del personaje en un videojuego.')}
<p>${pj('kraven-the-hunter-sergei-kravinoff', 'Kraven el Cazador')} es el gran antagonista de la primera mitad, y una de las sorpresas del juego. Este Kraven llega a Nueva York buscando una presa digna que le dé una muerte honorable, y su cacería pone en peligro a toda la ciudad. Su código de honor retorcido lo convierte en uno de los villanos más interesantes de Insomniac.</p>
<p>${pj('venom-eddie-brock', 'Venom')}, con la voz original de Tony Todd, toma el relevo en la segunda mitad. No desvelamos quién está bajo el simbionte, pero la versión de Insomniac es distinta a la de los cómics, y su diseño es el más espectacular que ha tenido el personaje fuera de las viñetas. También hay sitio para el Lagarto, el Hombre de Arena, Mister Negativo y misiones secundarias con otros villanos conocidos.</p>

<h2>Lo que no termina de funcionar</h2>
${figure('adf/adf5f5ae4b83e65b23194cadf3a189c2', 'Miles Morales lanzando una descarga azul contra una criatura en llamas', 'El tramo final es espectacular, pero también el más apresurado.')}
<p>El tramo final de la historia va demasiado deprisa para todo lo que ha construido, y la historia de Miles se resuelve con menos cuidado que la de Peter. Las actividades secundarias siguen siendo muchas y algo repetitivas, y quien esperaba un mapa lleno de interiores se encontrará, otra vez, una ciudad que se disfruta sobre todo desde el aire. Aun así, son defectos menores frente a todo lo que hace bien.</p>

<h2>¿PS5 o PC?</h2>
<p>La versión de PS5 es la original, con modos de calidad y de rendimiento. La de PC llegó el 30 de enero de 2025; al principio tuvo problemas técnicos que se fueron corrigiendo con parches. Si tienes las dos plataformas, la de PS5 es la opción más segura.</p>

<h2>Veredicto</h2>
<p><strong>Lo mejor:</strong> las alas de telaraña y el nuevo mapa, el traje simbionte, Kraven y la química entre Peter y Miles.<br />
<strong>Lo peor:</strong> un final apresurado y un arco de Miles menos trabajado.</p>
<p><strong>Puntuación: 9,5/10.</strong> El juego de Spider-Man más ambicioso hasta la fecha, y el número 1 de nuestro <a href="/blog/mejores-juegos-spider-man-ranking">ranking de los mejores juegos de Spider-Man</a>. ¿Y ahora qué? Te contamos <a href="/blog/marvels-spider-man-3-insomniac-todo-lo-que-sabemos">todo lo que sabemos de Marvel's Spider-Man 3</a>.</p>
`,
};

const tmdb = (id, size = 'w1280') => `https://image.tmdb.org/t/p/${size}/${id}.jpg`;
const tmdbFigure = (id, alt, cap) => `<figure>
  <img src="${tmdb(id)}" alt="${alt}" loading="lazy" />
  <figcaption>${cap}</figcaption>
</figure>`;
const peli = (slug, title) => `<a href="/peliculas/${slug}"><em>${title}</em></a>`;

const NO_WAY_HOME = {
  slug: 'spider-man-no-way-home-analisis',
  title: 'Spider-Man: No Way Home, análisis: el cierre perfecto de una era',
  subtitle: 'El multiverso, el regreso de Tobey Maguire y Andrew Garfield, la tía May y un final que lo cambia todo (con spoilers)',
  excerpt:
    'Analizamos Spider-Man: No Way Home (2021): cómo junta a tres generaciones de Spider-Man, qué hace con sus villanos, por qué la muerte de la tía May es clave y qué significa su final para Brand New Day.',
  readTime: '11 min',
  seoTitle: 'Spider-Man: No Way Home, análisis y final explicado',
  seoDescription:
    'Análisis de Spider-Man: No Way Home (2021) con spoilers: los tres Spider-Man, los villanos del multiverso, la muerte de la tía May y el final que lleva a Brand New Day.',
  keywords: ['No Way Home análisis', 'Spider-Man No Way Home', 'No Way Home final explicado', 'tres Spider-Man', 'Tobey Maguire Andrew Garfield No Way Home', 'tía May No Way Home'],
  tags: ['análisis', 'películas', 'MCU', 'Tom Holland', 'multiverso', 'spoilers'],
  content: `
<blockquote><strong>Aviso: este análisis contiene spoilers de toda la película, incluido el final.</strong></blockquote>

<p>Cuando ${peli('spider-man-no-way-home-2021', 'Spider-Man: No Way Home')} llegó a los cines en diciembre de 2021, provocó una locura que pocas películas de superhéroes habían conseguido. El multiverso abría la puerta a los villanos y, sobre todo, a los Spider-Man del pasado. La gran pregunta era si la película sabría sostener tanto peso sin hundirse bajo las expectativas. La respuesta, años después, sigue siendo que sí.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estreno</strong></td><td>17 de diciembre de 2021</td></tr>
    <tr><td><strong>Director</strong></td><td>Jon Watts</td></tr>
    <tr><td><strong>Guion</strong></td><td>Chris McKenna y Erik Sommers</td></tr>
    <tr><td><strong>Reparto</strong></td><td>Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Marisa Tomei</td></tr>
    <tr><td><strong>Taquilla</strong></td><td>Más de 1.900 millones de dólares, la película más taquillera de 2021</td></tr>
    <tr><td><strong>Premios</strong></td><td>Nominada al Óscar a los mejores efectos visuales</td></tr>
  </tbody>
</table>

<h2>Un Peter Parker en su peor momento</h2>
${tmdbFigure('aLQNKHhDLDdr81axLV1lF1X6Px6', 'Tom Holland como Peter Parker entre cristales rotos', 'Peter Parker, con su vida hecha añicos tras la revelación de su identidad.')}
<p>La película empieza justo donde terminó ${peli('spider-man-lejos-de-casa-2019', 'Lejos de casa')}: Mysterio ha revelado al mundo que Spider-Man es Peter Parker, y J. Jonah Jameson se encarga de que nadie lo olvide. La vida de Peter, Ned y MJ se derrumba en pocos días, hasta el punto de que los tres son rechazados en el MIT por la polémica.</p>
<p>Desesperado, Peter le pide al Doctor Strange un hechizo para que el mundo olvide quién es Spider-Man. Pero lo interrumpe una y otra vez con excepciones («que MJ sí se acuerde», «y Ned», «y la tía May»…) y el hechizo se descontrola. Ese error, nacido de un egoísmo adolescente muy comprensible, es el motor de toda la historia, y lo que hace de esta la película más madura de la trilogía de Holland.</p>

<h2>Los villanos del multiverso</h2>
<p>El hechizo atrae a quienes, en otros universos, saben que Spider-Man es Peter Parker: el Duende Verde (Willem Dafoe), el Doctor Octopus (Alfred Molina), Electro (Jamie Foxx), el Hombre de Arena (Thomas Haden Church) y el Lagarto (Rhys Ifans). Strange quiere devolverlos a sus universos, donde muchos de ellos iban a morir luchando contra su Spider-Man. Peter se niega: quiere curarlos primero.</p>
<p>Esa decisión es la que da sentido a la película. Recupera a villanos de sagas muy distintas y les da algo que hacer, sobre todo a Dafoe, que vuelve a demostrar por qué su ${pj('green-goblin-norman-osborn', 'Duende Verde')} sigue siendo el mejor villano del cine de Spider-Man. Los tienes todos en <a href="/blog/villanos-spider-man-peliculas-ranking">nuestro ranking de villanos de las películas</a>.</p>

<h2>La muerte de la tía May</h2>
<p>El plan sale mal. El Duende Verde se impone a Norman Osborn, y en la pelea que sigue, la ${pj('aunt-may-parker', 'tía May')} muere en brazos de Peter. Antes, le deja la frase que en las otras sagas pronunció el tío Ben: «Un gran poder conlleva una gran responsabilidad».</p>
<p>Es el momento clave de la trilogía. El Peter de Holland nunca había tenido su «muerte del tío Ben»: hasta aquí, su mentor era Tony Stark y su traje lo ponía la tecnología. La muerte de May convierte por fin a este Peter en el Spider-Man de los cómics: alguien que hace lo correcto porque sabe lo que cuesta no hacerlo.</p>

<h2>Tres Spider-Man</h2>
${tmdbFigure('nqUThBjou0TAWXu93Q4SNFpgqai', 'Los tres Spider-Man en posición de combate de noche', 'Tres generaciones de Spider-Man, juntas en la batalla final.')}
<p>Entonces llegan Tobey Maguire y Andrew Garfield. Su regreso podía haber sido solo un guiño a los fans, pero el guion les da a ambos un arco propio. Maguire es el hermano mayor que ya ha pasado por todo y ayuda a Peter a no dejarse llevar por la venganza. Garfield es el que más tiene que curar: en la batalla final salva a MJ de una caída, como no pudo hacer con Gwen Stacy en ${peli('the-amazing-spider-man-2-el-poder-de-electro-2014', 'The Amazing Spider-Man 2')}, y en dos segundos de mirada cierra una herida de años.</p>
<p>La química entre los tres, con sus bromas sobre quién es «Peter 1», «Peter 2» y «Peter 3», es lo mejor de la película. Si quieres saber quién de ellos es el mejor Spider-Man, lo debatimos en <a href="/blog/tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man">Tobey Maguire vs. Andrew Garfield vs. Tom Holland</a>.</p>

<h2>El final: nadie recuerda a Peter Parker</h2>
${tmdbFigure('ocUp7DJBIc8VJgLEw1prcyK1dYv', 'Spider-Man y el Doctor Strange frente a un portal de fuego', 'El hechizo del Doctor Strange abre el multiverso… y solo puede cerrarse con un sacrificio.')}
<p>Con el multiverso rompiéndose, Peter toma la decisión más dura: le pide a Strange que haga que todo el mundo olvide que Peter Parker existió. Funciona. Ni MJ ni Ned le recuerdan, y aunque Peter va a buscarlos con la intención de explicárselo todo, al ver a MJ feliz decide no hacerlo.</p>
<p>La última escena es un Peter solo, en un piso pequeño, que se cose un traje nuevo y sale a balancearse por Nueva York como un Spider-Man de barrio. Es el punto de partida de <a href="/blog/spider-man-brand-new-day-final-explicado"><em>Spider-Man: Brand New Day</em></a> (2026), y de hecho el traje rojo y azul de ese final es la base del de la nueva película. Te lo contamos en <a href="/blog/trajes-spider-man-peliculas">todos los trajes de Spider-Man en las películas</a>.</p>

<h2>Curiosidades</h2>
<ul>
  <li>Charlie Cox aparece como Matt Murdock, el abogado de Peter: fue el regreso del ${pj('daredevil-matt-murdock', 'Daredevil')} de Netflix al MCU.</li>
  <li>La escena poscréditos muestra a Eddie Brock (Tom Hardy) en un bar, antes de que el hechizo le devuelva a su universo, dejando atrás un trocito del simbionte.</li>
  <li>El Doctor Octopus reconoce a Peter Parker… pero no a este: «Tú no eres Peter Parker».</li>
  <li>Antes del estreno, Andrew Garfield negó durante meses, entrevista tras entrevista, que fuera a aparecer en la película.</li>
</ul>

<h2>Veredicto</h2>
<p>No Way Home no es perfecta: el segundo acto se alarga, y algunos villanos, como el Lagarto o el Hombre de Arena, apenas tienen nada que hacer. Pero consigue algo extraordinario: ser a la vez una fiesta de nostalgia y una historia de crecimiento de verdad. El Peter Parker que sale al final no es el mismo que entró, y eso es exactamente lo que debe hacer una buena historia de origen, aunque sea la tercera vez que la contamos.</p>
<p><strong>Puntuación: 9/10.</strong> Si vas a verla, mejor después de las sagas de Maguire y Garfield: tienes el orden en <a href="/blog/orden-ver-peliculas-spider-man">en qué orden ver las películas de Spider-Man</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué Spider-Man aparecen en No Way Home?</h3>
<p>Los tres de imagen real: Tom Holland, Tobey Maguire y Andrew Garfield.</p>
<h3>¿Por qué nadie recuerda a Peter Parker al final?</h3>
<p>Para cerrar el multiverso, Peter le pide al Doctor Strange que todo el mundo olvide que Peter Parker existe, incluidos MJ y Ned.</p>
<h3>¿Hay que ver No Way Home antes de Brand New Day?</h3>
<p>Sí: Brand New Day continúa justo la situación en la que termina No Way Home.</p>
`,
};

const UN_NUEVO_UNIVERSO = {
  slug: 'spider-man-into-the-spider-verse-analisis-revolucion-animacion',
  title: 'Spider-Man: Un nuevo universo, análisis: la película que revolucionó la animación',
  subtitle: 'Miles Morales, el multiverso, un estilo visual nunca visto y un Óscar: por qué Into the Spider-Verse es una de las mejores películas de Spider-Man',
  excerpt:
    'Spider-Man: Un nuevo universo (2018) convirtió a Miles Morales en un icono y cambió el cine de animación. Analizamos su historia, sus Spider-Man, su técnica visual y su legado.',
  readTime: '10 min',
  seoTitle: 'Spider-Man: Un nuevo universo (Into the Spider-Verse), análisis',
  seoDescription:
    'Análisis de Spider-Man: Un nuevo universo (2018): Miles Morales, los Spider-Man del multiverso, su revolucionaria animación, el Óscar y su legado en el Spider-Verso.',
  keywords: ['Un nuevo universo análisis', 'Into the Spider-Verse', 'Spider-Man Un nuevo universo', 'Miles Morales película', 'Spider-Verso', 'animación Spider-Verse'],
  tags: ['análisis', 'películas', 'animación', 'Miles Morales', 'Spider-Verse', 'Óscar'],
  content: `
<p>${peli('spider-man-un-nuevo-universo-2018', 'Spider-Man: Un nuevo universo')} (<em>Into the Spider-Verse</em>, 2018) no debería haber funcionado. Era una película de animación protagonizada por un Spider-Man que el gran público apenas conocía, con un estilo visual experimental que nadie había probado a esa escala, y llegaba en un momento en el que ya había Spider-Man de sobra en los cines. Acabó ganando el Óscar a la mejor película de animación y cambió para siempre lo que esperamos de este tipo de cine.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estreno</strong></td><td>Diciembre de 2018</td></tr>
    <tr><td><strong>Dirección</strong></td><td>Bob Persichetti, Peter Ramsey y Rodney Rothman</td></tr>
    <tr><td><strong>Guion</strong></td><td>Phil Lord y Rodney Rothman</td></tr>
    <tr><td><strong>Voces originales</strong></td><td>Shameik Moore, Jake Johnson, Hailee Steinfeld, Mahershala Ali, Liev Schreiber</td></tr>
    <tr><td><strong>Premios</strong></td><td>Óscar y Globo de Oro a la mejor película de animación</td></tr>
  </tbody>
</table>

<h2>Miles Morales, por fin protagonista</h2>
${tmdbFigure('jtek5Qo97Lmcqze6vREnJEvX9Xw', 'Miles Morales y Gwen Stacy en el instituto', 'Miles conoce a Gwen en el instituto, sin saber todavía quién es ella en realidad.')}
<p>La gran apuesta de la película fue poner a ${pj('spider-man-miles-morales', 'Miles Morales')} en el centro. Miles es un adolescente de Brooklyn, hijo de un policía afroamericano y una enfermera puertorriqueña, que acaba de entrar en un internado de élite donde no termina de encajar y que prefiere pasar las tardes pintando grafitis con su tío Aaron. Su vida cambia cuando le pica una araña radiactiva… justo antes de ver morir al Spider-Man de su universo.</p>
<p>El resultado es una historia de origen distinta. No va de aprender que «un gran poder conlleva una gran responsabilidad», sino de algo más sencillo y más universal: de atreverse a dar el salto aunque tengas miedo. «Cualquiera puede llevar la máscara» no es un eslogan vacío, sino la tesis de toda la película.</p>

<h2>Un multiverso de Spider-Man</h2>
${tmdbFigure('1efgC3hpUIZYXVDu8cPPGYzXzjw', 'Miles y Gwen frente a Kingpin y el Merodeador', 'Miles y Gwen frente a Kingpin y el Merodeador, los villanos de la película.')}
<p>Kingpin ha construido un colisionador de partículas para traer de otros universos a su mujer y a su hijo, muertos en un accidente del que se culpa. El experimento abre el multiverso y trae al Brooklyn de Miles a otros héroes arácnidos: un Peter B. Parker de mediana edad, desastrado y deprimido; ${pj('spider-gwen-gwen-stacy', 'Gwen Stacy')}, la Spider-Woman de otro mundo; ${pj('spider-man-noir-peter-parker', 'Spider-Man Noir')}, en blanco y negro; ${pj('sp-dr-peni-parker', 'Peni Parker')} y su robot; y ${pj('spider-ham-peter-porker', 'Spider-Ham')}, un cerdo de dibujos animados.</p>
<p>Cada uno tiene su propio estilo de animación, y aun así todos encajan en la misma escena. La relación entre Miles y Peter B. Parker, un mentor que no quiere serlo, es el corazón emocional de la película.</p>

<h2>El salto de fe</h2>
${tmdbFigure('e7CE5vx4KqUuz0peKdHRVZB0Pn8', 'Miles Morales cayendo entre rascacielos', 'El salto de fe: Miles se lanza al vacío entre los rascacielos de Nueva York y, por fin, se convierte en Spider-Man.')}
<p>La escena más recordada llega cuando Miles, solo y sin que nadie le dé permiso, se pone su propio traje y salta desde lo alto de un rascacielos. La cámara gira, la ciudad queda boca abajo y suena «What's Up Danger». Es uno de los grandes momentos del cine de superhéroes, y resume la película entera en un minuto.</p>

<h2>Una revolución técnica</h2>
<p>El estilo visual de <em>Un nuevo universo</em> es inconfundible. Mezcla animación por ordenador con técnicas del cómic impreso: tramas de puntos, líneas de dibujo, onomatopeyas y cuadros de texto en pantalla, y un desenfoque que imita los colores desplazados de una mala impresión. Muchos personajes se animan «a dos», es decir, a 12 imágenes por segundo en vez de 24, lo que da a la película su ritmo de cómic en movimiento. Hay detalles muy cuidados: al principio Miles se anima con menos imágenes por segundo, como si no terminara de encajar, y su animación se vuelve más fluida a medida que domina sus poderes.</p>
<p>El resultado fue tan influyente que, desde entonces, muchas películas de animación han buscado su propia identidad visual en lugar de imitar el estilo de Pixar.</p>

<h2>Curiosidades</h2>
<ul>
  <li>Stan Lee tiene un cameo como el dependiente de una tienda de disfraces. La película se estrenó poco después de su muerte, en noviembre de 2018, y está dedicada a él y a Steve Ditko.</li>
  <li>La Doctor Octopus de la película es una mujer, Olivia Octavius, con la voz original de Kathryn Hahn.</li>
  <li>«Sunflower», de Post Malone y Swae Lee, se convirtió en un éxito mundial gracias a la película.</li>
  <li>En los créditos hay una escena con Spider-Man 2099, que prepara la secuela.</li>
</ul>

<h2>El legado</h2>
<p><em>Un nuevo universo</em> abrió el Spider-Verso: le siguió ${peli('spider-man-cruzando-el-multiverso-2023', 'Spider-Man: Cruzando el Multiverso')} (2023), tan brillante como la primera, y llegará <a href="/blog/beyond-spider-verse-actualizacion-2025">Beyond the Spider-Verse</a> para cerrar la trilogía. Además, convirtió a Miles Morales en un Spider-Man tan reconocible como Peter Parker para toda una generación. Si te interesa la comparación entre los dos, la tienes en <a href="/blog/peter-parker-vs-miles-morales-analisis">Peter Parker vs. Miles Morales</a>.</p>

<h2>Veredicto</h2>
<p>Si solo vas a ver una película de Spider-Man en tu vida, que sea esta. Es divertida, emocionante, visualmente única y entiende al personaje mejor que casi cualquier otra adaptación.</p>
<p><strong>Puntuación: 10/10.</strong> Puedes verla en cualquier momento: no depende de ninguna otra saga, como te contamos en <a href="/blog/orden-ver-peliculas-spider-man">el orden de las películas de Spider-Man</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Into the Spider-Verse y Un nuevo universo son la misma película?</h3>
<p>Sí: <em>Spider-Man: Un nuevo universo</em> es el título en España de <em>Spider-Man: Into the Spider-Verse</em> (2018).</p>
<h3>¿Qué Spider-Man aparecen?</h3>
<p>Miles Morales, Peter B. Parker, Gwen Stacy, Spider-Man Noir, Peni Parker y Spider-Ham, además del Peter Parker del universo de Miles.</p>
<h3>¿Ganó el Óscar?</h3>
<p>Sí, el Óscar a la mejor película de animación en 2019.</p>
`,
};

const CRUZANDO_EL_MULTIVERSO = {
  slug: 'across-the-spider-verse-analisis',
  title: 'Spider-Man: Cruzando el Multiverso, análisis: la secuela que supera a la original',
  subtitle: 'Gwen, Miguel O\'Hara, la Sociedad Araña, la Mancha y el «canon»: por qué Across the Spider-Verse eleva aún más el listón (con spoilers)',
  excerpt:
    'Spider-Man: Cruzando el Multiverso (2023) lleva a Miles al corazón del multiverso y le enfrenta al propio concepto de canon. Analizamos su historia, su animación, sus personajes y su final.',
  readTime: '10 min',
  seoTitle: 'Spider-Man: Cruzando el Multiverso, análisis y final',
  seoDescription:
    'Análisis de Spider-Man: Cruzando el Multiverso (2023): Gwen, Miguel O\'Hara y la Sociedad Araña, el «canon», la Mancha, su animación y el final que lleva a Beyond the Spider-Verse.',
  keywords: ['Cruzando el Multiverso análisis', 'Across the Spider-Verse', 'Spider-Man Cruzando el Multiverso', 'Sociedad Araña', 'Miguel O\'Hara', 'final Across the Spider-Verse'],
  tags: ['análisis', 'películas', 'animación', 'Miles Morales', 'Spider-Verse', 'spoilers'],
  content: `
<blockquote><strong>Aviso: este análisis contiene spoilers, incluido el final de la película.</strong></blockquote>

<p>${peli('spider-man-cruzando-el-multiverso-2023', 'Spider-Man: Cruzando el Multiverso')} (<em>Across the Spider-Verse</em>, 2023) tenía la misión imposible de superar a ${peli('spider-man-un-nuevo-universo-2018', 'Un nuevo universo')}, una de las mejores películas de animación del siglo. No solo lo consigue: sube tanto el listón que resulta difícil imaginar cómo podrá igualarlo <a href="/blog/beyond-spider-verse-actualizacion-2025">Beyond the Spider-Verse</a>.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estreno</strong></td><td>Junio de 2023</td></tr>
    <tr><td><strong>Dirección</strong></td><td>Joaquim Dos Santos, Kemp Powers y Justin K. Thompson</td></tr>
    <tr><td><strong>Guion</strong></td><td>Phil Lord, Christopher Miller y David Callaham</td></tr>
    <tr><td><strong>Voces originales</strong></td><td>Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jason Schwartzman, Daniel Kaluuya</td></tr>
    <tr><td><strong>Premios</strong></td><td>Nominada al Óscar a la mejor película de animación</td></tr>
  </tbody>
</table>

<h2>Gwen, protagonista a la altura de Miles</h2>
${tmdbFigure('rDcB8RqsAQuKGRajkPFbYLZZWMj', 'Gwen Stacy bajo la lluvia en una azotea', 'Gwen Stacy en su universo: la película empieza con ella, y con un mundo cuyos colores cambian con sus emociones.')}
<p>La película arranca con ${pj('spider-gwen-gwen-stacy', 'Gwen Stacy')}, y es casi tan suya como de Miles. En su universo, su padre, el capitán George Stacy, la persigue convencido de que Spider-Woman mató a Peter Parker. Su mundo parece una acuarela cuyos colores cambian con lo que siente, y su relación con su padre es una de las partes más emotivas de toda la saga.</p>

<h2>Un universo para cada Spider-Man</h2>
${tmdbFigure('pfxTNwujdWV9BRdIZmuCV17BKWv', 'Gwen, Peter B. Parker con su hija y otros héroes arácnidos en una azotea', 'Gwen, Peter B. Parker con su hija Mayday y otros héroes arácnidos de la Sociedad Araña.')}
<p>Cada dimensión tiene su propio lenguaje visual. Mumbattan, el mundo de ${pj('spider-man-india-pavitr-prabhakar', 'Spider-Man India')}, es un estallido de color; el de Spider-Punk parece un fanzine recortado; el de Gwen, una acuarela. La película mezcla todos esos estilos, a veces en el mismo plano, y aun así nunca resulta confusa. Es, sin exagerar, una de las películas de animación más ambiciosas jamás hechas.</p>
<p>El reparto arácnido crece: ${pj('spider-man-2099-miguel-ohara', 'Miguel O\'Hara')} (Spider-Man 2099), ${pj('spider-punk-hobie-brown', 'Spider-Punk')}, una ${pj('spider-woman-jessica-drew', 'Jessica Drew')} en moto, ${pj('ben-reilly-scarlet-spider', 'Ben Reilly')} como Scarlet Spider, y cientos de variantes más en la sede de la Sociedad Araña.</p>

<h2>La Mancha</h2>
<p>El villano empieza como un chiste: un científico lleno de agujeros que abre portales y al que nadie toma en serio. Pero la Mancha crece a lo largo de la película hasta convertirse en una amenaza para todo el multiverso. Su resentimiento hacia Miles, al que culpa de su transformación, le da un giro muy interesante: es un villano que el propio Miles creó sin saberlo.</p>

<h2>Miles contra el «canon»</h2>
<p>El verdadero conflicto no es un villano, sino una idea. Miguel O'Hara lidera la Sociedad Araña y defiende que hay «eventos canónicos» que todos los Spider-Man deben vivir para que sus universos no se derrumben, como la muerte de un capitán de policía cercano a ellos. Cuando Miles descubre que en su caso ese capitán va a ser su padre, Jefferson Davis, se niega a aceptarlo, y toda la Sociedad Araña se lanza a por él.</p>
<p>El dilema funciona porque no tiene una respuesta fácil: Miguel ha visto colapsar un universo, y Miles no está dispuesto a perder a su padre. La persecución por la sede de la Sociedad es una de las secuencias de acción más espectaculares de la saga.</p>

<h2>El final</h2>
${tmdbFigure('v35mDDVGNCXTscKeggbPdvoQU2i', 'Gwen y Miles balanceándose juntos', 'Gwen y Miles: la película termina con los dos separados, y Gwen reuniendo un equipo para ir a buscarle.')}
<p>Miles intenta volver a casa, pero el portal le lleva a la Tierra-42: el universo del que venía la araña que le picó. En ese mundo no hay Spider-Man, su padre está muerto y su versión alternativa es el Merodeador, con su tío Aaron todavía vivo. Mientras, Gwen reúne a su propio equipo de héroes arácnidos para ir a rescatarle. Y ahí, con un «continuará», termina la película.</p>

<h2>Veredicto</h2>
<p>Cruzando el Multiverso es cine de animación de primer nivel, con personajes complejos, un dilema moral de verdad y una dirección artística que se estudiará durante años. Su único «pero» es que es la primera mitad de una historia: el final abierto duele, aunque confirma que la saga no tiene miedo de apostar alto.</p>
<p><strong>Puntuación: 10/10.</strong> Antes de verla, mejor ver <a href="/blog/spider-man-into-the-spider-verse-analisis-revolucion-animacion">Un nuevo universo</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cruzando el Multiverso tiene final?</h3>
<p>No: termina con un «continuará» que se resolverá en Beyond the Spider-Verse.</p>
<h3>¿Qué es un evento canónico?</h3>
<p>Según Miguel O'Hara, un momento que todos los Spider-Man deben vivir, como la muerte de un capitán de policía cercano a ellos. Si se evita, el universo puede colapsar.</p>
<h3>¿Quién es el Merodeador de la Tierra-42?</h3>
<p>Una versión alternativa de Miles Morales en el universo del que venía la araña que le picó.</p>
`,
};

const SPIDER_MAN_2 = {
  slug: 'spider-man-2-2004-analisis-mejor-pelicula-superheroes',
  title: 'Spider-Man 2 (2004), análisis: ¿la mejor película de superhéroes jamás hecha?',
  subtitle: 'La crisis de Peter Parker, el Doctor Octopus de Alfred Molina, la escena del tren y un Óscar: por qué la secuela de Sam Raimi sigue siendo insuperable',
  excerpt:
    'Veinte años después, Spider-Man 2 sigue siendo para muchos la mejor película de superhéroes. Analizamos su historia, su villano, sus escenas clave y su legado.',
  readTime: '10 min',
  seoTitle: 'Spider-Man 2 (2004): análisis de la película de Sam Raimi',
  seoDescription:
    'Análisis de Spider-Man 2 (2004) de Sam Raimi: la crisis de Peter Parker, el Doctor Octopus de Alfred Molina, la escena del tren, el Óscar y por qué sigue siendo la mejor.',
  keywords: ['Spider-Man 2 análisis', 'Spider-Man 2 2004', 'Sam Raimi', 'Doctor Octopus Alfred Molina', 'escena del tren Spider-Man 2', 'mejor película de superhéroes'],
  tags: ['análisis', 'películas', 'Sam Raimi', 'Tobey Maguire', 'Doctor Octopus', 'clásico'],
  content: `
<p>En 2004, Sam Raimi hizo algo que muy pocos directores consiguen: una secuela mejor que la original. ${peli('spider-man-2-2004', 'Spider-Man 2')} no es solo una buena película de superhéroes; para muchos críticos y fans es la mejor que se ha hecho. Dos décadas después, con el MCU, el Spider-Verso y el multiverso de por medio, sigue siendo la referencia.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estreno</strong></td><td>2004</td></tr>
    <tr><td><strong>Director</strong></td><td>Sam Raimi</td></tr>
    <tr><td><strong>Guion</strong></td><td>Alvin Sargent, a partir de una historia de Alfred Gough, Miles Millar y Michael Chabon</td></tr>
    <tr><td><strong>Reparto</strong></td><td>Tobey Maguire, Kirsten Dunst, Alfred Molina, James Franco, Rosemary Harris</td></tr>
    <tr><td><strong>Música</strong></td><td>Danny Elfman</td></tr>
    <tr><td><strong>Premios</strong></td><td>Óscar a los mejores efectos visuales; nominada en las dos categorías de sonido</td></tr>
  </tbody>
</table>

<h2>Peter Parker quiere dejarlo</h2>
${tmdbFigure('lOcQZjhU99PMykoIStbmZLUVj9D', 'Peter Parker con el traje de Spider-Man y sin máscara, de noche', 'Peter Parker, agotado: en Spider-Man 2, ser Spider-Man le está costando la vida que quiere tener.')}
<p>La genialidad de la película está en su punto de partida: Peter Parker quiere dejar de ser Spider-Man. No por cobardía, sino porque el precio es insoportable. Pierde trabajos, suspende en la universidad, no puede pagar el alquiler y ve cómo Mary Jane se aleja de él. El traje no le da poder: le quita la vida.</p>
<p>Su crisis llega a afectar a sus poderes, que empiezan a fallarle, hasta que decide tirar el traje a la basura. Es un homenaje directo a <em>The Amazing Spider-Man</em> #50 (1967), «Spider-Man No More!», y una de las imágenes más icónicas de la película. Esa idea, que ser héroe tiene un coste real, es lo que la eleva por encima de casi todas las películas del género.</p>

<h2>El Doctor Octopus de Alfred Molina</h2>
${tmdbFigure('faV0HuR6WnQoLrVq3r6mhjaABL9', 'Spider-Man y el Doctor Octopus luchando sobre el techo de un tren', 'La pelea en el tren entre Spider-Man y el Doctor Octopus, una de las mejores escenas de acción del cine de superhéroes.')}
<p>Otto Octavius no quiere dominar el mundo. Es un científico brillante y bondadoso, mentor de Peter, que pierde a su mujer y el control de sí mismo en el accidente de su experimento de fusión. Los brazos mecánicos, que se comunican con su cerebro, acaban dominándole. Su historia es un reflejo de la de Peter: dos hombres aplastados por las consecuencias de sus decisiones.</p>
<p>Alfred Molina hace un villano humano y trágico, y es tan bueno que volvió al papel diecisiete años después en ${peli('spider-man-no-way-home-2021', 'No Way Home')}. Lo tienes en lo más alto de <a href="/blog/villanos-spider-man-peliculas-ranking">nuestro ranking de villanos del cine</a>.</p>

<h2>La escena del tren</h2>
<p>La pelea sobre el tren elevado es el gran momento de la película y uno de los mejores momentos de acción del cine de superhéroes. Pero lo que la hace grande es lo que viene después: Peter, sin máscara y agotado tras frenar el tren con sus telarañas, cae inconsciente, y los pasajeros que acaba de salvar le sostienen y le protegen. Le devuelven la máscara y prometen no contar a nadie quién es. La ciudad cuida de su héroe.</p>

<h2>Mary Jane y la tía May</h2>
${tmdbFigure('6al048Lat3eLVQOuKtc9h6Tu94d', 'Spider-Man y Mary Jane en el póster de Spider-Man 2', 'Spider-Man y Mary Jane en el póster de Spider-Man 2 (2004). Además de su historia de amor, la película tiene en el Doctor Octopus de Alfred Molina a un villano construido desde la tragedia.')}
<p>La historia de amor con ${pj('mary-jane-watson', 'Mary Jane')} es el otro gran pilar: ella está a punto de casarse con otro, y Peter tiene que decidir si le cuenta la verdad. Y la ${pj('aunt-may-parker', 'tía May')} de Rosemary Harris protagoniza uno de los discursos más bonitos de la saga, sobre por qué la gente necesita héroes, justo cuando Peter más necesita oírlo.</p>

<h2>El legado</h2>
<p>Spider-Man 2 ganó el Óscar a los mejores efectos visuales, y el crítico Roger Ebert le dio la máxima nota. Su influencia se nota en casi todas las películas de superhéroes posteriores que han intentado equilibrar espectáculo y drama personal. Si quieres enseñarle a alguien lo que puede llegar a ser una película de superhéroes, le pones esta.</p>
<p><strong>Puntuación: 10/10.</strong> Si te preguntas quién es el mejor Spider-Man del cine, te lo contamos en <a href="/blog/tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man">Tobey Maguire vs. Andrew Garfield vs. Tom Holland</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Por qué Spider-Man 2 se considera la mejor película de Spider-Man?</h3>
<p>Por su equilibrio entre acción y drama: una historia muy humana sobre el precio de ser héroe, con un villano trágico y escenas memorables como la del tren.</p>
<h3>¿Qué Óscar ganó Spider-Man 2?</h3>
<p>El Óscar a los mejores efectos visuales.</p>
<h3>¿Hay que ver la primera antes?</h3>
<p>Sí, conviene: es la continuación directa de Spider-Man (2002).</p>
`,
};

const MILES_MORALES_JUEGO = {
  slug: 'spider-man-miles-morales-ps5-analisis',
  title: 'Marvel\'s Spider-Man: Miles Morales, análisis: el juego que convirtió a Miles en icono',
  subtitle: 'Navidad en Harlem, poderes bioeléctricos, el Tinkerer y una historia familiar: por qué la aventura de Miles es breve pero redonda',
  excerpt:
    'Marvel\'s Spider-Man: Miles Morales llegó con la PS5 y demostró que Miles podía sostener su propio juego. Analizamos su historia, sus poderes, sus villanos y qué versión jugar.',
  readTime: '9 min',
  seoTitle: 'Marvel\'s Spider-Man: Miles Morales: análisis del juego',
  seoDescription:
    'Análisis de Marvel\'s Spider-Man: Miles Morales: la historia en Harlem, los poderes bioeléctricos y el camuflaje, el Tinkerer y Roxxon, la duración y qué versión jugar.',
  keywords: ['Miles Morales juego análisis', 'Spider-Man Miles Morales PS5', 'Marvel\'s Spider-Man Miles Morales', 'Miles Morales PS4', 'Miles Morales PC', 'Insomniac Games'],
  tags: ['análisis', 'videojuegos', 'Insomniac', 'PS5', 'PS4', 'Miles Morales'],
  content: `
<p>Cuando Sony anunció ${juego('marvel-s-spider-man-miles-morales-2020', 'Marvel\'s Spider-Man: Miles Morales')} como juego de lanzamiento de PS5, muchos pensaron que sería poco más que una expansión del juego de 2018. Insomniac respondió con una de las aventuras más emotivas de la generación: más corta que la de Peter, sí, pero redonda. En julio de 2021 ya superaba los 6,5 millones de copias vendidas.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estudio</strong></td><td>Insomniac Games</td></tr>
    <tr><td><strong>Lanzamiento</strong></td><td>Noviembre de 2020 (PS4 y PS5); noviembre de 2022 (PC)</td></tr>
    <tr><td><strong>Duración</strong></td><td>Unas 8-10 horas la historia; unas 20 si lo completas</td></tr>
    <tr><td><strong>Villanos</strong></td><td>El Tinkerer, Roxxon y el Merodeador</td></tr>
    <tr><td><strong>Voz original de Miles</strong></td><td>Nadji Jeter</td></tr>
  </tbody>
</table>

<h2>Una historia de Navidad en Harlem</h2>
${figure('237/2372aa24a528d592d0bdb6d1fa0d1253', 'Miles Morales con su traje bajo la nieve, entre luces de neón', 'Miles en el Harlem nevado: el juego transcurre en Navidad, la época de la familia y de quienes ya no están.')}
<p>El juego transcurre en Navidad, un año después de <a href="/blog/marvels-spider-man-ps4-2018-analisis-insomniac">Marvel's Spider-Man</a>. Miles se ha mudado a Harlem con su madre, Rio, tras la muerte de su padre, y Peter se marcha unas semanas de viaje, dejándole como único Spider-Man de Nueva York. La elección no es casual: la Navidad es tiempo de familia, de comunidad y de las personas que ya no están, y de eso va la historia.</p>
<p>El conflicto enfrenta a la corporación Roxxon, que ha construido un reactor de energía en pleno barrio, con el Tinkerer y su banda, los Underground. Detrás de la máscara del Tinkerer está Phin Mason, la mejor amiga de la infancia de Miles, y eso convierte la pelea en algo muy personal. El tío Aaron, el ${pj('prowler-aaron-davis', 'Merodeador')}, completa un reparto que pone a Miles entre su ciudad, su barrio y su familia.</p>

<h2>Los poderes de Miles</h2>
${figure('e20/e2007d863194a66053c79d325401950f', 'Miles Morales golpeando a un enemigo con su descarga bioeléctrica', 'Las descargas bioeléctricas «venom» son el gran añadido de Miles al combate.')}
<p>Jugar con Miles se siente distinto a jugar con Peter. Sus descargas bioeléctricas, los ataques «venom», aturden a los enemigos, rompen escudos y permiten combos espectaculares; los más potentes parecen sacados de una cinemática. El camuflaje, que le vuelve invisible unos segundos, añade una capa de sigilo que el juego original no tenía y cambia por completo la forma de afrontar las bases enemigas.</p>
${figure('6bb/6bb1d64822a95680a815b7a2a47e4299', 'Miles Morales invisible, saltando entre carteles de neón', 'El camuflaje vuelve a Miles invisible durante unos segundos: perfecto para el sigilo.')}
<p>El resto del juego conserva todo lo bueno del de 2018: el balanceo, una Nueva York ahora nevada y misiones secundarias que esta vez llegan a través de una aplicación de su amigo Ganke, en la que los vecinos piden ayuda a Spider-Man.</p>

<h2>Nadji Jeter y un Miles creíble</h2>
<p>En un juego tan centrado en su historia, la interpretación importa tanto como la jugabilidad. Nadji Jeter lleva a Miles de la inseguridad del primer acto a la determinación del final con una naturalidad enorme. Es el mismo personaje al que Shameik Moore pone voz en las películas del Spider-Verso, y las dos versiones están a la misma altura. Si te interesan las diferencias entre los dos Spider-Man, tienes <a href="/blog/peter-parker-vs-miles-morales-analisis">Peter Parker vs. Miles Morales</a>.</p>

<h2>¿Qué versión jugar?</h2>
<ul>
  <li><strong>PS5:</strong> la mejor opción, con tiempos de carga casi instantáneos y vibración de los mandos DualSense.</li>
  <li><strong>PS4:</strong> el juego funciona bien, aunque con menos detalle gráfico.</li>
  <li><strong>PC:</strong> llegó en noviembre de 2022, con buen rendimiento.</li>
</ul>

<h2>Veredicto</h2>
<p><strong>Lo mejor:</strong> la historia de Miles y su familia, sus poderes y el Harlem navideño.<br />
<strong>Lo peor:</strong> es corto, y su estructura de mundo abierto repite la del juego anterior.</p>
<p><strong>Puntuación: 9/10.</strong> Una aventura breve y redonda, y el puente perfecto hacia <a href="/blog/marvels-spider-man-2-ps5-analisis">Marvel's Spider-Man 2</a>. En nuestro <a href="/blog/mejores-juegos-spider-man-ranking">ranking de los mejores juegos de Spider-Man</a> ocupa el tercer puesto.</p>
`,
};

const AMAZING_2012 = {
  slug: 'the-amazing-spider-man-2012-revaloracion-andrew-garfield',
  title: 'The Amazing Spider-Man (2012), análisis: el reinicio que merecía más oportunidades',
  subtitle: 'Andrew Garfield, Emma Stone, el Lagarto y el misterio de los padres de Peter: revisamos la película que llegó con el viento en contra',
  excerpt:
    'The Amazing Spider-Man (2012) llegó solo cinco años después de la trilogía de Raimi y nunca tuvo el reconocimiento que merecía. La revisamos: lo que funcionó, lo que no y por qué No Way Home le hizo justicia.',
  readTime: '9 min',
  seoTitle: 'The Amazing Spider-Man (2012): análisis de la película',
  seoDescription:
    'Análisis de The Amazing Spider-Man (2012) con Andrew Garfield: Peter y Gwen, el Lagarto, el misterio de los padres de Peter, qué falló y por qué merece una segunda oportunidad.',
  keywords: ['The Amazing Spider-Man análisis', 'The Amazing Spider-Man 2012', 'Andrew Garfield Spider-Man', 'Emma Stone Gwen Stacy', 'Lagarto The Amazing Spider-Man', 'Marc Webb'],
  tags: ['análisis', 'películas', 'Andrew Garfield', 'Gwen Stacy', 'Marc Webb', 'Sony'],
  content: `
<p>En 2012, Sony reinició Spider-Man solo cinco años después del final de la trilogía de Sam Raimi. El público lo recibió con escepticismo: ¿otro origen?, ¿otra vez la picadura y el tío Ben? ${peli('the-amazing-spider-man-2012', 'The Amazing Spider-Man')} llegó con el viento en contra, y eso marcó su recepción para siempre. Con la perspectiva de los años, y del regreso de Andrew Garfield en <em>No Way Home</em>, es hora de juzgarla con más justicia.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Estreno</strong></td><td>Julio de 2012</td></tr>
    <tr><td><strong>Director</strong></td><td>Marc Webb</td></tr>
    <tr><td><strong>Reparto</strong></td><td>Andrew Garfield, Emma Stone, Rhys Ifans, Denis Leary, Martin Sheen, Sally Field</td></tr>
    <tr><td><strong>Música</strong></td><td>James Horner</td></tr>
    <tr><td><strong>Taquilla</strong></td><td>Unos 758 millones de dólares en todo el mundo</td></tr>
  </tbody>
</table>

<h2>Un Peter Parker diferente</h2>
${tmdbFigure('qMEGcVL4MnJeLpoRP54XYEq6QXa', 'Peter Parker colgado de una cadena en un almacén abandonado', 'Peter descubre sus poderes a base de prueba y error en un almacén abandonado.')}
<p>El Peter de Garfield es más solitario, más rebelde y más listo: va en monopatín, se enfrenta a los abusones y, como en los cómics, fabrica sus propios lanzarredes. La película le da un misterio propio, el de sus padres, Richard y Mary Parker, que le abandonaron de niño y cuyo trabajo en Oscorp está detrás de todo. Pero donde de verdad brilla Garfield es con la máscara: su Spider-Man bromea, provoca y se mueve como una araña, muy en la línea de las viñetas.</p>

<h2>Peter y Gwen</h2>
${tmdbFigure('wybMT6AvBIgGlHLRh4tn9NjNqiN', 'Gwen Stacy cuidando de Peter Parker herido', 'Gwen cura las heridas de Peter: la química entre Emma Stone y Andrew Garfield es lo mejor de la película.')}
<p>La química entre Garfield y Emma Stone, que eran pareja también fuera de la pantalla, es el gran acierto de la película. Su ${pj('spider-gwen-gwen-stacy', 'Gwen Stacy')} no es una damisela en apuros: es la mejor alumna de su clase, trabaja en Oscorp y ayuda activamente a Peter a vencer al villano. Su relación se siente natural, divertida y real, algo poco habitual en el cine de superhéroes.</p>

<h2>El capitán Stacy</h2>
${tmdbFigure('rZHSdi4YoqicFRll7QVxfrKUo1o', 'Denis Leary como el capitán George Stacy', 'Denis Leary como el capitán George Stacy, el padre de Gwen.')}
<p>Denis Leary interpreta al padre de Gwen, el capitán George Stacy, un policía que persigue a Spider-Man por considerarle un justiciero peligroso. Su relación con Peter, que cena en su casa sin que él sepa quién es, da algunas de las mejores escenas de la película, y su promesa final marcará la secuela.</p>

<h2>Lo que no funcionó: el Lagarto</h2>
${tmdbFigure('o2eWnUL9cPARxgNXFrfnvnPwR84', 'El Lagarto agarrando a Spider-Man', 'El Lagarto contra Spider-Man: un villano funcional, pero no memorable.')}
<p>El primer acto es muy bueno, pero el tercero flojea cuando el doctor Curt Connors se convierte en el ${pj('lizard-curtis-connors', 'Lagarto')} y la historia se convierte en una película de monstruos convencional. Rhys Ifans es un gran actor, pero el Lagarto digital no tiene la presencia que merecía, y su plan de convertir a todo Nueva York en reptiles es de lo más flojo de la película. Además, el misterio de los padres de Peter se queda a medias, a la espera de unas secuelas que no llegaron.</p>

<h2>No Way Home le hizo justicia</h2>
<p>Tras ${peli('the-amazing-spider-man-2-el-poder-de-electro-2014', 'The Amazing Spider-Man 2')} (2014), Sony canceló la tercera parte y llegó a un acuerdo con Marvel Studios para llevar a Spider-Man al MCU. Durante años, la etapa de Garfield quedó como un paréntesis. Pero su regreso en <a href="/blog/spider-man-no-way-home-analisis">No Way Home</a> provocó una ola de simpatía: millones de personas la volvieron a ver con otros ojos, y muchas llegaron a la misma conclusión. Merecía más. Si quieres comparar a los tres Spider-Man, lo hacemos en <a href="/blog/tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man">Tobey Maguire vs. Andrew Garfield vs. Tom Holland</a>.</p>

<h2>Veredicto</h2>
<p><strong>Lo mejor:</strong> Andrew Garfield como Spider-Man, Peter y Gwen, y el capitán Stacy.<br />
<strong>Lo peor:</strong> un villano olvidable, un tercer acto convencional y un misterio que se queda a medias.</p>
<p><strong>Puntuación: 7/10.</strong> Injustamente castigada en su momento: con un villano mejor, podría haber sido extraordinaria.</p>
`,
};

const ULTIMA_CACERIA = {
  slug: 'kravens-last-hunt-analisis-mejor-arco-spider-man',
  title: 'La última cacería de Kraven: análisis de la historia más oscura de Spider-Man',
  subtitle: 'Kraven entierra a Spider-Man y ocupa su lugar: por qué el clásico de DeMatteis y Zeck (1987) sigue siendo uno de los mejores cómics del personaje',
  excerpt:
    'En 1987, J. M. DeMatteis y Mike Zeck publicaron Kraven\'s Last Hunt, la historia en la que Kraven derrota a Spider-Man, lo entierra y se pone su traje. Te contamos por qué es imprescindible y cómo leerla.',
  readTime: '9 min',
  seoTitle: 'La última cacería de Kraven (Kraven\'s Last Hunt): análisis',
  seoDescription:
    'Análisis de Kraven\'s Last Hunt (1987), de DeMatteis y Zeck: Kraven entierra a Spider-Man y ocupa su lugar. Qué números la forman, por qué es tan buena y cómo leerla.',
  keywords: ['La última cacería de Kraven', 'Kraven\'s Last Hunt', 'Kraven el Cazador cómic', 'DeMatteis Zeck', 'mejores cómics de Spider-Man', 'Spider-Man enterrado'],
  tags: ['análisis', 'cómics', 'Kraven', 'clásico', 'años 80', 'DeMatteis'],
  content: `
<p>En 1987, J. M. DeMatteis y Mike Zeck publicaron una historia en seis partes que cambió lo que podía ser un cómic de Spider-Man. <em>Kraven's Last Hunt</em>, publicada en España como <em>La última cacería de Kraven</em>, no es una aventura de acción: es un estudio psicológico sobre la obsesión, la identidad y la muerte, protagonizado por un villano que se había quedado anticuado y que aquí se convierte en leyenda.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Guion</strong></td><td>J. M. DeMatteis</td></tr>
    <tr><td><strong>Dibujo</strong></td><td>Mike Zeck, con tintas de Bob McLeod</td></tr>
    <tr><td><strong>Publicación</strong></td><td>Octubre y noviembre de 1987</td></tr>
    <tr><td><strong>Números</strong></td><td>Web of Spider-Man #31-32, The Amazing Spider-Man #293-294 y The Spectacular Spider-Man #131-132</td></tr>
    <tr><td><strong>Protagonistas</strong></td><td>Spider-Man, ${pj('kraven-the-hunter-sergei-kravinoff', 'Kraven el Cazador')}, Mary Jane y la Alimaña</td></tr>
  </tbody>
</table>

<h2>La premisa</h2>
${cvFigure('scale_medium/6/67663/7042766-5877939700-79143.jpg', 'Portada de la edición de lujo de Kraven\'s Last Hunt con Kraven armado y Spider-Man detrás', 'Kraven, rifle en mano, con Spider-Man y su traje negro a su espalda, en la portada de la edición de lujo.')}
<p>Kraven lleva años intentando cazar a Spider-Man sin conseguirlo, y siente que su vida y su honor se han quedado vacíos. Decide terminar de una vez: le dispara, lo da por muerto y lo entierra. Después se pone su traje y patrulla Nueva York como Spider-Man para demostrar que puede ser mejor que él.</p>
<p>La historia ocurre justo después de la boda de Peter y Mary Jane, y una parte importante sigue a MJ, que espera durante días sin saber si su marido está vivo. Mientras, el «nuevo» Spider-Man persigue a la Alimaña (Vermin), un villano con aspecto de rata, con una brutalidad que el auténtico nunca se permitiría.</p>

<h2>Por qué es tan buena</h2>
<p>DeMatteis escribe con una prosa inusualmente literaria para un cómic de superhéroes de los 80. La historia está atravesada por los versos de «El tigre», el poema de William Blake, y se adentra en la mente de Kraven con secuencias casi oníricas. Por primera vez, el villano no es solo un rival: es un hombre roto, que busca en esta última cacería algo que dé sentido a su vida.</p>
${cvFigure('scale_medium/6/67663/3669085-01.jpg', 'Portada de Kraven\'s Last Hunt con Spider-Man saliendo de su tumba', 'La portada del recopilatorio de Kraven\'s Last Hunt: Spider-Man, con el traje negro, sale de la tumba en la que lo enterró Kraven. Una de las imágenes más icónicas del cómic de superhéroes.')}
<p>Zeck dibuja algunas de las páginas más impactantes de la historia del personaje: Spider-Man saliendo de su tumba entre el barro, bajo la lluvia, es una imagen que se ha homenajeado mil veces. Y el final, que no vamos a desvelar, es devastador precisamente porque la historia se ha tomado el tiempo de hacerte entender a Kraven.</p>

<h2>Su legado</h2>
<p>La historia consolidó a Kraven como uno de los grandes villanos de Spider-Man y cerró su historia durante más de veinte años, hasta <em>Grim Hunt</em> (2010). Su sombra se nota en muchas versiones posteriores del personaje, como el Kraven de <a href="/blog/marvels-spider-man-2-ps5-analisis">Marvel's Spider-Man 2</a>, y está en todas las listas de los mejores cómics de Spider-Man, incluida <a href="/blog/mejores-comics-spider-man-historia">la nuestra</a>.</p>

<h2>Cómo leerla</h2>
<p>La historia está recopilada en un solo tomo, fácil de encontrar en español. Se puede leer sin conocer nada más del personaje, aunque ayuda saber que Peter y MJ acaban de casarse. Si te gusta, sigue con otras historias de la misma época o con nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía de cómics de Spider-Man para nuevos lectores</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué números forman La última cacería de Kraven?</h3>
<p>Web of Spider-Man #31-32, The Amazing Spider-Man #293-294 y The Spectacular Spider-Man #131-132, todos de 1987.</p>
<h3>¿Kraven mata a Spider-Man?</h3>
<p>Le dispara un dardo tranquilizante y le entierra vivo, haciéndole pasar por muerto, y ocupa su lugar durante dos semanas.</p>
<h3>¿Por qué Spider-Man lleva el traje negro?</h3>
<p>Porque en 1987 Peter usaba un traje negro de tela, inspirado en el simbionte del que se había librado años antes.</p>
`,
};

const SUPERIOR = {
  slug: 'superior-spider-man-doctor-octopus-analisis',
  title: 'Superior Spider-Man: análisis de la etapa en la que Doctor Octopus fue Spider-Man',
  subtitle: 'Otto Octavius en el cuerpo de Peter Parker: cómo una idea que enfureció a los fans acabó siendo una de las mejores etapas del siglo XXI',
  excerpt:
    'En 2012, el Doctor Octopus se apoderó del cuerpo de Peter Parker y se convirtió en el Superior Spider-Man. Analizamos la etapa de Dan Slott: su premisa, la evolución de Otto, su final y cómo leerla.',
  readTime: '10 min',
  seoTitle: 'Superior Spider-Man: análisis (Doctor Octopus como Spider-Man)',
  seoDescription:
    'Análisis de Superior Spider-Man, de Dan Slott: el Doctor Octopus en el cuerpo de Peter Parker, qué pasa, cómo termina, sus dibujantes y en qué orden leerlo.',
  keywords: ['Superior Spider-Man', 'Superior Spider-Man análisis', 'Doctor Octopus Spider-Man', 'Dan Slott', 'Amazing Spider-Man 700', 'Otto Octavius'],
  tags: ['análisis', 'cómics', 'Doctor Octopus', 'Dan Slott', 'siglo XXI', 'Superior Spider-Man'],
  content: `
<p>A finales de 2012, Dan Slott empezó a recibir amenazas de muerte. Acababa de publicarse <em>The Amazing Spider-Man</em> #700, el número que cerraba la serie después de cincuenta años, y en él el ${pj('doctor-octopus-otto-octavius', 'Doctor Octopus')}, moribundo, intercambiaba su mente con la de Peter Parker. Peter moría en el cuerpo de Otto, y Otto se quedaba con su vida… y con su traje. Los fans estaban furiosos. Y, como se vio después, Slott tenía un plan.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Guion</strong></td><td>Dan Slott (con Christos Gage en algunos números)</td></tr>
    <tr><td><strong>Dibujo</strong></td><td>Ryan Stegman, Humberto Ramos y Giuseppe Camuncoli, entre otros</td></tr>
    <tr><td><strong>Publicación</strong></td><td>2013-2014</td></tr>
    <tr><td><strong>Prólogo</strong></td><td>The Amazing Spider-Man #698-700 (<em>Dying Wish</em>)</td></tr>
    <tr><td><strong>Final</strong></td><td><em>Goblin Nation</em> (2014)</td></tr>
  </tbody>
</table>

<h2>La premisa</h2>
${cvFigure('scale_medium/6/67663/3548171-01.jpg', 'Portada de Superior Spider-Man #1 con un Spider-Man de traje oscurecido', 'Otto Octavius como el Superior Spider-Man: más eficiente que Peter Parker, pero sin la brújula moral que define al personaje. Ryan Stegman firmó algunas de las páginas más memorables de la etapa.')}
<p>La idea es tan sencilla como inquietante: ¿qué pasaría si un genio sin escrúpulos se pusiera el traje de Spider-Man con la intención de ser el mejor Spider-Man posible? La respuesta de Slott es que sería más eficaz que Peter, y también mucho más peligroso.</p>
<p>Otto no duda ni se tortura: optimiza. Llena Nueva York de pequeños robots araña para vigilar la ciudad, termina el doctorado que Peter nunca acabó, funda su propia empresa y construye mejores herramientas. Por primera vez en décadas, los criminales tienen miedo de verdad a Spider-Man. El problema es el precio moral de ese miedo, y algunas personas cercanas a Peter, como la policía Carlie Cooper, empiezan a sospechar que algo no va bien.</p>

<h2>La evolución de Otto</h2>
${cvFigure('scale_medium/6/67663/6735989-01.jpg', 'Portada de Superior Spider-Man con Spider-Man en posición de combate', 'Las portadas de Superior Spider-Man jugaban constantemente con la dualidad: el traje familiar de Peter Parker, la postura y actitud inconfundiblemente de Otto Octavius.')}
<p>Lo que convierte la saga en algo más que un golpe de efecto es la transformación de Otto. Al vivir la vida de Peter y con sus recuerdos, el villano empieza a entender, casi sin querer, lo que significa ser Spider-Man. Se enamora, se preocupa por la gente que le rodea y descubre que ser «superior» no es lo mismo que ser mejor. Otto nunca deja de ser Otto, pero se convierte en un personaje con muchos más matices que el villano que era.</p>

<h2>El final</h2>
<p>En <em>Goblin Nation</em> (2014), el Duende Verde lanza un ataque contra Nueva York que Otto no es capaz de detener. Para salvar a la persona que ama, Otto hace algo que nadie esperaba: acepta que Peter Parker es el verdadero héroe y le devuelve su cuerpo. Peter regresa en <em>The Amazing Spider-Man</em> (2014), y su vuelta es más emotiva precisamente porque su ausencia había sido real.</p>

<h2>Su legado</h2>
<p>Superior Spider-Man no fue un experimento cerrado. Otto volvió como Superior Spider-Man en otras etapas, y desde entonces es un personaje mucho más rico, a medio camino entre villano y héroe. La saga está entre <a href="/blog/mejores-comics-spider-man-historia">los mejores cómics de Spider-Man</a> y es, para muchos, la mejor etapa del personaje en el siglo XXI.</p>

<h2>Cómo leerla</h2>
<ol>
  <li><em>The Amazing Spider-Man</em> #698-700 (<em>Dying Wish</em>): el cambio de cuerpos.</li>
  <li><em>Superior Spider-Man</em> #1-31: la etapa completa, con <em>Goblin Nation</em> como final.</li>
  <li>Opcional: <em>Superior Spider-Man Team-Up</em>, con aventuras de Otto junto a otros héroes.</li>
</ol>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué es Superior Spider-Man?</h3>
<p>La etapa (2013-2014) en la que el Doctor Octopus vive en el cuerpo de Peter Parker y es Spider-Man.</p>
<h3>¿Vuelve Peter Parker?</h3>
<p>Sí, al final de la etapa, en 2014, cuando Otto le devuelve su cuerpo.</p>
<h3>¿Hay que leer algo antes?</h3>
<p>Basta con <em>The Amazing Spider-Man</em> #698-700, donde se produce el cambio de cuerpos.</p>
`,
};

const comic = (slug, title) => `<a href="/comics/${slug}"><em>${title}</em></a>`;

const ULTIMATE_BENDIS = {
  slug: 'ultimate-spider-man-bendis-analisis-run-completa',
  title: 'Ultimate Spider-Man de Bendis: análisis de la etapa que reinventó a Spider-Man',
  subtitle: 'Un Peter Parker adolescente para el siglo XXI, Mark Bagley, la muerte de Peter y el nacimiento de Miles Morales: por qué es imprescindible',
  excerpt:
    'En 2000, Ultimate Spider-Man empezó de cero con un Peter Parker adolescente. Brian Michael Bendis lo escribió durante más de una década. Analizamos la etapa, sus mejores arcos y cómo leerla.',
  readTime: '10 min',
  seoTitle: 'Ultimate Spider-Man de Bendis: análisis y orden de lectura',
  seoDescription:
    'Análisis de Ultimate Spider-Man de Brian Michael Bendis y Mark Bagley: el Peter Parker adolescente, sus mejores arcos, la muerte de Peter, Miles Morales y cómo leerla.',
  keywords: ['Ultimate Spider-Man Bendis', 'Ultimate Spider-Man cómic', 'Ultimate Spider-Man análisis', 'Mark Bagley', 'muerte de Spider-Man Ultimate', 'Miles Morales cómic'],
  tags: ['análisis', 'cómics', 'Ultimate', 'Bendis', 'Mark Bagley', 'Miles Morales'],
  content: `
<p>En el año 2000, Marvel lanzó ${comic('ultimate-spider-man-1-2000', 'Ultimate Spider-Man #1')} con una idea sencilla: empezar de cero. Un universo nuevo, sin cuarenta años de continuidad, con un Peter Parker otra vez adolescente y en el instituto. Lo que Brian Michael Bendis hizo con esa premisa durante más de una década es una de las etapas más consistentes de la historia del cómic de superhéroes.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Guion</strong></td><td>Brian Michael Bendis</td></tr>
    <tr><td><strong>Dibujo</strong></td><td>Mark Bagley (#1-111), después Stuart Immonen, David LaFuente y otros</td></tr>
    <tr><td><strong>Publicación</strong></td><td>2000-2011</td></tr>
    <tr><td><strong>Final de Peter</strong></td><td><em>La muerte de Spider-Man</em> (Ultimate Comics Spider-Man #160, 2011)</td></tr>
    <tr><td><strong>Universo</strong></td><td>Tierra-1610 (Ultimate)</td></tr>
  </tbody>
</table>

<h2>Un Peter Parker para el siglo XXI</h2>
${cvFigure('original/0/4/44573-7257-51619-1-ultimate-spider-man.jpg', 'Portada de Ultimate Spider-Man #1 con Spider-Man balanceándose entre rascacielos', 'Ultimate Spider-Man #1 (2000): el inicio de un universo nuevo, sin décadas de continuidad.')}
<p>El Peter de Bendis habla como un adolescente de su época: tiene ordenador, trabaja como informático en la web del Daily Bugle y sus problemas (el acoso escolar, las notas, el primer amor, el dinero) se cuentan con una naturalidad que el Peter de los años 60 no podía tener. Mary Jane descubre su secreto muy pronto, y su relación es uno de los grandes pilares de la serie.</p>
<p>Bendis tardó siete números en contar el origen. En una época en la que los cómics resumían el origen en unas pocas páginas, era toda una declaración: <em>Ultimate Spider-Man</em> iba a ser una serie sobre personajes, no solo sobre peleas.</p>

<h2>Mark Bagley y una racha histórica</h2>
<p>Mark Bagley dibujó los primeros 111 números seguidos, una de las rachas más largas de un mismo equipo creativo en la historia de Marvel. Su Spider-Man, ágil y juvenil, definió el aspecto de la serie, y su relevo, Stuart Immonen, mantuvo el nivel con un estilo más dinámico. En ${comic('ultimate-spider-man-111-2007', 'el #111')} se ve ese cambio de dibujante.</p>

<h2>Los grandes arcos</h2>
${cvFigure('original/11/110017/2945162-www.jpg', 'Portada de Ultimate Spider-Man #100 con decenas de clones de Spider-Man', 'Ultimate Spider-Man #100, en plena saga del clon del universo Ultimate.')}
<ul>
  <li><strong>Poder y responsabilidad (#1-7):</strong> el origen, con Norman Osborn como gran villano.</li>
  <li><strong>Venom (#33-39):</strong> el simbionte es un proyecto científico del padre de Peter, y Eddie Brock es un amigo de su infancia.</li>
  <li><strong>Carnage (#60-65):</strong> uno de los momentos más duros de la serie, con consecuencias para Gwen Stacy.</li>
  <li><strong>La saga del clon (#97-105):</strong> la versión Ultimate de la polémica historia de los 90, mucho más compacta.</li>
  <li><strong>La muerte del Duende (#111-117):</strong> el cierre de la gran rivalidad con Norman Osborn.</li>
</ul>
${cvFigure('original/0/8692/193029-18223-110330-2-ultimate-spider-man.jpg', 'Portada de Ultimate Spider-Man Annual #1 con Spider-Man y Kitty Pryde', 'Ultimate Spider-Man Annual #1 (2005): Peter y Kitty Pryde, una de las parejas más inesperadas de la serie.')}
<p>La serie también encontró tiempo para cruces con los X-Men y los Cuatro Fantásticos, y para un ${comic('ultimate-spider-man-annual-1-2005', 'Annual')} en el que Peter sale con Kitty Pryde. Lo extraordinario no es un arco concreto, sino que la calidad se mantiene durante más de cien números: Bendis podía dedicar un número entero a una conversación entre Peter y MJ y seguir siendo más emocionante que muchas sagas.</p>

<h2>La muerte de Spider-Man y Miles Morales</h2>
<p>En 2011, en <em>La muerte de Spider-Man</em>, el Peter Parker Ultimate murió protegiendo a su familia frente al Duende Verde. Bendis no cerró la serie: la reinventó por segunda vez con ${pj('spider-man-miles-morales', 'Miles Morales')}, creado junto a Sara Pichelli, un adolescente de Brooklyn que recogía el testigo. Miles es hoy uno de los personajes más queridos de Marvel, protagonista del Spider-Verso y de sus propios videojuegos. Sin Ultimate Spider-Man, Miles no existiría. Si te interesa comparar a los dos, tienes <a href="/blog/peter-parker-vs-miles-morales-analisis">Peter Parker vs. Miles Morales</a>.</p>

<h2>Cómo leerla</h2>
<p>Lo más sencillo es seguir los tomos recopilatorios en orden. La serie original va del #1 al #133, sigue con <em>Ultimate Comics Spider-Man</em> y termina con <em>La muerte de Spider-Man</em> (#156-160). Después llegan las series de Miles. Es una lectura ideal para quien quiera empezar con Spider-Man sin conocer nada, como explicamos en nuestra <a href="/blog/comics-spider-man-guia-nuevos-lectores">guía para nuevos lectores</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué es el universo Ultimate?</h3>
<p>Una línea de Marvel lanzada en 2000 que reiniciaba a sus héroes desde cero, en un universo propio (la Tierra-1610), sin décadas de continuidad.</p>
<h3>¿Muere Peter Parker en Ultimate Spider-Man?</h3>
<p>Sí, en <em>La muerte de Spider-Man</em> (2011). Le sustituye Miles Morales.</p>
<h3>¿Es buena para empezar con Spider-Man?</h3>
<p>Sí: empieza desde el origen y no necesita conocimientos previos.</p>
`,
};

const SIMBIONTE = {
  slug: 'simbionte-historia-evolucion-venom',
  title: 'El simbionte: historia y evolución del traje negro y de Venom',
  subtitle: 'De la idea de un fan en Secret Wars a Venom, Carnage y Knull: cuarenta años del alienígena más famoso de Marvel, en los cómics, el cine y los videojuegos',
  excerpt:
    'Todo empezó con un traje negro en Secret Wars (1984). Repasamos la historia completa del simbionte: el traje de Spider-Man, Venom, Carnage, Knull y sus versiones en el cine y los videojuegos.',
  readTime: '11 min',
  seoTitle: 'El simbionte de Spider-Man: historia del traje negro y Venom',
  seoDescription:
    'Historia del simbionte: el traje negro de Spider-Man en Secret Wars, el nacimiento de Venom, Carnage, Knull y sus versiones en el cine (Spider-Man 3, Venom) y los videojuegos.',
  keywords: ['simbionte Spider-Man', 'traje negro Spider-Man', 'historia de Venom', 'origen de Venom', 'Carnage', 'Knull'],
  tags: ['historia', 'cómics', 'Venom', 'simbionte', 'Carnage', 'Secret Wars'],
  content: `
<p>Pocas criaturas de los cómics han tenido una vida tan intensa como el simbionte. Nació como un traje nuevo para Spider-Man, se convirtió en uno de sus mayores enemigos, tuvo hijos, protagonizó películas que han recaudado cientos de millones y acabó con una mitología propia que se remonta al principio del universo. Esta es su historia completa.</p>

<h2>La idea de un fan</h2>
<p>El traje negro nació de una idea enviada a Marvel por un lector, Randy Schueller, que a principios de los 80 propuso un traje negro para Spider-Man. Marvel le compró la idea por 220 dólares. Años después, la editorial la recuperó para <em>Secret Wars</em> (1984), el gran evento en el que los héroes eran llevados a un planeta lejano por el Todopoderoso.</p>

<h2>El traje negro (1984-1985)</h2>
${cvFigure('scale_medium/11125/111253436/6733785-9.jpg', 'Venom agazapado sobre una cornisa de Nueva York', 'Venom: el traje que Peter rechazó, unido a un hombre que le odiaba.')}
<p>Con el traje roto tras una batalla, Peter encuentra en <em>Secret Wars</em> #8 una máquina que le da uno nuevo, negro, que responde a sus pensamientos y genera su propia telaraña. Llegó a las series regulares en <em>The Amazing Spider-Man</em> #252 (1984), y durante meses fue el traje habitual de Spider-Man. Hasta que Peter descubrió que estaba vivo.</p>
<p>En <em>The Amazing Spider-Man</em> #258 (1984), Reed Richards confirma que el traje es un ser alienígena que intenta unirse para siempre a Peter, y que es vulnerable al sonido. Peter se libra de él, pero el simbionte vuelve a buscarle, y en <em>Web of Spider-Man</em> #1 (1985) Peter lo rechaza definitivamente bajo el estruendo de las campanas de una iglesia. Aun así, Peter siguió usando durante años un traje negro de tela, inspirado en el original.</p>

<h2>El nacimiento de Venom (1988)</h2>
<p>En ese campanario estaba Eddie Brock, un periodista cuya carrera se había hundido tras un error en una exclusiva que Spider-Man había desmontado. Su odio hacia el héroe y el rechazo que sentía el simbionte encajaron a la perfección. Así nació ${pj('venom-eddie-brock', 'Venom')}, que debutó del todo en <em>The Amazing Spider-Man</em> #300 (1988), de David Michelinie y Todd McFarlane.</p>
<p>Venom era terrorífico: conocía la identidad secreta de Peter, su sentido arácnido no lo detectaba y era mucho más fuerte. El diseño de McFarlane, enorme, con colmillos y lengua, definió la estética de los 90, y el personaje fue tan popular que en 1993 pasó a ser un antihéroe con serie propia, <em>Venom: Lethal Protector</em>.</p>

<h2>La familia simbionte</h2>
<p>El éxito de Venom trajo más simbiontes. El primero y más famoso fue ${pj('carnage-cletus-kasady', 'Carnage')}, nacido de una cría del simbionte de Venom unida al asesino en serie Cletus Kasady, en 1992. Después llegaron muchos más: Scream, Toxin, Anti-Venom y otros. Y el simbionte de Venom ha tenido distintos portadores, como Mac Gargan, el antiguo ${pj('scorpion-mac-gargan', 'Escorpión')}, o Flash Thompson, que fue el Agente Venom.</p>
<p>En 2018, Donny Cates y Ryan Stegman dieron a los simbiontes un origen cósmico con Knull, el dios oscuro que los creó, protagonista del evento <em>King in Black</em> (2020).</p>

<h2>En el cine</h2>
<ul>
  <li><strong>${peli('spider-man-3-2007', 'Spider-Man 3')} (2007):</strong> el traje negro saca la peor versión de Peter (Tobey Maguire), y Topher Grace es Eddie Brock.</li>
  <li><strong>${peli('venom-2018', 'Venom')} (2018), ${peli('venom-habra-matanza-2021', 'Habrá Matanza')} (2021) y ${peli('venom-el-ultimo-baile-2024', 'El último baile')} (2024):</strong> la trilogía de Tom Hardy, que convirtió a Venom en protagonista y presentó a Carnage (Woody Harrelson).</li>
  <li><strong>${peli('spider-man-no-way-home-2021', 'No Way Home')} (2021):</strong> en la escena poscréditos, un pequeño trozo del simbionte se queda en el universo de Tom Holland.</li>
</ul>

<h2>En los videojuegos</h2>
<p>El simbionte es el gran protagonista de <a href="/blog/spider-man-web-of-shadows-analisis-juego-olvidado">Web of Shadows</a> (2008), en el que se puede cambiar entre el traje rojo y el negro, y de <a href="/blog/marvels-spider-man-2-ps5-analisis">Marvel's Spider-Man 2</a> (2023), donde Insomniac le dio a Peter un traje negro con poderes brutales y una de las versiones más imponentes de Venom.</p>

<h2>Conclusión</h2>
<p>Cuarenta años después de aquel traje negro, el simbionte ha pasado de ser un cambio de vestuario a uno de los conceptos más fértiles del universo Marvel. Pocas ideas de un fan han llegado tan lejos.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿De dónde viene el traje negro de Spider-Man?</h3>
<p>De <em>Secret Wars</em> (1984): Peter lo consigue en un planeta alienígena sin saber que es un ser vivo.</p>
<h3>¿Quién fue el primer Venom?</h3>
<p>Eddie Brock, en 1988. Antes, el simbionte había estado unido a Peter Parker.</p>
<h3>¿Cuál es la debilidad del simbionte?</h3>
<p>El sonido intenso y el fuego.</p>
`,
};

const PETER_VS_MILES = {
  slug: 'peter-parker-vs-miles-morales-analisis',
  title: 'Peter Parker vs. Miles Morales: diferencias entre los dos Spider-Man',
  subtitle: 'Origen, poderes, familia, villanos y versiones en el cine y los videojuegos: comparamos a los dos grandes Spider-Man de Marvel',
  excerpt:
    'Peter Parker y Miles Morales son los dos Spider-Man más conocidos. Comparamos su origen, sus poderes, sus familias, sus villanos y sus versiones en el cine y los videojuegos.',
  readTime: '9 min',
  seoTitle: 'Peter Parker vs. Miles Morales: diferencias entre los Spider-Man',
  seoDescription:
    'Diferencias entre Peter Parker y Miles Morales: origen, poderes (descarga venom e invisibilidad), familia, villanos, trajes y sus versiones en el cine y los videojuegos.',
  keywords: ['Peter Parker vs Miles Morales', 'diferencias Peter Parker Miles Morales', 'poderes de Miles Morales', 'Miles Morales', 'Peter Parker', 'quién es mejor Spider-Man'],
  tags: ['comparativa', 'Peter Parker', 'Miles Morales', 'personajes', 'Spider-Verse', 'cómics'],
  content: `
<p>«Un gran poder conlleva una gran responsabilidad». La frase define a Spider-Man desde 1962. Pero cuando Miles Morales se puso la máscara en 2011, quedó claro que esa misma idea puede vivirse de formas muy distintas según quién la lleve. Peter Parker y Miles Morales son hoy los dos grandes Spider-Man de Marvel, y comparten mucho más que el traje… y también se diferencian en mucho.</p>

<h2>Los dos Spider-Man, de un vistazo</h2>
<table>
  <thead><tr><th></th><th>Peter Parker</th><th>Miles Morales</th></tr></thead>
  <tbody>
    <tr><td><strong>Debut</strong></td><td>Amazing Fantasy #15 (1962)</td><td>Ultimate Fallout #4 (2011)</td></tr>
    <tr><td><strong>Creadores</strong></td><td>Stan Lee y Steve Ditko</td><td>Brian Michael Bendis y Sara Pichelli</td></tr>
    <tr><td><strong>Universo de origen</strong></td><td>Tierra-616</td><td>Tierra-1610 (Ultimate)</td></tr>
    <tr><td><strong>Barrio</strong></td><td>Queens</td><td>Brooklyn</td></tr>
    <tr><td><strong>Familia</strong></td><td>Huérfano, criado por sus tíos Ben y May</td><td>Sus padres, Jefferson Davis y Rio Morales</td></tr>
    <tr><td><strong>Poderes propios</strong></td><td>—</td><td>Descarga «venom» e invisibilidad</td></tr>
    <tr><td><strong>Mejor amigo</strong></td><td>Harry Osborn (y Ned Leeds en el MCU)</td><td>Ganke Lee</td></tr>
  </tbody>
</table>
<p>Tienes la historia completa de cada uno en sus fichas: ${pj('spider-man-peter-parker', 'Peter Parker')} y ${pj('spider-man-miles-morales', 'Miles Morales')}.</p>

<h2>Orígenes: culpa frente a vocación</h2>
${cvFigure('scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg', 'Spider-Man con el traje clásico rojo y azul balanceándose', 'Peter Parker con el traje clásico rojo y azul: el héroe moldeado por la culpa, el sacrificio y la responsabilidad que lleva más de 60 años siendo el referente del personaje.')}
<p>Peter Parker nace de un error. Podía haber detenido al ladrón que después mató a su tío Ben y no lo hizo. Su heroísmo es, en parte, una penitencia que nunca termina: sacrifica su vida amorosa, su trabajo y su tranquilidad porque siente que se lo debe al mundo.</p>
<p>Miles parte de un lugar distinto. En los cómics Ultimate recibe sus poderes justo cuando muere el Spider-Man de su mundo, y se siente culpable por no haber podido ayudarle; en <a href="/blog/spider-man-into-the-spider-verse-analisis-revolucion-animacion">Un nuevo universo</a> ocurre algo parecido. Pero Miles no actúa tanto para expiar una culpa como porque cree que puede ayudar. Su historia es la de alguien que tiene que decidir si se atreve a ser héroe.</p>

<h2>Poderes</h2>
<p>Los dos tienen la fuerza, la agilidad, el sentido arácnido y la capacidad de trepar por las paredes de una araña. Pero Miles tiene dos poderes que Peter no tiene: una <strong>descarga bioeléctrica</strong>, la «venom», capaz de aturdir a sus enemigos, y la capacidad de volverse <strong>invisible</strong>, que combina con un cambio de color de su ropa. Peter, en cambio, compensa con su genio científico: inventó su propio fluido de telaraña y sus lanzarredes.</p>

<h2>Familia y entorno</h2>
<p>Peter es huérfano, y su soledad es estructural: durante décadas ha protegido su secreto incluso de la tía May. Miles tiene a sus padres vivos y presentes, a un mejor amigo incondicional, Ganke, y una comunidad en Brooklyn que forma parte de su identidad. Hijo de un padre afroamericano y una madre puertorriqueña, Miles representa una Nueva York más diversa, y sus historias hablan de identidad, de barrio y de pertenecer a varias culturas a la vez.</p>
<p>Su relación con el fracaso también es distinta. Peter carga con cada error como prueba de que no es suficiente; Miles se equivoca, a veces de forma espectacular, pero tiene una red que le sostiene.</p>

<h2>Villanos</h2>
<p>La galería de Peter es la más famosa de Marvel: el ${pj('green-goblin-norman-osborn', 'Duende Verde')}, el ${pj('doctor-octopus-otto-octavius', 'Doctor Octopus')}, ${pj('venom-eddie-brock', 'Venom')}… La de Miles es más personal: su gran enemigo en los inicios fue su propio tío, Aaron Davis, el ${pj('prowler-aaron-davis', 'Merodeador')}, y en los videojuegos se enfrenta al Tinkerer, una antigua amiga de la infancia. Te contamos los villanos de Peter en <a href="/blog/mejores-villanos-spider-man-ranking-definitivo">los 10 mejores villanos de Spider-Man</a>.</p>

<h2>En el cine y los videojuegos</h2>
${figure('237/2372aa24a528d592d0bdb6d1fa0d1253', 'Miles Morales con su traje bajo la nieve, entre luces de neón', 'Miles Morales en su propio videojuego (2020): su traje negro y rojo ya es tan reconocible como el clásico de Peter.')}
<ul>
  <li><strong>Peter:</strong> tres actores en imagen real (Tobey Maguire, Andrew Garfield y Tom Holland), además del Peter B. Parker del Spider-Verso. Los comparamos en <a href="/blog/tobey-maguire-andrew-garfield-tom-holland-mejor-spider-man">Maguire vs. Garfield vs. Holland</a>.</li>
  <li><strong>Miles:</strong> protagonista de la trilogía animada del Spider-Verso, con la voz de Shameik Moore, y de su propio juego, <a href="/blog/spider-man-miles-morales-ps5-analisis">Marvel's Spider-Man: Miles Morales</a>.</li>
  <li><strong>Juntos:</strong> comparten protagonismo en <a href="/blog/marvels-spider-man-2-ps5-analisis">Marvel's Spider-Man 2</a>, donde el juego alterna entre los dos.</li>
</ul>

<h2>¿Por qué necesitamos a los dos?</h2>
<p>Peter Parker nos habla de la responsabilidad como una carga. Miles Morales, de la responsabilidad como una elección. Juntos cubren todo el espectro de por qué alguien con poder decide usarlo para ayudar a los demás. Por eso el Spider-Verso funciona tan bien: no hay una forma correcta de ser Spider-Man, sino muchas. ¿Cuál eres tú? Descúbrelo en nuestro test <a href="/juegos/que-spider-man-eres">¿Qué Spider-Man eres?</a></p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué poderes tiene Miles Morales que no tiene Peter Parker?</h3>
<p>La descarga bioeléctrica «venom» y la capacidad de volverse invisible.</p>
<h3>¿Miles Morales es de otro universo?</h3>
<p>Nació en el universo Ultimate (Tierra-1610), pero desde 2015 vive en el universo principal de Marvel, junto a Peter.</p>
<h3>¿Peter Parker y Miles Morales se conocen?</h3>
<p>Sí: en los cómics, Peter fue su mentor, y en Marvel's Spider-Man también.</p>
`,
};

const GUIA_COMICS = {
  slug: 'comics-spider-man-guia-nuevos-lectores',
  title: 'Cómics de Spider-Man para empezar: 5 imprescindibles para nuevos lectores',
  subtitle: 'Por dónde empezar a leer Spider-Man: cinco historias accesibles, en qué orden leerlas y qué leer después',
  excerpt:
    'Spider-Man lleva más de 60 años en los cómics y es difícil saber por dónde empezar. Te recomendamos cinco historias accesibles, el orden para leerlas y qué leer después.',
  readTime: '9 min',
  seoTitle: 'Cómics de Spider-Man para empezar: guía para nuevos lectores',
  seoDescription:
    'Por dónde empezar a leer cómics de Spider-Man: 5 historias imprescindibles para nuevos lectores, en qué orden leerlas y qué leer después según lo que te guste.',
  keywords: ['cómics de Spider-Man para empezar', 'por dónde empezar Spider-Man cómics', 'mejores cómics Spider-Man', 'Spider-Man cómics nuevos lectores', 'Ultimate Spider-Man', 'Spider-Man Azul'],
  tags: ['guía', 'cómics', 'nuevos lectores', 'Ultimate', 'clásicos', 'recomendaciones'],
  content: `
<p>Spider-Man lleva protagonizando cómics desde 1962. Con miles de números, decenas de series y varios universos, decidir por dónde empezar puede ser abrumador. Esta selección prioriza historias que se entienden sin saber nada del personaje, que se pueden leer por separado y que muestran lo mejor de Spider-Man. Al final te decimos qué leer después según lo que más te haya gustado.</p>

<h2>Antes de empezar: tres consejos</h2>
<ul>
  <li><strong>No hace falta leerlo todo en orden.</strong> Los cómics de Spider-Man no son una serie de televisión: puedes empezar por una buena historia y saltar a otra.</li>
  <li><strong>Busca tomos recopilatorios.</strong> En lugar de números sueltos, las historias completas se publican en tomos, más fáciles de encontrar en español.</li>
  <li><strong>Prueba distintas épocas.</strong> El Spider-Man de los 60 y el de los 2000 se leen de forma muy distinta; elige el que más te atraiga.</li>
</ul>

<h2>1. Ultimate Spider-Man (2000)</h2>
${cvFigure('original/0/4/44573-7257-51619-1-ultimate-spider-man.jpg', 'Portada de Ultimate Spider-Man #1', 'Ultimate Spider-Man #1, de Bendis y Bagley (2000): el reinicio moderno que acercó a Peter Parker a una nueva generación.')}
<p>Brian Michael Bendis y Mark Bagley contaron de nuevo el origen de Peter Parker para el siglo XXI, en un universo propio y sin décadas de continuidad. Es fresco, ágil y muy accesible: un Peter adolescente, torpe e inseguro, con los problemas de un chaval de instituto de hoy.</p>
<p><strong>Por qué empezar aquí:</strong> es el mejor punto de entrada si nunca has leído cómics de superhéroes. Te lo contamos en <a href="/blog/ultimate-spider-man-bendis-analisis-run-completa">nuestro análisis de Ultimate Spider-Man</a>.</p>

<h2>2. La noche en que murió Gwen Stacy (1973)</h2>
<p>Los números #121-122 de <em>The Amazing Spider-Man</em>, de Gerry Conway y Gil Kane, son los más importantes de la historia del personaje. La muerte de Gwen Stacy a manos del Duende Verde cambió los cómics de superhéroes: antes, el héroe siempre llegaba a tiempo; después, ya nada era seguro.</p>
<p><strong>Por qué leerlo:</strong> es breve, impactante y explica por qué Spider-Man carga con tanta culpa. Lo analizamos en <a href="/blog/legado-muerte-gwen-stacy-50-anos">el legado de La noche en que murió Gwen Stacy</a>.</p>

<h2>3. La última cacería de Kraven (1987)</h2>
<p>J. M. DeMatteis y Mike Zeck firman una historia oscura, casi literaria, en la que Kraven derrota a Spider-Man, lo entierra y ocupa su lugar. Es una de las mejores historias del personaje y se lee como una novela gráfica independiente.</p>
<p><strong>Por qué leerlo:</strong> no necesitas conocer nada del pasado de Spider-Man. Te contamos por qué es tan buena en <a href="/blog/kravens-last-hunt-analisis-mejor-arco-spider-man">nuestro análisis</a>.</p>

<h2>4. Spider-Man: Azul (2002)</h2>
<p>Jeph Loeb y Tim Sale cuentan, desde el recuerdo de un Peter adulto, cómo se enamoró de Gwen Stacy. Con un dibujo elegante y una narración nostálgica, es uno de los cómics más emotivos del personaje.</p>
<p><strong>Por qué leerlo:</strong> perfecto si te interesa más el drama humano que la acción.</p>

<h2>5. Superior Spider-Man (2013)</h2>
<p>¿Qué pasaría si el Doctor Octopus se apoderara del cuerpo de Peter Parker y decidiera ser un Spider-Man «superior»? Dan Slott exploró la idea durante más de treinta números con resultados sorprendentes.</p>
<p><strong>Por qué leerlo:</strong> demuestra que Spider-Man puede reinventarse por completo sin perder su esencia. Mejor cuando ya conozcas un poco al personaje. Lo tienes en <a href="/blog/superior-spider-man-doctor-octopus-analisis">nuestro análisis de Superior Spider-Man</a>.</p>

<h2>En qué orden leerlos</h2>
<ol>
  <li><strong>Ultimate Spider-Man</strong>, para conocer al personaje desde cero.</li>
  <li><strong>Spider-Man: Azul</strong> y <strong>La noche en que murió Gwen Stacy</strong>, juntas: una es el recuerdo y la otra, la tragedia.</li>
  <li><strong>La última cacería de Kraven</strong>, cuando quieras algo más adulto.</li>
  <li><strong>Superior Spider-Man</strong>, para ver al personaje desde otro ángulo.</li>
</ol>

<h2>¿Y después?</h2>
<ul>
  <li><strong>Si te gustó el Spider-Verso:</strong> empieza por ${comic('edge-of-spider-verse-2-2014', 'Edge of Spider-Verse #2')}, el debut de Spider-Gwen, y sigue con la saga <em>Spider-Verse</em> (2014).</li>
  <li><strong>Si te gustó Miles Morales:</strong> lee sus primeras historias en el universo Ultimate, de Bendis y Sara Pichelli.</li>
  <li><strong>Si te gustan los clásicos:</strong> la etapa de Stan Lee y Steve Ditko, desde el principio, sigue siendo una delicia.</li>
</ul>
<p>Tienes la lista completa en <a href="/blog/mejores-comics-spider-man-historia">los 10 mejores cómics de Spider-Man de la historia</a>, con la edición en español de cada uno, y puedes explorar todos los números en nuestra sección de <a href="/comics">cómics</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuál es el mejor cómic de Spider-Man para empezar?</h3>
<p>Ultimate Spider-Man (2000): cuenta el origen desde cero y no necesita conocimientos previos.</p>
<h3>¿Hay que leer los cómics de Spider-Man en orden?</h3>
<p>No: la mayoría de grandes historias se entienden por separado.</p>
<h3>¿Dónde comprar cómics de Spider-Man en español?</h3>
<p>Panini publica en España los cómics de Marvel, tanto novedades como recopilatorios de clásicos. Puedes encontrarlos en tiendas especializadas, librerías y en Amazon.</p>
`,
};

const serie = (slug, title) => `<a href="/series/${slug}"><em>${title}</em></a>`;

const SERIE_1994 = {
  slug: 'spider-man-animated-series-1994-analisis',
  title: 'Spider-Man: La serie animada (1994), análisis: por qué sigue siendo la mejor adaptación',
  subtitle: 'Venom, Kingpin, Hobgoblin, las Guerras Secretas y un final inconcluso: la serie de Fox Kids que marcó a toda una generación',
  excerpt:
    'Spider-Man: La serie animada (1994) marcó a toda una generación. Analizamos sus personajes, sus grandes sagas, la censura que la condicionó y su final inconcluso.',
  readTime: '10 min',
  seoTitle: 'Spider-Man: La serie animada (1994): análisis completo',
  seoDescription:
    'Análisis de Spider-Man: La serie animada (1994): sus 65 episodios, Venom y Carnage, Kingpin, las Guerras Secretas, la censura de Fox Kids y su final inconcluso.',
  keywords: ['Spider-Man serie animada 1994', 'Spider-Man The Animated Series', 'serie Spider-Man 90', 'Spider-Man Fox Kids', 'Spider Wars', 'Venom serie 1994'],
  tags: ['análisis', 'series', 'animación', 'años 90', 'Fox Kids', 'Venom'],
  content: `
<p>Si preguntas a alguien que creció en los 90 cuál es «su» Spider-Man, es muy probable que responda lo mismo: la ${serie('spiderman', 'serie animada de 1994')}. Durante cinco temporadas, la serie de Fox Kids adaptó los mejores arcos de los cómics con una ambición que pocas series de dibujos animados tenían, y estableció cómo debía funcionar Spider-Man en animación.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Emisión</strong></td><td>1994-1998, en Fox Kids</td></tr>
    <tr><td><strong>Episodios</strong></td><td>65, en 5 temporadas</td></tr>
    <tr><td><strong>Producción</strong></td><td>Marvel Films y Saban, con John Semper como guionista principal</td></tr>
    <tr><td><strong>Voces originales</strong></td><td>Christopher Daniel Barnes (Peter Parker), Sara Ballantine (Mary Jane), Ed Asner (J. Jonah Jameson), Roscoe Lee Browne (Kingpin)</td></tr>
    <tr><td><strong>Tema principal</strong></td><td>Compuesto por Joe Perry, guitarrista de Aerosmith</td></tr>
  </tbody>
</table>

<h2>El contexto: Fox Kids en los 90</h2>
<p>La serie llegó en el momento perfecto. <em>Batman: La serie animada</em> había demostrado en 1992 que los dibujos de superhéroes podían ser sofisticados, y Fox Kids, que ya emitía la serie de los X-Men, quería otro gran éxito de Marvel. El resultado fue una serie con arcos de varios episodios, personajes con motivaciones complejas y adaptaciones bastante fieles de las grandes historias del cómic. Además, usaba edificios de Nueva York generados por ordenador, algo muy novedoso para la época.</p>

<h2>Los personajes</h2>
${tmdbFigure('wr2XpWwtaFz0bfELWfSd8ynM2mB', 'Spider-Man frente a Hobgoblin, que vuela en su planeador entre rascacielos', 'Spider-Man frente a Hobgoblin, uno de los muchos villanos clásicos que adaptó la serie.')}
<p>La serie reunió a casi toda la galería clásica: el Buitre, el Escorpión, el Lagarto, Mysterio, el Doctor Octopus, Hobgoblin, el Duende Verde, Venom y Carnage. Por encima de todos estaba ${pj('kingpin-wilson-fisk', 'Kingpin')}, el gran villano en la sombra, con la voz grave de Roscoe Lee Browne. Y entre los aliados, Mary Jane, ${pj('black-cat-felicia-hardy', 'la Gata Negra')} y ${pj('madame-web-cassandra-webb', 'Madame Web')}, clave en las últimas temporadas.</p>

<h2>La censura que la definió</h2>
<p>Las normas de Fox eran estrictísimas. Spider-Man casi no podía dar puñetazos, nadie podía morir en pantalla y las armas eran pistolas láser en lugar de armas de fuego. Cuando la serie necesitó una pérdida trágica, Mary Jane no muere: cae en un portal dimensional.</p>
<p>Paradójicamente, esas restricciones obligaron a los guionistas a construir la tensión con diálogos y consecuencias emocionales, y el resultado fue una serie que se tomaba en serio a sus personajes.</p>

<h2>Las grandes sagas</h2>
${tmdbFigure('bgfCgBpBXz7eQ2Ajz9zlMLyT7FM', 'Spider-Man con el traje negro lanzando una telaraña', 'Spider-Man con el traje negro del simbionte, en una de las sagas más recordadas de la serie.')}
<ul>
  <li><strong>El traje alienígena:</strong> el simbionte llega a la Tierra, se une a Peter y acaba creando a ${pj('venom-eddie-brock', 'Venom')}. Más tarde llega ${pj('carnage-cletus-kasady', 'Carnage')}.</li>
  <li><strong>Las Guerras Secretas:</strong> Spider-Man lidera a un grupo de héroes de Marvel en otro planeta, en una adaptación del evento de 1984.</li>
  <li><strong>Las Guerras Arácnidas (<em>Spider Wars</em>):</strong> el final de la serie reúne a varios Spider-Man de distintas realidades, incluido Scarlet Spider, una idea que se adelantó veinte años al Spider-Verso.</li>
</ul>

<h2>El final inconcluso</h2>
<p>La serie terminó en 1998 con un cabo suelto que nunca se resolvió: Spider-Man parte en busca de Mary Jane, perdida en otra dimensión, acompañado por Madame Web. En ese último episodio, además, conoce a Stan Lee en persona. Ese final abierto sigue siendo la gran herida de la serie, y la razón por la que muchos fans pidieron durante años una continuación.</p>

<h2>Su legado</h2>
<p>Treinta años después, la serie de 1994 sigue siendo la adaptación más completa del Spider-Man de los cómics clásicos. Su influencia se nota en las series posteriores, como <a href="/blog/spectacular-spider-man-serie-analisis">The Spectacular Spider-Man</a>, y en el propio Spider-Verso. Si quieres ver todas las series del personaje, las tienes en nuestra sección de <a href="/series">series</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuántos episodios tiene la serie de Spider-Man de 1994?</h3>
<p>65 episodios, repartidos en 5 temporadas, entre 1994 y 1998.</p>
<h3>¿Cómo termina la serie de 1994?</h3>
<p>Con Spider-Man partiendo en busca de Mary Jane, perdida en otra dimensión. Nunca hubo continuación oficial.</p>
<h3>¿Quién pone la voz a Spider-Man?</h3>
<p>En la versión original, Christopher Daniel Barnes.</p>
`,
};

const SPECTACULAR = {
  slug: 'spectacular-spider-man-serie-analisis',
  title: 'The Spectacular Spider-Man (2008), análisis: la serie cancelada demasiado pronto',
  subtitle: 'Greg Weisman, un Peter Parker adolescente, el Duende Verde y Venom: por qué los fans siguen pidiendo una tercera temporada',
  excerpt:
    'The Spectacular Spider-Man solo duró dos temporadas, pero muchos fans la consideran la mejor serie animada del personaje. Analizamos su estilo, sus personajes, sus villanos y su cancelación.',
  readTime: '9 min',
  seoTitle: 'The Spectacular Spider-Man (2008): análisis de la serie',
  seoDescription:
    'Análisis de The Spectacular Spider-Man (2008) de Greg Weisman: sus 26 episodios, su estilo visual, el Duende Verde, Venom, sus villanos y por qué se canceló.',
  keywords: ['The Spectacular Spider-Man', 'Spectacular Spider-Man serie', 'Spectacular Spider-Man temporada 3', 'Greg Weisman', 'serie animada Spider-Man 2008', 'El Espectacular Spider-Man'],
  tags: ['análisis', 'series', 'animación', 'Greg Weisman', 'Venom', 'Duende Verde'],
  content: `
<p>En 2008, Greg Weisman, creador de <em>Gargoyles</em>, estrenó ${serie('el-espectacular-spiderman', 'The Spectacular Spider-Man')} con una idea clara: contar la historia de un Peter Parker adolescente con la profundidad de una buena serie de televisión. En solo 26 episodios construyó algo extraordinario… y entonces la serie se canceló. Más de quince años después, los fans siguen pidiendo su regreso.</p>

<h2>Ficha rápida</h2>
<table>
  <tbody>
    <tr><td><strong>Emisión</strong></td><td>2008-2009 (primera temporada en The CW; segunda en Disney XD)</td></tr>
    <tr><td><strong>Episodios</strong></td><td>26, en 2 temporadas</td></tr>
    <tr><td><strong>Creadores de la serie</strong></td><td>Greg Weisman y Victor Cook</td></tr>
    <tr><td><strong>Voz original de Peter</strong></td><td>Josh Keaton</td></tr>
  </tbody>
</table>

<h2>El diseño: menos es más</h2>
${tmdbFigure('oTxEsie330VbVYTEJFqRahw2CkC', 'Spider-Man en el centro, rodeado de los rostros en gris de los personajes de la serie', 'Spider-Man rodeado del reparto de la serie: su estilo de líneas limpias fue polémico al principio.')}
<p>El estilo visual provocó polémica antes del estreno: personajes estilizados, líneas limpias y diseños sencillos. Muchos fans lo criticaron sin haber visto un solo episodio, y se equivocaron. La sencillez era una decisión pensada: permitía una animación muy fluida, con mucha expresividad en las caras y unas escenas de acción ágiles y fáciles de seguir.</p>

<h2>Un Peter Parker con capas</h2>
<p>La serie arranca con Peter en su primer año como Spider-Man y en el instituto Midtown, y cuida por igual sus dos vidas: los problemas del instituto afectan a Spider-Man, y lo que aprende con el traje cambia cómo se relaciona con sus compañeros. Gwen Stacy, Harry Osborn, Liz Allan y Flash Thompson tienen arcos propios, y cada episodio planta semillas que dan fruto muchos capítulos después, al estilo de las mejores etapas de los cómics.</p>

<h2>Los villanos</h2>
${tmdbFigure('lZVfy6EQ8YTVwCeFyElXeDbEL8W', 'Spider-Man esquivando al Lagarto entre rascacielos', 'Spider-Man contra el Lagarto: la serie dio a cada villano clásico una versión muy cuidada.')}
<p>La galería de villanos es amplísima: el Buitre, Electro, el ${pj('lizard-curtis-connors', 'Lagarto')}, el Hombre de Arena, Rino, ${pj('shocker-herman-schultz', 'Shocker')}, Mysterio, el Escorpión y un misterioso jefe del crimen, el Big Man, cuya identidad es una de las sorpresas de la serie. Por encima de todos está el Duende Verde, y la revelación de quién se esconde tras su máscara es uno de los mejores giros de cualquier serie de Spider-Man.</p>
${tmdbFigure('6rzoUOEkOVxB6EXHp0EgeNd4tke', 'Spider-Man con el traje negro colgado entre rascacielos', 'Spider-Man con el traje negro: la serie adaptó la llegada del simbionte y el nacimiento de Venom.')}
<p>La serie también adaptó la llegada del simbionte: Peter usa el traje negro, se libra de él y da pie al nacimiento de Venom, con Eddie Brock como amigo de la infancia de Peter.</p>

<h2>Una cancelación injusta</h2>
<p>Cuando Disney compró Marvel en 2009, los derechos de animación de Spider-Man se complicaron y la serie no se renovó. Greg Weisman ha contado en muchas entrevistas que tenía planeadas más temporadas y que sabía hacia dónde iba la historia. Que los fans sigan pidiendo una tercera temporada tantos años después es la mejor prueba de su calidad.</p>

<h2>¿Por qué verla hoy?</h2>
<p>Porque es la serie que mejor entiende al Peter Parker adolescente, con una historia continua que se disfruta de principio a fin. Si te gustó, prueba también la <a href="/blog/spider-man-animated-series-1994-analisis">serie animada de 1994</a>, la gran referencia de los 90, o descubre todas las series del personaje en nuestra sección de <a href="/series">series</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuántas temporadas tiene The Spectacular Spider-Man?</h3>
<p>Dos temporadas, con 26 episodios en total.</p>
<h3>¿Habrá temporada 3 de The Spectacular Spider-Man?</h3>
<p>No hay ningún anuncio oficial. La serie se canceló en 2009 por la situación de los derechos tras la compra de Marvel por Disney.</p>
<h3>¿Quién creó la serie?</h3>
<p>Greg Weisman y Victor Cook.</p>
`,
};

const POSTS = [MEJORES_JUEGOS, MEJORES_VILLANOS, SPIDERMAN_PS4, SPIDERMAN_2_PS5, NO_WAY_HOME, UN_NUEVO_UNIVERSO, CRUZANDO_EL_MULTIVERSO, SPIDER_MAN_2, MILES_MORALES_JUEGO, AMAZING_2012, ULTIMA_CACERIA, SUPERIOR, ULTIMATE_BENDIS, SIMBIONTE, PETER_VS_MILES, GUIA_COMICS, SERIE_1994, SPECTACULAR];

(async () => {
  for (const { slug, ...data } of POSTS) {
    const r = await prisma.blogPost.update({ where: { slug }, data });
    console.log('ok', r.slug, `(${data.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} palabras)`);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
