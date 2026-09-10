import Image from "next/image";
import { Check, Clock, Maximize2, Users } from "lucide-react";
import type { Package } from "@/types";
import type { RelatedItem } from "@/components/ui/RelatedItemsSlider";
import { toImageUrls, htmlToPlainText } from "@/lib/images";

/**
 * Package → RelatedItem card mapping, one per category — shared by each
 * category's own listing page (CategoryListingSection) and its detail
 * page's "More X" slider (RelatedItemsSlider), so both render the exact
 * same card for the exact same live-CMS-backed items.
 */

export function toRoomItems(rooms: Package[]): RelatedItem[] {
  return rooms.map((room) => {
    // Real per-room amenities from the CMS `amenities` group (each carrying
    // its own icon image) — falls back to a plain check mark when an item
    // has no icon image of its own.
    const amenities = room.amenities?.[0]?.items?.slice(0, 3) ?? [];

    return {
      slug: room.slug,
      title: room.title,
      image: toImageUrls(room.img)[0] ?? "",
      badge: room.price && room.currency ? `${room.currency}${room.price}` : undefined,
      sub_title: room.sub_title,
      description: htmlToPlainText(room.description),
      features: amenities.map((a) => ({
        icon: a.img ? (
          <span className="relative h-3.5 w-3.5 shrink-0 inline-block">
            <Image src={a.img} alt="" fill className="object-contain" sizes="14px" unoptimized />
          </span>
        ) : (
          <Check size={11} className="text-accent-orange shrink-0" />
        ),
        label: a.title,
      })),
      ctaLabel: "View Room",
    };
  });
}

export function toDiningItems(venues: Package[]): RelatedItem[] {
  return venues.map((venue) => {
    // "Venue Details" amenity group is [seats, timing, cuisine], in that
    // order (see diningToItems() in lib/data.ts) — cuisine is already shown
    // as the corner badge below, so only the first two are repeated here.
    const details = venue.amenities?.[0]?.items ?? [];
    const features: RelatedItem["features"] = [];
    if (details[0]) features.push({ icon: <Users size={11} className="text-accent-orange" />, label: details[0].title });
    if (details[1]) features.push({ icon: <Clock size={11} className="text-accent-orange" />, label: details[1].title });

    return {
      slug: venue.slug,
      title: venue.title,
      image: toImageUrls(venue.img)[0] ?? "",
      badge: venue.sub_title,
      // The blurb line reads the venue's own description, not sub_title —
      // sub_title already appears above as the corner badge, and showing it
      // twice would just repeat "Newari Cuisine" as both badge and blurb.
      sub_title: htmlToPlainText(venue.description),
      features,
      ctaLabel: "View Venue",
    };
  });
}

export function toEventItems(spaces: Package[]): RelatedItem[] {
  return spaces.map((space) => {
    // "Space Details" amenity group is [size, capacity, setupType], in that
    // order (see eventsToItems() in lib/data.ts) — size is already shown as
    // the corner badge below, but is repeated here too (as in the original
    // card), alongside capacity.
    const details = space.amenities?.[0]?.items ?? [];
    const features: RelatedItem["features"] = [];
    if (details[0]) features.push({ icon: <Maximize2 size={11} className="text-accent-orange" />, label: details[0].title });
    if (details[1]) features.push({ icon: <Users size={11} className="text-accent-orange" />, label: details[1].title });

    return {
      slug: space.slug,
      title: space.title,
      image: toImageUrls(space.img)[0] ?? "",
      badge: space.size ?? undefined,
      // The blurb line reads the space's own description, not sub_title —
      // sub_title already appears above as the corner badge, and showing it
      // twice would just repeat "4,900 sq. ft" as both badge and blurb.
      sub_title: space.sub_title,
      features,
      ctaLabel: "View Space",
    };
  });
}
