import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gift } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { getDealOfTheDay, getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "deal-of-the-day",
    {
      title: "Deal of the Day | Hotel Daaas Kathmandu",
      description: "Today's special deal at Hotel Daaas Kathmandu.",
      // QR-code-only landing page — not linked from site navigation, and kept
      // out of search results/crawling so it isn't discoverable any other way.
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    },
    "/deal-of-the-day"
  );
}

export default async function DealOfTheDayPage() {
  const [deal, siteRegulars] = await Promise.all([
    getDealOfTheDay(),
    getSiteRegulars(),
  ]);

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Deal of the Day</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Today&apos;s Special</h1>
        </Reveal>

        {!deal ? (
          <Reveal delay={100}>
            <div className="bento-card p-10 md:p-14 text-center max-w-xl mx-auto">
              <Gift size={28} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
              <h2 className="bento-title text-xl mb-2">No deal today</h2>
              <p className="text-bento-ink-soft text-sm mb-6">
                Check back tomorrow, or contact us directly for the best available rates.
              </p>
              <Link href="/contact-us" className="bento-btn mx-auto w-fit">
                Contact Us
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={100} className="bento-card overflow-hidden max-w-2xl mx-auto">
            {deal.image && (
              <div className="relative h-64">
                <Image src={deal.image} alt={deal.title ?? "Deal of the Day"} fill className="object-cover" sizes="600px" />
              </div>
            )}
            <div className="p-6 md:p-8 text-center">
              <h2 className="bento-title text-2xl mb-4">{deal.title}</h2>
              {deal.type === "2" && deal.whatsapp ? (
                <a
                  href={`https://wa.me/${deal.whatsapp.replace(/[^0-9]/g, "")}${
                    deal.whatsapp_message ? `?text=${encodeURIComponent(deal.whatsapp_message)}` : ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-btn mx-auto w-fit"
                >
                  <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                  Enquire on WhatsApp
                </a>
              ) : (
                <a href={`mailto:${deal.mail || siteRegulars?.email_address || SITE_FALLBACK.email}`} className="bento-btn mx-auto w-fit">
                  Enquire by Email
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
