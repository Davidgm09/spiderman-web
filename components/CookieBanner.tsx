'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

export type ConsentStatus = 'accepted' | 'rejected' | null

const CONSENT_KEY = 'cookie-consent'

export function getConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CONSENT_KEY) as ConsentStatus
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    // Disparar evento para que AdSenseScript lo detecte y cargue los anuncios
    window.dispatchEvent(new Event('cookie-consent-accepted'))
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold mb-1">Usamos cookies</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Utilizamos cookies propias y de terceros (Google AdSense, Amazon) para mostrarte publicidad
              personalizada y analizar el tráfico. Puedes aceptar todas las cookies o rechazar las no esenciales.{' '}
              <Link href="/cookies" className="text-red-400 hover:text-red-300 underline underline-offset-2">
                Más información
              </Link>
            </p>
          </div>

          <button
            onClick={reject}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-gray-300 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 ml-10">
          <button
            onClick={accept}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Aceptar todas
          </button>
          <button
            onClick={reject}
            className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors border border-gray-700"
          >
            Solo necesarias
          </button>
          <Link
            href="/privacidad"
            className="flex-1 sm:flex-none text-center text-gray-500 hover:text-gray-300 text-sm py-2.5 transition-colors"
          >
            Política de privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}
