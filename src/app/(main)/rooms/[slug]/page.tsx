import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, Info, PawPrint, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import BookingWidget from "@/components/rooms/BookingWidget";
import ImageGallery from "@/components/ui/ImageGallery";
import AmenitiesGroups from "@/components/ui/AmenitiesGroups";
import FaqAccordion from "@/components/ui/FaqAccordion";
import RelatedItemsSlider from "@/components/ui/RelatedItemsSlider";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { CATEGORY_IDS, SITE_URL, business } from "@/config/site";
import { roomCategories, roomAmenities, policies } from "@/data/hotel";

export async function generateStaticParams() {
  return roomCategories.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await findCategoryItem(CATEGORY_IDS.rooms, slug);
  if (!room) return buildMetadata("rooms", {}, `/rooms/${slug}`);
  return buildMetadata(
    "rooms",
    {
      title: room.meta_title || `${room.title} | Hotel Daaas Kathmandu`,
      description: room.meta_description || room.description,
    },
    `/rooms/${slug}`
  );
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await findCategoryItem(CATEGORY_IDS.rooms, slug);
  if (!room) notFound();

  const images = resolveHeroImages(room, room.fb_img);

  // Only render a real numeric price the CMS actually supplied — never invent one.
  const priceNumber = room.price ? Number(room.price) : NaN;
  const hasPrice = Number.isFinite(priceNumber) && priceNumber > 0;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["Product", "HotelRoom"],
      name: room.title,
      description: room.meta_description || room.title,
      image: images,
      ...(hasPrice && {
        offers: {
          "@type": "Offer",
          price: priceNumber,
          priceCurrency: room.currency === "$" || !room.currency ? business.currency : room.currency,
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/rooms/${room.slug}`,
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Rooms", item: `${SITE_URL}/rooms` },
        { "@type": "ListItem", position: 3, name: room.title, item: `${SITE_URL}/rooms/${room.slug}` },
      ],
    },
    ...buildPackageSchemas(room),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/rooms" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Rooms
            </Link>
          </Reveal>

          <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
            <ImageGallery images={images} alt={room.title} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start mt-5">
            <Reveal className="bento-card p-6 md:p-8 flex flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h1 className="bento-title text-3xl md:text-4xl">{room.title}</h1>
                {hasPrice && (
                  <p className="shrink-0 text-right">
                    <span className="text-2xl font-bold text-accent-orange">
                      {business.currency === "NPR" ? "Rs." : room.currency ?? "$"} {priceNumber.toLocaleString()}
                    </span>
                    <span className="block text-[0.65rem] text-bento-ink-soft/70">per night</span>
                  </p>
                )}
              </div>

              {room.sub_title && (
                <p className="font-display italic text-bento-ink-soft text-sm leading-relaxed mb-4 max-w-2xl">
                  {room.sub_title}
                </p>
              )}

              {room.description && (
                <div
                  className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-2xl [&_p]:mb-3 [&_h6]:font-semibold [&_h6]:text-bento-ink [&_h6]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                  dangerouslySetInnerHTML={{ __html: room.description }}
                />
              )}

              {room.amenities && room.amenities.length > 0 ? (
                <AmenitiesGroups groups={room.amenities} />
              ) : (
                <>
                  <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-3">
                    Room Amenities
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {roomAmenities.map((a) => (
                      <span key={a} className="flex items-center gap-1.5 bento-pill !py-1.5">
                        <Check size={11} className="text-accent-orange" />
                        {a}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {((room.includes && room.includes.length > 0) || (room.excludes && room.excludes.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {room.includes && room.includes.length > 0 && (
                    <div className="rounded-2xl border border-white/70 bg-white/40 p-4">
                      <p className="text-[0.65rem] font-bold tracking-widest uppercase text-accent-orange mb-3">
                        Included
                      </p>
                      <ul className="space-y-1.5">
                        {room.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-bento-ink-soft">
                            <Check size={12} className="text-accent-orange shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {room.excludes && room.excludes.length > 0 && (
                    <div className="rounded-2xl border border-white/70 bg-white/40 p-4">
                      <p className="text-[0.65rem] font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-3">
                        Not Included
                      </p>
                      <ul className="space-y-1.5">
                        {room.excludes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-bento-ink-soft/80">
                            <X size={12} className="shrink-0 mt-0.5 opacity-50" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-bento-ink-soft mt-auto pt-4 border-t border-white/70">
                {room.occupancy && (
                  <span className="flex items-center gap-1.5">
                    <Check size={13} className="text-accent-orange" />
                    {room.occupancy}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-accent-orange" />
                  Check-in {policies.checkIn}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-accent-orange" />
                  Check-out {policies.checkOut}
                </span>
                <span className="flex items-center gap-1.5">
                  <PawPrint size={13} className="text-accent-orange" />
                  {policies.pets}
                </span>
              </div>
            </Reveal>

            <Reveal delay={100} className="flex flex-col gap-5">
              <BookingWidget />
              <div className="bento-card p-6 md:p-8 flex items-start gap-3">
                <Info size={16} className="text-accent-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-bento-ink mb-1">Cancellation Policy</p>
                  <p className="text-bento-ink-soft text-xs leading-relaxed">{policies.cancellation}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {room.content_1 && (
            <Reveal delay={120} className="bento-card p-6 md:p-8 mt-5">
              <div
                className="text-bento-ink-soft text-sm leading-relaxed [&_h3]:bento-title [&_h3]:text-xl [&_h3]:mb-4 [&_.grid]:grid [&_.grid]:gap-3"
                dangerouslySetInnerHTML={{ __html: room.content_1 }}
              />
            </Reveal>
          )}

          {room.faq_schema && room.faq_schema.length > 0 && (
            <Reveal delay={140} className="mt-10 max-w-3xl">
              <h2 className="bento-title text-2xl mb-5">Frequently Asked Questions</h2>
              <FaqAccordion items={room.faq_schema} />
            </Reveal>
          )}

          {roomCategories.filter((r) => r.slug !== room.slug).length > 0 && (
            <Reveal delay={160} className="mt-10">
              <RelatedItemsSlider
                heading="More Rooms"
                basePath="/rooms"
                items={roomCategories
                  .filter((r) => r.slug !== room.slug)
                  .map((r) => ({
                    slug: r.slug,
                    title: r.name,
                    badge: `${r.count} Rooms`,
                    description: r.description,
                    features: roomAmenities.slice(0, 3).map((a) => ({ label: a })),
                    ctaLabel: "View Room",
                    image: r.images[0],
                  }))}
              />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
