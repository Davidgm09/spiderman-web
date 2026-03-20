export default function Loading() {
  return (
    <div className="pt-16 animate-pulse">
      {/* Hero */}
      <div className="h-72 bg-gray-900" />
      {/* Article */}
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-4">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        <div className="h-10 w-3/4 bg-gray-700 rounded" />
        <div className="h-5 w-1/2 bg-gray-800 rounded" />
        <div className="h-px bg-gray-800 my-6" />
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-4 bg-gray-800 rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
        <div className="h-48 bg-gray-800 rounded-lg my-8" />
        {[1,2,3,4].map(i => (
          <div key={i} className="h-4 bg-gray-800 rounded" style={{ width: `${80 + (i % 4) * 5}%` }} />
        ))}
      </div>
    </div>
  )
}
