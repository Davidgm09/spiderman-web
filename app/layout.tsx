import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdSenseScript } from "@/components/ads/AdSenseScript"
import { CookieBanner } from "@/components/CookieBanner"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://spider-world.es'),
  title: "Spider-World - Todo sobre Spider-Man: Películas, Cómics, Juegos y Series",
  description:
    "Tu portal definitivo al Spider-Verse. Descubre películas, cómics, videojuegos, series y productos oficiales de Spider-Man. Análisis, noticias y las mejores ofertas.",
  keywords:
    "Spider-Man, Peter Parker, Miles Morales, películas Spider-Man, cómics Marvel, videojuegos Spider-Man, series animadas, Spider-Verse, multiverso",
  openGraph: {
    siteName: 'Spider-World',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@spiderworld_es',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://comicvine.gamespot.com" />
        <link rel="preconnect" href="https://media.rawg.io" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <AdSenseScript />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
