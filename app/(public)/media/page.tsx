import { Video, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/app/components/shared";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Resources",
  description:
    "Videos and audio guides about wheelchair accessibility across Ireland.",
};
async function getMedia() {
  return await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
}

function getYoutubeEmbedUrl(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match ? `https://www.youtube.com/embed/${match[2]}` : url;
}

export default async function MediaPage() {
  const media = await getMedia();

  const videos = media.filter((m) => m.type === "VIDEO");
  const audios = media.filter((m) => m.type === "AUDIO");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <FadeIn direction="up">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Media Resources
            </h1>
            <p className="text-slate-500 mt-2">
              Videos and audio guides about wheelchair accessibility in Ireland
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {media.length === 0 ? (
          <FadeIn direction="up">
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <Video size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No media yet</p>
              <p className="text-slate-400 text-sm mt-1">Check back soon</p>
            </div>
          </FadeIn>
        ) : (
          <>
            {/* Videos Section */}
            {videos.length > 0 && (
              <section>
                <FadeIn direction="up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Video size={20} className="text-[#2B8FD4]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Videos
                      </h2>
                      <p className="text-slate-500 text-sm">
                        {videos.length} video{videos.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <FadeIn key={video.id} direction="up" delay={index * 0.1}>
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Video Embed */}
                        <div className="aspect-video">
                          <iframe
                            src={getYoutubeEmbedUrl(video.url)}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                        {/* Info */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900 text-sm">
                              {video.title}
                            </h3>
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shrink-0 text-xs">
                              Video
                            </Badge>
                          </div>
                          {video.description && (
                            <p className="text-slate-500 text-sm leading-relaxed">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </section>
            )}

            {/* Audio Section */}
            {audios.length > 0 && (
              <section>
                <FadeIn direction="up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Music size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Audio
                      </h2>
                      <p className="text-slate-500 text-sm">
                        {audios.length} audio clip{audios.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {audios.map((audio, index) => (
                    <FadeIn key={audio.id} direction="up" delay={index * 0.1}>
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                            <Music size={18} className="text-purple-600" />
                          </div>
                          <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 text-xs">
                            Audio
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {audio.title}
                        </h3>
                        {audio.description && (
                          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                            {audio.description}
                          </p>
                        )}
                        <audio controls className="w-full mt-2" src={audio.url}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
