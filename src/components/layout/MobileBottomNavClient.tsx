"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import { NavItem } from "@/types";

export default function MobileBottomNavClient({ menu }: { menu: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile quick links"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gold/15 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch">
        {menu.map((item) => {
          // The CMS sends "//" for Home instead of "/" — normalise so the
          // link and active-state check both behave.
          const href = item.link === "//" ? "/" : item.link;
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

          return (
            <NavLink
              key={item.id}
              href={href}
              linktype={item.linktype}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-gold-text" : "text-luxury-dark"
              }`}
            >
              {item.image && (
                <Image src={item.image} alt="" width={22} height={22} className="object-contain" />
              )}
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
