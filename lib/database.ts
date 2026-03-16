import { PrismaClient } from '@prisma/client'

// Singleton para Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// === SERVICIOS DE CONTENIDO === //

// Funciones para Characters
export const characterService = {
  // Obtener todos los personajes
  async getAll() {
    return await prisma.character.findMany({
      where: { isActive: true },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ]
    });
  },

  // Obtener personaje por slug
  async getBySlug(slug: string) {
    return await prisma.character.findUnique({
      where: { slug }
    });
  },

  // Obtener personaje por Marvel ID
  async getByMarvelId(marvelId: number) {
    return await prisma.character.findUnique({
      where: { marvelId }
    });
  },

  // Obtener personajes por categoría
  async getByCategory(category: string, limit?: number) {
    return await prisma.character.findMany({
      where: { 
        isActive: true,
        category: category
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      ...(limit && { take: limit })
    });
  },

  // Obtener personajes destacados
  async getFeatured(limit: number = 6) {
    return await prisma.character.findMany({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Obtener personajes del Spider-Verse
  async getSpiderVerse(limit: number = 12) {
    return await prisma.character.findMany({
      where: { 
        isActive: true,
        category: 'spider-verse'
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Obtener villanos de Spider-Man
  async getSpiderVillains(limit: number = 12) {
    return await prisma.character.findMany({
      where: { 
        isActive: true,
        category: 'spider-villains'
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Obtener personajes del Universo Marvel
  async getMarvelUniverse(limit: number = 12) {
    return await prisma.character.findMany({
      where: { 
        isActive: true,
        category: 'marvel-universe'
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Buscar personajes por nombre
  async search(query: string, limit: number = 10) {
    return await prisma.character.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { realName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Crear o actualizar personaje desde Marvel API
  async upsertFromMarvelAPI(marvelCharacter: any, category: string) {
    const slug = marvelCharacter.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const data = {
      marvelId: marvelCharacter.id,
      name: marvelCharacter.name,
      description: marvelCharacter.description || `Conoce todo sobre ${marvelCharacter.name}, uno de los personajes más fascinantes del universo Marvel.`,
      image: marvelCharacter.thumbnail ? 
        `${marvelCharacter.thumbnail.path}/detail.${marvelCharacter.thumbnail.extension}`.replace('http://', 'https://') :
        '/images/marvel-placeholder.svg',
      thumbnailPath: marvelCharacter.thumbnail?.path,
      thumbnailExtension: marvelCharacter.thumbnail?.extension,
      comicsCount: marvelCharacter.comics?.available || 0,
      seriesCount: marvelCharacter.series?.available || 0,
      category,
      slug,
      seoTitle: `${marvelCharacter.name} - Personaje Marvel | Spider-World`,
      seoDescription: marvelCharacter.description ? 
        marvelCharacter.description.substring(0, 155) + '...' :
        `Descubre todo sobre ${marvelCharacter.name}, sus poderes, historia y apariciones en cómics y películas Marvel.`,
      keywords: [marvelCharacter.name, 'Marvel', 'Spider-Man', category, 'cómics', 'superhéroe'],
      urls: marvelCharacter.urls || null,
      rating: Math.random() * 2 + 3, // Rating entre 3 y 5
      isFeatured: ['Spider-Man', 'Spider-Gwen', 'Miles Morales', 'Spider-Woman', 'Spider-Man 2099'].includes(marvelCharacter.name)
    };

    return await prisma.character.upsert({
      where: { marvelId: marvelCharacter.id },
      update: data,
      create: data
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.character.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  },

  // Obtener estadísticas
  async getStats() {
    const stats = await prisma.character.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { id: true },
      _avg: { rating: true }
    });

    return stats.reduce((acc, stat) => {
      acc[stat.category] = {
        count: stat._count.id,
        avgRating: stat._avg.rating
      };
      return acc;
    }, {} as Record<string, { count: number; avgRating: number | null }>);
  }
};

// Funciones para Movies
export const movieService = {
  // Obtener todas las películas
  async getAll() {
    return await prisma.movie.findMany({
      where: { isActive: true },
      orderBy: [
        { year: 'desc' },
        { rating: 'desc' }
      ]
    });
  },

  // Obtener película por slug
  async getBySlug(slug: string) {
    return await prisma.movie.findUnique({
      where: { slug }
    });
  },

  // Obtener películas destacadas
  async getFeatured(limit: number = 4) {
    return await prisma.movie.findMany({
      where: { isActive: true },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.movie.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  }
};

// Funciones para Games
export const gameService = {
  // Obtener todos los videojuegos
  async getAll() {
    return await prisma.game.findMany({
      where: { isActive: true },
      orderBy: [{ year: 'desc' }, { rating: 'desc' }],
    });
  },

  // Obtener videojuego por slug
  async getBySlug(slug: string) {
    return await prisma.game.findUnique({
      where: { slug },
    });
  },

  // Obtener videojuegos destacados
  async getFeatured(limit: number = 4) {
    return await prisma.game.findMany({
      where: { isActive: true },
      orderBy: [{ rating: 'desc' }, { views: 'desc' }],
      take: limit,
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.game.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  },
};

// Funciones para Comics
export const comicService = {
  // Obtener todos los cómics
  async getAll() {
    return await prisma.comic.findMany({
      where: { isActive: true },
      orderBy: [{ year: 'desc' }, { rating: 'desc' }],
    });
  },

  // Obtener cómic por slug
  async getBySlug(slug: string) {
    return await prisma.comic.findUnique({
      where: { slug },
    });
  },

  // Obtener cómics destacados
  async getFeatured(limit: number = 4) {
    return await prisma.comic.findMany({
      where: { isActive: true },
      orderBy: [{ rating: 'desc' }, { views: 'desc' }],
      take: limit,
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.comic.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  },
};

// Funciones para Series
export const seriesService = {
  // Obtener todas las series
  async getAll() {
    return await prisma.series.findMany({
      where: { isActive: true },
      orderBy: [
        { year: 'desc' },
        { rating: 'desc' }
      ]
    });
  },

  // Obtener serie por slug
  async getBySlug(slug: string) {
    return await prisma.series.findUnique({
      where: { slug }
    });
  },

  // Obtener series destacadas
  async getFeatured(limit: number = 4) {
    return await prisma.series.findMany({
      where: { isActive: true },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: limit
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.series.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  }
};

// Funciones para Blog Posts
export const blogService = {
  // Obtener todos los posts
  async getAll() {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' }
    });
  },

  // Obtener post por slug
  async getBySlug(slug: string) {
    return await prisma.blogPost.findUnique({
      where: { slug }
    });
  },

  // Obtener posts recientes
  async getRecent(limit: number = 5) {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      take: limit
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  }
};

// Funciones para Products
export const productService = {
  // Obtener todos los productos
  async getAll() {
    return await prisma.product.findMany({
      where: { inStock: true },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' }
      ]
    });
  },

  // Obtener producto por slug
  async getBySlug(slug: string) {
    return await prisma.product.findUnique({
      where: { slug }
    });
  },

  // Obtener productos destacados
  async getFeatured(limit: number = 4) {
    return await prisma.product.findMany({
      where: { 
        inStock: true,
        isFeatured: true 
      },
      orderBy: { rating: 'desc' },
      take: limit
    });
  },

  // Incrementar vistas
  async incrementViews(slug: string) {
    return await prisma.product.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  }
};

// === UTILITY FUNCTIONS === //

// Utility functions para cache inteligente
export class CacheManager {
  // Cache Marvel API data
  static async cacheMarvelData(
    id: string,
    type: 'character' | 'comic' | 'series' | 'event',
    data: any,
    hoursToExpire: number = 24
  ) {
    const expiresAt = new Date(Date.now() + hoursToExpire * 60 * 60 * 1000)
    
    return await prisma.marvelCache.upsert({
      where: { id },
      update: { 
        data, 
        expiresAt,
        views: { increment: 1 }
      },
      create: {
        id,
        type,
        data,
        expiresAt,
        views: 1
      }
    })
  }

  // Get Marvel cached data
  static async getMarvelCache(id: string) {
    const cached = await prisma.marvelCache.findUnique({
      where: { id }
    })

    if (!cached || cached.expiresAt < new Date()) {
      // Cache expired or doesn't exist
      if (cached) {
        await prisma.marvelCache.delete({ where: { id } })
      }
      return null
    }

    // Increment view count
    await prisma.marvelCache.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return cached.data
  }

  // Cache external API data (TMDB, IGDB, etc.)
  static async cacheExternalData(
    apiSource: string,
    type: string,
    externalId: string,
    data: any,
    hoursToExpire: number = 24
  ) {
    const id = `${apiSource}-${type}-${externalId}`
    const expiresAt = new Date(Date.now() + hoursToExpire * 60 * 60 * 1000)
    
    return await prisma.externalApiCache.upsert({
      where: { id },
      update: { 
        data, 
        expiresAt,
        views: { increment: 1 }
      },
      create: {
        id,
        apiSource,
        type,
        externalId,
        data,
        expiresAt,
        views: 1
      }
    })
  }

  // Get external cached data
  static async getExternalCache(apiSource: string, type: string, externalId: string) {
    const id = `${apiSource}-${type}-${externalId}`
    
    const cached = await prisma.externalApiCache.findUnique({
      where: { id }
    })

    if (!cached || cached.expiresAt < new Date()) {
      if (cached) {
        await prisma.externalApiCache.delete({ where: { id } })
      }
      return null
    }

    // Increment view count
    await prisma.externalApiCache.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return cached.data
  }

  // Clean expired cache entries
  static async cleanExpiredCache() {
    const now = new Date()
    
    await Promise.all([
      prisma.marvelCache.deleteMany({
        where: { expiresAt: { lt: now } }
      }),
      prisma.externalApiCache.deleteMany({
        where: { expiresAt: { lt: now } }
      })
    ])
  }
}

// Analytics functions para monetización
export class AnalyticsManager {
  // Track page view
  static async trackPageView(
    pageUrl: string,
    contentType: string,
    contentId?: string,
    title?: string
  ) {
    return await prisma.contentAnalytics.upsert({
      where: { pageUrl },
      update: {
        views: { increment: 1 },
        lastViewAt: new Date(),
        title,
        contentType,
        contentId
      },
      create: {
        pageUrl,
        title,
        contentType,
        contentId,
        views: 1,
        uniqueViews: 1,
        lastViewAt: new Date()
      }
    })
  }

  // Track ad click
  static async trackAdClick(pageUrl: string) {
    return await prisma.contentAnalytics.update({
      where: { pageUrl },
      data: { adClicks: { increment: 1 } }
    })
  }

  // Track affiliate click
  static async trackAffiliateClick(pageUrl: string, revenue: number = 0) {
    return await prisma.contentAnalytics.update({
      where: { pageUrl },
      data: { 
        affiliateClicks: { increment: 1 },
        affiliateRevenue: { increment: revenue }
      }
    })
  }

  // Get analytics for optimization
  static async getTopPerformingContent(limit: number = 10) {
    return await prisma.contentAnalytics.findMany({
      orderBy: [
        { views: 'desc' },
        { affiliateClicks: 'desc' }
      ],
      take: limit
    })
  }

  // Get revenue analytics
  static async getRevenueAnalytics(days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    return await prisma.contentAnalytics.aggregate({
      where: { lastViewAt: { gte: since } },
      _sum: {
        views: true,
        adClicks: true,
        affiliateClicks: true,
        affiliateRevenue: true
      }
    })
  }
}

// Favorites system para engagement
export class FavoritesManager {
  // Add to favorites
  static async addFavorite(
    userId: string,
    contentType: string,
    contentId: string,
    title: string,
    imageUrl?: string
  ) {
    return await prisma.userFavorite.create({
      data: {
        userId,
        contentType,
        contentId,
        title,
        imageUrl
      }
    })
  }

  // Remove from favorites
  static async removeFavorite(userId: string, contentType: string, contentId: string) {
    return await prisma.userFavorite.delete({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType,
          contentId
        }
      }
    })
  }

  // Get user favorites
  static async getUserFavorites(userId: string, contentType?: string) {
    return await prisma.userFavorite.findMany({
      where: {
        userId,
        ...(contentType && { contentType })
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Check if favorited
  static async isFavorited(userId: string, contentType: string, contentId: string) {
    const favorite = await prisma.userFavorite.findUnique({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType,
          contentId
        }
      }
    })
    return !!favorite
  }
}

// Search tracking para content optimization
export class SearchManager {
  // Track search query
  static async trackSearch(query: string, results: number, userId?: string) {
    return await prisma.searchQuery.create({
      data: {
        query: query.toLowerCase().trim(),
        results,
        userId
      }
    })
  }

  // Get popular searches
  static async getPopularSearches(days: number = 30, limit: number = 10) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    return await prisma.searchQuery.groupBy({
      by: ['query'],
      where: { createdAt: { gte: since } },
      _count: { query: true },
      _sum: { results: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit
    })
  }
}

// Error logging for API debugging
export class ErrorLogger {
  static async logApiError(
    apiSource: string,
    endpoint: string,
    errorCode?: string,
    errorMessage?: string,
    requestData?: any
  ) {
    return await prisma.apiErrorLog.create({
      data: {
        apiSource,
        endpoint,
        errorCode,
        errorMessage: errorMessage || 'Unknown error',
        requestData
      }
    })
  }

  // Get recent errors for debugging
  static async getRecentErrors(apiSource?: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    return await prisma.apiErrorLog.findMany({
      where: {
        ...(apiSource && { apiSource }),
        createdAt: { gte: since }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
  }
}

export default prisma