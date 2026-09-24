import type { Metadata } from "next";
import CategoryListingSection from "@/components/ui/CategoryListingSection";
import { buildCategoryListingMetadata } from "@/lib/metadata";
import { findPackageCategory, getCategoryItems } from "@/lib/data";
import { toRoomItems } from "@/lib/listingItems";
import { CATEGORY_IDS } from "@/config/site";
import { totalRooms } from "@/data/hotel";

export async function generateMetadata(): Promise<Metadata> {
  return buildCategoryListingMetadata("rooms", CATEGORY_IDS.rooms, "/rooms");
}

export default async function RoomsPage() {
  // Category-level banner + short description come from the `package`
  // endpoint (one record per CATEGORY_IDS entry) — distinct from the
  // `subpackage` items each room card below still uses. Falls back to the
  // static copy when the live category isn't available.
  const [category, rooms] = await Promise.all([
    findPackageCategory(CATEGORY_IDS.rooms),
    getCategoryItems(CATEGORY_IDS.rooms),
  ]);

  return (
    <CategoryListingSection
      pillLabel="Accommodations"
      heading={category?.title || "Rooms & Suites"}
      description={category?.description || `${totalRooms} rooms across three categories, each designed for a comfortable stay in Kathmandu.`}
      basePath="/rooms"
      items={toRoomItems(rooms)}
    />
  );
}
