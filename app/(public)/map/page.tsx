import { SlidersHorizontal } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import MapWrapper from "@/app/components/map/MapWrapper";

export const metadata: Metadata = {
  title: "Accessibility Map",
  description:
    "Interactive map of wheelchair accessible places across Ireland.",
};

type Category =
  | "RESTAURANT"
  | "CAFE"
  | "HOTEL"
  | "SHOPPING"
  | "TRANSPORT"
  | "HOSPITAL"
  | "PHARMACY"
  | "PARK"
  | "EDUCATION"
  | "ENTERTAINMENT"
  | "SPORT"
  | "GOVERNMENT"
  | "RELIGIOUS"
  | "TOURISM"
  | "SUPERMARKET"
  | "BANK"
  | "POST_OFFICE"
  | "MUSEUM"
  | "LIBRARY"
  | "BEACH"
  | "PUBLIC_TOILET"
  | "OTHER";

interface SearchParams {
  category?: Category;
}

const CATEGORY_ORDER = [
  "RESTAURANT",
  "CAFE",
  "HOTEL",
  "SHOPPING",
  "TRANSPORT",
  "HOSPITAL",
  "PHARMACY",
  "PARK",
  "EDUCATION",
  "ENTERTAINMENT",
  "SPORT",
  "GOVERNMENT",
  "RELIGIOUS",
  "TOURISM",
  "SUPERMARKET",
  "BANK",
  "POST_OFFICE",
  "MUSEUM",
  "LIBRARY",
  "BEACH",
  "PUBLIC_TOILET",
  "OTHER",
];

const CATEGORY_COLORS: Record<string, string> = {
  RESTAURANT: "#ef4444",
  CAFE: "#f97316",
  HOTEL: "#8b5cf6",
  SHOPPING: "#ec4899",
  TRANSPORT: "#2B8FD4",
  HOSPITAL: "#dc2626",
  PHARMACY: "#16a34a",
  PARK: "#5DBB3F",
  EDUCATION: "#0891b2",
  ENTERTAINMENT: "#7c3aed",
  SPORT: "#0d9488",
  GOVERNMENT: "#1d4ed8",
  RELIGIOUS: "#92400e",
  TOURISM: "#0e7490",
  SUPERMARKET: "#15803d",
  BANK: "#1e40af",
  POST_OFFICE: "#b45309",
  MUSEUM: "#7e22ce",
  LIBRARY: "#0f766e",
  BEACH: "#0369a1",
  PUBLIC_TOILET: "#475569",
  OTHER: "#64748b",
};

async function getLocations(category?: Category) {
  return await prisma.location.findMany({
    where: {
      isApproved: true,
      ...(category && { category }),
    },
    include: {
      features: true,
      images: true,
    },
  });
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await searchParams;
  const locations = await getLocations(category);

  return (
    <div
      className="flex flex-col lg:flex-row overflow-hidden select-none"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto max-h-48 lg:max-h-full">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={16} className="text-slate-500" />
            <h1 className="font-bold text-slate-900">Accessible Map</h1>
          </div>
          <p className="text-slate-500 text-xs">
            {locations.length} locations in Ireland
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            href="/map"
            scroll={false}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full
              ${!category ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
            All Categories
          </Link>
          {CATEGORY_ORDER.map((cat) => (
            <Link
              key={cat}
              href={`/map?category=${cat}`}
              scroll={false}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-full
                ${category === cat ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              {cat.replace("_", " ").charAt(0) +
                cat.replace("_", " ").slice(1).toLowerCase()}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            Click any pin to see details
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        <MapWrapper locations={locations} />
      </div>
    </div>
  );
}
