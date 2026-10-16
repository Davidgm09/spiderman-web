'use client'

import { useState, useEffect } from 'react'

// true cuando el visitante ha aceptado las cookies (guardado o en esta visita desde el banner)
export function useCookieConsent(): boolean {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('cookie-consent') === 'accepted') setConsented(true)
    } catch {
      // localStorage bloqueado: sin consentimiento
    }

    function onAccept() { setConsented(true) }
    window.addEventListener('cookie-consent-accepted', onAccept)
    return () => window.removeEventListener('cookie-consent-accepted', onAccept)
  }, [])

  return consented
}
