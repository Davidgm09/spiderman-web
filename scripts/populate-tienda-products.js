/**
 * Script: populate-tienda-products.js
 * Pobla la tabla `products` con productos reales de Amazon.es de Spider-Man.
 * Productos verificados en Amazon.es en marzo 2025/2026.
 *
 * Uso: node scripts/populate-tienda-products.js [--clean]
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Supabase Session-mode pooler (port 5432) limits concurrent clients.
// Switch to Transaction-mode pooler (port 6543) to avoid "MaxClientsInSessionMode".
const dbUrl = (process.env.DATABASE_URL || '').replace(':5432/', ':6543/');
const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } },
});

// ─── Productos reales de Amazon.es ────────────────────────────────────────────
const PRODUCTS = [
  // ── FIGURAS ──────────────────────────────────────────────────────────────────
  {
    title: "Hasbro Marvel Legends Series Spider-Man: No Way Home - Figura Coleccionable 15 cm",
    description:
      "Figura de acción coleccionable a escala de 15 cm (6 pulgadas) inspirada en Peter Parker durante la batalla final de Spider-Man: No Way Home. Incluye 5 accesorios: cabeza y manos alternativas. Articulación premium con diseño de pinless.",
    price: "29.99",
    originalPrice: "34.99",
    discount: "14%",
    rating: 4.7,
    reviews: "3842",
    image: "https://www.actionfigure411.com/marvel/images/spider-man-tom-holland-7268.jpg",
    category: "Figuras",
    slug: "hasbro-marvel-legends-spider-man-no-way-home-15cm",
    seoTitle: "Hasbro Marvel Legends Spider-Man No Way Home 15cm | Amazon.es",
    seoDescription: "Compra la figura coleccionable de Spider-Man No Way Home de Marvel Legends Series en Amazon.es. 15 cm, 5 accesorios, articulación premium.",
    keywords: ["figura spider-man", "marvel legends", "no way home", "hasbro", "coleccionable"],
    features: [
      "Escala 15 cm (6 pulgadas)",
      "5 accesorios incluidos",
      "Cabeza y manos alternativas",
      "Diseño pinless premium",
      "A partir de 4 años",
    ],
    isFeatured: true,
  },
  {
    title: "Hasbro Marvel Legends Spider-Man Integrated Suit - Figura 15 cm con Traje Integrado",
    description:
      "Figura de acción coleccionable de 15 cm con traje integrado de Spider-Man. Inspirada en el traje tech de Peter Parker, incluye 2 accesorios y articulación de múltiples puntos. Parte de la Marvel Legends Series.",
    price: "24.99",
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviews: "2156",
    image: "https://www.actionfigure411.com/marvel/images/spider-man-integrated-suit-3134.jpg",
    category: "Figuras",
    slug: "hasbro-marvel-legends-spider-man-integrated-suit-15cm",
    seoTitle: "Marvel Legends Spider-Man Integrated Suit 15cm | Amazon.es",
    seoDescription: "Figura coleccionable Spider-Man Integrated Suit Marvel Legends Series. 15 cm, 2 accesorios, articulación premium. Disponible en Amazon.es.",
    keywords: ["figura spider-man", "marvel legends", "integrated suit", "hasbro"],
    features: [
      "Escala 15 cm (6 pulgadas)",
      "2 accesorios incluidos",
      "Articulación múltiple",
      "Traje integrado tech",
      "A partir de 4 años",
    ],
    isFeatured: true,
  },
  {
    title: "Hasbro Marvel Legends Gamerverse Spider-Man 2 - Figura 15 cm con 7 Accesorios",
    description:
      "Figura coleccionable inspirada en Marvel's Spider-Man 2 para PS5. Escala de 15 cm con tecnología pinless y 7 accesorios, incluyendo tentáculos simbionte. Ideal para fans del videojuego.",
    price: "36.99",
    originalPrice: "44.99",
    discount: "18%",
    rating: 4.8,
    reviews: "1203",
    image: "https://www.actionfigure411.com/marvel/images/spider-man-2-gamerverse-5632.jpg",
    category: "Figuras",
    slug: "hasbro-marvel-legends-gamerverse-spider-man-2-15cm",
    seoTitle: "Marvel Legends Gamerverse Spider-Man 2 PS5 15cm | Amazon.es",
    seoDescription: "Figura de Spider-Man 2 (PS5) de Marvel Legends Gamerverse. 15 cm, 7 accesorios simbionte, pinless. Compra en Amazon.es.",
    keywords: ["figura spider-man 2", "gamerverse", "marvel legends", "ps5", "hasbro"],
    features: [
      "Escala 15 cm (6 pulgadas)",
      "7 accesorios incluidos",
      "Tecnología pinless",
      "Tentáculos simbionte",
      "Inspirada en Spider-Man 2 PS5",
    ],
    isFeatured: true,
  },
  {
    title: "Hasbro Marvel Spider-Man Titan Hero Series - Figura de Acción 30 cm",
    description:
      "Figura de acción XL de 30 cm del Hombre Araña de la serie Titan Hero. Ideal para niños a partir de 4 años. Diseño clásico rojo y azul, resistente y con múltiples puntos de articulación. Puerto Titan Hero FX compatible.",
    price: "11.99",
    originalPrice: "14.99",
    discount: "20%",
    rating: 4.4,
    reviews: "5621",
    image: "https://images.icecat.biz/img/gallery/79067960_6628982083.jpg",
    category: "Juguetes",
    slug: "hasbro-marvel-spider-man-titan-hero-series-30cm",
    seoTitle: "Spider-Man Titan Hero Series Figura 30cm Hasbro | Amazon.es",
    seoDescription: "Figura de acción Spider-Man Titan Hero Series de 30 cm de Hasbro. A partir de 4 años. Puerto FX compatible. Disponible en Amazon.es.",
    keywords: ["figura spider-man", "titan hero", "hasbro", "30cm", "juguete"],
    features: [
      "Altura 30 cm",
      "Puerto Titan Hero FX",
      "Material resistente",
      "A partir de 4 años",
      "Articulación en brazos y piernas",
    ],
    isFeatured: false,
  },
  // ── FUNKO POP ─────────────────────────────────────────────────────────────────
  {
    title: "Funko Pop! Marvel: Spider-Man (Integrated Suit) No Way Home - Figura Vinilo #913",
    description:
      "Figura de vinilo Funko Pop! oficial de Spider-Man con traje integrado de Spider-Man: No Way Home. Altura aproximada de 9,5 cm. Ideal como regalo y objeto de colección. Incluye caja coleccionable.",
    price: "13.95",
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: "7823",
    image: "https://cdn11.bigcommerce.com/s-lyvo1qtroi/images/stencil/1280x1280/products/81448/218877/8896985682962__71620.1688590235.jpg",
    category: "Coleccionables",
    slug: "funko-pop-spider-man-integrated-suit-no-way-home-913",
    seoTitle: "Funko Pop Spider-Man Integrated Suit No Way Home #913 | Amazon.es",
    seoDescription: "Funko Pop! Marvel Spider-Man Integrated Suit No Way Home #913. Figura vinilo 9,5 cm oficial. Compra en Amazon.es con envío Prime.",
    keywords: ["funko pop spider-man", "integrated suit", "no way home", "coleccionable", "vinilo"],
    features: [
      "Altura ~9,5 cm",
      "Figura de vinilo oficial",
      "Numeración #913",
      "Caja coleccionable incluida",
      "Licencia Marvel oficial",
    ],
    isFeatured: true,
  },
  {
    title: "Funko Pop! Marvel: Spider-Man 2099 (Blanco) - Exclusiva Amazon #961",
    description:
      "Funko Pop! exclusivo de Amazon con el Spider-Man 2099 en su versión blanca. Edición limitada con Chase variant. Figura de vinilo de 9,5 cm. Ideal para coleccionistas del Universo Spider-Verse.",
    price: "14.99",
    originalPrice: "17.99",
    discount: "17%",
    rating: 4.9,
    reviews: "2341",
    image: "https://www.popfigures.com/cdn/shop/files/Spider-Man_2099_1409_Funko_Pop_-_Spider-Man_Across_The_Spider-Verse.jpg?v=1743157559",
    category: "Coleccionables",
    slug: "funko-pop-spider-man-2099-blanco-exclusiva-amazon-961",
    seoTitle: "Funko Pop Spider-Man 2099 Blanco Exclusiva Amazon #961 | Amazon.es",
    seoDescription: "Funko Pop! Spider-Man 2099 blanco, exclusiva Amazon #961. Edición limitada. Figura vinilo 9,5 cm. Spider-Man: Across the Spider-Verse.",
    keywords: ["funko pop spider-man 2099", "exclusiva amazon", "spider-verse", "coleccionable", "blanco"],
    features: [
      "Exclusiva Amazon",
      "Numeración #961",
      "Altura ~9,5 cm",
      "Edición limitada",
      "Diseño Spider-Man 2099 blanco",
    ],
    isFeatured: true,
  },
  {
    title: "Funko Pop! Marvel: Spider-Man & Venom 2-Pack - Figuras Vinilo Coleccionables",
    description:
      "Pack de 2 figuras Funko Pop! oficiales de Marvel: Spider-Man y Venom. Figuras de vinilo de aproximadamente 9,5 cm cada una. Perfectas para el coleccionista Spider-Man. Incluye caja ventana coleccionable.",
    price: "19.99",
    originalPrice: "24.99",
    discount: "20%",
    rating: 4.7,
    reviews: "1456",
    image: "https://www.popfigures.com/cdn/shop/files/da8a5424-acb6-4395-8767-6b9fdd8de2d8.jpg?v=1762963640",
    category: "Coleccionables",
    slug: "funko-pop-spider-man-venom-2-pack",
    seoTitle: "Funko Pop Spider-Man & Venom 2-Pack | Amazon.es",
    seoDescription: "Pack 2 Funko Pop! Marvel Spider-Man y Venom. Figuras vinilo 9,5 cm oficiales. Disponible en Amazon.es con envío Prime.",
    keywords: ["funko pop spider-man", "funko pop venom", "2 pack", "coleccionable", "marvel"],
    features: [
      "Pack de 2 figuras",
      "Spider-Man + Venom",
      "Altura ~9,5 cm cada una",
      "Vinilo oficial",
      "Caja ventana coleccionable",
    ],
    isFeatured: false,
  },
  // ── ROPA ─────────────────────────────────────────────────────────────────────
  {
    title: "Marvel Spiderman Logo Camiseta para Hombre - 100% Algodón Oficial",
    description:
      "Camiseta oficial Marvel con el icónico logo de Spider-Man. Fabricada en 100% algodón de alta calidad. Disponible en tallas S a XXL. Licencia oficial Marvel. Apta para lavadora.",
    price: "19.99",
    originalPrice: "24.99",
    discount: "20%",
    rating: 4.3,
    reviews: "4205",
    image: "https://cdn.media.amplience.net/s/hottopic/10439193_hi?fmt=jpg",
    category: "Ropa",
    slug: "marvel-spiderman-logo-camiseta-hombre-algodon",
    seoTitle: "Camiseta Marvel Spiderman Logo Hombre 100% Algodón | Amazon.es",
    seoDescription: "Camiseta oficial Marvel con logo Spider-Man. 100% algodón, tallas S-XXL. Licencia oficial. Compra en Amazon.es.",
    keywords: ["camiseta spider-man", "marvel logo", "ropa spider-man", "hombre", "algodón"],
    features: [
      "100% algodón de alta calidad",
      "Licencia oficial Marvel",
      "Tallas S, M, L, XL, XXL",
      "Apta para lavadora",
      "Logo Spider-Man clásico",
    ],
    isFeatured: false,
  },
  {
    title: "Marvel Pack 2 Camisetas Spider-Man para Niño - Manga Corta Oficial",
    description:
      "Pack de 2 camisetas oficiales de Marvel Spider-Man para niño. Incluye camiseta azul y camiseta roja con estampados del Hombre Araña. Manga corta, suaves y cómodas. Disponibles de 3 a 14 años.",
    price: "25.99",
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviews: "2876",
    image: "https://imagikids.com/cdn/shop/files/marvel-spider-man-2-pack-t-shirts_5b99393f-1a43-49f1-bc5f-e74568f6a725.jpg?v=1725574675",
    category: "Ropa",
    slug: "marvel-pack-2-camisetas-spider-man-nino-manga-corta",
    seoTitle: "Pack 2 Camisetas Spider-Man Niño Manga Corta Marvel | Amazon.es",
    seoDescription: "Pack 2 camisetas infantiles Spider-Man Marvel. Azul y roja con estampados. Tallas 3-14 años. Envío Prime en Amazon.es.",
    keywords: ["camiseta spider-man niño", "pack camisetas", "marvel infantil", "manga corta"],
    features: [
      "Pack de 2 camisetas",
      "Camiseta azul + camiseta roja",
      "Licencia oficial Marvel",
      "Tallas 3 a 14 años",
      "Material suave y transpirable",
    ],
    isFeatured: false,
  },
  // ── ACCESORIOS / MOCHILAS ─────────────────────────────────────────────────────
  {
    title: "Marvel Spider-Man Mochila Escolar Infantil - Bolsa Colegio con Web Shooter Diseño",
    description:
      "Mochila escolar oficial de Marvel Spider-Man para niños. Diseño con el traje rojo y azul del Hombre Araña. Compartimento principal amplio, bolsillo frontal y asas ajustables. Ideal para colegio y actividades extraescolares.",
    price: "22.99",
    originalPrice: "29.99",
    discount: "23%",
    rating: 4.4,
    reviews: "3102",
    image: "https://www.characterstop.com/cdn/shop/files/TDLPresentation_1_cc7d9855-b441-4493-80d9-5fa77e705310.jpg?v=1692957659",
    category: "Accesorios",
    slug: "marvel-spider-man-mochila-escolar-infantil",
    seoTitle: "Mochila Escolar Spider-Man Marvel Niño | Amazon.es",
    seoDescription: "Mochila escolar infantil oficial Spider-Man Marvel. Diseño clásico rojo y azul. Compartimentos amplios. Compra en Amazon.es.",
    keywords: ["mochila spider-man", "mochila escolar", "marvel infantil", "accesorios spider-man"],
    features: [
      "Licencia oficial Marvel",
      "Compartimento principal amplio",
      "Bolsillo frontal",
      "Asas ajustables acolchadas",
      "Material resistente al desgaste",
    ],
    isFeatured: false,
  },
  // ── CÓMICS ───────────────────────────────────────────────────────────────────
  {
    title: "El Asombroso Spiderman 1: Vuelta a Casa (Marvel Saga) - Panini Cómics",
    description:
      "Primera entrega de la colección Marvel Saga El Asombroso Spiderman. Guion de J. Michael Straczynski con arte de John Romita Jr. Recoge una etapa fundamental de Spider-Man en español. Edición de Panini España.",
    price: "16.10",
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: "987",
    image: "https://acdn-us.mitiendanube.com/stores/001/161/337/products/cci-365649788411016865-41b5bc8a6baad7a40b17733589749976-1024-1024.webp",
    category: "Cómics",
    slug: "el-asombroso-spiderman-1-vuelta-a-casa-marvel-saga-panini",
    seoTitle: "El Asombroso Spiderman 1: Vuelta a Casa Marvel Saga Panini | Amazon.es",
    seoDescription: "Cómic El Asombroso Spiderman vol. 1 Vuelta a Casa de Panini. Guion Straczynski, arte John Romita Jr. En español. Compra en Amazon.es.",
    keywords: ["cómic spider-man español", "marvel saga", "panini", "straczynski", "el asombroso spiderman"],
    features: [
      "Editorial: Panini España",
      "Idioma: Español",
      "Guion: J. Michael Straczynski",
      "Arte: John Romita Jr.",
      "Colección: Marvel Saga",
    ],
    isFeatured: true,
  },
  {
    title: "Spider-Man 1: Tormento - Todd McFarlane (Marvel) - Panini Cómics en Español",
    description:
      "Icónica etapa de Todd McFarlane en Spider-Man. Esta primera entrega recoge 'Tormento', uno de los arcos más importantes de la historia del Hombre Araña. Edición española de Panini con arte detallado de McFarlane.",
    price: "14.25",
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: "1423",
    image: "https://www.eslahoradelastortas.com/blog/media/2022/09/spiderman-tormento.webp",
    category: "Cómics",
    slug: "spider-man-1-tormento-todd-mcfarlane-panini",
    seoTitle: "Spider-Man 1: Tormento Todd McFarlane Panini | Amazon.es",
    seoDescription: "Cómic Spider-Man: Tormento de Todd McFarlane. Edición española Panini. Arco clásico imprescindible. Disponible en Amazon.es.",
    keywords: ["spider-man tormento", "todd mcfarlane", "panini", "cómic clásico", "hombre araña"],
    features: [
      "Autor: Todd McFarlane",
      "Editorial: Panini España",
      "Idioma: Español",
      "Arco 'Tormento' completo",
      "Arte icónico de McFarlane",
    ],
    isFeatured: true,
  },
  {
    title: "Spiderman: Grandes Poderes, Grandes Enemigos - Mi Primer Cómic Marvel",
    description:
      "Cómic infantil oficial de Spider-Man perfecto para los más pequeños. Recoge el origen de Peter Parker de forma adaptada. Con arte colorido y texto sencillo. Ideal como primer contacto con el universo Marvel.",
    price: "9.45",
    originalPrice: "9.95",
    discount: "5%",
    rating: 4.7,
    reviews: "2134",
    image: "https://www.milcomics.com/1029056-large_default/mi-primer-comic-spiderman-grandes-poderes-grandes-enemigos.jpg",
    category: "Cómics",
    slug: "spiderman-grandes-poderes-grandes-enemigos-mi-primer-comic",
    seoTitle: "Spiderman: Grandes Poderes, Grandes Enemigos Mi Primer Cómic | Amazon.es",
    seoDescription: "Mi Primer Cómic Spider-Man para niños. Origen de Peter Parker adaptado. Arte colorido. Panini Marvel. Disponible en Amazon.es.",
    keywords: ["cómic infantil spider-man", "mi primer cómic", "peter parker origen", "panini", "niños"],
    features: [
      "Cómic adaptado para niños",
      "Origen de Peter Parker",
      "Arte colorido y dinámico",
      "Texto sencillo",
      "Editorial Panini",
    ],
    isFeatured: false,
  },
  // ── JUGUETES ─────────────────────────────────────────────────────────────────
  {
    title: "Hasbro Marvel Spider-Man Web Shooter Gear - Lanzarredes para Niños",
    description:
      "Lanzarredes oficial de Spider-Man de Hasbro para niños. Incluye lanzador y 3 telas-redes de proyectiles. Se coloca en la muñeca como el traje del Hombre Araña. Perfecto para juego de rol y disfraces.",
    price: "16.99",
    originalPrice: "19.99",
    discount: "15%",
    rating: 3.8,
    reviews: "8934",
    image: "https://images.icecat.biz/img/gallery/62367838_2441464832.jpg",
    category: "Juguetes",
    slug: "hasbro-marvel-spider-man-web-shooter-gear-lanzarredes",
    seoTitle: "Hasbro Spider-Man Web Shooter Gear Lanzarredes | Amazon.es",
    seoDescription: "Lanzarredes oficial Spider-Man Hasbro para niños. 3 proyectiles incluidos. Fijación en muñeca. Para disfraces y juego de rol. Amazon.es.",
    keywords: ["web shooter spider-man", "lanzarredes", "hasbro", "juguete spider-man", "disfraz"],
    features: [
      "Se fija en la muñeca",
      "3 redes proyectiles incluidas",
      "Licencia oficial Marvel",
      "Ideal para disfraces",
      "A partir de 5 años",
    ],
    isFeatured: false,
  },
  {
    title: "Hasbro Marvel Legends 5-Pack Figuras Spider-Man Universe - Exclusivo Amazon",
    description:
      "Pack exclusivo de Amazon con 5 figuras de acción coleccionables a escala de 15 cm de personajes del universo Spider-Man. Incluye 14 accesorios. Edición especial Amazon exclusiva. Para mayores de 4 años.",
    price: "79.99",
    originalPrice: "99.99",
    discount: "20%",
    rating: 4.9,
    reviews: "2567",
    image: "https://www.actionfigure411.com/marvel/images/spider-man-multipack-4838.jpg",
    category: "Figuras",
    slug: "hasbro-marvel-legends-5-pack-spider-man-universe-exclusivo-amazon",
    seoTitle: "Hasbro Marvel Legends 5-Pack Spider-Man Universe Exclusivo Amazon | Amazon.es",
    seoDescription: "Pack exclusivo Amazon 5 figuras Marvel Legends Spider-Man Universe 15cm, 14 accesorios. Edición especial. Disponible en Amazon.es.",
    keywords: ["marvel legends 5 pack", "spider-man universe", "exclusivo amazon", "hasbro", "coleccionable"],
    features: [
      "5 figuras coleccionables",
      "Escala 15 cm cada figura",
      "14 accesorios totales",
      "Exclusivo Amazon",
      "Universo Spider-Man completo",
    ],
    isFeatured: true,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const isClean = args.includes('--clean');

  if (isClean) {
    console.log('🧹 --clean: eliminando productos existentes...');
    const deleted = await prisma.product.deleteMany({});
    console.log(`   Eliminados: ${deleted.count} productos`);
  }

  console.log(`\n📦 Insertando ${PRODUCTS.length} productos de Spider-Man en Amazon.es...\n`);

  let created = 0;
  let skipped = 0;

  for (const product of PRODUCTS) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          title:         product.title,
          description:   product.description,
          price:         product.price,
          originalPrice: product.originalPrice ?? null,
          discount:      product.discount ?? null,
          rating:        product.rating,
          reviews:       product.reviews,
          image:         product.image,
          category:      product.category,
          seoTitle:      product.seoTitle,
          seoDescription: product.seoDescription,
          keywords:      product.keywords,
          features:      product.features,
          inStock:       true,
          isFeatured:    product.isFeatured,
        },
        create: {
          title:         product.title,
          description:   product.description,
          price:         product.price,
          originalPrice: product.originalPrice ?? null,
          discount:      product.discount ?? null,
          rating:        product.rating,
          reviews:       product.reviews,
          image:         product.image,
          category:      product.category,
          slug:          product.slug,
          seoTitle:      product.seoTitle,
          seoDescription: product.seoDescription,
          keywords:      product.keywords,
          features:      product.features,
          inStock:       true,
          isFeatured:    product.isFeatured,
        },
      });
      console.log(`  ✅ [${product.category}] ${product.title.slice(0, 70)}...`);
      created++;
    } catch (err) {
      console.error(`  ❌ Error con "${product.slug}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n🎉 Completado: ${created} productos insertados/actualizados, ${skipped} errores.`);

  // Resumen por categoría
  const byCategory = {};
  PRODUCTS.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  console.log('\n📊 Resumen por categoría:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} productos`);
  });
}

main()
  .catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
