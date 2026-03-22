"use client";

import { useEffect, useRef } from "react";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!mapRef.current) return;
      if (mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [53.3498, -6.2603],
        zoom: 13,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      locations.forEach((location) => {
        const color = CATEGORY_COLORS[location.category] || "#64748b";

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              background-color: ${color};
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });

        const featuresHtml =
          location.features.length > 0
            ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">
              ${location.features
                .slice(0, 3)
                .map(
                  (f) => `
                <span style="
                  background:#f0fdf4;
                  color:#16a34a;
                  padding:2px 8px;
                  border-radius:9999px;
                  font-size:11px;
                  font-weight:500;
                ">✓ ${f.name}</span>
              `,
                )
                .join("")}
              ${
                location.features.length > 3
                  ? `
                <span style="
                  background:#f1f5f9;
                  color:#64748b;
                  padding:2px 8px;
                  border-radius:9999px;
                  font-size:11px;
                ">+${location.features.length - 3} more</span>
              `
                  : ""
              }
            </div>`
            : "";

        const ratingHtml = location.accessibilityRating
          ? `<div style="margin-top:6px;display:flex;gap:2px;">
              ${Array.from({ length: 5 })
                .map(
                  (_, i) => `
                <span style="font-size:12px;color:${i < location.accessibilityRating! ? "#f59e0b" : "#e2e8f0"};">★</span>
              `,
                )
                .join("")}
            </div>`
          : "";

        const verifiedHtml = location.verified
          ? `<span style="
              background:#eff6ff;
              color:#1d4ed8;
              padding:2px 8px;
              border-radius:9999px;
              font-size:11px;
              font-weight:600;
            ">✓ Verified</span>`
          : "";

        const categoryLabel = location.category.replace("_", " ");
        const categoryDisplay =
          categoryLabel.charAt(0) + categoryLabel.slice(1).toLowerCase();

        const popupContent = `
          <div style="min-width:200px;max-width:260px;font-family:sans-serif;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:4px;flex-wrap:wrap;">
              <span style="
                background:${color}20;
                color:${color};
                padding:2px 8px;
                border-radius:9999px;
                font-size:11px;
                font-weight:600;
              ">${categoryDisplay}</span>
              <div style="display:flex;gap:4px;align-items:center;">
                ${verifiedHtml}
                ${location.isFeatured ? '<span style="font-size:12px;">⭐</span>' : ""}
              </div>
            </div>
            <p style="font-weight:700;font-size:14px;margin:0 0 4px;color:#0f172a;">${location.name}</p>
            <p style="font-size:12px;color:#64748b;margin:0 0 4px;">📍 ${location.address}</p>
            ${ratingHtml}
            ${featuresHtml}
            <a href="/locations/${location.slug}" style="
              display:inline-flex;
              align-items:center;
              margin-top:10px;
              padding:6px 14px;
              background:#2B8FD4;
              color:white;
              border-radius:8px;
              font-size:12px;
              font-weight:600;
              text-decoration:none;
              width:100%;
              justify-content:center;
              box-sizing:border-box;
            ">View Details →</a>
          </div>
        `;

        L.marker([location.latitude, location.longitude], { icon })
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 280,
            className: "custom-popup",
          });
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapRef}
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
    />
  );
}
