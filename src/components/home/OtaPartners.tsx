import Image from "next/image";
import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import booking from "@/assets/OTA/booking.jpg";
import agoda from "@/assets/OTA/agoda.png";
import expedia from "@/assets/OTA/expedia.jpg";
import makemytrip from "@/assets/OTA/makemytrip.jpg";
import goibibo from "@/assets/OTA/goibibio.jpg";
import tripadvisor from "@/assets/OTA/tripadvisor.jpg";

const otas = [
  { name: "Booking.com", logo: booking },
  { name: "Agoda", logo: agoda },
  { name: "Expedia", logo: expedia },
  { name: "MakeMyTrip", logo: makemytrip },
  { name: "Goibibo", logo: goibibo },
  { name: "TripAdvisor", logo: tripadvisor },
];

export default function OtaPartners() {
  return (
    <section className="py-10 md:py-12">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal>
          <div className="bento-card flex flex-col md:flex-row items-center gap-6 md:gap-10 px-6 md:px-10 py-7">
            {/* Credibility block — the hotel's actual star category; no
                guest-review numbers exist yet since it hasn't opened. */}
            <div className="flex items-center gap-4 md:pr-10 md:border-r border-white/70 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="bento-title text-sm whitespace-nowrap">4-Star Hotel</p>
              </div>
              <p className="hidden sm:block text-bento-ink-soft text-xs leading-relaxed max-w-[200px]">
                A new 4-star landmark opening November 2026 in Balaju, Kathmandu.
              </p>
            </div>

            {/* Flat OTA logo row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-7 gap-y-4">
              {otas.map((ota) => (
                <div key={ota.name} className="relative w-10 h-10 md:w-11 md:h-11 shrink-0">
                  <Image src={ota.logo} alt={ota.name} fill sizes="44px" className="object-cover rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
