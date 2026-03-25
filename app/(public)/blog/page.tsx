import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and guides about wheelchair accessibility in Ireland.",
};

async function getPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(" ").length;
  return Math.ceil(words / 200);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-slate-50 select-none">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <FadeIn direction="up">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Blog
            </h1>
            <p className="text-slate-500 mt-2">
              Guides and articles about wheelchair accessibility in Ireland
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {posts.length === 0 ? (
          <FadeIn direction="up">
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <p className="text-slate-500 font-medium">No posts yet</p>
              <p className="text-slate-400 text-sm mt-1">Check back soon</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <FadeIn key={post.id} direction="up" delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className="border border-slate-200 shadow-none hover:shadow-md transition-shadow h-full bg-white">
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden rounded-t-xl">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={225}
                        />
                      </div>
                    )}
                    <CardContent className="p-6 space-y-4">
                      <Badge className="bg-[#2B8FD4]/10 text-[#2B8FD4] hover:bg-[#2B8FD4]/10 text-xs">
                        Accessibility
                      </Badge>
                      <h2 className="font-bold text-slate-900 text-lg leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-IE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {readingTime(post.content)} min read
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2B8FD4]">
                        Read more <ArrowRight size={14} />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
