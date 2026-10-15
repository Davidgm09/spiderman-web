// Sin barra final, para que `${SITE_URL}/ruta` no genere `//ruta`
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sentidoaracnido.com').replace(/\/+$/, '')
export const CONTACT_EMAIL = 'sentidoaracnido.contacto@gmail.com'
// Vacío hasta tener el tag real de Amazon Afiliados: nunca usar un tag inventado (podría ser de otra persona)
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || ''
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || ''
// Solo hay anuncios si el client ID es real (no vacío ni el placeholder "ca-pub-xxxxxxxxx")
export const ADS_ENABLED = /^ca-pub-\d+$/.test(ADSENSE_CLIENT_ID)
