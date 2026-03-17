import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Filter } from "lucide-react"
import Image from "next/image"
import { InContentAd, SidebarAd } from "@/components/ads/GoogleAdsense"
import { productService } from "@/lib/database"
import type { Metadata } from "next"
import { Product } from "@prisma/client"

export const metadata: Metadata = {
  title: "Tienda Spider-Man - Figuras, Camisetas, Funkos y Más | Spider-World",
  description:
    "Los mejores productos oficiales de Spider-Man con descuentos exclusivos. Figuras, camisetas, funkos, mochilas y más. Envío rápido y garantía Amazon.",
  keywords: ["tienda Spider-Man", "productos Spider-Man", "figuras Spider-Man", "camisetas Marvel", "funkos", "merchandising"]
}

// Función para obtener categorías con conteo
function getCategoriesWithCount(products: Product[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  products.forEach(product => {
    if (product.category) {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    }
  });
  
  return Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    color: getColorForCategory(name)
  }));
}

// Función para asignar colores a categorías
function getColorForCategory(category: string): string {
  const colorMap: { [key: string]: string } = {
    'Figuras': 'red',
    'Ropa': 'blue',
    'Accesorios': 'purple',
    'Juguetes': 'green',
    'Coleccionables': 'orange',
    'Tecnología': 'yellow'
  };
  
  return colorMap[category] || 'gray';
}

// Función para formatear características
function formatFeatures(features: string | string[]): string[] {
  if (Array.isArray(features)) {
    return features;
  }
  if (typeof features === 'string') {
    return features.split(',').map(f => f.trim());
  }
  return [];
}

// Función para generar URL de Amazon
function generateAmazonUrl(product: Product): string {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const query = encodeURIComponent(`${product.title} Spider-Man`);
  return `https://www.amazon.com/s?k=${query}&tag=${amazonTag}`;
}

export default async function TiendaPage() {
  // Obtener productos de la base de datos
  const allProducts = await productService.getAll();
  
  // Obtener productos destacados (los mejor valorados)
  const featuredProducts = allProducts.slice(0, 12);
  
  // Obtener los más vendidos (productos con más reviews)
  const bestSellers = [...allProducts]
    .sort((a, b) => parseInt(b.reviews || '0') - parseInt(a.reviews || '0'))
    .slice(0, 6);
  
  // Obtener categorías con conteo
  const categories = getCategoriesWithCount(allProducts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Header */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Tienda Spider-Man Oficial
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Los mejores productos oficiales de Spider-Man con descuentos exclusivos
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-red-600 text-white px-4 py-2">
              {allProducts.length} Productos
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Envío Gratis
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              Garantía Amazon
            </Badge>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center space-x-3 bg-gray-800/50 p-6 rounded-lg">
            <Truck className="w-8 h-8 text-green-500" />
            <div>
              <div className="font-semibold text-white">Envío Gratis</div>
              <div className="text-sm text-gray-400">En pedidos +$50</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-gray-800/50 p-6 rounded-lg">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <div className="font-semibold text-white">Garantía Amazon</div>
              <div className="text-sm text-gray-400">Productos oficiales</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-gray-800/50 p-6 rounded-lg">
            <RotateCcw className="w-8 h-8 text-purple-500" />
            <div>
              <div className="font-semibold text-white">Devoluciones</div>
              <div className="text-sm text-gray-400">30 días gratis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.count} productos</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-8">🔥 Más Vendidos Esta Semana</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {bestSellers.map((item) => (
            <div key={item.id} className="bg-gray-800/50 px-4 py-2 rounded-full border border-red-600/20">
              <span className="text-white font-medium">{item.title}</span>
              <span className="text-red-400 text-sm ml-2">• {parseInt(item.reviews || '0').toLocaleString()}+ vendidos</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InContentAd />
      </div>

      {/* Products Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Productos Destacados</h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group relative overflow-hidden"
            >
              {product.discount && (
                <Badge className="absolute top-2 left-2 bg-red-600 z-10">-{product.discount}%</Badge>
              )}
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="ghost" className="text-white hover:text-red-500 bg-black/50">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <Badge className="mb-2 bg-blue-600">{product.category}</Badge>
                <CardTitle className="text-white mb-2 text-lg leading-tight line-clamp-2">
                  {product.title}
                </CardTitle>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-2">({parseInt(product.reviews || '0').toLocaleString()})</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-red-500">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {product.features && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {formatFeatures(product.features).slice(0, 2).map((feature, i) => (
                        <li key={i} className="text-xs text-gray-400">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    asChild
                  >
                    <a href={`/tienda/${product.slug}`}>
                      Ver Producto
                    </a>
                  </Button>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    asChild
                  >
                    <a href={generateAmazonUrl(product)} target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar en Amazon
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            Ver Más Productos
          </Button>
        </div>
      </section>

      {/* Sidebar Ad */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SidebarAd />
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Estadísticas de la Tienda
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">{allProducts.length}</div>
              <div className="text-gray-400">Productos Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{categories.length}</div>
              <div className="text-gray-400">Categorías</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {Math.round(allProducts.reduce((total, product) => total + (product.rating || 0), 0) / allProducts.length * 10) / 10 || 0}
              </div>
              <div className="text-gray-400">Rating Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {allProducts.reduce((total, product) => total + parseInt(product.reviews || '0'), 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Reviews Totales</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
