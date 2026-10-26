// Cargador de imágenes de next/image (ver `images.loaderFile` en next.config.mjs).
// No usa el optimizador de Vercel: el plan gratuito tiene un cupo mensual de transformaciones y, al
// agotarse, cada imagen nueva devolvía un 402 y salía rota. En su lugar pide directamente a cada
// servidor de origen el tamaño que ya ofrece, para no descargar imágenes más grandes de lo necesario.

const TMDB_SIZES = ['w92', 'w154', 'w185', 'w300', 'w342', 'w500', 'w780', 'w1280', 'original']
const TMDB_WIDTHS = [92, 154, 185, 300, 342, 500, 780, 1280, Infinity]
const RAWG_WIDTHS = [200, 420, 640, 1280]

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  // TMDB: image.tmdb.org/t/p/<tamaño>/<archivo>. Nunca por encima del tamaño guardado en la BD.
  const tmdb = src.match(/^https:\/\/image\.tmdb\.org\/t\/p\/([^/]+)(\/.+)$/)
  if (tmdb) {
    const wanted = TMDB_WIDTHS.findIndex((w) => w >= width)
    const stored = TMDB_SIZES.indexOf(tmdb[1])
    const size = TMDB_SIZES[stored === -1 ? wanted : Math.min(wanted, stored)]
    return `https://image.tmdb.org/t/p/${size}${tmdb[2]}`
  }

  // RAWG: media.rawg.io/media/<ruta> → media.rawg.io/media/resize/<ancho>/-/<ruta>
  const rawg = src.match(/^https:\/\/media\.rawg\.io\/media\/(?!resize\/|crop\/)(.+)$/)
  if (rawg) {
    const w = RAWG_WIDTHS.find((r) => r >= width) ?? 1280
    return `https://media.rawg.io/media/resize/${w}/-/${rawg[1]}`
  }

  // Comic Vine: las variantes no tienen un ancho fijo; «scale_medium» (unos 400–620 px) basta para
  // tarjetas y portadas, y evita los «original» de varios MB
  const cv = src.match(/^https:\/\/comicvine\.gamespot\.com\/a\/uploads\/(original|scale_large|screen_large|screen_kubrick)\/(.+)$/)
  if (cv) return `https://comicvine.gamespot.com/a/uploads/scale_medium/${cv[2]}`

  // Imágenes propias (/public) y del resto de dominios: tal cual
  return src
}
