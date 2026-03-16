const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Spider-Man series search terms
const SPIDER_MAN_SERIES_KEYWORDS = [
  'spider-man',
  'spectacular spider-man',
  'ultimate spider-man',
  'amazing spider-man',
  'spider-man animated',
  'spidey amazing friends',
  'spider-man new animated series'
];

// Known Spider-Man series from TMDB (backup list)
const KNOWN_SPIDER_SERIES_IDS = [
  1427,   // Spider-Man (1967-1970)
  2703,   // Spider-Man and His Amazing Friends (1981-1983)
  2704,   // Spider-Man: The Animated Series (1994-1998)
  2705,   // Spider-Man: The New Animated Series (2003)
  40358,  // The Spectacular Spider-Man (2008-2009)
  52315,  // Ultimate Spider-Man (2012-2017)
  71728,  // Spider-Man (2017-2020)
  119171, // Spidey and His Amazing Friends (2021-present)
];

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate SEO content
function generateSEOContent(series) {
  const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : '';
  const seoTitle = `${series.name} (${year}) - Serie de Spider-Man | Spider-World`;
  const seoDescription = `Descubre todo sobre ${series.name} (${year}). ${series.overview ? series.overview.substring(0, 120) + '...' : 'Serie completa de Spider-Man con análisis detallado.'}`;
  
  const keywords = [
    series.name.toLowerCase(),
    'spider-man serie',
    'serie animada spider-man',
    year.toString(),
    'marvel serie',
    'spider-man tv show'
  ];

  return { seoTitle, seoDescription, keywords };
}

// Generate Amazon affiliate link
function generateAmazonLink(seriesName, firstAirDate) {
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const year = firstAirDate ? new Date(firstAirDate).getFullYear() : '';
  const searchQuery = encodeURIComponent(`${seriesName} ${year} serie completa`);
  
  return `https://www.amazon.com/s?k=${searchQuery}&i=instant-video&tag=${amazonTag}`;
}

// Generate digital purchase links
function generateDigitalLinks(seriesName, imdbId) {
  const encodedName = encodeURIComponent(seriesName);
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  
  const links = [
    {
      platform: 'Amazon Prime Video',
      url: `https://www.amazon.com/s?k=${encodedName}&i=instant-video&tag=${amazonTag}`,
      price: 'Desde $19.99'
    },
    {
      platform: 'Apple TV',
      url: `https://tv.apple.com/search?term=${encodedName}`,
      price: 'Desde $14.99'
    },
    {
      platform: 'Netflix',
      url: `https://www.netflix.com/search?q=${encodedName}`,
      price: 'Incluido con suscripción'
    },
    {
      platform: 'Disney+',
      url: `https://www.disneyplus.com/search?q=${encodedName}`,
      price: 'Incluido con suscripción'
    }
  ];

  if (imdbId) {
    links.push({
      platform: 'IMDb',
      url: `https://www.imdb.com/title/${imdbId}/`,
      price: 'Información'
    });
  }

  return links;
}

// Fetch series details from TMDB
async function fetchSeriesDetails(seriesId) {
  try {
    console.log(`🔍 Fetching details for series ID: ${seriesId}`);
    
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'es-ES',
        append_to_response: 'videos,external_ids,credits'
      }
    });

    const series = response.data;
    
    // Find trailer
    const trailer = series.videos?.results?.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );

    // Get cast info
    const cast = series.credits?.cast?.slice(0, 10).map(actor => ({
      name: actor.name,
      character: actor.character,
      image: actor.profile_path
        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
        : null
    })) || [];

    return {
      ...series,
      trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      cast_info: cast
    };
  } catch (error) {
    console.error(`❌ Error fetching series ${seriesId}:`, error.message);
    return null;
  }
}

// Search for Spider-Man series
async function searchSpiderManSeries() {
  const allSeries = new Map();
  
  console.log('🔍 Searching for Spider-Man series...');
  
  for (const keyword of SPIDER_MAN_SERIES_KEYWORDS) {
    try {
      console.log(`🔍 Searching with keyword: "${keyword}"`);
      
      const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          query: keyword,
          language: 'es-ES',
          include_adult: false
        }
      });

      response.data.results.forEach(series => {
        const name = series.name.toLowerCase();
        const overview = series.overview?.toLowerCase() || '';
        
        // Filter for Spider-Man related series
        if (
          name.includes('spider') || 
          overview.includes('spider') ||
          overview.includes('peter parker') ||
          name.includes('spidey')
        ) {
          allSeries.set(series.id, series);
          console.log(`📺 Found: ${series.name} (${series.first_air_date})`);
        }
      });

      // Rate limiting
      await delay(300);
    } catch (error) {
      console.error(`❌ Error searching with keyword "${keyword}":`, error.message);
    }
  }

  // Add known series IDs
  for (const seriesId of KNOWN_SPIDER_SERIES_IDS) {
    if (!allSeries.has(seriesId)) {
      try {
        const series = await fetchSeriesDetails(seriesId);
        if (series) {
          allSeries.set(seriesId, series);
          console.log(`📺 Added known series: ${series.name}`);
        }
        await delay(300);
      } catch (error) {
        console.error(`❌ Error fetching known series ${seriesId}:`, error.message);
      }
    }
  }

  return Array.from(allSeries.values());
}

