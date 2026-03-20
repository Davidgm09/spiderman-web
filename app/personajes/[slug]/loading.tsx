export default function Loading() {
  return (
    <div className="pt-16 animate-pulse">
      <div className="relative min-h-[60vh] bg-gray-900 flex items-end pb-16">
        <div className="container mx-auto px-4 max-w-6xl flex gap-8 items-end">
          <div className="w-48 h-64 bg-gray-700 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-700 rounded mb-4" />
            <div className="h-12 w-2/3 bg-gray-700 rounded mb-3" />
            <div className="h-5 w-1/3 bg-gray-800 rounded mb-6" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="h-7 w-20 bg-gray-700 rounded-full" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-48 bg-gray-800 rounded-lg" />
            <div className="h-64 bg-gray-800 rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-800 rounded-lg" />
            <div className="h-48 bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
