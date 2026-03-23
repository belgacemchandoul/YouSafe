import { SlidersHorizontal } from "lucide-react";

export default function MapLoading() {
  return (
    <div
      className="flex flex-col lg:flex-row overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={16} className="text-slate-300" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-3 w-32 bg-slate-100 rounded animate-pulse mt-1" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-9 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Map Skeleton */}
      <div className="flex-1 relative bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse mx-auto" />
          <p className="text-slate-400 text-sm">Loading map...</p>
        </div>
      </div>
    </div>
  );
}
