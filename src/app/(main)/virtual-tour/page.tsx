import type { Metadata } from "next";
import { Compass } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import VirtualTourViewer from "@/components/virtual-tour/VirtualTourViewer";
import { buildMetadata } from "@/lib/metadata";
import { getVirtualTour } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "virtual-tour",
    { title: "360° Virtual Tour | Hotel Daaas Kathmandu", description: "Explore Hotel Daaas Kathmandu with our 360° virtual tour." },
    "/virtual-tour"
  );
}

export default async function VirtualTourPage() {
  const tour = await getVirtualTour();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">360° Virtual Tour</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Explore Hotel Daaas</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Step inside and look around — drag to explore each space in 360°.
          </p>
        </Reveal>

        {tour ? (
          <Reveal delay={100}>
            <VirtualTourViewer data={tour} />
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <div className="bento-card p-10 md:p-14 text-center max-w-xl mx-auto">
              <Compass size={28} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
              <h2 className="bento-title text-xl mb-2">Virtual tour coming soon</h2>
              <p className="text-bento-ink-soft text-sm">
                We&apos;re preparing a 360° tour of the property — check back soon.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
