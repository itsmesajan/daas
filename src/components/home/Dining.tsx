"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin, Clock, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import dining from "@/assets/placeholders/placeholder-dining.jpg";
import lobby from "@/assets/placeholders/placeholder-lobby.jpg";
import rooftopLounge from "@/assets/placeholders/placeholder-rooftop-lounge.jpg";
import { diningVenues } from "@/data/hotel";

const images: Record<string, { src: typeof dining; alt: string }> = {
  "Coffee Shop": { src: dining, alt: "Coffee Shop at Hotel Daaas" },
  "Specialty Restaurant": { src: lobby, alt: "Specialty Restaurant at Hotel Daaas" },
  Lounge: { src: rooftopLounge, alt: "Rooftop Lounge at Hotel Daaas" },
};

export default function Dining() {
  const [index, setIndex] = useState(0);
  const venue = diningVenues[index];

  return (
    <section id="dining" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-8 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Dining &amp; Rooftop</p>
            <h2 className="bento-title text-3xl md:text-4xl">Above the city skyline</h2>
          </div>
          <a href="#contact" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            Make a reservation
            <ArrowUpRight size={14} />
          </a>
        </Reveal>

        {/* Venue selector cards */}
        <Reveal delay={160} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {diningVenues.map((v, i) => {
            const isActive = i === index;
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View ${v.name}`}
                className={`group relative text-left rounded-2xl p-4 border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange ${
                  isActive
                    ? "bg-white/70 border-accent-orange/40 shadow-[0_4px_24px_rgba(235,144,34,0.12)]"
                    : "bg-white/35 border-gray-200 hover:bg-white/55 hover:border-gray-500"
                }`}
              >
                {/* Active left accent bar */}
                <div
                  className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-all duration-300 ${
                    isActive ? "bg-accent-orange opacity-100" : "bg-accent-orange opacity-0"
                  }`}
                />

                <div className="flex items-start gap-3 pl-1">
                  {/* Number circle */}
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-accent-orange text-white"
                        : "bg-white/60 text-bento-ink-soft group-hover:bg-white/90"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-[0.82rem] font-semibold leading-snug mb-1.5 transition-colors duration-200 ${isActive ? "text-bento-ink" : "text-bento-ink-soft group-hover:text-bento-ink"}`}>
                      {v.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bento-pill !py-0.5 !text-[0.55rem] !px-2">
                        {v.cuisine}
                      </span>
                      <span className="text-bento-ink-soft text-[0.6rem]">{v.seats}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </Reveal>

        {/* Main immersive card */}
        <Reveal delay={100}>
          <div className="bento-card overflow-hidden relative min-h-[480px] md:min-h-[560px]">
            {/* Full-bleed background images with crossfade */}
            <div className="absolute inset-0">
              {diningVenues.map((v, i) => {
                const img = images[v.name];
                return (
                  <div
                    key={v.name}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out ${i === index ? "scale-100" : "scale-105"}`}
                      sizes="(min-width: 768px) 80vw, 100vw"
                      priority={i === 0}
                    />
                  </div>
                );
              })}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/30 to-transparent" style={{ zIndex: 2 }} />
            </div>

            {/* Venue progress dots — top right */}
            <div className="absolute top-5 right-5 flex items-center gap-1.5" style={{ zIndex: 3 }}>
              {diningVenues.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to venue ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === index
                      ? "w-5 h-1.5 bg-accent-orange"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            {/* Floating frosted-glass info panel — bottom-left */}
            <div className="absolute bottom-0 left-0 right-0 md:right-auto md:max-w-[460px] p-5 md:p-7" style={{ zIndex: 3 }}>
              <div className="backdrop-blur-xl bg-white/12 border border-white/20 rounded-2xl p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.28)]">

                {/* Cuisine pill */}
                <div key={`pill-${index}`} className="animate-fade-in-up">
                  <p className="bento-pill !bg-white/20 !border-white/30 text-white w-fit mb-3">
                    {venue.cuisine}
                  </p>
                </div>

                {/* Name */}
                <div key={`name-${index}`} className="animate-fade-in-up" style={{ animationDelay: "40ms" }}>
                  <h3
                    className="text-white font-bold tracking-tight leading-tight mb-3"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 1.85rem)" }}
                  >
                    {venue.name}
                  </h3>
                </div>

                {/* Description */}
                <div key={`desc-${index}`} className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
                  <p className="text-white/75 text-[0.82rem] leading-relaxed mb-5">
                    {venue.description}
                  </p>
                </div>

                {/* Meta details — frosted chips */}
                <div key={`meta-${index}`} className="animate-fade-in-up flex flex-wrap gap-2 mb-6" style={{ animationDelay: "120ms" }}>
                  <span className="flex items-center gap-1.5 text-white/85 text-[0.68rem] font-medium bg-white/10 border border-white/15 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Users size={11} className="text-accent-orange shrink-0" />
                    {venue.seats}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/85 text-[0.68rem] font-medium bg-white/10 border border-white/15 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Clock size={11} className="text-accent-orange shrink-0" />
                    {venue.timing}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/85 text-[0.68rem] font-medium bg-white/10 border border-white/15 rounded-full px-3 py-1 backdrop-blur-sm">
                    <MapPin size={11} className="text-accent-orange shrink-0" />
                    Hotel Daaas, Ktm
                  </span>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-white border-b border-white/50 pb-0.5 transition-all duration-300 hover:border-accent-orange hover:text-accent-orange hover:gap-3"
                >
                  Enquire &amp; Reserve
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile CTA */}
        <Reveal delay={200} className="mt-6 flex justify-center sm:hidden">
          <a href="#contact" className="bento-link w-fit">
            Make a reservation
            <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
