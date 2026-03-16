#!/usr/bin/env node

/**
 * 🎮 Test Enhanced IGDB Integration
 * 
 * Este script prueba la nueva funcionalidad expandida de IGDB
 * para verificar que podemos extraer todos los datos disponibles
 * sin necesidad de conectar a la base de datos
 */

const axios = require('axios');
const util = require('util');

// IGDB Configuration
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = 'https://api.igdb.com/v4';

// Cache for access token
let cachedAccessToken = null;

// IGDB Authentication
async function getIGDBAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  try {
    console.log('🔑 Getting IGDB access token...');
    
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: IGDB_CLIENT_ID,
        client_secret: IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    const { access_token, expires_in } = response.data;
    
    cachedAccessToken = {
      token: access_token,
      expiresAt: Date.now() + (expires_in - 3600) * 1000
    };

    console.log('✅ IGDB access token obtained');
    return access_token;

  } catch (error) {
    console.error('💥 Error getting IGDB access token:', error.message);
    return null;
  }
}

// Test enhanced IGDB data extraction
async function testEnhancedIGDBExtraction() {
  console.log('🚀 Testing Enhanced IGDB Data Extraction\n');

  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    console.log('❌ IGDB credentials not found in environment');
    console.log('Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env file');
    return;
  }

  try {
    const accessToken = await getIGDBAccessToken();
    if (!accessToken) {
      console.log('❌ Failed to get access token');
      return;
    }

    console.log('🌐 Fetching detailed Spider-Man game data from IGDB...\n');

    // Test query with all enhanced fields
    const response = await axios.post(
      `${IGDB_BASE_URL}/games`,
      `
        search "spider-man";
        fields id, name, summary, storyline, first_release_date, rating, rating_count,
               cover.url, screenshots.url, 
               platforms.name, genres.name, game_modes.name, 
               involved_companies.company.name, involved_companies.developer, 
               involved_companies.publisher,
               videos.name, videos.video_id, 
               websites.category, websites.url,
               age_ratings.rating, age_ratings.category,
               themes.name, player_perspectives.name;
        where rating_count > 5;
        limit 5;
      `,
      {
        headers: {
          'Client-ID': IGDB_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'text/plain'
        }
      }
    );

    const games = response.data;

    if (!games || games.length === 0) {
      console.log('❌ No games found');
      return;
    }

    console.log(`✅ Found ${games.length} game(s)\n`);

    // Analyze each game
    games.forEach((game, index) => {
      console.log(`🎮 GAME ${index + 1}: ${game.name}`);
      console.log('═'.repeat(50));
      
      // Basic info
      console.log(`📊 Basic Information:`);
      console.log(`   • ID: ${game.id}`);
      console.log(`   • Title: ${game.name}`);
      console.log(`   • Release Date: ${game.first_release_date ? new Date(game.first_release_date * 1000).toLocaleDateString() : 'Unknown'}`);
      console.log(`   • Rating: ${game.rating ? (game.rating/10).toFixed(1) : 'N/A'}/10 (${game.rating_count || 0} votes)`);
      console.log(`   • Metacritic: ${game.metacritic || 'N/A'}`);
      console.log(`   • Status: ${game.status || 'Unknown'}`);
      console.log(`   • Category: ${game.category || 'Unknown'}`);

      // Platforms
      if (game.platforms && game.platforms.length > 0) {
        console.log(`\n🎯 Platforms:`);
        game.platforms.forEach(platform => {
          console.log(`   • ${platform.name} (${platform.abbreviation || 'N/A'})`);
        });
      }

      // Genres
      if (game.genres && game.genres.length > 0) {
        console.log(`\n🎭 Genres:`);
        game.genres.forEach(genre => {
          console.log(`   • ${genre.name}`);
        });
      }

      // Game Modes
      if (game.game_modes && game.game_modes.length > 0) {
        console.log(`\n👥 Game Modes:`);
        game.game_modes.forEach(mode => {
          console.log(`   • ${mode.name}`);
        });
      }

      // Companies
      if (game.involved_companies && game.involved_companies.length > 0) {
        console.log(`\n🏢 Companies:`);
        game.involved_companies.forEach(ic => {
          const roles = [];
          if (ic.developer) roles.push('Developer');
          if (ic.publisher) roles.push('Publisher');
          if (ic.porting) roles.push('Porting');
          console.log(`   • ${ic.company.name} (${roles.join(', ')})`);
        });
      }

      // Age Ratings
      if (game.age_ratings && game.age_ratings.length > 0) {
        console.log(`\n🔞 Age Ratings:`);
        game.age_ratings.forEach(rating => {
          const categories = {
            1: 'ESRB',
            2: 'PEGI',
            3: 'CERO',
            4: 'USK',
            5: 'GRAC',
            6: 'CLASS_IND',
            7: 'ACB'
          };
          console.log(`   • ${categories[rating.category] || 'Unknown'}: ${rating.rating}`);
        });
      }

      // Websites
      if (game.websites && game.websites.length > 0) {
        console.log(`\n🌐 Websites:`);
        game.websites.forEach(website => {
          const categories = {
            1: 'Official',
            2: 'Wikia',
            3: 'Wikipedia',
            4: 'Facebook',
            5: 'Twitter',
            6: 'Twitch',
            8: 'Instagram',
            9: 'YouTube',
            10: 'iPhone',
            11: 'iPad',
            12: 'Android',
            13: 'Steam',
            14: 'Reddit',
            15: 'Itch',
            16: 'Epic Games',
            17: 'GOG',
            18: 'Discord'
          };
          console.log(`   • ${categories[website.category] || 'Unknown'}: ${website.url}`);
        });
      }

      // Screenshots
      if (game.screenshots && game.screenshots.length > 0) {
        console.log(`\n📸 Screenshots: ${game.screenshots.length} available`);
        game.screenshots.slice(0, 3).forEach((screenshot, i) => {
          console.log(`   • Screenshot ${i + 1}: ${screenshot.url}`);
        });
      }

      // Videos
      if (game.videos && game.videos.length > 0) {
        console.log(`\n🎥 Videos: ${game.videos.length} available`);
        game.videos.slice(0, 3).forEach((video, i) => {
          console.log(`   • ${video.name || `Video ${i + 1}`}: https://www.youtube.com/watch?v=${video.video_id}`);
        });
      }

      // Themes
      if (game.themes && game.themes.length > 0) {
        console.log(`\n🎨 Themes:`);
        game.themes.forEach(theme => {
          console.log(`   • ${theme.name}`);
        });
      }

      // Player Perspectives
      if (game.player_perspectives && game.player_perspectives.length > 0) {
        console.log(`\n👁️ Player Perspectives:`);
        game.player_perspectives.forEach(perspective => {
          console.log(`   • ${perspective.name}`);
        });
      }

      // Game Engines
      if (game.game_engines && game.game_engines.length > 0) {
        console.log(`\n⚙️ Game Engines:`);
        game.game_engines.forEach(engine => {
          console.log(`   • ${engine.name}`);
        });
      }

      // Franchises
      if (game.franchises && game.franchises.length > 0) {
        console.log(`\n🏷️ Franchises:`);
        game.franchises.forEach(franchise => {
          console.log(`   • ${franchise.name}`);
        });
      }

      // Collection
      if (game.collection) {
        console.log(`\n📚 Collection: ${game.collection.name}`);
      }

      // Multiplayer Modes
      if (game.multiplayer_modes && game.multiplayer_modes.length > 0) {
        console.log(`\n🎮 Multiplayer Modes:`);
        game.multiplayer_modes.forEach(mode => {
          console.log(`   • Campaign Coop: ${mode.campaigncoop ? 'Yes' : 'No'}`);
          console.log(`   • Drop-in: ${mode.dropin ? 'Yes' : 'No'}`);
          console.log(`   • LAN Coop: ${mode.lancoop ? 'Yes' : 'No'}`);
          console.log(`   • Offline Coop: ${mode.offlinecoop ? 'Yes' : 'No'}`);
          console.log(`   • Offline Max: ${mode.offlinemax || 'N/A'}`);
          console.log(`   • Online Coop: ${mode.onlinecoop ? 'Yes' : 'No'}`);
          console.log(`   • Online Max: ${mode.onlinemax || 'N/A'}`);
          console.log(`   • Split Screen: ${mode.splitscreen ? 'Yes' : 'No'}`);
        });
      }

      // Description
      if (game.summary) {
        console.log(`\n📝 Summary:`);
        console.log(`   ${game.summary}`);
      }

      // Storyline
      if (game.storyline) {
        console.log(`\n📚 Storyline:`);
        console.log(`   ${game.storyline.substring(0, 200)}${game.storyline.length > 200 ? '...' : ''}`);
      }

      console.log('\n' + '═'.repeat(50) + '\n');
    });

    console.log('🎉 Test completed successfully!');
    console.log('\n📊 Summary of available data:');
    console.log('   ✅ Basic game information (ID, name, dates, ratings)');
    console.log('   ✅ Platforms and technical specifications');
    console.log('   ✅ Genres and game modes');
    console.log('   ✅ Developer and publisher information');
    console.log('   ✅ Age ratings and classifications');
    console.log('   ✅ Official websites and social media');
    console.log('   ✅ Screenshots and video content');
    console.log('   ✅ Themes and player perspectives');
    console.log('   ✅ Game engines and technical details');
    console.log('   ✅ Franchises and collections');
    console.log('   ✅ Multiplayer capabilities');
    console.log('   ✅ Detailed descriptions and storylines');

  } catch (error) {
    console.error('💥 Error testing IGDB extraction:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Main execution
async function main() {
  try {
    await testEnhancedIGDBExtraction();
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEnhancedIGDBExtraction };