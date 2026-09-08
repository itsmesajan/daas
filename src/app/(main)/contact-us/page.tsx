import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { contact, address } from "@/config/site";

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
            <div className="bento-card p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-5">
                Contact Details
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                    <Phone size={15} className="text-accent-orange" />
                  </span>
                  <a href={`tel:${contact.phoneE164}`} className="text-bento-ink hover:text-accent-orange transition-colors">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                    <Mail size={15} className="text-accent-orange" />
                  </span>
                  <a href={`mailto:${contact.email}`} className="text-bento-ink hover:text-accent-orange transition-colors break-all">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
                    <MapPin size={15} className="text-accent-orange" />
                  </span>
                  <a
                    href={address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bento-ink hover:text-accent-orange transition-colors"
                  >
                    {address.full}
                  </a>
                </li>
              </ul>
            </div>

            <div className="bento-card overflow-hidden h-64 md:h-72">
              <iframe
                title="Hotel Daaas location"
                src={`https://www.google.com/maps?q=${address.geo.latitude},${address.geo.longitude}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
