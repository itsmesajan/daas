import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, Info, PawPrint, UserRound, ConciergeBell } from "lucide-react";
import CategoryDetailSection from "@/components/ui/CategoryDetailSection";
import Reveal from "@/components/ui/Reveal";
import BookingWidget from "@/components/rooms/BookingWidget";
import VirtualTourViewer from "@/components/virtual-tour/VirtualTourViewer";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem, getCategoryItems, getSiteRegulars, findVirtualTourByTitle } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { toRoomItems } from "@/lib/listingItems";
import { CATEGORY_IDS, SITE_URL, business } from "@/config/site";
import { roomAmenities, policies as policiesFallback } from "@/data/hotel";

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
  const [room, allRooms, siteRegulars] = await Promise.all([
    findCategoryItem(CATEGORY_IDS.rooms, slug),
    getCategoryItems(CATEGORY_IDS.rooms),
    getSiteRegulars(),
  ]);
  if (!room) notFound();

  const virtualTour = await findVirtualTourByTitle(room.title);

  const images = resolveHeroImages(room, room.fb_img);

  // Live CMS check-in/check-out/cancellation text, falling back to the
  // static factsheet copy in data/hotel.ts when the CMS field is empty.
  const policies = {
    ...policiesFallback,
    checkIn: siteRegulars?.check_in || policiesFallback.checkIn,
    checkOut: siteRegulars?.check_out || policiesFallback.checkOut,
    cancellation: siteRegulars?.policy || policiesFallback.cancellation,
    roomservice: "24hrs Room Service",
  };

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

  // Shown in the sidebar as a stacked column (icon + label + value per row).
  const stayDetails = [
    ...(room.occupancy ? [{ label: "Occupancy", value: room.occupancy, Icon: UserRound }] : []),
    { label: "Check-in", value: policies.checkIn, Icon: Clock },
    { label: "Check-out", value: policies.checkOut, Icon: Clock },
    { label: "Pets", value: policies.pets, Icon: PawPrint },
    { label: "Room Service", value: policies.roomservice, Icon: ConciergeBell },
  ];

  const actionSlot = (
    <>
      <BookingWidget bookingUrl={siteRegulars?.booking_code} />
      <div className="bento-card p-6 md:p-8">
        <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-5">Stay Details</p>
        <ul className="flex flex-col gap-4">
          {stayDetails.map(({ label, value, Icon }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                <Icon size={15} className="text-accent-orange" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold tracking-widest uppercase text-bento-ink-soft/70">{label}</p>
                <p className="text-sm text-bento-ink">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bento-card p-6 md:p-8 flex items-start gap-3">
        <Info size={16} className="text-accent-orange shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-bento-ink mb-1">Cancellation Policy</p>
          <div
            className="text-bento-ink-soft text-xs leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_a]:underline [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: policies.cancellation }}
          />
        </div>
      </div>
    </>
  );

  const belowCardSlot =
    virtualTour || room.content_1 ? (
      <>
        {virtualTour && (
          <Reveal delay={120} className="mt-10">
            <p className="bento-title text-xl mb-4">360° Room Tour</p>
            <VirtualTourViewer data={virtualTour} />
          </Reveal>
        )}
        {room.content_1 && (
          <Reveal delay={140} className="bento-card p-6 md:p-8 mt-5">
            <div
              className="text-bento-ink-soft text-sm leading-relaxed [&_h3]:bento-title [&_h3]:text-xl [&_h3]:mb-4 [&_.grid]:grid [&_.grid]:gap-3"
              dangerouslySetInnerHTML={{ __html: room.content_1 }}
            />
          </Reveal>
        )}
      </>
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
