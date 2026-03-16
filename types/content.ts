export type ContentType = "movie" | "game" | "comic" | "series" | "blog" | "product"

export interface BaseContent {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  image: string
  type: ContentType
  seoTitle: string
  seoDescription: string
  keywords: string[]
}

export interface CastMember {
  name: string
  character: string
  image: string
}

export interface SceneGalleryItem {
  image: string
  alt: string
  caption: string
}

export interface RelatedProduct {
  name: string
  price: string
  originalPrice?: string
  image: string
  rating: number
  reviews: number
  discount?: string
}

export interface VoiceCastMember {
  name: string
  character: string
  image: string
}

export interface KeyEpisode {
  image: string
  alt: string
  caption: string
  episode: string
}

export interface DevelopmentTeamMember {
  name: string
  role: string
  image: string
}

export interface KeyFeature {
  image: string
  alt: string
  caption: string
}

export interface MovieContent extends BaseContent {
  type: "movie"
  year: number
  duration: string
  director: string
  actors: string[]
  platform: string
  rating: number
  boxOffice?: string
  genre: string
  trailer?: string
  cast?: CastMember[]
  sceneGallery?: SceneGalleryItem[]
  relatedProducts?: RelatedProduct[]
}

export interface GameContent extends BaseContent {
  type: "game"
  year: number
  platform: string[]
  developer: string
  publisher?: string
  rating: number
  price: string
  genre: string
  playtime?: string
  gameplay?: string
  voiceCast?: VoiceCastMember[]
  developmentTeam?: DevelopmentTeamMember[]
  keyFeatures?: KeyFeature[]
  relatedProducts?: RelatedProduct[]
}

export interface ComicContent extends BaseContent {
  type: "comic"
  year: number
  writer: string
  artist: string
  publisher: string
  price: string
  pages?: number
  rating?: number
  importance: string
  characters?: string[]
  variants?: string[]
  arc?: string
  issue?: string
}

export interface SeriesContent extends BaseContent {
  type: "series"
  startYear: number
  endYear?: number
  seasons: number
  episodes: number
  platforms: string[]
  status: string
  target: string
  rating: number
  creator: string
  voiceCast?: VoiceCastMember[]
  keyEpisodes?: KeyEpisode[]
  relatedProducts?: RelatedProduct[]
}

export interface BlogContent extends BaseContent {
  type: "blog"
  author: string
  publishDate: string
  category: string
  readTime: string
  views: string
  tags: string[]
}

export interface ProductVariant {
  name: string
  price: string
  originalPrice?: string
  image: string
  inStock: boolean
  sku?: string
}

export interface ProductFeature {
  name: string
  description: string
}

export interface ProductContent extends BaseContent {
  type: "product"
  category: string
  subcategory?: string
  brand?: string
  price: string
  originalPrice?: string
  discount?: string
  rating: number
  reviews: number
  inStock: boolean
  features: ProductFeature[]
  variants?: ProductVariant[]
  amazonUrl?: string
  sku?: string
  tags: string[]
  specifications?: Record<string, string>
  relatedProducts?: RelatedProduct[]
}

export type Content = MovieContent | GameContent | ComicContent | SeriesContent | BlogContent | ProductContent
