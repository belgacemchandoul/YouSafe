export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl p-6 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
