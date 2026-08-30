"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import iconMark from "@/assets/logo.png";
import { nav, contact } from "@/config/site";

export default function BentoNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card px-5 md:px-7 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src={iconMark} alt="" width={1500} height={1500} className="w-60 h-auto" priority />
          {/* <span className="bento-title text-sm">Hotel Daaas</span> */}
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.78rem] font-medium text-bento-ink-soft hover:text-bento-ink px-3 py-2 rounded-full hover:bg-white/70 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="hidden lg:inline-flex  py-3 px-5 text-sm rounded-full text-white bg-[#1176bb]">
          Book Now
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-bento-ink"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card mt-3 px-6 py-6 flex flex-col gap-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-bento-ink"
            >
              {item.label}
            </a>
          ))}
          <a href={`tel:${contact.phoneE164}`} className="text-sm text-bento-ink-soft">
            {contact.phone}
          </a>
        </div>
      )}
    </header>
  );
}
