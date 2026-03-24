import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | YouSafe Blog`,
      description: post.excerpt,
      type: "article",
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(" ").length;
  return Math.ceil(words / 200);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-50 select-none">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <FadeIn direction="up">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 mb-6">
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.createdAt).toLocaleDateString("en-IE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readingTime(post.content)} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-[#2B8FD4] pl-4">
              {post.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10">
            <div
              className="prose prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-[#2B8FD4] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900
                prose-ul:text-slate-600 prose-ol:text-slate-600
                prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#2B8FD4] hover:underline font-medium"
            >
              <ArrowLeft size={14} />
              Back to all posts
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
