"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Waves, Dumbbell, Sparkles, Scissors, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import sauna from "@/assets/placeholders/placeholder-sauna.jpg";
import gym from "@/assets/placeholders/placeholder-gym.jpg";
import pool from "@/assets/placeholders/placeholder-infinity-pool.jpg";

const tabIconMap: Record<string, React.ElementType> = {
  "Sauna & Steam": Sparkles,
  fitness: Dumbbell,
  swimming: Waves,
  Restaurant: ChevronRight,
  Jacuzzi: Waves,
  "Hair Salon": Scissors,
};

const tabs = [
  {
    key: "Sauna & Steam",
    label: "Sauna & Steam",
    title: "Sauna & Steam",
    desc: "Unwind and restore balance with our jacuzzi, sauna and steam room — a dedicated wellness floor built for slowing down.",
    image: sauna,
    alt: "Sauna at the Hotel Daaas wellness floor",
    highlights: ["Jacuzzi", "Sauna Room", "Steam Room", "Wellness Floor"],
  },
  {
    key: "fitness",
    label: "Fitness",
    title: "Fitness Center",
    desc: "A fully equipped gym open daily for guests, whatever your training routine looks like while you're away from home.",
    image: gym,
    alt: "Fitness center at Hotel Daaas",
    highlights: ["Cardio Machines", "Free Weights", "Open Daily", "Expert Staff"],
  },
  {
    key: "swimming",
    label: "Swimming",
    title: "Swimming Pool",
    desc: "Relax and unwind at our swimming pool, set above the Kathmandu skyline for a swim with a view.",
    image: pool,
    alt: "Swimming pool at Hotel Daaas",
    highlights: ["Skyline Views", "Heated Pool", "Towel Service", "Sunbeds"],
  },
  {
    key: "Restaurant",
    label: "Restaurant",
    title: "Restaurant",
    desc: "Our in-house specialty restaurant celebrates traditional Newari cuisine in an intimate, refined setting.",
    image: pool,
    alt: "Restaurant at Hotel Daaas",
    highlights: ["Newari Cuisine", "Private Dining", "Chef's Table", "All-Day Menu"],
  },
  {
    key: "Jacuzzi",
    label: "Jacuzzi",
    title: "Jacuzzi",
    desc: "Soak away the day in our private jacuzzi — warm, relaxing, and perfectly secluded.",
    image: sauna,
    alt: "Jacuzzi at Hotel Daaas",
    highlights: ["Hydrotherapy", "Private Bay", "Heated Jets", "Towel Service"],
  },
  {
    key: "Hair Salon",
    label: "Hair Salon",
    title: "Hair Salon",
    desc: "Look and feel your best with professional in-house salon services tailored to your style.",
    image: gym,
    alt: "Hair salon at Hotel Daaas",
    highlights: ["Cuts & Styling", "Color Services", "Treatments", "By Appointment"],
  },
] as const;

export default function WellnessExperiences() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>(tabs[0].key);
  const tab = tabs.find((t) => t.key === active)!;
  const Icon = tabIconMap[active] ?? Sparkles;

  return (
    <section id="wellness" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-6 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Wellness Experiences</p>
            <h2 className="bento-title text-3xl md:text-4xl">Spa, fitness &amp; swimming</h2>
          </div>
          <a href="#contact" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            Enquire
            <ArrowUpRight size={14} />
          </a>
        </Reveal>

        {/* Scrollable pill tab strip */}
        <Reveal delay={60} className="mb-5 px-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {tabs.map((t) => {
              const isActive = active === t.key;
              const TabIcon = tabIconMap[t.key] ?? Sparkles;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={`relative flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-[0.72rem] font-semibold tracking-wide transition-all duration-300 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange ${
                    isActive
                      ? "bg-bento-ink text-white border-bento-ink"
                      : "bg-white/50 text-bento-ink-soft border-white/80 hover:bg-white/80 hover:text-bento-ink"
                  }`}
                >
                  <TabIcon size={11} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Panel */}
        <Reveal delay={100}>
          <div className="bento-card overflow-hidden grid grid-cols-1 md:grid-cols-[1.35fr_1fr] items-stretch">
            {/* Image with crossfade */}
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.key}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                >
                  <Image
                    src={tab.image}
                    alt={tab.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 55vw, 100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info panel */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                      <Icon size={14} className="text-accent-orange" />
                    </div>
                    <p className="bento-pill !text-[0.62rem]">{tab.label}</p>
                  </div>

                  <h3 className="bento-title text-2xl md:text-[1.75rem] mb-4">{tab.title}</h3>
                  <p className="text-bento-ink-soft text-sm leading-relaxed mb-6">{tab.desc}</p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-8">
                    {tab.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-[0.78rem] text-bento-ink font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="bento-link w-fit">
                    Enquire
                    <ArrowUpRight size={14} />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Mobile CTA */}
        <Reveal delay={160} className="mt-6 flex justify-center sm:hidden">
          <a href="#contact" className="bento-link w-fit">
            Enquire
            <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

