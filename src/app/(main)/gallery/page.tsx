import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { buildMetadata } from "@/lib/metadata";
import { getGalleryImages } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "gallery",
    { title: "Gallery | Hotel Daaas Kathmandu", description: "Photos of Hotel Daaas Kathmandu — rooms, dining, events and the property." },
    "/gallery"
  );
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Gallery</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">See Hotel Daaas</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            A closer look at our rooms, dining venues, and event spaces.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <GalleryGrid items={images} />
        </Reveal>
      </div>
    </section>
  );
}
