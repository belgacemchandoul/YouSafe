import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Video,
  ArrowRight,
  CheckCircle,
  Building2,
  PlayCircle,
  Accessibility,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Find wheelchair friendly restaurants, hotels, transport and more across Ireland. Your guide to accessible places.",
};
async function getFeaturedLocations() {
  return await prisma.location.findMany({
    where: {
      isApproved: true,
      isFeatured: true,
    },
    include: {
      features: true,
      images: true,
    },
    take: 3,
  });
}

async function getStats() {
  const [totalLocations, totalMedia] = await Promise.all([
    prisma.location.count({ where: { isApproved: true } }),
    prisma.media.count(),
  ]);
  return { totalLocations, totalMedia };
}

export default async function HomePage() {
  const [featuredLocations, stats] = await Promise.all([
    getFeaturedLocations(),
    getStats(),
  ]);

  return (
    <div className="flex flex-col select-none">
      {/* Hero Section — no FadeIn here, it's above the fold */}
      <section className="relative bg-linear-to-br from-[#2B8FD4] to-[#1a6fa8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/20 mb-4 flex items-center gap-2">
              <Image
                src="https://flagcdn.com/w20/ie.png"
                alt="Ireland"
                width={20}
                height={14}
                unoptimized
              />
              Ireland&#39;s Accessibility Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Find Wheelchair Friendly Places in Ireland
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Discover accessible restaurants, hotels, parks and more across
              Ireland. Navigate with confidence knowing every location is
              verified for wheelchair accessibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                  bg-white text-[#2B8FD4] font-semibold text-sm border-2 border-white
                  hover:bg-[#2B8FD4] hover:text-white transition-colors shadow-md"
              >
                <MapPin size={18} />
                Explore the Map
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                  border-2 border-white text-white font-semibold text-sm 
                  hover:bg-white hover:text-[#2B8FD4] transition-colors"
              >
                Browse Locations
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  label: "Accessible Locations",
                  value: stats.totalLocations,
                  icon: <MapPin size={22} className="text-[#2B8FD4]" />,
                  bg: "bg-blue-50",
                },
                {
                  label: "Cities Covered",
                  value: "5+",
                  icon: <Building2 size={22} className="text-[#5DBB3F]" />,
                  bg: "bg-green-50",
                },
                {
                  label: "Media Resources",
                  value: stats.totalMedia,
                  icon: <PlayCircle size={22} className="text-purple-500" />,
                  bg: "bg-purple-50",
                },
                {
                  label: "Accessibility Features",
                  value: "8+",
                  icon: <Accessibility size={22} className="text-amber-500" />,
                  bg: "bg-amber-50",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                YouSafe makes it easy to find and navigate wheelchair accessible
                places across Ireland.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin size={28} className="text-[#2B8FD4]" />,
                title: "Interactive Map",
                description:
                  "Browse accessible locations on a full interactive map of Ireland with filters for category and features.",
                href: "/map",
                cta: "Open Map",
              },
              {
                icon: <CheckCircle size={28} className="text-[#5DBB3F]" />,
                title: "Verified Locations",
                description:
                  "Every location is checked for accessibility features including ramps, elevators, accessible toilets and more.",
                href: "/locations",
                cta: "Browse Locations",
              },
              {
                icon: <Video size={28} className="text-[#2B8FD4]" />,
                title: "Media Resources",
                description:
                  "Watch videos and listen to audio guides about wheelchair accessibility across Ireland.",
                href: "/media",
                cta: "View Media",
              },
            ].map((feature, index) => (
              <FadeIn key={feature.title} direction="up" delay={index * 0.15}>
                <Card className="border border-slate-200 shadow-none hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#2B8FD4] hover:gap-2 transition-all"
                    >
                      {feature.cta}
                      <ArrowRight size={14} />
                    </Link>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      {featuredLocations.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Featured Locations
                  </h2>
                  <p className="text-slate-500 mt-1">
                    Top wheelchair accessible places in Ireland
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/locations">
                    View All
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLocations.map((location, index) => (
                <FadeIn key={location.id} direction="up" delay={index * 0.15}>
                  <Link href={`/locations/${location.slug}`}>
                    <Card className="border border-slate-200 shadow-none hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-6 space-y-4">
                        <Badge variant="outline" className="text-xs">
                          {location.category.charAt(0) +
                            location.category.slice(1).toLowerCase()}
                        </Badge>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {location.name}
                          </h3>
                          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                            <MapPin size={12} />
                            {location.address}
                          </p>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {location.description}
                        </p>
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[#2B8FD4] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Explore Ireland?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Start exploring wheelchair accessible locations across Ireland
              today.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                bg-white text-[#2B8FD4] font-semibold text-sm border-2 border-white
                hover:bg-[#2B8FD4] hover:text-white transition-colors shadow-md"
            >
              <MapPin size={18} />
              Explore the Map
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
