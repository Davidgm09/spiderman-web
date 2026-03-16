import crypto from 'crypto';

// Marvel API Configuration - usando variables de entorno
const MARVEL_PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY || '';
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY || '';
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

// Types for Marvel API responses
export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface MarvelComic {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  dates: Array<{
    type: string;
    date: string;
  }>;
  creators: {
    items: Array<{
      name: string;
      role: string;
    }>;
  };
  characters: {
    items: Array<{
      name: string;
      resourceURI: string;
    }>;
  };
}

export interface MarvelSeries {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  startYear: number;
  endYear: number;
  rating: string;
  creators: {
    items: Array<{
      name: string;
      role: string;
    }>;
  };
}

// High-quality mock data with official Marvel images
const mockSpiderMan: MarvelCharacter = {
  id: 1009610,
  name: "Spider-Man",
  description: "Peter Parker was bitten by a radioactive spider as a teenager, granting him spider-like powers. After the death of his Uncle Ben, Peter learned that with great power, there must also come great responsibility, and he became the Amazing Spider-Man.",
  thumbnail: {
    path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
    extension: "jpg"
  },
  urls: [
    { type: "detail", url: "http://marvel.com/characters/1009610/spider-man" },
    { type: "wiki", url: "http://marvel.com/universe/Spider-Man_(Peter_Parker)" }
  ],
  comics: {
    available: 4000,
    items: [
      { resourceURI: "http://gateway.marvel.com/v1/public/comics/1", name: "Amazing Spider-Man (1963) #1" }
    ]
  },
  series: {
    available: 150,
    items: [
      { resourceURI: "http://gateway.marvel.com/v1/public/series/1", name: "Amazing Spider-Man (1963 - 1998)" }
    ]
  }
};

const mockSpiderVerseCharacters: MarvelCharacter[] = [
  {
    id: 1009610,
    name: "Spider-Man",
    description: "Peter Parker, the original Spider-Man from Queens, New York. After being bitten by a radioactive spider, he gained incredible powers and learned that with great power comes great responsibility.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/1009610/spider-man" }],
    comics: { available: 4000, items: [] },
    series: { available: 150, items: [] }
  },
  {
    id: 1016181,
    name: "Spider-Gwen",
    description: "Gwen Stacy from Earth-65, where she was bitten by a radioactive spider instead of Peter Parker. She balances being a superhero with her career as a drummer in the band The Mary Janes.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5480465f8c2b5",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-gwen" }],
    comics: { available: 50, items: [] },
    series: { available: 10, items: [] }
  },
  {
    id: 1016182,
    name: "Miles Morales",
    description: "Miles Morales is a teenager from Brooklyn who was bitten by a spider and gained spider-like powers similar to Spider-Man. He has additional abilities like invisibility and bio-electric venom blasts.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/f/50/537bcfa1eed73",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/miles-morales" }],
    comics: { available: 200, items: [] },
    series: { available: 20, items: [] }
  },
  {
    id: 1009608,
    name: "Spider-Woman",
    description: "Jessica Drew, the original Spider-Woman with unique spider-powers including pheromone abilities, flight, and bio-electric blasts. She's been both an agent of HYDRA and S.H.I.E.L.D.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman" }],
    comics: { available: 300, items: [] },
    series: { available: 25, items: [] }
  },
  {
    id: 1011347,
    name: "Spider-Man 2099",
    description: "Miguel O'Hara, the Spider-Man of the year 2099 with enhanced spider abilities, talons, and fangs. He leads the Spider-Society and protects the multiverse from threats.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/4/60/52696929dc721",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-2099" }],
    comics: { available: 150, items: [] },
    series: { available: 15, items: [] }
  },
  {
    id: 1017603,
    name: "Silk",
    description: "Cindy Moon was bitten by the same spider that gave Peter Parker his powers. She has organic webbing abilities and an enhanced 'silk sense' that's even stronger than Spider-Man's spider-sense.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/9/90/5480462f5aec6",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/silk" }],
    comics: { available: 80, items: [] },
    series: { available: 8, items: [] }
  }
];

