import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import { buildMetadata } from "@/lib/metadata";
import { findOfferBySlug } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { SITE_URL } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offer = await findOfferBySlug(slug);
  if (!offer) return buildMetadata("offers", {}, `/offers/${slug}`);
  return buildMetadata(
    "offers",
    {
      title: offer.meta_title || `${offer.title} | Hotel Daaas Kathmandu`,
      description: offer.meta_description,
    },
    `/offers/${slug}`
  );
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await findOfferBySlug(slug);
  if (!offer) notFound();

  const images = resolveHeroImages(offer, offer.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Offers", item: `${SITE_URL}/offers` },
      { "@type": "ListItem", position: 3, name: offer.title, item: `${SITE_URL}/offers/${offer.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/offers" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Offers
            </Link>
          </Reveal>

          {images.length > 0 && (
            <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
              <ImageGallery images={images} alt={offer.title} />
            </Reveal>
          )}

          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col mt-5">
            <h1 className="bento-title text-3xl md:text-4xl mb-4">{offer.title}</h1>

            {(offer.start_date || offer.end_date) && (
              <p className="flex items-center gap-1.5 text-bento-ink-soft text-sm mb-6">
                <CalendarDays size={14} className="text-accent-orange" />
                {offer.start_date} {offer.start_date && offer.end_date ? "–" : ""} {offer.end_date}
              </p>
            )}

            {offer.content && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-2xl [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: offer.content }}
              />
            )}

            <Link href="/contact-us" className="bento-btn w-fit">
              Enquire About This Offer
              <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
