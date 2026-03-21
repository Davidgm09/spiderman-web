import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Sobre Nosotros | Spider-World",
  description:
    "Conoce el equipo detrás de Spider-World, el portal en español más completo sobre el universo de Spider-Man: películas, cómics, videojuegos, series y personajes.",
  alternates: { canonical: `${SITE_URL}/sobre-nosotros` },
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Sobre Nosotros</h1>
        <p className="text-gray-400 mb-12">El equipo detrás de Spider-World</p>

        <div className="prose prose-invert max-w-none space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">¿Qué es Spider-World?</h2>
            <p>
              Spider-World es el portal de referencia en español sobre el universo de Spider-Man. Nació de la pasión
              por uno de los personajes más icónicos de Marvel: Peter Parker, Miles Morales y todos los Spider-Men
              que han cruzado el multiverso.
            </p>
            <p className="mt-4">
              Aquí encontrarás análisis de películas, reseñas de cómics, guías de videojuegos, fichas de personajes
              y artículos de opinión escritos por fans para fans. Todo en español, con rigor y sin spoilers sin avisar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Nuestra misión</h2>
            <p>
              Queremos ser la guía más completa del Spider-Verse en castellano. Desde la primera aparición de
              Spider-Man en <em>Amazing Fantasy #15</em> (1962) hasta las últimas noticias sobre <em>Brand New Day</em>,
              cubrimos todo el universo araña con el respeto y el entusiasmo que merece.
            </p>
            <p className="mt-4">
              No somos una publicación oficial de Marvel, Disney ni Sony. Somos un proyecto independiente creado
              por aficionados que creen que con un gran poder viene una gran responsabilidad… también a la hora
              de escribir sobre cómics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Qué encontrarás en Spider-World</h2>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong className="text-white">Películas:</strong> análisis completos de toda la filmografía de Spider-Man, desde la trilogía Raimi hasta el MCU.</li>
              <li><strong className="text-white">Cómics:</strong> reseñas y guías de lectura de los arcos más importantes de la historia del personaje.</li>
              <li><strong className="text-white">Videojuegos:</strong> ranking y análisis de todos los juegos de Spider-Man, desde el clásico de 2000 hasta Marvel's Spider-Man 2.</li>
              <li><strong className="text-white">Series:</strong> desde la serie animada de 1994 hasta las producciones más recientes.</li>
              <li><strong className="text-white">Personajes:</strong> fichas detalladas de todos los héroes y villanos del Spider-Verse.</li>
              <li><strong className="text-white">Blog:</strong> artículos de opinión, análisis en profundidad y las últimas noticias del universo araña.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Transparencia y monetización</h2>
            <p>
              Spider-World se financia mediante dos sistemas que no afectan a la independencia editorial:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>
                <strong className="text-white">Google AdSense:</strong> mostramos anuncios contextuals de Google.
                Los anuncios no influyen en las opiniones ni en los contenidos del sitio.
              </li>
              <li>
                <strong className="text-white">Amazon Afiliados:</strong> participamos en el Programa de Afiliados
                de Amazon EU. Si compras a través de nuestros enlaces, recibimos una pequeña comisión sin coste
                adicional para ti. Esto nos ayuda a mantener el sitio activo.
              </li>
            </ul>
            <p className="mt-4">
              Puedes leer más en nuestra{" "}
              <Link href="/privacidad" className="text-red-400 hover:text-red-300">Política de Privacidad</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contacto</h2>
            <p>
              ¿Tienes alguna sugerencia, corrección o simplemente quieres hablar de Spider-Man? Escríbenos a través
              de nuestra{" "}
              <Link href="/contacto" className="text-red-400 hover:text-red-300">página de contacto</Link>.
              Leemos todos los mensajes.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
