import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, Info, PawPrint } from "lucide-react";
import CategoryDetailSection from "@/components/ui/CategoryDetailSection";
import Reveal from "@/components/ui/Reveal";
import BookingWidget from "@/components/rooms/BookingWidget";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem, getCategoryItems } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { toRoomItems } from "@/lib/listingItems";
import { CATEGORY_IDS, SITE_URL, business } from "@/config/site";
import { roomAmenities, policies } from "@/data/hotel";

export async function generateStaticParams() {
  const rooms = await getCategoryItems(CATEGORY_IDS.rooms);
  return rooms.map((room) => ({ slug: room.slug }));
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
  const [room, allRooms] = await Promise.all([
    findCategoryItem(CATEGORY_IDS.rooms, slug),
    getCategoryItems(CATEGORY_IDS.rooms),
  ]);
  if (!room) notFound();

  const images = resolveHeroImages(room, room.fb_img);

  // Only render a real numeric price the CMS actually supplied — never invent one.
  const hasPrice = Boolean(room.price) && Number(room.price) > 0;
  const priceDisplay = hasPrice ? `${room.currency ?? "$"}${room.price}` : undefined;

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
          price: room.price,
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

  const headerExtra = priceDisplay ? (
    <p className="shrink-0 text-right">
      <span className="text-2xl font-bold text-accent-orange">{priceDisplay}</span>
      <span className="block text-[0.65rem] text-bento-ink-soft/70">per night</span>
    </p>
  ) : undefined;

  const amenitiesFallback = (
    <>
      <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-3">Room Amenities</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {roomAmenities.map((a) => (
          <span key={a} className="flex items-center gap-1.5 bento-pill !py-1.5">
            <Check size={11} className="text-accent-orange" />
            {a}
          </span>
        ))}
      </div>
    </>
  );

  const extraContent =
    (room.includes && room.includes.length > 0) || (room.excludes && room.excludes.length > 0) ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {room.includes && room.includes.length > 0 && (
          <div className="rounded-2xl border border-white/70 bg-white/40 p-4">
            <p className="text-[0.65rem] font-bold tracking-widest uppercase text-accent-orange mb-3">Included</p>
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
                  <Check size={12} className="shrink-0 mt-0.5 opacity-50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : undefined;

  const footerRow = (
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
  );

  const actionSlot = (
    <>
      <BookingWidget />
      <div className="bento-card p-6 md:p-8 flex items-start gap-3">
        <Info size={16} className="text-accent-orange shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-bento-ink mb-1">Cancellation Policy</p>
          <p className="text-bento-ink-soft text-xs leading-relaxed">{policies.cancellation}</p>
        </div>
      </div>
    </>
  );

  const belowCardSlot = room.content_1 ? (
    <Reveal delay={120} className="bento-card p-6 md:p-8 mt-5">
      <div
        className="text-bento-ink-soft text-sm leading-relaxed [&_h3]:bento-title [&_h3]:text-xl [&_h3]:mb-4 [&_.grid]:grid [&_.grid]:gap-3"
        dangerouslySetInnerHTML={{ __html: room.content_1 }}
      />
    </Reveal>
  ) : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDetailSection
        backHref="/rooms"
        backLabel="All Rooms"
        images={images}
        title={room.title}
        subTitle={room.sub_title}
        description={room.description}
        headerExtra={headerExtra}
        amenityGroups={room.amenities}
        amenitiesFallback={amenitiesFallback}
        extraContent={extraContent}
        footerRow={footerRow}
        layout="sidebar"
        actionSlot={actionSlot}
        belowCardSlot={belowCardSlot}
        faqItems={room.faq_schema}
        relatedHeading="More Rooms"
        relatedBasePath="/rooms"
        relatedItems={toRoomItems(allRooms.filter((r) => r.slug !== room.slug))}
      />
    </>
  );
}
