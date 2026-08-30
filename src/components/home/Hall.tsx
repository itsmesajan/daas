"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Users, Maximize2, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import banquet from "@/assets/placeholders/placeholder-banquet.jpg";
import lobby from "@/assets/placeholders/placeholder-lobby.jpg";
import rooftopLounge from "@/assets/placeholders/placeholder-rooftop-lounge.jpg";
import { banquetSpaces } from "@/data/hotel";

const banquetImages = [banquet, lobby, rooftopLounge];

// Capacity in pax derived from sq.ft (approximate)
const capacities = ["Up to 500 pax", "Up to 450 pax", "Up to 20 pax"];
const types = ["Wedding · Gala · Conference", "Reception · Gala · Dinner", "Executive · Boardroom"];

export default function Hall() {
  const [index, setIndex] = useState(0);
  const space = banquetSpaces[index];

  return (
    <section id="events" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-8 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Banquet &amp; Events</p>
            <h2 className="bento-title text-3xl md:text-4xl">Grand occasions, perfectly hosted</h2>
          </div>
          <a href="#contact" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            Plan your event
            <ArrowUpRight size={14} />
          </a>
        </Reveal>

        {/* Split layout */}
        <Reveal delay={80}>
          <div className="bento-card overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_420px] min-h-[540px]">

            {/* ── Left: crossfading image panel ── */}
            <div className="relative min-h-[280px] md:min-h-0">
              <AnimatePresence mode="sync">
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                >
                  <Image
                    src={banquetImages[index]}
                    alt={`${space.name} at Hotel Daaas`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Active space name overlaid on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <p className="text-white/60 text-[0.65rem] font-semibold tracking-widest uppercase mb-1">
                      {types[index]}
                    </p>
                    <h3
                      className="text-white font-bold tracking-tight leading-tight"
                      style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
                    >
                      {space.name}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right: stacked space selector ── */}
            <div className="flex flex-col p-4 md:p-6 bg-white/20 backdrop-blur-2xl border-l border-white/20">
              {/* Top label */}
              <div className="pb-4 px-2">
                <p className="text-[0.7rem] font-bold tracking-widest uppercase text-bento-ink-soft/80">
                  Select a space
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {banquetSpaces.map((s, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Select ${s.name}`}
                      className={`group text-left px-5 py-4 flex items-start gap-4 transition-all duration-300 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange ${
                        isActive
                          ? "bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 scale-[1.02] z-10"
                          : "bg-white/10 border border-white/10 hover:bg-white/30 hover:border-white/30 hover:scale-[1.01]"
                      }`}
                    >
                      {/* Number */}
                      <div
                        className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold transition-all duration-300 shadow-sm ${
                          isActive
                            ? "bg-accent-blue text-white shadow-accent-blue/30"
                            : "bg-white/50 backdrop-blur-sm text-bento-ink-soft group-hover:bg-white/80 group-hover:text-bento-ink"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name + arrow */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className={`text-[0.9rem] font-bold leading-snug transition-colors duration-200 ${isActive ? "text-bento-ink" : "text-bento-ink-soft group-hover:text-bento-ink"}`}>
                            {s.name.split(" \u2014 ")[0]}
                            {s.name.includes("\u2014") && (
                              <span className="ml-1 text-bento-ink-soft/70 font-medium text-[0.75rem]">
                                — {s.name.split(" \u2014 ")[1]}
                              </span>
                            )}
                          </p>
                          <ChevronRight
                            size={16}
                            className={`shrink-0 transition-all duration-300 ${
                              isActive ? "text-accent-orange translate-x-1" : "text-bento-ink-soft/50 group-hover:text-bento-ink-soft/80 group-hover:translate-x-0.5"
                            }`}
                          />
                        </div>

                        {/* Capacity + area chips */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className="flex items-center gap-1.5 text-[0.65rem] text-bento-ink-soft font-semibold bg-white/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/50">
                            <Maximize2 size={10} className="text-accent-orange" />
                            {s.size}
                          </span>
                          <span className="flex items-center gap-1.5 text-[0.65rem] text-bento-ink-soft font-semibold bg-white/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/50">
                            <Users size={10} className="text-accent-orange" />
                            {capacities[i]}
                          </span>
                        </div>

                        {/* Description — only when active */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <p className="text-bento-ink-soft/90 text-[0.75rem] leading-relaxed mb-4 pt-2">
                                {s.description}
                              </p>
                              <a
                                href="#contact"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-blue/10 text-[0.75rem] font-bold text-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Enquire &amp; Book
                                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom filler */}
              <div className="flex-1" />
            </div>
          </div>
        </Reveal>

        {/* Mobile CTA */}
        <Reveal delay={200} className="mt-6 flex justify-center sm:hidden">
          <a href="#contact" className="bento-link w-fit">
            Plan your event
            <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}


