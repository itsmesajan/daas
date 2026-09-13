"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import NavLink from "@/components/layout/NavLink";
import Reveal from "@/components/ui/Reveal";
import type { SlideShowGroup } from "@/types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

export interface HeroClientProps {
  slideshow?: SlideShowGroup[];
}

/** Extract YouTube Video ID from various URL formats */
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/** Clean up relative or double-slash links returned by CMS (e.g. "//events" -> "/events") */
function cleanLink(url?: string): string {
  if (!url) return "#";
  let clean = url.trim();
  if (clean.startsWith("//")) clean = "/" + clean.replace(/^\/+/, "");
  return clean;
}

/** Sanitize CMS HTML string or raw description to plain text */
function cleanText(text?: string): string {
  if (!text) return "";
  return text.replace(/[\r\n\t]+/g, " ").trim();
}

export default function HeroClient({ slideshow = [] }: HeroClientProps) {
  // Accessibility check for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Swiper & Video state
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract items by media type from CMS slideshow
  const getMediaItems = (type: "image" | "video") => {
    return slideshow?.find((group) => group.mediaType === type)?.items || [];
  };

  const imageItems = getMediaItems("image");
  const videoItems = getMediaItems("video");

  const videoItem = videoItems[0];
  const youtubeId = getYouTubeId(videoItem?.src);
  const isDirectVideo = !youtubeId && videoItem?.src;

  // Mode decision: Video mode if a video exists in CMS, otherwise Slider mode
  const showVideo = !!videoItem && !!videoItem.src;
  const showCarousel = !showVideo && imageItems.length > 0;

  // If no CMS media exists, return null
  if (!showVideo && !showCarousel) {
    return null;
  }

  const sliderImages = imageItems.map((item) => ({
    src: item.src,
    title: item.title,
    buttonLink: item.buttonLink,
    text: item.text,
    linktype: item.linktype,
    description: item.description,
    tagline: item.tagline,
  }));

  const activeSlide = sliderImages[activeIndex] || sliderImages[0];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // ---------------------------------------------------------------------------
  // 1. VIDEO MODE (Cinematic Full-Width Hero UI)
  // ---------------------------------------------------------------------------
  if (showVideo) {
    const videoTitle = videoItem?.title && videoItem.title.trim() !== "Hero" ? videoItem.title : "";
    const videoDesc = cleanText(videoItem?.description);
    const videoCtaLink = cleanLink(videoItem?.buttonLink);
    const videoCtaText = videoItem?.text || "Explore More";
    const hasVideoText = Boolean(
      videoItem?.tagline ||
        videoTitle ||
        videoDesc ||
        (videoCtaLink && videoCtaLink !== "#")
    );

    return (
      <section id="home" className="relative w-full h-[85vh] sm:h-screen min-h-[550px] overflow-hidden bg-black text-white">
        {/* Background Media */}
        <div className="absolute inset-0 w-full h-full">
          {youtubeId ? (
            <div className="relative w-full h-full overflow-hidden pointer-events-none scale-125 sm:scale-110">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${
                    isMuted ? 1 : 0
                  }&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&playsinline=1`}
                  className="absolute inset-0 w-full h-full object-cover"
                  allow="autoplay; encrypted-media"
                  title={videoItem?.title || "Hero video"}
                />
              ) : (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span className="text-white/60 text-sm">Video Paused</span>
                </div>
              )}
            </div>
          ) : isDirectVideo ? (
            <video
              ref={videoRef}
              autoPlay={!prefersReducedMotion}
              muted={isMuted}
              loop={!prefersReducedMotion}
              playsInline
              preload="metadata"
              className="object-cover w-full h-full"
              aria-label="Hero video"
            >
              <source src={isDirectVideo} type="video/webm" />
              {isDirectVideo.endsWith(".mp4") && (
                <source src={isDirectVideo} type="video/mp4" />
              )}
            </video>
          ) : null}

          {/* Dark Gradient Overlay - Only rendered if there is text content */}
          {hasVideoText && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
          )}

          {/* Foreground Text Content */}
          {hasVideoText && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <div className="max-w-4xl mx-auto flex flex-col items-center">
                {videoItem?.tagline && (
                  <span className="bento-pill mb-6 bg-black/40 border border-white/20 text-white/90 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm tracking-wide uppercase font-medium">
                    {videoItem.tagline}
                  </span>
                )}

                {videoTitle && (
                  <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] max-w-4xl text-balance drop-shadow-md">
                    {videoTitle}
                  </h1>
                )}

                {videoDesc && (
                  <p className="mt-5 text-white/80 text-base sm:text-lg lg:text-xl font-normal max-w-2xl text-balance leading-relaxed drop-shadow">
                    {videoDesc}
                  </p>
                )}

                {videoCtaLink && videoCtaLink !== "#" && (
                  <div className="mt-8">
                    <NavLink
                      href={videoCtaLink}
                      linktype={videoItem?.linktype}
                      className="bento-btn bg-accent-orange hover:bg-amber-600 text-white shadow-lg hover:shadow-orange-500/20 px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-all duration-300 font-medium"
                    >
                      {videoCtaText}
                      <ArrowUpRight className="w-4 h-4" />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Controls */}
          <div className="absolute bottom-8 right-6 sm:right-10 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-80">
            <span className="text-white/50 text-[0.65rem] tracking-[0.3em] uppercase font-medium">
              Scroll
            </span>
            <div className="w-0.5 h-7 bg-gradient-to-b from-white/70 via-white/30 to-transparent animate-bounce rounded-full" />
          </div>
        </div>

        <h2 className="sr-only">
          {videoTitle || "Hotel Daaas Kathmandu"}
        </h2>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. SLIDER / IMAGE MODE (Bento Box Grid UI)
  // ---------------------------------------------------------------------------
  const currentTitle = activeSlide?.title || "";
  const currentDesc = cleanText(activeSlide?.description);
  const currentCtaLink = cleanLink(activeSlide?.buttonLink);
  const currentCtaText = activeSlide?.text || "Explore More";
  const currentTagline = activeSlide?.tagline || "Opening November 2026";

  return (
    <section id="home" className="relative pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5 items-stretch lg:h-[520px]">
          {/* Big Text Bento Card */}
          <Reveal className="h-[340px] sm:h-[420px] lg:h-full">
            <div className="bento-card h-full p-6 sm:p-8 md:p-12 flex flex-col justify-center overflow-hidden">
              <span className="bento-pill w-fit mb-4 sm:mb-6 shrink-0">
                {currentTagline}
              </span>

              {currentTitle && (
                <h1 className="bento-title text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] leading-[1.15] line-clamp-2 shrink-0">
                  {currentTitle}
                </h1>
              )}

              {currentDesc && (
                <p className="text-bento-ink-soft mt-4 sm:mt-6 max-w-md text-[0.9rem] sm:text-[0.95rem] leading-relaxed line-clamp-3 shrink-0">
                  {currentDesc}
                </p>
              )}

              {currentCtaLink && currentCtaLink !== "#" && (
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 shrink-0">
                  <NavLink
                    href={currentCtaLink}
                    linktype={activeSlide?.linktype}
                    className="bento-btn inline-flex items-center gap-2"
                  >
                    {currentCtaText}
                    <ArrowUpRight size={15} />
                  </NavLink>
                </div>
              )}
            </div>
          </Reveal>

          {/* Media Slider Bento Card */}
          <div className="bento-card overflow-hidden relative h-[280px] sm:h-[340px] lg:h-full group">
            <Swiper
              modules={[Autoplay, EffectFade, Navigation]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={1200}
              loop={sliderImages.length > 1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                const nav = swiper.params.navigation;
                if (nav && typeof nav !== "boolean") {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              allowTouchMove={true}
              className="w-full h-full"
            >
              {sliderImages.map((img, idx) => (
                <SwiperSlide key={idx} className="w-full h-full relative">
                  <Image
                    src={img.src}
                    alt={img.title || "Hero image"}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(min-width: 1024px) 35vw, 90vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows */}
            {sliderImages.length > 1 && (
              <>
                <button
                  ref={prevRef}
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/70 text-bento-ink backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  ref={nextRef}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/70 text-bento-ink backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Slide Counter Badge */}
                <div className="absolute bottom-4 right-4 z-30 font-mono text-[0.7rem] tracking-wider text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-bold text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
                  <span className="opacity-40"> / </span>
                  <span>{String(sliderImages.length).padStart(2, "0")}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="sr-only">
        {currentTitle || "Hotel Daaas Kathmandu"}
      </h2>
    </section>
  );
}
