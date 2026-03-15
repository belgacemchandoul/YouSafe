"use client";

import dynamic from "next/dynamic";

interface Feature {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  isApproved: boolean;
  isFeatured: boolean;
  features: Feature[];
}

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading map...</p>
    </div>
  ),
});

export default function MapWrapper({ locations }: { locations: Location[] }) {
  return <MapView locations={locations} />;
}
