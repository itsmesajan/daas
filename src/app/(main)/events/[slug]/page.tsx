import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Maximize2, Tag, Users } from "lucide-react";
import CategoryDetailSection from "@/components/ui/CategoryDetailSection";
import Reveal from "@/components/ui/Reveal";
import EventEnquiryTrigger from "@/components/events/EventEnquiryTrigger";
import SetupStylesTable from "@/components/events/SetupStylesTable";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem, getCategoryItems } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { toEventItems } from "@/lib/listingItems";
import { CATEGORY_IDS, SITE_URL } from "@/config/site";

export async function generateStaticParams() {
  const spaces = await getCategoryItems(CATEGORY_IDS.events);
  return spaces.map((space) => ({ slug: space.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const space = await findCategoryItem(CATEGORY_IDS.events, slug);
  if (!space) return buildMetadata("events", {}, `/events/${slug}`);
  return buildMetadata(
    "events",
    {
      title: space.meta_title || `${space.title} | Hotel Daaas Kathmandu`,
      description: space.meta_description || space.description,
    },
    `/events/${slug}`
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [space, allSpaces] = await Promise.all([
    findCategoryItem(CATEGORY_IDS.events, slug),
    getCategoryItems(CATEGORY_IDS.events),
  ]);
  if (!space) notFound();

  const images = resolveHeroImages(space, space.fb_img);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      name: space.title,
      description: space.meta_description || space.title,
      image: images,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Events", item: `${SITE_URL}/events` },
        { "@type": "ListItem", position: 3, name: space.title, item: `${SITE_URL}/events/${space.slug}` },
      ],
    },
    ...buildPackageSchemas(space),
  ];

  const amenitiesFallback = (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="flex items-center gap-1.5 bento-pill !py-1.5">
        <Maximize2 size={11} className="text-accent-orange" />
        {space.size}
      </span>
      <span className="flex items-center gap-1.5 bento-pill !py-1.5">
        <Users size={11} className="text-accent-orange" />
        {space.occupancy}
      </span>
      <span className="flex items-center gap-1.5 bento-pill !py-1.5">
        <Tag size={11} className="text-accent-orange" />
        {space.rooms_Size}
      </span>
    </div>
  );

  const belowCardSlot = (
    <Reveal delay={120} className="mt-5">
      <SetupStylesTable space={space} />
    </Reveal>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDetailSection
        backHref="/events"
        backLabel="All Event Spaces"
        images={images}
        title={space.title}
        subTitle={space.sub_title}
        description={space.description}
        amenityGroups={space.amenities}
        amenitiesFallback={amenitiesFallback}
        layout="inline"
        actionSlot={<EventEnquiryTrigger hallName={space.title} />}
        belowCardSlot={belowCardSlot}
        faqItems={space.faq_schema}
        relatedHeading="More Event Spaces"
        relatedBasePath="/events"
        relatedItems={toEventItems(allSpaces.filter((s) => s.slug !== space.slug))}
      />
    </>
  );
}
