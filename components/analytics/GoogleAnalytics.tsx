'use client'

import Script from 'next/script'
import { GA_ID } from '@/lib/config'
import { useCookieConsent } from '@/hooks/use-cookie-consent'

// Google Analytics 4: usa cookies (_ga), así que solo se carga si el visitante las acepta.
// Los cambios de página dentro de la web los registra GA4 solo (medición mejorada del historial).
export function GoogleAnalytics() {
  const consented = useCookieConsent()

  if (!consented || !GA_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
