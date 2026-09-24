import Hero from "@/components/home/Hero";
import Rooms from "@/components/home/Rooms";
import Dining from "@/components/home/Dining";
import Facilities from "@/components/home/Facilities";
import WellnessExperiences from "@/components/home/WellnessExperiences";
import Testimonial from "@/components/home/Testimonial";
import Nearby from "@/components/home/Nearby";
import OtaPartners from "@/components/home/OtaPartners";
import ContactCta from "@/components/home/ContactCta";
import Hall from "@/components/home/Hall";
import Popup from "@/components/popup/Popup";
import { getPopupItems, getServicesGrouped } from "@/lib/data";
import { toHighlightItems } from "@/lib/listingItems";

export default async function Home() {
  const [popupData, { services }] = await Promise.all([getPopupItems(), getServicesGrouped()]);
  const highlightItems = toHighlightItems(services.slice(0, 6));

  return (
    <>
      <Popup popupData={popupData} />
      <Hero />
      <Rooms />
      <Dining />
      <Facilities highlightItems={highlightItems} />
      <Hall />
      <WellnessExperiences />
      <Nearby />
      <Testimonial />
      <OtaPartners />
      <ContactCta />
    </>
  );
}
