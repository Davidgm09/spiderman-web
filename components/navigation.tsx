"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchRef.current?.value.trim()
    if (q && q.length >= 2) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`)
      setSearchOpen(false)
    }
  }

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/peliculas", label: "Películas" },
    { href: "/comics", label: "Cómics" },
    { href: "/series", label: "Series" },
    { href: "/videojuegos", label: "Videojuegos" },
    { href: "/personajes", label: "Personajes" },
    { href: "/blog", label: "Blog" },
    { href: "/tienda", label: "Tienda" },
  ]

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-red-600/20 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center relative">
              <span className="text-white font-bold text-lg">S</span>
              <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Spider-World
              </span>
              <div className="text-xs text-gray-400">Tu guía del Spider-Verse</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-red-500 transition-colors font-medium ${
                  pathname === item.href ? "text-red-500" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search button (desktop) */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50) }}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50) }}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-red-600/20 py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Busca películas, personajes, cómics..."
                className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 outline-none text-sm transition-colors"
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-red-600/20">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block hover:text-red-500 transition-colors font-medium ${
                    pathname === item.href ? "text-red-500" : "text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
