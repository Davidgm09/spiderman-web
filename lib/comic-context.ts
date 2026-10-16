// Contexto editorial de cada serie de cómics (clave: título sin el número, tal como está en la BD).
// Solo datos generales verificables; lo específico de cada número sale de sus propios datos
// (equipo creativo, arco y personajes de Comic Vine).

type EraText = { until: number; text: string }

const SERIES_CONTEXT: Record<string, string | EraText[]> = {
  'The Amazing Spider-Man': [
    { until: 1966, text: 'The Amazing Spider-Man es la serie principal del personaje, creada por Stan Lee y Steve Ditko en 1963, tras su debut en Amazing Fantasy #15. Estos primeros números establecieron casi todo lo que hoy asociamos a Spider-Man: su galería de villanos, el Daily Bugle de J. Jonah Jameson y la doble vida de Peter Parker.' },
    { until: 1970, text: 'Tras la marcha de Steve Ditko, John Romita tomó el relevo en el dibujo junto a Stan Lee y dio a la serie un estilo más romántico y luminoso, con Gwen Stacy y Mary Jane Watson como parte central del reparto.' },
    { until: 1975, text: 'A comienzos de los setenta, con John Romita y Gil Kane al dibujo, la serie vivió una etapa de transición: Stan Lee fue cediendo el guion a nuevos escritores como Roy Thomas y Gerry Conway, que poco después firmaría la muerte de Gwen Stacy en los números 121 y 122.' },
    { until: 9999, text: 'The Amazing Spider-Man es la serie principal del personaje desde 1963 y la columna vertebral de su continuidad en los cómics.' },
  ],
  'The Amazing Spider-Man Annual': 'Los Annual eran números anuales de mayor extensión que la serie regular. El primero, de 1964, presentó a los Seis Siniestros; con los años sirvieron tanto para historias autoconclusivas como para enlazar con los crossovers veraniegos de Marvel.',
  'Amazing Spider-Man Super Special': 'Número especial de formato extendido publicado en 1995, en plena saga del clon, cuando Ben Reilly compartía protagonismo con Peter Parker. Estos especiales conectaban entre sí las distintas cabeceras arácnidas de la época.',
  'The Spectacular Spider-Man': [
    { until: 1979, text: 'Peter Parker, the Spectacular Spider-Man nació en 1976 como segunda serie mensual del personaje, con Gerry Conway y Sal Buscema en su arranque, para dar más espacio a la vida universitaria de Peter y a villanos de segunda fila.' },
    { until: 9999, text: 'The Spectacular Spider-Man fue la segunda serie mensual del personaje entre 1976 y 1998, a menudo con un tono más centrado en el lado humano de Peter Parker que la cabecera principal.' },
  ],
  'The Spectacular Spider-Man Annual': 'Números anuales de The Spectacular Spider-Man, publicados entre 1979 y 1994. Ofrecían historias más largas que la serie regular y, a partir de finales de los ochenta, solían enlazar con los crossovers anuales de Marvel.',
  'Spectacular Spider-Man Super Special': 'Número especial de formato extendido publicado en 1995, en plena saga del clon, que conectaba con el resto de cabeceras arácnidas de aquel año.',
  'Spectacular Spider-Man': 'Segundo volumen de Spectacular Spider-Man, lanzado en 2003 con guion de Paul Jenkins y dibujo de Humberto Ramos en su arranque. Es una etapa recordada por su enfoque intimista en Peter Parker y por revisitar a villanos clásicos como Venom y el Doctor Octopus. La serie terminó en 2005, tras 27 números.',
  'Spectacular Spider-Man: Sins Remembered': 'Especial de 2005 que continúa «Sins Past», la polémica historia de J. Michael Straczynski sobre el pasado de Gwen Stacy y Norman Osborn.',
  'Giant-Size Spider-Man': 'Serie de números extragrandes publicada entre 1974 y 1975, en la que Spider-Man se cruzaba con otros personajes del catálogo Marvel de la época, del terror a las artes marciales y el pulp.',
  'Superman vs. the Amazing Spider-Man': 'Publicado en 1976 en formato tabloide, fue el primer gran crossover entre Marvel y DC, con guion de Gerry Conway y dibujo de Ross Andru. Un hito editorial que abrió la puerta a los encuentros entre las dos editoriales.',
  'The Official Marvel Index to the Amazing Spider-Man': 'Guía de referencia de nueve números publicada en 1985 que resume, número a número, la serie The Amazing Spider-Man: argumentos, créditos y apariciones de personajes. No es una historia, sino una herramienta de consulta muy apreciada por coleccionistas e investigadores.',
  'Ultimate Spider-Man': 'Reinicio del personaje en el universo Ultimate, lanzado en 2000 con guion de Brian Michael Bendis y dibujo de Mark Bagley durante sus primeros 111 números, una de las colaboraciones más largas de la historia de Marvel. Contaba los orígenes de un Peter Parker adolescente para una nueva generación de lectores.',
  'Ultimate Spider-Man Annual': 'Números anuales de Ultimate Spider-Man dentro de la etapa de Brian Michael Bendis, con historias autoconclusivas de mayor extensión.',
  'Ultimate Spider-Man Super Special': 'Especial de 2002 del universo Ultimate, publicado en los primeros años de la etapa de Brian Michael Bendis y Mark Bagley.',
  'Ultimate Spider-Man Hardcover': 'Tomo en tapa dura que recopila varios arcos de Ultimate Spider-Man, la etapa de Brian Michael Bendis y Mark Bagley que reinventó al personaje para el siglo XXI.',
  'The Ultimate Spider-Man 100 Project': 'Proyecto benéfico de 2008 en el que un centenar de artistas versionaron la portada de Ultimate Spider-Man #100; las piezas se subastaron a favor de la Hero Initiative, que ayuda a creadores de cómic veteranos.',
  'Edge of Spider-Verse': 'Miniserie de cinco números publicada en 2014 como antesala del evento Spider-Verse. Cada número presenta a un Spider-Man de un universo alternativo, con equipos creativos distintos, y de ella salieron personajes que acabaron teniendo serie propia, como Spider-Gwen.',
  'Spider-Verse Team-Up': 'Serie de tres números publicada durante el evento Spider-Verse (2014–2015), con historias que emparejan a distintas arañas del multiverso.',
  'Spider-Verse': 'Serie de 2015 ligada al evento Secret Wars, en la que distintos Spider-Men de universos alternativos vuelven a reunirse en el mosaico de realidades de Battleworld.',
  'Spider-Gwen': 'Serie de Jason Latour y Robbi Rodriguez protagonizada por la Gwen Stacy de Tierra-65, un universo en el que fue ella, y no Peter Parker, quien recibió la picadura de la araña. Nació tras el éxito de su debut en Edge of Spider-Verse #2 (2014) y destacó por su estilo visual y su tono punk.',
  'Spider-Gwen: Greater Power': 'Recopilatorio de Spider-Gwen, la serie de Jason Latour y Robbi Rodriguez sobre la Gwen Stacy de Tierra-65.',
  'Spider-Gwen : Most Wanted?': 'Recopilatorio de los primeros números de Spider-Gwen, la serie de Jason Latour y Robbi Rodriguez sobre la Gwen Stacy de Tierra-65.',
  'True Believers: Spider-Gwen': 'Reedición a precio reducido del debut de Spider-Gwen en Edge of Spider-Verse #2, dentro de la línea True Believers con la que Marvel acercaba números clave a nuevos lectores.',
  'Miles Morales Spider-Man Omnibus': 'Tomo ómnibus que recopila las aventuras de Miles Morales, el Spider-Man creado por Brian Michael Bendis y Sara Pichelli en 2011 en el universo Ultimate y que después saltó al universo principal de Marvel.',
}

