import Image from "next/image";
import { MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { nearbyLocations } from "@/data/hotel";

// Sourced from Wikimedia Commons and checked against each article's own
// infobox photo — the earlier Unsplash picks here were wrong (two showed an
// unrelated Himalayan trekking scene and a mountain village, two more were
// dead links). Wikimedia only serves a fixed set of thumbnail widths, hence
// the specific "500px-" in each URL.
const images: Record<string, string> = {
  "Nagarjun National Park":
    "https://images.unsplash.com/photo-1687743959595-cbe592478f9b?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Swayambhunath Stupa":
    "https://images.unsplash.com/photo-1560747643-308411529b15?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Kathmandu Durbar Square":
    "https://images.unsplash.com/photo-1706188370039-e0cf9bd6ea16?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Pashupatinath Temple":
    "https://images.unsplash.com/photo-1764049768307-3c6a95d7f3b5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Boudhanath Stupa":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Boudhanath_stupa_%2C_Kathmandu%2C_Nepal.jpg/500px-Boudhanath_stupa_%2C_Kathmandu%2C_Nepal.jpg",
  "Tribhuvan International Airport":
    "https://images.unsplash.com/photo-1704870872623-472e2568a1ac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function Nearby() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-6 px-2">
          <p className="bento-pill mb-4">The Valley</p>
          <h2 className="bento-title text-3xl md:text-4xl mb-3">Discover Kathmandu</h2>
          <p className="text-bento-ink-soft text-sm max-w-lg">
            Situated in Balaju, Hotel Daaas keeps the valley&apos;s heritage
            and natural beauty within easy reach. Distances shown are
            approximate.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearbyLocations.map((loc, i) => (
            <Reveal key={loc.name} delay={i * 50}>
              <div className="bento-card group overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={images[loc.name]}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                  <span className="absolute bottom-3 left-3 bento-pill !bg-white/85">
                    {loc.distance}
                  </span>
                </div>
                <div className="p-4 flex items-center gap-2.5">
                  <MapPin size={15} className="text-accent-orange shrink-0" />
                  <p className="text-sm font-semibold text-bento-ink">{loc.name}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
