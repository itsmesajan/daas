import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import HeroMedia, { type HeroMediaConfig } from "@/components/home/HeroMedia";
import exterior from "@/assets/exterior1.jpg";
import room from "@/assets/room-deluxe-real.jpg";
import pool from "@/assets/placeholders/placeholder-infinity-pool.jpg";
import banquet from "@/assets/placeholders/placeholder-banquet.jpg";
import { contact } from "@/config/site";

const imageMedia: HeroMediaConfig = {
  type: "image",
  src: exterior,
  alt: "Hotel Daaas Kathmandu, rising in Balaju",
};

const sliderMedia: HeroMediaConfig = {
  type: "slider",
  interval: 4500,
  images: [
    { src: exterior, alt: "Hotel Daaas Kathmandu exterior, rising in Balaju" },
    { src: room, alt: "A guest room at Hotel Daaas Kathmandu" },
    { src: pool, alt: "Rooftop swimming pool at Hotel Daaas Kathmandu" },
    { src: banquet, alt: "Banquet hall at Hotel Daaas Kathmandu" },
  ],
};

// Drop the file at public/video/hero.mp4 (+ optionally hero.webm) and switch
// `heroMedia` to this — poster shows instantly while the video loads.
const videoMedia: HeroMediaConfig = {
  type: "video",
  alt: "Hotel Daaas Kathmandu",
  poster: exterior,
  sources: [
    { src: "/video/hero.webm", type: "video/webm" },
    { src: "/video/hero.mp4", type: "video/mp4" },
  ],
};

const heroMedia: HeroMediaConfig = imageMedia; // <- swap to sliderMedia / videoMedia

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5 items-stretch">
          {/* Big text card */}
          <Reveal className="h-full">
            <div className="bento-card h-full p-8 md:p-12 flex flex-col justify-center">
              <span className="bento-pill w-fit mb-6">Opening November 2026</span>
              <h1 className="bento-title text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]">
                A new landmark
                <br />
                for <span className="text-accent-orange">Kathmandu</span>
              </h1>
              <p className="text-bento-ink-soft mt-6 max-w-md text-[0.95rem] leading-relaxed">
                A 4-star hotel with 81 rooms, grand banquet halls, a wellness
                floor, and rooftop dining above the skyline — rising in Balaju.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#contact" className="bento-btn">
                  Enquire Now
                  <ArrowUpRight size={15} />
                </a>
                <a href={`tel:${contact.phoneE164}`} className="bento-btn-ghost">
                  Call {contact.phone}
                </a>
              </div>
            </div>
          </Reveal>

          {/* Media card — image, video, or slider; see heroMedia above.
              min-h keeps it from collapsing on mobile, where the grid stacks
              to one column and there's no text-card height to stretch to. */}
          <Reveal delay={100} className="h-full">
            <div className="bento-card overflow-hidden relative h-full min-h-[320px]">
              <HeroMedia media={heroMedia} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
