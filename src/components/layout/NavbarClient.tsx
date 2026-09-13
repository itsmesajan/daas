"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import NavLink from "./NavLink";
import MobileMenu from "./MobileMenu";
import { SITE_FALLBACK } from "@/config/site";
import { NavbarClientProps, NavItem } from "@/types";

/** In-page anchors (e.g. "/#wellness") never match a real pathname. */
function isActivePath(pathname: string, href: string): boolean {
  if (!href) return false;
  if (href.includes("#")) return false;
  const normalizedHref = href.replace(/\/\/+/g, '/');
  if (normalizedHref === "/") return pathname === "/";
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
}

/** Recurses into one further level of nesting (e.g. "Facilities" inside "More"). */
function isChildActive(pathname: string, child: NavItem): boolean {
  if (child.link && isActivePath(pathname, child.link)) return true;
  return child.subLinks?.some((c) => isChildActive(pathname, c)) ?? false;
}

function isGroupActive(pathname: string, item: NavItem): boolean {
  if (item.link && isActivePath(pathname, item.link)) return true;
  return item.subLinks?.some((c) => isChildActive(pathname, c)) ?? false;
}



export default function BentoNavbar({ site, menu, phone, phoneE164, bookingUrl }: NavbarClientProps) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  function toggleDropdown(title: string) {
    setOpenDropdown((v) => (v === title ? null : title));
    setOpenGroups(new Set());
  }

  function toggleGroup(title: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto bento-card px-4 sm:px-5 md:px-7 h-16 flex items-center gap-2 justify-between [&:hover]:transform-none">
        <Link
          href="/"
          className="flex items-center shrink-0 min-w-0"
          onClick={() => setOpen(false)}
        >
          {site?.logo_upload && (
            <Image
              src={site.logo_upload}
              alt={site?.sitename || "Logo"}
              width={1500}
              height={1500}
              className="w-[160px] sm:w-[300px] lg:w-[240px] h-auto max-h-10 sm:max-h-12 object-contain object-left"
              priority
            />
          )}
        </Link>

        <nav
          ref={desktopNavRef}
          className="hidden lg:flex items-center gap-0.5 min-w-0"
        >
          {menu &&
            menu.map((item) => {
              const active = isGroupActive(pathname, item);

              if (item.subLinks && item.subLinks.length > 0) {
                const isOpen = openDropdown === item.title;

                return (
                  <div key={item.id} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.title)}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 text-[0.8rem] font-medium px-2.5 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                        active || isOpen
                          ? "text-bento-ink bg-white/70"
                          : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/70"
                      }`}
                    >
                      {item.title}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56">
                        <div className="bento-card p-1.5 flex flex-col gap-0.5 shadow-xl max-h-[70vh] overflow-y-auto">
                          {item.subLinks.map((child) => {
                            if (child.subLinks && child.subLinks.length > 0) {
                              const isSubOpen = openGroups.has(child.title);
                              const subActive = isChildActive(pathname, child);
                              return (
                                <div key={child.id}>
                                  <button
                                    type="button"
                                    onClick={() => toggleGroup(child.title)}
                                    aria-haspopup="true"
                                    aria-expanded={isSubOpen}
                                    className={`w-full flex items-center justify-between gap-2 text-[0.8rem] px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                                      subActive || isSubOpen
                                        ? "text-bento-ink bg-white/70 font-medium"
                                        : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                                    }`}
                                  >
                                    {child.title}
                                    <ChevronDown
                                      size={12}
                                      className={`transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                                    />
                                  </button>
                                  {isSubOpen && (
                                    <div className="mt-0.5 mb-1 ml-2.5 pl-2.5 border-l border-bento-ink/10 flex flex-col gap-0.5">
                                      {child.subLinks.map((grandchild) => {
                                        const gActive = isActivePath(
                                          pathname,
                                          grandchild.link,
                                        );
                                        return (
                                          <NavLink
                                            key={grandchild.id}
                                            href={grandchild.link.replace(/\/\/+/g, '/')}
                                            linktype={grandchild.linktype}
                                            onClick={() =>
                                              setOpenDropdown(null)
                                            }
                                            className={`text-[0.78rem] px-3 py-2 rounded-lg transition-colors ${
                                              gActive
                                                ? "text-bento-ink bg-white/70 font-medium"
                                                : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                                            }`}
                                          >
                                            {grandchild.title}
                                          </NavLink>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            const childActive = isActivePath(
                              pathname,
                              child.link,
                            );
                            return (
                              <NavLink
                                key={child.id}
                                href={child.link.replace(/\/\/+/g, '/')}
                                linktype={child.linktype}
                                onClick={() => setOpenDropdown(null)}
                                className={`text-[0.8rem] px-3.5 py-2.5 rounded-xl transition-colors ${
                                  childActive
                                    ? "text-bento-ink bg-white/70 font-medium"
                                    : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/60"
                                }`}
                              >
                                {child.title}
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  href={item.link.replace(/\/\/+/g, '/')}
                  linktype={item.linktype}
                  className={`shrink-0 whitespace-nowrap text-[0.8rem] font-medium px-2.5 py-2 rounded-full transition-colors ${
                    active
                      ? "text-bento-ink bg-white/70"
                      : "text-bento-ink-soft hover:text-bento-ink hover:bg-white/70"
                  }`}
                >
                  {item.title}
                </NavLink>
              );
            })}
        </nav>

        <Link
          href={bookingUrl || SITE_FALLBACK.bookingUrl}
          className="hidden lg:inline-flex  py-3 px-5 text-sm rounded-full text-white bg-[#1176bb]"
        >
          Book Now
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-bento-ink p-2 rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <MobileMenu
        isOpen={open}
        onClose={() => setOpen(false)}
        menu={menu}
        bookingUrl={bookingUrl}
      />
    </header>
  );
}
