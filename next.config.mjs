/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'i.annihil.us' },
      { protocol: 'https', hostname: 'images.igdb.com' },
      { protocol: 'https', hostname: 'media.rawg.io' },
      { protocol: 'https', hostname: 'levnbdntgnsxuveaxhfz.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'image.api.playstation.com' },
      { protocol: 'https', hostname: 'cdn.cloudflare.steamstatic.com' },
      { protocol: 'https', hostname: 'cdn.mobygames.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images.launchbox-app.com' },
      { protocol: 'https', hostname: 'archive.org' },
      { protocol: 'https', hostname: 'img.rawpixel.com' },
      { protocol: 'https', hostname: 'www.mobygames.com' },
      { protocol: 'https', hostname: 'comicvine.gamespot.com' },
      { protocol: 'https', hostname: 'cdn.marvel.com' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'vignette.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'vignette3.wikia.nocookie.net' },
    ],
  },
  async redirects() {
    return [
      // Redirects para películas
      {
        source: '/spider-man-no-way-home',
        destination: '/peliculas/spider-man-no-way-home',
        permanent: true,
      },
      {
        source: '/spider-man-into-the-spider-verse-2018',
        destination: '/peliculas/spider-man-into-the-spider-verse-2018',
        permanent: true,
      },
      {
        source: '/spider-man-2002',
        destination: '/peliculas/spider-man-2002',
        permanent: true,
      },
      {
        source: '/spider-man-2-2004',
        destination: '/peliculas/spider-man-2-2004',
        permanent: true,
      },
      {
        source: '/spider-man-3-2007',
        destination: '/peliculas/spider-man-3-2007',
        permanent: true,
      },
      {
        source: '/the-amazing-spider-man-2012',
        destination: '/peliculas/the-amazing-spider-man-2012',
        permanent: true,
      },
      {
        source: '/the-amazing-spider-man-2-2014',
        destination: '/peliculas/the-amazing-spider-man-2-2014',
        permanent: true,
      },
      {
        source: '/spider-man-homecoming-2017',
        destination: '/peliculas/spider-man-homecoming-2017',
        permanent: true,
      },
      {
        source: '/spider-man-far-from-home-2019',
        destination: '/peliculas/spider-man-far-from-home-2019',
        permanent: true,
      },
      {
        source: '/spider-man-across-the-spider-verse-2023',
        destination: '/peliculas/spider-man-across-the-spider-verse-2023',
        permanent: true,
      },
      {
        source: '/spider-man-beyond-the-spider-verse-2024',
        destination: '/peliculas/spider-man-beyond-the-spider-verse-2024',
        permanent: true,
      },
      
      // Redirects para series
      {
        source: '/spectacular-spider-man-2008',
        destination: '/series/spectacular-spider-man-2008',
        permanent: true,
      },
      {
        source: '/spider-man-animated-series-1994',
        destination: '/series/spider-man-animated-series-1994',
        permanent: true,
      },
      {
        source: '/ultimate-spider-man-2012',
        destination: '/series/ultimate-spider-man-2012',
        permanent: true,
      },
      {
        source: '/spider-man-amazing-friends-1981',
        destination: '/series/spider-man-amazing-friends-1981',
        permanent: true,
      },
      {
        source: '/spider-man-new-animated-series-2003',
        destination: '/series/spider-man-new-animated-series-2003',
        permanent: true,
      },
      {
        source: '/spider-man-1967-animated-series',
        destination: '/series/spider-man-1967-animated-series',
        permanent: true,
      },
      {
        source: '/spider-man-2017-animated',
        destination: '/series/spider-man-2017-animated',
        permanent: true,
      },
      {
        source: '/spidey-amazing-friends-2021',
        destination: '/series/spidey-amazing-friends-2021',
        permanent: true,
      },
      // Live-action series redirects
      {
        source: '/amazing-spider-man-1977-live-action',
        destination: '/series/amazing-spider-man-1977-live-action',
        permanent: true,
      },
      {
        source: '/spider-man-freshman-year',
        destination: '/series/spider-man-freshman-year',
        permanent: true,
      },
      
      // Redirects para videojuegos
      {
        source: '/marvels-spider-man-2018',
        destination: '/videojuegos/marvels-spider-man-2018',
        permanent: true,
      },
      {
        source: '/spider-man-1982-atari',
        destination: '/videojuegos/spider-man-1982-atari',
        permanent: true,
      },
      {
        source: '/spider-man-vs-kingpin-1991',
        destination: '/videojuegos/spider-man-vs-kingpin-1991',
        permanent: true,
      },
      {
        source: '/spider-man-xmen-arcade-1992',
        destination: '/videojuegos/spider-man-xmen-arcade-1992',
        permanent: true,
      },
      {
        source: '/spider-man-2000-neversoft',
        destination: '/videojuegos/spider-man-2000-neversoft',
        permanent: true,
      },
      
      // Redirects para cómics
      {
        source: '/amazing-spider-man-300-1988',
        destination: '/comics/amazing-spider-man-300-1988',
        permanent: true,
      },
      {
        source: '/amazing-fantasy-15-1962',
        destination: '/comics/amazing-fantasy-15-1962',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-1-1963',
        destination: '/comics/amazing-spider-man-1-1963',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-14-1964',
        destination: '/comics/amazing-spider-man-14-1964',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-31-1965',
        destination: '/comics/amazing-spider-man-31-1965',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-50-1967',
        destination: '/comics/amazing-spider-man-50-1967',
        permanent: true,
      },
      {
        source: '/spectacular-spider-man-magazine-2-1968',
        destination: '/comics/spectacular-spider-man-magazine-2-1968',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-121-1973',
        destination: '/comics/amazing-spider-man-121-1973',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-129-1974',
        destination: '/comics/amazing-spider-man-129-1974',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-194-1979',
        destination: '/comics/amazing-spider-man-194-1979',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-238-1983',
        destination: '/comics/amazing-spider-man-238-1983',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-252-1984',
        destination: '/comics/amazing-spider-man-252-1984',
        permanent: true,
      },
      {
        source: '/web-of-spider-man-1-1985',
        destination: '/comics/web-of-spider-man-1-1985',
        permanent: true,
      },
      {
        source: '/spider-man-kravens-last-hunt-1987',
        destination: '/comics/spider-man-kravens-last-hunt-1987',
        permanent: true,
      },
      {
        source: '/spider-man-1-1990',
        destination: '/comics/spider-man-1-1990',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-361-1992',
        destination: '/comics/amazing-spider-man-361-1992',
        permanent: true,
      },
      {
        source: '/maximum-carnage-1993',
        destination: '/comics/maximum-carnage-1993',
        permanent: true,
      },
      {
        source: '/clone-saga-1994',
        destination: '/comics/clone-saga-1994',
        permanent: true,
      },
      {
        source: '/ultimate-spider-man-1-2000',
        destination: '/comics/ultimate-spider-man-1-2000',
        permanent: true,
      },
      {
        source: '/spider-man-blue-2002',
        destination: '/comics/spider-man-blue-2002',
        permanent: true,
      },
      {
        source: '/amazing-spider-man-500-2003',
        destination: '/comics/amazing-spider-man-500-2003',
        permanent: true,
      },
      {
        source: '/civil-war-2006',
        destination: '/comics/civil-war-2006',
        permanent: true,
      },
      {
        source: '/the-death-of-spider-man-2011',
        destination: '/comics/the-death-of-spider-man-2011',
        permanent: true,
      },
      {
        source: '/spider-verse-2014',
        destination: '/comics/spider-verse-2014',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
