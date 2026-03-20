/**
 * Añade el artículo sobre Marvel's Spider-Man 3 de Insomniac al blog
 * Uso: node scripts/populate-blog-spiderman3.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const POST = {
  title: "Marvel's Spider-Man 3: todo lo que sabemos del próximo juego de Insomniac",
  subtitle: 'El cierre de la trilogía que redefinió los juegos de superhéroes',
  excerpt: "Insomniac Games prepara la entrega final de su trilogía de Spider-Man. Repasamos todo lo que se sabe hasta ahora: historia, personajes, plataformas y posible fecha de lanzamiento.",
  category: 'Videojuegos',
  author: 'Redacción Spider-Web',
  readTime: '7 min',
  publishDate: new Date('2025-03-20'),
  slug: 'marvels-spider-man-3-insomniac-todo-lo-que-sabemos',
  image: '/images/spiderman3.webp',
  seoTitle: "Marvel's Spider-Man 3: fecha, historia y todo lo que sabemos | Spider-World",
  seoDescription: "Todo lo que sabemos sobre Marvel's Spider-Man 3 de Insomniac Games: historia, personajes confirmados, plataformas y posible fecha de lanzamiento en PS5.",
  keywords: ["Marvel's Spider-Man 3", 'Insomniac Games', 'PS5', 'Spider-Man videojuego', 'Peter Parker', 'Miles Morales'],
  tags: ["Spider-Man 3", 'Insomniac', 'PS5', 'videojuego', 'próximamente'],
  content: `
<p>Insomniac Games lo ha vuelto a hacer. Con <em>Marvel's Spider-Man</em> (2018) y <em>Marvel's Spider-Man 2</em> (2023) ya en el catálogo de PS5, la pregunta que todos los fans del trepamuros llevan meses haciéndose es la misma: ¿qué viene después? Todo apunta a que la respuesta es <em>Marvel's Spider-Man 3</em>, la entrega que cerrará una de las trilogías más aclamadas en la historia de los videojuegos de superhéroes.</p>

<h2>El estado de la trilogía hasta ahora</h2>
<p>Para entender hacia dónde puede ir la tercera entrega, conviene hacer balance. <em>Marvel's Spider-Man</em> estableció un Peter Parker maduro, con seis años de experiencia, enfrentándose a Mister Negativo y al Señor Negativo mientras lidaba con su vida personal. <em>Miles Morales</em> (2020) amplió el universo con un Spider-Man nuevo cargado de energía bioeléctrica. Y <em>Spider-Man 2</em> reunió a ambos protagonistas para hacer frente al simbionte, al Lagarto y, sobre todo, a Kraven el Cazador.</p>

<p>El final de <em>Spider-Man 2</em> dejó el tablero perfectamente colocado para la tercera parte: Peter Parker retirado del simbionte pero con secuelas, Miles como Spider-Man principal de Nueva York, y un epílogo que claramente siembra las semillas del próximo gran conflicto.</p>

<figure>
  <img src="/images/spiderman3.webp" alt="Marvel's Spider-Man 3 — Insomniac Games" />
  <figcaption>La trilogía de Insomniac ha redefinido lo que puede ser un videojuego de superhéroes.</figcaption>
</figure>

<h2>¿Qué villano protagonizará Spider-Man 3?</h2>
<p>El final de <em>Spider-Man 2</em> hace referencia directa a Norman Osborn y al simbionte. La comunidad lleva meses especulando con que el Duende Verde será el gran antagonista de la tercera entrega, y los indicios apuntan fuerte en esa dirección: Norman aparece varias veces en la historia, su arco personal está claramente inconcluso y la fórmula de "el villano más personal" que han seguido los dos primeros juegos señala a Osborn como la elección natural.</p>

<p>Otros rumores apuntan a una aparición de Carnage —el simbionte rojo que suele seguir a Venom en los cómics— como antagonista secundario o incluso principal. La dinámica de los simbiontes da para mucho, y Insomniac ha demostrado que sabe cómo llevar estos personajes a la pantalla con personalidad propia.</p>

<h2>Peter y Miles: ¿cómo se repartirán el protagonismo?</h2>
<p>Una de las decisiones más interesantes que deberá tomar Insomniac es la distribución del protagonismo. <em>Spider-Man 2</em> apostó por el esquema de dos personajes jugables con historias entrelazadas, algo que funcionó narrativamente aunque generó cierta polémica sobre si el tiempo de pantalla de Miles era suficiente.</p>

<p>Para la tercera entrega, las apuestas se dividen entre quienes creen que la historia debería centrarse en Peter Parker para cerrar su arco de forma definitiva, y quienes apuestan por Miles como protagonista único en lo que podría ser su propia trilogía independiente. Lo más probable, teniendo en cuenta los patrones de la saga, es una combinación de ambos con un reparto más equilibrado.</p>

<h2>Plataforma y fecha de lanzamiento</h2>
<p><em>Marvel's Spider-Man 3</em> será, casi con total certeza, un exclusivo de PS5 —al igual que sus predecesores llegó más tarde a PC—. No hay fecha oficial confirmada por Sony ni por Insomniac, pero teniendo en cuenta los ciclos de desarrollo de la saga (aproximadamente tres años entre entregas), 2026 o 2027 serían las ventanas más razonables.</p>

<p>Insomniac Games ha sido especialmente prolífico en los últimos años —con <em>Ratchet & Clank: Rift Apart</em>, <em>Miles Morales</em>, <em>Wolverine</em> y <em>Spider-Man 2</em> en un período relativamente corto— por lo que no sería descartable ver el juego antes de lo esperado si los tiempos de producción se mantienen.</p>

<h2>Lo que esperamos ver</h2>
<p>Más allá de la historia, los fans tienen una lista de deseos clara para la tercera entrega: mayor verticalidad en el mapa de Nueva York, más trajes icónicos, un sistema de combate que refine lo ya visto y, sobre todo, una historia que esté a la altura del legado construido por las dos primeras entregas.</p>

<p>Si algo ha demostrado Insomniac es que entienden a Spider-Man a un nivel profundo: no solo como superhéroe, sino como personaje lleno de vulnerabilidades, responsabilidades y contradicciones. Ese es el mayor motivo para tener confianza en que la tercera parte estará a la altura.</p>

<p>Mientras esperamos noticias oficiales, una cosa es segura: cuando <em>Marvel's Spider-Man 3</em> llegue, va a ser un evento.</p>
`,
};

async function main() {
  // Verificar si ya existe
  const existing = await prisma.blogPost.findUnique({ where: { slug: POST.slug } });
  if (existing) {
    console.log(`⏭️  Ya existe: ${POST.slug}`);
    await prisma.$disconnect();
    return;
  }

  await prisma.blogPost.create({ data: POST });
  console.log(`✅ Creado: ${POST.title}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });