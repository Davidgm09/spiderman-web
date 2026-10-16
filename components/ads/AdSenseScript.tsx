'use client'

import Script from 'next/script'
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from '@/lib/config'
import { useCookieConsent } from '@/hooks/use-cookie-consent'

export function AdSenseScript() {
  const consented = useCookieConsent()

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
