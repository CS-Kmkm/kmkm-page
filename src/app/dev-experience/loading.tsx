export default function DevExperienceLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
        </div>

        {/* Statistics skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Legend skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technology grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}