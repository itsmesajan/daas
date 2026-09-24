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
    const features: NonNullable<RelatedItem["features"]> = [];
    if (venue.lunch) {
      features.push({
        icon: <Users size={11} className="text-accent-orange" />,
        label: venue.lunch,
      });
    }
    if (venue.breakfast) {
      features.push({
        icon: <Clock size={11} className="text-accent-orange" />,
        label: venue.breakfast,
      });
    }

    return {
      slug: venue.slug,
      title: venue.title,
      image: toImageUrls(venue.img)[0] ?? "",
      badge: venue.size ?? undefined,
      sub_title: venue.sub_title,
      description: htmlToPlainText(venue.description),
      features,
      ctaLabel: "View Venue",
    };
  });
}

// Live `services` (type 1) items rarely carry their own `icon` — only a
// couple of entries on this CMS instance do — so unset ones fall back to a
// hand-picked icon by slug, and anything the map doesn't recognise (a new
// service added later) still gets a sane generic icon instead of none.
const HIGHLIGHT_ICON_FALLBACK: Record<string, string> = {
  "airport-pickup-drop": "fa-solid fa-plane",
  "24-hour-room-service": "fa-solid fa-bell-concierge",
  "doctor-on-call": "fa-solid fa-user-doctor",
  "high-speed-internet": "fa-solid fa-wifi",
  "parking-space": "fa-solid fa-square-parking",
  "ev-charging-point": "fa-solid fa-charging-station",
  "rooftop-swimming-pool": "fa-solid fa-person-swimming",
  "fitness-center": "fa-solid fa-dumbbell",
  "wellness-spa": "fa-solid fa-spa",
  "restaurant-bar": "fa-solid fa-utensils",
  "event-hall": "fa-solid fa-people-group",
  elevator: "fa-solid fa-elevator",
  "fire-extinguisher": "fa-solid fa-fire-extinguisher",
  "daily-housekeeping": "fa-solid fa-broom",
  "luggage-storage": "fa-solid fa-suitcase",
  "wheelchair-available": "fa-solid fa-wheelchair",
  "power-backup": "fa-solid fa-plug-circle-bolt",
  "cctv-security": "fa-solid fa-video",
  "concierge-service": "fa-solid fa-concierge-bell",
  "cards-accepted": "fa-solid fa-credit-card",
  "daily-newspaper": "fa-solid fa-newspaper",
};

export interface FacilityHighlight {
  slug: string;
  title: string;
  desc: string;
  icon: string;
}

/** Homepage "At A Glance" highlights — live `services` type-1 items, short blurb from `content_0`. */
export function toHighlightItems(services: Package[]): FacilityHighlight[] {
  return services.map((s) => ({
    slug: s.slug,
    title: s.title,
    desc: htmlToPlainText(s.content_0),
    icon: s.icon || HIGHLIGHT_ICON_FALLBACK[s.slug] || "fa-solid fa-circle-check",
  }));
}

export function toEventItems(spaces: Package[]): RelatedItem[] {
  return spaces.map((space) => {
    const features: NonNullable<RelatedItem["features"]> = [];
    if (space.size) {
      features.push({
        icon: <Maximize2 size={11} className="text-accent-orange" />,
        label: space.size,
      });
    }
    if (space.cover) {
      features.push({
        icon: <Users size={11} className="text-accent-orange" />,
        label: space.cover,
      });
    }

    return {
      slug: space.slug,
      title: space.title,
      image: toImageUrls(space.img)[0] ?? "",
      badge: space.size ?? undefined,
      sub_title: space.sub_title,
      features,
      ctaLabel: "View Space",
    };
  });
}
