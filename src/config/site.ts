/**
 * Single source of truth for this property's identity. Update these values
 * to re-point the whole site — nav, footer, metadata, and contact links all
 * read from here.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hoteldaaas.com"
).replace(/\/$/, "");

export const site = {
  name: "Hotel Daaas Kathmandu",
  shortName: "Hotel Daaas",
  title: "Hotel Daaas Kathmandu | A New 4-Star Landmark in Balaju",
  description:
    "Hotel Daaas Kathmandu is a new 4-star hotel in Balaju, Kathmandu, offering 81 rooms, grand banquet halls, a wellness floor, all-day and Newari specialty dining, opening November 2026.",
  keywords:
    "Hotel Daaas Kathmandu, Hotel Daaas, hotel Balaju, 4 star hotel Kathmandu, hotel near Nagarjun National Park, Kathmandu hotel banquet",
  locale: "en",
  /** Schema.org @type(s) describing the business. */
  schemaType: ["Hotel", "LodgingBusiness"] as readonly string[],
} as const;

export const contact = {
  email: "hoteldaaas2083@gmail.com",
  phone: "01-5927618",
  phoneE164: "+97715927618",
  whatsapp: "9779841264958",
} as const;

/**
 * Physical location — feeds PostalAddress + GeoCoordinates JSON-LD.
 * TODO: geo coordinates are an approximate Balaju, Kathmandu placeholder —
 * confirm/replace with the hotel's exact coordinates before launch.
 */
export const address = {
  street: "Balaju",
  locality: "Kathmandu",
  region: "Bagmati Province",
  postalCode: "44600",
  /** ISO 3166-1 alpha-2. */
  country: "NP",
  full: "Balaju, Kathmandu 16, Nepal",
  geo: { latitude: 27.7332, longitude: 85.3038 },
  /** Google Maps "directions" share link — TODO: replace with the real pin. */
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Balaju+Kathmandu",
} as const;

/** Operational facts surfaced in LodgingBusiness structured data. */
export const business = {
  priceRange: "$$",
  currency: "NPR",
  starRating: 4,
  /** 24-hour clock — must match the guest-facing policy in src/data/hotel.ts. */
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
   * Aggregate review rating for rich results.
   *
   * ⚠ Google requires this to reflect REAL reviews that are also visible on
   *    the site. Hotel Daaas has not opened yet (opening Nov 2026) and has no
   *    reviews — keep this `null` until real, on-page reviews exist.
   */
  aggregateRating: null as {
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
    worstRating: string;
  } | null,
} as const;

// `icon` is a Font Awesome class string (e.g. "fa-brands fa-facebook-f") so
// these can later be swapped for CMS-managed values without changing markup.
export const social = [
  { name: "Facebook", href: "https://www.facebook.com/HotelDaaasKathmandu", icon: "fa-brands fa-facebook-f" },
  { name: "Instagram", href: "https://www.instagram.com/hotel_daaas_kathmandu/", icon: "fa-brands fa-instagram" },
  { name: "Linkedin", href: "https://www.linkedin.com/company/hotel-daaas-kathmandu/", icon: "fa-brands fa-linkedin" },
  { name: "TikTok", href: "https://www.tiktok.com/@hoteldaaaskathman", icon: "fa-brands fa-tiktok" },
] as const;

/**
 * Outbound links: booking engine + social profiles (used as schema `sameAs`).
 * TODO: no booking engine exists yet per the property factsheet — `booking`
 * points at the contact page until one is set up.
 */
export const links = {
  /** External booking engine URL ("Book Now"). */
  booking: "/contact-us",
  /** Public social profiles — strengthens entity recognition via `sameAs`. */
  social: social.map((s) => s.href),
} as const;

/**
 * CMS category parent_ids from the `subpackage` endpoint.
 * TODO: placeholder — set once a CMS is provisioned for this property.
 */
export const CATEGORY_IDS = {
  rooms: "5",
  events: "6",
  restaurant: "7",
} as const;

/**
 * `services` endpoint category `type` values — confirmed live 2026-09-07.
 * Not a universal CMS convention (this numbering is admin-assigned per
 * property; manakamanahillcrest's own instance uses these two numbers the
 * other way around) — treat as this deployment's data, not a fixed enum.
 */
export const SERVICE_TYPE_IDS = {
  facility: "2",
  service: "1",
} as const;

export interface NavChild {
  label: string;
  /** Omitted for a nested group trigger that only expands, doesn't navigate itself. */
  href?: string;
  /** One further level of nesting — a sub-menu within a top-level dropdown. */
  children?: readonly NavChild[];
}

export interface NavItem {
  label: string;
  /** Omitted for a dropdown-only parent (e.g. "More") that has no page of its own. */
  href?: string;
  children?: readonly NavChild[];
}

export const nav: readonly NavItem[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Rooms", href: "/rooms" },
  { label: "Dining", href: "/dining" },
  { label: "Events", href: "/events" },
  {
    label: "Services",
    children: [
      { label: "All Facilities", href: "/facilities" },
      { label: "Sauna & Steam", href: "/service/sauna-steam" },
      { label: "Gym", href: "/service/gym" },
      { label: "Swimming Pool", href: "/service/swimming-pool" },
      { label: "Jacuzzi", href: "/service/jacuzzi" },
      { label: "Hair Salon", href: "/service/hair-salon" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Offers", href: "/offers" },
  {
    label: "More",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Virtual Tour", href: "/virtual-tour" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
] as const;
