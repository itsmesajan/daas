import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-col min-h-screen bento-bg overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
