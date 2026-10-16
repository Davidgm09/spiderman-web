/**
 * Actualiza tres artículos de noticias que habían quedado desfasados tras el estreno de Brand New Day
 * (mantiene slug y visitas). Datos verificados a 16/10/2026: Wikipedia, Variety, BGR, Animation Magazine.
 * Uso: node scripts/update-blog-noticias-2026.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const UPDATED = '<p><em>Actualizado el 16 de octubre de 2026.</em></p>';

const POSTS = [
  {
    slug: 'spider-man-4-tom-holland-noticias',
    title: 'Spider-Man 4 ya tiene nombre: Brand New Day — todo lo que hay que saber',
    subtitle: 'La cuarta película de Tom Holland ya se ha estrenado. Qué es, cómo le ha ido y qué viene después',
    excerpt:
      'Durante años la llamamos Spider-Man 4, pero su título es Brand New Day y ya ha pasado por los cines. Repasamos ficha, resultados y si habrá una quinta película.',
    category: 'Noticias',
    readTime: '5 min',
    publishDate: new Date('2026-10-16'),
    image: 'https://image.tmdb.org/t/p/w1280/vjMvFSmGUxEtqVdaZgvFee9XkZl.jpg',
    seoTitle: 'Spider-Man 4: es Brand New Day — estreno, reparto y Spider-Man 5',
    seoDescription:
      'Spider-Man 4 se llama Brand New Day y ya se ha estrenado: director, reparto, taquilla récord y todo lo que se sabe de una posible quinta película de Tom Holland.',
    keywords: ['Spider-Man 4', 'Brand New Day', 'Tom Holland', 'Spider-Man 5', 'MCU', 'Destin Daniel Cretton'],
    tags: ['Spider-Man 4', 'Brand New Day', 'Tom Holland', 'MCU', 'noticias'],
    content: `
${UPDATED}

<p>Durante años, la cuarta película de Tom Holland como Peter Parker fue simplemente <em>Spider-Man 4</em>. En marzo de 2025, Sony y Marvel Studios desvelaron su título oficial: <strong><em>Spider-Man: Brand New Day</em></strong>. Se estrenó en cines a finales de julio de 2026 y, como ya sabrás, ha sido un fenómeno. Si llegaste aquí buscando «Spider-Man 4», esto es todo lo que necesitas saber.</p>

<h2>Ficha rápida</h2>
<ul>
  <li><strong>Director:</strong> Destin Daniel Cretton (<em>Shang-Chi y la leyenda de los Diez Anillos</em>), que se incorporó al proyecto en otoño de 2024.</li>
  <li><strong>Guion:</strong> Chris McKenna y Erik Sommers, guionistas de las tres películas anteriores.</li>
  <li><strong>Reparto:</strong> Tom Holland, Zendaya, Jacob Batalon, Sadie Sink, Jon Bernthal, Florence Pugh, Mark Ruffalo, Marisa Tomei y Tramell Tillman.</li>
  <li><strong>Rodaje:</strong> de agosto a diciembre de 2025, en Glasgow y distintas localizaciones de Inglaterra, bajo el nombre en clave <em>Blue Oasis</em>.</li>
  <li><strong>Duración:</strong> 145 minutos. <strong>Presupuesto:</strong> unos 225 millones de dólares.</li>
</ul>

<h2>¿De qué va?</h2>
<p>La película arranca cuatro años después de <em>No Way Home</em>. El mundo sigue sin recordar quién es Peter Parker, que vive solo y se dedica por completo a proteger Nueva York a pie de calle. La presión y el agotamiento provocan una evolución de sus poderes justo cuando surge una nueva amenaza. Las quinielas sobre villanos y cameos fueron cambiando hasta el último momento; si quieres verla sin destripes, no te contaremos más.</p>

<h2>Un éxito histórico</h2>
<p>Los números hablan solos: más de <strong>2.500 millones de dólares</strong> en todo el mundo, el <strong>mayor estreno de la historia en EE. UU.</strong> (360 millones en su primer fin de semana) y la película de Spider-Man más taquillera de siempre. La crítica también la ha respaldado, con un 90% de reseñas positivas en Rotten Tomatoes y una «A» del público en CinemaScore. Lo repasamos con detalle en nuestro <a href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers">análisis sin spoilers de Brand New Day</a>.</p>

<h2>¿Habrá Spider-Man 5?</h2>
<p>De momento, <strong>no hay quinta película anunciada</strong>. Esto es lo que se ha dicho tras el estreno:</p>
<ul>
  <li>Tom Rothman, de Sony, asegura que todavía no ha habido conversaciones concretas para el regreso de Holland en una quinta entrega.</li>
  <li>Kevin Feige explica que Holland y Zendaya se tomarán un descanso antes de confirmar nuevos planes.</li>
  <li>El propio Tom Holland ha dicho que seguirá siendo Spider-Man «mientras le quieran».</li>
  <li>Destin Daniel Cretton se ha mostrado abierto a dirigir otra película.</li>
</ul>
<p>Lo que sí deja claro la propia película, en su escena poscréditos, es que <strong>Spider-Man volverá</strong>. Dónde y cuándo es otra historia: te lo contamos en <a href="/blog/futuro-spider-man-mcu-despues-brand-new-day">el futuro de Spider-Man en el MCU</a>.</p>

<p>Y si quieres los datos completos de la película, consulta <a href="/peliculas/spider-man-brand-new-day-2026">su ficha</a>.</p>
`,
  },

  {
    slug: 'futuro-spider-man-mcu-despues-brand-new-day',
    title: 'El futuro de Spider-Man en el MCU después de Brand New Day',
    subtitle: 'Spider-Man 5, los Vengadores y Miles Morales: lo que sabemos tras el estreno',
    excerpt:
      'Brand New Day ha arrasado en taquilla, pero no hay quinta película anunciada. ¿Volverá Tom Holland en Vengadores? ¿Cuándo llega Miles Morales en imagen real? Lo que han dicho Marvel y Sony.',
    category: 'Noticias',
    readTime: '6 min',
    publishDate: new Date('2026-10-16'),
    seoTitle: 'El futuro de Spider-Man en el MCU tras Brand New Day',
    seoDescription:
      'Qué viene después de Brand New Day: Spider-Man 5, el posible regreso de Tom Holland en Vengadores: Secret Wars y la llegada de Miles Morales en imagen real.',
    keywords: ['futuro Spider-Man MCU', 'Spider-Man 5', 'Tom Holland', 'Avengers Secret Wars', 'Miles Morales imagen real', 'Brand New Day'],
    tags: ['MCU', 'Tom Holland', 'futuro', 'Brand New Day', 'Miles Morales', 'Marvel'],
    content: `
${UPDATED}

<p><em>Spider-Man: Brand New Day</em> se ha convertido en la película más taquillera de la historia del personaje y en uno de los mayores éxitos del MCU. Con un resultado así, la pregunta es inevitable: ¿qué viene ahora para Peter Parker? Esto es lo que se sabe —y lo que no— a octubre de 2026.</p>

<h2>Lo que han dicho Marvel y Sony</h2>
<p>Por ahora, ninguna de las dos compañías ha anunciado una nueva película de Tom Holland. Tom Rothman, de Sony, ha reconocido que todavía no ha habido conversaciones concretas sobre una quinta entrega, y Kevin Feige ha explicado que Holland y Zendaya se tomarán un descanso antes de confirmar planes.</p>
<p>Eso no significa que no haya ideas: según Feige, él y Amy Pascal ya han hablado de propuestas para las <strong>próximas cinco películas de Spider-Man en imagen real</strong>. Y Holland lo tiene claro: seguirá con el traje «mientras le quieran». Pascal ya avanzó en 2021 que la siguiente película de Holland —la que acabó siendo <em>Brand New Day</em>— se planteaba como el inicio de una nueva trilogía.</p>

<h2>¿Volverá en Vengadores?</h2>
<p>La escena poscréditos de <em>Brand New Day</em> lo deja claro: <strong>Spider-Man volverá</strong>. Las dos grandes citas en el horizonte son:</p>
<ul>
  <li><strong><em>Vengadores: Doomsday</em></strong> (18 de diciembre de 2026): Tom Holland <strong>no figura</strong> en el reparto anunciado.</li>
  <li><strong><em>Vengadores: Secret Wars</em></strong> (17 de diciembre de 2027): varios rumores sitúan a Holland en el rodaje, aunque con poca disponibilidad por su agenda. Ni Marvel ni Sony lo han confirmado.</li>
</ul>
<p>Con lo que se sabe hoy, <em>Secret Wars</em> es la apuesta más probable para el próximo regreso de Peter Parker, pero conviene tomarlo como lo que es: un rumor.</p>

<h2>Miles Morales, en imagen real</h2>
<p>La otra gran noticia es que <strong>Feige ha confirmado que Miles Morales llegará a la imagen real</strong>, después de <em>Spider-Man: Beyond the Spider-Verse</em>, la última película de la trilogía animada, que se estrena en junio de 2027.</p>
<p>El MCU ya dejó una pista hace años: en <em>Spider-Man: Homecoming</em> (2017), Aaron Davis —interpretado por Donald Glover y que en los cómics es el tío de Miles— menciona a su sobrino que vive en el barrio. Cuándo y cómo aparecerá Miles, y si compartirá pantalla con el Peter de Holland, está por ver.</p>

<h2>Un Spider-Man para la próxima década</h2>
<p><em>Brand New Day</em> ha funcionado como un reinicio emocional del personaje: un Peter adulto, solo y sin red de seguridad. Es un punto de partida con mucho recorrido, y el éxito de la película da a Marvel y Sony todos los motivos para seguir. Si quieres repasar cómo hemos llegado hasta aquí, lee nuestro <a href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers">análisis sin spoilers de Brand New Day</a>.</p>
`,
  },

  {
    slug: 'beyond-spider-verse-actualizacion-2025',
    title: 'Beyond the Spider-Verse: fecha de estreno, tráiler y todo lo que sabemos',
    subtitle: 'El final de la trilogía de Miles Morales ya tiene fecha: junio de 2027',
    excerpt:
      'Tras años de retrasos, Spider-Man: Beyond the Spider-Verse ya tiene fecha: 18 de junio de 2027 en EE. UU. Repasamos su historia, el equipo, qué pasa con el tráiler y qué esperar.',
    category: 'Noticias',
    readTime: '5 min',
    publishDate: new Date('2026-10-16'),
    image: 'https://image.tmdb.org/t/p/w1280/7tT2w75p69nll5PvALpWFCYx5dU.jpg',
    seoTitle: 'Beyond the Spider-Verse: fecha de estreno, tráiler y novedades',
    seoDescription:
      'Spider-Man: Beyond the Spider-Verse se estrena el 18 de junio de 2027 en EE. UU. Directores, retrasos, el estado del tráiler y todo lo que sabemos del final de la trilogía.',
    keywords: ['Beyond the Spider-Verse', 'fecha de estreno', 'Miles Morales', 'Spider-Verse 3', 'tráiler', 'Sony Pictures Animation'],
    tags: ['Beyond the Spider-Verse', 'Miles Morales', 'Sony Animation', 'noticias', '2027'],
    content: `
${UPDATED}

<p><em>Spider-Man: Across the Spider-Verse</em> terminó en junio de 2023 con uno de los cliffhangers más brutales del cine de animación: Miles Morales atrapado en el universo equivocado, la Mancha (The Spot) convertida en una amenaza para todo el multiverso y la Sociedad Spider persiguiéndole. Más de tres años después, por fin sabemos cuándo veremos el desenlace.</p>

<h2>Fecha de estreno: 18 de junio de 2027</h2>
<p><em>Beyond the Spider-Verse</em> se estrenará en EE. UU. el <strong>18 de junio de 2027</strong>. Para España todavía no hay fecha confirmada, aunque lo habitual es que llegue el mismo fin de semana o muy cerca. En nuestra <a href="/peliculas">sección de películas</a> tienes una cuenta atrás para el estreno.</p>

<h2>Un camino lleno de retrasos</h2>
<p>La película tenía fecha original para el <strong>29 de marzo de 2024</strong>, pero salió del calendario tras las huelgas de Hollywood de 2023. Después se fijó para el 4 de junio de 2027, pasó al 25 de junio y finalmente se adelantó una semana, al 18, coincidiendo con el fin de semana del Día del Padre en EE. UU.</p>

<h2>El equipo</h2>
<p>La dirección corre a cargo de <strong>Bob Persichetti y Justin K. Thompson</strong>, mientras que <strong>Phil Lord y Christopher Miller</strong> vuelven como guionistas y productores, los mismos que impulsaron la saga desde <em>Un nuevo universo</em> (2018).</p>

<h2>¿Y el tráiler?</h2>
<ul>
  <li>En <strong>abril de 2026</strong>, Sony mostró un primer avance en exclusiva en la CinemaCon de Las Vegas, solo para prensa y exhibidores. No se ha publicado.</li>
  <li>En <strong>agosto de 2026</strong> se filtraron en internet unos cuatro minutos y medio de metraje sin terminar. Christopher Miller criticó públicamente la filtración por mostrar animación sin acabar.</li>
  <li>El <strong>primer tráiler oficial</strong> aún no ha salido. Se espera antes de que termine 2026, aunque Sony no ha dado fecha.</li>
</ul>

<h2>Qué esperar</h2>
<p><em>Beyond</em> tiene que cerrar todas las tramas que dejó abiertas <em>Across</em>: el rescate de Miles, el enfrentamiento con la Mancha, el choque con Miguel O'Hara y la Sociedad Spider y el debate sobre los «eventos canónicos» que todo Spider-Man supuestamente debe vivir. Y hay un motivo más para seguirla de cerca: Kevin Feige ha confirmado que, después de esta película, <strong>Miles Morales dará el salto a la imagen real</strong>.</p>

<p>Mientras esperas, repasa nuestro <a href="/blog/across-the-spider-verse-analisis">análisis de Across the Spider-Verse</a> o la <a href="/peliculas/spider-man-cruzando-el-multiverso-2023">ficha de la película</a>.</p>
`,
  },

  {
    // La versión anterior describía detalles que no aparecen en los tráileres (apartamento 4B, una Canon AE-1,
    // un titular en el 0:47, el Golden Gate, el tema de Danny Elfman...). Reescrito con detalles contrastados.
    slug: 'brand-new-day-trailer-easter-eggs-detalles-ocultos',
    title: '10 detalles que probablemente te perdiste en los tráileres de Brand New Day',
    subtitle: 'Guiños a las películas anteriores, a los cómics y pistas sobre lo que estaba por venir',
    excerpt:
      'De la pizzería que recuerda a Spider-Man 2 a la telaraña orgánica de Peter o el regreso del Escorpión: los detalles más interesantes de los tráileres de Spider-Man: Brand New Day.',
    category: 'Análisis',
    readTime: '6 min',
    publishDate: new Date('2026-03-19'),
    seoTitle: '10 detalles ocultos en los tráileres de Brand New Day',
    seoDescription:
      'Los guiños y detalles de los tráileres de Spider-Man: Brand New Day: la telaraña orgánica, el Escorpión, el Departamento de Control de Daños, el Punisher y más.',
    keywords: ['Brand New Day tráiler', 'easter eggs', 'Spider-Man 4', 'Tom Holland', 'detalles ocultos'],
    tags: ['Brand New Day', 'Easter eggs', 'análisis', 'Tom Holland', 'MCU', '2026'],
    content: `
<p><em>Actualizado el 16 de octubre de 2026 con los dos tráileres oficiales: el primero se presentó el 18 de marzo de 2026 desde el Empire State Building y el segundo llegó en junio.</em></p>

<p>Los tráileres de <em>Spider-Man: Brand New Day</em> dejaron mucho más que las grandes revelaciones. Estos son los detalles más interesantes que se escondían en sus planos.</p>

<h2>1. Una pizzería con aire de «Spider-Man 2»</h2>
<p>Uno de los primeros planos muestra el cartel de «Gen's Pizza», con un logotipo circular rojo sobre blanco que recuerda mucho al de Joe's Pizza, el local en el que Peter trabajaba —y del que le despedían— en <a href="/peliculas/spider-man-2-2004">Spider-Man 2</a>.</p>

<h2>2. El regreso del Escorpión</h2>
<p>Mac Gargan, interpretado de nuevo por Michael Mando, vuelve a enfrentarse a Spider-Man con un «¿Me has echado de menos, Spidey?». El personaje no aparecía desde la escena poscréditos de <a href="/peliculas/spider-man-homecoming-2017">Spider-Man: Homecoming</a> (2017).</p>

<h2>3. Telaraña orgánica</h2>
<p>Los lanzarredes de Peter fallan y, en su lugar, la telaraña empieza a salir directamente de sus muñecas. Es la solución que usaron las películas de Sam Raimi con Tobey Maguire, frente a los lanzarredes mecánicos de los cómics clásicos, y una pista de que el cuerpo de Peter está cambiando.</p>

<h2>4. Unos ojos que recuerdan al simbionte</h2>
<p>En algunos planos, los ojos del traje se vuelven rojos y negros, y Peter dice estar «fuera de control». La imagen evoca la etapa del traje simbionte en los cómics, aunque los tráileres apuntan a otra cosa: una transformación del propio Peter.</p>

<h2>5. Ned y MJ, en un vídeo</h2>
<p>Peter ve un vídeo de Ned y MJ, que siguen sin recordarle tras el hechizo de <a href="/peliculas/spider-man-no-way-home-2021">No Way Home</a>. Una imagen que resume la soledad con la que arranca la película.</p>

<h2>6. La sudadera de la Universidad Empire State</h2>
<p>Peter lleva una sudadera de la Universidad Empire State, la universidad de los cómics. En el MCU se mencionó por primera vez en <em>El increíble Hulk</em> (2008).</p>

<h2>7. Bruce Banner, profesor y con inhibidor</h2>
<p>Mark Ruffalo reaparece como un Bruce Banner profesor universitario que lleva un dispositivo para contener a Hulk. Cuando ese inhibidor falla, llega el enfrentamiento, con un Hulk salvaje que usa su clásico «trueno» —el aplauso devastador que ya se vio en <em>El increíble Hulk</em>— contra Spider-Man.</p>

<h2>8. El Departamento de Control de Daños</h2>
<p>Tramell Tillman interpreta a Bill Metzger, al frente del Departamento de Control de Daños. En los cómics, Metzger es un activista antimutante, un detalle que encaja con las pistas sobre mutaciones que dejan los tráileres.</p>

<h2>9. El Punisher, recién llegado de «Daredevil»</h2>
<p>Jon Bernthal vuelve como Frank Castle tras su paso por <em>Daredevil: Born Again</em>, con su inseparable taza de café negro. Tom Holland definió su relación con Spider-Man como algo que pasa de la antipatía mutua a una rivalidad de «hermano mayor y hermano pequeño».</p>

<h2>10. Una figura encapuchada</h2>
<p>Una figura encapuchada, con el rostro oculto, alimentó las teorías sobre el papel de Sadie Sink. Tras el estreno sabemos que interpreta a Jean Grey, uno de los personajes clave de la película.</p>

<p>¿Quieres saber cómo quedó todo esto en la película? Lo contamos en nuestro <a href="/blog/spider-man-brand-new-day-taquilla-criticas-sin-spoilers">análisis sin spoilers de Brand New Day</a>.</p>
`,
  },
];

async function main() {
  for (const post of POSTS) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      console.log(`⚠️  No existe: ${post.slug} (no se crea; este script solo actualiza)`);
      continue;
    }
    const { slug, ...data } = post;
    await prisma.blogPost.update({ where: { slug }, data });
    console.log(`📝 Actualizado: ${post.title}`);
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
