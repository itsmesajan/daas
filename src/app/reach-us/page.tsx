import type { Metadata } from "next";
import UnderConstructionShell from "@/components/ui/UnderConstructionShell";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: `Reach Us | ${site.shortName}` };
}

export default function ReachUsPage() {
  return (
    <UnderConstructionShell>
      <div className="max-w-[1000px] mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="bento-pill mx-auto w-fit mb-4">Get In Touch</p>
          <h1 className="bento-title text-3xl md:text-4xl mb-3">Reach Us</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            {site.name} is getting ready to open — reach out and we&apos;ll get back to you.
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
