export const revalidate = 3600

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { characterService } from '@/lib/database';
import { CharacterGrid } from '@/components/characters/CharacterCard';
import { CharacterFilter } from '@/components/characters/CharacterFilter';
import { InContentAd } from '@/components/ads/GoogleAdsense';
import { Zap, Skull, Shield, Star, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Personajes de Spider-Man y Marvel | Spider-World',
  description: 'Descubre todos los personajes de Spider-Man y Marvel con información completa, imágenes oficiales y más. Spider-Verse, villanos, héroes y más.',
  keywords: ['Spider-Man personajes', 'Marvel characters', 'Spider-Verse', 'Spider-Gwen', 'Miles Morales', 'personajes Marvel'],
  alternates: { canonical: '/personajes' },
  openGraph: {
    title: 'Personajes de Spider-Man y Marvel | Spider-World',
    description: 'Explora todos los personajes del Spider-Verse y Marvel con información completa',
    type: 'website',
    url: '/personajes',
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personajes de Spider-Man y Marvel | Spider-World',
    description: 'Explora todos los personajes del Spider-Verse y Marvel con información completa',
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
};

async function getCharacterGroups() {
  try {
    const [spiderVerse, spiderVillains, marvelUniverse, featured] = await Promise.all([
      characterService.getSpiderVerse(20),
      characterService.getSpiderVillains(20),
      characterService.getMarvelUniverse(20),
      characterService.getBySlug('spider-man-peter-parker-alt').catch(() => null),
    ]);
    return {
      spiderVerse: spiderVerse || [],
      spiderVillains: spiderVillains || [],
      marvelUniverse: marvelUniverse || [],
      featured: featured || null,
    };
  } catch {
    return { spiderVerse: [], spiderVillains: [], marvelUniverse: [], featured: null };
  }
}

export default async function PersonajesPage() {
  const { spiderVerse, spiderVillains, marvelUniverse, featured } = await getCharacterGroups();
  const total = spiderVerse.length + spiderVillains.length + marvelUniverse.length;

  return (
    <div
      className="pt-16 bg-gradient-to-b from-black via-gray-950 to-black"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 10% 30%, rgba(180,0,0,0.10) 0%, transparent 70%), radial-gradient(ellipse 70% 40% at 90% 70%, rgba(0,40,180,0.12) 0%, transparent 70%)',
      }}
    >
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/image1.png" alt="" fill sizes="100vw" className="object-cover object-[center_45%] opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Spider-World · Base de datos
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)' }}>
            Personajes
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            Héroes, villanos y aliados del universo Spider-Man. Más de {total} personajes con información completa.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-red-500/40 px-5 py-3 rounded-full">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">{spiderVerse.length}</span>
              <span className="text-gray-300 text-sm">Spider-Verse</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-orange-500/40 px-5 py-3 rounded-full">
              <Skull className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">{spiderVillains.length}</span>
              <span className="text-gray-300 text-sm">Villanos</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-blue-500/40 px-5 py-3 rounded-full">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">{marvelUniverse.length}</span>
              <span className="text-gray-300 text-sm">Marvel Universe</span>
            </div>
          </div>
        </div>
      </section>

      <InContentAd />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 space-y-20">

        {/* Personaje destacado */}
        {featured && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
              <h2 className="text-2xl font-bold text-white">Personaje Destacado</h2>
            </div>
            <Link href={`/personajes/${featured.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/40 transition-colors duration-300">
                {/* Fondo */}
                <div className="absolute inset-0">
                  <Image src={featured.image} alt="" fill sizes="100vw" className="object-cover object-top scale-110 blur-sm opacity-30 transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 items-center p-8 md:p-10">
                  {/* Info */}
                  <div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-red-400 mb-3 block">El Original · Spider-Verse</span>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{featured.name}</h3>
                    {featured.realName && (
                      <p className="text-gray-400 italic mb-4">"{featured.realName}"</p>
                    )}
                    <div className="flex items-center gap-2 mb-5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(featured.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                      <span className="text-yellow-400 font-bold ml-1">{featured.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">/5</span>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed max-w-xl mb-6">{featured.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featured.powers.slice(0, 4).map(p => (
                        <span key={p} className="text-xs bg-red-500/10 border border-red-500/20 text-red-300 rounded-full px-3 py-1">{p}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors px-5 py-2.5 rounded-full">
                      Ver perfil completo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Imagen */}
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-red-600/15 blur-2xl rounded-3xl" />
                      <Image
                        src={featured.image}
                        alt={featured.name}
                        width={220}
                        height={330}
                        className="relative rounded-xl shadow-2xl w-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}


        {/* Buscador y filtros */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-gray-500 to-gray-800" />
            <h2 className="text-2xl font-bold text-white">Buscar personajes</h2>
          </div>
          <CharacterFilter
            spiderVerse={spiderVerse}
            spiderVillains={spiderVillains}
            marvelUniverse={marvelUniverse}
          />
        </section>

        {/* Spider-Verse */}
        {spiderVerse.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
              <Zap className="w-5 h-5 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Spider-Verse</h2>
              <span className="text-gray-600 text-sm ml-1">— {spiderVerse.length} personajes</span>
            </div>
            <CharacterGrid characters={spiderVerse} maxItems={20} />
          </section>
        )}

        {/* Villanos */}
        {spiderVillains.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-500 to-red-800" />
              <Skull className="w-5 h-5 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Villanos de Spider-Man</h2>
              <span className="text-gray-600 text-sm ml-1">— {spiderVillains.length} personajes</span>
            </div>
            <CharacterGrid characters={spiderVillains} maxItems={20} />
          </section>
        )}

        {/* Marvel Universe */}
        {marvelUniverse.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-blue-800" />
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Marvel Universe</h2>
              <span className="text-gray-600 text-sm ml-1">— {marvelUniverse.length} personajes</span>
            </div>
            <CharacterGrid characters={marvelUniverse} maxItems={20} />
          </section>
        )}

      </div>
    </div>
  );
}
