import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Star,
  PartyPopper,
  CalendarDays,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import { buildMetadata } from "@/lib/metadata";
import { findArticleById, getPackageCategories } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { site, address, business, links, ARTICLE_IDS } from "@/config/site";
import { banquetSpaces, roomCategories, diningVenues } from "@/data/hotel";
import imgExterior1 from "@/assets/exterior1.jpg";
import { fetchAPI } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const about = await findArticleById(ARTICLE_IDS.aboutUs);
  return buildMetadata(
    "about",
    { title: about.meta_title || `About Us | ${site.name}`, description: about.meta_description || site.description },
    "/about-us"
  );
}

export default async function AboutUsPage() {
  const [about, packages, nearbyLocations] = await Promise.all([
    findArticleById(ARTICLE_IDS.aboutUs),
    getPackageCategories(),
    fetchAPI<any[]>("nearby"),
  ]);
  const nearby = nearbyLocations ?? [];
  const images = resolveHeroImages(about, imgExterior1.src);

  const stats = [
    { icon: BedDouble, value: business.numberOfRooms, label: "Rooms & Suites" },
    { icon: Star, value: `${business.starRating}★`, label: "Luxury Rating" },
    { icon: PartyPopper, value: banquetSpaces.length, label: "Banquet Spaces" },
    { icon: CalendarDays, value: "2026", label: "Grand Opening" },
  ];

  const highlightsList = [
    `${roomCategories.length} Premium Room Categories`,
    `${diningVenues.length} Exquisite Dining Venues`,
    "State-of-the-art Wellness Floor",
    "Panoramic Rooftop Swimming Pool",
    "Tailored Event & Wedding Spaces",
  ];

  // Copy stays curated here (it summarises a whole category, not one item —
  // "81 rooms across 3 categories" isn't any single package's own data), but
  // each photo prefers the live CMS package via the same findCategoryItem +
  // resolveHeroImages path the /rooms, /dining, /events detail pages use —
  // so a photo update in the CMS shows up here too, with the local shot as
  // a guaranteed fallback while that slug isn't live yet.
const offerings = packages.map((item:any) => ({
  title: item.title,
  slug: `/${item.slug}`,
  image:
    item.banner_img?.[0]?.url ||
    item.fb_img ||
    "/images/placeholder.jpg",
  label:
    item.slug === "rooms"
      ? "Stay"
      : item.slug === "events"
      ? "Celebrate"
      : item.slug === "dining"
      ? "Dine"
      : "Explore",
  description: item.description,
}));



  return (
    <section className="pt-28 md:pt-36 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="bento-glow-orange w-[500px] h-[500px] -top-[200px] -right-[200px]" />
      <div className="bento-glow-blue w-[600px] h-[600px] top-[40%] -left-[300px]" />

      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4 relative z-10">

        {/* Header Section */}
        <Reveal className="mb-14 px-2 text-center flex flex-col items-center">
          <p className="bento-pill mx-auto w-fit mb-6 shadow-sm border-white/50 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
            {about.sub_title}
          </p>
          <h1 className="bento-title text-4xl md:text-6xl lg:text-7xl mb-6 max-w-4xl tracking-tight leading-[1.1]">
            {about.title}
          </h1>
        </Reveal>

        {/* Hero Gallery */}
        {images.length > 0 && (
          <Reveal className="relative rounded-[2rem] overflow-hidden bento-card shadow-2xl h-96 md:h-[500px] lg:h-[600px] mb-8 lg:mb-12 border-white/40">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
            <ImageGallery images={images} alt={about.title} />
          </Reveal>
        )}

        {/* Story + Highlights Grid — the CMS `content` field (normalised to
            `description`, see normaliseArticle) is already a full styled
            recreation of this section, so drop it in verbatim when the live
            article has it; otherwise fall back to the coded layout below,
            which uses real-time business stats instead of frozen HTML. */}
        {about.description ? (
          <div dangerouslySetInnerHTML={{ __html: about. description }} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">

            {/* Main Story Content */}
            <Reveal delay={100} className="lg:col-span-8 bento-card p-8 md:p-12 h-full bg-white/60">
              <h2 className="text-2xl md:text-3xl font-bold font-sans text-bento-ink mb-6 pb-6 border-b border-bento-ink/10">
                A New Benchmark in Kathmandu
              </h2>
                <p
                  className="text-bento-ink-soft text-[0.95rem] md:text-base leading-loose
                  [&_p]:mb-6 [&_p:last-child]:mb-0
                  [&_h6]:font-bold [&_h6]:text-bento-ink [&_h6]:text-lg [&_h6]:mt-8 [&_h6]:mb-3
                  [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:my-6
                  [&_li]:relative [&_li]:pl-6 [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:bg-accent-orange [&_li]:before:rounded-full"
                >Hotel Daaas Kathmandu is a new 4-star hotel in Balaju, Kathmandu, offering 81 rooms, grand banquet halls, a wellness floor, all-day and Newari specialty dining, opening November 2026.</p>

              <div className="mt-8 pt-8 border-t border-bento-ink/10">
                <h3 className="font-bold text-bento-ink text-lg mb-3">Our Vision</h3>
                <p className="text-bento-ink-soft text-[0.95rem] md:text-base leading-loose mb-4">
                  Hotel Daaas Kathmandu is being built around a simple idea — that a stay in Balaju should feel
                  effortless and comfortable, whether you&apos;re here for a weekend in the valley, a family
                  celebration, or a week of back-to-back meetings.
                </p>
                <p className="text-bento-ink-soft text-[0.95rem] md:text-base leading-loose">
                  Every space, from {business.numberOfRooms} rooms across {roomCategories.length} categories to the
                  wellness floor and {diningVenues.length} dining venues, is designed to work together — so getting
                  ready for the day, hosting a client, or unwinding after sightseeing never means leaving the
                  building.
                </p>
              </div>
            </Reveal>

            {/* Quick Facts Sidebar */}
            <Reveal delay={150} className="lg:col-span-4 flex flex-col gap-6">
              {/* Stats Bento */}
              <div className="bento-card p-6 md:p-8 bg-white/40 backdrop-blur-xl">
                <p className="bento-kicker mb-5 border-b border-bento-ink/10 pb-3">At a Glance</p>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/60 border border-white/80 text-center shadow-sm hover:shadow-md transition-shadow">
                      <stat.icon size={22} className="text-accent-orange mb-3" strokeWidth={1.5} />
                      <p className="bento-title text-xl md:text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-bento-ink-soft text-[0.7rem] uppercase tracking-wider font-semibold">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Bento */}
              <div className="bento-card p-6 md:p-8 flex-1 bg-white/40 backdrop-blur-xl">
                <p className="bento-kicker mb-5 border-b border-bento-ink/10 pb-3">The Experience</p>
                <ul className="space-y-4">
                  {highlightsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-bento-ink-soft font-medium">
                      <CheckCircle2 size={18} className="text-accent-blue shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        )}

        {/* What We Offer — visual showcase */}
        <Reveal className="mt-12 mb-8 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">What Awaits You</p>
          <h2 className="bento-title text-2xl md:text-4xl mb-3">Everything Under One Roof</h2>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            From your room to the table to the dance floor — a closer look at what Hotel Daaas brings together.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {offerings.map((offer:any, i:any) => (
            <Reveal key={offer.title} delay={i * 80}>
              <Link
                href={offer.slug}
                className="group block relative overflow-hidden rounded-3xl h-full"
                style={{ minHeight: 320 }}
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="bento-pill-dark text-xs">{offer.label}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-2">{offer.title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed mb-4">{offer.description}</p>
                  <div className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-white border-b border-white/40 pb-0.5 transition-all duration-300 group-hover:border-accent-orange group-hover:text-accent-orange group-hover:gap-3">
                    Explore
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Location & CTA Section */}
        <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal delay={200} className="bento-card p-8 md:p-10 flex flex-col justify-center !bg-bento-ink text-white relative overflow-hidden group">
            <Image
              src={imgExterior1}
              alt=""
              fill
              className="object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="relative z-10">
              <p className="text-accent-orange font-bold text-xs uppercase tracking-widest mb-3">Location</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Find Us in Balaju</h3>
              <p className="text-white/80 text-sm mb-5 flex items-start gap-2 max-w-sm">
                <MapPin size={18} className="text-accent-orange shrink-0 mt-0.5" />
                {address.full}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {nearby.slice(0, 3).map((loc:any) => (
                  <span key={loc.name} className="text-[0.65rem] font-semibold tracking-wide text-white/80 border border-white/20 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm">
                    {loc.title} · {loc.distance}
                  </span>
                ))}
              </div>
              <a href={address.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent-orange transition-colors">
                Get Directions <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={250} className="bento-card p-8 md:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-white/80 to-white/40">
            <h2 className="bento-title text-2xl md:text-3xl mb-4">Experience Hotel Daaas</h2>
            <p className="text-bento-ink-soft text-sm max-w-sm mx-auto mb-8">
              Opening November 2026 in Balaju, Kathmandu — get in touch to learn more or plan your stay.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={links.booking} className="bento-btn shadow-lg shadow-bento-ink/20">
                Get in Touch
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/rooms" className="bento-btn-ghost bg-white/50 hover:bg-white/80">
                Explore Rooms
              </Link>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
