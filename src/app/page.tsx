import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Rooms from "@/components/home/Rooms";
import Dining from "@/components/home/Dining";
import Facilities from "@/components/home/Facilities";
import WellnessExperiences from "@/components/home/WellnessExperiences";
import Activities from "@/components/home/Activities";
import Nearby from "@/components/home/Nearby";
import OtaPartners from "@/components/home/OtaPartners";
import ContactCta from "@/components/home/ContactCta";
import Hall from "@/components/home/Hall";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-col min-h-screen bento-bg">
        <Hero />
        <Rooms />
        <Dining />
        <Facilities />
        <Hall />
        <Activities />
        <WellnessExperiences />
        <Nearby />
        <OtaPartners />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
