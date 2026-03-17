/**
 * TypeScript types for Json? fields defined in prisma/schema.prisma.
 * Cast Prisma's JsonValue to these types before rendering.
 */

export interface GalleryImage {
  url: string
  title: string
  description: string
}

export interface ConceptArtItem {
  url: string
  title: string
  description: string
  artist?: string
}

export interface CastMember {
  name: string
  character: string
  image?: string
  photo?: string
  bio?: string
}

export interface CharacterImage {
  name: string
  image?: string
  role?: string
  description?: string
}

export interface EpisodeImage {
  url: string
  title: string
  description: string
  episode?: string
  season?: number
}

export interface BehindScene {
  url: string
  title: string
  description: string
  season?: number
}

export interface CoverVariant {
  url: string
  title: string
  description: string
  artist?: string
}

export interface ArtistPhoto {
  name: string
  photo?: string
  bio?: string
  role?: string
}

export interface PagePreview {
  url: string
  pageNumber: number
  description: string
}
