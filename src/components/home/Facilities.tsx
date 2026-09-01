"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Waves, Dumbbell, Sparkles, Bell, Plane, ArrowUpRight, type LucideIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import hotelIllustration from "@/assets/hotel-illustration.png";
import { banquetSpaces, highlights } from "@/data/hotel";

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  waves: Waves,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  bell: Bell,
  plane: Plane,
};



function HighlightItem({
  item,
  delay,
  reverse,
}: {
  item: (typeof highlights)[number];
  delay: number;
  reverse?: boolean;
}) {
  const Icon = iconMap[item.icon];
  return (
    <Reveal delay={delay} className="w-full">
      <div
        className={`bento-card flex items-center gap-4 p-4 md:p-5 group hover:border-accent-orange/30 transition-colors ${
          reverse ? "flex-row-reverse text-right" : ""
        }`}
      >
        <div className="w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center transition-all duration-300 group-hover:bg-accent-orange/15 group-hover:border-accent-orange/35">
          <Icon size={17} className="text-accent-orange" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-bento-ink">{item.title}</p>
          <p className="text-xs text-bento-ink-soft mt-0.5 leading-snug">{item.desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Facilities() {
  const [index, setIndex] = useState(0);
  const space = banquetSpaces[index];
  const left = highlights.slice(0, 3);
  const right = highlights.slice(3);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <div className="mb-8 px-2 scroll-mt-24">
          <Reveal className="text-center mb-10">
            <p className="bento-pill mx-auto w-fit mb-4">At A Glance</p>
            <h2 className="bento-title text-3xl md:text-4xl">Everything Under One Roof</h2>
            <p className="text-bento-ink-soft text-sm mt-3 max-w-md mx-auto">Every amenity, every experience — steps from your room.</p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center max-w-[1050px] mx-auto">
            <div className="order-2 lg:order-1 flex flex-col gap-4 w-full">
              {left.map((item, i) => (
                <HighlightItem key={item.title} item={item} delay={i * 80} reverse />
              ))}
            </div>

            <Reveal delay={120} className="order-1 lg:order-2 flex justify-center relative py-4">
              <div className="bento-glow-orange w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
              <Image
                src={hotelIllustration}
                alt="Illustration of Hotel Daaas Kathmandu"
                className="relative w-60 sm:w-72 md:w-80 h-auto"
                priority={false}
              />
            </Reveal>

            <div className="order-3 flex flex-col gap-4 w-full">
              {right.map((item, i) => (
                <HighlightItem key={item.title} item={item} delay={100 + i * 80} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
