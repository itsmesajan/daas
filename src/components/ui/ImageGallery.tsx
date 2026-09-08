"use client";

import { useRef } from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import type { InitDetail } from "lightgallery/lg-events";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { Images, ZoomIn } from "lucide-react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

const MAX_VISIBLE_THUMBS = 3;

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const galleryRef = useRef<LightGalleryInstance | null>(null);

  if (images.length === 0) return null;

  const dynamicEl = images.map((src, i) => ({
    src,
    thumb: src,
    subHtml: `<h4>${alt}</h4><p>${i + 1} / ${images.length}</p>`,
  }));

  const onInit = (detail: InitDetail) => {
    galleryRef.current = detail.instance;
  };

  const openAt = (index: number) => galleryRef.current?.openGallery(index);

  const lightGallery = (
    <LightGallery onInit={onInit} dynamic dynamicEl={dynamicEl} plugins={[lgZoom, lgThumbnail]} speed={400} />
  );

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`View ${alt} photo`}
          className="group relative block h-full w-full cursor-zoom-in"
        >
          <Image src={images[0]} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" priority />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-bento-ink opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
            <ZoomIn size={13} />
            Zoom
          </span>
        </button>
        {lightGallery}
      </>
    );
  }

  // Real (non-hero) photos, deduplicated for lightGallery's own count/index.
  const extras = images.slice(1);
  const remaining = extras.length - MAX_VISIBLE_THUMBS;

  // Always fill exactly MAX_VISIBLE_THUMBS tiles so the rail never leaves
  // blank space — when there are fewer real extra photos than tiles, cycle
  // back through the ones we have instead of stretching one tile to fill
  // the gap. Each tile still opens the lightbox at its own real index, and
  // the "+N" overflow badge only counts genuinely hidden photos.
  const thumbSlots = Array.from({ length: MAX_VISIBLE_THUMBS }, (_, i) => ({
    src: extras[i % extras.length],
    realIndex: 1 + (i % extras.length),
  }));

  return (
    <>
      <div className="grid h-full w-full grid-cols-[1fr_minmax(0,26%)] gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`View ${alt} photo 1`}
          className="group relative overflow-hidden rounded-2xl cursor-zoom-in"
        >
          <Image
            src={images[0]}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-bento-ink opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
            <ZoomIn size={13} />
            Zoom
          </span>
        </button>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {thumbSlots.map(({ src, realIndex }, i) => {
            const isLastVisible = i === thumbSlots.length - 1 && remaining > 0;
            return (
              <button
                key={`${realIndex}-${i}`}
                type="button"
                onClick={() => openAt(realIndex)}
                aria-label={`View ${alt} photo ${realIndex + 1}`}
                className="group relative flex-1 overflow-hidden rounded-xl cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt={`${alt} ${realIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 30vw"
                />
                {isLastVisible && (
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-bento-ink/65 text-sm font-semibold text-white">
                    <Images size={14} />+{remaining}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {lightGallery}
    </>
  );
}
