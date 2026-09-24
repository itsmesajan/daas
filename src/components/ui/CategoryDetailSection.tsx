import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import AmenitiesGroups from "@/components/ui/AmenitiesGroups";
import FaqAccordion from "@/components/ui/FaqAccordion";
import RelatedItemsSlider, { type RelatedItem } from "@/components/ui/RelatedItemsSlider";
import type { AmenityGroup, FaqItem } from "@/types";

/**
 * Shared shell for the /rooms, /dining, /events detail ([slug]) pages —
 * back link, gallery, title/blurb/description, amenities-or-fallback, FAQ
 * and the related-items slider are identical across all three. Each
 * category supplies its own CTA (actionSlot), any extra body content, and
 * picks a layout:
 *  - "sidebar" (rooms): main card + a separate sidebar column for actionSlot.
 *  - "inline" (dining/events): one card, actionSlot renders inside it.
 */
export default function CategoryDetailSection({
  backHref,
  backLabel,
  images,
  title,
  subTitle,
  description,
  headerExtra,
  amenityGroups,
  amenitiesFallback,
  extraContent,
  footerRow,
  layout,
  actionSlot,
  belowCardSlot,
  faqItems,
  relatedHeading,
  relatedBasePath,
  relatedItems,
}: {
  backHref: string;
  backLabel: string;
  images: string[];
  title: string;
  subTitle?: string;
  description?: string;
  /** Rendered top-right of the title row (rooms' price tag). */
  headerExtra?: ReactNode;
  amenityGroups?: AmenityGroup[];
  /** Shown instead of AmenitiesGroups when amenityGroups is empty. */
  amenitiesFallback?: ReactNode;
  /** Extra body content after amenities (rooms' includes/excludes). */
  extraContent?: ReactNode;
  /** Trailing info row inside the main card (rooms' occupancy/check-in/out/pets). */
  footerRow?: ReactNode;
  layout: "sidebar" | "inline";
  /** BookingWidget+policy card (sidebar) or call/enquiry buttons (inline). */
  actionSlot: ReactNode;
  /** Full-width content below the main card (rooms' content_1, events' SetupStylesTable). */
  belowCardSlot?: ReactNode;
  faqItems?: FaqItem[];
  relatedHeading: string;
  relatedBasePath: string;
  relatedItems: RelatedItem[];
}) {
  const body = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <h1 className="bento-title text-3xl md:text-4xl">{title}</h1>
        {headerExtra}
      </div>

      {subTitle && (
        <p className="font-display italic text-bento-ink-soft text-sm leading-relaxed mb-4 max-w-7xl">{subTitle}</p>
      )}

      {description && (
        <div
          className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-7xl"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {amenityGroups && amenityGroups.length > 0 ? <AmenitiesGroups groups={amenityGroups} /> : amenitiesFallback}

      {extraContent}

      {layout === "inline" && actionSlot}

      {footerRow}
    </>
  );

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-6">
          <Link href={backHref} className="bento-link w-fit">
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
        </Reveal>

        <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140">
          <ImageGallery images={images} alt={title} />
        </Reveal>

        {layout === "sidebar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start mt-5">
            <Reveal className="bento-card p-6 md:p-8 flex flex-col">{body}</Reveal>
            {/* self-stretch (overriding the grid's items-start) gives this
                column the full row height, so the inner sticky div has room
                to follow the scroll instead of being boxed to its own
                (shorter) content height. */}
            <Reveal delay={100} className="self-stretch">
              <div className="sticky top-24 md:top-28 flex flex-col gap-5">{actionSlot}</div>
            </Reveal>
          </div>
        ) : (
          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col mt-5">
            {body}
          </Reveal>
        )}

        {belowCardSlot}

        {faqItems && faqItems.length > 0 && (
          <Reveal delay={140} className="mt-10 max-w-3xl">
            <h2 className="bento-title text-2xl mb-5">Frequently Asked Questions</h2>
            <FaqAccordion items={faqItems} />
          </Reveal>
        )}

        {relatedItems.length > 0 && (
          <Reveal delay={160} className="mt-10">
            <RelatedItemsSlider heading={relatedHeading} basePath={relatedBasePath} items={relatedItems} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
