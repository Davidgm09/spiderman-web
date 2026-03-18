import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-red-600/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Spider-World
              </span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Tu portal definitivo al Spider-Verse. Análisis, noticias, productos y todo sobre Peter Parker, Miles
              Morales y el multiverso arácnido.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contenido</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/peliculas" className="text-gray-400 hover:text-red-500 transition-colors">
                  Películas de Spider-Man
                </Link>
              </li>
              <li>
                <Link href="/comics" className="text-gray-400 hover:text-red-500 transition-colors">
                  Cómics Clásicos
                </Link>
              </li>
              <li>
                <Link href="/videojuegos" className="text-gray-400 hover:text-red-500 transition-colors">
                  Videojuegos
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-gray-400 hover:text-red-500 transition-colors">
                  Series Animadas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-red-500 transition-colors">
                  Blog y Análisis
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Topics */}
          <div>
            <h4 className="text-white font-semibold mb-4">Temas Populares</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  Spider-Man No Way Home
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  Miles Morales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  Venom Simbionte
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  Spider-Verse Multiverso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  Gwen Stacy Spider-Woman
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-red-500 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-red-500 transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-red-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Footer Text */}
        <div className="border-t border-red-600/20 pt-8 mb-8">
          <div className="text-gray-400 text-sm leading-relaxed">
            <p className="mb-4">
              <strong className="text-white">Spider-World</strong> es el sitio web definitivo para fans de Spider-Man,
              Peter Parker, Miles Morales y todo el Spider-Verse. Encuentra las mejores películas de Spider-Man, desde
              la trilogía de Tobey Maguire hasta Tom Holland en el MCU. Descubre cómics clásicos como Amazing
              Spider-Man, Ultimate Spider-Man y las mejores sagas del trepamuros.
            </p>
            <p>
              Explora videojuegos épicos como Marvel's Spider-Man 2 para PS5, análisis de series animadas, y productos
              oficiales con los mejores precios de Amazon. Tu fuente confiable para noticias, análisis y contenido
              exclusivo sobre el universo arácnido más querido del mundo.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-red-600/20 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Spider-World. Todos los derechos reservados. Spider-Man y todos los personajes relacionados son
            marcas registradas de Marvel Entertainment. Este sitio contiene enlaces de afiliado de Amazon.
          </p>
        </div>
      </div>
    </footer>
  )
}
