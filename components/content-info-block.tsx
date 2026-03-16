"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Star, Monitor, BookOpen, Tv, Eye } from "lucide-react"
import type { Content } from "@/types/content"

interface ContentInfoBlockProps {
  content: Content
}

/**
 * Bloque reutilizable que muestra los metadatos de cada tipo de contenido.
 */
export function ContentInfoBlock({ content }: ContentInfoBlockProps) {
  if (!content) {
    // Si el componente se monta sin datos, no renderizamos nada
    return null
  }
  /* ===== Helpers por tipo de contenido ===== */
  const renderMovieInfo = (movie: Extract<Content, { type: "movie" }>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Columna 1 */}
      <div className="space-y-4">
        {/* Año */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Año de estreno</span>
            <div className="text-white font-semibold">{movie.year}</div>
          </div>
        </div>
        {/* Duración */}
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Duración</span>
            <div className="text-white font-semibold">{movie.duration}</div>
          </div>
        </div>
        {/* Director */}
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Director</span>
            <div className="text-white font-semibold">{movie.director}</div>
          </div>
        </div>
      </div>

      {/* Columna 2 */}
      <div className="space-y-4">
        {/* Rating */}
        <div className="flex items-center space-x-3">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <span className="text-gray-400 text-sm">Calificación</span>
            <div className="text-white font-semibold">{movie.rating}/10</div>
          </div>
        </div>
        {/* Plataforma */}
        <div className="flex items-center space-x-3">
          <Tv className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Disponible en</span>
            <div className="text-white font-semibold">{movie.platform}</div>
          </div>
        </div>
        {/* Box-Office */}
        {movie.boxOffice && (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 text-green-500">💰</div>
            <div>
              <span className="text-gray-400 text-sm">Recaudación</span>
              <div className="text-white font-semibold">{movie.boxOffice}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderGameInfo = (game: Extract<Content, { type: "game" }>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Monitor className="w-5 h-5 text-purple-500" />
          <div>
            <span className="text-gray-400 text-sm">Plataformas</span>
            <div className="text-white font-semibold">{game.platform.join(", ")}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-purple-500" />
          <div>
            <span className="text-gray-400 text-sm">Año de lanzamiento</span>
            <div className="text-white font-semibold">{game.year}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-purple-500" />
          <div>
            <span className="text-gray-400 text-sm">Desarrollador</span>
            <div className="text-white font-semibold">{game.developer}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <span className="text-gray-400 text-sm">Calificación</span>
            <div className="text-white font-semibold">{game.rating}/10</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-green-500">💰</div>
          <div>
            <span className="text-gray-400 text-sm">Precio</span>
            <div className="text-white font-semibold">{game.price}</div>
          </div>
        </div>
        <div>
          <Badge className="bg-purple-600">{game.genre}</Badge>
        </div>
      </div>
    </div>
  )

  const renderComicInfo = (comic: Extract<Content, { type: "comic" }>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Número</span>
            <div className="text-white font-semibold">{comic.issue}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Año de publicación</span>
            <div className="text-white font-semibold">{comic.year}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Guionista</span>
            <div className="text-white font-semibold">{comic.writer}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Dibujante</span>
            <div className="text-white font-semibold">{comic.artist}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <div>
            <span className="text-gray-400 text-sm">Editorial</span>
            <div className="text-white font-semibold">{comic.publisher}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-green-500">💰</div>
          <div>
            <span className="text-gray-400 text-sm">Precio</span>
            <div className="text-white font-semibold">{comic.price}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSeriesInfo = (series: Extract<Content, { type: "series" }>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Tv className="w-5 h-5 text-green-500" />
          <div>
            <span className="text-gray-400 text-sm">Temporadas</span>
            <div className="text-white font-semibold">{series.seasons}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-green-500" />
          <div>
            <span className="text-gray-400 text-sm">Años</span>
            <div className="text-white font-semibold">
              {series.startYear}
              {series.endYear ? `-${series.endYear}` : "-Presente"}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-green-500" />
          <div>
            <span className="text-gray-400 text-sm">Episodios</span>
            <div className="text-white font-semibold">{series.episodes}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Monitor className="w-5 h-5 text-green-500" />
          <div>
            <span className="text-gray-400 text-sm">Plataformas</span>
            <div className="text-white font-semibold">{series.platforms.join(", ")}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-green-500" />
          <div>
            <span className="text-gray-400 text-sm">Público objetivo</span>
            <div className="text-white font-semibold">{series.target}</div>
          </div>
        </div>
        <div>
          <Badge className={series.status === "En emisión" ? "bg-green-600" : "bg-gray-600"}>{series.status}</Badge>
        </div>
      </div>
    </div>
  )

  const renderBlogInfo = (blog: Extract<Content, { type: "blog" }>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Autor</span>
            <div className="text-white font-semibold">{blog.author}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Fecha de publicación</span>
            <div className="text-white font-semibold">{blog.publishDate}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Categoría</span>
            <div className="text-white font-semibold">{blog.category}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Tiempo de lectura</span>
            <div className="text-white font-semibold">{blog.readTime}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-red-500" />
          <div>
            <span className="text-gray-400 text-sm">Visualizaciones</span>
            <div className="text-white font-semibold">{blog.views}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  /* ===== Render principal ===== */
  return (
    <div className="bg-gray-900/50 border border-red-600/20 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Información Detallada</h2>
      {content.type === "movie" && renderMovieInfo(content)}
      {content.type === "game" && renderGameInfo(content)}
      {content.type === "comic" && renderComicInfo(content)}
      {content.type === "series" && renderSeriesInfo(content)}
      {content.type === "blog" && renderBlogInfo(content)}
    </div>
  )
}

export default ContentInfoBlock
