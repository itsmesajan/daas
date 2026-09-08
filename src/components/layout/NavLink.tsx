"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders a menu link based on the CMS `linktype`:
 *   - "1" → external URL, opened in a new tab via a plain anchor.
 *   - anything else → internal route via Next.js <Link>.
 */
export default function NavLink({
  href,
  linktype,
  className,
  onClick,
  children,
}: {
  href: string;
  linktype?: string | number;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (Number(linktype) === 1) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
