import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, Users } from "lucide-react";
import CategoryDetailSection from "@/components/ui/CategoryDetailSection";
import { buildMetadata, buildPackageSchemas } from "@/lib/metadata";
import { findCategoryItem, getCategoryItems } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { toDiningItems } from "@/lib/listingItems";
import { CATEGORY_IDS, SITE_URL, contact } from "@/config/site";

export async function generateStaticParams() {
  const venues = await getCategoryItems(CATEGORY_IDS.restaurant);
  return venues.map((venue) => ({ slug: venue.slug }));
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
  const [venue, allVenues] = await Promise.all([
    findCategoryItem(CATEGORY_IDS.restaurant, slug),
    getCategoryItems(CATEGORY_IDS.restaurant),
  ]);
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

  const amenitiesFallback = (
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
  );

  const actionSlot = (
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
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDetailSection
        backHref="/dining"
        backLabel="All Dining"
        images={images}
        title={venue.title}
        subTitle={venue.sub_title}
        description={venue.description}
        amenityGroups={venue.amenities}
        amenitiesFallback={amenitiesFallback}
        layout="inline"
        actionSlot={actionSlot}
        faqItems={venue.faq_schema}
        relatedHeading="More Dining"
        relatedBasePath="/dining"
        relatedItems={toDiningItems(allVenues.filter((v) => v.slug !== venue.slug))}
      />
    </>
  );
}
