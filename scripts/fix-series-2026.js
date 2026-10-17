/**
 * Sinopsis propias, revisadas a mano, para las series (octubre de 2026).
 * Las de TMDB tenían errores de traducción («en una escuela a Oscorp»), expresiones de otros
 * países («preparatoria») o eran demasiado cortas. Sustituyen a description y longDescription.
 *
 * Uso: node scripts/fix-series-2026.js (volver a ejecutar tras populate-series-from-tmdb.js)
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const SINOPSIS = {
  'spider-man':
    'La primera serie animada de Spider-Man, emitida en ABC entre 1967 y 1970. Peter Parker, un estudiante tímido con poderes de araña, protege Nueva York de villanos clásicos como el Duende Verde, el Doctor Octopus o el Buitre mientras trabaja como fotógrafo para J. Jonah Jameson. Su canción de cabecera se convirtió en un clásico, y algunas de sus escenas son hoy memes conocidos en todo el mundo.',
  'spiderman-toei-1978':
    'Serie japonesa de imagen real producida por Toei. Takuya Yamashiro, un joven piloto de motos, recibe sus poderes de Garia, el último superviviente del planeta Spider, y se convierte en Spider-Man para luchar contra el Profesor Monstruo y su ejército. Pilota un robot gigante, Leopardon, una idea que influyó en las series japonesas de héroes y robots que vinieron después.',
  'spider-man-y-sus-sorprendentes-amigos':
    'Spider-Man forma equipo con el Hombre de Hielo y Estrella de Fuego, una heroína creada para la serie que después llegó a los cómics. Los tres estudian en la universidad, viven en casa de la tía May y esconden en ella un cuartel secreto, desde el que se enfrentan a villanos de todo el universo Marvel. Se emitió en NBC entre 1981 y 1983.',
  'spiderman':
    'La gran serie de Spider-Man de los 90, emitida en Fox Kids entre 1994 y 1998. Peter Parker, estudiante universitario y fotógrafo del Daily Bugle, se enfrenta a casi toda su galería de villanos, con Kingpin como gran enemigo en la sombra, en sagas de varios episodios que adaptan historias clásicas de los cómics, como la llegada del simbionte o las Guerras Secretas. Sus 65 episodios marcaron a toda una generación.',
  'el-regreso-de-spiderman':
    'Spider-Man viaja a la Contra-Tierra, un planeta creado por el Alto Evolucionador, para rescatar al astronauta John Jameson, y descubre un mundo dominado por seres medio animales. Allí lucha con un nuevo traje tecnológico contra Venom y Carnage, que también han llegado al planeta. Se emitió en Fox Kids en 1999 y se canceló tras su primera temporada, con la historia sin terminar.',
  'las-incre-bles-aventuras-de-spiderman':
    'Serie animada por ordenador emitida en MTV en 2003, planteada como continuación de la película Spider-Man (2002). Peter Parker estudia en la universidad, Harry Osborn culpa a Spider-Man de la muerte de su padre y Mary Jane forma parte de su vida sin conocer su secreto. Con un tono más adulto que otras series del personaje, duró una sola temporada de 13 episodios.',
  'el-espectacular-spiderman':
    'Peter Parker lleva unos meses como Spider-Man y vive su primer año como héroe a la vez que el instituto, con Gwen Stacy, Harry Osborn y Mary Jane cerca. La serie de Greg Weisman construye con calma su galería de villanos, del Buitre al Duende Verde y Venom, en una historia continua muy cuidada. Duró dos temporadas, entre 2008 y 2009, y muchos fans la consideran la mejor serie animada del personaje.',
  'ultimate-spider-man':
    'Peter Parker lleva un año como Spider-Man cuando Nick Fury le invita a entrenar con S.H.I.E.L.D. junto a otros jóvenes héroes: Nova, Puño de Hierro, Power Man y Tigre Blanco. La serie, emitida en Disney XD entre 2012 y 2017, apuesta por el humor y por los cruces con todo el universo Marvel, y en sus últimas temporadas presenta a Miles Morales y viaja por el multiverso arácnido.',
  'marvel-spider-man':
    'Peter Parker es un adolescente brillante que recibe sus poderes de una araña modificada genéticamente en Oscorp, y empieza a estudiar en el instituto Horizon, un centro para jóvenes genios. La serie de Disney XD, emitida entre 2017 y 2020, cuenta sus primeros pasos como héroe junto a Miles Morales y Gwen Stacy, y termina con la llegada de Venom.',
  'spidey-y-su-superequipo':
    'Serie para los más pequeños de Disney Junior. Peter Parker, Gwen Stacy y Miles Morales forman el «Spidey Team» y, con la ayuda de su robot TRACE-E, protegen su ciudad de villanos como el Duende Verde, el Doctor Octopus o Rino. Por el camino se alían con héroes como Hulk, Ms. Marvel o Pantera Negra, en historias sencillas sobre la amistad y el trabajo en equipo.',
  'tu-amigo-y-vecino-spider-man':
    'Serie animada de Marvel Studios para Disney+, estrenada en 2025. En una realidad alternativa, Peter Parker recibe sus poderes de otra forma y el empresario Norman Osborn se convierte en su mentor, en el papel que en el MCU tenía Tony Stark. Un estilo visual inspirado en el cómic clásico y nuevos amigos y villanos dan una versión distinta de los primeros pasos del héroe.',
  'spider-noir':
    'Serie de imagen real protagonizada por Nicolas Cage, que ya puso voz a Spider-Man Noir en el Spider-Verso. Ben Reilly es un investigador privado veterano y venido a menos en el Nueva York de los años 30, y una tragedia personal le obliga a enfrentarse a su pasado como el único superhéroe de la ciudad. Se ha producido en dos versiones, en blanco y negro y en color.',
};

(async () => {
  const missing = [];
  for (const [slug, text] of Object.entries(SINOPSIS)) {
    const s = await prisma.series.findUnique({ where: { slug }, select: { id: true } });
    if (!s) { missing.push(slug); continue; }
    await prisma.series.update({ where: { slug }, data: { description: text, longDescription: text } });
  }
  const active = await prisma.series.findMany({ where: { isActive: true }, select: { slug: true } });
  const sinSinopsis = active.map((s) => s.slug).filter((s) => !SINOPSIS[s]);
  console.log(`ok sinopsis: ${Object.keys(SINOPSIS).length - missing.length}`);
  if (missing.length) console.warn('No existen:', missing.join(', '));
  if (sinSinopsis.length) console.warn('Series activas sin sinopsis revisada:', sinSinopsis.join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
