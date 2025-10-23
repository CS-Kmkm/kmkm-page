export default function PublicationsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="h-8 sm:h-10 bg-gray-200 rounded w-48 mb-3 sm:mb-4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>

      {/* Statistics skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-8 mx-auto mb-2 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-7 bg-gray-200 rounded-full w-20 animate-pulse"></div>
        ))}
      </div>

      {/* Publications list skeleton */}
      <div className="space-y-4 sm:space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-l-4 border-gray-200 pl-3 sm:pl-4">
            {/* Title */}
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            
            {/* Authors */}
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
            
            {/* Venue and year */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results count skeleton */}
      <div className="mt-6 text-center">
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}