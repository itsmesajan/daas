import { getMenuItems, getSiteRegulars } from "@/lib/data";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [menuItems, siteRegulars] = await Promise.all([getMenuItems(1), getSiteRegulars()]);

  return (
    <NavbarClient
      site={siteRegulars}
      menu={menuItems}
      phone={siteRegulars?.contact_info}
      phoneE164={siteRegulars?.landline_info?.trim()}
      bookingUrl={siteRegulars?.booking_code}
    />
  );
}
