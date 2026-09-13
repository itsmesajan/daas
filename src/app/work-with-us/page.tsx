import type { Metadata } from "next";
import UnderConstructionShell from "@/components/ui/UnderConstructionShell";
import CareerIntro from "@/components/careers/CareerIntro";
import CareerForm from "@/components/careers/CareerForm";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteRegulars = await getSiteRegulars();
  const shortName = siteRegulars?.sitename || SITE_FALLBACK.shortName;
  return { title: `Work With Us | ${shortName}` };
}

export default async function WorkWithUsPage() {
  const siteRegulars = await getSiteRegulars();

  return (
    <UnderConstructionShell>
      <div className="max-w-xl mx-auto px-4 py-10">
        <CareerIntro siteName={siteRegulars?.sitename} />
        <div className="bento-card p-6 md:p-8">
          <CareerForm />
        </div>
      </div>
    </UnderConstructionShell>
  );
}
