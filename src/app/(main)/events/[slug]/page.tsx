import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Maximize2, Tag, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import EventEnquiryTrigger from "@/components/events/EventEnquiryTrigger";
import SetupStylesTable from "@/components/events/SetupStylesTable";
import ImageGallery from "@/components/ui/ImageGallery";
import AmenitiesGroups from "@/components/ui/AmenitiesGroups";
import FaqAccordion from "@/components/ui/FaqAccordion";
import RelatedItemsSlider from "@/components/ui/RelatedItemsSlider";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { CATEGORY_IDS, SITE_URL } from "@/config/site";
import { banquetSpaces } from "@/data/hotel";

export async function generateStaticParams() {
  return banquetSpaces.map((space) => ({ slug: space.slug }));
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
  const space = await findCategoryItem(CATEGORY_IDS.events, slug);
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/events" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Event Spaces
            </Link>
          </Reveal>

          <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
            <ImageGallery images={images} alt={space.title} />
          </Reveal>

          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col mt-5">
            <h1 className="bento-title text-3xl md:text-4xl mb-4">{space.title}</h1>

            {space.sub_title && (
              <p className="font-display italic text-bento-ink-soft text-sm leading-relaxed mb-4 max-w-2xl">
                {space.sub_title}
              </p>
            )}

            {space.description && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-2xl [&_p]:mb-3 [&_h6]:font-semibold [&_h6]:text-bento-ink [&_h6]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: space.description }}
              />
            )}

            {space.amenities && space.amenities.length > 0 ? (
              <AmenitiesGroups groups={space.amenities} />
            ) : (
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
            )}

            <EventEnquiryTrigger hallName={space.title} />
          </Reveal>

          <Reveal delay={120} className="mt-5">
            <SetupStylesTable space={space} />
          </Reveal>

          {space.faq_schema && space.faq_schema.length > 0 && (
            <Reveal delay={140} className="mt-10 max-w-3xl">
              <h2 className="bento-title text-2xl mb-5">Frequently Asked Questions</h2>
              <FaqAccordion items={space.faq_schema} />
            </Reveal>
          )}

          {banquetSpaces.filter((s) => s.slug !== space.slug).length > 0 && (
            <Reveal delay={160} className="mt-10">
              <RelatedItemsSlider
                heading="More Event Spaces"
                basePath="/events"
                items={banquetSpaces
                  .filter((s) => s.slug !== space.slug)
                  .map((s) => ({
                    slug: s.slug,
                    title: s.name,
                    badge: s.size,
                    description: s.description,
                    features: [
                      { icon: <Maximize2 size={11} className="text-accent-orange" />, label: s.size },
                      { icon: <Users size={11} className="text-accent-orange" />, label: s.capacity },
                    ],
                    ctaLabel: "View Space",
                    image: s.images[0],
                  }))}
              />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
