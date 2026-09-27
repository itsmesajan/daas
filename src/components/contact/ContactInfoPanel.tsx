import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteRegulars } from "@/lib/data";
import { SITE_FALLBACK, address } from "@/config/site";

/** `contact_info`/`landline_info`/`email_address` may each hold several comma-separated values. */
function splitContactValues(value?: string): string[] {
  return value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];
}

function ContactLinks({ values, hrefPrefix, className }: { values: string[]; hrefPrefix: string; className: string }) {
  return (
    <div className="flex flex-col gap-1">
      {values.map((value) => (
        <a key={value} href={`${hrefPrefix}${value.replace(/\s+/g, "")}`} className={className}>
          {value}
        </a>
      ))}
    </div>
  );
}

/** Contact-details card + location map — shared by /contact-us and /reach-us. */
export default async function ContactInfoPanel() {
  const siteRegulars = await getSiteRegulars();
  // Mobile (contact_info) and landline (landline_info) are separate phone
  // lines, not display-vs-dial forms of the same number — each is rendered
  // (and dialed) as its own link, not cross-matched with the other's number.
  const phones = [
    ...splitContactValues(siteRegulars?.contact_info),
    ...splitContactValues(siteRegulars?.landline_info),
  ];
  const displayPhones = phones.length > 0 ? phones : [SITE_FALLBACK.phone];
  const emails = splitContactValues(siteRegulars?.email_address);
  const displayEmails = emails.length > 0 ? emails : [SITE_FALLBACK.email];
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
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <Phone size={15} className="text-accent-orange" />
            </span>
            <ContactLinks
              values={displayPhones}
              hrefPrefix="tel:"
              className="text-bento-ink hover:text-accent-orange transition-colors"
            />
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <Mail size={15} className="text-accent-orange" />
            </span>
            <ContactLinks
              values={displayEmails}
              hrefPrefix="mailto:"
              className="text-bento-ink hover:text-accent-orange transition-colors break-all"
            />
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
