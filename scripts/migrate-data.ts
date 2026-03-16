import { PrismaClient } from '@prisma/client'
import { getAllMovies } from '../data/movies'
import { getAllComics } from '../data/comics'
import { getAllGames } from '../data/games'
import { getAllSeries } from '../data/series'
import { getRecentBlogPosts } from '../data/blog'
import { getFeaturedProducts } from '../data/products'

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('🚀 Iniciando migración de datos a la base de datos...')
    
    // Limpiar datos existentes
    console.log('🗑️ Limpiando datos existentes...')
    await prisma.movie.deleteMany()
    await prisma.comic.deleteMany()
    await prisma.game.deleteMany()
    await prisma.series.deleteMany()
    await prisma.blogPost.deleteMany()
    await prisma.product.deleteMany()

    // Migrar Movies
    console.log('🎬 Migrando películas...')
    const movies = getAllMovies()
    for (const movie of movies) {
      await prisma.movie.create({
        data: {
          title: movie.title,
          subtitle: movie.subtitle || '',
          year: movie.year,
          duration: movie.duration || '',
          director: movie.director || '',
          platform: movie.platform || '',
          rating: movie.rating,
          image: movie.image,
          description: movie.description,
          longDescription: movie.longDescription,
          slug: movie.slug,
          seoTitle: movie.seoTitle,
          seoDescription: movie.seoDescription,
          keywords: movie.keywords || [],
          actors: movie.actors || [],
          genre: movie.genre ? movie.genre.split(', ') : [],
          boxOffice: movie.boxOffice || '',
          isActive: true
        }
      })
    }
    console.log(`✅ ${movies.length} películas migradas`)

    // Migrar Comics
    console.log('📚 Migrando cómics...')
    const comics = getAllComics()
    for (const comic of comics) {
      await prisma.comic.create({
        data: {
          title: comic.title,
          subtitle: comic.subtitle || '',
          year: comic.year.toString(),
          writer: comic.writer,
          artist: comic.artist,
          publisher: comic.publisher || '',
          pages: comic.pages || 0,
          price: comic.price,
          rating: comic.rating,
          importance: comic.importance,
          image: comic.image,
          description: comic.description,
          longDescription: comic.longDescription,
          slug: comic.slug,
          seoTitle: comic.seoTitle,
          seoDescription: comic.seoDescription,
          keywords: comic.keywords || [],
          characters: comic.characters || [],
          isActive: true
        }
      })
    }
    console.log(`✅ ${comics.length} cómics migrados`)

    // Migrar Games
    console.log('🎮 Migrando videojuegos...')
    const games = getAllGames()
    for (const game of games) {
      await prisma.game.create({
        data: {
          title: game.title,
          subtitle: game.subtitle || '',
          year: game.year,
          platform: Array.isArray(game.platform) ? game.platform : [game.platform],
          developer: game.developer,
          publisher: game.publisher || '',
          genre: game.genre,
          rating: game.rating,
          image: game.image,
          description: game.description,
          longDescription: game.longDescription,
          slug: game.slug,
          seoTitle: game.seoTitle,
          seoDescription: game.seoDescription,
          keywords: game.keywords || [],
          isActive: true
        }
      })
    }
    console.log(`✅ ${games.length} videojuegos migrados`)

    // Migrar Series
    console.log('📺 Migrando series...')
    const series = getAllSeries()
    for (const serie of series) {
      await prisma.series.create({
        data: {
          title: serie.title,
          subtitle: serie.subtitle || '',
          year: serie.startYear?.toString() || '2024',
          endYear: serie.endYear?.toString() || null,
          seasons: serie.seasons || 0,
          episodes: serie.episodes || 0,
          rating: serie.rating,
          image: serie.image,
          description: serie.description,
          longDescription: serie.longDescription,
          slug: serie.slug,
          seoTitle: serie.seoTitle,
          seoDescription: serie.seoDescription,
          keywords: serie.keywords || [],
          isActive: true
        }
      })
    }
    console.log(`✅ ${series.length} series migradas`)

    // Migrar Blog Posts
    console.log('📝 Migrando posts de blog...')
    const blogPosts = getRecentBlogPosts(20)
    for (const post of blogPosts) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          subtitle: post.subtitle || '',
          excerpt: post.description,
          content: post.longDescription,
          publishDate: new Date(post.publishDate),
          category: post.category,
          author: post.author,
          readTime: post.readTime,
          image: post.image || '',
          slug: post.slug,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          keywords: post.keywords || [],
          tags: post.tags || [],
          isPublished: true
        }
      })
    }
    console.log(`✅ ${blogPosts.length} posts de blog migrados`)

    // Migrar Products
    console.log('🛒 Migrando productos...')
    const products = getFeaturedProducts()
    for (const product of products) {
      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || '',
          discount: product.discount || '',
          rating: product.rating,
          reviews: product.reviews.toString(),
          image: product.image,
          category: product.category,
          slug: product.slug,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          keywords: product.keywords || [],
          features: Array.isArray(product.features) 
            ? product.features.map((f: any) => typeof f === 'string' ? f : f.name || f.description || JSON.stringify(f))
            : [],
          specifications: product.specifications || {},
          inStock: product.inStock !== false
        }
      })
    }
    console.log(`✅ ${products.length} productos migrados`)

    // Resumen final
    console.log('\n🎉 ¡Migración completada exitosamente!')
    console.log(`📊 Resumen:`)
    console.log(`   🎬 Películas: ${movies.length}`)
    console.log(`   📚 Cómics: ${comics.length}`)
    console.log(`   🎮 Videojuegos: ${games.length}`)
    console.log(`   📺 Series: ${series.length}`)
    console.log(`   📝 Blog Posts: ${blogPosts.length}`)
    console.log(`   🛒 Productos: ${products.length}`)
    console.log(`   🎯 Total: ${movies.length + comics.length + games.length + series.length + blogPosts.length + products.length} elementos`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateData()
  .then(() => {
    console.log('✅ Script de migración completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en migración:', error)
    process.exit(1)
  })