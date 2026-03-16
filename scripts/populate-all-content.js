const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 🎬 PELÍCULAS DE SPIDER-MAN
const MOVIES_DATA = [
  {
    title: "Spider-Man",
    originalTitle: "Spider-Man",
    year: 2002,
    releaseDate: "2002-05-03",
    duration: "121 min",
    director: "Sam Raimi",
    platform: "Theatrical",
    rating: 4.6,
    image: "https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg",
    description: "El origen de Spider-Man con Tobey Maguire",
    longDescription: "Peter Parker, un estudiante de secundaria, es mordido por una araña radiactiva y obtiene superpoderes. Debe aprender a usar sus habilidades para proteger Nueva York del malvado Green Goblin.",
    slug: "spider-man-2002",
    seoTitle: "Spider-Man (2002) - La película que inició todo",
    seoDescription: "La película original de Spider-Man dirigida por Sam Raimi que lanzó la era moderna de películas de superhéroes.",
    keywords: ["Spider-Man", "Tobey Maguire", "Sam Raimi", "2002", "origen"],
    actors: ["Tobey Maguire", "Kirsten Dunst", "Willem Dafoe", "James Franco"],
    genre: ["Acción", "Aventura", "Ciencia Ficción"],
    boxOffice: "$825 millones",
    budget: "$139 millones",
    studio: "Sony Pictures",
    backdropImages: []
  },
  {
    title: "Spider-Man 2",
    originalTitle: "Spider-Man 2",
    year: 2004,
    releaseDate: "2004-06-30",
    duration: "127 min",
    director: "Sam Raimi",
    platform: "Theatrical",
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/olxpyq9kJAZ2NU1siLshhhXEPR7.jpg",
    description: "Spider-Man enfrenta al Doctor Octopus",
    longDescription: "Peter Parker lucha por mantener el equilibrio entre su vida como Spider-Man y su vida personal mientras enfrenta al brillante científico Dr. Otto Octavius, quien se convierte en el villano Doctor Octopus.",
    slug: "spider-man-2-2004",
    seoTitle: "Spider-Man 2 (2004) - La secuela perfecta",
    seoDescription: "Considerada una de las mejores películas de superhéroes, Spider-Man 2 eleva la fórmula a nuevas alturas.",
    keywords: ["Spider-Man 2", "Doctor Octopus", "Alfred Molina", "2004"],
    actors: ["Tobey Maguire", "Kirsten Dunst", "Alfred Molina", "James Franco"],
    genre: ["Acción", "Aventura", "Ciencia Ficción"],
    boxOffice: "$788 millones",
    budget: "$200 millones",
    studio: "Sony Pictures",
    backdropImages: []
  },
  {
    title: "Spider-Man: No Way Home",
    originalTitle: "Spider-Man: No Way Home",
    year: 2021,
    releaseDate: "2021-12-17",
    duration: "148 min",
    director: "Jon Watts",
    platform: "Theatrical",
    rating: 4.9,
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    description: "El multiverso de Spider-Man se abre",
    longDescription: "Peter Parker debe enfrentarse a villanos de universos alternativos cuando un hechizo sale mal, trayendo a enemigos que conocen su identidad secreta.",
    slug: "spider-man-no-way-home",
    seoTitle: "Spider-Man: No Way Home - El evento del multiverso",
    seoDescription: "La película más ambiciosa de Spider-Man que une tres generaciones de héroes arácnidos.",
    keywords: ["No Way Home", "Tom Holland", "Multiverso", "2021"],
    actors: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Tobey Maguire", "Andrew Garfield"],
    genre: ["Acción", "Aventura", "Ciencia Ficción"],
    boxOffice: "$1.921 billones",
    budget: "$200 millones",
    studio: "Sony Pictures / Marvel Studios",
    backdropImages: []
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    originalTitle: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    releaseDate: "2018-12-14",
    duration: "117 min",
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    platform: "Theatrical",
    rating: 4.7,
    image: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    description: "Miles Morales se convierte en Spider-Man",
    longDescription: "Un adolescente de Brooklyn debe asumir el manto de Spider-Man cuando se abre el multiverso y conoce a otros Spider-People de diferentes dimensiones.",
    slug: "spider-man-into-the-spider-verse",
    seoTitle: "Spider-Man: Into the Spider-Verse - Animación revolucionaria",
    seoDescription: "La película animada que redefinió lo que puede ser una película de Spider-Man.",
    keywords: ["Spider-Verse", "Miles Morales", "Animación", "2018"],
    actors: ["Shameik Moore", "Hailee Steinfeld", "Jake Johnson", "Liev Schreiber"],
    genre: ["Animación", "Acción", "Aventura"],
    boxOffice: "$375 millones",
    budget: "$90 millones",
    studio: "Sony Pictures Animation",
    backdropImages: []
  },
  {
    title: "Venom",
    originalTitle: "Venom",
    year: 2018,
    releaseDate: "2018-10-05",
    duration: "112 min",
    director: "Ruben Fleischer",
    platform: "Theatrical",
    rating: 4.2,
    image: "https://image.tmdb.org/t/p/w500/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",
    description: "Eddie Brock se convierte en Venom",
    longDescription: "Un periodista investiga una corporación y se fusiona accidentalmente con un simbionte alienígena que le otorga superpoderes.",
    slug: "venom-2018",
    seoTitle: "Venom (2018) - El antihéroe simbionte",
    seoDescription: "Tom Hardy da vida al icónico villano/antihéroe Venom en esta película de Sony.",
    keywords: ["Venom", "Tom Hardy", "Simbionte", "2018"],
    actors: ["Tom Hardy", "Michelle Williams", "Riz Ahmed", "Scott Haze"],
    genre: ["Acción", "Ciencia Ficción", "Thriller"],
    boxOffice: "$856 millones",
    budget: "$100 millones",
    studio: "Sony Pictures",
    backdropImages: []
  }
];

