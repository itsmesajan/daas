import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";

export default async function ContactCta() {
  const siteRegulars = await getSiteRegulars();
  const phone = siteRegulars?.contact_info || SITE_FALLBACK.phone;
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal>
          <div className="bento-card relative overflow-hidden px-8 py-14 md:py-20 text-center">
            <div className="bento-glow-orange w-80 h-80 -top-24 left-1/4" />
            <div className="bento-glow-blue w-80 h-80 -bottom-24 right-1/4" />
            <div className="relative">
              <p className="bento-pill mb-6">Get In Touch</p>
              <h2 className="bento-title text-3xl md:text-5xl mb-6">
                Be among the first to stay
              </h2>
              <p className="text-bento-ink-soft max-w-md mx-auto mb-8 text-sm">
                Reach out for opening updates, bookings and event enquiries at
                Hotel Daaas Kathmandu.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact-us" className="bento-btn">
                  Send a Message
                </Link>
                <a href={`tel:${phone}`} className="bento-btn-ghost">
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
