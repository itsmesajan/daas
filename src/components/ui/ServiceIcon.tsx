import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Package } from "@/types";

const BASE =
  "w-11 h-11 shrink-0 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center";

type ServiceIconItem = Pick<Package, "title" | "icon" | "image" | "gallery_images">;

function CardIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`${BASE} ${className}`}>
      <Sparkles size={17} className="text-accent-orange" strokeWidth={1.75} />
    </div>
  );
}

/**
 * Service/facility icon — the CMS's own icon image when it ships one, else its
 * Font Awesome class, else a generic sparkle. Shared by the /facilities grid
 * and the homepage "At A Glance" band so both render the same icon per item.
 */
export default function ServiceIcon({
  item,
  className = "",
}: {
  item: ServiceIconItem;
  className?: string;
}) {
  const imgSrc =
    item?.image ||
    (Array.isArray(item?.gallery_images) && item.gallery_images[0]
      ? typeof item.gallery_images[0] === "string"
        ? item.gallery_images[0]
        : item.gallery_images[0].src
      : undefined);

  if (imgSrc) {
    return (
      <div className={`${BASE} overflow-hidden p-2 ${className}`}>
        <Image
          src={imgSrc}
          alt={item.title || "Icon"}
          width={44}
          height={44}
          className="object-contain w-full h-full filter-[brightness(0)_saturate(100%)_invert(58%)_sepia(96%)_saturate(902%)_hue-rotate(348deg)_brightness(98%)_contrast(88%)]"
        />
      </div>
    );
  }

  if (item?.icon) {
    return (
      <div className={`${BASE} ${className}`}>
        <i className={`${item.icon} text-base text-accent-orange`} aria-hidden="true" />
      </div>
    );
  }

  return <CardIcon className={className} />;
}
