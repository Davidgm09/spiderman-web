import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { characterService } from '@/lib/database';
import { SITE_URL } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, Users, BookOpen, Monitor, Eye, Calendar, Zap, Shield, Heart } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';
import { InContentAd, SidebarAd } from '@/components/ads/GoogleAdsense';
import { AmazonProduct } from '@/components/affiliate/AmazonProduct';

export const revalidate = 3600

export async function generateStaticParams() {
  const characters = await characterService.getAll()
  return characters.map((c) => ({ slug: c.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = await characterService.getBySlug(slug);
  
  if (!character) {
    return {
      title: 'Personaje no encontrado | Spider-World',
      description: 'El personaje que buscas no fue encontrado en nuestra base de datos.'
    };
  }

  const url = `${SITE_URL}/personajes/${character.slug}`;

  return {
    title: character.seoTitle,
    description: character.seoDescription,
    keywords: character.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: character.seoTitle,
      description: character.seoDescription,
      images: [character.image],
      type: 'article',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: character.seoTitle,
      description: character.seoDescription,
      images: [character.image],
    },
  };
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const character = await characterService.getBySlug(slug);

  if (!character) {
    notFound();
  }

  // Incrementar views
  await characterService.incrementViews(slug).catch(console.error);

  // Obtener personajes relacionados de la misma categoría
  const relatedCharacters = await characterService.getByCategory(character.category, 6);
  const filteredRelated = relatedCharacters.filter(c => c.id !== character.id).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: character.name,
    description: character.seoDescription,
    image: character.image,
    url: `${SITE_URL}/personajes/${character.slug}`,
    ...(character.firstAppearance && { sameAs: [] }),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-900/30 via-black to-blue-900/30">
        <div className="absolute inset-0 bg-[url('/images/spider-web-pattern.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb items={[{ label: "Personajes", href: "/personajes" }, { label: character.name }]} />
          <div className="flex items-center gap-4 mb-8">
            <Link href="/personajes">
              <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Personajes
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-600/30">
                  {character.category.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  <Star className="w-3 h-3 mr-1" />
                  {character.rating.toFixed(1)}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                {character.name}
              </h1>

              {character.realName && (
                <p className="text-xl text-gray-300 mb-4">
                  <span className="text-gray-500">Nombre real:</span> {character.realName}
                </p>
              )}

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {character.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>{character.comicsCount} cómics</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-900/20 px-4 py-2 rounded-full">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <span>{character.seriesCount} series</span>
                </div>
                <div className="flex items-center gap-2 bg-green-900/20 px-4 py-2 rounded-full">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span>{character.views} visualizaciones</span>
                </div>
              </div>

              {character.affiliation && character.affiliation.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Afiliación:</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.affiliation.map((org, index) => (
                      <Badge key={index} variant="outline" className="border-blue-500 text-blue-400">
                        {org}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={character.image}
                  alt={`${character.name} - Personaje Marvel`}
                  width={400}
                  height={600}
                  className="rounded-xl shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad */}
      <InContentAd />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Powers Section */}
            {character.powers && character.powers.length > 0 && (
              <Card className="bg-gray-900/50 border-red-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <Zap className="w-5 h-5" />
                    Poderes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {character.powers.map((power, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-red-900/20 rounded-lg">
                        <Zap className="w-4 h-4 text-red-400" />
                        <span>{power}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Abilities Section */}
            {character.abilities && character.abilities.length > 0 && (
              <Card className="bg-gray-900/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Shield className="w-5 h-5" />
                    Habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {character.abilities.map((ability, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-900/20 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span>{ability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Long Description */}
            {character.longDescription && (
              <Card className="bg-gray-900/50 border-gray-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    Historia Completa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {character.longDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Character Info */}
            <Card className="bg-gray-900/50 border-purple-600/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Users className="w-5 h-5" />
                  Información del Personaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Universo:</h4>
                    <p className="text-gray-300">{character.universe}</p>
                  </div>
                  {character.firstAppearance && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Primera aparición:</h4>
                      <p className="text-gray-300">{character.firstAppearance}</p>
                    </div>
                  )}
                  {character.creators && character.creators.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Creadores:</h4>
                      <p className="text-gray-300">{character.creators.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white mb-2">ID Marvel:</h4>
                    <p className="text-gray-300">#{character.marvelId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Characters */}
            {filteredRelated.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Personajes Relacionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredRelated.map((related) => (
                      <Link key={related.id} href={`/personajes/${related.slug}`}>
                        <div className="group cursor-pointer bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                          <Image
                            src={related.image}
                            alt={related.name}
                            width={100}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <h4 className="font-medium text-white text-sm group-hover:text-red-400 transition-colors">
                            {related.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-400">{related.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SidebarAd />
            
            {/* Character Products */}
            <Card className="bg-gray-900/50 border-yellow-600/20">
              <CardHeader>
                <CardTitle className="text-yellow-400">🛍️ Productos de {character.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AmazonProduct
                  title={`${character.name} Action Figure`}
                  description={`Figura oficial de ${character.name} de alta calidad`}
                  price="$29.99"
                  originalPrice="$39.99"
                  discount={25}
                  category="Figura"
                  tags={[character.name, 'Action Figure', 'Marvel']}
                  searchQuery={`${character.name} action figure Marvel official`}
                  className="max-w-none"
                />
                <AmazonProduct
                  title={`${character.name} Comic Collection`}
                  description={`Cómics esenciales de ${character.name}`}
                  price="$19.99"
                  category="Cómic"
                  tags={[character.name, 'Comics', 'Marvel']}
                  searchQuery={`${character.name} comics Marvel collection`}
                  className="max-w-none"
                />
              </CardContent>
            </Card>

            {/* Character Stats */}
            <Card className="bg-gray-900/50 border-green-600/20">
              <CardHeader>
                <CardTitle className="text-green-400">📊 Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white font-semibold">{character.rating.toFixed(1)}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cómics:</span>
                    <span className="text-white font-semibold">{character.comicsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Series:</span>
                    <span className="text-white font-semibold">{character.seriesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visualizaciones:</span>
                    <span className="text-white font-semibold">{character.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-red-600/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/comics">Ver Cómics</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white" asChild>
                    <Link href="/peliculas">Ver Películas</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white" asChild>
                    <Link href="/videojuegos">Ver Videojuegos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}