// 📚 CÓMICS ICÓNICOS
const COMICS_DATA = [
  {
    title: "Amazing Fantasy #15",
    subtitle: "La primera aparición de Spider-Man",
    year: "1962",
    writer: "Stan Lee",
    artist: "Steve Ditko",
    publisher: "Marvel Comics",
    pages: 11,
    price: "$0.12 (original)",
    rating: 5.0,
    importance: "Primera aparición",
    image: "https://i.annihil.us/u/prod/marvel/i/mg/6/c0/4bc6a2497684e.jpg",
    description: "El cómic que introdujo a Spider-Man al mundo",
    longDescription: "En este histórico cómic, Peter Parker es mordido por una araña radiactiva y aprende que 'un gran poder conlleva una gran responsabilidad' cuando no logra detener al ladrón que mata a su tío Ben.",
    slug: "amazing-fantasy-15",
    seoTitle: "Amazing Fantasy #15 - El nacimiento de Spider-Man",
    seoDescription: "El cómic más importante en la historia de Spider-Man donde todo comenzó en 1962.",
    keywords: ["Amazing Fantasy", "Primera aparición", "Stan Lee", "Steve Ditko"],
    characters: ["Spider-Man", "Uncle Ben", "Aunt May"],
    storylines: ["Origen de Spider-Man"],
    firstAppearances: ["Spider-Man", "Peter Parker", "Uncle Ben", "Aunt May"],
    backdropImages: []
  },
  {
    title: "The Amazing Spider-Man #1",
    subtitle: "El primer cómic dedicado a Spider-Man",
    year: "1963",
    writer: "Stan Lee",
    artist: "Steve Ditko",
    publisher: "Marvel Comics",
    pages: 22,
    price: "$0.12 (original)",
    rating: 4.8,
    importance: "Primera serie",
    image: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/4bc6a239b93c8.jpg",
    description: "El primer número de la serie propia de Spider-Man",
    longDescription: "Spider-Man obtiene su propia serie de cómics. En esta historia, Peter intenta unirse a los Cuatro Fantásticos y enfrenta al Camaleón en su primera aventura como héroe.",
    slug: "amazing-spider-man-1",
    seoTitle: "Amazing Spider-Man #1 - La primera serie",
    seoDescription: "El histórico primer número de la serie que convertiría a Spider-Man en el héroe más popular de Marvel.",
    keywords: ["Amazing Spider-Man", "Primera serie", "Camaleón", "1963"],
    characters: ["Spider-Man", "Chameleon", "Fantastic Four"],
    storylines: ["Primera aventura"],
    firstAppearances: ["Chameleon"],
    backdropImages: []
  },
  {
    title: "Ultimate Spider-Man #1",
    subtitle: "El Spider-Man para el siglo XXI",
    year: "2000",
    writer: "Brian Michael Bendis",
    artist: "Mark Bagley",
    publisher: "Marvel Comics",
    pages: 22,
    price: "$2.25",
    rating: 4.7,
    importance: "Reinvención moderna",
    image: "https://i.annihil.us/u/prod/marvel/i/mg/3/f0/4bc6a1c5b5c2e.jpg",
    description: "Una reinvención moderna del origen de Spider-Man",
    longDescription: "Brian Michael Bendis reimagina el origen de Spider-Man para una nueva generación, actualizando la historia para el siglo XXI con un enfoque más realista y profundo en el desarrollo del personaje.",
    slug: "ultimate-spider-man-1",
    seoTitle: "Ultimate Spider-Man #1 - La reinvención moderna",
    seoDescription: "El cómic que revitalizó Spider-Man para una nueva generación de lectores.",
    keywords: ["Ultimate Spider-Man", "Brian Michael Bendis", "Mark Bagley", "2000"],
    characters: ["Peter Parker", "Uncle Ben", "Aunt May", "Norman Osborn"],
    storylines: ["Ultimate Origin"],
    firstAppearances: ["Ultimate Spider-Man"],
    backdropImages: []
  },
  {
    title: "Spider-Man: Blue",
    subtitle: "Una carta de amor a Gwen Stacy",
    year: "2002-2003",
    writer: "Jeph Loeb",
    artist: "Tim Sale",
    publisher: "Marvel Comics",
    pages: 132,
    price: "$19.99",
    rating: 4.9,
    importance: "Historia clásica",
    image: "https://i.annihil.us/u/prod/marvel/i/mg/c/e0/4bc6a1986e5e4.jpg",
    description: "Peter Parker recuerda su tiempo con Gwen Stacy",
    longDescription: "Una emotiva historia donde Peter Parker graba cassettes contando a su fallecida novia Gwen Stacy sobre sus aventuras como Spider-Man, explorando su primer gran amor y pérdida.",
    slug: "spider-man-blue",
    seoTitle: "Spider-Man: Blue - La historia de Gwen Stacy",
    seoDescription: "Una de las historias más emotivas de Spider-Man por Jeph Loeb y Tim Sale.",
    keywords: ["Spider-Man Blue", "Gwen Stacy", "Jeph Loeb", "Tim Sale"],
    characters: ["Spider-Man", "Gwen Stacy", "Green Goblin", "Harry Osborn"],
    storylines: ["Gwen Stacy Saga"],
    firstAppearances: [],
    backdropImages: []
  },
  {
    title: "Spider-Verse",
    subtitle: "Todos los Spider-Man juntos",
    year: "2014-2015",
    writer: "Dan Slott",
    artist: "Olivier Coipel",
    publisher: "Marvel Comics",
    pages: 200,
    price: "$24.99",
    rating: 4.6,
    importance: "Evento multiversal",
    image: "https://i.annihil.us/u/prod/marvel/i/mg/9/d0/545a53e8cc40c.jpg",
    description: "El evento que unió a todos los Spider-Man del multiverso",
    longDescription: "Morlun y su familia cazan a todos los Spider-totems a través del multiverso. Spider-Man debe unir a todas las versiones de sí mismo para salvar la realidad.",
    slug: "spider-verse-event",
    seoTitle: "Spider-Verse - El evento multiversal",
    seoDescription: "El épico evento que inspiró la película Into the Spider-Verse.",
    keywords: ["Spider-Verse", "Multiverso", "Dan Slott", "Morlun"],
    characters: ["Spider-Man", "Spider-Gwen", "Spider-Man 2099", "Silk"],
    storylines: ["Spider-Verse", "Multiverso"],
    firstAppearances: ["Spider-Gwen", "Silk"],
    backdropImages: []
  }
];

