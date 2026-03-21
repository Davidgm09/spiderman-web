import type { Metadata } from "next"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Política de Cookies | Spider-World",
  description: "Información sobre el uso de cookies en Spider-World.",
  alternates: { canonical: `${SITE_URL}/cookies` },
  robots: { index: false },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Política de Cookies</h1>
        <p className="text-gray-400 mb-12">Última actualización: marzo de 2026</p>

        <div className="prose prose-invert max-w-none space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
              Sirven para recordar tus preferencias, analizar el tráfico y mostrar publicidad relevante.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies que utilizamos</h2>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-white">Cookie</th>
                    <th className="text-left py-3 px-4 text-white">Proveedor</th>
                    <th className="text-left py-3 px-4 text-white">Propósito</th>
                    <th className="text-left py-3 px-4 text-white">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="py-3 px-4">_ga, _gid</td>
                    <td className="py-3 px-4">Google</td>
                    <td className="py-3 px-4">Analítica de tráfico</td>
                    <td className="py-3 px-4">2 años / 24h</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">IDE, DSID</td>
                    <td className="py-3 px-4">Google AdSense</td>
                    <td className="py-3 px-4">Publicidad personalizada</td>
                    <td className="py-3 px-4">1 año</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">session-id</td>
                    <td className="py-3 px-4">Amazon</td>
                    <td className="py-3 px-4">Seguimiento de afiliados</td>
                    <td className="py-3 px-4">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cómo gestionar las cookies</h2>
            <p>Puedes controlar y eliminar las cookies desde la configuración de tu navegador:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong className="text-white">Chrome:</strong> Configuración → Privacidad → Cookies</li>
              <li><strong className="text-white">Firefox:</strong> Opciones → Privacidad → Historial</li>
              <li><strong className="text-white">Safari:</strong> Preferencias → Privacidad</li>
              <li><strong className="text-white">Edge:</strong> Configuración → Privacidad</li>
            </ul>
            <p className="mt-4">
              También puedes desactivar la publicidad personalizada de Google en{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300"
              >
                myaccount.google.com/data-and-privacy
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
