"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import type { InitDetail } from "lightgallery/lg-events";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import { ZoomIn, ImageOff } from "lucide-react";
import type { GalleryImageEntry } from "@/types";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

const INITIAL_VISIBLE = 12;
const BATCH_SIZE = 12;
const COLLAPSED_CATEGORIES = 6;

/** Deterministic mosaic pattern (index-based, not real image dimensions) — repeats every 6 tiles. */
function tileClass(i: number): string {
  const slot = i % 6;
  if (slot === 0) return "col-span-2 row-span-2";
  if (slot === 3) return "col-span-2 row-span-1";
  return "";
}

export default function GalleryGrid({ items }: { items: GalleryImageEntry[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      if (item.category) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const withAll: [string, number][] = [["All", items.length], ...sorted];
    return withAll;
  }, [items]);

  const [active, setActive] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filtered = active === "All" ? items : items.filter((i) => i.category === active);
  const visible = filtered.slice(0, visibleCount);

  const visibleCategories = showAllCategories
    ? categories
    : (() => {
        const head = categories.slice(0, COLLAPSED_CATEGORIES + 1); // +1 for "All"
        if (head.some(([name]) => name === active)) return head;
        const activeEntry = categories.find(([name]) => name === active);
        return activeEntry ? [...head, activeEntry] : head;
      })();

  function selectCategory(cat: string) {
    setActive(cat);
    setVisibleCount(INITIAL_VISIBLE);
  }

  const galleryRef = useRef<LightGalleryInstance | null>(null);
  const onInit = (detail: InitDetail) => {
    galleryRef.current = detail.instance;
  };
  const openAt = (index: number) => galleryRef.current?.openGallery(index);

  // Built from the full filtered set (not just the currently revealed page)
  // so lightbox prev/next can reach every match, not only what's on screen.
  const dynamicEl = filtered.map((item) => ({
    src: item.src,
    thumb: item.src,
    subHtml: item.title ? `<h4>${item.title}</h4>` : undefined,
  }));

  if (items.length === 0) {
    return (
      <div className="bento-card p-10 md:p-14 text-center max-w-xl mx-auto">
        <ImageOff size={28} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
        <p className="text-bento-ink-soft text-sm">No gallery images available yet.</p>
      </div>
    );
  }

  return (
    <div>
      {categories.length > 2 && (
        <div className="sticky top-20 md:top-24 z-10 -mx-4 px-4 py-3 mb-6 bg-white/70 backdrop-blur-md border-y border-white/60">
          <div className="flex flex-wrap items-center gap-2">
            {visibleCategories.map(([cat, count]) => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                aria-pressed={active === cat}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  active === cat
                    ? "bg-bento-ink text-white"
                    : "border border-white/70 bg-white/50 text-bento-ink-soft hover:bg-white/80"
                }`}
              >
                {cat} <span className="opacity-60">({count})</span>
              </button>
            ))}
            {categories.length > COLLAPSED_CATEGORIES + 1 && (
              <button
                type="button"
                onClick={() => setShowAllCategories((v) => !v)}
                className="text-xs font-semibold text-accent-orange hover:underline px-2"
              >
                {showAllCategories ? "Show less" : `Show all ${categories.length - 1}`}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-bento-ink-soft text-xs mb-4 px-1">
        Showing <span className="font-semibold text-bento-ink">{visible.length}</span> of{" "}
        <span className="font-semibold text-bento-ink">{filtered.length}</span> photos
        {active !== "All" && (
          <>
            {" "}
            in <span className="font-semibold text-bento-ink">{active}</span>
          </>
        )}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-32 sm:auto-rows-36 lg:auto-rows-44 gap-3">
        {visible.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            onClick={() => openAt(i)}
            aria-label={item.title ? `View ${item.title}` : "View photo"}
            className={`group relative overflow-hidden rounded-2xl cursor-zoom-in ${tileClass(i)}`}
          >
            <Image
              src={item.src}
              alt={item.title ?? ""}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
            <span className="absolute inset-0 bg-linear-to-t from-bento-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn size={20} className="text-white" />
            </span>
            {item.category && (
              <span className="absolute bottom-2 left-2 text-[0.65rem] font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.category}
              </span>
            )}
          </button>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-8">
          <button type="button" onClick={() => setVisibleCount((v) => v + BATCH_SIZE)} className="bento-btn-ghost">
            Show More ({filtered.length - visibleCount} left)
          </button>
        </div>
      )}

      <LightGallery onInit={onInit} dynamic dynamicEl={dynamicEl} plugins={[lgZoom, lgThumbnail]} speed={400} />
    </div>
  );
}
