'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from '@/lib/config'

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

  if (!consented || !ADS_ENABLED) return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
