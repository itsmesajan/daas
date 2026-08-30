"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { contact } from "@/config/site";

interface FloatingButtonsProps {
  whatsappNumber?: string;
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

function PanoramaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
    </svg>
  );
}

/** Shared circular fab shell: consistent size, glass chrome, focus ring, and a
 * hover/focus tooltip (desktop only — mobile has no hover, aria-label covers it). */
function FabButton({
  href,
  external = false,
  onClick,
  label,
  className = "",
  children,
}: {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const shared =
    "group relative flex w-12 h-12 items-center justify-center rounded-full " +
    "shadow-[0_18px_40px_-16px_rgba(16,24,40,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] " +
    "backdrop-blur-md backdrop-saturate-150 border transition-all duration-300 hover:scale-110 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 " +
    className;

  const tooltip = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-full mr-3 hidden translate-x-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium text-bento-ink opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
    >
      {label}
    </span>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={shared}>
        {tooltip}
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label={label} className={shared}>
        {tooltip}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={shared}>
      {tooltip}
      {children}
    </button>
  );
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, x: 16 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function FloatingButtons({ whatsappNumber }: FloatingButtonsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  const cleanNumber = whatsappNumber
    ? whatsappNumber.replace(/[^0-9]/g, "")
    : contact.whatsapp;

  return (
    <motion.div
      variants={listVariants}
      initial={reduceMotion ? "visible" : "hidden"}
      animate="visible"
      className="fixed right-4 md:right-6 bottom-6 z-50 flex flex-col items-center gap-3"
    >
      {/* 360° Virtual Tour */}
      <motion.div variants={itemVariants}>
        <FabButton
          href="/virtual-tour"
          label="360° Virtual Tour"
          className="border-gray-500/20 bg-white/45 text-bento-ink hover:border-accent-orange/50 hover:bg-white/70 hover:text-accent-orange"
        >
          <span className="flex flex-col items-center justify-center gap-0">
            <PanoramaIcon />
            <span className="text-[0.5rem] font-bold leading-none">360°</span>
          </span>
        </FabButton>
      </motion.div>

      {/* WhatsApp */}
      <motion.div variants={itemVariants} className="relative">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/60 motion-reduce:hidden"
        />
        <FabButton
          href={`https://wa.me/${cleanNumber}`}
          external
          label="Chat on WhatsApp"
          className="border-white/50 bg-[#25d366]/60 text-white hover:border-white/70 hover:bg-[#25d366]/80"
        >
          <WhatsAppIcon />
        </FabButton>
      </motion.div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <FabButton
              onClick={scrollToTop}
              label="Back to top"
              className="border-gray-500/20 bg-white/45 text-bento-ink hover:border-accent-orange/50 hover:bg-white/70 hover:text-accent-orange"
            >
              <ArrowUpIcon />
            </FabButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
