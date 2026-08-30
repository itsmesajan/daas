"use client";

import Image from "next/image";
import { ArrowUpRight, BedDouble } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import imgDeluxe from "@/assets/room-deluxe-real.jpg";
import imgSuite from "@/assets/placeholders/placeholder-room-suite.jpg";
import { roomCategories, roomAmenities } from "@/data/hotel";

const images: Record<string, typeof imgDeluxe> = {
  "Deluxe Room": imgDeluxe,
  "Jr. Suite Room": imgSuite,
  "Suite Room": imgSuite,
};

const tagColors = [
  "bg-amber-900/70 text-amber-100",
  "bg-sky-900/70 text-sky-100",
  "bg-emerald-900/70 text-emerald-100",
];

export default function Rooms() {
  const [first, ...rest] = roomCategories;

  return (
    <section id="rooms" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-8 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Accommodations</p>
            <h2 className="bento-title text-3xl md:text-4xl">Stay with us in style</h2>
          </div>
          <a href="#contact" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            Book a room
            <ArrowUpRight size={14} />
          </a>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* ── Featured hero card ── */}
          <Reveal className="md:col-span-2">
            <a
              href="#contact"
              className="group block relative overflow-hidden rounded-3xl h-full"
              style={{ minHeight: 420 }}
            >
              <Image
                src={images[first.name]}
                alt={`${first.name} at Hotel Daaas`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(min-width: 768px) 55vw, 100vw"
                priority
              />
              {/* Gradient veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="bento-pill-dark text-xs">Most Popular</span>
                <span className={`text-[0.62rem] font-semibold tracking-wide px-3 py-1 rounded-full ${tagColors[0]}`}>
                  {first.count} Rooms
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-white font-bold tracking-tight leading-tight text-2xl md:text-[1.85rem] mb-2">
                  {first.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-5">
                  {first.description}
                </p>

                {/* Amenity chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {roomAmenities.slice(0, 4).map((a) => (
                    <span
                      key={a}
                      className="text-[0.58rem] font-semibold tracking-wide text-white/80 border border-white/25 rounded-full px-2.5 py-0.5 bg-white/10 backdrop-blur-sm"
                    >
                      {a}
                    </span>
                  ))}
                  <span className="text-[0.58rem] font-semibold tracking-wide text-white/60 border border-white/15 rounded-full px-2.5 py-0.5 bg-white/5 backdrop-blur-sm">
                    +{roomAmenities.length - 4} more
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-white border-b border-white/40 pb-0.5 transition-all duration-300 group-hover:border-accent-orange group-hover:text-accent-orange group-hover:gap-3">
                  Enquire &amp; Book
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </a>
          </Reveal>

          {/* ── Secondary cards column ── */}
          <div className="flex flex-col gap-4 md:gap-5">
            {rest.map((room, i) => (
              <Reveal key={room.name} delay={100 + i * 80} className="flex-1">
                <a
                  href="#contact"
                  className="group block relative overflow-hidden rounded-3xl h-full"
                  style={{ minHeight: 195 }}
                >
                  <Image
                    src={images[room.name]}
                    alt={`${room.name} at Hotel Daaas`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 28vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Room count badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-[0.58rem] font-semibold tracking-wide px-3 py-1 rounded-full ${tagColors[i + 1]}`}>
                      {room.count} Rooms
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold text-base leading-tight mb-1">
                          {room.name}
                        </h3>
                        <p className="text-white/65 text-[0.7rem] leading-relaxed line-clamp-2">
                          {room.description}
                        </p>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center transition-all duration-300 group-hover:bg-accent-orange group-hover:border-accent-orange">
                        <ArrowUpRight size={13} className="text-white" />
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <Reveal delay={200} className="mt-6 flex justify-center sm:hidden">
          <a href="#contact" className="bento-link w-fit">
            Book a room
            <ArrowUpRight size={14} />
          </a>
        </Reveal>

        {/* Amenities strip */}
        {/* <Reveal delay={180} className="mt-6 px-0">
          <div className="bento-card p-5 md:p-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-bento-ink-soft text-[0.72rem] font-semibold tracking-wide mr-2">
              <BedDouble size={14} className="text-accent-orange" />
              All rooms include:
            </span>
            {roomAmenities.map((a) => (
              <span key={a} className="bento-pill !py-1 !text-[0.62rem]">{a}</span>
            ))}
          </div>
        </Reveal> */}
      </div>
    </section>
  );
}
