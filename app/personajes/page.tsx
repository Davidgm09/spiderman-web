export const revalidate = 3600

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { blogService, characterService } from '@/lib/database';
import { CharacterGrid } from '@/components/characters/CharacterCard';
import { CharacterFilter } from '@/components/characters/CharacterFilter';
import { InContentAd } from '@/components/ads/GoogleAdsense';
import { Zap, Skull, Shield, Heart, Star, ArrowRight, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Personajes de Spider-Man: héroes, villanos y aliados',
  description: 'Todos los personajes de Spider-Man: el Spider-Verso, sus villanos, sus aliados y los héroes de Marvel con los que se cruza, con su historia, poderes y actores.',
  keywords: ['personajes de Spider-Man', 'personajes de Spiderman', 'villanos de Spider-Man', 'Spider-Man personajes', 'Marvel characters', 'Spider-Verse', 'Spider-Gwen', 'Miles Morales', 'personajes Marvel'],
  alternates: { canonical: '/personajes' },
  openGraph: {
    title: 'Personajes de Spider-Man y Marvel | Sentido Arácnido',
    description: 'Explora todos los personajes del Spider-Verse y Marvel con información completa',
    type: 'website',
    url: '/personajes',
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personajes de Spider-Man y Marvel | Sentido Arácnido',
    description: 'Explora todos los personajes del Spider-Verse y Marvel con información completa',
    images: ['https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/8126579-amazing_spider-man_vol_5_54_stormbreakers_variant_textless.jpg'],
  },
};

async function getCharacterGroups() {
  try {
    const [spiderVerse, spiderVillains, spiderAllies, marvelUniverse, featured] = await Promise.all([
      characterService.getSpiderVerse(50),
      characterService.getSpiderVillains(50),
      characterService.getSpiderAllies(50),
      characterService.getMarvelUniverse(50),
      characterService.getBySlug('spider-man-peter-parker-alt').catch(() => null),
    ]);
    return {
      spiderVerse: spiderVerse || [],
      spiderVillains: spiderVillains || [],
      spiderAllies: spiderAllies || [],
      marvelUniverse: marvelUniverse || [],
      featured: featured || null,
    };
  } catch {
    return { spiderVerse: [], spiderVillains: [], spiderAllies: [], marvelUniverse: [], featured: null };
  }
}

export default async function PersonajesPage() {
  const { spiderVerse, spiderVillains, spiderAllies, marvelUniverse, featured } = await getCharacterGroups();
  const total = spiderVerse.length + spiderVillains.length + spiderAllies.length + marvelUniverse.length;

  // Guía en texto del final: artículos sobre personajes y preguntas frecuentes
  const GUIAS = [
    { slug: 'mejores-villanos-spider-man-ranking-definitivo', etiqueta: 'Ranking' },
    { slug: 'doctor-octopus-cine-series-videojuegos-versiones', etiqueta: 'Villanos' },
    { slug: 'simbionte-historia-evolucion-venom', etiqueta: 'Villanos' },
    { slug: 'mary-jane-watson-actrices-versiones-cine-series-juegos', etiqueta: 'Aliados' },
    { slug: 'merodeador-aaron-davis-tio-miles-morales', etiqueta: 'Spider-Verso' },
    { slug: 'scarlet-spider-ben-reilly-kaine-diferencias', etiqueta: 'Spider-Verso' },
  ];
  const guias = (await Promise.all(GUIAS.map(async (g) => {
    const post = await blogService.getBySlug(g.slug).catch(() => null);
    return post ? { ...g, title: post.title, image: post.image } : null;
  }))).filter((g): g is NonNullable<typeof g> => g !== null);

  const faqs = [
    {
      q: '¿Cuántos personajes de Spider-Man hay?',
      a: `Spider-Man tiene cientos de personajes en más de sesenta años de cómics. Aquí tienes ${total} fichas: los Spider-Man del Spider-Verso, sus villanos, sus aliados y los héroes de Marvel con los que más se cruza, con su historia, sus poderes y sus actores.`,
    },
    {
      q: '¿Quién es el mayor enemigo de Spider-Man?',
      a: 'Para nosotros, el Duende Verde (Norman Osborn), que mató a Gwen Stacy y conoce el secreto de Peter Parker. Le siguen el Doctor Octopus y Venom en nuestro ranking de los mejores villanos de Spider-Man.',
    },
    {
      q: '¿Quiénes son los Seis Siniestros?',
      a: 'El grupo de villanos que reunió el Doctor Octopus en The Amazing Spider-Man Annual #1 (1964): el propio Doctor Octopus, el Buitre, Electro, Kraven, Mysterio y el Hombre de Arena.',
    },
    {
      q: '¿Qué es el Spider-Verso?',
      a: 'El multiverso de Spider-Man: todas las versiones del personaje en otros universos, como Miles Morales, Spider-Gwen, Spider-Man 2099 o Spider-Ham. Lo popularizaron el cómic Spider-Verse (2014) y las películas de animación de Miles Morales.',
    },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

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
          <Image src="/images/image1.png" alt="" fill priority sizes="100vw" className="object-cover object-[center_45%] opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-24 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Sentido Arácnido · Base de datos
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)' }}>
            Personajes
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
            Héroes, villanos y aliados del universo Spider-Man: {total} personajes con su historia, poderes y primera aparición.
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
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-emerald-500/40 px-5 py-3 rounded-full">
              <Heart className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">{spiderAllies.length}</span>
              <span className="text-gray-300 text-sm">Aliados</span>
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
            spiderAllies={spiderAllies}
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
            <CharacterGrid characters={spiderVerse} maxItems={50} />
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
            <CharacterGrid characters={spiderVillains} maxItems={50} />
          </section>
        )}

        {/* Aliados y reparto */}
        {spiderAllies.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-800" />
              <Heart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Aliados de Spider-Man</h2>
              <span className="text-gray-600 text-sm ml-1">— {spiderAllies.length} personajes</span>
            </div>
            <CharacterGrid characters={spiderAllies} maxItems={50} />
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
            <CharacterGrid characters={marvelUniverse} maxItems={50} />
          </section>
        )}

        {/* Guía en texto: artículos sobre personajes y preguntas frecuentes */}
        <section className="max-w-5xl mx-auto text-gray-300">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

          {guias.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-500 to-blue-500" />
                <h2 className="text-2xl md:text-4xl font-bold text-white">Sus historias, a fondo</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-16">
                {guias.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/blog/${g.slug}`}
                    className="group flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-red-500/50 transition-colors"
                  >
                    <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                      {g.image && <Image src={g.image} alt="" fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">{g.etiqueta}</span>
                      <span className="font-bold text-white mt-1 leading-snug line-clamp-3">{g.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-500 to-blue-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-white">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group rounded-xl bg-white/5 border border-white/10 open:border-red-500/40">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base md:text-lg font-semibold text-white">{f.q}</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 -mt-1 text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
