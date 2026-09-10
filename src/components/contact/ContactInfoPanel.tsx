import { Mail, MapPin, Phone } from "lucide-react";
import { contact, address } from "@/config/site";

/** Contact-details card + location map — shared by /contact-us and /reach-us. */
export default function ContactInfoPanel() {
  return (
    <>
      <div className="bento-card p-6 md:p-8">
        <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-5">Contact Details</p>
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
            <a
              href={`mailto:${contact.email}`}
              className="text-bento-ink hover:text-accent-orange transition-colors break-all"
            >
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
    </>
  );
}
