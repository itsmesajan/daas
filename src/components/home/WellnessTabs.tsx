"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Waves, Dumbbell, Sparkles, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import type { WellnessTabItem } from "@/types";

const tabIconMap: Record<string, React.ElementType> = {
  "sauna-steam": Sparkles,
  gym: Dumbbell,
  "swimming-pool": Waves,
  jacuzzi: Waves,
  "hair-salon": Scissors,
};

export default function WellnessTabs({ tabs }: { tabs: WellnessTabItem[] }) {
  if (!tabs || tabs.length === 0) return null;

  const [active, setActive] = useState(tabs[0].slug);
  const tab = tabs.find((t) => t.slug === active) ?? tabs[0];
  const Icon = tabIconMap[tab.slug] ?? Sparkles;
  const imageSrc = tab.image;

  return (
    <section id="wellness" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-6 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Wellness Experiences</p>
            <h2 className="bento-title text-3xl md:text-4xl">Spa, fitness &amp; swimming</h2>
          </div>
          <Link href="/facilities#wellness" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            View all facilities
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        {/* Scrollable pill tab strip */}
        <Reveal delay={60} className="mb-5 px-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {tabs.map((t) => {
              const isActive = active === t.slug;
              const TabIcon = tabIconMap[t.slug] ?? Sparkles;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setActive(t.slug)}
                  className={`relative flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-[0.72rem] font-semibold tracking-wide transition-all duration-300 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange ${
                    isActive
                      ? "bg-bento-ink text-white border-bento-ink"
                      : "bg-white/50 text-bento-ink-soft border-white/80 hover:bg-white/80 hover:text-bento-ink"
                  }`}
                >
                  {/* <TabIcon size={11} /> */}
                  {t.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Panel */}
        <Reveal delay={100}>
          <div className={`bento-card overflow-hidden grid grid-cols-1 ${imageSrc ? "md:grid-cols-[1.35fr_1fr]" : ""} items-stretch`}>
            {/* Image with crossfade if imageSrc present */}
            {imageSrc && (
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  >
                    <Image
                      src={imageSrc}
                      alt={tab.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 55vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Info panel */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    {/* <div className="w-8 h-8 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                      <Icon size={14} className="text-accent-orange" />
                    </div> */}
                    <p className="bento-pill !text-[0.62rem]">{tab.label}</p>
                  </div>

                  <h3 className="bento-title text-2xl md:text-[1.75rem] mb-4">{tab.title}</h3>

                  {/* CMS rich-text content from API */}
                  <div dangerouslySetInnerHTML={{ __html: tab.contentHtml }} />

                  <Link href={`/service/${tab.slug}`} className="bento-link w-fit">
                    View Details
                    <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Mobile CTA */}
        <Reveal delay={160} className="mt-6 flex justify-center sm:hidden">
          <Link href="/facilities#wellness" className="bento-link w-fit">
            View all facilities
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
