"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker, type DayButtonProps, type ChevronProps } from "react-day-picker";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function GlassDayButton({ day: _day, modifiers, className: _className, ...rest }: DayButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors ${
        modifiers.selected
          ? "bg-accent-orange text-white font-semibold"
          : modifiers.today
            ? "text-accent-orange font-bold hover:bg-accent-orange/15"
            : modifiers.outside
              ? "text-bento-ink-soft/30"
              : "text-bento-ink hover:bg-accent-orange/15"
      } ${modifiers.disabled ? "pointer-events-none opacity-30" : ""}`}
    />
  );
}

function GlassChevron({ orientation }: ChevronProps) {
  return orientation === "left" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />;
}

export default function DateField({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // The trigger can sit inside an animated (framer-motion) ancestor, which
  // creates its own stacking context — an absolutely-positioned popover
  // nested inside it can never paint above unrelated siblings no matter how
  // high its z-index is. Portal to <body> instead, positioned by the
  // trigger's real viewport coordinates, so it escapes every ancestor's
  // stacking context and overflow clipping entirely.
  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setCoords({ top: rect.bottom + 8, left: rect.left });
    }
    updatePosition();

    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    }

    // Any scroll (window or a nested scroll container — capture phase sees
    // both) invalidates the popover's fixed position, so just close it.
    function onScrollOrResize() {
      setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/70 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm text-left transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30"
      >
        <span className={value ? "text-bento-ink" : "text-bento-ink-soft/60"}>
          {value ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : label}
        </span>
        <CalendarDays size={15} className="text-accent-orange shrink-0" />
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ position: "fixed", top: coords.top, left: coords.left }}
            className="z-100 rounded-2xl border border-white/70 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(16,24,40,0.35)] p-3"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              disabled={minDate ? { before: minDate } : undefined}
              components={{ DayButton: GlassDayButton, Chevron: GlassChevron }}
              classNames={{
                months: "flex flex-col",
                month: "space-y-2",
                month_caption: "flex items-center justify-center px-9 mb-1",
                caption_label: "text-sm font-semibold text-bento-ink",
                nav: "flex items-center justify-between absolute inset-x-1 top-1",
                button_previous:
                  "w-7 h-7 flex items-center justify-center rounded-full hover:bg-accent-orange/10 text-bento-ink-soft transition-colors",
                button_next:
                  "w-7 h-7 flex items-center justify-center rounded-full hover:bg-accent-orange/10 text-bento-ink-soft transition-colors",
                month_grid: "border-collapse",
                weekdays: "flex",
                weekday: "w-9 h-9 flex items-center justify-center text-[0.6rem] font-semibold text-bento-ink-soft/70 uppercase",
                week: "flex",
                day: "p-0",
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
