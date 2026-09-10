"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, ExternalLink, Loader2 } from "lucide-react";

interface ResolvedVideoEmbed {
  src: string;
  platform: string;
  /** Portrait (reels/Shorts/TikTok) vs landscape (a regular YouTube video). */
  portrait: boolean;
}

function isFacebookReel(pathname: string) {
  return /\/(reel|share\/r)\//.test(pathname);
}

/**
 * The CMS can receive either a normal share/watch-page link OR a link an
 * editor already copied from a platform's own "Embed" option — this must
 * produce a working iframe src either way, without double-wrapping an
 * already-embeddable URL. Instagram, Facebook and TikTok block framing
 * their normal pages, so a share link needs converting to that platform's
 * dedicated embed endpoint; an already-embed link should pass through
 * untouched.
 */
function resolveVideoEmbed(rawSrc: string): ResolvedVideoEmbed {
  let url: URL;
  try {
    url = new URL(rawSrc);
  } catch {
    return { src: rawSrc, platform: "Video", portrait: false };
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtube.com" || host === "youtu.be") {
    const shortsMatch = url.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch) {
      return {
        src: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&playsinline=1`,
        platform: "YouTube",
        portrait: true,
      };
    }

    if (url.pathname === "/watch" && url.searchParams.get("v")) {
      return {
        src: `https://www.youtube.com/embed/${url.searchParams.get("v")}?autoplay=1&mute=1&playsinline=1`,
        platform: "YouTube",
        portrait: false,
      };
    }

    if (url.searchParams.has("autoplay")) {
      return { src: rawSrc, platform: "YouTube", portrait: false };
    }
    const sep = rawSrc.includes("?") ? "&" : "?";
    return {
      src: `${rawSrc}${sep}autoplay=1&mute=1&playsinline=1`,
      platform: "YouTube",
      portrait: false,
    };
  }

  if (host === "instagram.com") {
    if (/\/embed\/?$/.test(url.pathname)) {
      return { src: rawSrc, platform: "Instagram", portrait: true };
    }
    const path = url.pathname.replace(/\/$/, "");
    return {
      src: `https://www.instagram.com${path}/embed`,
      platform: "Instagram",
      portrait: true,
    };
  }

  if (host === "facebook.com" || host === "fb.watch") {
    if (url.pathname === "/plugins/video.php") {
      const href = url.searchParams.get("href");
      return {
        src: rawSrc,
        platform: "Facebook",
        portrait: href ? isFacebookReel(href) : true,
      };
    }
    const plugin = new URL("https://www.facebook.com/plugins/video.php");
    plugin.searchParams.set("href", rawSrc);
    plugin.searchParams.set("show_text", "false");
    plugin.searchParams.set("autoplay", "true");
    plugin.searchParams.set("mute", "1");
    return {
      src: plugin.toString(),
      platform: "Facebook",
      portrait: isFacebookReel(url.pathname),
    };
  }

  if (host === "tiktok.com") {
    if (/^\/embed\/v2\//.test(url.pathname)) {
      return { src: rawSrc, platform: "TikTok", portrait: true };
    }
    const match = url.pathname.match(/\/video\/(\d+)/);
    if (match) {
      return {
        src: `https://www.tiktok.com/embed/v2/${match[1]}`,
        platform: "TikTok",
        portrait: true,
      };
    }
  }

  // Unknown platform — best-effort, iframe the URL as given.
  return { src: rawSrc, platform: "Video", portrait: false };
}

const SESSION_KEY = "daaas-promo-popup-seen";

