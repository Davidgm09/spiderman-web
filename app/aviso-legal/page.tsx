import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Aviso Legal | Spider-World",
  description: "Aviso legal de Spider-World. Información sobre el titular del sitio, propiedad intelectual y condiciones de uso.",
  alternates: { canonical: `${SITE_URL}/aviso-legal` },
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Aviso Legal</h1>
        <p className="text-gray-400 mb-12">Última actualización: marzo de 2025</p>

        <div className="prose prose-invert max-w-none space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Datos identificativos</h2>
            <p>
              En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
              y de Comercio Electrónico (LSSI-CE), se informa que el presente sitio web,{" "}
              <strong className="text-white">spider-world.es</strong>, es un proyecto de carácter informativo y
              de entretenimiento gestionado de forma independiente.
            </p>
            <p className="mt-4">
              Para cualquier consulta puedes contactarnos a través de la{" "}
              <Link href="/contacto" className="text-red-400 hover:text-red-300">página de contacto</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web spider-world.es (en adelante, «el Sitio»),
              que el titular pone a disposición de los usuarios de internet. El acceso al Sitio implica la aceptación
              plena y sin reservas de las presentes condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Propiedad intelectual</h2>
            <p>
              Los contenidos editoriales del Sitio (textos, análisis, reseñas, artículos de blog) son elaborados por
              el equipo de Spider-World y están protegidos por los derechos de propiedad intelectual aplicables.
            </p>
            <p className="mt-4">
              <strong className="text-white">Spider-Man y todos los personajes, nombres, imágenes y marcas relacionadas
              son propiedad de Marvel Entertainment, LLC</strong>, subsidiaria de The Walt Disney Company.
              Sony Pictures Entertainment posee los derechos cinematográficos de Spider-Man.
            </p>
            <p className="mt-4">
              Spider-World es un proyecto independiente de fans, sin ninguna afiliación, patrocinio ni respaldo
              oficial de Marvel, Disney ni Sony. Las imágenes de películas, series y cómics se utilizan con fines
              informativos, críticos y educativos, al amparo del derecho de cita reconocido en el artículo 32
              del Real Decreto Legislativo 1/1996 (Ley de Propiedad Intelectual).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Programa de afiliados de Amazon</h2>
            <p>
              Spider-World participa en el <strong className="text-white">Programa de Afiliados de Amazon EU</strong>,
              un programa de publicidad para afiliados diseñado para que sitios web puedan ganar comisiones
              mediante la publicación de enlaces a Amazon.es y sitios afiliados.
            </p>
            <p className="mt-4">
              Cuando el usuario hace clic en un enlace de afiliado y realiza una compra en Amazon, Spider-World
              puede recibir una pequeña comisión económica. Este coste no se traslada al usuario: el precio que
              paga es exactamente el mismo que si accediera directamente a Amazon.
            </p>
            <p className="mt-4">
              La existencia de estos enlaces de afiliado no influye en la selección ni valoración de los productos
              recomendados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Publicidad</h2>
            <p>
              El Sitio muestra anuncios gestionados por <strong className="text-white">Google AdSense</strong>.
              Google puede utilizar cookies para mostrar anuncios basados en visitas previas del usuario a este
              u otros sitios web. Puedes consultar cómo gestionar las preferencias de anuncios de Google en{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300"
              >
                google.com/settings/ads
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Exclusión de responsabilidad</h2>
            <p>
              El titular del Sitio no se hace responsable de los daños o perjuicios de cualquier naturaleza que
              pudieran derivarse del acceso o uso de los contenidos del Sitio, ni de la información contenida
              en sitios web de terceros enlazados desde el Sitio.
            </p>
            <p className="mt-4">
              El titular se reserva el derecho de modificar, suspender o eliminar, sin previo aviso, los contenidos
              del Sitio, así como las condiciones de acceso al mismo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Legislación aplicable</h2>
            <p>
              El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier
              controversia derivada del acceso o uso del Sitio, las partes se someten a los juzgados y tribunales
              competentes conforme a derecho.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Más información</h2>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><Link href="/privacidad" className="text-red-400 hover:text-red-300">Política de Privacidad</Link></li>
              <li><Link href="/cookies" className="text-red-400 hover:text-red-300">Política de Cookies</Link></li>
              <li><Link href="/contacto" className="text-red-400 hover:text-red-300">Contacto</Link></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
