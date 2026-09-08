import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import AmenitiesGroups from "@/components/ui/AmenitiesGroups";
import { buildMetadata } from "@/lib/metadata";
import { findServiceBySlug } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { SITE_URL, contact } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await findServiceBySlug(slug);
  if (!service) return buildMetadata("facilities", {}, `/service/${slug}`);
  return buildMetadata(
    "facilities",
    {
      title: service.meta_title || `${service.title} | Hotel Daaas Kathmandu`,
      description: service.meta_description || service.title,
    },
    `/service/${slug}`
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await findServiceBySlug(slug);
  if (!service) notFound();

  const images = resolveHeroImages(service, service.fb_img);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Facilities", item: `${SITE_URL}/facilities` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${SITE_URL}/service/${service.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/facilities" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Facilities
            </Link>
          </Reveal>

          {images.length > 0 && (
            <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140 mb-5">
              <ImageGallery images={images} alt={service.title} />
            </Reveal>
          )}

          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col">
            <h1 className="bento-title text-3xl md:text-4xl mb-4">{service.title}</h1>

            {service.description && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed mb-6 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            )}

            {service.amenities && service.amenities.length > 0 && <AmenitiesGroups groups={service.amenities} />}

            <a href={`tel:${contact.phoneE164}`} className="bento-btn w-fit">
              <Phone size={14} />
              {contact.phone}
            </a>
            <Link href="/contact-us" className="bento-link w-fit mt-4">
              Or send us a message
              <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
