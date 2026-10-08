import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import CareerIntro from "@/components/careers/CareerIntro";
import CareerForm from "@/components/careers/CareerForm";
import { buildMetadata } from "@/lib/metadata";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "careers",
    {
      title: "Careers | Hotel Daaas Kathmandu",
      description: "Join the team at Hotel Daaas Kathmandu — submit your CV and our HR team will reach out when a suitable opening is available.",
    },
    "/careers"
  );
}

export default async function CareersPage() {
  const siteRegulars = await getSiteRegulars();
  const siteName = siteRegulars?.sitename || SITE_FALLBACK.name;

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal>
          <CareerIntro siteName={siteName} />
        </Reveal>

        <Reveal delay={100} className="max-w-xl mx-auto bento-card p-6 md:p-8">
          <CareerForm />
        </Reveal>
      </div>
    </section>
  );
}