// 🎮 VIDEOJUEGOS
const GAMES_DATA = [
  {
    title: "Spider-Man 2",
    subtitle: "El juego que perfeccionó el web-swinging",
    year: 2004,
    platform: ["PlayStation 2", "Xbox", "GameCube", "PC"],
    developer: "Treyarch",
    publisher: "Activision",
    genre: "Acción/Aventura",
    rating: 4.7,
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nsq.jpg",
    description: "El juego basado en la película Spider-Man 2",
    longDescription: "Revolucionó los juegos de Spider-Man con su sistema de web-swinging realista. Los jugadores pueden balancearse libremente por Manhattan en mundo abierto.",
    slug: "spider-man-2-game",
    seoTitle: "Spider-Man 2 (2004) - El juego que cambió todo",
    seoDescription: "El videojuego que estableció el estándar para los juegos de Spider-Man con su web-swinging revolucionario.",
    keywords: ["Spider-Man 2", "Web-swinging", "Treyarch", "2004"],
    gameplayFeatures: ["Mundo abierto", "Web-swinging realista", "Combate acrobático"],
    modes: ["Historia", "Mundo libre"],
    ageRating: "T (Teen)",
    backdropImages: []
  },
  {
    title: "Marvel's Spider-Man",
    subtitle: "La obra maestra de Insomniac Games",
    year: 2018,
    platform: ["PlayStation 4", "PlayStation 5", "PC"],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    genre: "Acción/Aventura",
    rating: 4.9,
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tpg.jpg",
    description: "La experiencia definitiva de Spider-Man",
    longDescription: "Un Peter Parker experimentado protege Nueva York con mecánicas de combate fluidas, web-swinging perfeccionado y una historia original emocionante.",
    slug: "marvels-spider-man-2018",
    seoTitle: "Marvel's Spider-Man (2018) - La obra maestra",
    seoDescription: "El juego que redefinió lo que puede ser un videojuego de Spider-Man, creado por Insomniac Games.",
    keywords: ["Marvel's Spider-Man", "Insomniac Games", "PS4", "2018"],
    gameplayFeatures: ["Web-swinging mejorado", "Combate dinámico", "Trajes únicos", "Historia original"],
    modes: ["Campaña", "Actividades secundarias", "DLC"],
    ageRating: "T (Teen)",
    backdropImages: []
  },
  {
    title: "Spider-Man: Miles Morales",
    subtitle: "El nuevo Spider-Man toma el mando",
    year: 2020,
    platform: ["PlayStation 4", "PlayStation 5", "PC"],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    genre: "Acción/Aventura",
    rating: 4.8,
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ekt.jpg",
    description: "Miles Morales se convierte en el nuevo Spider-Man",
    longDescription: "Una historia independiente que sigue a Miles Morales mientras aprende a ser Spider-Man con sus propios poderes únicos de bioelectricidad e invisibilidad.",
    slug: "spider-man-miles-morales",
    seoTitle: "Spider-Man: Miles Morales - El nuevo héroe",
    seoDescription: "La historia de Miles Morales como el nuevo Spider-Man con poderes únicos.",
    keywords: ["Miles Morales", "Bioelectricidad", "Invisibilidad", "PS5"],
    gameplayFeatures: ["Poderes de Venom", "Camuflaje", "Nuevas mecánicas", "Ray tracing"],
    modes: ["Campaña", "Actividades", "Foto"],
    ageRating: "T (Teen)",
    backdropImages: []
  },
  {
    title: "Spider-Man 2 (2023)",
    subtitle: "Dos Spider-Man, una aventura épica",
    year: 2023,
    platform: ["PlayStation 5"],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    genre: "Acción/Aventura",
    rating: 4.9,
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5wkj.jpg",
    description: "Peter Parker y Miles Morales unidos",
    longDescription: "Ambos Spider-Man trabajan juntos para proteger Nueva York de nuevas amenazas, incluyendo Kraven el Cazador y el simbionte Venom.",
    slug: "spider-man-2-2023",
    seoTitle: "Spider-Man 2 (2023) - Dos héroes, una historia",
    seoDescription: "La secuela que permite jugar como Peter Parker y Miles Morales en la misma aventura.",
    keywords: ["Spider-Man 2", "Peter Parker", "Miles Morales", "Venom", "Kraven"],
    gameplayFeatures: ["Dos personajes jugables", "Symbiote powers", "Brooklyn y Queens", "Web Wings"],
    modes: ["Campaña cooperativa", "Cambio de personaje"],
    ageRating: "T (Teen)",
    backdropImages: []
  },
  {
    title: "Spider-Man: Web of Shadows",
    subtitle: "Elige tu camino en la invasión simbionte",
    year: 2008,
    platform: ["PlayStation 3", "Xbox 360", "PC", "Wii"],
    developer: "Shaba Games",
    publisher: "Activision",
    genre: "Acción/Aventura",
    rating: 4.3,
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1ntt.jpg",
    description: "Una invasión simbionte amenaza Nueva York",
    longDescription: "Spider-Man debe elegir entre usar el traje simbionte para obtener más poder o resistir su influencia mientras lucha contra una invasión de simbiontes.",
    slug: "spider-man-web-of-shadows",
    seoTitle: "Spider-Man: Web of Shadows - Decisiones morales",
    seoDescription: "El juego donde tus decisiones determinan si Spider-Man sucumbe al poder del simbionte.",
    keywords: ["Web of Shadows", "Simbionte", "Decisiones morales", "2008"],
    gameplayFeatures: ["Sistema de moralidad", "Traje rojo vs negro", "Aliados dinámicos"],
    modes: ["Campaña con decisiones", "Mundo abierto"],
    ageRating: "T (Teen)",
    backdropImages: []
  }
];

