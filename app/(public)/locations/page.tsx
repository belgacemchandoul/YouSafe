import Link from "next/link";
import { ChevronDown, MapPin, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import { Category } from "@/app/generated/prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessible Locations",
  description:
    "Browse all wheelchair friendly locations across Ireland. Filter by category and city.",
};

interface SearchParams {
  category?: string;
  city?: string;
  feature?: string;
}

type Feature = { id: string; name: string };
type Image = { id: string; url: string };

type LocationWithExtras = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  isApproved: boolean;
  isFeatured: boolean;
  verified: boolean;
  accessibilityRating: number | null;
  accessibilityNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  features: Feature[];
  images: Image[];
};

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

const TOP_FEATURES = [
  "Ramp",
  "Elevator",
  "Accessible Toilet",
  "Accessible Parking",
  "Step-Free Entrance",
  "Hearing Loop",
  "Automatic Doors",
  "Wide Doorways",
];

async function getLocations(
  category?: string,
  city?: string,
  feature?: string,
): Promise<LocationWithExtras[]> {
  const locations = await prisma.location.findMany({
    where: {
      isApproved: true,
      ...(category && { category: category as Category }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(feature && {
        features: { some: { name: { equals: feature, mode: "insensitive" } } },
      }),
    },
    include: {
      features: true,
      images: true,
    },
  });

  return locations.sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    if (aIndex !== bIndex) return aIndex - bIndex;
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return 0;
  }) as LocationWithExtras[];
}

async function getCities() {
  const locations = await prisma.location.findMany({
    where: { isApproved: true },
    select: { city: true },
    distinct: ["city"],
  });
  return locations.map((l) => l.city);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${i < rating ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function FiltersContent({
  category,
  city,
  feature,
  cities,
}: {
  category?: string;
  city?: string;
  feature?: string;
  cities: string[];
}) {
  return (
    <div className="space-y-6">
      {/* Clear all — desktop only */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-500" />
          <h2 className="font-semibold text-slate-900 text-sm">Filters</h2>
        </div>
        {(category || city || feature) && (
          <Link
            href="/locations"
            scroll={true}
            className="text-xs text-[#2B8FD4] hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Category
        </h3>
        <div className="flex flex-col gap-1">
          <Link
            href={`/locations${city ? `?city=${city}` : ""}${feature ? `${city ? "&" : "?"}feature=${feature}` : ""}`}
            scroll={true}
            className={`px-3 py-2 rounded-lg text-sm transition-colors
              ${!category ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            All Categories
          </Link>
          {CATEGORY_ORDER.map((cat) => (
            <Link
              key={cat}
              href={`/locations?category=${cat}${city ? `&city=${city}` : ""}${feature ? `&feature=${feature}` : ""}`}
              scroll={true}
              className={`px-3 py-2 rounded-lg text-sm transition-colors
                ${category === cat ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {cat.replace("_", " ").charAt(0) +
                cat.replace("_", " ").slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* City Filter */}
      {cities.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            City
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              href={`/locations${category ? `?category=${category}` : ""}${feature ? `${category ? "&" : "?"}feature=${feature}` : ""}`}
              scroll={true}
              className={`px-3 py-2 rounded-lg text-sm transition-colors
                ${!city ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              All Cities
            </Link>
            {cities.map((c) => (
              <Link
                key={c}
                href={`/locations?city=${c}${category ? `&category=${category}` : ""}${feature ? `&feature=${feature}` : ""}`}
                scroll={true}
                className={`px-3 py-2 rounded-lg text-sm transition-colors
                  ${city === c ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Feature Filter */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Accessibility Feature
        </h3>
        <div className="flex flex-col gap-1">
          <Link
            href={`/locations${category ? `?category=${category}` : ""}${city ? `${category ? "&" : "?"}city=${city}` : ""}`}
            scroll={true}
            className={`px-3 py-2 rounded-lg text-sm transition-colors
              ${!feature ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            All Features
          </Link>
          {TOP_FEATURES.map((f) => (
            <Link
              key={f}
              href={`/locations?feature=${encodeURIComponent(f)}${category ? `&category=${category}` : ""}${city ? `&city=${city}` : ""}`}
              scroll={true}
              className={`px-3 py-2 rounded-lg text-sm transition-colors
                ${feature === f ? "bg-[#2B8FD4] text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {f}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, city, feature } = await searchParams;
  const [locations, cities] = await Promise.all([
    getLocations(category, city, feature),
    getCities(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 select-none">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <FadeIn direction="up">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Accessible Locations
            </h1>
            <p className="text-slate-500 mt-2">
              {locations.length} wheelchair friendly places across Ireland
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FadeIn direction="left" className="lg:w-64 shrink-0">
            {/* Mobile collapsible */}
            <details className="lg:hidden bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <summary className="p-4 flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-slate-500" />
                  <span className="font-semibold text-slate-900 text-sm">
                    Filters
                  </span>
                  {(category || city || feature) && (
                    <span className="bg-[#2B8FD4] text-white text-xs px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </summary>
              <div className="p-4 border-t border-slate-100">
                <FiltersContent
                  category={category}
                  city={city}
                  feature={feature}
                  cities={cities}
                />
              </div>
            </details>

            {/* Desktop sidebar */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              <FiltersContent
                category={category}
                city={city}
                feature={feature}
                cities={cities}
              />
            </div>
          </FadeIn>

          {/* Locations Grid */}
          <div className="flex-1">
            {locations.length === 0 ? (
              <FadeIn direction="up">
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <MapPin size={40} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    No locations found
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Try adjusting your filters
                  </p>
                  <Link
                    href="/locations"
                    className="inline-flex mt-4 text-sm text-[#2B8FD4] hover:underline"
                  >
                    Clear filters
                  </Link>
                </div>
              </FadeIn>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {locations.map((location, index) => (
                  <FadeIn key={location.id} direction="up" delay={index * 0.05}>
                    <Link href={`/locations/${location.slug}`}>
                      <Card className="border border-slate-200 shadow-none hover:shadow-md transition-shadow h-full bg-white">
                        <CardContent className="p-6 space-y-4">
                          {/* Top Row */}
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="outline" className="text-xs">
                              {location.category.replace("_", " ").charAt(0) +
                                location.category
                                  .replace("_", " ")
                                  .slice(1)
                                  .toLowerCase()}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {location.verified && (
                                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                              {location.isFeatured && (
                                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 text-xs">
                                  ⭐
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Name & Address */}
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {location.name}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                              <MapPin size={12} />
                              {location.address}
                            </p>
                          </div>

                          {/* Rating */}
                          {location.accessibilityRating && (
                            <StarRating rating={location.accessibilityRating} />
                          )}

                          {/* Description */}
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                            {location.description}
                          </p>

                          {/* Features */}
                          {location.features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {location.features.slice(0, 3).map((feature) => (
                                <Badge
                                  key={feature.id}
                                  className="bg-green-50 text-green-700 hover:bg-green-50 text-xs"
                                >
                                  ✓ {feature.name}
                                </Badge>
                              ))}
                              {location.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{location.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
