"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import flagEn from "@/assets/flag/eng.png";
import flagZh from "@/assets/flag/china.png";
import flagRu from "@/assets/flag/russia.png";
import flagFr from "@/assets/flag/france.png";
import flagDe from "@/assets/flag/german.png";
import flagEs from "@/assets/flag/spain.png";
import flagAr from "@/assets/flag/arabic.png";
import flagHi from "@/assets/flag/india.png";
import flagNe from "@/assets/flag/nepal.png";

/**
 * Google's legacy "Website Translator" widget, driven headlessly — it's
 * discontinued as a supported product, but the `translate_a/element.js`
 * loader still works today and is still how most sites doing this trick pull
 * it off (notably: it translates the *rendered* DOM, not the CMS's own data,
 * so it covers every live CMS-sourced string on this site for free, with no
 * backend/CMS changes). One entry per flag asset available under
 * src/assets/flag — add another import + LANGUAGES entry for more.
 */
const LANGUAGES = [
  { code: "en", label: "English", flag: flagEn },
  { code: "ne", label: "नेपाली", flag: flagNe },
  { code: "zh-CN", label: "中文", flag: flagZh },
  { code: "ru", label: "Русский", flag: flagRu },
  { code: "fr", label: "Français", flag: flagFr },
  { code: "de", label: "Deutsch", flag: flagDe },
  { code: "es", label: "Español", flag: flagEs },
  { code: "ar", label: "العربية", flag: flagAr },
  { code: "hi", label: "हिन्दी", flag: flagHi },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

/** Best-effort guess at a visitor's language from their IP's country — only
 * used to pick a sensible default on a visitor's very first visit (no
 * `googtrans` cookie yet); a manual pick always wins afterwards. */
const COUNTRY_TO_LANG: Record<string, LangCode> = {
  NP: "ne",
  CN: "zh-CN",
  HK: "zh-CN",
  TW: "zh-CN",
  RU: "ru",
  FR: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
  OM: "ar",
  BH: "ar",
  IN: "hi",
};

let scriptInjected = false;
let patchedRemoveChild = false;

/**
 * Google's widget mutates text nodes directly; React doesn't know about
 * those mutations and can crash with "Failed to execute 'removeChild'/
 * 'insertBefore' on 'Node'" when it later tries to reconcile a subtree
 * Google already altered. This is the standard, widely-used workaround:
 * make both DOM methods tolerate "that node isn't actually there anymore"
 * instead of throwing.
 */
function patchDomForGoogleTranslate() {
  if (patchedRemoveChild || typeof Node === "undefined") return;
  patchedRemoveChild = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[LanguageSwitcher] Ignored a removeChild mismatch caused by Google Translate.");
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[LanguageSwitcher] Ignored an insertBefore mismatch caused by Google Translate.");
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

function getGoogleLangFromCookie(): string | null {
  const match = document.cookie.match(/(^|;\s*)googtrans=([^;]+)/);
  if (!match) return null;
  const parts = decodeURIComponent(match[2]).split("/");
  return parts.length === 3 ? parts[2] : null;
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("en");
  const readyRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const translateTo = (lang: string) => {
    if (!readyRef.current) {
      setTimeout(() => translateTo(lang), 300);
      return;
    }
    const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (!combo) {
      setTimeout(() => translateTo(lang), 300);
      return;
    }
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
    setCurrent(lang);
  };

  useEffect(() => {
    patchDomForGoogleTranslate();

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
      readyRef.current = true;
    };

    if (!scriptInjected) {
      scriptInjected = true;
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).google?.translate) {
      readyRef.current = true;
    }

    const existing = getGoogleLangFromCookie();
    if (existing) {
      setCurrent(existing);
      return;
    }

    // No standing choice yet — this is a first visit, so guess a default
    // from the visitor's IP country. Never overrides an explicit pick.
    fetch("https://get.geojs.io/v1/ip/country.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { country?: string } | null) => {
        const lang = data?.country ? COUNTRY_TO_LANG[data.country] : undefined;
        if (lang) translateTo(lang);
      })
      .catch(() => {
        // Geo lookup failing just means we stay on English — not fatal.
      });
  }, []);

  const activeLabel = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    // translate="no"/.notranslate: this is UI chrome, not page content — and
    // letting Google Translate walk it causes a silent React/DOM conflict
    // (see patchDomForGoogleTranslate above) that can make the whole control
    // vanish after a navigation. Keeping it out of Google's reach avoids that
    // at the source instead of only patching around the symptom.
    <div ref={rootRef} className="notranslate relative" translate="no">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-1.5 text-[0.8rem] font-medium px-2.5 py-2 rounded-full transition-colors cursor-pointer ${
          open ? "text-bento-ink bg-white/70" : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/70"
        }`}
      >
        <Image src={activeLabel.flag} alt="" width={18} height={13} className="rounded-xs object-cover" />
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-48 max-h-80 overflow-y-auto rounded-2xl border border-white/50 bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
          role="menu"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              onClick={() => {
                translateTo(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                current === lang.code ? "bg-accent-orange/15 text-accent-orange font-semibold" : "text-bento-ink hover:bg-bento-ink/5"
              }`}
            >
              <Image src={lang.flag} alt="" width={20} height={14} className="rounded-xs object-cover" />
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Visually hidden — Google needs this element in the DOM, not display:none. */}
      <div id="google_translate_element" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} />
    </div>
  );
}
