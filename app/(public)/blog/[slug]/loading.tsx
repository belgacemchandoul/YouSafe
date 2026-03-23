export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full h-64 sm:h-80 bg-slate-200 animate-pulse" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-8 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 bg-slate-100 rounded animate-pulse ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/6"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
