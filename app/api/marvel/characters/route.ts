import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const MARVEL_PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY || '';
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || '';
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

// Character groups definition with exact Marvel API names
const CHARACTER_GROUPS = {
  'spider-verse': [
    'Spider-Man (Miles Morales)',
    'Spider-Woman (Jessica Drew)',
    'Spider-Gwen (Gwen Stacy)',
    'Spider-Man (2099)',
    'Spider-Man (Peter Parker)',
    'Scarlet Spider (Ben Reilly)',
    'Spider-Man (Noir)',
    'Spider-Girl (May Parker)',
    'Spider-Man (Ben Reilly)',
    'Spider-Man (Ultimate)',
    'Spider-Woman (Mattie Franklin)',
    'Spider-Girl (Anya Corazon)',
    'Spider-Man (1602)',
    'Spider-Woman (Charlotte Witter)',
    'Spider-Man (Ai Apaec)'
  ],
  'spider-villains': [
    'Kingpin',
    'Black Cat',
    'Doctor Octopus',
    'Carnage',
    'Eddie Brock',
    'Morbius',
    'Kraven the Hunter',
    'Vulture (Adrian Toomes)',
    'Electro',
    'Lizard',
    'Mysterio',
    'Green Goblin (Norman Osborn)',
    'Silver Sable',
    'Rhino',
    'Tombstone'
  ],
  'marvel-universe': [
    'Daredevil',
    'Punisher',
    'Venom (Flash Thompson)',
    'Doctor Strange',
    'Iron Man',
    'Wolverine',
    'Deadpool',
    'Moon Knight',
    'Black Panther',
    'Captain America',
    'Thor',
    'Hulk',
    'Hawkeye',
    'Falcon',
    'Vision'
  ]
};

// Alternative names to try if the main name doesn't work
const ALTERNATIVE_NAMES: Record<string, string[]> = {
  'Spider-Man (Miles Morales)': ['Miles Morales', 'Spider-Man (Ultimate)'],
  'Spider-Woman (Jessica Drew)': ['Spider-Woman', 'Jessica Drew'],
  'Spider-Gwen (Gwen Stacy)': ['Spider-Gwen', 'Gwen Stacy (Earth-65)'],
  'Spider-Man (2099)': ['Spider-Man 2099', 'Miguel O\'Hara'],
  'Spider-Man (Peter Parker)': ['Spider-Man', 'Peter Parker'],
  'Scarlet Spider (Ben Reilly)': ['Scarlet Spider', 'Ben Reilly'],
  'Spider-Man (Noir)': ['Spider-Man Noir'],
  'Spider-Girl (May Parker)': ['Spider-Girl', 'May Parker'],
  'Spider-Man (Ben Reilly)': ['Ben Reilly'],
  'Spider-Man (Ultimate)': ['Ultimate Spider-Man'],
  'Spider-Woman (Mattie Franklin)': ['Mattie Franklin'],
  'Spider-Girl (Anya Corazon)': ['Anya Corazon', 'Araña'],
  'Spider-Man (1602)': ['Spider-Man 1602'],
  'Spider-Woman (Charlotte Witter)': ['Charlotte Witter'],
  'Spider-Man (Ai Apaec)': ['Ai Apaec'],
  'Venom (Flash Thompson)': ['Venom', 'Venom (Eddie Brock)', 'Venom (Mac Gargan)'],
  'Eddie Brock': ['Venom (Eddie Brock)', 'Venom'],
  'Vulture (Adrian Toomes)': ['Vulture', 'Adrian Toomes'],
  'Green Goblin (Norman Osborn)': ['Green Goblin', 'Norman Osborn']
};

// Generate Marvel API authentication hash
function generateAuthHash(): { ts: string; hash: string } {
  const ts = Date.now().toString();
  const hash = crypto
    .createHash('md5')
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest('hex');
  
  return { ts, hash };
}

// Build Marvel API URL with authentication
function buildMarvelUrl(endpoint: string, params: Record<string, string> = {}): string {
  const { ts, hash } = generateAuthHash();
  
  const searchParams = new URLSearchParams({
    apikey: MARVEL_PUBLIC_KEY,
    ts,
    hash,
    ...params
  });

  return `${MARVEL_BASE_URL}${endpoint}?${searchParams.toString()}`;
}

