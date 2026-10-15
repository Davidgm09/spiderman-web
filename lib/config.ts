// Sin barra final, para que `${SITE_URL}/ruta` no genere `//ruta`
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sentidoaracnido.com').replace(/\/+$/, '')
export const CONTACT_EMAIL = 'sentidoaracnido.contacto@gmail.com'
// ID de Afiliados de Amazon.es (es público: aparece en cada enlace). La variable de entorno permite sobrescribirlo
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'sentidoaracni-21'
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || ''
// Solo hay anuncios si el client ID es real (no vacío ni el placeholder "ca-pub-xxxxxxxxx")
export const ADS_ENABLED = /^ca-pub-\d+$/.test(ADSENSE_CLIENT_ID)

// Titular de la web (LSSI art. 10 y RGPD). Rellena cada campo cuando decidas publicarlo:
// los vacíos no se muestran en el aviso legal ni en la política de privacidad.
export const LEGAL_OWNER = {
  name: '',     // Nombre y apellidos
  nif: '',      // NIF/DNI
  address: '',  // Domicilio (calle, número, CP, ciudad)
}

export const SITE_NAME = 'Sentido Arácnido'

// Google muestra unos 60 caracteres del título: el nombre de la web solo se añade si cabe.
// Acepta títulos que ya traen " | Sentido Arácnido" (los seoTitle de la BD) y lo recoloca.
export function pageTitle(base: string, maxLength = 60): string {
  const clean = base.replace(/\s*[|·-]\s*Sentido Arácnido(\s+Blog)?\s*$/, '').trim()
  const full = `${clean} | ${SITE_NAME}`
  return full.length <= maxLength ? full : clean
}
