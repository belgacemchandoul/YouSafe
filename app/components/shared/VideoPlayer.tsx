"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

interface VideoPlayerProps {
  url: string;
  title: string;
  description?: string | null;
}

function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match ? match[2] : "";
}

export default function VideoPlayer({
  url,
  title,
  description,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYoutubeId(url);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-slate-900">
        {playing ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setPlaying(true)}
          >
            {/* Thumbnail */}
            <Image
              src={thumbnail}
              alt={title}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-xl">
                <Play
                  size={24}
                  className="text-[#2B8FD4] ml-1"
                  fill="#2B8FD4"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
