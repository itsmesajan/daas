import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("contact", {}, "/contact-us");
}

export default function ContactUsPage() {
  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Get In Touch</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Contact Us</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Questions about rooms, dining, or events? Send us a message and we&apos;ll get back to you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <Reveal className="flex flex-col gap-5">
            <ContactInfoPanel />
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
