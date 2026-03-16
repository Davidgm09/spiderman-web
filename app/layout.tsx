import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdSenseScript } from "@/components/ads/AdSenseScript"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spider-World - Todo sobre Spider-Man: Películas, Cómics, Juegos y Series",
  description:
    "Tu portal definitivo al Spider-Verse. Descubre películas, cómics, videojuegos, series y productos oficiales de Spider-Man. Análisis, noticias y las mejores ofertas.",
  keywords:
    "Spider-Man, Peter Parker, Miles Morales, películas Spider-Man, cómics Marvel, videojuegos Spider-Man, series animadas, Spider-Verse, multiverso",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        <AdSenseScript />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
