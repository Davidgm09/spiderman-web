export default function Loading() {
  return (
    <div className="pt-16 animate-pulse">
      <div className="relative min-h-[80vh] bg-gray-900 flex items-end pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-4 w-32 bg-gray-700 rounded mb-6" />
          <div className="h-12 w-2/3 bg-gray-700 rounded mb-4" />
          <div className="h-6 w-1/2 bg-gray-800 rounded mb-8" />
          <div className="flex gap-4">
            <div className="h-10 w-36 bg-gray-700 rounded" />
            <div className="h-10 w-36 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-48 bg-gray-800 rounded-lg" />
            <div className="h-64 bg-gray-800 rounded-lg" />
            <div className="h-96 bg-gray-800 rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-gray-800 rounded-lg" />
            <div className="h-48 bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
