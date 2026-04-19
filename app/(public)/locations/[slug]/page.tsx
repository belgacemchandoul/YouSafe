import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  CheckCircle,
  Star,
  FileText,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import { Category } from "@/app/generated/prisma/client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) return { title: "Location Not Found" };
  return {
    title: location.name,
    description: location.description,
    openGraph: {
      title: `${location.name} | YouSafe`,
      description: location.description,
      type: "article",
    },
  };
}

async function getLocation(slug: string) {
  return await prisma.location.findUnique({
    where: { slug },
    include: { features: true, images: true },
  });
}

async function getRelatedLocations(category: string, currentSlug: string) {
  return await prisma.location.findMany({
    where: {
      isApproved: true,
      category: category as Category,
      NOT: { slug: currentSlug },
    },
    include: { features: true, images: true },
    take: 3,
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
      <span className="text-sm text-slate-600 ml-1">{rating}/5</span>
    </div>
  );
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) notFound();

  const relatedLocations = await getRelatedLocations(location.category, slug);

  return (
    <div className="min-h-screen bg-slate-50 select-none">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <FadeIn direction="up">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Locations
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    {location.category.replace("_", " ").charAt(0) +
                      location.category
                        .replace("_", " ")
                        .slice(1)
                        .toLowerCase()}
                  </Badge>
                  {location.isFeatured && (
                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                      ⭐ Featured
                    </Badge>
                  )}
                  {location.verified && (
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                      ✓ Verified
                    </Badge>
                  )}
                  {location.isApproved && (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                      ✓ Approved
                    </Badge>
                  )}
                  <Badge className="bg-slate-50 text-slate-700 hover:bg-slate-50 flex items-center gap-1">
                    <Shield size={11} />
                    Secure
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                  {location.name}
                </h1>

                <p className="text-slate-500 flex items-center gap-2">
                  <MapPin size={16} className="text-[#2B8FD4] shrink-0" />
                  {location.address}, {location.city}
                </p>

                {location.accessibilityRating && (
                  <StarRating rating={location.accessibilityRating} />
                )}
              </div>

              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                    bg-[#2B8FD4] text-white text-sm font-medium hover:bg-[#1a6fa8]
                    transition-colors shrink-0 w-full sm:w-auto"
              >
                <MapPin size={16} />
                Open in Google Maps
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <FadeIn direction="up">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  About
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {location.description}
                </p>
              </div>
            </FadeIn>

            {/* Accessibility Notes */}
            {location.accessibilityNotes && (
              <FadeIn direction="up" delay={0.05}>
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-[#2B8FD4]" />
                    <h2 className="text-lg font-semibold text-slate-900">
                      Accessibility Notes
                    </h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {location.accessibilityNotes}
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Accessibility Features */}
            {location.features.length > 0 && (
              <FadeIn direction="up" delay={0.1}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Accessibility Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {location.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                      >
                        <CheckCircle
                          size={18}
                          className="text-green-600 shrink-0"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Map Embed */}
            <FadeIn direction="up" delay={0.2}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 sm:p-8 pb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Location
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {location.address}, {location.city}
                  </p>
                </div>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01},${location.latitude - 0.01},${location.longitude + 0.01},${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  title={`Map showing ${location.name}`}
                  className="w-full"
                />
                <div className="p-4 border-t border-slate-100">
                  <a
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#2B8FD4] hover:underline font-medium"
                  >
                    <MapPin size={14} />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <FadeIn direction="left">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Quick Info
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="text-[#2B8FD4] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Address</p>
                      <p className="text-sm text-slate-700">
                        {location.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="text-[#2B8FD4] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">City</p>
                      <p className="text-sm text-slate-700">{location.city}</p>
                    </div>
                  </div>
                  {location.accessibilityRating && (
                    <div className="flex items-start gap-3">
                      <Star
                        size={16}
                        className="text-amber-400 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">
                          Accessibility Rating
                        </p>
                        <StarRating rating={location.accessibilityRating} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={16}
                      className="text-green-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">
                        Accessibility Features
                      </p>
                      <p className="text-sm text-slate-700">
                        {location.features.length} features verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Related Locations */}
            {relatedLocations.length > 0 && (
              <FadeIn direction="left" delay={0.1}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Similar Locations
                  </h2>
                  <div className="space-y-3">
                    {relatedLocations.map((related) => (
                      <Link
                        key={related.id}
                        href={`/locations/${related.slug}`}
                        className="block p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {related.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={10} />
                          {related.address}
                        </p>
                        {related.features.length > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ {related.features.length} accessibility features
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