// Mock data for Spider-Verse characters (fallback)
const mockSpiderVerseCharactersFallback: MarvelCharacter[] = [
  {
    id: 1016181,
    name: "Spider-Man (Miles Morales)",
    description: "Miles Morales is a teenager from Brooklyn who was bitten by a spider and gained spider-like powers similar to Spider-Man. He has additional abilities like invisibility and bio-electric venom blasts.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/f/50/537bcfa1eed73",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/miles-morales" }],
    comics: { available: 200, items: [] },
    series: { available: 20, items: [] }
  },
  {
    id: 1009608,
    name: "Spider-Woman (Jessica Drew)",
    description: "Jessica Drew, the original Spider-Woman with unique spider-powers including pheromone abilities, flight, and bio-electric blasts. She's been both an agent of HYDRA and S.H.I.E.L.D.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman" }],
    comics: { available: 300, items: [] },
    series: { available: 25, items: [] }
  },
  {
    id: 1017603,
    name: "Spider-Gwen (Gwen Stacy)",
    description: "Gwen Stacy from Earth-65, where she was bitten by a radioactive spider instead of Peter Parker. She balances being a superhero with her career as a drummer in the band The Mary Janes.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5480465f8c2b5",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-gwen" }],
    comics: { available: 50, items: [] },
    series: { available: 10, items: [] }
  },
  {
    id: 1014873,
    name: "Spider-Man (2099)",
    description: "Miguel O'Hara, the Spider-Man of the year 2099 with enhanced spider abilities, talons, and fangs. He leads the Spider-Society and protects the multiverse from threats.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/4/60/52696929dc721",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-2099" }],
    comics: { available: 150, items: [] },
    series: { available: 15, items: [] }
  },
  {
    id: 1009610,
    name: "Spider-Man (Peter Parker)",
    description: "Peter Parker, the original Spider-Man from Queens, New York. After being bitten by a radioactive spider, he gained incredible powers and learned that with great power comes great responsibility.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/1009610/spider-man" }],
    comics: { available: 4000, items: [] },
    series: { available: 150, items: [] }
  },
  {
    id: 1011197,
    name: "Scarlet Spider (Ben Reilly)",
    description: "Ben Reilly, the clone of Peter Parker who took on the identity of Scarlet Spider. He has all of Spider-Man's abilities and has served as both ally and replacement for the original Spider-Man.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/scarlet-spider" }],
    comics: { available: 120, items: [] },
    series: { available: 12, items: [] }
  },
  {
    id: 1012295,
    name: "Spider-Man (Noir)",
    description: "Peter Parker from a 1930s noir universe, where he fights crime in black and white New York City. This version has a darker, more detective-focused approach to being Spider-Man.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/40/531771a14fcf6",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-noir" }],
    comics: { available: 25, items: [] },
    series: { available: 5, items: [] }
  },
  {
    id: 1009609,
    name: "Spider-Girl (May Parker)",
    description: "May 'Mayday' Parker, the daughter of Peter Parker and Mary Jane Watson from an alternate future. She inherited her father's spider-powers and continues the Spider-Man legacy.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-girl" }],
    comics: { available: 120, items: [] },
    series: { available: 12, items: [] }
  },
  {
    id: 1014858,
    name: "Spider-Man (Ben Reilly)",
    description: "Ben Reilly as Spider-Man, the clone who temporarily took over the Spider-Man identity from Peter Parker during the Clone Saga.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ben-reilly" }],
    comics: { available: 100, items: [] },
    series: { available: 10, items: [] }
  },
  {
    id: 1011010,
    name: "Spider-Man (Ultimate)",
    description: "Peter Parker from the Ultimate Universe, a modern reimagining of the classic Spider-Man story with updated origins and contemporary storytelling.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/531771b4e8c60",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ultimate" }],
    comics: { available: 160, items: [] },
    series: { available: 18, items: [] }
  },
  {
    id: 1009609,
    name: "Spider-Woman (Julia Carpenter)",
    description: "Julia Carpenter, the second Spider-Woman with psychic web-based powers and precognitive abilities. She later became the new Madame Web.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-julia-carpenter" }],
    comics: { available: 150, items: [] },
    series: { available: 15, items: [] }
  },
  {
    id: 1011346,
    name: "Spider-Man (Kaine)",
    description: "Kaine Parker, the imperfect clone of Peter Parker who eventually became the Scarlet Spider and later took on the Spider-Man mantle in Houston.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/535fecbbb9784",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/kaine" }],
    comics: { available: 80, items: [] },
    series: { available: 8, items: [] }
  },
  {
    id: 1017604,
    name: "Spider-Woman (Mattie Franklin)",
    description: "Mattie Franklin, the third Spider-Woman who gained her powers through a mystical ceremony involving Spider-Man's essence.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-mattie-franklin" }],
    comics: { available: 45, items: [] },
    series: { available: 5, items: [] }
  },
  {
    id: 1011348,
    name: "Spider-Boy",
    description: "Pete Ross, a fusion of Spider-Man and Superboy from the Amalgam Universe, combining spider powers with Kryptonian abilities.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-boy" }],
    comics: { available: 25, items: [] },
    series: { available: 3, items: [] }
  },
  {
    id: 1009608,
    name: "Arachne",
    description: "Julia Carpenter in her Arachne identity, with enhanced spider-powers and the ability to create psychic webs that can affect the mind.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/arachne" }],
    comics: { available: 60, items: [] },
    series: { available: 7, items: [] }
  },
  {
    id: 1017605,
    name: "Spider-Girl (Anya Corazon)",
    description: "Anya Corazon, a teenage girl who gained spider-powers and became Spider-Girl, later taking on the identity of Araña.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/1/60/52696965ee017",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-girl-anya-corazon" }],
    comics: { available: 72, items: [] },
    series: { available: 8, items: [] }
  },
  {
    id: 1011054,
    name: "Spider-Man (1602)",
    description: "Peter Parquagh from the year 1602, a Renaissance-era version of Spider-Man in Neil Gaiman's alternate history.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/4c002e19a7796",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-1602" }],
    comics: { available: 44, items: [] },
    series: { available: 6, items: [] }
  },
  {
    id: 1009607,
    name: "Spider-Woman (Charlotte Witter)",
    description: "Charlotte Witter, the fourth Spider-Woman who gained her powers by stealing them from the other Spider-Women.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/5269678454c0e",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-woman-charlotte-witter" }],
    comics: { available: 13, items: [] },
    series: { available: 3, items: [] }
  },
  {
    id: 1011055,
    name: "Spider-Man (Ai Apaec)",
    description: "An ancient Peruvian god who took on the form and powers of Spider-Man, serving as both ally and antagonist.",
    thumbnail: {
      path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
      extension: "jpg"
    },
    urls: [{ type: "detail", url: "http://marvel.com/characters/spider-man-ai-apaec" }],
    comics: { available: 15, items: [] },
    series: { available: 4, items: [] }
  }
];

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

