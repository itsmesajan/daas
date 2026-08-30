"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SliderControls({
  index,
  count,
  onChange,
  labels,
  variant = "dots",
}: {
  index: number;
  count: number;
  onChange: (i: number) => void;
  labels?: readonly string[];
  /** "dots" — clickable dot indicators. "counter" — "N / Total" between arrows. */
  variant?: "dots" | "counter";
}) {
  return (
    <div className="flex items-center gap-5">
      {variant === "dots" ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels?.[i] ? `Show ${labels[i]}` : `Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => onChange(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-accent-orange" : "w-1.5 bg-bento-ink/20 hover:bg-bento-ink/40"
              }`}
            />
          ))}
        </div>
      ) : (
        <span className="text-sm text-bento-ink-soft tabular-nums">
          <span className="text-bento-ink font-semibold">{String(index + 1).padStart(2, "0")}</span>
          {" / "}
          {String(count).padStart(2, "0")}
        </span>
      )}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => onChange((index - 1 + count) % count)}
          className="w-10 h-10 rounded-full bg-white/60 border border-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronLeft size={17} className="text-bento-ink" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => onChange((index + 1) % count)}
          className="w-10 h-10 rounded-full bg-white/60 border border-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronRight size={17} className="text-bento-ink" />
        </button>
      </div>
    </div>
  );
}
