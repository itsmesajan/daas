import type { Metadata } from "next";
import UnderConstructionShell from "@/components/ui/UnderConstructionShell";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteRegulars = await getSiteRegulars();
  const shortName = siteRegulars?.sitename || SITE_FALLBACK.shortName;
  return { title: `Reach Us | ${shortName}` };
}

export default async function ReachUsPage() {
  const siteRegulars = await getSiteRegulars();
  const siteName = siteRegulars?.sitename || SITE_FALLBACK.name;
  return (
    <UnderConstructionShell>
      <div className="max-w-[1000px] mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="bento-pill mx-auto w-fit mb-4">Get In Touch</p>
          <h1 className="bento-title text-3xl md:text-4xl mb-3">Reach Us</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            {siteName} is getting ready to open — reach out and we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-5">
            <ContactInfoPanel />
          </div>
          <ContactForm />
        </div>
      </div>
    </UnderConstructionShell>
  );
}
