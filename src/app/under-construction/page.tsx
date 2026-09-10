import type { Metadata } from "next";
import Link from "next/link";
import UnderConstructionShell from "@/components/ui/UnderConstructionShell";
import { site } from "@/config/site";
import { getMenuItems, getSiteRegulars } from "@/lib/data";

// Only ever reached via the proxy rewrite in src/proxy.ts while the CMS
// flag is on — never meant to be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function UnderConstructionPage() {
  // Menu container type 0 is the CMS's "coming soon" quick-links menu —
  // same convention as manakamanahillcrest, same shared backend. It also
  // doubles as the allow-list src/proxy.ts uses to decide what else stays
  // reachable.
  const [siteRegulars, quickLinks] = await Promise.all([getSiteRegulars(), getMenuItems(0)]);

  const siteName = siteRegulars?.sitename || site.name;
  const message =
    siteRegulars?.constrcution_content ||
    "We're putting the finishing touches on Hotel Daaas Kathmandu — check back soon.";

  return (
    <UnderConstructionShell>
      <div className="flex flex-col items-center text-center px-6 py-10">
        <h1 className="bento-title text-3xl md:text-5xl mb-5">{siteName}</h1>
        <p className="text-bento-ink-soft text-sm md:text-base max-w-lg mx-auto">{message}</p>

        {quickLinks.length > 0 && (
          <nav
            aria-label="Quick links"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10"
          >
            {quickLinks.map((item) =>
              Number(item.linktype) === 1 ? (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold tracking-[0.2em] uppercase text-bento-ink-soft hover:text-accent-orange border-b border-transparent hover:border-accent-orange pb-1 transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.link}
                  className="text-xs font-semibold tracking-[0.2em] uppercase text-bento-ink-soft hover:text-accent-orange border-b border-transparent hover:border-accent-orange pb-1 transition-colors"
                >
                  {item.title}
                </Link>
              )
            )}
          </nav>
        )}
      </div>
    </UnderConstructionShell>
  );
}
