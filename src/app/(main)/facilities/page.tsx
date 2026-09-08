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
    { title: "Facilities | Hotel Daaas Kathmandu", description: "Facilities and services available at Hotel Daaas Kathmandu." },
    "/facilities"
  );
}

function CardIcon() {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
      <Sparkles size={17} className="text-accent-orange" strokeWidth={1.75} />
    </div>
  );
}

/** Every item links out to its own /service/[slug] page (mock content now, replaced via the CMS later). */
function ServiceGrid({ items }: { items: Package[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, i) => (
        <Reveal key={item.slug} delay={i * 60}>
          <Link
            href={`/service/${item.slug}`}
            className="group flex items-start gap-4 bento-card p-6 h-full hover:border-accent-orange/30 transition-colors"
          >
            <CardIcon />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-bento-ink mb-1">{item.title}</p>
              {item.description && (
                <p
                  className="text-xs text-bento-ink-soft leading-snug line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
              <span className="bento-link !text-xs mt-2">
                Learn more
                <ArrowUpRight size={11} />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export default async function FacilitiesPage() {
  const { facilities, services } = await getServicesGrouped();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Facilities</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Everything Under One Roof</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Every amenity and service available to guests during their stay.
          </p>
        </Reveal>

        {facilities.length > 0 && (
          <div id="wellness" className="scroll-mt-28 mb-12">
            <Reveal className="mb-5 px-2">
              <h2 className="bento-title text-xl md:text-2xl">Facilities</h2>
            </Reveal>
            <ServiceGrid items={facilities} />
          </div>
        )}

        {services.length > 0 && (
          <div id="services" className="scroll-mt-28">
            <Reveal className="mb-5 px-2">
              <h2 className="bento-title text-xl md:text-2xl">Services</h2>
            </Reveal>
            <ServiceGrid items={services} />
          </div>
        )}
      </div>
    </section>
  );
}