// Números con contexto propio que no sigue a su serie
const ISSUE_CONTEXT: Record<string, string> = {
  'the-amazing-spider-man-1-1997': 'Número publicado en julio de 1997 dentro del «Flashback Month» de Marvel: todas las series de la editorial lanzaron un número -1 con historias ambientadas antes de la primera aparición de sus protagonistas.',
  'the-spectacular-spider-man-1-1997': 'Número publicado en julio de 1997 dentro del «Flashback Month» de Marvel: todas las series de la editorial lanzaron un número -1 con historias ambientadas antes de la primera aparición de sus protagonistas.',
  'ultimate-spider-man-2002': 'Número ½ de Ultimate Spider-Man (2002), una historia especial que no se vendía en quioscos: se conseguía a través de la revista Wizard, como el resto de los números ½ de la época.',
}

// Comic Vine nombra algunos arcos con la serie entre comillas delante: '"Spectacular Spider-Man" Lizard's Tale'
export function cleanArcName(arc: string): string {
  return arc.replace(/^"[^"]*"\s*/, '').trim()
}

export function comicSeriesName(title: string): string {
  return title.replace(/\s*#.*$/, '').trim()
}

export function comicContext(slug: string, title: string, year: string): string | null {
  if (ISSUE_CONTEXT[slug]) return ISSUE_CONTEXT[slug]
  const ctx = SERIES_CONTEXT[comicSeriesName(title)]
  if (!ctx) return null
  if (typeof ctx === 'string') return ctx
  const y = parseInt(year, 10) || 9999
  return (ctx.find((e) => y <= e.until) ?? ctx[ctx.length - 1]).text
}
