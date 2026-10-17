/**
 * Genera data/juegos/personajes.json para el juego diario «Arañadle» a partir de los personajes de la BD.
 * Los datos de la BD se completan aquí con lo que el juego necesita: género, universo de origen,
 * año de debut como ese personaje, grupos con nombres unificados y nombres en español para el buscador.
 *
 * Uso: node scripts/build-juegos-data.js
 * Volver a ejecutar si cambian los personajes, y revisar el JSON antes de publicar.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const CATEGORY = {
  'spider-verse': 'Héroe arácnido',
  'spider-villains': 'Villano',
  'marvel-universe': 'Héroe Marvel',
  'spider-allies': 'Aliado',
};

// Mismo grupo escrito de varias formas → un solo nombre
const GROUPS = {
  'Vengadores (ocasionalmente)': 'Vengadores',
  'X-Men (ocasionalmente)': 'X-Men',
  'Hand (temporalmente)': 'La Mano',
  'Vengadores del Oeste': 'Vengadores de la Costa Oeste',
  'West Coast Avengers': 'Vengadores de la Costa Oeste',
  'Sinister Six': 'Seis Siniestros',
  'Sinister Twelve': 'Doce Siniestros',
  'Sinister Syndicate': 'Sindicato Siniestro',
  'Savage Six': 'Seis Salvajes',
  'Fantastic Four': 'Cuatro Fantásticos',
  'Frightful Four': 'Cuatro Terribles',
  'Masters of Evil': 'Señores del Mal',
  'Emissaries of Evil': 'Emisarios del Mal',
  'Defenders': 'Defensores',
  'Secret Avengers': 'Vengadores Secretos',
  'Dark Avengers': 'Vengadores Oscuros',
  'New Warriors': 'Nuevos Guerreros',
  'Inheritors': 'Herederos',
  'Midnight Sons': 'Hijos de la Medianoche',
  'Invaders': 'Invasores',
  'Oscorp Industries': 'Oscorp',
  'Klyntar (simbiontes)': 'Klyntar',
  'Familia de Carnage (Maximum Carnage)': 'Familia de Carnage',
};

// Datos propios del juego, por slug
const EXTRA = {
  'ant-man-scott-lang-alt': { g: 'M', terms: ['Hombre Hormiga', 'Scott Lang'] },
  'ben-reilly-scarlet-spider-alt': { g: 'M', terms: ['Araña Escarlata', 'Ben Reilly'] },
  'black-panther-tchalla-alt': { g: 'M', terms: ['Pantera Negra', "T'Challa"] },
  'black-widow-natasha-romanoff-alt': { g: 'F', terms: ['Viuda Negra', 'Natasha Romanoff'], groups: { Champions: 'Campeones de Los Ángeles' } },
  'captain-america-steve-rogers-alt': { g: 'M', terms: ['Capitán América', 'Steve Rogers'] },
  'carnage-cletus-kasady-alt': { g: 'M', terms: ['Matanza', 'Cletus Kasady'], year: 1992 },
  'daredevil-matt-murdock-alt': { g: 'M', terms: ['Matt Murdock'] },
  'deadpool-wade-wilson-alt': { g: 'M', terms: ['Masacre', 'Wade Wilson'] },
  'doctor-octopus-otto-octavius-alt': { g: 'M', terms: ['Doc Ock', 'Otto Octavius'] },
  'doctor-strange-stephen-strange-alt': { g: 'M', terms: ['Doctor Extraño', 'Stephen Strange'] },
  'electro-maxwell-dillon-alt': { g: 'M', terms: ['Max Dillon'] },
  'fantastic-four-reed-richards-alt': { g: 'M', terms: ['Mister Fantástico', 'Reed Richards'] },
  'green-goblin-norman-osborn-alt': { g: 'M', terms: ['Duende Verde', 'Norman Osborn'] },
  'hawkeye-clint-barton-alt': { g: 'M', terms: ['Ojo de Halcón', 'Clint Barton'] },
  'hobgoblin-roderick-kingsley-alt': { g: 'M', terms: ['Duende Macabro', 'Roderick Kingsley'], groups: { 'Su propio imperio criminal': null } },
  'hulk-bruce-banner-alt': { g: 'M', terms: ['Bruce Banner'] },
  'human-torch-johnny-storm-alt': { g: 'M', terms: ['Antorcha Humana', 'Johnny Storm'] },
  'iron-man-tony-stark-alt': { g: 'M', terms: ['Tony Stark'] },
  'jackal-miles-warren-alt': { g: 'M', terms: ['Chacal', 'Miles Warren'] },
  'kaine-parker-scarlet-spider-alt': { g: 'M', terms: ['Araña Escarlata', 'Kaine'] },
  'kraven-the-hunter-sergei-kravinoff-alt': { g: 'M', terms: ['Kraven el Cazador', 'Sergei Kravinoff'] },
  'lizard-curtis-connors-alt': { g: 'M', terms: ['Lagarto', 'Curt Connors'] },
  'madame-web-cassandra-webb-alt': { g: 'F', terms: ['Cassandra Webb'] },
  'morlun-alt': { g: 'M', terms: [] },
  'mysterio-quentin-beck-alt': { g: 'M', terms: ['Quentin Beck'] },
  'rhino-aleksei-sytsevich-alt': { g: 'M', terms: ['Rino', 'Aleksei Sytsevich'] },
  'sandman-william-baker-alt': { g: 'M', terms: ['Hombre de Arena', 'Flint Marko'] },
  'scorpion-mac-gargan-alt': { g: 'M', terms: ['Escorpión', 'Mac Gargan'] },
  'silk-cindy-moon-alt': { g: 'F', terms: ['Cindy Moon'] },
  'spider-girl-mayday-parker-alt': { g: 'F', terms: ['Chica Araña', 'Mayday Parker', 'May Parker'], universe: 'Tierra-982' },
  'spider-gwen-gwen-stacy-alt': { g: 'F', terms: ['Ghost-Spider', 'Gwen Stacy'] },
  'spider-ham-peter-porker-alt': { g: 'M', terms: ['Peter Porker', 'Cerdo Araña'] },
  'spider-man-miles-morales-alt': { g: 'M', terms: ['Miles Morales'], universe: 'Tierra-1610' },
  'spider-man-peter-parker-alt': { g: 'M', terms: ['Peter Parker', 'Hombre Araña'] },
  'spider-man-2099-miguel-ohara-alt': { g: 'M', terms: ["Miguel O'Hara"], universe: 'Tierra-928' },
  'spider-man-india-pavitr-prabhakar-alt': { g: 'M', terms: ['Pavitr Prabhakar'] },
  'spider-man-noir-peter-parker-alt': { g: 'M', terms: ['Noir'] },
  'spider-uk-billy-braddock-alt': { g: 'M', terms: ['Billy Braddock'] },
  'spider-woman-julia-carpenter-alt': { g: 'F', terms: ['Mujer Araña', 'Julia Carpenter', 'Arachne'] },
  'spider-woman-mattie-franklin-alt': { g: 'F', terms: ['Mujer Araña', 'Mattie Franklin'] },
  'storm-ororo-munroe-alt': { g: 'F', terms: ['Tormenta', 'Ororo Munroe'] },
  'thor-odinson-alt': { g: 'M', terms: ['Thor Odinson'] },
  'venom-eddie-brock-alt': { g: 'M', terms: ['Eddie Brock'], year: 1988 },
  'vulture-adrian-toomes-alt': { g: 'M', terms: ['Buitre', 'Adrian Toomes'] },
  'wolverine-james-howlett-alt': { g: 'M', terms: ['Lobezno', 'Logan', 'James Howlett'] },
  'black-cat-felicia-hardy-alt': { g: 'F', terms: ['Gata Negra', 'Felicia Hardy'], since: 3 },
  'mary-jane-watson-alt': { g: 'F', terms: ['MJ', 'Mary Jane'], since: 3 },
  'aunt-may-parker-alt': { g: 'F', terms: ['Tía May', 'May Parker'], since: 3 },
  'j-jonah-jameson-alt': { g: 'M', terms: ['Jameson', 'JJJ'], since: 3 },
  'kingpin-wilson-fisk-alt': { g: 'M', terms: ['Kingpin', 'Wilson Fisk'], since: 3 },
  'shocker-herman-schultz-alt': { g: 'M', terms: ['Herman Schultz'], since: 3 },
  'chameleon-dmitri-smerdyakov-alt': { g: 'M', terms: ['Camaleón', 'Dmitri Smerdyakov'], since: 3 },
  'mister-negative-martin-li-alt': { g: 'M', terms: ['Mister Negativo', 'Martin Li'], since: 3 },
  'morbius-michael-morbius-alt': { g: 'M', terms: ['Michael Morbius'], since: 3 },
  'spider-woman-jessica-drew-alt': { g: 'F', terms: ['Mujer Araña', 'Jessica Drew'], since: 3 },
  'spider-punk-hobie-brown-alt': { g: 'M', terms: ['Hobie Brown'], since: 3 },
  'sp-dr-peni-parker-alt': { g: 'F', terms: ['Peni Parker'], since: 3 },
  'spider-girl-anya-corazon-alt': { g: 'F', terms: ['Anya Corazón', 'Chica Araña'], since: 3 },
  'punisher-frank-castle-alt': { g: 'M', terms: ['Castigador', 'Frank Castle'], since: 3 },
  'prowler-aaron-davis-alt': { g: 'M', terms: ['Prowler', 'Aaron Davis'], since: 3 },
};

// Pista que se muestra tras varios fallos (sin el nombre del personaje)
const CLUES = {
  'black-cat-felicia-hardy-alt': 'Ladrona de guante blanco, hija de otro famoso ladrón, que se enamoró de Spider-Man.',
  'mary-jane-watson-alt': 'Pelirroja, actriz y modelo: «te ha tocado el gordo, tigre».',
  'aunt-may-parker-alt': 'Crió a Peter en Queens y trabajó en el albergue F.E.A.S.T.',
  'j-jonah-jameson-alt': 'Director de periódico que lleva décadas acusando a Spider-Man de ser una amenaza.',
  'kingpin-wilson-fisk-alt': 'El rey del crimen de Nueva York, enemigo también de Daredevil.',
  'shocker-herman-schultz-alt': 'Ladrón de cajas fuertes con guanteletes que lanzan ondas de vibración.',
  'chameleon-dmitri-smerdyakov-alt': 'Maestro del disfraz, hermanastro de un famoso cazador.',
  'mister-negative-martin-li-alt': 'Filántropo de Chinatown con una segunda personalidad criminal.',
  'morbius-michael-morbius-alt': 'Bioquímico que, intentando curar su enfermedad, acabó necesitando beber sangre.',
  'spider-woman-jessica-drew-alt': 'Exagente de HYDRA que lanza descargas de veneno bioeléctricas.',
  'spider-punk-hobie-brown-alt': 'Pelea con una guitarra contra el presidente Norman Osborn.',
  'sp-dr-peni-parker-alt': 'Pilota un robot gigante unido a una araña radiactiva.',
  'spider-girl-anya-corazon-alt': 'Recibió sus poderes en un ritual de una sociedad secreta de arañas.',
  'punisher-frank-castle-alt': 'Exmarine en guerra contra el crimen tras perder a su familia.',
  'prowler-aaron-davis-alt': 'Ladrón profesional y tío de un Spider-Man de Brooklyn.',
  'ant-man-scott-lang-alt': 'Exladrón que usa las partículas Pym para encoger.',
  'ben-reilly-scarlet-spider-alt': 'Clon de Peter Parker creado por el Chacal.',
  'black-panther-tchalla-alt': 'Rey de una nación africana rica en vibranium.',
  'black-widow-natasha-romanoff-alt': 'Espía formada en la Habitación Roja soviética.',
  'captain-america-steve-rogers-alt': 'Soldado de la Segunda Guerra Mundial que despertó en la era moderna tras quedar congelado.',
  'carnage-cletus-kasady-alt': 'Asesino en serie unido a un descendiente del simbionte de Venom.',
  'daredevil-matt-murdock-alt': "Abogado ciego de Hell's Kitchen.",
  'deadpool-wade-wilson-alt': 'Mercenario bocazas que rompe la cuarta pared.',
  'doctor-octopus-otto-octavius-alt': 'Científico con cuatro brazos mecánicos.',
  'doctor-strange-stephen-strange-alt': 'Exneurocirujano convertido en Hechicero Supremo.',
  'electro-maxwell-dillon-alt': 'Electricista alcanzado por un rayo mientras reparaba un tendido eléctrico.',
  'fantastic-four-reed-richards-alt': 'Líder de un famoso equipo de cuatro, capaz de estirar su cuerpo.',
  'green-goblin-norman-osborn-alt': 'Empresario que vuela en un planeador y lanza bombas calabaza.',
  'hawkeye-clint-barton-alt': 'Arquero sin superpoderes que aprendió su oficio en un circo.',
  'hobgoblin-roderick-kingsley-alt': 'Diseñador de moda que encontró un escondite de Norman Osborn.',
  'hulk-bruce-banner-alt': 'Científico que se transforma con la ira tras exponerse a radiación gamma.',
  'human-torch-johnny-storm-alt': 'El más joven de un famoso equipo de cuatro, capaz de envolverse en llamas.',
  'iron-man-tony-stark-alt': 'Millonario inventor con una armadura de alta tecnología.',
  'jackal-miles-warren-alt': 'Profesor universitario obsesionado con Gwen Stacy y con la clonación.',
  'kaine-parker-scarlet-spider-alt': 'El primer clon de Peter Parker, imperfecto, que acabó protegiendo Houston.',
  'kraven-the-hunter-sergei-kravinoff-alt': 'Cazador que considera a Spider-Man la presa definitiva.',
  'lizard-curtis-connors-alt': 'Científico que perdió un brazo y experimentó con ADN de reptil.',
  'madame-web-cassandra-webb-alt': 'Vidente ciega conectada a una máquina con forma de telaraña.',
  'morlun-alt': 'Ser ancestral que se alimenta de los tótems arácnidos.',
  'mysterio-quentin-beck-alt': 'Experto en efectos especiales que ataca con ilusiones.',
  'rhino-aleksei-sytsevich-alt': 'Matón ruso con un traje blindado y un cuerno.',
  'sandman-william-baker-alt': 'Criminal que puede convertir su cuerpo en arena.',
  'scorpion-mac-gargan-alt': 'Detective privado transformado gracias al dinero de J. Jonah Jameson.',
  'silk-cindy-moon-alt': 'Mordida por la misma araña que Peter Parker, pasó años encerrada en un búnker.',
  'spider-girl-mayday-parker-alt': 'Hija de Peter Parker y Mary Jane en un futuro alternativo.',
  'spider-gwen-gwen-stacy-alt': 'En su universo fue ella, y no Peter, quien recibió la picadura de la araña.',
  'spider-ham-peter-porker-alt': 'Una araña mordida por una cerda irradiada.',
  'spider-man-miles-morales-alt': 'Chico de Brooklyn que puede volverse invisible y lanzar descargas.',
  'spider-man-peter-parker-alt': 'El original: mordido por una araña radiactiva en 1962.',
  'spider-man-2099-miguel-ohara-alt': 'Genetista de Alchemax en el futuro.',
  'spider-man-india-pavitr-prabhakar-alt': 'Protege Bombay con poderes de origen místico.',
  'spider-man-noir-peter-parker-alt': 'Lucha contra la mafia durante la Gran Depresión.',
  'spider-uk-billy-braddock-alt': 'Miembro del Cuerpo del Capitán Britania que lideró a los Web-Warriors.',
  'spider-woman-julia-carpenter-alt': 'La segunda en llevar su nombre heroico; más tarde, la nueva Madame Web.',
  'spider-woman-mattie-franklin-alt': 'La tercera en llevar su nombre heroico; obtuvo sus poderes en un ritual místico.',
  'storm-ororo-munroe-alt': 'Mutante capaz de controlar el clima, antigua reina de Wakanda.',
  'thor-odinson-alt': 'Dios asgardiano del trueno con un martillo encantado.',
  'venom-eddie-brock-alt': 'Periodista que se unió al simbionte que Peter Parker rechazó.',
  'vulture-adrian-toomes-alt': 'Ingeniero anciano con un arnés de vuelo.',
  'wolverine-james-howlett-alt': 'Mutante con garras de adamantium y factor de curación.',
};

function universe(u) {
  if (u === 'Marvel-616') return 'Tierra-616';
  return u;
}

(async () => {
  const rows = await prisma.character.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const out = [];
  const errors = [];
  for (const c of rows) {
    const x = EXTRA[c.slug];
    if (!x) { errors.push(`Sin datos de juego: ${c.slug}`); continue; }
    const year = x.year || Number((c.firstAppearance.match(/\((\d{4})\)/) || [])[1]);
    if (!year) errors.push(`Año no válido: ${c.slug}`);
    if (!CLUES[c.slug]) errors.push(`Sin pista: ${c.slug}`);
    const groups = [...new Set(c.affiliation.map((a) => (x.groups && a in x.groups ? x.groups[a] : GROUPS[a] || a)))].filter(Boolean);
    out.push({
      slug: c.slug,
      name: c.name,
      image: c.image,
      terms: [...new Set([...(c.alias || []), ...x.terms])].filter((t) => t && t !== c.name),
      gender: x.g === 'F' ? 'Femenino' : 'Masculino',
      category: CATEGORY[c.category] || c.category,
      universe: x.universe || universe(c.universe),
      year,
      creators: c.creators,
      groups,
      clue: CLUES[c.slug],
      ...(x.since ? { since: x.since } : {}),
    });
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const dir = path.join(__dirname, '..', 'data', 'juegos');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'personajes.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`${out.length} personajes → data/juegos/personajes.json`);
  await prisma.$disconnect();
})();
