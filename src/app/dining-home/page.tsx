import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import {
  ArrowUpRight,
  Check,
  ChefHat,
  Clock,
  Coffee,
  Download,
  Phone,
  Soup,
  Sparkles,
  UtensilsCrossed,
  Users,
  Mail,
  MapPin,
  Wine,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getCategoryItems, getSiteRegulars, getGalleryImages, getSocialGroup } from "@/lib/data";
import { resolveHeroImages, toImageUrls } from "@/lib/images";
import { CATEGORY_IDS, SITE_URL, SITE_FALLBACK, address } from "@/config/site";

// The restaurant's live menu + online ordering, hosted on Rojai (the CMS
// vendor's own menu/ordering product) — there's no separate in-house system.
const MENU_URL = "https://www.menu.rojai.com/restaurant/BjiHWi";

// PLACEHOLDER — Hotel Daaas has no PDF menu of its own yet. Using the sibling
// Courtyard property's PDF for now; swap this for the real file once one exists.
const MENU_PDF_URL = "https://www.courtyard.thamelhotel.com/courtyard-menu.pdf";

const NAV_LINKS = [
  { href: "#restaurants", label: "Restaurants" },
  { href: "#cuisine", label: "Our Cuisine" },
  { href: "#gallery", label: "Gallery" },
  { href: "#menu", label: "Menu" },
];

// Purely decorative per-venue icon, picked by slug — no claim beyond "what
// kind of spot is this at a glance"; anything unrecognised just gets the
// generic fork-and-knife icon.
const VENUE_ICON: Record<string, typeof ChefHat> = {
  "newari-restaurant": ChefHat,
  "rooftop-restaurant": Wine,
  "coffee-shop": Coffee,
};

const MAX_VISIBLE_AMENITIES = 5;

export const metadata: Metadata = {
  title: "Dining | Hotel Daaas Kathmandu",
  description: "Hotel Daaas Kathmandu's restaurants, cuisine, gallery and menu — order online or scan the QR code at your table.",
};

/**
 * Single-page dining microsite — served on the `dining.` subdomain (see
 * src/proxy.ts, which rewrites any request on that host to this route
 * regardless of path). Lives outside (main) on purpose: not a page within
 * the hotel's multi-page site, but a standalone one-pager with its own
 * header/footer, built to the same bento-glass visual standard as the main
 * homepage — hero, venues, cuisine, gallery, then the ordering menu.
 */
