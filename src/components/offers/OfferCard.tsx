import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { resolveHeroImages } from "@/lib/images";
import type { OfferItem } from "@/types";

export default function OfferCard({ offer, delay = 0 }: { offer: OfferItem; delay?: number }) {
  const images = resolveHeroImages(offer, offer.image);

  return (
    <Reveal delay={delay}>
      <Link href={`/offers/${offer.slug}`} className="group block bento-card overflow-hidden h-full">
        {images[0] && (
          <div className="relative h-48">
            <Image
              src={images[0]}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        )}
        <div className="p-5 md:p-6">
          <h2 className="bento-title text-lg mb-2">{offer.title}</h2>
          {(offer.start_date || offer.end_date) && (
            <p className="text-bento-ink-soft text-xs mb-3">
              {offer.start_date} {offer.start_date && offer.end_date ? "–" : ""} {offer.end_date}
            </p>
          )}
          <span className="bento-link">
            View Offer
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
