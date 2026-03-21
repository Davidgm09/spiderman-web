import type { Metadata } from "next"
import { Mail, Clock, MessageSquare, CheckCircle } from "lucide-react"
import { SITE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Contacto | Spider-World",
  description: "Contacta con Spider-World para colaboraciones, errores o sugerencias sobre el universo Spider-Man.",
  alternates: { canonical: '/contacto' },
  robots: { index: false },
}

export default async function ContactoPage({ searchParams }: { searchParams: Promise<{ enviado?: string }> }) {
  const { enviado } = await searchParams
  const enviadoOk = enviado === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">

      {/* Header */}
      <section className="pt-32 pb-12 px-4 text-center">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">Spider-World · Contacto</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Escríbenos
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          ¿Tienes una sugerencia, encontraste un error o quieres colaborar?
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* Banner éxito */}
        {enviadoOk && (
          <div className="flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-2xl px-6 py-4 mb-10 text-green-300">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">¡Mensaje enviado! Te responderemos en menos de 48 horas.</p>
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mail,         color: "text-red-400",    title: "Email",     desc: "hola@spider-world.es" },
            { icon: Clock,        color: "text-blue-400",   title: "Respuesta", desc: "En menos de 48 horas" },
            { icon: MessageSquare,color: "text-purple-400", title: "Motivos",   desc: "Colaboraciones, errores, sugerencias" },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-gray-950/60 border border-white/5 rounded-2xl p-6 text-center">
              <Icon className={`w-7 h-7 ${color} mx-auto mb-3`} />
              <h3 className="text-white font-semibold mb-1 text-sm">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div className="bg-gray-950/60 border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Envíanos un mensaje</h2>

          <form
            action="https://formsubmit.co/hola@spider-world.es"
            method="POST"
            className="space-y-5"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value={`${SITE_URL}/contacto?enviado=true`} />
            <input type="hidden" name="_subject" value="Nuevo mensaje desde Spider-World" />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-400 mb-2">Motivo</label>
              <select
                id="motivo"
                name="motivo"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
              >
                <option value="sugerencia">Sugerencia de contenido</option>
                <option value="error">Reportar un error</option>
                <option value="colaboracion">Colaboración</option>
                <option value="privacidad">Solicitud de privacidad (RGPD)</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        <p className="text-gray-600 text-sm text-center mt-8">
          Al enviar este formulario aceptas nuestra{" "}
          <a href="/privacidad" className="text-red-400 hover:text-red-300 transition-colors">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  )
}
