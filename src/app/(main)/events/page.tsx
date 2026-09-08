import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Maximize2, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { banquetSpaces } from "@/data/hotel";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("events", {}, "/events");
}

export default function EventsPage() {
  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Banquet &amp; Events</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Grand Occasions, Perfectly Hosted</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Three event spaces for weddings, conferences, and executive gatherings.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {banquetSpaces.map((space, i) => (
            <Reveal key={space.slug} delay={i * 80}>
              <Link href={`/events/${space.slug}`} className="group block bento-card overflow-hidden h-full">
                <div className="relative h-56">
                  <Image
                    src={space.images[0]}
                    alt={space.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-4 right-4 bento-pill-dark text-xs">{space.size}</span>
                </div>
                <div className="p-5 md:p-6">
                  <h2 className="bento-title text-lg mb-2">{space.name}</h2>
                  <p className="text-bento-ink-soft text-sm leading-relaxed mb-4 line-clamp-2">
                    {space.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1.5 bento-pill !py-1 !text-[0.6rem]">
                      <Maximize2 size={11} className="text-accent-orange" />
                      {space.size}
                    </span>
                    <span className="flex items-center gap-1.5 bento-pill !py-1 !text-[0.6rem]">
                      <Users size={11} className="text-accent-orange" />
                      {space.capacity}
                    </span>
                  </div>
                  <span className="bento-link">
                    View Space
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
