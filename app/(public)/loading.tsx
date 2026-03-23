export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <div className="bg-linear-to-br from-[#2B8FD4] to-[#1a6fa8] py-20 sm:py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="h-6 w-48 bg-white/20 rounded-full animate-pulse" />
            <div className="h-12 w-3/4 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-6 w-full bg-white/20 rounded-lg animate-pulse" />
            <div className="h-6 w-2/3 bg-white/20 rounded-lg animate-pulse" />
            <div className="flex gap-4 pt-2">
              <div className="h-12 w-40 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-12 w-40 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse mx-auto" />
            <div className="h-4 w-96 bg-slate-100 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
