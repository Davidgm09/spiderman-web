// Eventos de Google Analytics 4. gtag solo existe si el visitante aceptó las cookies
// (ver components/analytics/GoogleAnalytics.tsx); sin él, no se envía nada.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
