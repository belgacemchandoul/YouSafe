"use client";

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

// No longer needs dynamic import — @vis.gl/react-google-maps is SSR-safe
import MapView from "./MapView";

export default function MapWrapper({ locations }: { locations: Location[] }) {
  return <MapView locations={locations} />;
}