// 📺 SERIES
const SERIES_DATA = [
  {
    title: "Spider-Man: The Animated Series",
    subtitle: "La serie que definió Spider-Man en los 90s",
    year: "1994",
    endYear: "1998",
    seasons: 5,
    episodes: 65,
    network: "Fox Kids",
    rating: 4.8,
    image: "https://image.tmdb.org/t/p/w500/wF3HAsVv7dOOZcl3FCAQuWQkyJJ.jpg",
    description: "La serie animada clásica de Spider-Man",
    longDescription: "La serie animada que adaptó faithfully muchas historias clásicas de los cómics, incluyendo la saga del simbionte, el clon saga, y crossovers con X-Men y Fantastic Four.",
    slug: "spider-man-animated-series-1994",
    seoTitle: "Spider-Man: The Animated Series (1994) - La serie clásica",
    seoDescription: "La serie animada de los 90s que introdujo Spider-Man a toda una generación.",
    keywords: ["Spider-Man", "Animada", "1994", "Fox Kids", "90s"],
    cast: ["Christopher Daniel Barnes", "Sara Ballantine", "Ed Asner"],
    creators: ["John Semper Jr."],
    genre: ["Animación", "Acción", "Aventura"],
    backdropImages: []
  },
  {
    title: "The Spectacular Spider-Man",
    subtitle: "La mejor serie animada de Spider-Man",
    year: "2008",
    endYear: "2009",
    seasons: 2,
    episodes: 26,
    network: "The CW",
    rating: 4.9,
    image: "https://image.tmdb.org/t/p/w500/x7V7jDnI6wj2gk0H6IHEWJNpZjZ.jpg",
    description: "La serie que perfeccionó la fórmula de Spider-Man",
    longDescription: "Considerada por muchos como la mejor adaptación animada de Spider-Man, con excelente escritura, desarrollo de personajes y diseño visual distintivo.",
    slug: "spectacular-spider-man",
    seoTitle: "The Spectacular Spider-Man - La serie perfecta",
    seoDescription: "La serie animada que capturó perfectamente la esencia de Spider-Man en solo 26 episodios.",
    keywords: ["Spectacular Spider-Man", "2008", "Greg Weisman", "Sony"],
    cast: ["Josh Keaton", "Lacey Chabert", "Joshua LeBar"],
    creators: ["Greg Weisman", "Victor Cook"],
    genre: ["Animación", "Acción", "Aventura", "Drama"],
    backdropImages: []
  },
  {
    title: "Ultimate Spider-Man",
    subtitle: "Spider-Man con los Ultimate Warriors",
    year: "2012",
    endYear: "2017",
    seasons: 4,
    episodes: 104,
    network: "Disney XD",
    rating: 4.1,
    image: "https://image.tmdb.org/t/p/w500/9L7K6oI9A2h1Lk7F1GQ3N4n7K4E.jpg",
    description: "Spider-Man entrena con un equipo de jóvenes héroes",
    longDescription: "Peter Parker es reclutado por S.H.I.E.L.D. para entrenar con otros jóvenes superhéroes, incluyendo White Tiger, Power Man, Iron Fist y Nova.",
    slug: "ultimate-spider-man-2012",
    seoTitle: "Ultimate Spider-Man (2012) - El equipo de héroes",
    seoDescription: "La serie donde Spider-Man lidera un equipo de jóvenes superhéroes en entrenamiento.",
    keywords: ["Ultimate Spider-Man", "Disney XD", "2012", "S.H.I.E.L.D."],
    cast: ["Drake Bell", "Chi McBride", "J.K. Simmons"],
    creators: ["Brian Michael Bendis", "Paul Dini"],
    genre: ["Animación", "Acción", "Comedia"],
    backdropImages: []
  },
  {
    title: "Spider-Man (2017)",
    subtitle: "Una nueva generación de Spider-Man",
    year: "2017",
    endYear: "2020",
    seasons: 3,
    episodes: 57,
    network: "Disney XD",
    rating: 4.0,
    image: "https://image.tmdb.org/t/p/w500/2lHYazXb9zTH1n6OQPKVaTmlwfT.jpg",
    description: "Peter Parker en su segundo año como Spider-Man",
    longDescription: "Una nueva serie que sigue a Peter Parker mientras equilibra ser Spider-Man con su vida como estudiante de secundaria, enfrentando nuevos villanos y aliados.",
    slug: "spider-man-2017",
    seoTitle: "Spider-Man (2017) - Nueva generación",
    seoDescription: "La serie más reciente de Spider-Man en Disney XD con un enfoque fresco.",
    keywords: ["Spider-Man", "2017", "Disney XD", "Nueva serie"],
    cast: ["Robbie Daymond", "Nancy Linari", "Melanie Minichino"],
    creators: ["Kevin Shinick"],
    genre: ["Animación", "Acción", "Aventura"],
    backdropImages: []
  },
  {
    title: "Spider-Man: Freshman Year",
    subtitle: "Los primeros días como Spider-Man",
    year: "2024",
    endYear: "TBD",
    seasons: 1,
    episodes: 10,
    network: "Disney+",
    rating: 4.5,
    image: "https://image.tmdb.org/t/p/w500/placeholder-freshman-year.jpg",
    description: "Los orígenes de Spider-Man en el MCU",
    longDescription: "Una serie animada que explora los primeros días de Peter Parker como Spider-Man antes de los eventos de Captain America: Civil War.",
    slug: "spider-man-freshman-year",
    seoTitle: "Spider-Man: Freshman Year - Los orígenes MCU",
    seoDescription: "La nueva serie animada que explora los orígenes de Spider-Man en el MCU.",
    keywords: ["Freshman Year", "MCU", "Disney+", "2024"],
    cast: ["Charlie Cox", "Vincent D'Onofrio", "TBD"],
    creators: ["Jeff Trammell"],
    genre: ["Animación", "Acción", "Aventura"],
    backdropImages: []
  }
];

