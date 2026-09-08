import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Star, PartyPopper, CalendarDays, MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import { buildMetadata } from "@/lib/metadata";
import { findArticleBySlug } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { site, address, business, links } from "@/config/site";
import { banquetSpaces, highlights, nearbyLocations } from "@/data/hotel";

export async function generateMetadata(): Promise<Metadata> {
  const about = await findArticleBySlug("about-us");
  return buildMetadata(
    "about",
    { title: about.meta_title || `About Us | ${site.name}`, description: about.meta_description || site.description },
    "/about-us"
  );
}

export default async function AboutUsPage() {
  const about = await findArticleBySlug("about-us");
  const images = resolveHeroImages(about);

  const stats = [
    { icon: BedDouble, value: business.numberOfRooms, label: "Rooms" },
    { icon: Star, value: `${business.starRating}★`, label: "Rating" },
    { icon: PartyPopper, value: banquetSpaces.length, label: "Banquet Spaces" },
    { icon: CalendarDays, value: "2026", label: "Opening Year" },
  ];

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">About Us</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">{about.title}</h1>
          {about.sub_title && <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">{about.sub_title}</p>}
        </Reveal>

        {images.length > 0 && (
          <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140 mb-5">
            <ImageGallery images={images} alt={about.title} />
          </Reveal>
        )}

        {/* Story + fact sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
          <Reveal delay={100} className="bento-card p-6 md:p-10 h-full">
            {about.description && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed [&_p]:mb-4 [&_h6]:font-semibold [&_h6]:text-bento-ink [&_h6]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: about.description }}
              />
            )}
          </Reveal>

          <Reveal delay={140} className="bento-card p-6 md:p-8 h-full flex flex-col gap-6">
            <div>
              <p className="bento-pill w-fit mb-4">At a Glance</p>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/50 border border-white/70 p-4 text-center">
                    <stat.icon size={16} className="text-accent-orange mx-auto mb-2" strokeWidth={1.75} />
                    <p className="bento-title text-xl md:text-2xl">{stat.value}</p>
                    <p className="text-bento-ink-soft text-[0.68rem] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/70">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-bento-ink-soft/70 mb-2">Address</p>
              <p className="text-sm text-bento-ink flex items-start gap-2">
                <MapPin size={15} className="text-accent-orange shrink-0 mt-0.5" />
                {address.full}
              </p>
              <a
                href={address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-link !text-xs mt-3"
              >
                Get Directions
                <ArrowUpRight size={12} />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Highlights strip */}
        <Reveal delay={180} className="mt-10 text-center px-2">
          <p className="bento-pill mx-auto w-fit mb-4">What Awaits You</p>
          <h2 className="bento-title text-2xl md:text-3xl mb-8">Designed For Every Stay</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={200 + i * 60}>
              <Link
                href={`/service/${item.slug}`}
                className="group bento-card p-4 h-full text-center flex flex-col items-center hover:border-accent-orange/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-accent-orange/15 group-hover:border-accent-orange/35">
                  <i className={`${item.icon} text-accent-orange text-sm`} aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-bento-ink leading-snug">{item.title}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Location context */}
        <Reveal delay={260} className="mt-10 bento-card p-6 md:p-10">
          <p className="bento-pill w-fit mb-4">The Valley</p>
          <h2 className="bento-title text-2xl md:text-3xl mb-3">Perfectly Placed in Balaju</h2>
          <p className="text-bento-ink-soft text-sm leading-relaxed max-w-2xl mb-5">
            Set in Balaju, Kathmandu, Hotel Daaas keeps the valley&apos;s heritage and natural beauty within
            easy reach. Distances shown are approximate.
          </p>
          <div className="flex flex-wrap gap-2">
            {nearbyLocations.map((loc) => (
              <span key={loc.name} className="bento-pill !py-1.5">
                {loc.name} · {loc.distance}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Closing CTA */}
        <Reveal delay={300} className="mt-10 bento-card p-8 md:p-12 text-center">
          <h2 className="bento-title text-2xl md:text-3xl mb-3">Experience Hotel Daaas</h2>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto mb-6">
            Opening November 2026 in Balaju, Kathmandu — get in touch to learn more or plan your stay.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={links.booking} className="bento-btn">
              Get in Touch
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/rooms" className="bento-btn-ghost">
              Explore Rooms
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
