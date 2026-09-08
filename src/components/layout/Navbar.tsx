"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import iconMark from "@/assets/logo.png";
import { nav, contact, links, type NavItem, type NavChild } from "@/config/site";

/** In-page anchors (e.g. "/#wellness") never match a real pathname. */
function isActivePath(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Recurses into one further level of nesting (e.g. "Facilities" inside "More"). */
function isChildActive(pathname: string, child: NavChild): boolean {
  if (child.href && isActivePath(pathname, child.href)) return true;
  return child.children?.some((c) => isChildActive(pathname, c)) ?? false;
}

function isGroupActive(pathname: string, item: NavItem): boolean {
  if (item.href && isActivePath(pathname, item.href)) return true;
  return item.children?.some((c) => isChildActive(pathname, c)) ?? false;
}

export default function BentoNavbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Shared by both the desktop dropdown's nested sub-menu and the mobile
  // drawer's two accordion levels — labels are unique across the whole nav
  // tree, so one Set safely tracks "expanded" groups at any depth.
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const desktopNavRef = useRef<HTMLElement>(null);

  // Close any open menu on navigation. Reset during render (comparing against
  // the previous render's pathname) rather than in an effect, since setState
  // synchronously inside an effect body triggers an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setOpenDropdown(null);
    setOpenGroups(new Set());
  }

  useEffect(() => {
    if (!openDropdown) return;

    function onClickOutside(e: MouseEvent) {
      if (!desktopNavRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [openDropdown]);

  function toggleDropdown(label: string) {
    setOpenDropdown((v) => (v === label ? null : label));
    setOpenGroups(new Set());
  }

  function toggleGroup(label: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card px-5 md:px-7 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src={iconMark} alt="" width={1500} height={1500} className="w-60 h-auto" priority />
        </Link>

        <nav ref={desktopNavRef} className="hidden lg:flex items-center gap-0.5">
          {nav.map((item) => {
            const active = isGroupActive(pathname, item);

            if (item.children && item.children.length > 0) {
              const isOpen = openDropdown === item.label;
              return (
                <div key={item.label} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.label)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1 text-[0.8rem] font-medium px-2.5 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                      active || isOpen ? "text-bento-ink bg-white/70" : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/70"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56">
                      <div className="bento-card p-1.5 flex flex-col gap-0.5 shadow-xl max-h-[70vh] overflow-y-auto">
                        {item.children.map((child) => {
                          if (child.children && child.children.length > 0) {
                            const isSubOpen = openGroups.has(child.label);
                            const subActive = isChildActive(pathname, child);
                            return (
                              <div key={child.label}>
                                <button
                                  type="button"
                                  onClick={() => toggleGroup(child.label)}
                                  aria-haspopup="true"
                                  aria-expanded={isSubOpen}
                                  className={`w-full flex items-center justify-between gap-2 text-[0.8rem] px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                                    subActive || isSubOpen
                                      ? "text-bento-ink bg-white/70 font-medium"
                                      : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                                  }`}
                                >
                                  {child.label}
                                  <ChevronDown
                                    size={12}
                                    className={`transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                                {isSubOpen && (
                                  <div className="mt-0.5 mb-1 ml-2.5 pl-2.5 border-l border-bento-ink/10 flex flex-col gap-0.5">
                                    {child.children.map((grandchild) => {
                                      const gActive = isActivePath(pathname, grandchild.href!);
                                      return (
                                        <Link
                                          key={grandchild.href}
                                          href={grandchild.href!}
                                          onClick={() => setOpenDropdown(null)}
                                          aria-current={gActive ? "page" : undefined}
                                          className={`text-[0.78rem] px-3 py-2 rounded-lg transition-colors ${
                                            gActive
                                              ? "text-bento-ink bg-white/70 font-medium"
                                              : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                                          }`}
                                        >
                                          {grandchild.label}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          const childActive = isActivePath(pathname, child.href!);
                          return (
                            <Link
                              key={child.href}
                              href={child.href!}
                              onClick={() => setOpenDropdown(null)}
                              aria-current={childActive ? "page" : undefined}
                              className={`text-[0.8rem] px-3.5 py-2.5 rounded-xl transition-colors ${
                                childActive
                                  ? "text-bento-ink bg-white/70 font-medium"
                                  : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap text-[0.8rem] font-medium px-2.5 py-2 rounded-full transition-colors ${
                  active ? "text-bento-ink bg-white/70" : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href={links.booking} className="hidden lg:inline-flex  py-3 px-5 text-sm rounded-full text-white bg-[#1176bb]">
          Book Now
        </Link>

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
        <div className="lg:hidden max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card mt-3 px-6 py-6 flex flex-col gap-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
          {nav.map((item) => {
            const active = isGroupActive(pathname, item);

            if (item.children && item.children.length > 0) {
              const isGroupOpen = openGroups.has(item.label);
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={isGroupOpen}
                    className={`w-full flex items-center justify-between text-sm font-medium ${
                      active ? "text-accent-orange" : "text-bento-ink"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isGroupOpen && (
                    <div className="mt-3 pl-4 flex flex-col gap-3 border-l border-white/70">
                      {item.children.map((child) => {
                        if (child.children && child.children.length > 0) {
                          const isSubOpen = openGroups.has(child.label);
                          const subActive = isChildActive(pathname, child);
                          return (
                            <div key={child.label}>
                              <button
                                type="button"
                                onClick={() => toggleGroup(child.label)}
                                aria-expanded={isSubOpen}
                                className={`w-full flex items-center justify-between text-sm ${
                                  subActive ? "text-accent-orange" : "text-bento-ink-soft"
                                }`}
                              >
                                {child.label}
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              {isSubOpen && (
                                <div className="mt-3 pl-4 flex flex-col gap-3 border-l border-white/50">
                                  {child.children.map((grandchild) => (
                                    <Link
                                      key={grandchild.href}
                                      href={grandchild.href!}
                                      onClick={() => setOpen(false)}
                                      aria-current={isActivePath(pathname, grandchild.href!) ? "page" : undefined}
                                      className={`text-sm ${
                                        isActivePath(pathname, grandchild.href!) ? "text-accent-orange" : "text-bento-ink-soft"
                                      }`}
                                    >
                                      {grandchild.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={child.href}
                            href={child.href!}
                            onClick={() => setOpen(false)}
                            aria-current={isActivePath(pathname, child.href!) ? "page" : undefined}
                            className={`text-sm ${
                              isActivePath(pathname, child.href!) ? "text-accent-orange" : "text-bento-ink-soft"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium ${active ? "text-accent-orange" : "text-bento-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a href={`tel:${contact.phoneE164}`} className="text-sm text-bento-ink-soft">
            {contact.phone}
          </a>
        </div>
      )}
    </header>
  );
}
