import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | Spider-World",
  description: "Política de privacidad de Spider-World. Información sobre cómo recopilamos y usamos tus datos.",
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
        <p className="text-gray-400 mb-12">Última actualización: marzo de 2025</p>

        <div className="prose prose-invert max-w-none space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Quiénes somos</h2>
            <p>
              Spider-World es un sitio web informativo y de entretenimiento dedicado al universo de Spider-Man. Puedes
              contactarnos a través de la página de <a href="/contacto" className="text-red-400 hover:text-red-300">contacto</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Datos que recopilamos</h2>
            <p>Spider-World no recopila datos personales de forma directa. Sin embargo, los siguientes servicios de
            terceros integrados en el sitio pueden recopilar información de forma automática:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong className="text-white">Google AdSense:</strong> muestra anuncios personalizados basados en tu actividad de navegación.</li>
              <li><strong className="text-white">Google Analytics (si se activa en el futuro):</strong> analiza el tráfico de forma anónima.</li>
              <li><strong className="text-white">Amazon Afiliados:</strong> si haces clic en un enlace de producto, Amazon puede registrar esa visita.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Cookies</h2>
            <p>
              Utilizamos cookies propias y de terceros para el funcionamiento del sitio y para mostrar publicidad relevante.
              Las cookies de Google AdSense permiten a Google mostrar anuncios personalizados según tus intereses.
              Puedes gestionar o desactivar las cookies en la configuración de tu navegador en cualquier momento.
            </p>
            <p className="mt-3">
              Para más información sobre cómo Google usa las cookies en la publicidad, visita la{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300"
              >
                Política de publicidad de Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Publicidad (Google AdSense)</h2>
            <p>
              Spider-World participa en el programa Google AdSense. Google, como proveedor externo, usa cookies para
              mostrar anuncios basados en las visitas anteriores del usuario a este y otros sitios web. Los usuarios
              pueden desactivar la publicidad personalizada visitando{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300"
              >
                Configuración de anuncios de Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Programa de afiliados de Amazon</h2>
            <p>
              Spider-World participa en el Programa de Afiliados de Amazon EU, un programa de publicidad para afiliados
              diseñado para ofrecer un medio para que los sitios web ganen comisiones por publicidad mediante la creación
              de enlaces a Amazon.es. Cuando haces clic en un enlace de afiliado y realizas una compra, recibimos una
              pequeña comisión sin coste adicional para ti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Tus derechos (RGPD)</h2>
            <p>Si resides en la Unión Europea, tienes derecho a:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Acceder a los datos que tenemos sobre ti.</li>
              <li>Solicitar la rectificación o eliminación de tus datos.</li>
              <li>Oponerte al tratamiento de tus datos.</li>
              <li>Presentar una reclamación ante la autoridad de protección de datos de tu país.</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos, contáctanos a través de nuestra <a href="/contacto" className="text-red-400 hover:text-red-300">página de contacto</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Cualquier cambio se publicará en esta página con la fecha
              de actualización correspondiente.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
