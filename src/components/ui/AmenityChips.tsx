"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import type { AmenityItem } from "@/types";

/**
 * Amenity pill row that shows the first `max` items, with a "+N more" button
 * that expands the rest in place (and "Show less" to collapse again).
 */
export default function AmenityChips({ items, max = 5 }: { items: AmenityItem[]; max?: number }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const hiddenCount = Math.max(items.length - max, 0);
  const visible = expanded ? items : items.slice(0, max);

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {visible.map((a) => (
        <span
          key={a.title}
          className="flex items-center gap-1.5 text-[0.7rem] font-medium text-bento-ink-soft bg-white/60 border border-white/70 px-2.5 py-1.5 rounded-full"
        >
          {a.img ? (
            <span className="relative h-3.5 w-3.5 shrink-0 inline-block">
              <Image src={a.img} alt="" fill className="object-contain" sizes="14px" unoptimized />
            </span>
          ) : (
            <Check size={11} className="text-accent-orange shrink-0" />
          )}
          {a.title}
        </span>
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center text-[0.7rem] font-semibold text-accent-orange hover:text-bento-ink px-2.5 py-1.5 rounded-full cursor-pointer transition-colors"
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
