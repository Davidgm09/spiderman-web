export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 flex flex-col items-center justify-center gap-6">
      {/* Spider-Man web spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-transparent animate-spin [animation-duration:1.5s]" />
        <span className="absolute inset-0 flex items-center justify-center text-xl select-none">🕷️</span>
      </div>
      <p className="text-gray-500 text-sm tracking-widest uppercase">Spider-World</p>
    </div>
  )
}

export function GridLoading({ cols = 5 }: { cols?: number }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950">
      {/* Hero skeleton */}
      <div className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/50 animate-pulse" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="h-3 w-32 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="h-14 w-80 bg-white/10 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-white/5 rounded-full mx-auto animate-pulse" />
          <div className="flex justify-center gap-3 pt-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${cols} gap-4`}>
          {Array.from({ length: cols * 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
