import type { Metadata } from "next";
import UnderConstructionShell from "@/components/ui/UnderConstructionShell";
import CareerIntro from "@/components/careers/CareerIntro";
import CareerForm from "@/components/careers/CareerForm";
import { getSiteRegulars } from "@/lib/data";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: `Work With Us | ${site.shortName}` };
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
