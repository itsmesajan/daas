import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { getServicesGrouped } from "@/lib/data";
import type { Package } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "facilities",
    {
      title: "Facilities | Hotel Daaas Kathmandu",
      description:
        "Facilities and services available at Hotel Daaas Kathmandu.",
    },
    "/facilities",
  );
}

function CardIcon() {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
      <Sparkles size={17} className="text-accent-orange" strokeWidth={1.75} />
    </div>
  );
}

function ServiceIcon({ item }: { item: Package }) {
  const imgSrc =
    item?.image ||
    (Array.isArray(item?.gallery_images) && item.gallery_images[0]
      ? typeof item.gallery_images[0] === "string"
        ? item.gallery_images[0]
        : item.gallery_images[0].src
      : undefined);

  if (imgSrc) {
    return (
      <div className="w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center overflow-hidden p-2">
        <Image
          src={imgSrc}
          alt={item.title || "Icon"}
          width={44}
          height={44}
          className="object-contain w-full h-full filter-[brightness(0)_saturate(100%)_invert(58%)_sepia(96%)_saturate(902%)_hue-rotate(348deg)_brightness(98%)_contrast(88%)]"
        />
      </div>
    );
  }

  if (item?.icon) {
    return (
      <div className="w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
        <i
          className={`${item.icon} text-base text-accent-orange`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return <CardIcon />;
}

function ServiceGrid({ items }: { items: Package[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, i) => (
        <Reveal key={item.slug || i} delay={i * 60}>
          <div className="group flex items-start gap-4 bento-card p-6 h-full hover:border-accent-orange/30 transition-colors">
            <ServiceIcon item={item} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-bento-ink group-hover:text-accent-orange transition-colors">
                  {item.title}
                </p>
              </div>
              {(item.content_0 || item.description) && (
                <div
                  className="text-xs text-bento-ink-soft leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: item.content_0 || item.description || "",
                  }}
                />
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default async function FacilitiesPage() {
  const { services } = await getServicesGrouped();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Facilities</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">
            Everything Under One Roof
          </h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Every amenity and service available to guests during their stay.
          </p>
        </Reveal>

        {services.length > 0 && (
          <div id="services" className="scroll-mt-28">
            <ServiceGrid items={services} />
          </div>
        )}
      </div>
    </section>
  );
}
