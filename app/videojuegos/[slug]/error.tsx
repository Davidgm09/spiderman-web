'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🕷️</div>
        <h1 className="text-3xl font-bold text-white mb-3">Algo salió mal</h1>
        <p className="text-gray-400 mb-8">
          No pudimos cargar este videojuego. Puede ser un problema temporal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
            Reintentar
          </Button>
          <Button asChild variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/videojuegos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Videojuegos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
