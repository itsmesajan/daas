import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import OfferCard from "@/components/offers/OfferCard";
import OfferEnquiryForm from "@/components/offers/OfferEnquiryForm";
import { buildMetadata } from "@/lib/metadata";
import { findOfferBySlug, getOffers } from "@/lib/data";
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
  const [offer, allOffers] = await Promise.all([findOfferBySlug(slug), getOffers()]);
  if (!offer) notFound();

  const images = resolveHeroImages(offer, offer.image);
  const otherOffers = allOffers.filter((o) => o.slug !== offer.slug);

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

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start">
            <div className="flex flex-col gap-5">
              {images.length > 0 && (
                <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
                  <ImageGallery images={images} alt={offer.title} />
                </Reveal>
              )}

              <Reveal delay={80} className="bento-card p-6 md:p-8">
                <h1 className="bento-title text-3xl md:text-4xl mb-4">{offer.title}</h1>

                {(offer.start_date || offer.end_date) && (
                  <p className="flex items-center gap-1.5 text-bento-ink-soft text-sm mb-6">
                    <CalendarDays size={14} className="text-accent-orange" />
                    {offer.start_date} {offer.start_date && offer.end_date ? "–" : ""} {offer.end_date}
                  </p>
                )}

                {offer.content && (
                  <div
                    className="text-bento-ink-soft text-sm leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                    dangerouslySetInnerHTML={{ __html: offer.content }}
                  />
                )}
              </Reveal>
            </div>

            <Reveal delay={100} className="bento-card p-6 md:p-8 lg:sticky lg:top-28">
              <OfferEnquiryForm offerTitle={offer.title} rate={offer.rate} />
            </Reveal>
          </div>

          {otherOffers.length > 0 && (
            <Reveal delay={160} className="mt-14">
              <h2 className="bento-title text-2xl mb-5">Other Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {otherOffers.map((o, i) => (
                  <OfferCard key={o.slug} offer={o} delay={i * 80} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
