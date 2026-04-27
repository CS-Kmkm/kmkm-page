export default function DevExperienceLoading() {
  return (
    <div className="w-[90%] max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-2xl animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6 xl:gap-8 xl:items-start">
          <div className="space-y-8 sm:space-y-10">
            {[...Array(3)].map((_, sectionIndex) => (
              <section key={sectionIndex} className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-56 animate-pulse"></div>
                </div>
                <div className="grid w-full justify-start gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 6.75rem), 6.75rem))' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-square rounded-lg border border-gray-200/80 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 p-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 shadow-sm p-4 sm:p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-16"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