// 📝 BLOG POSTS
const BLOG_POSTS_DATA = [
  {
    title: "La Historia Completa de Spider-Man: 60 Años de Aventuras",
    subtitle: "Un recorrido por la evolución del Trepamuros",
    excerpt: "Desde Amazing Fantasy #15 hasta las películas más recientes, exploramos seis décadas de Spider-Man",
    content: "Spider-Man ha sido uno de los personajes más queridos y duraderos del universo Marvel desde su debut en 1962...",
    publishDate: new Date('2024-01-15'),
    category: "Historia",
    author: "Peter Parker Daily",
    readTime: "15 min",
    image: "https://example.com/blog-spiderman-history.jpg",
    slug: "historia-completa-spider-man-60-anos",
    seoTitle: "La Historia Completa de Spider-Man: 60 Años de Evolución",
    seoDescription: "Descubre la fascinante evolución de Spider-Man a través de 60 años de cómics, películas y series.",
    keywords: ["Spider-Man", "Historia", "Marvel", "Stan Lee", "60 años"],
    tags: ["Historia", "Cómics", "Marvel"],
    isPublished: true
  },
  {
    title: "Top 10 Mejores Villanos de Spider-Man de Todos los Tiempos",
    subtitle: "Los enemigos más icónicos del Trepamuros",
    excerpt: "Ranking de los villanos más memorables que han enfrentado a Spider-Man",
    content: "El universo de Spider-Man está lleno de villanos inolvidables. Desde Green Goblin hasta Doctor Octopus...",
    publishDate: new Date('2024-02-01'),
    category: "Rankings",
    author: "Daily Bugle",
    readTime: "12 min",
    image: "https://example.com/blog-villains-ranking.jpg",
    slug: "top-10-mejores-villanos-spider-man",
    seoTitle: "Top 10 Mejores Villanos de Spider-Man - Ranking Definitivo",
    seoDescription: "Descubre cuáles son los 10 villanos más icónicos y peligrosos de Spider-Man de todos los tiempos.",
    keywords: ["Villanos", "Spider-Man", "Green Goblin", "Doctor Octopus", "Ranking"],
    tags: ["Villanos", "Rankings", "Análisis"],
    isPublished: true
  },
  {
    title: "Guía de Trajes de Spider-Man: Todos los Diseños Icónicos",
    subtitle: "Desde el clásico rojo y azul hasta los más modernos",
    excerpt: "Una guía completa de todos los trajes que ha usado Spider-Man a lo largo de los años",
    content: "El traje de Spider-Man ha evolucionado considerablemente desde su primera aparición...",
    publishDate: new Date('2024-02-15'),
    category: "Guías",
    author: "Costume Central",
    readTime: "18 min",
    image: "https://example.com/blog-spiderman-suits.jpg",
    slug: "guia-trajes-spider-man-todos-disenos",
    seoTitle: "Guía Completa de Trajes de Spider-Man - Todos los Diseños",
    seoDescription: "Explora todos los trajes icónicos de Spider-Man, desde el clásico hasta los más modernos diseños.",
    keywords: ["Trajes", "Spider-Man", "Diseños", "Clásico", "Moderno"],
    tags: ["Trajes", "Diseño", "Guías"],
    isPublished: true
  }
];

