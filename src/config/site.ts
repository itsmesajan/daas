/**
 * Static structural constants — the only things that cannot come from the CMS:
 *   - SITE_URL        : needs to be available at build time for `metadataBase`
 *   - CATEGORY_IDS    : admin-assigned numeric keys the CMS itself defines
 *   - ARTICLE_IDS     : same
 *   - SERVICE_TYPE_IDS: same
 *   - NavChild/NavItem: TypeScript interfaces for the CMS menu shape
 *
 * Runtime identity data (name, title, contact, logo, social links …) all come
 * from the `siteregulars` CMS endpoint via `getSiteRegulars()` in `@/lib/data`.
 * Hardcoded strings below are emergency fallbacks only — they are only shown
 * when the API is unreachable.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hoteldaaas.com"
).replace(/\/$/, "");

/** Emergency static fallbacks — only used when getSiteRegulars() fails. */
export const SITE_FALLBACK = {
  name: "Hotel Daaas Kathmandu",
  shortName: "Hotel Daaas",
  title: "Hotel Daaas Kathmandu | A New 4-Star Landmark in Balaju",
  description:
    "Hotel Daaas Kathmandu is a new 4-star hotel in Balaju, Kathmandu, offering 81 rooms, grand banquet halls, a wellness floor, all-day and Newari specialty dining, opening November 2026.",
  keywords:
    "Hotel Daaas Kathmandu, Hotel Daaas, hotel Balaju, 4 star hotel Kathmandu, hotel near Nagarjun National Park, Kathmandu hotel banquet",
  locale: "en",
  phone: "01-5927618",
  phoneE164: "+97715927618",
  email: "info@hoteldaaas.com",
  whatsapp: "9779841264958",
  bookingUrl: "/contact-us",
} as const;

/** Schema.org @type(s) describing the business — not a CMS field, fixed by schema spec. */
export const SCHEMA_TYPES = ["Hotel", "LodgingBusiness"] as readonly string[];

/** Operational facts for JSON-LD — not CMS-managed, reflect real property specs. */
export const business = {
  priceRange: "$$",
  currency: "NPR",
  starRating: 4,
  checkinTime: "14:00",
  checkoutTime: "11:00",
  numberOfRooms: 81,
  languages: ["English", "Nepali"],
  amenities: [
    "Swimming Pool",
    "Fitness Center",
    "Jacuzzi",
    "Sauna & Steam",
    "Free WiFi",
    "Restaurant",
    "24-Hour Room Service",
    "Valet Parking",
    "EV Charging Point",
    "Airport Pick-up / Drop",
  ],
  /**
   * ⚠ Google requires this to reflect REAL reviews visible on the site.
   * Keep null until real, on-page reviews exist.
   */
  aggregateRating: null as {
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
    worstRating: string;
  } | null,
} as const;

/** Static address facts — not stored in siteregulars, fixed by property location. */
export const address = {
  street: "Balaju",
  locality: "Kathmandu",
  region: "Bagmati Province",
  postalCode: "44600",
  country: "NP",
  full: "Balaju, Kathmandu 16, Nepal",
  geo: { latitude: 27.7332, longitude: 85.3038 },
  mapUrl: "https://maps.app.goo.gl/cR1e6XET4SXndWS88",
} as const;

/**
 * CMS category parent_ids from the `subpackage` endpoint.
 */
export const CATEGORY_IDS = {
  rooms: "5",
  events: "6",
  restaurant: "7",
} as const;

/**
 * CMS `article_all` ids — stable numeric ids, not slugs.
 */
export const ARTICLE_IDS = {
  aboutUs: "1",
} as const;

/**
 * `services` endpoint category `type` values.
 */
export const SERVICE_TYPE_IDS = {
  facility: "2",
  service: "1",
} as const;

export interface NavChild {
  label: string;
  href?: string;
  children?: readonly NavChild[];
}

export interface NavItem {
  label: string;
  href?: string;
  children?: readonly NavChild[];
}