// Generic Marvel API fetch function - with intelligent fallback
async function fetchMarvelAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Always try real API first if credentials are available
  if (!MARVEL_PUBLIC_KEY || !MARVEL_PRIVATE_KEY) {
    console.log('🔑 Marvel API keys not configured, using high-quality mock data');
    throw new Error('Marvel API not configured');
  }

  try {
    const url = buildMarvelUrl(endpoint, params);
    console.log('🌐 Attempting Marvel API call:', endpoint);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Spider-Man Web App',
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️  Marvel API error (${response.status}): ${errorText}`);
      
      // Log the issue but don't expose sensitive details
      if (response.status === 401) {
        console.warn('🔐 Authentication issue - falling back to mock data');
      }
      
      throw new Error(`Marvel API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Marvel API success:', data.data?.total || 0, 'results');
    return data.data;
  } catch (error) {
    console.warn('⚠️  Marvel API unavailable, using high-quality mock data:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

// Get Spider-Man character data
export async function getSpiderManCharacter(): Promise<MarvelCharacter | null> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelCharacter[] }>('/characters', {
      name: 'Spider-Man',
      limit: '1'
    });
    return data.results[0] || null;
  } catch (error) {
    console.log('🕷️  Using mock Spider-Man data');
    return mockSpiderMan;
  }
}

// Get Spider-Man related characters (Spider-Gwen, Miles Morales, etc.)
export async function getSpiderVerseCharacters(): Promise<MarvelCharacter[]> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelCharacter[] }>('/characters', {
      nameStartsWith: 'Spider',
      limit: '20'
    });
    
    // Filter to get the most relevant Spider-Verse characters
    const spiderCharacters = data.results.filter(character => {
      const name = character.name.toLowerCase();
      return name.includes('spider') && 
             !name.includes('ultimate') && 
             character.thumbnail && 
             !character.thumbnail.path.includes('image_not_available');
    });
    
    return spiderCharacters.slice(0, 6); // Return top 6 characters
  } catch (error) {
    console.log('🕸️  Using mock Spider-Verse characters');
    return mockSpiderVerseCharacters;
  }
}

