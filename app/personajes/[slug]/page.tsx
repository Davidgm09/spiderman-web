import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { characterService } from '@/lib/database';
import { SITE_URL } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Zap, Shield, BookOpen, Users, ShoppingCart } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';
import { InContentAd, SidebarAd } from '@/components/ads/GoogleAdsense';
import { generateAmazonUrl } from '@/lib/content-helpers';

export const revalidate = 3600

export async function generateStaticParams() {
  const characters = await characterService.getAll()
  return characters.map((c) => ({ slug: c.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const character = await characterService.getBySlug(slug).catch(() => null);
  if (!character) return { title: 'Personaje no encontrado | Spider-World' };
  const url = `${SITE_URL}/personajes/${character.slug}`;
  return {
    title: character.seoTitle,
    description: character.seoDescription,
    keywords: character.keywords,
    alternates: { canonical: url },
    openGraph: { title: character.seoTitle, description: character.seoDescription, images: [character.image], type: 'article', url },
    twitter: { card: 'summary_large_image', title: character.seoTitle, description: character.seoDescription, images: [character.image] },
  };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { slug } = await params;
  const character = await characterService.getBySlug(slug).catch(() => null);
  if (!character) notFound();

  await characterService.incrementViews(slug).catch(() => {});

  const relatedCharacters = await characterService.getByCategory(character.category, 6).catch(() => []);
  const related = relatedCharacters.filter(c => c.id !== character.id).slice(0, 5);

  const categoryAccent = {
    'spider-verse': { bar: 'from-red-500 to-red-800', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    'spider-villains': { bar: 'from-orange-500 to-red-800', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    'marvel-universe': { bar: 'from-blue-500 to-blue-800', text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  }[character.category] ?? { bar: 'from-gray-500 to-gray-800', text: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' };

  const categoryLabel = {
    'spider-verse': 'Spider-Verse',
    'spider-villains': 'Villano',
    'marvel-universe': 'Marvel Universe',
  }[character.category] ?? character.category;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: character.name,
    alternateName: character.realName || undefined,
    description: character.seoDescription,
    image: {
      '@type': 'ImageObject',
      url: character.image,
      width: 380,
      height: 570,
    },
    url: `${SITE_URL}/personajes/${character.slug}`,
    knowsAbout: character.powers?.length ? character.powers : undefined,
    memberOf: character.affiliation?.length
      ? character.affiliation.map((org: string) => ({ '@type': 'Organization', name: org }))
      : undefined,
    aggregateRating: character.rating ? {
      '@type': 'AggregateRating',
      ratingValue: character.rating,
      bestRating: 5,
      worstRating: 0,
      ratingCount: Math.max(character.views || 0, 50),
    } : undefined,
    inLanguage: 'es',
  };

  return (
    <div
      className="pt-16 bg-gradient-to-b from-black via-gray-950 to-black"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 10% 50%, rgba(180,0,0,0.10) 0%, transparent 70%), radial-gradient(ellipse 70% 40% at 90% 70%, rgba(0,40,180,0.12) 0%, transparent 70%)',
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={character.image} alt="" fill sizes="100vw" className="object-cover object-top scale-110 blur-sm opacity-20" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-center">

            {/* Izquierda */}
            <div>
              <Breadcrumb items={[{ label: 'Personajes', href: '/personajes' }, { label: character.name }]} />

              <div className="flex items-center gap-3 mt-6 mb-4">
                <span className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${categoryAccent.bg} ${categoryAccent.text}`}>
                  {categoryLabel}
                </span>
                <span className="text-gray-500 text-sm">{character.universe}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
                {character.name}
              </h1>

              {character.realName && character.realName !== character.name && (
                <p className="text-gray-400 text-lg mb-4 italic">"{character.realName}"</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(character.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-yellow-400 font-bold ml-1">{character.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">/5</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                {character.description}
              </p>

              {/* Meta chips */}
              {character.affiliation.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {character.affiliation.slice(0, 4).map((org) => (
                    <span key={org} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                      {org}
                    </span>
                  ))}
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={generateAmazonUrl(`${character.name} Marvel figura coleccionable`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ver en Amazon
                </a>
                <Link href="/personajes" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-full transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Link>
              </div>
            </div>

            {/* Derecha: imagen */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-600/10 blur-2xl rounded-3xl" />
                <Image
                  src={character.image}
                  alt={`${character.name} - Personaje Marvel`}
                  width={380}
                  height={570}
                  className="relative rounded-2xl shadow-2xl w-full object-cover object-top"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <InContentAd />

      {/* Contenido */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Main */}
            <div className="lg:col-span-3 space-y-10">

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pb-10 border-b border-white/10">
                {[
                  { label: 'Universo', value: character.universe },
                  character.firstAppearance ? { label: 'Primera aparición', value: character.firstAppearance } : null,
                  character.comicsCount ? { label: 'Cómics', value: character.comicsCount.toString() } : null,
                  character.seriesCount ? { label: 'Series', value: character.seriesCount.toString() } : null,
                ].filter(Boolean).map((item, i, arr) => (
                  <div key={item!.label} className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-bold text-white">{item!.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{item!.label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Descripción larga */}
              {character.longDescription && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${categoryAccent.bar}`} />
                    <h3 className="text-2xl font-bold text-white">Historia</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{character.longDescription}</p>
                </div>
              )}

              {/* Poderes */}
              {character.powers.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${categoryAccent.bar}`} />
                    <Zap className={`w-5 h-5 ${categoryAccent.text}`} />
                    <h3 className="text-2xl font-bold text-white">Poderes</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {character.powers.map((power) => (
                      <div key={power} className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${categoryAccent.bg}`}>
                        <Zap className={`w-4 h-4 shrink-0 ${categoryAccent.text}`} />
                        <span className="text-gray-200 text-sm">{power}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habilidades */}
              {character.abilities.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Habilidades</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {character.abilities.map((ability) => (
                      <div key={ability} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Shield className="w-4 h-4 shrink-0 text-blue-400" />
                        <span className="text-gray-200 text-sm">{ability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creadores */}
              {character.creators.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-gray-500 to-gray-800" />
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <h3 className="text-2xl font-bold text-white">Creadores</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {character.creators.map((creator) => (
                      <span key={creator} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm">
                        {creator}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Comprar en Amazon</h3>
                  {[
                    { label: `${character.name} — Figura`, query: `${character.name} Marvel figura accion`, icon: '🕷️' },
                    { label: `${character.name} — Cómic`, query: `${character.name} Marvel comics`, icon: '📖' },
                    { label: `${character.name} — Funko Pop`, query: `${character.name} Funko Pop Marvel`, icon: '🏆' },
                  ].map(({ label, query, icon }) => (
                    <a
                      key={label}
                      href={generateAmazonUrl(query)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 group"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{label}</span>
                      <ShoppingCart className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Personajes relacionados */}
      {related.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-red-950/10 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${categoryAccent.bar}`} />
              <Users className={`w-5 h-5 ${categoryAccent.text}`} />
              <h2 className="text-2xl font-bold text-white">Personajes relacionados</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {related.map((rel) => (
                <Link key={rel.id} href={`/personajes/${rel.slug}`} className="group">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="relative aspect-[3/4]">
                      <Image src={rel.image} alt={rel.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-white text-xs font-bold leading-tight text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                          {rel.name}
                        </h3>
                      </div>
                      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full flex items-center justify-center bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-2 rounded-lg">
                          Ver perfil
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-semibold">{rel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
