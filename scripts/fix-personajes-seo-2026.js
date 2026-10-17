/**
 * Títulos y descripciones para Google de los 45 personajes (seoTitle / seoDescription).
 * Empiezan por lo que la gente busca (nombre real y nombre de héroe, en español si lo tiene)
 * y la descripción dice quién es. Los que tienen ficha ampliada (data/personajes/fichas.json)
 * mencionan además sus películas. Al añadir una ficha nueva, actualizar aquí su título.
 * Volver a ejecutar tras `populate-all-45-characters.js`.
 *
 * Uso: node scripts/fix-personajes-seo-2026.js
 */

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// slug: [título, descripción]  (título ≤ 60 caracteres, descripción ≤ 155)
const SEO = {
  // ── Con ficha ampliada ─────────────────────────────────────────────────────
  'black-widow-natasha-romanoff-alt': ['Natasha Romanoff (Viuda Negra): historia, poderes y cine', 'Quién es Natasha Romanoff, la Viuda Negra: la espía de la Habitación Roja, su primer cómic (1964), su relación con Spider-Man y Scarlett Johansson.'],
  'doctor-octopus-otto-octavius-alt': ['Doctor Octopus (Otto Octavius): historia, poderes y cine', 'Quién es el Doctor Octopus: el científico de los cuatro brazos mecánicos, sus grandes historias con Spider-Man y Alfred Molina en el cine.'],
  'hawkeye-clint-barton-alt': ['Clint Barton (Ojo de Halcón): historia, habilidades y cine', 'Quién es Clint Barton, Ojo de Halcón: el arquero sin superpoderes que pasó de villano a Vengador, sus etapas en los cómics y Jeremy Renner en el MCU.'],
  'ant-man-scott-lang-alt': ['Scott Lang (Ant-Man): historia, poderes y películas', 'Quién es Scott Lang, Ant-Man: el exladrón que robó el traje de Hank Pym para salvar a su hija, sus poderes, sus cómics y Paul Rudd en el MCU.'],
  'hulk-bruce-banner-alt': ['Bruce Banner (Hulk): historia, poderes y películas', 'Quién es Bruce Banner, Hulk: el científico expuesto a la radiación gamma, sus sagas, los actores que lo han interpretado y su papel en Brand New Day.'],

  // ── Spider-Man y familia arácnida ──────────────────────────────────────────
  'spider-man-peter-parker-alt': ['Peter Parker (Spider-Man): historia, poderes y películas', 'Quién es Peter Parker, Spider-Man: su origen en 1962, sus momentos clave en los cómics, sus poderes y los actores que lo han interpretado en el cine.'],
  'spider-man-miles-morales-alt': ['Miles Morales (Spider-Man): historia, poderes y películas', 'Quién es Miles Morales: el Spider-Man de Brooklyn creado en 2011, sus poderes de invisibilidad y descarga, sus cómics y las películas del Spider-Verso.'],
  'spider-gwen-gwen-stacy-alt': ['Spider-Gwen (Gwen Stacy): historia, poderes y películas', 'Quién es Spider-Gwen: la Gwen Stacy de la Tierra-65 a la que picó la araña, su origen en 2014, sus poderes y su papel en las películas del Spider-Verso.'],
  'spider-man-2099-miguel-ohara-alt': ["Miguel O'Hara (Spider-Man 2099): historia y poderes", "Quién es Miguel O'Hara, el Spider-Man 2099: el genetista de Alchemax del futuro, sus poderes únicos y su primera aparición en Spider-Man 2099 #1 (1992)."],
  'spider-man-noir-peter-parker-alt': ['Spider-Man Noir: historia, poderes y origen', 'Quién es Spider-Man Noir: el Peter Parker que lucha contra la mafia en la Gran Depresión. Origen, poderes y su debut en Spider-Man Noir #1 (2009).'],
  'spider-ham-peter-porker-alt': ['Spider-Ham (Peter Porker): historia y origen', 'Quién es Spider-Ham, Peter Porker: la araña mordida por una cerda irradiada en un universo de animales. Origen, poderes y primera aparición (1983).'],
  'spider-man-india-pavitr-prabhakar-alt': ['Pavitr Prabhakar (Spider-Man India): historia y poderes', 'Quién es Pavitr Prabhakar, el Spider-Man India: protege Bombay con poderes de origen místico. Origen, poderes y su debut en Spider-Man: India (2004).'],
  'spider-girl-mayday-parker-alt': ['Mayday Parker (Spider-Girl): historia y poderes', 'Quién es Mayday Parker, Spider-Girl: la hija de Peter Parker y Mary Jane en el universo MC2. Origen, poderes y su debut en What If? #105 (1998).'],
  'silk-cindy-moon-alt': ['Silk (Cindy Moon): historia, poderes y origen', 'Quién es Silk, Cindy Moon: mordida por la misma araña que Peter Parker, pasó años encerrada en un búnker. Origen, poderes y primera aparición (2014).'],
  'spider-uk-billy-braddock-alt': ['Spider-UK (Billy Braddock): historia y poderes', 'Quién es Spider-UK, Billy Braddock: el Spider-Man británico de la Tierra-833 y miembro del Cuerpo del Capitán Britania que lideró a los Web-Warriors.'],
  'spider-woman-julia-carpenter-alt': ['Julia Carpenter (Spider-Woman): historia y poderes', 'Quién es Julia Carpenter: la segunda Spider-Woman, que más tarde se convirtió en la nueva Madame Web. Origen, poderes y debut en Secret Wars #6 (1984).'],
  'spider-woman-mattie-franklin-alt': ['Mattie Franklin (Spider-Woman): historia y poderes', 'Quién es Mattie Franklin: la tercera Spider-Woman, que obtuvo sus poderes en un ritual místico. Origen, poderes y primera aparición (1998).'],
  'ben-reilly-scarlet-spider-alt': ['Ben Reilly (Scarlet Spider): historia y poderes', 'Quién es Ben Reilly, Scarlet Spider: el clon de Peter Parker creado por el Chacal que llegó a ser Spider-Man. Origen, poderes y primera aparición (1975).'],
  'kaine-parker-scarlet-spider-alt': ['Kaine Parker (Scarlet Spider): historia y poderes', 'Quién es Kaine: el primer clon de Peter Parker, imperfecto, que pasó de villano a héroe como Scarlet Spider. Origen, poderes y primera aparición (1994).'],
  'madame-web-cassandra-webb-alt': ['Madame Web (Cassandra Webb): historia y poderes', 'Quién es Madame Web, Cassandra Webb: la vidente ciega conectada a una máquina con forma de telaraña que guía a los héroes arácnidos. Debut en 1980.'],

  // ── Villanos ───────────────────────────────────────────────────────────────
  'green-goblin-norman-osborn-alt': ['Norman Osborn (Duende Verde): historia, poderes y cine', 'Quién es Norman Osborn, el Duende Verde: el peor enemigo de Spider-Man, la muerte de Gwen Stacy, sus poderes y Willem Dafoe en el cine.'],
  'venom-eddie-brock-alt': ['Venom (Eddie Brock): historia, poderes y películas', 'Quién es Venom: el simbionte que Peter Parker rechazó y Eddie Brock, su paso de villano a antihéroe, sus poderes y Tom Hardy en el cine.'],
  'carnage-cletus-kasady-alt': ['Carnage (Cletus Kasady): historia, poderes y origen', 'Quién es Carnage, Cletus Kasady: el asesino en serie unido a un descendiente del simbionte de Venom. Origen, poderes y primera aparición (1992).'],
  'vulture-adrian-toomes-alt': ['Adrian Toomes (el Buitre): historia y poderes', 'Quién es Adrian Toomes, el Buitre: el ingeniero con un arnés de vuelo, uno de los primeros villanos de Spider-Man. Origen, poderes y debut en 1963.'],
  'lizard-curtis-connors-alt': ['Curt Connors (el Lagarto): historia y poderes', 'Quién es Curt Connors, el Lagarto: el científico que perdió un brazo y experimentó con ADN de reptil. Origen, poderes y primera aparición (1963).'],
  'sandman-william-baker-alt': ['Flint Marko (el Hombre de Arena): historia y poderes', 'Quién es el Hombre de Arena, Flint Marko: el criminal que puede convertir su cuerpo en arena. Origen, poderes y su debut en 1963 en The Amazing Spider-Man.'],
  'electro-maxwell-dillon-alt': ['Max Dillon (Electro): historia, poderes y origen', 'Quién es Electro, Max Dillon: el electricista alcanzado por un rayo que controla la electricidad. Origen, poderes y primera aparición (1964).'],
  'mysterio-quentin-beck-alt': ['Quentin Beck (Mysterio): historia y poderes', 'Quién es Mysterio, Quentin Beck: el experto en efectos especiales que ataca a Spider-Man con ilusiones. Origen, habilidades y primera aparición (1964).'],
  'scorpion-mac-gargan-alt': ['Mac Gargan (el Escorpión): historia y poderes', 'Quién es Mac Gargan, el Escorpión: el detective privado transformado gracias al dinero de J. Jonah Jameson. Origen, poderes y primera aparición (1964).'],
  'rhino-aleksei-sytsevich-alt': ['Aleksei Sytsevich (Rino): historia y poderes', 'Quién es Rino, Aleksei Sytsevich: el matón ruso con traje blindado y cuerno que carga contra Spider-Man. Origen, poderes y primera aparición (1966).'],
  'kraven-the-hunter-sergei-kravinoff-alt': ['Kraven el Cazador (Sergei Kravinoff): historia', 'Quién es Kraven el Cazador: el cazador que considera a Spider-Man la presa definitiva. Origen, poderes y su debut en The Amazing Spider-Man #15 (1964).'],
  'hobgoblin-roderick-kingsley-alt': ['Hobgoblin (Roderick Kingsley): historia y poderes', 'Quién es Hobgoblin, el Duende de Roderick Kingsley: el diseñador que encontró un escondite de Norman Osborn. Origen, poderes y primera aparición (1983).'],
  'jackal-miles-warren-alt': ['Miles Warren (el Chacal): historia y poderes', 'Quién es el Chacal, Miles Warren: el profesor obsesionado con Gwen Stacy y la clonación, creador de Ben Reilly y Kaine. Origen y primera aparición (1974).'],
  'morlun-alt': ['Morlun: historia y poderes del cazador de arañas', 'Quién es Morlun: el ser ancestral que se alimenta de los tótems arácnidos y caza a los Spider-Man del multiverso. Origen, poderes y debut (2001).'],

  // ── Universo Marvel ────────────────────────────────────────────────────────
  'iron-man-tony-stark-alt': ['Tony Stark (Iron Man): historia, poderes y películas', 'Quién es Tony Stark, Iron Man: el inventor de la armadura, su relación con Spider-Man en los cómics y en el cine, y Robert Downey Jr. en el MCU.'],
  'captain-america-steve-rogers-alt': ['Steve Rogers (Capitán América): historia y películas', 'Quién es Steve Rogers, el Capitán América: el supersoldado de 1941, su relación con Spider-Man, sus poderes y Chris Evans en el cine.'],
  'thor-odinson-alt': ['Thor Odinson: historia y poderes del dios del trueno', 'Quién es Thor, el dios asgardiano del trueno y miembro fundador de los Vengadores. Origen, poderes, Mjolnir y su primera aparición en 1962.'],
  'black-panther-tchalla-alt': ["T'Challa (Pantera Negra): historia y poderes", "Quién es T'Challa, Pantera Negra: el rey de Wakanda, la nación africana rica en vibranium. Origen, poderes y su debut en Fantastic Four #52 (1966)."],
  'doctor-strange-stephen-strange-alt': ['Stephen Strange (Doctor Strange): historia y películas', 'Quién es Stephen Strange, el Doctor Strange: el cirujano convertido en Hechicero Supremo, su hechizo en No Way Home y Benedict Cumberbatch en el cine.'],
  'daredevil-matt-murdock-alt': ['Matt Murdock (Daredevil): historia y poderes', "Quién es Matt Murdock, Daredevil: el abogado ciego de Hell's Kitchen con sentidos sobrehumanos. Origen, poderes y su debut en Daredevil #1 (1964)."],
  'wolverine-james-howlett-alt': ['Logan (Lobezno): historia, poderes y películas', 'Quién es Logan, Lobezno: el mutante con garras de adamantium, su origen, sus poderes, su relación con Spider-Man y Hugh Jackman en el cine.'],
  'storm-ororo-munroe-alt': ['Ororo Munroe (Tormenta): historia y poderes', 'Quién es Ororo Munroe, Tormenta: la mutante que controla el clima, líder de la Patrulla-X. Origen, poderes y su debut en Giant-Size X-Men #1 (1975).'],
  'deadpool-wade-wilson-alt': ['Wade Wilson (Deadpool): historia, poderes y películas', 'Quién es Wade Wilson, Deadpool: el mercenario que rompe la cuarta pared, su origen, su relación con Spider-Man y Ryan Reynolds en el cine.'],
  'human-torch-johnny-storm-alt': ['Johnny Storm (Antorcha Humana): historia y poderes', 'Quién es Johnny Storm, la Antorcha Humana: el más joven de los Cuatro Fantásticos y gran amigo de Spider-Man. Origen, poderes y primera aparición (1961).'],
  'fantastic-four-reed-richards-alt': ['Reed Richards (Mister Fantástico): historia y poderes', 'Quién es Reed Richards, Mister Fantástico: el líder de los Cuatro Fantásticos, capaz de estirar su cuerpo. Origen, poderes y primera aparición (1961).'],
};

(async () => {
  let n = 0;
  const problemas = [];
  for (const [slug, [seoTitle, seoDescription]] of Object.entries(SEO)) {
    if (seoTitle.length > 60) problemas.push(`título largo (${seoTitle.length}): ${slug}`);
    if (seoDescription.length > 155) problemas.push(`descripción larga (${seoDescription.length}): ${slug}`);
    const r = await prisma.character.updateMany({ where: { slug }, data: { seoTitle, seoDescription } });
    if (!r.count) problemas.push(`no existe: ${slug}`);
    n += r.count;
  }
  const faltan = await prisma.character.findMany({ where: { isActive: true, slug: { notIn: Object.keys(SEO) } }, select: { slug: true } });
  faltan.forEach((c) => problemas.push(`sin título nuevo: ${c.slug}`));
  console.log(`${n} personajes actualizados`);
  if (problemas.length) console.log(problemas.join('\n'));
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
