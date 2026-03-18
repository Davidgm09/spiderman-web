import type { Metadata } from "next"
import { Mail, Clock, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto | Spider-World",
  description: "Contacta con Spider-World para colaboraciones, errores o sugerencias sobre el universo Spider-Man.",
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-4">Contacto</h1>
        <p className="text-gray-400 mb-12 text-lg">
          ¿Tienes alguna pregunta, sugerencia o quieres colaborar? Escríbenos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Email</h3>
            <p className="text-gray-400 text-sm">hola@spider-world.es</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Respuesta</h3>
            <p className="text-gray-400 text-sm">En menos de 48 horas</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Motivos</h3>
            <p className="text-gray-400 text-sm">Colaboraciones, errores, sugerencias</p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Envíanos un mensaje</h2>

          <form
            action="https://formsubmit.co/hola@spider-world.es"
            method="POST"
            className="space-y-5"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://spider-world.es/contacto?enviado=true" />
            <input type="hidden" name="_subject" value="Nuevo mensaje desde Spider-World" />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-300 mb-2">
                Motivo
              </label>
              <select
                id="motivo"
                name="motivo"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="sugerencia">Sugerencia de contenido</option>
                <option value="error">Reportar un error</option>
                <option value="colaboracion">Colaboración</option>
                <option value="privacidad">Solicitud de privacidad (RGPD)</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-300 mb-2">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        <p className="text-gray-500 text-sm text-center mt-8">
          Al enviar este formulario aceptas nuestra{" "}
          <a href="/privacidad" className="text-red-400 hover:text-red-300">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  )
}