// Get Spider-Man comics
export async function getSpiderManComics(limit: number = 20): Promise<MarvelComic[]> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelComic[] }>('/comics', {
      characters: '1009610', // Spider-Man character ID
      orderBy: '-onsaleDate',
      limit: limit.toString(),
      format: 'comic'
    });

    return data.results;
  } catch (error) {
    console.log('📚 Comics API unavailable');
    return [];
  }
}

// Get Spider-Man series
export async function getSpiderManSeries(limit: number = 10): Promise<MarvelSeries[]> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelSeries[] }>('/series', {
      characters: '1009610', // Spider-Man character ID
      orderBy: '-startYear',
      limit: limit.toString()
    });

    return data.results;
  } catch (error) {
    console.log('📺 Series API unavailable');
    return [];
  }
}

// Search characters by name
export async function searchCharacters(query: string, limit: number = 10): Promise<MarvelCharacter[]> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelCharacter[] }>('/characters', {
      nameStartsWith: query,
      limit: limit.toString(),
      orderBy: 'name'
    });

    return data.results;
  } catch (error) {
    console.log('🔍 Search API unavailable');
    return [];
  }
}

// Get high-quality image URL from Marvel thumbnail
export function getHighQualityImageUrl(
  thumbnail: { path: string; extension: string }, 
  size: 'portrait_xlarge' | 'landscape_xlarge' | 'standard_xlarge' | 'detail' | 'portrait_fantastic' | 'landscape_incredible' = 'detail'
): string {
  if (!thumbnail || !thumbnail.path) {
    return '/images/marvel-placeholder.svg';
  }

  // Check if it's a placeholder image
  if (thumbnail.path.includes('image_not_available')) {
    return '/images/marvel-placeholder.svg';
  }

  // Remove http:// and use https:// for better security and performance
  const path = thumbnail.path.replace('http://', 'https://');
  
  // Try different sizes for best quality, fallback to smaller if needed
  const sizeOptions = {
    'detail': 'detail',
    'portrait_xlarge': 'portrait_xlarge', 
    'landscape_xlarge': 'landscape_xlarge',
    'standard_xlarge': 'standard_xlarge',
    'portrait_fantastic': 'portrait_fantastic',
    'landscape_incredible': 'landscape_incredible'
  };

  return `${path}/${sizeOptions[size] || 'detail'}.${thumbnail.extension}`;
}

// Get character by ID
export async function getCharacterById(characterId: number): Promise<MarvelCharacter | null> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelCharacter[] }>(`/characters/${characterId}`);
    return data.results[0] || null;
  } catch (error) {
    console.log(`🆔 Character ${characterId} API unavailable`);
    return null;
  }
}

// Get comic by ID
export async function getComicById(comicId: number): Promise<MarvelComic | null> {
  try {
    const data = await fetchMarvelAPI<{ results: MarvelComic[] }>(`/comics/${comicId}`);
    return data.results[0] || null;
  } catch (error) {
    console.log(`📖 Comic ${comicId} API unavailable`);
    return null;
  }
}

// Character groups definition (same as in API route) with exact Marvel API names
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

