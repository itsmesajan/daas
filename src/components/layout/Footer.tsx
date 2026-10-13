import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { getMenuItems, getSiteRegulars, getSocialGroup } from "@/lib/data";
import { SITE_FALLBACK } from "@/config/site";
import NewsletterSubscribe from "./NewsletterSubscribe";

export default async function BentoFooter() {
  const exploreLinks = await getMenuItems(2);
  const moreLinks = await getMenuItems(4);
  const siteRegulars = await getSiteRegulars();
  const socialLinks = await getSocialGroup(1);

  const logoUrl = siteRegulars?.logo_upload || "";
  const fiscalAddress = siteRegulars?.fiscal_address || "";
  const toList = (value?: string) =>
    (value ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const landlineNumbers = toList(siteRegulars?.landline_info);
  const phoneNumbers = toList(siteRegulars?.contact_info || "");
  const emailAddresses = toList(siteRegulars?.email_address || "");

  return (
    <footer id="contact" className="p-4 pb-20 lg:pb-4">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="bento-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-orange/10 border border-accent-orange/20">
              <Mail size={20} className="text-accent-orange" />
            </span>
            <div>
              <p className="text-sm font-bold text-bento-ink mb-1">Stay Updated</p>
              <p className="text-bento-ink-soft text-sm max-w-sm">
                Subscribe for updates on offers, events, and our opening.
              </p>
            </div>
          </div>
          <NewsletterSubscribe />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_1.2fr] gap-10 pb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Link href="/" className="inline-block mb-4">
                {logoUrl && (
                  <Image
                    src={logoUrl}
                    alt={siteRegulars?.sitetitle || "Logo"}
                    width={1000}
                    height={1500}
                    className="w-60 h-auto"
                  />
                )}
              </Link>
            </div>
            <div
              className="text-bento-ink-soft text-sm leading-relaxed max-w-sm"
              dangerouslySetInnerHTML={{ __html: siteRegulars?.brief || "" }}
            />

            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks?.items?.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item?.title || "Social media link"}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/50 border border-white/70 text-bento-ink-soft hover:text-white hover:bg-accent-orange hover:border-accent-orange transition-colors"
                >
                  {item?.image ? (
                    <Image
                      src={item?.image}
                      alt={item?.title}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <i className={`${item?.icon} text-sm`} aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="bento-pill mb-5">Explore</p>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  <i
                    className="fa-solid fa-chevron-right text-accent-orange text-[10px] w-4 text-center"
                    aria-hidden="true"
                  />
                  <Link
                    href={item.link}
                    className="text-sm text-bento-ink-soft hover:text-bento-ink transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bento-pill mb-5">More</p>
            <ul className="space-y-3">
              {moreLinks.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  <i
                    className="fa-solid fa-chevron-right text-accent-orange text-[10px] w-4 text-center"
                    aria-hidden="true"
                  />
                  <Link
                    href={item.link}
                    className="text-sm text-bento-ink-soft hover:text-bento-ink transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bento-pill mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-bento-ink-soft">
              <li className="flex items-center gap-2.5 mb-3">
                <i
                  className="fa-solid fa-location-dot text-accent-orange text-sm w-4 text-center shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={siteRegulars.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bento-ink transition-colors"
                >
                  {fiscalAddress}
                </a>
              </li>
              {landlineNumbers.length > 0 && (
                <li className="flex items-center gap-2.5">
                  <i
                    className="fa-solid fa-phone text-accent-orange text-sm w-4 text-center"
                    aria-hidden="true"
                  />
                  {landlineNumbers.map((number, index) => (
                    <a
                      key={index}
                      href={`tel:${number}`}
                      className="hover:text-bento-ink transition-colors"
                    >
                      {number}
                    </a>
                  ))}
                </li>
              )}
              {phoneNumbers.length > 0 && (
                <li className="flex items-center gap-2.5">
                  <i
                    className="fa-solid fa-mobile-screen text-accent-orange text-sm w-4 text-center"
                    aria-hidden="true"
                  />
                  {phoneNumbers.map((number, index) => (
                    <a
                      key={index}
                      href={`tel:${number.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-bento-ink transition-colors"
                    >
                      {number}
                    </a>
                  ))}
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <i
                  className="fa-solid fa-envelope text-accent-orange text-sm w-4 text-center"
                  aria-hidden="true"
                />
                {emailAddresses.map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bento-ink transition-colors break-all"
                  >
                    {email}
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-bento-ink-soft">
          <p>
            &copy; {new Date().getFullYear()} {siteRegulars?.sitename || SITE_FALLBACK.name}. All rights reserved.
          </p>
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
