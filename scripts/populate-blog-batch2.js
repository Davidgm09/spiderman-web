/**
 * Añade 5 nuevos artículos al blog (1 por categoría)
 * Uso: node scripts/populate-blog-batch2.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const NEW_POSTS = [
  // ─── PELÍCULAS ────────────────────────────────────────────────────────────────
  {
    title: 'Spider-Man: Into the Spider-Verse — La revolución que cambió la animación para siempre',
    subtitle: 'Cómo Sony redefinió lo que puede ser una película de animación',
    excerpt: 'Into the Spider-Verse no solo es la mejor película de Spider-Man: es una obra maestra técnica y narrativa que cambió las reglas del cine de animación.',
    category: 'Películas',
    author: 'Redacción Spider-Web',
    readTime: '9 min',
    publishDate: new Date('2025-07-15'),
    slug: 'spider-man-into-the-spider-verse-analisis-revolucion-animacion',
    image: 'https://image.tmdb.org/t/p/w1280/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    seoTitle: 'Spider-Man: Into the Spider-Verse — La revolución de la animación | Spider-World',
    seoDescription: 'Análisis de Spider-Man: Into the Spider-Verse, la película de animación que ganó el Oscar y redefinió el cine de superhéroes con Miles Morales.',
    keywords: ['Into the Spider-Verse', 'Miles Morales', 'animación', 'Oscar', 'Spider-Verse', 'Sony'],
    tags: ['Into the Spider-Verse', 'Miles Morales', 'animación', 'Sony Pictures Animation'],
    content: `
<p><em>Spider-Man: Into the Spider-Verse</em> (2018) no debería haber funcionado. Era una película de animación de Spider-Man protagonizada por un personaje poco conocido para el gran público, con un estilo visual experimental y sin actores de renombre detrás del proyecto. Ganó el Oscar a Mejor Película de Animación. Y lo merecía.</p>

<h2>Miles Morales como protagonista definitivo</h2>
<p>La gran apuesta de Into the Spider-Verse fue poner a Miles Morales en el centro de la historia. A diferencia de Peter Parker, Miles no es un chico blanco de clase media de Queens: es afrolatino, de Brooklyn, con una familia unida y un talento para el arte que define su personalidad mucho antes de que la araña radioactiva aparezca.</p>

<p>El resultado es que la película puede explorar el arquetipo de Spider-Man desde un ángulo nuevo. "Cualquiera puede ser Spider-Man" no es un slogan vacío en este film: es la tesis central que se demuestra con cada personaje del multiverso que aparece en pantalla.</p>

<figure>
  <img src="https://image.tmdb.org/t/p/w780/9xfDWXAUbFXQK585JvByT5pEAhe.jpg" alt="Spider-Man: Into the Spider-Verse — Miles Morales" />
  <figcaption>Miles Morales en la escena del salto de fe: el momento más icónico de toda la saga Spider-Verse.</figcaption>
</figure>

<h2>Una revolución técnica</h2>
<p>El estilo visual de Into the Spider-Verse es inconfundible: combina las tramas de puntos del cómic impreso, los onomatopeyas en pantalla, los fondos pintados con textura y las animaciones a 12 fotogramas por segundo (en lugar de los 24 estándar) para crear un look que parece literalmente un cómic en movimiento.</p>

<p>Este no fue un accidente: el equipo de Sony Animation pasó años desarrollando la técnica, con directores de arte como Justin K. Thompson definiendo una estética que ninguna otra película ha podido replicar completamente.</p>

<h2>El legado</h2>
<p>Into the Spider-Verse no solo lanzó la saga Spider-Verse —con <em>Across the Spider-Verse</em> como secuela igualmente brillante— sino que cambió las expectativas del cine de animación en general. Después de esta película, ya no es suficiente con que algo "se vea bien". Tiene que tener una identidad visual propia.</p>

<p>Si solo vas a ver una película de Spider-Man en tu vida, que sea esta.</p>
`,
  },

  // ─── CÓMICS ───────────────────────────────────────────────────────────────────
  {
    title: 'Kraven\'s Last Hunt: la historia más oscura jamás contada de Spider-Man',
    subtitle: 'Por qué el arco de J.M. DeMatteis sigue siendo insuperable 40 años después',
    excerpt: 'Kraven\'s Last Hunt (1987) es el arco más oscuro y literario de Spider-Man: un estudio sobre la muerte, la identidad y la obsesión que trasciende el género.',
    category: 'Cómics',
    author: 'Redacción Spider-Web',
    readTime: '8 min',
    publishDate: new Date('2025-08-10'),
    slug: 'kravens-last-hunt-analisis-mejor-arco-spider-man',
    image: 'https://comicvine.gamespot.com/a/uploads/scale_medium/0/4/11878-2127-13263-1-spider-man-blue.jpg',
    seoTitle: 'Kraven\'s Last Hunt: el arco más oscuro de Spider-Man | Spider-World',
    seoDescription: 'Análisis de Kraven\'s Last Hunt (1987), el arco de J.M. DeMatteis considerado la historia más oscura y literaria jamás escrita sobre Spider-Man.',
    keywords: ['Kraven\'s Last Hunt', 'J.M. DeMatteis', 'Kraven el cazador', 'arco cómic', 'Spider-Man 1987'],
    tags: ['Kraven', 'DeMatteis', 'cómic', 'clásico', 'Spider-Man'],
    content: `
<p>En 1987, J.M. DeMatteis y Mike Zeck publicaron una historia de seis números que cambió para siempre lo que podía ser un cómic de Spider-Man. <em>Kraven's Last Hunt</em> no era una aventura de acción: era un estudio psicológico sobre la muerte, la identidad y el vacío existencial de un hombre que había dedicado su vida a una obsesión sin sentido.</p>

<h2>La premisa</h2>
<p>Kraven el Cazador, uno de los villanos más veteranos de Spider-Man, ha pasado décadas persiguiendo al trepamuros sin conseguir vencerlo. En esta historia, decide terminar de una vez: dispara a Spider-Man, lo da por muerto y lo entierra. Luego se pone el traje y finge ser Spider-Man durante dos semanas.</p>

<p>Lo que hace DeMatteis con esta premisa es extraordinario: la historia no es sobre Spider-Man siendo derrotado. Es sobre un hombre roto que busca paz en el único acto que cree que puede darle sentido a su vida.</p>

<figure>
  <img src="https://comicvine.gamespot.com/a/uploads/scale_medium/6/67663/6029655-01.jpg" alt="Portada Kraven's Last Hunt TPB" />
  <figcaption>La portada del TPB de Kraven's Last Hunt: una de las más icónicas de la historia del cómic de superhéroes.</figcaption>
</figure>

<h2>Por qué es insuperable</h2>
<p>La prosa de DeMatteis es inusualmente literaria para un cómic de superhéroes de los años 80. Cita a Dostoyevski. Explora el inconsciente de Kraven con secuencias oníricas. Y cuando llega el final —que no desvelaremos aquí— el impacto emocional es devastador precisamente porque la historia se ha tomado el tiempo de hacerte entender a su villano.</p>

<p>Zeck y el entintador Bob McLeod hacen el resto: las páginas de Kraven bajo la lluvia, con el traje de Spider-Man manchado de barro, son algunas de las más impactantes del cómic estadounidense.</p>

<h2>Cómo leerlo</h2>
<p>El arco está recopilado en un único TPB fácil de encontrar. Si quieres una sola historia de cómic de Spider-Man, esta es la más cercana a la literatura seria que encontrarás en el género.</p>
`,
  },

  // ─── VIDEOJUEGOS ──────────────────────────────────────────────────────────────
  {
    title: 'Spider-Man PS4 (2018): el juego que demostró que los superhéroes merecen mejores videojuegos',
    subtitle: 'Cómo Insomniac Games redefinió el estándar para los juegos de superhéroes',
    excerpt: 'Marvel\'s Spider-Man (2018) de Insomniac no solo es el mejor juego de Spider-Man: demostró que una historia de superhéroes puede ser tan madura y emotiva como cualquier otro género.',
    category: 'Videojuegos',
    author: 'Redacción Spider-Web',
    readTime: '10 min',
    publishDate: new Date('2025-09-05'),
    slug: 'marvels-spider-man-ps4-2018-analisis-insomniac',
    image: 'https://media.rawg.io/media/games/9aa/9aa42d16d425fa6f179fc9dc2f763647.jpg',
    seoTitle: 'Marvel\'s Spider-Man (2018) análisis completo — El mejor juego de superhéroes | Spider-World',
    seoDescription: 'Análisis completo de Marvel\'s Spider-Man (2018) de Insomniac Games para PS4: jugabilidad, historia, gráficos y por qué redefinió los juegos de superhéroes.',
    keywords: ['Spider-Man PS4', 'Insomniac Games', 'Marvel Spider-Man 2018', 'análisis', 'juego superhéroes'],
    tags: ['Spider-Man PS4', 'Insomniac', '2018', 'análisis', 'PS4'],
    content: `
<p>Cuando <em>Marvel's Spider-Man</em> llegó a PS4 en septiembre de 2018, el listón para los juegos de superhéroes era relativamente bajo. Los Batman Arkham eran la excepción, no la regla. Insomniac Games no solo igualó esa referencia: la superó en aspectos clave.</p>

<h2>El balanceo que lo cambia todo</h2>
<p>El primer gran logro del juego es el sistema de balanceo. En Spider-Man (2018), lanzarse entre rascacielos de Manhattan nunca se vuelve rutinario: cada salto requiere atención, cada arco tiene peso físico, y el juego te premia por encadenar movimientos con elegancia. Es el mejor sistema de desplazamiento de cualquier juego de mundo abierto.</p>

<figure>
  <img src="https://media.rawg.io/media/screenshots/a15/a15b42bd8a652a3733c6ad419ebb24bd.jpg" alt="Spider-Man PS4 — balanceo por Manhattan" />
  <figcaption>Balancear por Manhattan en Spider-Man PS4 sigue siendo, años después, una de las experiencias más satisfactorias del gaming.</figcaption>
</figure>

<h2>Una historia adulta</h2>
<p>El Peter Parker de Insomniac tiene 23 años y lleva ocho siendo Spider-Man. No es el adolescente inseguro de los cómics clásicos ni el universitario del MCU: es un adulto que equilibra mal el trabajo, las relaciones y el heroísmo. Esta versión madura permite una historia con stakes emocionales reales.</p>

<p>Sin spoilers: el tercer acto del juego se atreve a algo que pocas historias de superhéroes hacen. Las consecuencias son permanentes y dolorosas, y el juego te las hace sentir.</p>

<h2>El legado</h2>
<p>Spider-Man (2018) vendió más de 33 millones de copias y generó un universo propio que incluye <em>Miles Morales</em> y <em>Spider-Man 2</em>. Pero su verdadero legado es haber demostrado que un juego de superhéroes puede tener la misma ambición narrativa que los mejores RPGs o juegos de aventura.</p>
`,
  },

  // ─── SERIES ───────────────────────────────────────────────────────────────────
  {
    title: 'Spider-Man: The New Animated Series (2003) — La serie MTV que nadie recuerda pero todos deberían ver',
    subtitle: 'Una producción adulta, oscura y mal distribuida que merece reivindicación',
    excerpt: 'La serie de MTV de 2003 con Neil Patrick Harris como Spider-Man fue demasiado adulta para su época, tuvo mala distribución y fue cancelada tras una temporada. Es hora de reivindicarla.',
    category: 'Series',
    author: 'Redacción Spider-Web',
    readTime: '7 min',
    publishDate: new Date('2025-10-01'),
    slug: 'spider-man-new-animated-series-2003-mtv-analisis',
    image: 'https://image.tmdb.org/t/p/w780/dCNxOhXT7c4lqYuRpdM3m8s9XDp.jpg',
    seoTitle: 'Spider-Man: The New Animated Series (2003) MTV — La serie olvidada | Spider-World',
    seoDescription: 'Análisis de Spider-Man: The New Animated Series (2003), la serie de MTV con Neil Patrick Harris que fue demasiado adulta para su tiempo y merece ser reivindicada.',
    keywords: ['Spider-Man 2003', 'MTV', 'Neil Patrick Harris', 'serie animada', 'CGI', 'New Animated Series'],
    tags: ['Spider-Man 2003', 'MTV', 'Neil Patrick Harris', 'serie animada'],
    content: `
<p>En 2003, MTV y Sony lanzaron una serie de Spider-Man completamente en CGI, con guiones adultos, una estética oscura influenciada por la película de Sam Raimi y la voz de Neil Patrick Harris como Peter Parker. Duró una temporada de 13 episodios. Casi nadie la recuerda. Es un error.</p>

<h2>Una estética diferente</h2>
<p>El CGI de 2003 no ha envejecido bien — seamos honestos — pero la dirección artística sí. La serie optó por Nueva York nocturno, colores apagados y diseños de personajes más estilizados que cualquier otra adaptación animada. Era claramente una producción pensada para adolescentes y adultos jóvenes, no para niños de seis años.</p>

<figure>
  <img src="https://image.tmdb.org/t/p/w780/cQ6xp4mBPrTf6hfWbdFeEqeROpe.jpg" alt="Spider-Man New Animated Series 2003" />
  <figcaption>El estilo visual de la serie de MTV apostaba por un Spider-Man más oscuro y adulto que sus predecesoras animadas.</figcaption>
</figure>

<h2>Guiones valientes</h2>
<p>La serie adaptó arcos de cómic con una fidelidad inusual para producciones de esta época, e introdujo elementos de las relaciones sentimentales de Peter Parker con una madurez que la serie de 1994 nunca se permitió. El episodio final, en particular, tiene un giro que pocas series infantojuveniles se habrían atrevido a hacer.</p>

<h2>Por qué no funcionó</h2>
<p>MTV no sabía muy bien qué hacer con ella. La distribución fue irregular, la audiencia objetivo nunca quedó clara y el CGI generó rechazo inicial en fans acostumbrados a la animación tradicional. Sony no renovó para una segunda temporada.</p>

<p>Hoy se puede ver en streaming. Si eres fan de Spider-Man y tienes curiosidad por una versión que intentó algo diferente, merece una oportunidad.</p>
`,
  },

  // ─── ANÁLISIS ─────────────────────────────────────────────────────────────────
  {
    title: 'Por qué Spider-Man es el mejor personaje de Marvel — y probablemente de los cómics',
    subtitle: 'El análisis definitivo de qué hace a Peter Parker único entre todos los superhéroes',
    excerpt: 'Spider-Man lleva más de 60 años siendo el personaje más querido de Marvel. No es casualidad: hay razones estructurales por las que funciona mejor que cualquier otro superhéroe.',
    category: 'Análisis',
    author: 'Redacción Spider-Web',
    readTime: '11 min',
    publishDate: new Date('2025-11-15'),
    slug: 'por-que-spider-man-es-el-mejor-personaje-marvel',
    image: 'https://image.tmdb.org/t/p/w1280/zD5v1E4joAzFvmAEytt7fM3ivyT.jpg',
    seoTitle: 'Por qué Spider-Man es el mejor personaje de Marvel | Spider-World',
    seoDescription: 'Análisis en profundidad de por qué Spider-Man es el superhéroe más querido y mejor construido de Marvel, desde su origen hasta el multiverso actual.',
    keywords: ['Spider-Man', 'mejor superhéroe', 'Marvel', 'Peter Parker', 'análisis', 'personaje'],
    tags: ['Spider-Man', 'análisis', 'Peter Parker', 'Marvel', 'superhéroes'],
    content: `
<p>Si tuvieras que elegir un solo personaje para representar todo lo que puede ser un superhéroe de cómic — la fantasía de poder, la responsabilidad moral, el coste personal del heroísmo, el humor como mecanismo de defensa — ese personaje sería Spider-Man. No es opinión: es una conclusión a la que llegas si analizas la estructura del personaje con cierta frialdad.</p>

<h2>La identidad dual más creíble del cómic</h2>
<p>Superman es Clark Kent disfrazado de superhéroe. Batman es Bruce Wayne disfrazado de vigilante. Pero Peter Parker <em>es</em> Spider-Man: no hay una identidad verdadera y una falsa. El traje no cambia quién es Peter; simplemente le permite ser quien ya era sin consecuencias para las personas que quiere.</p>

<p>Esta dualidad —el chico normal con poderes extraordinarios— es la que hace que el personaje sea universalmente identificable. No necesitas ser huérfano multimillonario ni el último hijo de un planeta muerto. Necesitas haber sido el raro de la clase. Y eso sí que lo entiende casi todo el mundo.</p>

<figure>
  <img src="https://image.tmdb.org/t/p/w1280/ac0kRKTfiJ4GcoUfb0XIO5vgC8q.jpg" alt="Spider-Man Tom Holland MCU" />
  <figcaption>Spider-Man en el MCU: cada generación tiene su versión del personaje porque la esencia del personaje trasciende cualquier actor o adaptación.</figcaption>
</figure>

<h2>La responsabilidad como motor narrativo</h2>
<p>"Un gran poder conlleva una gran responsabilidad." Es la frase más citada de los cómics de superhéroes, y por buenas razones: define un personaje cuya motivación no es la venganza, la gloria ni el deber abstracto. Es la culpa. Peter Parker se convierte en Spider-Man porque no actuó cuando debía, y eso tuvo consecuencias irreversibles.</p>

<p>Esa culpa no desaparece con el tiempo: se convierte en el combustible de todas sus decisiones. No puede dejar de ser Spider-Man porque dejar de serlo significaría admitir que el sacrificio de Ben Parker no valió nada.</p>

<h2>La galería de villanos</h2>
<p>Spider-Man tiene la mejor colección de antagonistas del cómic porque cada uno de sus villanos es, de alguna forma, una versión distorsionada de Peter Parker: el genio que eligió el camino equivocado (Doctor Octopus), el científico destruido por su propia ambición (el Lagarto), el hombre común radicalizado por el resentimiento (Electro). Luchar contra sus enemigos no es solo acción: es mirarse en un espejo.</p>

<h2>La conclusión</h2>
<p>Spider-Man lleva más de 60 años en publicación continua porque el personaje está construido sobre verdades emocionales que no caducan. La culpa, la responsabilidad, el sacrificio, el humor como escudo. Pueden cambiar el actor, el universo o el traje. El personaje siempre funciona.</p>
`,
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const post of NEW_POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (exists) {
      console.log(`  ⏭  Omitido (ya existe): ${post.title}`);
      skipped++;
      continue;
    }

    await prisma.blogPost.create({
      data: {
        ...post,
        keywords: post.keywords,
        tags: post.tags,
        views: 0,
        isPublished: true,
      },
    });

    console.log(`  ✅ Creado: ${post.title}`);
    created++;
  }

  console.log(`\n✨ Listo. ${created} artículos creados, ${skipped} omitidos.`);
  await prisma.$disconnect();
}

main().catch(console.error);