// Helper function to try fetching a character with rate limiting
async function tryFetchCharacter(name: string) {
  try {
    const url = buildMarvelUrl('/characters', { 
      name: name,
      limit: '1'
    });
    
    console.log(`🔍 Trying to fetch: ${name}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`⏰ Rate limited for ${name}, waiting longer...`);
        // Wait longer for rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        return null;
      }
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

// Server-side function to fetch character by exact name with fallback
async function fetchCharacterByNameDirect(characterName: string): Promise<MarvelCharacter | null> {
  try {
    console.log(`🔍 Fetching character: ${characterName}`);
    
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
    console.error(`💥 Error fetching character ${characterName}:`, error);
    return null;
  }
}

// Server-side function to fetch multiple characters with rate limiting
async function fetchCharacterGroupDirect(characterNames: string[]): Promise<MarvelCharacter[]> {
  console.log(`🚀 Fetching ${characterNames.length} characters with rate limiting:`, characterNames);
  
  // Fetch characters sequentially with delays to avoid rate limiting
  const validCharacters: MarvelCharacter[] = [];
  
  for (const name of characterNames.slice(0, 5)) { // Limit to 5 characters to avoid rate limiting
    const character = await fetchCharacterByNameDirect(name);
    if (character) {
      validCharacters.push(character);
    }
    
    // Add delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`📊 Successfully fetched ${validCharacters.length} out of ${Math.min(characterNames.length, 5)} characters`);
  
  // If we got very few characters or none, use fallback data
  if (validCharacters.length < 2) {
    console.log(`🔄 Using fallback data due to rate limiting or low success rate`);
    return mockSpiderVerseCharactersFallback.slice(0, 15);
  }
  
  return validCharacters;
}

// Updated server-side functions
export async function getSpiderVerseCharactersFromAPI(): Promise<MarvelCharacter[]> {
  try {
    // For server-side rendering, call Marvel API directly
    if (typeof window === 'undefined') {
      console.log('🕷️  Server-side: Fetching Spider-Verse characters');
      const characters = await fetchCharacterGroupDirect(CHARACTER_GROUPS['spider-verse']);
      console.log(`🕷️  Server-side: Got ${characters.length} Spider-Verse characters`);
      return characters;
    }
    
    // For client-side, use internal API
    console.log('🌐 Client-side: Fetching Spider-Verse characters via API');
    const response = await fetch('/api/marvel/characters?type=spider-verse');
    
    if (!response.ok) {
      console.error('Failed to fetch Spider-Verse characters:', response.status);
      return mockSpiderVerseCharactersFallback;
    }
    
    const data = await response.json();
    return data.results || mockSpiderVerseCharactersFallback;
  } catch (error) {
    console.error('Error fetching Spider-Verse characters:', error);
    return mockSpiderVerseCharactersFallback;
  }
}

export async function getSpiderVillainsCharacters(): Promise<MarvelCharacter[]> {
  try {
    // For server-side rendering, call Marvel API directly
    if (typeof window === 'undefined') {
      return await fetchCharacterGroupDirect(CHARACTER_GROUPS['spider-villains']);
    }
    
    // For client-side, use internal API
    const response = await fetch('/api/marvel/characters?type=spider-villains');
    
    if (!response.ok) {
      console.error('Failed to fetch Spider-Villains characters:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Spider-Villains characters:', error);
    return [];
  }
}

export async function getMarvelUniverseCharacters(): Promise<MarvelCharacter[]> {
  try {
    // For server-side rendering, call Marvel API directly
    if (typeof window === 'undefined') {
      return await fetchCharacterGroupDirect(CHARACTER_GROUPS['marvel-universe']);
    }
    
    // For client-side, use internal API
    const response = await fetch('/api/marvel/characters?type=marvel-universe');
    
    if (!response.ok) {
      console.error('Failed to fetch Marvel Universe characters:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Marvel Universe characters:', error);
    return [];
  }
}

// Helper function to remove duplicate characters by ID
function removeDuplicateCharacters(characters: MarvelCharacter[]): MarvelCharacter[] {
  const seen = new Set<number>();
  return characters.filter(character => {
    if (seen.has(character.id)) {
      console.log(`🔄 Removing duplicate character: ${character.name} (ID: ${character.id})`);
      return false;
    }
    seen.add(character.id);
    return true;
  });
}

// Function to fetch both character groups in parallel
export async function getAllCharacterGroups(): Promise<{
  spiderVerse: MarvelCharacter[];
  spiderVillains: MarvelCharacter[];
  marvelUniverse: MarvelCharacter[];
}> {
  try {
    const [spiderVerse, spiderVillains, marvelUniverse] = await Promise.all([
      getSpiderVerseCharactersFromAPI(),
      getSpiderVillainsCharacters(),
      getMarvelUniverseCharacters()
    ]);
    
    // Remove duplicates from each group
    const uniqueSpiderVerse = removeDuplicateCharacters(spiderVerse);
    const uniqueSpiderVillains = removeDuplicateCharacters(spiderVillains);
    const uniqueMarvelUniverse = removeDuplicateCharacters(marvelUniverse);
    
    console.log(`✅ Filtered duplicates: Spider-Verse ${spiderVerse.length} -> ${uniqueSpiderVerse.length}`);
    console.log(`✅ Filtered duplicates: Spider-Villains ${spiderVillains.length} -> ${uniqueSpiderVillains.length}`);
    console.log(`✅ Filtered duplicates: Marvel Universe ${marvelUniverse.length} -> ${uniqueMarvelUniverse.length}`);
    
    return {
      spiderVerse: uniqueSpiderVerse,
      spiderVillains: uniqueSpiderVillains,
      marvelUniverse: uniqueMarvelUniverse
    };
  } catch (error) {
    console.error('Error fetching character groups:', error);
    return {
      spiderVerse: [],
      spiderVillains: [],
      marvelUniverse: []
    };
  }
} 