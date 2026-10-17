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

const POSTS = [MEJORES_JUEGOS, MEJORES_VILLANOS];

(async () => {
  for (const { slug, ...data } of POSTS) {
    const r = await prisma.blogPost.update({ where: { slug }, data });
    console.log('ok', r.slug, `(${data.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} palabras)`);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
