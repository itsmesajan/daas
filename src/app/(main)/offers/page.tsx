import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import OfferCard from "@/components/offers/OfferCard";
import { buildMetadata } from "@/lib/metadata";
import { getOffers } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "offers",
    { title: "Offers | Hotel Daaas Kathmandu", description: "Current offers and packages at Hotel Daaas Kathmandu." },
    "/offers"
  );
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Offers</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Current Offers</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Special packages and seasonal offers at Hotel Daaas Kathmandu.
          </p>
        </Reveal>

        {offers.length === 0 ? (
          <Reveal delay={100}>
            <div className="bento-card p-10 md:p-14 text-center max-w-xl mx-auto">
              <Tag size={28} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
              <h2 className="bento-title text-xl mb-2">No offers available right now</h2>
              <p className="text-bento-ink-soft text-sm mb-6">
                Check back soon, or contact us directly for the best available rates.
              </p>
              <Link href="/contact-us" className="bento-btn mx-auto w-fit">
                Contact Us
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offers.map((offer, i) => (
              <OfferCard key={offer.slug} offer={offer} delay={i * 80} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
