/**
 * Script: fix-tienda-images.js
 * Corrige las URLs de imágenes rotas en los productos de la tienda.
 * Uso: node scripts/fix-tienda-images.js
 */

require('dotenv').config();
const { Pool } = require('pg');

// Transaction-mode pooler (port 6543) avoids prepared-statement conflicts
const pool = new Pool({
  connectionString: (process.env.DATABASE_URL || '').replace(':5432/', ':6543/'),
  ssl: { rejectUnauthorized: false },
});

const IMAGE_FIXES = [
  // ── FUNKO POPS ──────────────────────────────────────────────────────────────
  {
    slug: 'funko-pop-miles-morales-spider-verse-402',
    image: 'https://www.popfigures.com/cdn/shop/products/image_d787e4df-5592-4038-ae5d-0616ceb1c323.jpg?v=1655996501',
  },
  {
    slug: 'funko-pop-spider-gwen-spider-verse-405',
    image: 'https://pop-figures.com/media/img/figurine/405-funko-pop-figure-spider-man-into-the-spiderverse-spider-gwen-into-the-spider-verse.jpg',
  },
  {
    slug: 'funko-pop-spider-man-noir-spider-verse-406',
    image: 'https://pop-figures.com/media/img/figurine/406-funko-pop-figure-spider-man-into-the-spiderverse-spider-man-noir-with-hat.jpg',
  },
  {
    slug: 'funko-pop-spider-man-traje-casero-homecoming',
    image: 'https://www.popfigures.com/cdn/shop/files/Spider-Man_220_Funko_Pop_-_Spider-Man_Homecoming_-_Asia_Exclusive_Front.jpg?v=1757514236',
  },
  {
    slug: 'funko-pop-spider-man-primera-aparicion-diamond-glitter-593',
    image: 'https://realpopmania.com/cdn/shop/products/4_2e7bcb0b-0e26-4142-8605-e56a99a5c93c.png?v=1678269937',
  },
  // ── FIGURAS MARVEL LEGENDS ──────────────────────────────────────────────────
  {
    slug: 'hasbro-spider-man-bend-flex-15cm',
    image: 'https://www.toyshnip.com/cdn/shop/files/spider-man-bend-and-flex-spider-man-action-figure-hasbro-toyshnip-719010.jpg?v=1759282115',
  },
  // ── CÓMICS ──────────────────────────────────────────────────────────────────
  {
    slug: 'el-asombroso-spiderman-2-voces-del-pasado-marvel-saga',
    image: 'https://www.milcomics.com/1057514-thickbox_default/marvel-saga-el-asombroso-spiderman-06-pecados-del-pasado.jpg',
  },
  {
    slug: 'spiderman-azul-jeph-loeb-tim-sale-panini',
    image: 'https://www.milcomics.com/1275796-thickbox_default/spiderman-azul-comic-100-marvel-hc-nueva-edicion.jpg',
  },
  {
    slug: 'miles-morales-nuevo-spiderman-vol-1-bendis-panini',
    image: 'https://www.milcomics.com/1029262-thickbox_default/ultimate-integral-miles-morales-spider-man-01-el-nuevo-spiderman.jpg',
  },
  {
    slug: 'spiderman-ultima-caceria-kraven-must-have-panini',
    image: 'https://tienda.tomosygrapas.com/47057-large_default/marvel-must-have-spiderman-la-ultima-caceria-de-kraven.jpg',
  },
  {
    slug: 'el-asombroso-spider-man-roger-stern-marvel-heroes-panini',
    image: 'https://www.milcomics.com/1243188-thickbox_default/marvel-heroes-69-el-asombroso-spiderman-de-roger-stern-y-romita-jr-edicion-definitiva.jpg',
  },
  {
    slug: 'el-superior-spider-man-1-gran-cerebro-dan-slott-panini',
    image: 'https://www.milcomics.com/1233883-thickbox_default/marvel-saga-el-asombroso-spiderman-39-spiderman-superior-mi-peor-enemigo.jpg',
  },
  {
    slug: 'spider-man-maximum-carnage-panini',
    image: 'https://www.milcomics.com/1254219-thickbox_default/marvel-heroes-el-asombroso-spiderman-matanza-maxima.jpg',
  },
  {
    slug: 'amazing-spider-man-omnibus-vol-1-stan-lee-ditko',
    image: 'https://www.milcomics.com/834048-large_default/amazing-spiderman-omnibus-marvel-usa-comic-vo.jpg',
  },
  // ── ROPA ────────────────────────────────────────────────────────────────────
  {
    slug: 'marvel-spider-man-sudadera-capucha-hombre',
    image: 'https://heroesvillains.com/cdn/shop/files/HDA7046USM_001_grande.png?v=1762308552',
  },
  {
    slug: 'marvel-spider-man-pijama-nino-conjunto-2-piezas',
    image: 'https://imagikids.com/cdn/shop/files/marvel-spider-man-pajama-shirt-and-pants-sleep-set-582292.jpg?v=1718646531',
  },
  {
    slug: 'marvel-spider-man-pack-3-calcetines-hombre',
    image: 'https://frikigeek.com/wp-content/uploads/2024/05/41jqcWTYKQL._SL500_.jpg',
  },
  {
    slug: 'marvel-spider-man-camiseta-manga-larga-nino',
    image: 'https://imagikids.com/cdn/shop/files/marvel-spider-man-2-pack-long-sleeve-t-shirts-288242.jpg?v=1718646495',
  },
  // ── ACCESORIOS ──────────────────────────────────────────────────────────────
  {
    slug: 'disney-marvel-spider-man-botella-aluminio-600ml',
    image: 'https://www.polargear.com/wp-content/uploads/2023/07/Marvel-Spider-Man-Drinks-Bottle-600ml.webp',
  },
  {
    slug: 'marvel-spider-man-billetera-cuero-vegano',
    image: 'https://hero-land.com/cdn/shop/files/1_5_1_2024_12_22_48_547.png?v=1708363688',
  },
  {
    slug: 'stor-spider-man-sandwichera-infantil-3-compartimentos',
    image: 'https://lafrikileria.com/153158-large_default/fiambrera-sandwichera-spiderman-marvel.jpg',
  },
  // ── JUGUETES ────────────────────────────────────────────────────────────────
  {
    slug: 'hasbro-marvel-spider-man-mascara-electronica-miles-morales',
    image: 'https://goodbuygear.com/cdn/shop/products/045ffd15a6fcf6f70f333eeb67b02864.jpg?v=1571344612',
  },
  {
    slug: 'hasbro-marvel-spider-man-spider-mobile-miles-morales',
    image: 'https://www.maziply.com/cdn/shop/products/marvel-spider-man-spider-mobile-6-inch-scale-vehicle-and-miles-morales-figure-main_grande.jpg?v=1759274149',
  },
  {
    slug: 'marvel-spider-man-peluche-hablador-30cm',
    image: 'https://floridagifts.com/cdn/shop/files/spider-man-plush-33073941315768.png?v=1692809743',
  },
  // ── IMÁGENES ROTAS — reemplazadas con imágenes de Amazon ────────────────────
  {
    slug: 'lego-marvel-76178-daily-bugle-coleccionista',
    image: 'https://m.media-amazon.com/images/I/81ZyiKnKhRL._AC_SL1500_.jpg',
  },
  {
    slug: 'hasbro-marvel-legends-spider-gwen-across-spider-verse',
    image: 'https://m.media-amazon.com/images/I/91F8GK7va-L._AC_SL1500_.jpg',
  },
  {
    slug: 'hasbro-marvel-legends-retro-spider-man-clasico',
    image: 'https://m.media-amazon.com/images/I/815k5V8u7gL._AC_SL1500_.jpg',
  },
  {
    slug: 'paladone-marvel-spider-man-taza-ceramica-550ml',
    image: 'https://m.media-amazon.com/images/I/51jc4Q5M0nL._AC_SL1500_.jpg',
  },
  {
    slug: 'marvel-spider-man-miles-morales-gorro-beanie-adulto',
    image: 'https://m.media-amazon.com/images/I/81xeCMNx3-L._AC_SL1500_.jpg',
  },
  {
    slug: 'marvel-comics-spider-man-llavero-metalico',
    image: 'https://m.media-amazon.com/images/I/51g6jv1lnKL._AC_SL1000_.jpg',
  },
  {
    slug: 'hasbro-marvel-spider-man-web-shooter-gear-lanzarredes',
    image: 'https://m.media-amazon.com/images/I/71u-CCsvpRL._AC_SL1024_.jpg',
  },
  {
    slug: 'hasbro-spider-man-guante-lanzatelaranas-electronico',
    image: 'https://m.media-amazon.com/images/I/71BvoYNAyeL._AC_SX679_.jpg',
  },
];

async function main() {
  console.log(`\n🖼️  Corrigiendo ${IMAGE_FIXES.length} imágenes de productos...\n`);
  let ok = 0, err = 0;

  const client = await pool.connect();
  try {
    for (const fix of IMAGE_FIXES) {
      try {
        const res = await client.query(
          'UPDATE products SET image = $1, "updatedAt" = NOW() WHERE slug = $2',
          [fix.image, fix.slug]
        );
        if (res.rowCount > 0) {
          console.log(`  ✅ ${fix.slug}`);
          ok++;
        } else {
          console.log(`  ⚠️  No encontrado: ${fix.slug}`);
          err++;
        }
      } catch (e) {
        console.error(`  ❌ ${fix.slug}: ${e.message}`);
        err++;
      }
    }
  } finally {
    client.release();
  }

  console.log(`\n🎉 ${ok} imágenes corregidas, ${err} errores.\n`);
}

main()
  .catch(e => { console.error('Error fatal:', e); process.exit(1); })
  .finally(() => pool.end());
