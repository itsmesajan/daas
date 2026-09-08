import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Phone, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import AmenitiesGroups from "@/components/ui/AmenitiesGroups";
import FaqAccordion from "@/components/ui/FaqAccordion";
import RelatedItemsSlider from "@/components/ui/RelatedItemsSlider";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { CATEGORY_IDS, SITE_URL, contact } from "@/config/site";
import { diningVenues } from "@/data/hotel";

export async function generateStaticParams() {
  return diningVenues.map((venue) => ({ slug: venue.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = await findCategoryItem(CATEGORY_IDS.restaurant, slug);
  if (!venue) return buildMetadata("restaurant", {}, `/dining/${slug}`);
  return buildMetadata(
    "restaurant",
    {
      title: venue.meta_title || `${venue.title} | Hotel Daaas Kathmandu`,
      description: venue.meta_description || venue.description,
    },
    `/dining/${slug}`
  );
}

export default async function DiningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await findCategoryItem(CATEGORY_IDS.restaurant, slug);
  if (!venue) notFound();

  const images = resolveHeroImages(venue, venue.fb_img);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: venue.title,
      description: venue.meta_description || venue.title,
      image: images,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Dining", item: `${SITE_URL}/dining` },
        { "@type": "ListItem", position: 3, name: venue.title, item: `${SITE_URL}/dining/${venue.slug}` },
      ],
    },
    ...buildPackageSchemas(venue),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/dining" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Dining
            </Link>
          </Reveal>

          <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
            <ImageGallery images={images} alt={venue.title} />
          </Reveal>

          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col mt-5">
            <h1 className="bento-title text-3xl md:text-4xl mb-4">{venue.title}</h1>

            {venue.sub_title && (
              <p className="font-display italic text-bento-ink-soft text-sm leading-relaxed mb-4 max-w-2xl">
                {venue.sub_title}
              </p>
            )}

            {venue.description && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-2xl [&_p]:mb-3 [&_h6]:font-semibold [&_h6]:text-bento-ink [&_h6]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: venue.description }}
              />
            )}

            {venue.amenities && venue.amenities.length > 0 ? (
              <AmenitiesGroups groups={venue.amenities} />
            ) : (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 bento-pill !py-1.5">
                  <Users size={11} className="text-accent-orange" />
                  {venue.occupancy}
                </span>
                <span className="flex items-center gap-1.5 bento-pill !py-1.5">
                  <Clock size={11} className="text-accent-orange" />
                  {venue.rooms_Size}
                </span>
                <span className="flex items-center gap-1.5 bento-pill !py-1.5">
                  <MapPin size={11} className="text-accent-orange" />
                  Hotel Daaas, Ktm
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a href={`tel:${contact.phoneE164}`} className="bento-btn">
                <Phone size={14} />
                Call to Reserve
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-btn-ghost"
              >
                <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
                WhatsApp Us
              </a>
            </div>
          </Reveal>

          {venue.faq_schema && venue.faq_schema.length > 0 && (
            <Reveal delay={130} className="mt-10 max-w-3xl">
              <h2 className="bento-title text-2xl mb-5">Frequently Asked Questions</h2>
              <FaqAccordion items={venue.faq_schema} />
            </Reveal>
          )}

          {diningVenues.filter((v) => v.slug !== venue.slug).length > 0 && (
            <Reveal delay={150} className="mt-10">
              <RelatedItemsSlider
                heading="More Dining"
                basePath="/dining"
                items={diningVenues
                  .filter((v) => v.slug !== venue.slug)
                  .map((v) => ({
                    slug: v.slug,
                    title: v.name,
                    badge: v.cuisine,
                    description: v.description,
                    features: [
                      { icon: <Users size={11} className="text-accent-orange" />, label: v.seats },
                      { icon: <Clock size={11} className="text-accent-orange" />, label: v.timing },
                    ],
                    ctaLabel: "View Venue",
                    image: v.images[0],
                  }))}
              />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
