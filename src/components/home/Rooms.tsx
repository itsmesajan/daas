import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { getCategoryItems } from "@/lib/data";
import { toImageUrls, htmlToPlainText } from "@/lib/images";
import { CATEGORY_IDS, business } from "@/config/site";

const tagColors = [
  "bg-amber-900/70 text-amber-100",
  "bg-sky-900/70 text-sky-100",
  "bg-emerald-900/70 text-emerald-100",
];


export default async function Rooms() {
  const rooms = await getCategoryItems(CATEGORY_IDS.rooms);
  if (rooms.length === 0) return null;

  const [first, ...rest] = rooms;
  const firstAmenities = first.amenities?.[0]?.items ?? [];
  const firstPrice = first.price && first.currency ? `${first.currency}${first.price}` : undefined;

  return (
    <section id="rooms" className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <Reveal className="mb-8 px-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="bento-pill mb-4">Accommodations</p>
            <h2 className="bento-title text-3xl md:text-4xl">Stay with us in style</h2>
          </div>
          <Link href="/rooms" className="bento-link w-fit shrink-0 mb-1 hidden sm:inline-flex">
            View all rooms
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* ── Featured hero card ── */}
          <Reveal className="md:col-span-2">
            <Link
              href={`/rooms/${first.slug}`}
              className="group block relative overflow-hidden rounded-3xl h-full"
              style={{ minHeight: 420 }}
            >
              <Image
                src={toImageUrls(first.img)[0] ?? ""}
                alt={`${first.title} at Hotel Daaas`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(min-width: 1920px) 55vw, 100vw"
                priority
              />
              {/* Gradient veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <span className="bento-pill-dark text-xs">Most Popular</span>
                {firstPrice && (
                  <span className={`text-[0.62rem] font-semibold tracking-wide px-3 py-1 rounded-full ${tagColors[0]}`}>
                    {firstPrice}
                  </span>
                )}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-white font-bold tracking-tight leading-tight text-2xl md:text-[1.85rem] mb-2">
                  {first.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-5">
                  {htmlToPlainText(first.sub_title)}
                </p>

                {/* Amenity chips */}
                {firstAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {firstAmenities.slice(0, 4).map((a) => (
                      <span
                        key={a.title}
                        className="text-[0.58rem] font-semibold tracking-wide text-white/80 border border-white/25 rounded-full px-2.5 py-0.5 bg-white/10 backdrop-blur-sm"
                      >
                        {a.title}
                      </span>
                    ))}
                    {firstAmenities.length > 4 && (
                      <span className="text-[0.58rem] font-semibold tracking-wide text-white/60 border border-white/15 rounded-full px-2.5 py-0.5 bg-white/5 backdrop-blur-sm">
                        +{firstAmenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-white border-b border-white/40 pb-0.5 transition-all duration-300 group-hover:border-accent-orange group-hover:text-accent-orange group-hover:gap-3">
                  View Room
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          </Reveal>

          {/* ── Secondary cards column ── */}
          <div className="flex flex-col gap-4 md:gap-5">
            {rest.map((room, i) => {
              const roomPrice = room.price && room.currency ? `${room.currency}${room.price}` : undefined;
              return (
              <Reveal key={room.slug} delay={100 + i * 80} className="flex-1">
                <Link
                  href={`/rooms/${room.slug}`}
                  className="group block relative overflow-hidden rounded-3xl h-full"
                  style={{ minHeight: 195 }}
                >
                  <Image
                    src={toImageUrls(room.img)[0] ?? ""}
                    alt={`${room.title} at Hotel Daaas`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1920px) 28vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Room badge */}
                  {roomPrice && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`text-[0.58rem] font-semibold tracking-wide px-3 py-1 rounded-full ${tagColors[(i + 1) % tagColors.length]}`}
                      >
                        {roomPrice}
                      </span>
                    </div>
                  )}

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold text-base leading-tight mb-1">{room.title}</h3>
                        <p className="text-white/65 text-[0.7rem] leading-relaxed line-clamp-2">
                          {room.sub_title}
                        </p>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center transition-all duration-300 group-hover:bg-accent-orange group-hover:border-accent-orange">
                        <ArrowUpRight size={13} className="text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
              );
            })}
          </div>
        </div>

        {/* Mobile CTA */}
        <Reveal delay={200} className="mt-6 flex justify-center sm:hidden">
          <Link href="/rooms" className="bento-link w-fit">
            View all rooms
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
