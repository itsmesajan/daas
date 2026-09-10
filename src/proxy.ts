import { NextRequest, NextResponse } from "next/server";
import { getMenuItems, getSiteRegulars } from "@/lib/data";

// Pages with no (main) counterpart that stay reachable during construction
// regardless of the CMS allow-list — /reach-us (contact) and /work-with-us
// (careers) both render through UnderConstructionShell, not the full Navbar.
const ALWAYS_ALLOWED_ROUTES = new Set(["/reach-us", "/work-with-us"]);

/**
 * Hotel Daaas hasn't opened yet — while the CMS's
 * `siteregulars.site_under_contsruction` flag (typo preserved from the CMS
 * field name; same shared backend as manakamanahillcrest) is set to "1",
 * every route is rewritten to the coming-soon page UNLESS it's allow-listed.
 * The allow-list is the CMS's own "coming soon" menu (container type 0) —
 * the same menu rendered as quick links on /under-construction itself, so
 * adding a link there is enough to open up a page; no code change needed.
 * Unlike the reference project's version of this gate, allow-listed pages
 * render through their normal (main) route rather than a separate /uc/<path>
 * — daashotel doesn't have a second, less-finished site to hide behind one.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/under-construction" || ALWAYS_ALLOWED_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const siteRegulars = await getSiteRegulars();
  if (siteRegulars?.site_under_contsruction !== "1") {
    return NextResponse.next();
  }

  const menu = await getMenuItems(0);
  const allowedPaths = new Set(
    menu.map((item) => item.link).filter((link): link is string => Boolean(link) && link !== "/")
  );

  if (allowedPaths.has(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/under-construction", request.url));
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
