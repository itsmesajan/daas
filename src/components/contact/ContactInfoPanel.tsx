import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK, address } from "@/config/site";

/** Contact-details card + location map — shared by /contact-us and /reach-us. */
export default async function ContactInfoPanel() {
  const siteRegulars = await getSiteRegulars();
  const phone = siteRegulars?.contact_info || SITE_FALLBACK.phone;
  const phoneE164 = siteRegulars?.landline_info?.trim() || SITE_FALLBACK.phoneE164;
  const email = siteRegulars?.email_address || SITE_FALLBACK.email;
  const fiscalAddress = siteRegulars?.fiscal_address || address.full;
  const mapSrc = siteRegulars?.location_map
    ? siteRegulars.location_map
    : `https://www.google.com/maps?q=${address.geo.latitude},${address.geo.longitude}&output=embed`;
  const mapLink = siteRegulars?.location_map ? "https://maps.app.goo.gl/cR1e6XET4SXndWS88" : address.mapUrl;
  return (
    <>
      <div className="bento-card p-6 md:p-8">
        <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-5">Contact Details</p>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <Phone size={15} className="text-accent-orange" />
            </span>
            <a href={`tel:${phoneE164}`} className="text-bento-ink hover:text-accent-orange transition-colors">
              {phone}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <Mail size={15} className="text-accent-orange" />
            </span>
            <a
              href={`mailto:${email}`}
              className="text-bento-ink hover:text-accent-orange transition-colors break-all"
            >
              {email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <MapPin size={15} className="text-accent-orange" />
            </span>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bento-ink hover:text-accent-orange transition-colors"
            >
              {fiscalAddress}
            </a>
          </li>
        </ul>
      </div>

      <div className="bento-card overflow-hidden h-64 md:h-72">
        <iframe
          title="Hotel Daaas location"
          src={mapSrc}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
}