export default function Popup({ popupData }: { popupData?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const swiperRef = useRef<SwiperType | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Flatten all popup items into a single array of slides
  const allSlides = useMemo(() => {
    if (!popupData || !Array.isArray(popupData)) return [];

    return popupData.flatMap((popup) => {
      if (!popup.items || !Array.isArray(popup.items)) return [];

      return popup.items.map((item: any) => ({
        ...item,
        popupType: popup.type, // "image" or "video"
      }));
    });
  }, [popupData]);

  useEffect(() => {
    if (allSlides.length === 0) return;

    // Once per browser tab session — repeat visits to the homepage
    // shouldn't keep re-interrupting with the same promo.
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage unavailable (e.g. private mode) — fall back to
      // always showing rather than never showing.
    }

    // Delay opening so the popup doesn't compete with the hero.
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [allSlides]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore — worst case it can reopen next visit
    }
  }, []);

  // Send focus into the dialog for keyboard/screen-reader users.
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  // Escape to close, arrow keys to navigate.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
      else if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      else if (e.key === "ArrowRight") swiperRef.current?.slideNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closePopup]);

  if (allSlides.length === 0) return null;

  const hasMultipleSlides = allSlides.length > 1;

  const navBtnBase =
    "absolute top-1/2 z-10 -translate-y-1/2 flex size-9 sm:size-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/70 text-bento-ink backdrop-blur-sm transition-colors hover:bg-white shadow-md";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-bento-ink/70 backdrop-blur-sm px-3"
          onClick={closePopup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="presentation"
        >
          {/* Fixed responsive width — each slide's own content sets the
              height (images via their natural size, video via aspect
              ratio), and Swiper's autoHeight animates the container
              between them. */}
          <motion.div
            key="popup-container"
            className="relative mx-auto w-full max-w-[440px] lg:max-w-[500px] max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-white/70 bg-white/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(16,24,40,0.4)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Promotional offer"
          >
            <button
              ref={closeBtnRef}
              className="absolute top-3 right-3 z-50 flex size-9 sm:size-10 cursor-pointer items-center justify-center rounded-full bg-bento-ink/50 text-white backdrop-blur-md transition-colors hover:bg-bento-ink/80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              onClick={closePopup}
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              loop={hasMultipleSlides}
              autoHeight
              className="w-full"
            >
              {allSlides.map((content: any, index: number) => {
                const isImage = content.popupType === "image";
                const linkHref = content.link ? `/${content.link}` : "#";
                const imgSrc = isImage && content.imglink && content.imglink.length > 0 ? content.imglink[0].url : "";
                const videoEmbed = !isImage && content.src ? resolveVideoEmbed(content.src) : null;
                const isActiveSlide = index === activeIndex;
                const isVideoLoaded = loadedVideos.has(index);

                return (
                  <SwiperSlide key={index} className="w-full bg-white">
                    {isImage ? (
                      <Link href={linkHref} className="group block w-full relative">
                        <Image
                          src={imgSrc}
                          alt={content.title || "Promotional offer"}
                          width={800}
                          height={800}
                          priority={index === 0}
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 440px, 500px"
                          className="w-full h-auto"
                        />
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-t from-bento-ink/70 to-transparent text-white text-xs sm:text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                          <span className="truncate">{content.title}</span>
                          <span className="shrink-0 inline-flex items-center gap-1 text-accent-orange">
                            View <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </span>
                      </Link>
                    ) : videoEmbed ? (
                      <div className="w-full bg-bento-ink flex flex-col items-center">
                        <div
                          className={`relative w-full bg-bento-ink ${
                            videoEmbed.portrait ? "max-w-[280px] mx-auto aspect-9/16" : "aspect-video"
                          }`}
                        >
                          {isActiveSlide && (
                            <>
                              {!isVideoLoaded && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-bento-ink">
                                  <Loader2 className="w-6 h-6 animate-spin text-accent-orange" />
                                </div>
                              )}
                              <iframe
                                src={videoEmbed.src}
                                title={content.title || `${videoEmbed.platform} video`}
                                className="size-full relative z-0"
                                frameBorder="0"
                                allow="autoplay; fullscreen; encrypted-media"
                                allowFullScreen
                                onLoad={() =>
                                  setLoadedVideos((prev) => {
                                    const next = new Set(prev);
                                    next.add(index);
                                    return next;
                                  })
                                }
                              />
                            </>
                          )}
                        </div>
                        <a
                          href={content.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-bento-ink-soft hover:text-accent-orange transition-colors"
                        >
                          Watch on {videoEmbed.platform} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : null}
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {hasMultipleSlides && (
              <>
                <button className={`${navBtnBase} left-2`} onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous slide">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className={`${navBtnBase} right-2`} onClick={() => swiperRef.current?.slideNext()} aria-label="Next slide">
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-1.5 py-3 bg-white" role="tablist" aria-label="Slide selection">
                  {allSlides.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={`Go to slide ${i + 1} of ${allSlides.length}`}
                      onClick={() => swiperRef.current?.slideToLoop(i)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        i === activeIndex ? "w-5 bg-accent-orange" : "w-1.5 bg-bento-ink/20 hover:bg-bento-ink/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
