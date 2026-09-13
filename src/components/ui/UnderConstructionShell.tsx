import Image from "next/image";
import Link from "next/link";
import { SITE_FALLBACK } from "@/config/site";
import { getSiteRegulars, getSocialGroup } from "@/lib/data";

/**
 * Minimal chrome (logo + footer) for every page that stays reachable while
 * the CMS `site_under_contsruction` flag is on (see src/proxy.ts) — instead
 * of the full (main) Navbar, whose other links would all bounce back to
 * /under-construction right now.
 */
export default async function UnderConstructionShell({ children }: { children: React.ReactNode }) {
  const [siteRegulars, socialLinks] = await Promise.all([getSiteRegulars(), getSocialGroup(1)]);

  const logoUrl = siteRegulars?.logo_upload || "";
  const siteName = siteRegulars?.sitename || SITE_FALLBACK.name;

  return (
    <div className="min-h-screen flex flex-col bento-bg">
      <div className="flex flex-col items-center px-6 pt-14 pb-2">
        {logoUrl && (
          <Link href="/" className="relative block h-14 w-36 mb-6">
            <Image src={logoUrl} alt={siteName} fill className="object-contain" priority />
          </Link>
        )}
        <span className="block w-16 h-px bg-accent-orange" aria-hidden="true" />
      </div>

      <main className="flex-1">{children}</main>

      <footer className="py-6 border-t border-white/60">
        {socialLinks?.items?.length > 0 && (
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {socialLinks.items.map((item: any, i: number) => (
              <a
                key={i}
                href={item?.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item?.title || "Social media link"}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/50 border border-white/70 text-bento-ink-soft hover:text-white hover:bg-accent-orange hover:border-accent-orange transition-colors"
              >
                {item?.image ? (
                  <Image src={item.image} alt={item?.title || ""} width={20} height={20} />
                ) : (
                  <i className={`${item?.icon} text-sm`} aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        )}
        <p className="text-center text-xs text-bento-ink-soft/70">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
