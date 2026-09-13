"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";
import { NavItem } from "@/types";
import { usePathname } from "next/navigation";
import { SITE_FALLBACK } from "@/config/site";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menu: NavItem[];
  bookingUrl?: string;
}

export default function MobileMenu({ isOpen, onClose, menu, bookingUrl }: MobileMenuProps) {
  const pathname = usePathname();
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      setOpenSubDropdown(null);
    } else {
      setOpenDropdown(id);
      setOpenSubDropdown(null);
    }
  };

  const toggleSubDropdown = (id: string) => {
    if (openSubDropdown === id) {
      setOpenSubDropdown(null);
    } else {
      setOpenSubDropdown(id);
    }
  };

  const cleanHref = (url?: string) => {
    if (!url) return "#";
    return url.replace(/\/\/+/g, "/");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen bg-white transform transition-transform duration-300 ease-in-out z-[60] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-800 z-[60] hover:text-amber-600 transition-colors"
        aria-label="Close menu"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Menu Content */}
      <div className="pt-24 px-8 pb-28 h-full overflow-y-auto">
        <nav className="flex flex-col space-y-6">
          {/* Menu Items */}
          {menu &&
            menu.map((item) => {
              const itemHref = cleanHref(item.link);
              const isActive =
                pathname === itemHref ||
                (itemHref !== "/" && pathname.startsWith(itemHref));

              if (item.subLinks && item.subLinks.length > 0) {
                const isSubmenuActive =
                  isActive ||
                  item.subLinks.some((sub) => {
                    const subHref = cleanHref(sub.link);
                    return (
                      pathname === subHref ||
                      (subHref !== "/" && pathname.startsWith(subHref)) ||
                      sub.subLinks?.some((grand) => {
                        const grandHref = cleanHref(grand.link);
                        return (
                          pathname === grandHref ||
                          (grandHref !== "/" && pathname.startsWith(grandHref))
                        );
                      })
                    );
                  });
                const isDropdownOpen = openDropdown === item.title;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={`w-full flex items-center justify-between text-2xl font-semibold transition-colors mb-4 ${
                        isSubmenuActive
                          ? "text-amber-600"
                          : "text-gray-800 hover:text-amber-600"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <div className="pl-4 space-y-3 mb-4">
                        {item.subLinks.map((subLink) => {
                          const subHref = cleanHref(subLink.link);
                          const isSubActive =
                            pathname === subHref ||
                            (subHref !== "/" && pathname.startsWith(subHref));

                          if (subLink.subLinks && subLink.subLinks.length > 0) {
                            const isSubDropdownOpen = openSubDropdown === subLink.title;
                            return (
                              <div key={subLink.id} className="space-y-2">
                                <button
                                  onClick={() => toggleSubDropdown(subLink.title)}
                                  className={`w-full flex items-center justify-between text-lg transition-colors ${
                                    isSubActive
                                      ? "text-amber-600 font-medium"
                                      : "text-gray-700 hover:text-amber-600"
                                  }`}
                                >
                                  <span className="flex items-center">
                                    <ChevronRight className="w-4 h-4 mr-2" />
                                    {subLink.title}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                      isSubDropdownOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                                {isSubDropdownOpen && (
                                  <div className="pl-6 space-y-2">
                                    {subLink.subLinks.map((grandchild) => {
                                      const grandHref = cleanHref(grandchild.link);
                                      const isGrandActive = pathname === grandHref;
                                      return (
                                        <NavLink
                                          key={grandchild.id}
                                          href={grandHref}
                                          linktype={grandchild.linktype}
                                          onClick={onClose}
                                          className={`block transition-colors text-base ${
                                            isGrandActive
                                              ? "text-amber-600 font-bold"
                                              : "text-gray-600 hover:text-amber-600"
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

                          return (
                            <NavLink
                              key={subLink.id}
                              href={subHref}
                              linktype={subLink.linktype}
                              onClick={onClose}
                              className={`flex items-center transition-colors text-lg ${
                                isSubActive
                                  ? "text-amber-600 font-bold"
                                  : "text-gray-600 hover:text-amber-600"
                              }`}
                            >
                              <ChevronRight
                                className={`w-5 h-5 mr-2 ${
                                  isSubActive ? "text-amber-600" : ""
                                }`}
                              />
                              {subLink.title}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  href={itemHref}
                  linktype={item.linktype}
                  onClick={onClose}
                  className={`text-2xl font-semibold transition-colors ${
                    isActive
                      ? "text-amber-600"
                      : "text-gray-800 hover:text-amber-600"
                  }`}
                >
                  {item.title}
                </NavLink>
              );
            })}

          {/* Book Now Button */}
          <Link
            href={bookingUrl || SITE_FALLBACK.bookingUrl}
            target={bookingUrl?.startsWith("http") ? "_blank" : undefined}
            onClick={onClose}
            className="mt-8 w-full bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold tracking-wider text-center hover:bg-amber-700 transition-colors inline-block"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </div>
  );
}