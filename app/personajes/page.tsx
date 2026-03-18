import { Metadata } from 'next';
import { characterService } from '@/lib/database';
import { CharacterGrid } from '@/components/characters/CharacterCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Star, Zap, Shield, Image, Clock, Skull, Calendar, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { InContentAd, SidebarAd } from '@/components/ads/GoogleAdsense';
import { AmazonProduct } from '@/components/affiliate/AmazonProduct';
import { AMAZON_TAG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Personajes de Spider-Man y Marvel | Spider-World',
  description: 'Descubre todos los personajes de Spider-Man y Marvel con información completa, imágenes oficiales y productos. Spider-Verse, villanos, héroes y más.',
  keywords: ['Spider-Man personajes', 'Marvel characters', 'Spider-Verse', 'Spider-Gwen', 'Miles Morales', 'personajes Marvel', 'base de datos personajes'],
  openGraph: {
    title: 'Personajes de Spider-Man y Marvel | Spider-World',
    description: 'Explora todos los personajes del Spider-Verse y Marvel con información completa y productos oficiales',
    type: 'website',
  }
};

// Función para obtener grupos de personajes desde la base de datos
async function getCharacterGroups() {
  try {
    const [spiderVerse, spiderVillains, marvelUniverse] = await Promise.all([
      characterService.getSpiderVerse(15),
      characterService.getSpiderVillains(15), 
      characterService.getMarvelUniverse(15)
    ]);

    return {
      spiderVerse: spiderVerse || [],
      spiderVillains: spiderVillains || [],
      marvelUniverse: marvelUniverse || []
    };
  } catch (error) {
    console.error('Error fetching characters from database:', error);
    return {
      spiderVerse: [],
      spiderVillains: [],
      marvelUniverse: []
    };
  }
}

export default async function PersonajesPage() {
  const { spiderVerse, spiderVillains, marvelUniverse } = await getCharacterGroups();

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-red-900/30 via-black to-blue-900/30">
        <div className="absolute inset-0 bg-[url('/images/spider-web-pattern.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
              Personajes de Spider-Man
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Todos los personajes del Spider-Verse y Marvel Universe con información completa y organizada. 
              Descubre héroes, villanos y encuentra sus productos oficiales.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-red-400" />
                <span>Base de datos actualizada</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-blue-400" />
                <span>Imágenes Oficiales de Alta Calidad</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-900/20 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{spiderVerse.length + spiderVillains.length + marvelUniverse.length}+ personajes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Spider-Verse Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-red-500" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    Spider-Verse
                  </h2>
                  <Zap className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Los arácnidos más poderosos del multiverso Marvel. Desde el clásico Spider-Man hasta los nuevos héroes del Spider-Verse.
                </p>
              </div>
          
              <CharacterGrid 
                characters={spiderVerse}
                title=""
                maxItems={15}
              />
            </section>

            {/* Spider-Villains Section */}
            <section className="py-16 border-t border-gray-800">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Skull className="w-8 h-8 text-red-600" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    Villanos de Spider-Man
                  </h2>
                  <Skull className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Los enemigos más peligrosos y icónicos del Arácnido. Desde el Green Goblin hasta Venom.
                </p>
              </div>
          
              <CharacterGrid 
                characters={spiderVillains}
                title=""
                maxItems={15}
              />
            </section>

            {/* Marvel Universe Section */}
            <section className="py-16 border-t border-gray-800">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Marvel Universe
                  </h2>
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Los héroes más icónicos del universo Marvel. Desde los Vengadores hasta los defensores de la Tierra.
                </p>
              </div>
          
              <CharacterGrid 
                characters={marvelUniverse}
                title=""
                maxItems={15}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Ad */}
              <SidebarAd />
              
              {/* Productos Recomendados */}
              <div className="bg-gray-900/30 rounded-lg p-6 border border-red-600/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🦸‍♂️ Productos de Personajes
                </h3>
                <div className="space-y-4">
                  <AmazonProduct
                    title="Spider-Man Action Figure Collection"
                    description="Figuras oficiales de acción de Spider-Man y villanos"
                    price="$34.99"
                    originalPrice="$49.99"
                    discount={30}
                    category="Figura"
                    tags={['Spider-Man', 'Action Figure', 'Marvel']}
                    searchQuery="Spider-Man action figures Marvel official"
                    className="max-w-none"
                  />
                  <AmazonProduct
                    title="Marvel Character Encyclopedia"
                    description="Guía completa de todos los personajes Marvel"
                    price="$24.99"
                    category="Libro"
                    tags={['Marvel', 'Encyclopedia', 'Characters']}
                    searchQuery="Marvel character encyclopedia book"
                    className="max-w-none"
                  />
                  <AmazonProduct
                    title="Spider-Verse Poster Collection"
                    description="Pósters oficiales de personajes del Spider-Verse"
                    price="$19.99"
                    originalPrice="$29.99"
                    discount={33}
                    category="Póster"
                    tags={['Spider-Verse', 'Poster', 'Wall Art']}
                    searchQuery="Spider-Verse character posters official"
                    className="max-w-none"
                  />
                </div>
              </div>

              {/* Character Stats Section */}
              <div className="bg-gray-900/30 rounded-lg p-6 border border-red-600/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  📊 Estadísticas de Personajes
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spider-Verse:</span>
                    <span className="text-white font-semibold">{spiderVerse.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Villanos:</span>
                    <span className="text-white font-semibold">{spiderVillains.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Marvel Universe:</span>
                    <span className="text-white font-semibold">{marvelUniverse.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total personajes:</span>
                    <span className="text-white font-semibold">{spiderVerse.length + spiderVillains.length + marvelUniverse.length}</span>
                  </div>
                </div>
              </div>

              {/* Character Guide */}
              <div className="bg-gray-900/30 rounded-lg p-6 border border-red-600/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🕷️ Guía de Personajes
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Spider-Man (Peter)</span>
                    <span className="text-red-400">Clásico</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Miles Morales</span>
                    <span className="text-blue-400">Ultimate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Spider-Gwen</span>
                    <span className="text-purple-400">Spider-Verse</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Green Goblin</span>
                    <span className="text-green-400">Arch-Enemy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-red-600/20 to-blue-600/20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              ¿Listo para conocer más sobre tus personajes favoritos?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Encuentra figuras de acción, cómics y productos oficiales de todos los personajes Marvel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                asChild
              >
                <a 
                  href={`https://www.amazon.es/s?k=Spider-Man+Marvel+characters+figures&tag=${AMAZON_TAG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ver Productos de Personajes
                </a>
              </Button>
              <Link href="/comics">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Explorar Cómics
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 