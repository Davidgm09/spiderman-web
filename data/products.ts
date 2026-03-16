import { ProductContent } from "@/types/content"

export const products: ProductContent[] = [
  // FIGURAS DE ACCIÓN
  {
    id: "spider-man-ps4-advanced-suit-premium",
    slug: "spider-man-ps4-advanced-suit-premium",
    type: "product",
    title: "Figura Spider-Man PS4 Advanced Suit Premium",
    subtitle: "Figura de Acción Coleccionable Premium",
    description: "Figura de acción premium de Spider-Man con el icónico traje Advanced Suit del videojuego de PS4. Articulación completa y accesorios incluidos.",
    longDescription: "Esta impresionante figura de Spider-Man presenta el diseño del Advanced Suit del aclamado videojuego de PlayStation 4. Con articulación completa de 30 puntos, permite recrear las poses más dinámicas del trepamuros. Incluye múltiples accesorios intercambiables como manos adicionales, telarañas y base de exhibición. Fabricada con materiales de alta calidad y pintada a mano con detalles excepcionales. Una pieza imprescindible para cualquier coleccionista de Spider-Man.",
    image: "/products/spider-man-ps4-figure.jpg",
    category: "Figuras de Acción",
    subcategory: "Premium",
    brand: "Hot Toys",
    price: "$89.99",
    originalPrice: "$119.99",
    discount: "25% OFF",
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    features: [
      { name: "Articulación completa", description: "30 puntos de articulación para poses dinámicas" },
      { name: "Accesorios incluidos", description: "Manos intercambiables, telarañas y base de exhibición" },
      { name: "Edición limitada", description: "Numerada y con certificado de autenticidad" },
      { name: "Pintado a mano", description: "Detalles excepcionales y acabado premium" }
    ],
    amazonUrl: "https://amazon.com/spider-man-ps4-figure",
    sku: "HT-SM-PS4-001",
    tags: ["figura", "ps4", "advanced-suit", "premium", "hot-toys"],
    specifications: {
      "Altura": "30 cm",
      "Material": "PVC y ABS",
      "Articulación": "30 puntos",
      "Escala": "1/6",
      "Peso": "1.2 kg"
    },
    seoTitle: "Figura Spider-Man PS4 Advanced Suit Premium - Hot Toys Coleccionable",
    seoDescription: "Figura premium de Spider-Man PS4 Advanced Suit con articulación completa. Edición limitada Hot Toys con accesorios incluidos. ¡Envío gratis!",
    keywords: ["figura spider-man", "ps4", "advanced suit", "hot toys", "coleccionable", "premium"]
  },
  {
    id: "spider-man-classic-action-figure",
    slug: "spider-man-classic-action-figure",
    type: "product",
    title: "Figura Spider-Man Clásica Marvel Legends",
    subtitle: "Serie Marvel Legends Retro",
    description: "Figura de acción de Spider-Man en su diseño clásico de los cómics. Parte de la serie Marvel Legends con articulación superior.",
    longDescription: "Revive la era dorada de Spider-Man con esta figura de la serie Marvel Legends que captura perfectamente el diseño clásico del trepamuros. Con articulación de alta calidad y accesorios temáticos, es perfecta tanto para jugar como para exhibir. Incluye telarañas intercambiables y múltiples manos para recrear las poses más icónicas de los cómics clásicos.",
    image: "/products/spider-man-classic-figure.jpg",
    category: "Figuras de Acción",
    subcategory: "Marvel Legends",
    brand: "Hasbro",
    price: "$24.99",
    originalPrice: "$29.99",
    discount: "17% OFF",
    rating: 4.6,
    reviews: 892,
    inStock: true,
    features: [
      { name: "Diseño clásico", description: "Basado en los cómics originales de Spider-Man" },
      { name: "Articulación superior", description: "22 puntos de articulación Marvel Legends" },
      { name: "Accesorios incluidos", description: "Telarañas y manos intercambiables" },
      { name: "Compatible", description: "Compatible con otras figuras Marvel Legends" }
    ],
    amazonUrl: "https://amazon.com/spider-man-classic-figure",
    sku: "HSB-ML-SM-001",
    tags: ["figura", "clásico", "marvel-legends", "hasbro", "cómics"],
    specifications: {
      "Altura": "15 cm",
      "Material": "PVC",
      "Articulación": "22 puntos",
      "Escala": "1/12",
      "Peso": "200g"
    },
    seoTitle: "Figura Spider-Man Clásica Marvel Legends - Hasbro Coleccionable",
    seoDescription: "Figura Spider-Man clásica Marvel Legends con articulación superior. Diseño basado en los cómics originales. ¡Mejor precio garantizado!",
    keywords: ["figura spider-man", "clásico", "marvel legends", "hasbro", "cómics", "articulación"]
  },

  // ROPA Y ACCESORIOS
  {
    id: "camiseta-spider-man-vintage-comic",
    slug: "camiseta-spider-man-vintage-comic",
    type: "product",
    title: "Camiseta Spider-Man Vintage Comic Style",
    subtitle: "Diseño Retro Oficial Marvel",
    description: "Camiseta oficial de Spider-Man con diseño vintage inspirado en los cómics clásicos. 100% algodón premium con estampado de alta calidad.",
    longDescription: "Lleva el estilo clásico de Spider-Man con esta camiseta vintage que rinde homenaje a los cómics originales. Fabricada en algodón 100% premium para máxima comodidad y durabilidad. El diseño presenta gráficos retro de alta calidad que no se desvanecen con el tiempo. Disponible en múltiples tallas desde S hasta XXL. Perfecta para fans de todas las edades que aprecian el arte clásico de Spider-Man.",
    image: "/products/spider-man-vintage-tshirt.jpg",
    category: "Ropa y Accesorios",
    subcategory: "Camisetas",
    brand: "Marvel",
    price: "$24.99",
    originalPrice: "$34.99",
    discount: "29% OFF",
    rating: 4.6,
    reviews: 1534,
    inStock: true,
    features: [
      { name: "100% Algodón", description: "Material premium suave y transpirable" },
      { name: "Diseño oficial", description: "Licencia oficial Marvel con gráficos auténticos" },
      { name: "Tallas S-XXL", description: "Amplia gama de tallas disponibles" },
      { name: "Estampado duradero", description: "Resistente al lavado y decoloración" }
    ],
    variants: [
      {
        name: "Talla S",
        price: "$24.99",
        originalPrice: "$34.99",
        image: "/products/spider-man-vintage-tshirt-s.jpg",
        inStock: true,
        sku: "MRV-SM-VT-S"
      },
      {
        name: "Talla M",
        price: "$24.99",
        originalPrice: "$34.99",
        image: "/products/spider-man-vintage-tshirt-m.jpg",
        inStock: true,
        sku: "MRV-SM-VT-M"
      },
      {
        name: "Talla L",
        price: "$24.99",
        originalPrice: "$34.99",
        image: "/products/spider-man-vintage-tshirt-l.jpg",
        inStock: true,
        sku: "MRV-SM-VT-L"
      }
    ],
    amazonUrl: "https://amazon.com/spider-man-vintage-tshirt",
    sku: "MRV-SM-VT-001",
    tags: ["camiseta", "vintage", "cómics", "marvel", "oficial"],
    specifications: {
      "Material": "100% Algodón",
      "Tipo": "Manga corta",
      "Cuello": "Redondo",
      "Cuidado": "Lavado a máquina",
      "Origen": "Producto oficial Marvel"
    },
    seoTitle: "Camiseta Spider-Man Vintage Comic - Diseño Retro Oficial Marvel",
    seoDescription: "Camiseta Spider-Man vintage con diseño retro de cómics clásicos. 100% algodón premium, licencia oficial Marvel. ¡Envío gratis!",
    keywords: ["camiseta spider-man", "vintage", "retro", "cómics", "marvel", "oficial", "algodón"]
  },
  {
    id: "sudadera-spider-man-hoodie-premium",
    slug: "sudadera-spider-man-hoodie-premium",
    type: "product",
    title: "Sudadera Spider-Man Hoodie Premium",
    subtitle: "Sudadera con Capucha Premium",
    description: "Sudadera premium de Spider-Man con capucha ajustable y bolsillo canguro. Mezcla de algodón de alta calidad para máximo confort.",
    longDescription: "Mantente abrigado con estilo con esta sudadera premium de Spider-Man. Fabricada con una mezcla de algodón de alta calidad que proporciona calidez sin sacrificar la transpirabilidad. Cuenta con capucha ajustable con cordones, bolsillo canguro frontal y puños elásticos. El diseño presenta el logo clásico de Spider-Man bordado con detalles de alta calidad. Perfecta para el uso diario o para mostrar tu amor por el trepamuros.",
    image: "/products/spider-man-hoodie-premium.jpg",
    category: "Ropa y Accesorios",
    subcategory: "Sudaderas",
    brand: "Marvel",
    price: "$59.99",
    originalPrice: "$79.99",
    discount: "25% OFF",
    rating: 4.7,
    reviews: 723,
    inStock: true,
    features: [
      { name: "Capucha ajustable", description: "Con cordones para ajuste personalizado" },
      { name: "Bolsillo canguro", description: "Bolsillo frontal espacioso y funcional" },
      { name: "Algodón premium", description: "Mezcla de algodón suave y duradero" },
      { name: "Logo bordado", description: "Diseño Spider-Man bordado de alta calidad" }
    ],
    amazonUrl: "https://amazon.com/spider-man-hoodie-premium",
    sku: "MRV-SM-HD-001",
    tags: ["sudadera", "hoodie", "premium", "marvel", "capucha"],
    specifications: {
      "Material": "80% Algodón, 20% Poliéster",
      "Tipo": "Sudadera con capucha",
      "Bolsillos": "1 bolsillo canguro",
      "Cuidado": "Lavado a máquina agua fría",
      "Ajuste": "Regular fit"
    },
    seoTitle: "Sudadera Spider-Man Hoodie Premium - Algodón de Alta Calidad",
    seoDescription: "Sudadera Spider-Man premium con capucha ajustable y bolsillo canguro. Mezcla de algodón de alta calidad. ¡Oferta especial!",
    keywords: ["sudadera spider-man", "hoodie", "premium", "capucha", "marvel", "algodón"]
  },

  // COLECCIONABLES Y FUNKOS
  {
    id: "funko-pop-spider-man-miles-morales",
    slug: "funko-pop-spider-man-miles-morales",
    type: "product",
    title: "Funko Pop Spider-Man Miles Morales",
    subtitle: "Edición Especial Coleccionable",
    description: "Funko Pop de Miles Morales Spider-Man en su traje clásico. Edición especial numerada con caja protectora incluida.",
    longDescription: "Añade a Miles Morales a tu colección con este increíble Funko Pop que captura perfectamente su icónico traje de Spider-Man. Esta edición especial viene numerada y incluye una caja protectora para mantener tu figura en perfectas condiciones. Con los detalles característicos de Funko Pop y la calidad que los coleccionistas esperan. Una pieza esencial para cualquier fan de Spider-Verse o coleccionista de Funko Pop.",
    image: "/products/funko-pop-miles-morales.jpg",
    category: "Funkos y Coleccionables",
    subcategory: "Funko Pop",
    brand: "Funko",
    price: "$12.99",
    originalPrice: "$15.99",
    discount: "19% OFF",
    rating: 4.9,
    reviews: 2156,
    inStock: true,
    features: [
      { name: "Edición especial", description: "Numerada y con características únicas" },
      { name: "Caja protectora", description: "Incluye protector de caja transparente" },
      { name: "Numerado", description: "Cada figura tiene número de serie único" },
      { name: "Coleccionable", description: "Perfecto para coleccionistas Funko" }
    ],
    amazonUrl: "https://amazon.com/funko-pop-miles-morales",
    sku: "FNK-SM-MM-001",
    tags: ["funko", "pop", "miles-morales", "spider-verse", "coleccionable"],
    specifications: {
      "Altura": "9.5 cm",
      "Material": "Vinilo",
      "Número": "#765",
      "Serie": "Spider-Man",
      "Peso": "150g"
    },
    seoTitle: "Funko Pop Miles Morales Spider-Man - Edición Especial Numerada",
    seoDescription: "Funko Pop Miles Morales Spider-Man edición especial con caja protectora. Numerado y perfecto para coleccionistas. ¡Precio especial!",
    keywords: ["funko pop", "miles morales", "spider-man", "coleccionable", "edición especial", "numerado"]
  },
  {
    id: "funko-pop-spider-man-venom",
    slug: "funko-pop-spider-man-venom",
    type: "product",
    title: "Funko Pop Venom Spider-Man",
    subtitle: "Simbionte Clásico Coleccionable",
    description: "Funko Pop de Venom en su forma clásica. Figura detallada del icónico simbionte enemigo de Spider-Man con acabado brillante.",
    longDescription: "El icónico villano Venom llega a tu colección con este impresionante Funko Pop que captura toda la amenaza del simbionte. Con detalles excepcionales incluyendo su característica lengua larga, dientes afilados y el acabado brillante que le da vida. Esta figura es perfecta tanto para fans de Spider-Man como para coleccionistas de villanos Marvel. Viene en su caja original con ventana para exhibición.",
    image: "/products/funko-pop-venom.jpg",
    category: "Funkos y Coleccionables",
    subcategory: "Funko Pop",
    brand: "Funko",
    price: "$13.99",
    originalPrice: "$16.99",
    discount: "18% OFF",
    rating: 4.8,
    reviews: 3247,
    inStock: true,
    features: [
      { name: "Diseño detallado", description: "Captura perfectamente la apariencia de Venom" },
      { name: "Acabado brillante", description: "Superficie brillante que refleja la naturaleza del simbionte" },
      { name: "Lengua articulada", description: "Lengua característica de Venom incluida" },
      { name: "Caja original", description: "Viene en caja Funko Pop original para exhibición" }
    ],
    amazonUrl: "https://amazon.com/funko-pop-venom",
    sku: "FNK-VN-CL-001",
    tags: ["funko", "pop", "venom", "simbionte", "villano", "spider-man"],
    specifications: {
      "Altura": "9.5 cm",
      "Material": "Vinilo",
      "Número": "#363",
      "Serie": "Marvel",
      "Peso": "160g"
    },
    seoTitle: "Funko Pop Venom Spider-Man - Simbionte Clásico Coleccionable",
    seoDescription: "Funko Pop Venom con diseño detallado y acabado brillante. Figura del icónico villano de Spider-Man. ¡Mejor precio online!",
    keywords: ["funko pop", "venom", "simbionte", "spider-man", "villano", "marvel", "coleccionable"]
  },

  // JUGUETES Y GADGETS
  {
    id: "mascara-spider-man-electronica",
    slug: "mascara-spider-man-electronica",
    type: "product",
    title: "Máscara Spider-Man Electrónica",
    subtitle: "Con Efectos de Sonido y Luces LED",
    description: "Máscara electrónica de Spider-Man con efectos de sonido auténticos y ojos LED que se iluminan. Ajustable para diferentes tamaños.",
    longDescription: "Conviértete en Spider-Man con esta increíble máscara electrónica que incluye efectos de sonido auténticos de las películas y ojos LED que se iluminan como en los cómics. La máscara es completamente ajustable para adaptarse a diferentes tamaños de cabeza, tanto para niños como adultos. Incluye múltiples frases y sonidos de Spider-Man, así como efectos de telarañas. Funciona con baterías AAA (incluidas) y cuenta con controles fáciles de usar.",
    image: "/products/spider-man-electronic-mask.jpg",
    category: "Juguetes y Gadgets",
    subcategory: "Máscaras",
    brand: "Hasbro",
    price: "$79.99",
    originalPrice: "$99.99",
    discount: "20% OFF",
    rating: 4.5,
    reviews: 445,
    inStock: false,
    features: [
      { name: "Efectos de sonido", description: "Frases y sonidos auténticos de Spider-Man" },
      { name: "Ojos LED", description: "Ojos que se iluminan con efectos especiales" },
      { name: "Ajustable", description: "Se adapta a diferentes tamaños de cabeza" },
      { name: "Baterías incluidas", description: "Funciona con 3 baterías AAA incluidas" }
    ],
    amazonUrl: "https://amazon.com/spider-man-electronic-mask",
    sku: "HSB-SM-EM-001",
    tags: ["máscara", "electrónica", "sonidos", "led", "hasbro", "juguete"],
    specifications: {
      "Material": "Plástico ABS",
      "Baterías": "3x AAA (incluidas)",
      "Edad": "5+ años",
      "Ajuste": "Circunferencia 52-60cm",
      "Peso": "400g"
    },
    seoTitle: "Máscara Spider-Man Electrónica - Efectos Sonido y Luces LED",
    seoDescription: "Máscara Spider-Man electrónica con sonidos auténticos y ojos LED. Ajustable para niños y adultos. ¡Baterías incluidas!",
    keywords: ["máscara spider-man", "electrónica", "sonidos", "led", "juguete", "hasbro", "efectos"]
  },
  {
    id: "lanzador-telaranas-spider-man",
    slug: "lanzador-telaranas-spider-man",
    type: "product",
    title: "Lanzador de Telarañas Spider-Man",
    subtitle: "Web Shooter Oficial con Proyectiles",
    description: "Lanzador de telarañas oficial de Spider-Man con proyectiles seguros. Incluye múltiples cartuchos de telarañas y correa ajustable.",
    longDescription: "Experimenta el poder de Spider-Man con este lanzador de telarañas oficial que dispara proyectiles seguros de espuma. Incluye correa ajustable para la muñeca y múltiples cartuchos de telarañas recargables. El diseño está basado en los web shooters de las películas más recientes, con detalles auténticos y mecanismo de disparo realista. Perfecto para juegos de rol y aventuras de superhéroes. Recomendado para edades de 6 años en adelante.",
    image: "/products/spider-man-web-shooter.jpg",
    category: "Juguetes y Gadgets",
    subcategory: "Accesorios",
    brand: "Marvel",
    price: "$34.99",
    originalPrice: "$44.99",
    discount: "22% OFF",
    rating: 4.4,
    reviews: 567,
    inStock: true,
    features: [
      { name: "Proyectiles seguros", description: "Telarañas de espuma suave y segura" },
      { name: "Correa ajustable", description: "Se adapta a diferentes tamaños de muñeca" },
      { name: "Cartuchos recargables", description: "Incluye 6 cartuchos de telarañas adicionales" },
      { name: "Diseño auténtico", description: "Basado en los web shooters de las películas" }
    ],
    amazonUrl: "https://amazon.com/spider-man-web-shooter",
    sku: "MRV-SM-WS-001",
    tags: ["lanzador", "telarañas", "web-shooter", "juguete", "marvel", "proyectiles"],
    specifications: {
      "Material": "Plástico ABS",
      "Proyectiles": "6 telarañas de espuma",
      "Edad": "6+ años",
      "Alcance": "Hasta 3 metros",
      "Peso": "250g"
    },
    seoTitle: "Lanzador Telarañas Spider-Man - Web Shooter Oficial con Proyectiles",
    seoDescription: "Lanzador de telarañas Spider-Man oficial con proyectiles seguros y cartuchos recargables. ¡Diversión garantizada!",
    keywords: ["lanzador telarañas", "web shooter", "spider-man", "juguete", "proyectiles", "marvel"]
  },

  // ACCESORIOS
  {
    id: "mochila-spider-man-web-design",
    slug: "mochila-spider-man-web-design",
    type: "product",
    title: "Mochila Spider-Man Web Shooter Design",
    subtitle: "Diseño Ergonómico Resistente al Agua",
    description: "Mochila de Spider-Man con diseño inspirado en los web shooters. Resistente al agua con múltiples compartimentos y diseño ergonómico.",
    longDescription: "Lleva tus pertenencias con estilo superheroico con esta mochila de Spider-Man inspirada en el diseño de los web shooters. Fabricada con materiales resistentes al agua para proteger tus objetos en cualquier clima. Cuenta con múltiples compartimentos organizadores, incluyendo un compartimento acolchado para laptop de hasta 15 pulgadas. Las correas acolchadas y el panel trasero ergonómico proporcionan comodidad durante todo el día. Perfecta para la escuela, trabajo o aventuras urbanas.",
    image: "/products/spider-man-backpack.jpg",
    category: "Ropa y Accesorios",
    subcategory: "Mochilas",
    brand: "Marvel",
    price: "$45.99",
    originalPrice: "$59.99",
    discount: "23% OFF",
    rating: 4.7,
    reviews: 634,
    inStock: true,
    features: [
      { name: "Resistente al agua", description: "Material impermeable para protección total" },
      { name: "Múltiples compartimentos", description: "Organización perfecta para todos tus objetos" },
      { name: "Diseño ergonómico", description: "Correas acolchadas y panel trasero cómodo" },
      { name: "Compartimento laptop", description: "Espacio acolchado para laptops hasta 15 pulgadas" }
    ],
    amazonUrl: "https://amazon.com/spider-man-backpack",
    sku: "MRV-SM-BP-001",
    tags: ["mochila", "spider-man", "resistente-agua", "ergonómica", "laptop"],
    specifications: {
      "Material": "Poliéster resistente al agua",
      "Capacidad": "25 litros",
      "Dimensiones": "45x30x15 cm",
      "Laptop": "Hasta 15 pulgadas",
      "Peso": "800g"
    },
    seoTitle: "Mochila Spider-Man Web Design - Resistente Agua y Ergonómica",
    seoDescription: "Mochila Spider-Man resistente al agua con diseño ergonómico y compartimento para laptop. Múltiples compartimentos organizadores.",
    keywords: ["mochila spider-man", "resistente agua", "ergonómica", "laptop", "compartimentos", "marvel"]
  }
]

// Funciones helper para trabajar con productos
export function getProductBySlug(slug: string): ProductContent | undefined {
  return products.find(product => product.slug === slug)
}

export function getAllProducts(): ProductContent[] {
  return products
}

export function getProductsByCategory(category: string): ProductContent[] {
  return products.filter(product => product.category === category)
}

export function getFeaturedProducts(): ProductContent[] {
  return products.filter(product => product.inStock).slice(0, 6)
}

export function getProductsOnSale(): ProductContent[] {
  return products.filter(product => product.discount && product.inStock)
}

export function getBestSellingProducts(): ProductContent[] {
  return products.sort((a, b) => b.reviews - a.reviews).slice(0, 3)
}

export function getProductCategories() {
  const categories = [...new Set(products.map(product => product.category))]
  return categories.map(category => ({
    name: category,
    count: products.filter(product => product.category === category).length,
    color: getCategoryColor(category)
  }))
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    "Figuras de Acción": "red",
    "Ropa y Accesorios": "blue", 
    "Funkos y Coleccionables": "purple",
    "Juguetes y Gadgets": "green"
  }
  return colorMap[category] || "gray"
}

export function getProductUrl(product: ProductContent): string {
  return `/tienda/${product.slug}`
} 