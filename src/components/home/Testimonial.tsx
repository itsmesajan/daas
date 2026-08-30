"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/data/hotel";
import booking from "@/assets/OTA/booking.jpg";
import tripadvisor from "@/assets/OTA/tripadvisor.jpg";

const AUTOPLAY_MS = 6000;

// Attribution is by review platform, not name — see the PLACEHOLDER note on
// `testimonials` in @/data/hotel for why there's no reviewer identity yet.
const sourceMeta: Record<string, { label: string; logo: ReactNode }> = {
  google: {
    label: "Google",
    logo: <i className="fa-brands fa-google text-[#4285F4] text-sm" aria-hidden="true" />,
  },
  booking: {
    label: "Booking.com",
    logo: (
      <span className="relative block h-4 w-4">
        <Image src={booking} alt="" fill sizes="16px" className="rounded-sm object-contain" />
      </span>
    ),
  },
  tripadvisor: {
    label: "Tripadvisor",
    logo: (
      <span className="relative block h-4 w-4">
        <Image src={tripadvisor} alt="" fill sizes="16px" className="rounded-sm object-contain" />
      </span>
    ),
  },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction >= 0 ? -32 : 32 }),
};

export default function Testimonial() {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;

  const go = useCallback(
    (dir: number) => setSlide(([i]) => [(i + dir + total) % total, dir]),
    [total]
  );

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduceMotion, total, go]);

  const active = testimonials[index];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-8 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Guest Experience</p>
          <h2 className="bento-title text-3xl md:text-4xl mb-3">What Our Guests Are Saying</h2>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            A few words from the people who&apos;ve stayed with us.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="relative max-w-7xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Ambient color so the glass card has something to refract */}
            <div className="bento-glow-orange w-56 h-56 -top-12 -left-12 opacity-25" aria-hidden="true" />
            <div className="bento-glow-blue w-56 h-56 -bottom-12 -right-12 opacity-20" aria-hidden="true" />

            {/* Glass quote badge, floating above the card edge */}
            <div
              aria-hidden="true"
              className="absolute -top-6 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-[0_10px_24px_-10px_rgba(16,24,40,0.35),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md backdrop-saturate-150"
            >
              <Quote size={20} className="text-accent-orange" strokeWidth={1.75} />
            </div>

            <div className="bento-card relative overflow-hidden px-6 pt-12 pb-10 md:px-14 md:pt-14 md:pb-12 min-h-70 flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial={reduceMotion ? false : "enter"}
                  animate="center"
                  exit={reduceMotion ? undefined : "exit"}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  drag={total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_event, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                  className="relative z-10 flex w-full flex-col items-center gap-5 text-center cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < active.rating
                            ? "fill-accent-orange text-accent-orange"
                            : "text-bento-ink-soft/30"
                        }
                      />
                    ))}
                  </div>
                  <p className="font-display italic text-lg md:text-xl leading-relaxed text-bento-ink max-w-xl h-28 md:h-32 overflow-y-auto px-1">
                    &ldquo;{active.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-sm">
                      {sourceMeta[active.source].logo}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-bento-ink">via {sourceMeta[active.source].label}</p>
                      <p className="text-xs text-bento-ink-soft mt-0.5">{active.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => go(-1)}
                  className="absolute left-2 sm:-left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/50 text-bento-ink shadow-[0_18px_40px_-16px_rgba(16,24,40,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:scale-110 hover:border-accent-orange/50 hover:bg-white/70 hover:text-accent-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => go(1)}
                  className="absolute right-2 sm:-right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/50 text-bento-ink shadow-[0_18px_40px_-16px_rgba(16,24,40,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:scale-110 hover:border-accent-orange/50 hover:bg-white/70 hover:text-accent-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.source + i}
                      type="button"
                      aria-label={`Show testimonial ${i + 1}`}
                      aria-current={i === index}
                      onClick={() => setSlide([i, i > index ? 1 : -1])}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-accent-orange" : "w-1.5 bg-bento-ink/20 hover:bg-bento-ink/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
