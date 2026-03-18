# Tareas Pendientes — Spider-World

## 🔴 Antes de lanzar (obligatorio)

- [ ] **Comprar dominio** (ej. spider-world.es en Namecheap, ~10€/año)
- [ ] **Crear email** con el dominio (ej. hola@spider-world.es) o Gmail temporal
- [ ] **Actualizar email** en `app/contacto/page.tsx` y `app/privacidad/page.tsx`
- [ ] **Actualizar `NEXT_PUBLIC_SITE_URL`** en `.env` con el dominio real
- [ ] **Desplegar en Vercel**:
  1. Ir a vercel.com → Add New Project → seleccionar repo `Davidgm09/spiderman-web`
  2. Añadir todas las variables del `.env` en el panel de Vercel
  3. Conectar el dominio comprado en la configuración de Vercel

## 🟡 Monetización

- [ ] **Amazon Afiliados**: registrarse en afiliados.amazon.es y obtener el tag real
  - Actualizar `AMAZON_AFFILIATE_TAG` y `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG` en `.env`
- [ ] **Google AdSense**: solicitar aprobación en adsense.google.com (hacerlo tras publicar la web)
  - Una vez aprobado, actualizar `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` en `.env` de Vercel
  - Actualizar los ad slots en `components/ads/GoogleAdsense.tsx` (ahora son placeholders: 1234567890, etc.)

## 🟠 Contenido

- [ ] **Más artículos del blog**: Google recomienda 20-30 artículos antes de aprobar AdSense
  - Ejecutar `node scripts/populate-blog.js` para añadir los 12 actuales
  - Añadir más artículos al script y volver a ejecutar
- [ ] **Revisar imágenes rotas**: comprobar personajes y cómics con imágenes que dan 404

## 🟢 Mejoras opcionales

- [ ] **Panel de administración** para crear/editar artículos del blog desde el navegador (sin tocar código)
- [ ] **Buscador** en el sitio (películas, personajes, artículos)
- [ ] **Breadcrumbs** en páginas de detalle (mejora SEO)
- [ ] **Google Search Console**: dar de alta el sitio y enviar el sitemap tras publicar
  - URL del sitemap: `https://tu-dominio.es/sitemap.xml`

## ✅ Completado

- [x] Blog con 12 artículos, filtros por categoría y tag
- [x] Páginas de detalle del blog con artículos relacionados y tags
- [x] Contador de vistas real en artículos del blog
- [x] Botones de compartir (X, Facebook, WhatsApp, copiar enlace)
- [x] Sitemap dinámico (`/sitemap.xml`)
- [x] robots.txt (`/robots.txt`)
- [x] JSON-LD en home, blog posts, películas, series y videojuegos
- [x] Optimización de imágenes (eliminado `unoptimized: true`)
- [x] Banner de consentimiento de cookies (RGPD)
- [x] Página de Política de Privacidad (`/privacidad`)
- [x] Página de Política de Cookies (`/cookies`)
- [x] Página de Contacto (`/contacto`)
- [x] Página 404 personalizada
- [x] Footer con enlaces legales reales