// Save series to database
async function saveSeriestoDatabase(seriesData) {
  // Omitir series sin póster en TMDB — no hardcodear placeholders
  if (!seriesData.poster_path) {
    console.log(`⚠️  ${seriesData.name}: sin póster en TMDB, omitida`);
    return null;
  }

  const { seoTitle, seoDescription, keywords } = generateSEOContent(seriesData);
  const slug = generateSlug(seriesData.name);

  // Check if series already exists
  const existingSeries = await prisma.series.findFirst({
    where: {
      OR: [
        { tmdbId: seriesData.id },
        { slug: slug }
      ]
    }
  });

  if (existingSeries) {
    console.log(`⚠️  Series already exists: ${seriesData.name}`);
    return existingSeries;
  }

  const amazonLink = generateAmazonLink(seriesData.name, seriesData.first_air_date);
  const digitalLinks = generateDigitalLinks(seriesData.name, seriesData.external_ids?.imdb_id);

  try {
    const series = await prisma.series.create({
      data: {
        tmdbId: seriesData.id,
        title: seriesData.name,
        originalTitle: seriesData.original_name,
        subtitle: seriesData.tagline || `Serie de Spider-Man ${seriesData.first_air_date ? `(${new Date(seriesData.first_air_date).getFullYear()})` : ''}`,
        year: seriesData.first_air_date ? new Date(seriesData.first_air_date).getFullYear().toString() : '2000',
        endYear: seriesData.last_air_date ? new Date(seriesData.last_air_date).getFullYear().toString() : null,
        seasons: seriesData.number_of_seasons || 1,
        episodes: seriesData.number_of_episodes || 0,
        network: seriesData.networks?.[0]?.name || 'Desconocida',
        rating: seriesData.vote_average || 0,
        image: `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`,
        description: seriesData.overview || 'Serie de Spider-Man sin descripción disponible.',
        longDescription: seriesData.overview 
          ? `<h2>${seriesData.name}</h2><p>${seriesData.overview}</p>`
          : `<h2>${seriesData.name}</h2><p>Serie de Spider-Man sin descripción detallada disponible.</p>`,
        slug: slug,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        keywords: keywords,
        cast: seriesData.cast_info?.map(actor => actor.name) || [],
        creators: seriesData.created_by?.map(creator => creator.name) || [],
        genre: seriesData.genres?.map(genre => genre.name) || ['Animación', 'Acción'],
        // TMDB specific fields
        firstAirDate: seriesData.first_air_date,
        lastAirDate: seriesData.last_air_date,
        status: seriesData.status,
        type: seriesData.type,
        originalLanguage: seriesData.original_language,
        productionCompanies: seriesData.production_companies,
        countries: seriesData.origin_country || [],
        imdbId: seriesData.external_ids?.imdb_id,
        homepage: seriesData.homepage,
        tagline: seriesData.tagline,
        posterPath: seriesData.poster_path,
        backdropPath: seriesData.backdrop_path,
        backdropImages: seriesData.backdrop_path 
          ? [`https://image.tmdb.org/t/p/original${seriesData.backdrop_path}`]
          : [],
        trailerUrl: seriesData.trailer_url,
        castPhotos: seriesData.cast_info,
        amazonLink: amazonLink,
        digitalLinks: digitalLinks
      }
    });

    console.log(`✅ Saved series: ${series.title}`);
    return series;
  } catch (error) {
    console.error(`❌ Error saving series ${seriesData.name}:`, error.message);
    return null;
  }
}

// Main function
async function populateSeriesFromTMDB() {
  try {
    console.log('🚀 Starting Spider-Man series population from TMDB...');
    
    // Check if TMDB API key is configured
    if (!TMDB_API_KEY) {
      console.error('❌ TMDB_API_KEY not found in environment variables');
      return;
    }

    // Search for Spider-Man series
    const seriesList = await searchSpiderManSeries();
    console.log(`📺 Found ${seriesList.length} Spider-Man series`);

    // Process each series
    let savedCount = 0;
    for (const seriesData of seriesList) {
      const enhancedSeries = await fetchSeriesDetails(seriesData.id);
      if (enhancedSeries) {
        const saved = await saveSeriestoDatabase(enhancedSeries);
        if (saved) savedCount++;
      }
      
      // Rate limiting
      await delay(500);
    }

    console.log(`🎉 Successfully populated ${savedCount} Spider-Man series from TMDB`);
    
  } catch (error) {
    console.error('💥 Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  populateSeriesFromTMDB();
}

module.exports = { populateSeriesFromTMDB };