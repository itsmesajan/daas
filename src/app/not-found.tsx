import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFoundCard from "@/components/ui/NotFoundCard";

// Next.js only ever uses the ROOT not-found.tsx for a genuinely unmatched
// URL (one that doesn't correspond to any route at all) — it can't nest
// inside (main)/layout.tsx for that case, so Navbar/Footer are rendered
// directly here instead of relied on from the layout.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bento-bg">
        <NotFoundCard />
      </main>
      <Footer />
    </>
  );
}