// 🛒 PRODUCTOS
const PRODUCTS_DATA = [
  {
    title: "Figura de Acción Spider-Man Marvel Legends",
    description: "Figura coleccionable de Spider-Man con articulación premium",
    price: "$24.99",
    originalPrice: "$29.99",
    discount: "17%",
    rating: 4.7,
    reviews: "1,250",
    image: "https://example.com/spiderman-figure.jpg",
    category: "Figuras",
    slug: "figura-spiderman-marvel-legends",
    seoTitle: "Figura Spider-Man Marvel Legends - Coleccionable Premium",
    seoDescription: "Figura de acción de Spider-Man con detalles increíbles y articulación completa.",
    keywords: ["Figura", "Spider-Man", "Marvel Legends", "Coleccionable"],
    features: ["Articulación premium", "Accesorios incluidos", "Detalles auténticos"],
    specifications: {
      "altura": "15 cm",
      "material": "PVC y ABS",
      "edad": "4+ años"
    },
    inStock: true,
    isFeatured: true
  },
  {
    title: "Camiseta Spider-Man Clásica",
    description: "Camiseta oficial con el logo clásico de Spider-Man",
    price: "$19.99",
    originalPrice: "$24.99",
    discount: "20%",
    rating: 4.5,
    reviews: "856",
    image: "https://example.com/spiderman-tshirt.jpg",
    category: "Ropa",
    slug: "camiseta-spider-man-clasica",
    seoTitle: "Camiseta Spider-Man Clásica - Ropa Oficial Marvel",
    seoDescription: "Camiseta oficial de Spider-Man con el icónico logo del trepamuros.",
    keywords: ["Camiseta", "Spider-Man", "Ropa", "Marvel"],
    features: ["100% Algodón", "Diseño oficial", "Colores vibrantes"],
    specifications: {
      "material": "100% Algodón",
      "tallas": "XS a XXL",
      "cuidado": "Lavar a máquina"
    },
    inStock: true,
    isFeatured: false
  },
  {
    title: "Mochila Spider-Man Web Pattern",
    description: "Mochila escolar con diseño de telaraña de Spider-Man",
    price: "$34.99",
    originalPrice: "$39.99",
    discount: "13%",
    rating: 4.6,
    reviews: "423",
    image: "https://example.com/spiderman-backpack.jpg",
    category: "Accesorios",
    slug: "mochila-spider-man-web-pattern",
    seoTitle: "Mochila Spider-Man Web Pattern - Accesorios Escolares",
    seoDescription: "Mochila escolar oficial de Spider-Man con diseño de telaraña y gran capacidad.",
    keywords: ["Mochila", "Spider-Man", "Escolar", "Telaraña"],
    features: ["Múltiples compartimentos", "Correas acolchadas", "Resistente al agua"],
    specifications: {
      "capacidad": "25 litros",
      "material": "Poliéster resistente",
      "dimensiones": "45x30x15 cm"
    },
    inStock: true,
    isFeatured: true
  }
];

