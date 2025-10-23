export default function CareerLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
          <div className="text-gray-400">/</div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      {/* Header skeleton */}
      <div className="mb-8 sm:mb-12">
        <div className="h-8 sm:h-10 bg-gray-200 rounded w-32 mb-3 sm:mb-4 animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-full max-w-lg animate-pulse"></div>
      </div>

      {/* Timeline skeleton */}
      <div className="space-y-6 sm:space-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative flex flex-col md:flex-row gap-3 sm:gap-4">
            {/* Timeline dot */}
            <div className="flex-shrink-0 flex items-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Year badge */}
              <div className="h-6 bg-gray-200 rounded-full w-16 mb-2 animate-pulse"></div>
              
              {/* Title and organization */}
              <div className="mb-2">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-36 animate-pulse"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}