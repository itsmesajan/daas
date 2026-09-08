import Image from "next/image";
import Link from "next/link";
import iconMark from "@/assets/logo.png";
import { site, contact, address, nav, social, type NavChild } from "@/config/site";

/** Flattens the (possibly nested, grouped) nav config into plain links for the footer sitemap. */
const exploreLinks = nav
  .filter((item) => !item.children)
  .map((item) => ({ label: item.label, href: item.href! }));

function flattenLinks(children: readonly NavChild[]): { label: string; href: string }[] {
  return children.flatMap((child) =>
    child.children ? flattenLinks(child.children) : child.href ? [{ label: child.label, href: child.href }] : []
  );
}

// Combines every grouped nav item's children (Facilities, More, etc.) into
// one flattened footer column — not just the first one found.
const moreLinks = nav.filter((item) => item.children).flatMap((item) => flattenLinks(item.children!));

export default function BentoFooter() {
  return (
    <footer id="contact" className="p-4">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_1fr] gap-10 pb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Image src={iconMark} alt="" width={1000} height={1500} className="w-60 h-auto" />
            </div>
            <p className="text-bento-ink-soft text-sm leading-relaxed max-w-sm">
              A new 4-star landmark rising in Balaju, Kathmandu — 81 rooms,
              grand banquet halls, a dedicated wellness floor, and rooftop
              dining above the skyline. Opening November 2026.
            </p>

            <div className="flex items-center gap-2.5 mt-6">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/50 border border-white/70 text-bento-ink-soft hover:text-white hover:bg-accent-orange hover:border-accent-orange transition-colors"
                >
                  <i className={`${s.icon} text-sm`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="bento-pill mb-5">Explore</p>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.href} className="flex items-center gap-2.5">
                  <i className="fa-solid fa-chevron-right text-accent-orange text-[10px] w-4 text-center" aria-hidden="true" />
                  <Link href={item.href} className="text-sm text-bento-ink-soft hover:text-bento-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bento-pill mb-5">More</p>
            <ul className="space-y-3">
              {moreLinks.map((item) => (
                <li key={item.href} className="flex items-center gap-2.5">
                  <i className="fa-solid fa-chevron-right text-accent-orange text-[10px] w-4 text-center" aria-hidden="true" />
                  <Link href={item.href} className="text-sm text-bento-ink-soft hover:text-bento-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bento-pill mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-bento-ink-soft">
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-phone text-accent-orange text-sm w-4 text-center" aria-hidden="true" />
                <a href={`tel:${contact.phoneE164}`} className="hover:text-bento-ink transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-brands fa-whatsapp text-accent-orange text-sm w-4 text-center" aria-hidden="true" />
                <a href={`tel:${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-bento-ink transition-colors">
                  +977 {contact.whatsapp.slice(3)} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-envelope text-accent-orange text-sm w-4 text-center" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-bento-ink transition-colors break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-location-dot text-accent-orange text-sm w-4 text-center shrink-0" aria-hidden="true" />
                <a href="https://maps.app.goo.gl/cR1e6XET4SXndWS88" target="_blank" rel="noopener noreferrer" className="hover:text-bento-ink transition-colors">{address.full}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-bento-ink-soft">
          <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://longtail.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bento-ink font-medium hover:text-accent-orange transition-colors"
            >
              Longtail e-Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