// Función principal para poblar toda la base de datos
async function populateAllContent() {
  console.log('🚀 Poblando base de datos completa...\n');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.product.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.series.deleteMany();
    await prisma.game.deleteMany();
    await prisma.comic.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.character.deleteMany();
    console.log('✅ Datos existentes eliminados\n');

    // 1. Poblar personajes (usando script existente)
    console.log('🎭 Poblando personajes...');
    const { spawn } = require('child_process');
    
    // Ejecutar script de personajes existente
    await new Promise((resolve, reject) => {
      const child = spawn('node', ['scripts/populate-all-45-characters.js'], {
        stdio: 'inherit'
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Personajes poblados exitosamente');
          resolve();
        } else {
          reject(new Error(`Script de personajes falló con código ${code}`));
        }
      });
    });

    // 2. Poblar películas
    console.log('\n🎬 Poblando películas...');
    for (const movie of MOVIES_DATA) {
      await prisma.movie.create({
        data: {
          ...movie,
          views: Math.floor(Math.random() * 1000),
          isActive: true
        }
      });
      console.log(`  ✅ ${movie.title}`);
    }

    // 3. Poblar cómics
    console.log('\n📚 Poblando cómics...');
    for (const comic of COMICS_DATA) {
      await prisma.comic.create({
        data: {
          ...comic,
          views: Math.floor(Math.random() * 500),
          isActive: true
        }
      });
      console.log(`  ✅ ${comic.title}`);
    }

    // 4. Poblar videojuegos
    console.log('\n🎮 Poblando videojuegos...');
    for (const game of GAMES_DATA) {
      await prisma.game.create({
        data: {
          ...game,
          views: Math.floor(Math.random() * 800),
          isActive: true
        }
      });
      console.log(`  ✅ ${game.title}`);
    }

    // 5. Poblar series (estáticas + TMDB)
    console.log('\n📺 Poblando series...');
    
    // Poblar series estáticas primero
    for (const series of SERIES_DATA) {
      await prisma.series.create({
        data: {
          ...series,
          views: Math.floor(Math.random() * 600),
          isActive: true
        }
      });
      console.log(`  ✅ ${series.title}`);
    }
    
    // Poblar series adicionales desde TMDB
    console.log('\n🌐 Poblando series adicionales desde TMDB...');
    try {
      const { populateSeriesFromTMDB } = require('./populate-series-from-tmdb');
      await populateSeriesFromTMDB();
      console.log('  ✅ Series de TMDB populadas correctamente');
    } catch (error) {
      console.log(`  ⚠️  Error poblando series de TMDB: ${error.message}`);
      console.log('  📝 Continuando con el resto del proceso...');
    }

    // 6. Poblar blog posts
    console.log('\n📝 Poblando blog posts...');
    for (const post of BLOG_POSTS_DATA) {
      await prisma.blogPost.create({
        data: {
          ...post,
          views: Math.floor(Math.random() * 2000),
        }
      });
      console.log(`  ✅ ${post.title}`);
    }

    // 7. Poblar productos
    console.log('\n🛒 Poblando productos...');
    for (const product of PRODUCTS_DATA) {
      await prisma.product.create({
        data: {
          ...product,
          views: Math.floor(Math.random() * 300),
        }
      });
      console.log(`  ✅ ${product.title}`);
    }

    // Mostrar estadísticas finales
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    const stats = {
      characters: await prisma.character.count(),
      movies: await prisma.movie.count(),
      comics: await prisma.comic.count(),
      games: await prisma.game.count(),
      series: await prisma.series.count(),
      blogPosts: await prisma.blogPost.count(),
      products: await prisma.product.count()
    };

    Object.entries(stats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    console.log(`  📈 Total: ${total} elementos`);

    console.log('\n🎉 ¡Base de datos poblada completamente!');
    console.log('\n🖼️ Próximo paso: Ejecutar sistema de imágenes');
    console.log('   node scripts/master-image-manager.js');

  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  populateAllContent();
}

module.exports = { populateAllContent };