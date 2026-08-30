"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

type ImageMedia = {
  type: "image";
  src: StaticImageData;
  alt: string;
};

type VideoMedia = {
  type: "video";
  /** Path under /public, e.g. "/video/hero.mp4" — drop the file in and it just works. */
  sources: { src: string; type: string }[];
  poster?: StaticImageData;
  alt: string;
};

type SliderMedia = {
  type: "slider";
  images: { src: StaticImageData; alt: string }[];
  /** Milliseconds between slides. */
  interval?: number;
};

export type HeroMediaConfig = ImageMedia | VideoMedia | SliderMedia;

const sizes = "(min-width: 1024px) 35vw, 90vw";

/**
 * Hero visual — swap `media` between an image, a background video, or an
 * auto-rotating slider without touching the surrounding layout. Pick one in
 * Hero.tsx: whichever `const heroMedia = ...` is active there.
 */
export default function HeroMedia({ media }: { media: HeroMediaConfig }) {
  if (media.type === "video") {
    return <HeroVideo media={media} />;
  }
  if (media.type === "slider") {
    return <HeroSlider images={media.images} interval={media.interval} />;
  }
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      priority
      className="object-cover"
      sizes={sizes}
    />
  );
}

function HeroVideo({ media }: { media: VideoMedia }) {
  return (
    <>
      {media.poster && (
        <Image
          src={media.poster}
          alt={media.alt}
          fill
          priority
          className="object-cover"
          sizes={sizes}
        />
      )}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={media.poster ? (media.poster as StaticImageData).src : undefined}
        aria-label={media.alt}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {media.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </>
  );
}

function HeroSlider({
  images,
  interval = 4500,
}: {
  images: { src: StaticImageData; alt: string }[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={img.alt}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          sizes={sizes}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.alt}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
