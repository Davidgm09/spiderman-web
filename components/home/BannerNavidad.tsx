import Link from "next/link"

// Banner de temporada en la portada: se muestra del 1 de noviembre al 6 de enero
// (la portada se regenera cada hora, así que aparece y desaparece solo).
function enTemporada(fecha = new Date()) {
  const mes = fecha.getUTCMonth() // 0 = enero
  return mes >= 10 || (mes === 0 && fecha.getUTCDate() <= 6)
}

export function BannerNavidad() {
  if (!enTemporada()) return null

  return (
    <section className="px-4 max-w-5xl mx-auto mt-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-950/80 via-gray-900/80 to-red-950/80">
        <div className="text-4xl" aria-hidden>🎁</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-green-400 font-semibold">Navidad 2026</p>
          <p className="text-xl font-bold text-white">¿Buscas un regalo para un fan de Spider-Man?</p>
          <p className="text-sm text-gray-400">
            Ideas para todos: LEGO y juguetes para los peques, figuras para coleccionistas, cómics para lectores y detalles para cualquier fan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <Link
            href="/blog/regalos-spider-man-navidad-guia"
            className="text-center px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Ver la guía de regalos
          </Link>
          <Link
            href="/tienda"
            className="text-center px-5 py-2.5 rounded-lg border border-white/20 hover:border-white/50 text-white font-semibold transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </section>
  )
}
