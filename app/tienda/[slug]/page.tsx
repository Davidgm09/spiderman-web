import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ExternalLink, Package, Zap } from "lucide-react"
import Image from "next/image"
import { getProductBySlug, getAllProducts, getProductsByCategory } from "@/data/products"
import { ProductContent } from "@/types/content"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe."
    }
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    keywords: product.keywords.join(", "),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
      type: "website"
    }
  }
}

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-black to-red-950/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="relative bg-gray-900/50 rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {product.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-600 text-lg px-3 py-1">
                    {product.discount}
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge className="absolute top-4 right-4 bg-gray-600 text-lg px-3 py-1">
                    Agotado
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-blue-600">{product.category}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {product.title}
                </h1>
                <p className="text-xl text-gray-300 mb-4">{product.subtitle}</p>
                
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-white font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">({product.reviews.toLocaleString()} reseñas)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-red-500">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>

                {/* Brand and SKU */}
                <div className="flex items-center space-x-6 mb-6 text-sm text-gray-400">
                  {product.brand && (
                    <div>
                      <span className="font-semibold">Marca:</span> {product.brand}
                    </div>
                  )}
                  {product.sku && (
                    <div>
                      <span className="font-semibold">SKU:</span> {product.sku}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    className={`w-full text-lg py-6 ${
                      product.inStock
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        : "bg-gray-600 cursor-not-allowed"
                    } text-white`}
                    disabled={!product.inStock}
                    asChild={product.inStock}
                  >
                    {product.inStock ? (
                      <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="w-5 h-5 mr-3" />
                        Comprar en Amazon
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <>
                        <Package className="w-5 h-5 mr-3" />
                        Agotado
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full text-lg py-6 border-red-600/50 text-white hover:bg-red-600/10">
                    <Heart className="w-5 h-5 mr-3" />
                    Agregar a Favoritos
                  </Button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm">Envío Gratis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Garantía Amazon</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-sm">30 días devolución</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-gradient-to-b from-red-950/10 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-red-600/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Descripción del Producto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {product.longDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-gray-900/50 border-red-600/20 mt-8">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                    Características Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">{feature.name}</h4>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Card className="bg-gray-900/50 border-red-600/20 mt-8">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Variantes Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {product.variants.map((variant, index) => (
                        <Card key={index} className="bg-gray-800/50 border-gray-600/20">
                          <CardContent className="p-4">
                            <h4 className="text-white font-semibold mb-2">{variant.name}</h4>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-red-500 font-bold">{variant.price}</span>
                                {variant.originalPrice && (
                                  <span className="text-gray-400 text-sm line-through ml-2">
                                    {variant.originalPrice}
                                  </span>
                                )}
                              </div>
                              <Badge className={variant.inStock ? "bg-green-600" : "bg-gray-600"}>
                                {variant.inStock ? "Disponible" : "Agotado"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Specifications */}
            <div>
              {product.specifications && (
                <Card className="bg-gray-900/50 border-red-600/20">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Especificaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <span className="text-gray-400 text-sm">{key}:</span>
                          <span className="text-white text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              <Card className="bg-gray-900/50 border-red-600/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Etiquetas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-black to-red-950/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="bg-gray-900/50 border-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {relatedProduct.discount && (
                        <Badge className="absolute top-2 left-2 bg-red-600">
                          {relatedProduct.discount}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 ml-2">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-red-500">
                          {relatedProduct.price}
                        </span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {relatedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      asChild
                    >
                      <a href={`/tienda/${relatedProduct.slug}`}>
                        Ver Producto
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 bg-gray-900/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            * Enlaces de afiliado - Ganamos una pequeña comisión sin costo extra para ti cuando compras a través de nuestros enlaces.
            Esto nos ayuda a mantener el sitio web y seguir ofreciendo contenido de calidad sobre Spider-Man.
          </p>
        </div>
      </section>
    </div>
  )
} 