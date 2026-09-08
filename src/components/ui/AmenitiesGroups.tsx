import Image from "next/image";
import { Check } from "lucide-react";
import type { AmenityGroup } from "@/types";

export default function AmenitiesGroups({ groups }: { groups: AmenityGroup[] }) {
  return (
    <div className="flex flex-col gap-5 mb-6">
      {groups.map((group) => (
        <div key={group.group_title}>
          <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70 mb-3">
            {group.group_title}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span key={item.title} className="flex items-center gap-1.5 bento-pill !py-1.5">
                {item.img ? (
                  <span className="relative h-3.5 w-3.5 shrink-0">
                    {/* CMS-hosted icon, size negligible — skip the optimizer */}
                    <Image src={item.img} alt="" fill className="object-contain" sizes="14px" unoptimized />
                  </span>
                ) : (
                  <Check size={11} className="text-accent-orange shrink-0" />
                )}
                {item.title}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
