import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-col min-h-screen bento-bg">
        {children}
      </main>
      <Footer />
    </>
  );
}