// Fetch a single character by exact name with alternatives
async function fetchCharacterByName(characterName: string) {
  try {
    // Try the main name first
    let character = await tryFetchCharacter(characterName);
    if (character) return character;
    
    // Try alternative names if available
    const alternatives = ALTERNATIVE_NAMES[characterName];
    if (alternatives) {
      for (const altName of alternatives) {
        character = await tryFetchCharacter(altName);
        if (character) return character;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching character ${characterName}:`, error);
    return null;
  }
}

// Helper function to try fetching a character
async function tryFetchCharacter(name: string) {
  try {
    const url = buildMarvelUrl('/characters', { 
      name: name,
      limit: '1'
    });
    
    console.log(`🔍 Trying to fetch: ${name}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch ${name}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.data.results && data.data.results.length > 0) {
      console.log(`✅ Found: ${name} -> ${data.data.results[0].name}`);
      return data.data.results[0];
    }
    
    console.log(`⚠️  No results for: ${name}`);
    return null;
  } catch (error) {
    console.error(`💥 Error fetching ${name}:`, error);
    return null;
  }
}

// Fetch multiple characters in parallel
async function fetchCharacterGroup(characterNames: string[]) {
  const promises = characterNames.map(name => fetchCharacterByName(name));
  const results = await Promise.all(promises);
  
  // Filter out null results and return valid characters
  const validCharacters = results.filter(character => character !== null);
  
  console.log(`📊 Successfully fetched ${validCharacters.length} out of ${characterNames.length} characters`);
  
  return validCharacters;
}

// Fallback data for Spider-Verse characters
const spiderVerseFallback = [
  {
    id: 1016181,
    name: "Spider-Man (Miles Morales)",
    description: "Miles Morales is a teenager from Brooklyn who gained spider-like powers.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/f/50/537bcfa1eed73", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/miles-morales" }],
    comics: { available: 200, items: [] },
    series: { available: 20, items: [] }
  },
  {
    id: 1009608,
    name: "Spider-Woman (Jessica Drew)",
    description: "Jessica Drew, the original Spider-Woman with unique spider-powers.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman" }],
    comics: { available: 300, items: [] },
    series: { available: 25, items: [] }
  },
  {
    id: 1017603,
    name: "Spider-Gwen (Gwen Stacy)",
    description: "Gwen Stacy from Earth-65, where she was bitten by a radioactive spider.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5480465f8c2b5", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-gwen" }],
    comics: { available: 50, items: [] },
    series: { available: 10, items: [] }
  },
  {
    id: 1014873,
    name: "Spider-Man (2099)",
    description: "Miguel O'Hara, the Spider-Man of the year 2099.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/4/60/52696929dc721", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-2099" }],
    comics: { available: 150, items: [] },
    series: { available: 15, items: [] }
  },
  {
    id: 1009610,
    name: "Spider-Man (Peter Parker)",
    description: "Peter Parker, the original Spider-Man from Queens, New York.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/1009610/spider-man" }],
    comics: { available: 4000, items: [] },
    series: { available: 150, items: [] }
  },
  {
    id: 1011197,
    name: "Scarlet Spider (Ben Reilly)",
    description: "Ben Reilly, the clone of Peter Parker who took on the identity of Scarlet Spider.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/scarlet-spider" }],
    comics: { available: 120, items: [] },
    series: { available: 12, items: [] }
  },
  {
    id: 1012295,
    name: "Spider-Man (Noir)",
    description: "Peter Parker from a 1930s noir universe, where he fights crime in black and white New York.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/40/531771a14fcf6", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-noir" }],
    comics: { available: 25, items: [] },
    series: { available: 5, items: [] }
  },
  {
    id: 1009609,
    name: "Spider-Girl (May Parker)",
    description: "May 'Mayday' Parker, the daughter of Peter Parker and Mary Jane Watson from an alternate future.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-girl" }],
    comics: { available: 120, items: [] },
    series: { available: 12, items: [] }
  },
  {
    id: 1014858,
    name: "Spider-Man (Ben Reilly)",
    description: "Ben Reilly as Spider-Man, the clone who temporarily took over the Spider-Man identity.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ben-reilly" }],
    comics: { available: 100, items: [] },
    series: { available: 10, items: [] }
  },
  {
    id: 1011010,
    name: "Spider-Man (Ultimate)",
    description: "Peter Parker from the Ultimate Universe, a modern reimagining of the classic Spider-Man story.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/531771b4e8c60", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ultimate" }],
    comics: { available: 160, items: [] },
    series: { available: 18, items: [] }
  },
  {
    id: 1009609,
    name: "Spider-Woman (Julia Carpenter)",
    description: "Julia Carpenter, the second Spider-Woman with psychic web-based powers and precognitive abilities.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-julia-carpenter" }],
    comics: { available: 150, items: [] },
    series: { available: 15, items: [] }
  },
  {
    id: 1011346,
    name: "Spider-Man (Kaine)",
    description: "Kaine Parker, the imperfect clone of Peter Parker who became the Scarlet Spider.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/kaine" }],
    comics: { available: 80, items: [] },
    series: { available: 8, items: [] }
  },
  {
    id: 1017604,
    name: "Spider-Woman (Mattie Franklin)",
    description: "Mattie Franklin, the third Spider-Woman who gained her powers through a mystical ceremony.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-mattie-franklin" }],
    comics: { available: 45, items: [] },
    series: { available: 5, items: [] }
  },
  {
    id: 1011348,
    name: "Spider-Boy",
    description: "Pete Ross, a fusion of Spider-Man and Superboy from the Amalgam Universe.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-boy" }],
    comics: { available: 25, items: [] },
    series: { available: 3, items: [] }
  },
  {
    id: 1009608,
    name: "Arachne",
    description: "Julia Carpenter in her Arachne identity, with enhanced spider-powers and the ability to create psychic webs that can affect the mind.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/arachne" }],
    comics: { available: 60, items: [] },
    series: { available: 7, items: [] }
  },
  {
    id: 1017605,
    name: "Spider-Girl (Anya Corazon)",
    description: "Anya Corazon, a teenage girl who gained spider-powers and became Spider-Girl, later taking on the identity of Araña.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/1/60/52696965ee017", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-girl-anya-corazon" }],
    comics: { available: 72, items: [] },
    series: { available: 8, items: [] }
  },
  {
    id: 1011054,
    name: "Spider-Man (1602)",
    description: "Peter Parquagh from the year 1602, a Renaissance-era version of Spider-Man in Neil Gaiman's alternate history.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/4c002e19a7796", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-1602" }],
    comics: { available: 44, items: [] },
    series: { available: 6, items: [] }
  },
  {
    id: 1009607,
    name: "Spider-Woman (Charlotte Witter)",
    description: "Charlotte Witter, the fourth Spider-Woman who gained her powers by stealing them from the other Spider-Women.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-charlotte-witter" }],
    comics: { available: 13, items: [] },
    series: { available: 3, items: [] }
  },
  {
    id: 1011055,
    name: "Spider-Man (Ai Apaec)",
    description: "An ancient Peruvian god who took on the form and powers of Spider-Man, serving as both ally and antagonist.",
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ai-apaec" }],
    comics: { available: 15, items: [] },
    series: { available: 4, items: [] }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Validate type parameter
    if (!type || !Object.keys(CHARACTER_GROUPS).includes(type)) {
      return NextResponse.json(
        { 
          error: 'Invalid type parameter', 
          validTypes: Object.keys(CHARACTER_GROUPS),
          message: 'Please specify either "spider-verse", "spider-villains", or "marvel-universe"'
        },
        { status: 400 }
      );
    }
    
    // Get character names for the requested type
    const characterNames = CHARACTER_GROUPS[type as keyof typeof CHARACTER_GROUPS];
    
    // Fetch all characters in parallel
    console.log(`Fetching ${characterNames.length} characters for type: ${type}`);
    let characters = await fetchCharacterGroup(characterNames);
    
    // Special handling for spider-verse - use fallback if we don't get enough characters
    if (type === 'spider-verse' && characters.length < 3) {
      console.log(`🔄 Using Spider-Verse fallback data due to low API success rate`);
      characters = spiderVerseFallback;
    }
    
    console.log(`Successfully returning ${characters.length} characters for type: ${type}`);
    
    // Return the results in Marvel API format
    return NextResponse.json({
      results: characters,
      count: characters.length,
      total: characterNames.length,
      type: type
    });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 