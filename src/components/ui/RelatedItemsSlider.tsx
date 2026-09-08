"use client";

import { useId, type ReactNode } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

export interface RelatedItem {
  slug: string;
  title: string;
  image: StaticImageData;
  /** Overlay badge, top-right of the image — matches the listing page's card. */
  badge?: string;
  description?: string;
  features?: { icon?: ReactNode; label: string }[];
  ctaLabel?: string;
}

export default function RelatedItemsSlider({
  items,
  basePath,
  heading,
}: {
  items: RelatedItem[];
  basePath: string;
  heading: string;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const prevClass = `related-prev-${rawId}`;
  const nextClass = `related-next-${rawId}`;

  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="bento-title text-2xl">{heading}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            className={`${prevClass} flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/60 text-bento-ink backdrop-blur-sm transition-colors hover:bg-white`}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Next"
            className={`${nextClass} flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/60 text-bento-ink backdrop-blur-sm transition-colors hover:bg-white`}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        spaceBetween={20}
        slidesPerView={1.15}
        breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: items.length > 2 ? 3 : items.length } }}
        className="!pb-1"
      >
        {items.map((item) => (
          <SwiperSlide key={item.slug}>
            <Link href={`${basePath}/${item.slug}`} className="group block h-full overflow-hidden bento-card">
              <div className="relative h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {item.badge && <span className="absolute top-4 right-4 bento-pill-dark text-xs">{item.badge}</span>}
              </div>
              <div className="p-5 md:p-6">
                <h3 className="bento-title text-lg mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-bento-ink-soft text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                )}
                {item.features && item.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.features.map((f) => (
                      <span key={f.label} className="flex items-center gap-1.5 bento-pill !py-1 !text-[0.6rem]">
                        {f.icon}
                        {f.label}
                      </span>
                    ))}
                  </div>
                )}
                <span className="bento-link">
                  {item.ctaLabel ?? "View"}
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
