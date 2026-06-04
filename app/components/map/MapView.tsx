"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

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
  verified?: boolean;
  accessibilityRating?: number | null;
  features: Feature[];
}

interface MapViewProps {
  locations: Location[];
}

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

export default function MapView({ locations }: MapViewProps) {
  const [selected, setSelected] = useState<Location | null>(null);

  const handleMarkerClick = useCallback((loc: Location) => {
    setSelected(loc);
  }, []);

  const handleInfoClose = useCallback(() => {
    setSelected(null);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (!apiKey) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          minHeight: "500px",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          color: "#94a3b8",
          fontFamily: "sans-serif",
          fontSize: "14px",
        }}
      >
        Google Maps API key not configured.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: 53.3498, lng: -6.2603 }}
        defaultZoom={13}
        gestureHandling="greedy"
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        style={{
          height: "100%",
          width: "100%",
          minHeight: "500px",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {locations.map((loc) => {
          const color = CATEGORY_COLORS[loc.category] ?? "#64748b";
          return (
            <AdvancedMarker
              key={loc.id}
              position={{ lat: loc.latitude, lng: loc.longitude }}
              onClick={() => handleMarkerClick(loc)}
            >
              <Pin
                background={color}
                borderColor="white"
                glyphColor="white"
                scale={loc.isFeatured ? 1.3 : 1}
              />
            </AdvancedMarker>
          );
        })}

        {selected &&
          (() => {
            const color = CATEGORY_COLORS[selected.category] ?? "#64748b";
            const categoryLabel = selected.category.replace(/_/g, " ");
            const categoryDisplay =
              categoryLabel.charAt(0) + categoryLabel.slice(1).toLowerCase();

            return (
              <InfoWindow
                position={{ lat: selected.latitude, lng: selected.longitude }}
                onCloseClick={handleInfoClose}
                pixelOffset={[0, -50]}
              >
                <div
                  style={{
                    minWidth: "200px",
                    maxWidth: "260px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {/* Category + verified + featured */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      gap: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: `${color}20`,
                        color,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {categoryDisplay}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      {selected.verified && (
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                      {selected.isFeatured && (
                        <span style={{ fontSize: "12px" }}>⭐</span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      margin: "0 0 4px",
                      color: "#0f172a",
                    }}
                  >
                    {selected.name}
                  </p>

                  {/* Address */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "0 0 4px",
                    }}
                  >
                    📍 {selected.address}
                  </p>

                  {/* Rating */}
                  {selected.accessibilityRating != null && (
                    <div
                      style={{ marginTop: "6px", display: "flex", gap: "2px" }}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "12px",
                            color:
                              i < selected.accessibilityRating!
                                ? "#f59e0b"
                                : "#e2e8f0",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Features chips */}
                  {selected.features.length > 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      {selected.features.slice(0, 3).map((f) => (
                        <span
                          key={f.id}
                          style={{
                            background: "#f0fdf4",
                            color: "#16a34a",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          ✓ {f.name}
                        </span>
                      ))}
                      {selected.features.length > 3 && (
                        <span
                          style={{
                            background: "#f1f5f9",
                            color: "#64748b",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                          }}
                        >
                          +{selected.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Details button */}
                  <a
                    href={`/locations/${selected.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginTop: "10px",
                      padding: "6px 14px",
                      background: "#2B8FD4",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      width: "100%",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    View Details →
                  </a>
                </div>
              </InfoWindow>
            );
          })()}
      </Map>
    </APIProvider>
  );
}
