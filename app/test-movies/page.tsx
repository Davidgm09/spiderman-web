import Image from "next/image"
import { movieService } from "@/lib/database"

export default async function TestMoviesPage() {
  // Test direct database call
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const moviesFromPrisma = await prisma.movie.findMany({
    where: { isActive: true },
    orderBy: [{ year: 'desc' }, { rating: 'desc' }]
  });
  
  const moviesFromService = await movieService.getAll();
  
  console.log('🎬 Direct Prisma call:', moviesFromPrisma.map(m => ({ title: m.title, image: m.image })));
  console.log('🎬 Service call:', moviesFromService.map(m => ({ title: m.title, image: m.image })));
  
  const movies = moviesFromPrisma;
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">TEST: Movies with Real Images</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">{movie.title} ({movie.year})</h2>
            
            {/* URL Debug Info */}
            <div className="mb-4 p-2 bg-gray-700 rounded text-xs break-all">
              <strong>Image URL:</strong><br />
              {movie.image}
            </div>
            
            {/* Try with Next.js Image */}
            <div className="mb-4">
              <p className="text-sm mb-2">Next.js Image Component:</p>
              <Image
                src={movie.image}
                alt={movie.title}
                width={300}
                height={450}
                className="w-full h-64 object-cover rounded"
                unoptimized={true}
              />
            </div>
            
            {/* Try with regular img tag */}
            <div className="mb-4">
              <p className="text-sm mb-2">Regular img tag:</p>
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
            </div>
            
            {/* Direct link */}
            <div>
              <a 
                href={movie.image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Open image directly →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}