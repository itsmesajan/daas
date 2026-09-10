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
import { getPopupItems } from "@/lib/data";

export default async function Home() {
  const popupData = await getPopupItems();

  return (
    <>
      <Popup popupData={popupData} />
      <Hero />
      <Rooms />
      <Dining />
      <Facilities />
      <Hall />
      <WellnessExperiences />
      <Nearby />
      <Testimonial />
      <OtaPartners />
      <ContactCta />
    </>
  );
}
