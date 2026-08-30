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
  locale: "en",
} as const;

export const contact = {
  email: "hoteldaaas2083@gmail.com",
  phone: "01-5927618",
  phoneE164: "+97715927618",
  whatsapp: "9779841264958",
} as const;

export const address = {
  locality: "Kathmandu",
  country: "Nepal",
  full: "Balaju, Kathmandu 16, Nepal",
} as const;

// `icon` is a Font Awesome class string (e.g. "fa-brands fa-facebook-f") so
// these can later be swapped for CMS-managed values without changing markup.
export const social = [
  { name: "Facebook", href: "https://facebook.com/hoteldaaas", icon: "fa-brands fa-facebook-f" },
  { name: "Instagram", href: "https://instagram.com/hoteldaaas", icon: "fa-brands fa-instagram" },
  { name: "WhatsApp", href: `https://wa.me/${contact.whatsapp}`, icon: "fa-brands fa-whatsapp" },
  { name: "TikTok", href: "https://tiktok.com/@hoteldaaas", icon: "fa-brands fa-tiktok" },
] as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "Dining", href: "#dining" },
  { label: "Events", href: "#events" },
  { label: "Wellness", href: "#wellness" },
  { label: "Contact", href: "#contact" },
] as const;
