/**
 * Añade a la tienda productos oficiales de Spider-Man: Brand New Day.
 * Comprobados en Amazon.es el 17/10/2026: ASIN, título (todos citan Brand New Day), stock e imagen.
 * Crea o actualiza por slug. Volver a ejecutar tras `populate-tienda-products.js --clean`.
 *
 * Uso: node scripts/add-tienda-brand-new-day.js
 */

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const img = (id, ext = 'jpg') => `https://m.media-amazon.com/images/I/${id}._AC_SL1000_.${ext}`;
const shirt = (id) =>
  `https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C${id}.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SL1000_.png`;

const PRODUCTS = [
  {
    slug: 'funko-pop-spider-man-brand-new-day-1586',
    asin: 'B0FPMXT2H1',
    category: 'Coleccionables',
    title: 'Funko Pop! · Spider-Man (Brand New Day)',
    description: 'El Funko Pop! de Spider-Man de Spider-Man: Brand New Day, la cuarta película de Tom Holland, con el traje de la película. Número 1586 de la línea Marvel.',
    features: ['Figura de vinilo Funko Pop! con cabeza oscilante', 'Spider-Man de Spider-Man: Brand New Day', 'Número 1586', 'Caja con ventana'],
    image: img('81UrjIP-QPL'),
    keywords: ['funko pop brand new day', 'funko spider-man 1586', 'spider-man brand new day', 'tom holland'],
  },
  {
    slug: 'funko-pop-spider-man-traje-casero-no-way-home-brand-new-day-1587',
    asin: 'B0FPNH2G4P',
    category: 'Coleccionables',
    title: 'Funko Pop! · Spider-Man traje casero de No Way Home (Brand New Day)',
    description: 'Funko Pop! de la colección de Spider-Man: Brand New Day con el traje casero que Peter se cose al final de No Way Home. Número 1587.',
    features: ['Figura de vinilo Funko Pop! con cabeza oscilante', 'Traje casero del final de No Way Home', 'Colección Spider-Man: Brand New Day', 'Número 1587'],
    image: img('81-+7FhxC9L'),
    keywords: ['funko pop brand new day', 'funko spider-man traje casero', 'no way home', 'funko 1587'],
  },
  {
    slug: 'funko-pop-super-hulk-brand-new-day-1588',
    asin: 'B0FPNTDJ8B',
    category: 'Coleccionables',
    title: 'Funko Pop! Super · Hulk (Brand New Day)',
    description: 'El Hulk de Spider-Man: Brand New Day en formato Funko Pop! Super, más grande que un Pop normal. Número 1588.',
    features: ['Funko Pop! Super, de mayor tamaño que un Pop estándar', 'Hulk de Spider-Man: Brand New Day', 'Número 1588', 'Caja con ventana'],
    image: img('81qLMe-7f8L'),
    keywords: ['funko pop hulk brand new day', 'funko super hulk', 'brand new day', 'funko 1588'],
  },
  {
    slug: 'marvel-legends-spider-man-brand-new-day',
    asin: 'B0G1TXWSG4',
    category: 'Figuras',
    title: 'Marvel Legends · Spider-Man (Brand New Day)',
    description: 'Figura de la línea Marvel Legends a escala de 15 cm inspirada en el Spider-Man de Brand New Day, con manos intercambiables y efectos de telaraña para recrear poses de la película.',
    features: ['Línea Marvel Legends Series de Hasbro', 'Escala de 15 cm', 'Traje de Spider-Man: Brand New Day', 'Manos intercambiables y efectos de telaraña'],
    image: img('610AmlzYxvL'),
    keywords: ['marvel legends brand new day', 'figura spider-man brand new day', 'hasbro', 'tom holland'],
  },
  {
    slug: 'marvel-legends-hulk-brand-new-day',
    asin: 'B0G1TXHCM1',
    category: 'Figuras',
    title: 'Marvel Legends · Hulk (Brand New Day)',
    description: 'El Hulk de Spider-Man: Brand New Day en la línea Marvel Legends, a escala de 15 cm, con cabeza y manos intercambiables y efectos de telaraña.',
    features: ['Línea Marvel Legends Series de Hasbro', 'Escala de 15 cm', 'Hulk de Spider-Man: Brand New Day', 'Cabeza y manos intercambiables'],
    image: img('61h9wTwV00L'),
    keywords: ['marvel legends hulk', 'hulk brand new day', 'figura hulk', 'hasbro'],
  },
  {
    slug: 'hasbro-spider-man-power-charge-brand-new-day',
    asin: 'B0H7636RRL',
    category: 'Juguetes',
    title: 'Hasbro · Spider-Man Power-Charge (Brand New Day, 36,8 cm)',
    description: 'Figura electrónica de Spider-Man: Brand New Day de 36,8 cm, pensada para jugar, con proyectiles incluidos. Un regalo para los fans más pequeños de la película.',
    features: ['Figura electrónica de 36,8 cm', 'Inspirada en Spider-Man: Brand New Day', 'Incluye proyectiles', 'Juguete de Hasbro'],
    image: img('719wTp44-ZL'),
    keywords: ['spider-man power-charge', 'juguete brand new day', 'figura spider-man grande', 'hasbro'],
  },
  {
    slug: 'camiseta-spider-man-brand-new-day-logo',
    asin: 'B0HD12MBP9',
    category: 'Ropa',
    title: 'Marvel · Camiseta logo de Spider-Man: Brand New Day',
    description: 'Camiseta negra con el logo de la película Spider-Man: Brand New Day de Marvel Studios. Disponible en varias tallas y colores en Amazon.',
    features: ['Logo de Spider-Man: Brand New Day', 'Merchandising de Marvel Studios', 'Varias tallas'],
    image: shirt('81XrIhivDCL'),
    keywords: ['camiseta brand new day', 'camiseta spider-man 2026', 'marvel studios'],
  },
  {
    slug: 'camiseta-spider-man-brand-new-day-mascara-telarana',
    asin: 'B0H31QKG2S',
    category: 'Ropa',
    title: 'Marvel · Camiseta máscara y telaraña de Brand New Day',
    description: 'Camiseta con la máscara de Spider-Man dibujada con telarañas y el título de Brand New Day. Disponible en varias tallas y colores en Amazon.',
    features: ['Diseño de máscara y telaraña', 'Título de Spider-Man: Brand New Day', 'Merchandising de Marvel Studios', 'Varias tallas'],
    image: shirt('91WrXuClhFL'),
    keywords: ['camiseta brand new day', 'camiseta spider-man telaraña', 'marvel studios'],
  },
];

(async () => {
  for (const p of PRODUCTS) {
    const data = {
      ...p,
      price: '',
      rating: 4.8,
      reviews: '0',
      inStock: true,
      isFeatured: true,
      seoTitle: `${p.title.replace(' · ', ' ')} | Amazon.es`,
      seoDescription: p.description.slice(0, 155),
    };
    const r = await prisma.product.upsert({ where: { slug: p.slug }, update: data, create: data });
    console.log('🛒', r.slug);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