export default async function DiningHomePage() {
  const [venues, siteRegulars, galleryImages, socialLinks, qrCode] = await Promise.all([
    getCategoryItems(CATEGORY_IDS.restaurant),
    getSiteRegulars(),
    getGalleryImages(),
    getSocialGroup(1),
    QRCode.toDataURL(MENU_URL, { width: 220, margin: 1 }),
  ]);

  const logoUrl = siteRegulars?.logo_upload || "";
  const siteName = siteRegulars?.sitename || SITE_FALLBACK.name;
  const phone = siteRegulars?.contact_info || SITE_FALLBACK.phone;
  const email = siteRegulars?.email_address || SITE_FALLBACK.email;
  const fiscalAddress = siteRegulars?.fiscal_address || address.full;

  const diningGallery = galleryImages.filter((g) => g.category === "Restaurant & Bar");

  const heroVenue = venues.find((v) => v.slug === "rooftop-restaurant") || venues[0];
  const heroImage = heroVenue ? toImageUrls(heroVenue.img)[0] : undefined;

  return (
    <div className="min-h-screen bento-bg flex flex-col">
      {/* ── Header ── */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card px-4 sm:px-5 md:px-7 h-16 flex items-center gap-2 justify-between">
          <a href="/" aria-label={`Back to ${siteName}`} className="relative block shrink-0">
            {logoUrl && <Image src={logoUrl} alt={siteName} width={1500}
              height={1500}
              className="w-[160px] sm:w-[300px] lg:w-[240px] h-auto max-h-10 sm:max-h-12object-contain object-left" priority />}
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8rem] font-medium px-3 py-2 rounded-full text-bento-ink-soft hover:text-bento-ink hover:bg-white/70 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#menu" className="bento-btn !py-2.5 !px-4 text-sm shrink-0">
            Order Online
            <UtensilsCrossed size={14} />
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative w-full h-[70vh] sm:h-screen min-h-[460px] overflow-hidden bg-black text-white">
          {heroImage && (
            <Image src={heroImage} alt={heroVenue?.title || "Dining at Hotel Daaas"} fill priority className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="bento-pill mb-6 bg-black/40 border border-white/20 text-white/90 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm tracking-wide uppercase font-medium">
              Dining at {siteName}
            </span>
            <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] max-w-3xl text-balance drop-shadow-md">
              A Taste of Kathmandu, Elevated
            </h1>
            <p className="mt-5 text-white/80 text-base sm:text-lg max-w-xl text-balance leading-relaxed drop-shadow">
              Newari heritage, rooftop skyline views, and all-day multi-cuisine dining — three restaurants, one table
              for every craving.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#menu" className="bento-btn bg-accent-orange hover:bg-amber-600 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors">
                View Menu & Order
                <ArrowUpRight size={15} />
              </a>
              <a
                href="#restaurants"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Explore Restaurants
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          {/* ── Restaurants ── */}
          {venues.length > 0 && (
            <section id="restaurants" className="pt-20 pb-16 scroll-mt-20">
              <Reveal className="mb-10 text-center">
                <p className="bento-pill mx-auto w-fit mb-4">Our Restaurants</p>
                <h2 className="bento-title text-3xl md:text-4xl mb-3">Three Spaces, One Address</h2>
                <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
                  Whether it's a quiet coffee, an authentic Newari feast, or dinner above the skyline — find your spot.
                </p>
              </Reveal>

              <div className="flex flex-col gap-6">
                {venues.map((venue, i) => {
                  const images = resolveHeroImages(venue, venue.fb_img);
                  const reverse = i % 2 === 1;
                  const VenueIcon = VENUE_ICON[venue.slug] ?? UtensilsCrossed;
                  const amenities = venue.amenities?.[0]?.items ?? [];
                  const visibleAmenities = amenities.slice(0, MAX_VISIBLE_AMENITIES);
                  const hiddenAmenityCount = amenities.length - visibleAmenities.length;

                  return (
                    <Reveal key={venue.slug} delay={i * 80}>
                      <div className="group bento-card p-5 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-stretch transition-shadow duration-300 hover:shadow-[0_24px_60px_-20px_rgba(16,24,40,0.25)]">
                        {images.length > 0 && (
                          <div
                            className={`relative rounded-2xl overflow-hidden h-64 lg:h-96 ${reverse ? "lg:order-2" : ""}`}
                          >
                            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                              <ImageGallery images={images} alt={venue.title} />
                            </div>

                            {/* Quick-glance badges — decorative venue-type icon + hours,
                                so the headline fact is readable before scrolling to the
                                chip row below. */}
                            <div className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 pointer-events-none">
                              <VenueIcon size={17} className="text-white" />
                            </div>
                            {venue.breakfast && (
                              <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-[0.7rem] font-semibold text-white bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full pointer-events-none">
                                <Clock size={11} />
                                {venue.breakfast}
                              </span>
                            )}
                          </div>
                        )}
                        <div className={`flex flex-col justify-center ${reverse ? "lg:order-1" : ""}`}>
                          <h3 className="bento-title text-2xl mb-2">{venue.title}</h3>
                          {venue.sub_title && (
                            <p className="font-display italic text-bento-ink-soft text-sm mb-3">{venue.sub_title}</p>
                          )}
                          {venue.description && (
                            <div
                              className="text-bento-ink-soft text-sm leading-relaxed mb-4 [&_p]:mb-2"
                              dangerouslySetInnerHTML={{ __html: venue.description }}
                            />
                          )}

                          {venue.lunch && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-bento-ink-soft bg-bento-ink/5 px-3 py-1.5 rounded-full w-fit mb-4">
                              <Users size={12} className="text-accent-orange" />
                              {venue.lunch}
                            </span>
                          )}

                          {visibleAmenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {visibleAmenities.map((a) => (
                                <span
                                  key={a.title}
                                  className="flex items-center gap-1.5 text-[0.7rem] font-medium text-bento-ink-soft bg-white/60 border border-white/70 px-2.5 py-1.5 rounded-full"
                                >
                                  {a.img ? (
                                    <span className="relative h-3.5 w-3.5 shrink-0 inline-block">
                                      <Image src={a.img} alt="" fill className="object-contain" sizes="14px" unoptimized />
                                    </span>
                                  ) : (
                                    <Check size={11} className="text-accent-orange shrink-0" />
                                  )}
                                  {a.title}
                                </span>
                              ))}
                              {hiddenAmenityCount > 0 && (
                                <span className="flex items-center text-[0.7rem] font-medium text-bento-ink-soft/70 px-2.5 py-1.5">
                                  +{hiddenAmenityCount} more
                                </span>
                              )}
                            </div>
                          )}

                          <a href="#menu" className="bento-link w-fit text-sm">
                            View Menu & Order
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── About Our Cuisine ── */}
          <section id="cuisine" className="pt-4 pb-16 scroll-mt-20">
            <Reveal className="bento-card p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                <div className="md:text-right">
                  <p className="bento-pill mb-4 md:ml-auto">Our Cuisine</p>
                  <h2 className="bento-title text-2xl md:text-3xl mb-3">Rooted in Tradition, Open to the World</h2>
                  <p className="text-bento-ink-soft text-sm leading-relaxed">
                    From the time-honored flavors of authentic Newari cooking to an all-day multi-cuisine menu and
                    rooftop favorites above the Kathmandu skyline, every plate at Hotel Daaas is built on quality
                    ingredients and genuine hospitality.
                  </p>
                </div>

                <div className="hidden md:block w-px h-32 bg-bento-ink/10" aria-hidden="true" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                      <ChefHat size={18} className="text-accent-orange" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-bento-ink">Newari Heritage</p>
                      <p className="text-bento-ink-soft text-xs">Authentic Kathmandu Valley specialties</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                      <Soup size={18} className="text-accent-orange" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-bento-ink">All-Day Multi-Cuisine</p>
                      <p className="text-bento-ink-soft text-xs">Local and international favorites, any hour</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                      <Sparkles size={18} className="text-accent-orange" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-bento-ink">Rooftop Experience</p>
                      <p className="text-bento-ink-soft text-xs">Signature drinks above the city skyline</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── Gallery ── */}
          {diningGallery.length > 0 && (
            <section id="gallery" className="pb-16 scroll-mt-20">
              <Reveal className="mb-8 text-center">
                <p className="bento-pill mx-auto w-fit mb-4">Gallery</p>
                <h2 className="bento-title text-3xl md:text-4xl mb-3">A Closer Look</h2>
              </Reveal>
              <Reveal delay={80}>
                <GalleryGrid items={diningGallery} />
              </Reveal>
            </section>
          )}

          {/* ── Menu / Order ── */}
          <section id="menu" className="pb-20 scroll-mt-20">
            <Reveal className="mb-8 text-center">
              <p className="bento-pill mx-auto w-fit mb-4">Menu</p>
              <h2 className="bento-title text-3xl md:text-4xl mb-3">Order Online or Scan to Order</h2>
              <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
                Browse the full menu below, order online, or scan the QR code at your table.
              </p>
            </Reveal>

            <Reveal delay={80} className="">
              <div className="bento-card overflow-hidden h-140 md:h-180">
                <iframe src={MENU_URL} title={`${siteName} menu`} className="w-full h-full border-0" loading="lazy" />
              </div>
            </Reveal>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-4 pb-6">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card px-6 sm:px-10 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b border-white/70">
            <div>
              <a href={SITE_URL} className="relative block h-10 w-32 mb-4">
                {logoUrl && <Image src={logoUrl} alt={siteName} fill className="object-contain object-left" />}
              </a>
              <p className="text-bento-ink-soft text-sm leading-relaxed max-w-sm">
                Newari heritage, rooftop skyline dining, and all-day multi-cuisine favorites — the dining experience
                at {siteName}.
              </p>
              {socialLinks?.items?.length > 0 && (
                <div className="flex items-center gap-2.5 mt-5">
                  {socialLinks.items.map((item: any, i: number) => (
                    <a
                      key={i}
                      href={item?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item?.title || "Social media link"}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/50 border border-white/70 text-bento-ink-soft hover:text-white hover:bg-accent-orange hover:border-accent-orange transition-colors"
                    >
                      {item?.image ? (
                        <Image src={item.image} alt={item?.title || ""} width={16} height={16} />
                      ) : (
                        <i className={`${item?.icon} text-sm`} aria-hidden="true" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {venues.some((v) => v.breakfast) && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-3">
                  Opening Hours
                </p>
                <ul className="flex flex-col gap-2.5 text-sm text-bento-ink-soft">
                  {venues.map(
                    (venue) =>
                      venue.breakfast && (
                        <li key={venue.slug} className="flex items-start gap-2.5">
                          <Clock size={14} className="text-accent-orange shrink-0 mt-0.5" />
                          <span>
                            <span className="text-bento-ink font-medium">{venue.title}:</span> {venue.breakfast}
                          </span>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 text-sm text-bento-ink-soft">
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 hover:text-bento-ink transition-colors">
                <Phone size={14} className="text-accent-orange shrink-0" />
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 hover:text-bento-ink transition-colors break-all">
                <Mail size={14} className="text-accent-orange shrink-0" />
                {email}
              </a>
              <span className="flex items-start gap-2.5">
                <MapPin size={14} className="text-accent-orange shrink-0 mt-0.5" />
                {fiscalAddress}
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-bento-ink-soft/70 pt-6">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
