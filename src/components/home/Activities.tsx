import { Mountain, Compass, Landmark, Building2, Users, Waves, type LucideIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { experiences } from "@/data/hotel";

const iconMap: Record<string, LucideIcon> = {
  Hiking: Mountain,
  Adventure: Compass,
  "Cultural Experience": Landmark,
  "City Safari": Building2,
  "Family Activities": Users,
  "Water Activities": Waves,
};

export default function Activities() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-8 px-2">
          <p className="bento-pill mb-4">Beyond Your Stay</p>
          <h2 className="bento-title text-3xl md:text-4xl mb-3">Activities &amp; Experiences</h2>
          <p className="text-bento-ink-soft text-sm max-w-lg">
            Ways to make the most of the Kathmandu Valley during your stay at
            Hotel Daaas.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((name, i) => {
            const Icon = iconMap[name];
            return (
              <Reveal key={name} delay={i * 60}>
                <div className="bento-card h-full p-6 md:p-7 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/55 border border-white/80 backdrop-blur-md shadow-sm flex items-center justify-center">
                    <Icon size={22} className="text-accent-orange" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-bento-ink">{name}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
