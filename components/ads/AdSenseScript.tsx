'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

export function AdSenseScript() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    // Comprobar consentimiento ya guardado
    if (localStorage.getItem('cookie-consent') === 'accepted') {
      setConsented(true)
    }

    // Escuchar si el usuario acepta desde el banner
    function onAccept() { setConsented(true) }
    window.addEventListener('cookie-consent-accepted', onAccept)
    return () => window.removeEventListener('cookie-consent-accepted', onAccept)
  }, [])

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID
  if (!consented || !clientId || clientId === 'ca-pub-xxxxxxxxx') return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
