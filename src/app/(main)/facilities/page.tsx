import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
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
            Thoughtfully curated amenities and personalized services designed to make your stay completely effortless.
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
