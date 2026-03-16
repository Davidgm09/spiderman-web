'use client';

import { AmazonProduct, SpiderManComic, SpiderManMovie, SpiderManGame, SpiderManMerchandise } from './AmazonProduct';

interface RelatedProductsProps {
  contentType: 'character' | 'comic' | 'movie' | 'game';
  contentTitle: string;
  className?: string;
}

export function RelatedProducts({ contentType, contentTitle, className = '' }: RelatedProductsProps) {
  const getRelatedProducts = () => {
    switch (contentType) {
      case 'character':
        return [
          <SpiderManComic key="comic" title="Amazing Spider-Man" issue="1" year="2023" />,
          <SpiderManMerchandise key="figure" title="Spider-Man Action Figure" type="Figura" />,
          <SpiderManMovie key="movie" title="Spider-Man: No Way Home" year="2021" format="4K Blu-ray" />,
          <SpiderManMerchandise key="shirt" title="Spider-Man Logo T-Shirt" type="Ropa" />
        ];
      
      case 'comic':
        return [
          <SpiderManComic key="related1" title={contentTitle} />,
          <SpiderManComic key="related2" title="Spider-Man 2099" issue="1" />,
          <SpiderManMerchandise key="poster" title="Spider-Man Comic Poster" type="Poster" />,
          <SpiderManMerchandise key="collection" title="Spider-Man Comic Collection Box" type="Coleccionable" />
        ];
      
      case 'movie':
        return [
          <SpiderManMovie key="movie" title={contentTitle} year="2021" format="4K Blu-ray" />,
          <SpiderManMovie key="digital" title={contentTitle} year="2021" format="Digital" />,
          <SpiderManMerchandise key="soundtrack" title={`${contentTitle} Soundtrack`} type="Música" />,
          <SpiderManMerchandise key="poster" title={`${contentTitle} Movie Poster`} type="Poster" />
        ];
      
      case 'game':
        return [
          <SpiderManGame key="ps5" title={contentTitle} platform="PlayStation 5" />,
          <SpiderManGame key="xbox" title={contentTitle} platform="Xbox" />,
          <SpiderManMerchandise key="controller" title="Spider-Man Controller" type="Accesorio" />,
          <SpiderManMerchandise key="guide" title={`${contentTitle} Strategy Guide`} type="Guía" />
        ];
      
      default:
        return [
          <SpiderManMerchandise key="general1" title="Spider-Man Funko Pop" type="Figura" />,
          <SpiderManMerchandise key="general2" title="Spider-Man Mug" type="Hogar" />,
          <SpiderManMerchandise key="general3" title="Spider-Man Backpack" type="Accesorio" />,
          <SpiderManMerchandise key="general4" title="Spider-Man Wall Art" type="Decoración" />
        ];
    }
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Productos Relacionados
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Encuentra productos oficiales de Spider-Man en Amazon
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getRelatedProducts()}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Los enlaces contienen códigos de afiliado de Amazon. 
            Comprando a través de estos enlaces apoyas el mantenimiento de Spider-World.
          </p>
        </div>
      </div>
    </section>
  );
}

// Componente específico para páginas de personajes
export function CharacterProducts({ characterName }: { characterName: string }) {
  const cleanName = characterName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Productos de {characterName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AmazonProduct
            title={`${cleanName} Action Figure`}
            searchQuery={`${cleanName} spider-man marvel action figure`}
            category="Figura"
            tags={[cleanName, 'Marvel', 'Figura']}
          />
          
          <AmazonProduct
            title={`${cleanName} Comics Collection`}
            searchQuery={`${cleanName} spider-man comic collection marvel`}
            category="Cómic"
            tags={[cleanName, 'Marvel', 'Cómic']}
          />
          
          <AmazonProduct
            title={`${cleanName} T-Shirt`}
            searchQuery={`${cleanName} spider-man shirt marvel`}
            category="Ropa"
            tags={[cleanName, 'Marvel', 'Ropa']}
          />
          
          <AmazonProduct
            title={`${cleanName} Poster`}
            searchQuery={`${cleanName} spider-man poster marvel wall art`}
            category="Poster"
            tags={[cleanName, 'Marvel', 'Decoración']}
          />
          
          <AmazonProduct
            title={`${cleanName} Funko Pop`}
            searchQuery={`${cleanName} spider-man funko pop marvel`}
            category="Coleccionable"
            tags={[cleanName, 'Marvel', 'Funko']}
          />
          
          <AmazonProduct
            title={`${cleanName} Mug`}
            searchQuery={`${cleanName} spider-man mug marvel coffee`}
            category="Hogar"
            tags={[cleanName, 'Marvel', 'Hogar']}
          />
        </div>
      </div>
    </section>
  );
}

// Widget de productos destacados para sidebar
export function FeaturedProductsWidget() {
  return (
    <div className="bg-gray-900/30 rounded-lg p-4 border border-orange-600/20">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        🛒 Productos Destacados
      </h3>
      
      <div className="space-y-4">
        <AmazonProduct
          title="Marvel's Spider-Man Remastered - PS5"
          price="$49.99"
          originalPrice="$69.99"
          discount={29}
          rating={4.8}
          reviews={1200}
          category="Videojuego"
          tags={['PS5', 'Marvel', 'Spider-Man']}
          prime={true}
          searchQuery="Marvel's Spider-Man Remastered PS5"
          className="max-w-none"
        />
        
        <AmazonProduct
          title="Amazing Spider-Man Omnibus Vol. 1"
          price="$89.99"
          originalPrice="$125.00"
          discount={28}
          rating={4.9}
          reviews={856}
          category="Cómic"
          tags={['Marvel', 'Omnibus', 'Spider-Man']}
          searchQuery="Amazing Spider-Man Omnibus Volume 1"
          className="max-w-none"
        />
      </div>
    </div>
  );
}