// Títulos con los que se estrenaron las películas en Latinoamérica, cuando no coinciden con los de España
// (fuente: traducciones es-MX de TMDB). Más del 90 % de las visitas desde Google llegan de Latinoamérica
// y buscan con estos nombres: se muestran en la ficha y van en el título y la descripción para buscadores.
// `titulo` es el título completo; `corto`, la parte que se añade al título de la página sin alargarlo de más.
interface TituloLatam {
  titulo: string
  corto: string
}

const TITULOS_LATAM: Record<string, TituloLatam> = {
  'spider-man-2002': { titulo: 'El Hombre Araña', corto: 'El Hombre Araña' },
  'spider-man-2-2004': { titulo: 'El Hombre Araña 2', corto: 'El Hombre Araña 2' },
  'spider-man-3-2007': { titulo: 'El Hombre Araña 3', corto: 'El Hombre Araña 3' },
  'the-amazing-spider-man-2012': { titulo: 'El sorprendente Hombre Araña', corto: 'El sorprendente Hombre Araña' },
  'the-amazing-spider-man-2-el-poder-de-electro-2014': {
    titulo: 'El sorprendente Hombre Araña 2: La amenaza de Electro',
    corto: 'El sorprendente Hombre Araña 2',
  },
  'spider-man-homecoming-2017': { titulo: 'Spider-Man: De regreso a casa', corto: 'De regreso a casa' },
  'spider-man-no-way-home-2021': { titulo: 'Spider-Man: Sin camino a casa', corto: 'Sin camino a casa' },
  'spider-man-brand-new-day-2026': { titulo: 'Spider-Man: Un nuevo día', corto: 'Un nuevo día' },
  'spider-man-cruzando-el-multiverso-2023': { titulo: 'Spider-Man: A través del Spider-Verso', corto: 'A través del Spider-Verso' },
  'venom-habra-matanza-2021': { titulo: 'Venom: Carnage liberado', corto: 'Carnage liberado' },
  'kraven-the-hunter-2024': { titulo: 'Kraven el cazador', corto: 'Kraven el cazador' },
}

export function tituloLatam(slug: string): TituloLatam | null {
  return TITULOS_LATAM[slug] ?? null
}

// «Spider-Man: No Way Home (Sin camino a casa, 2021)» o, sin título latino, «Venom (2018)»
export function tituloConAnio(slug: string, title: string, year: number): string {
  const latam = tituloLatam(slug)
  return latam ? `${title} (${latam.corto}, ${year})` : `${title} (${year})`
}
