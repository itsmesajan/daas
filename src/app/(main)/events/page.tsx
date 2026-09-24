import type { Metadata } from "next";
import CategoryListingSection from "@/components/ui/CategoryListingSection";
import { buildCategoryListingMetadata } from "@/lib/metadata";
import { findPackageCategory, getCategoryItems } from "@/lib/data";
import { toEventItems } from "@/lib/listingItems";
import { CATEGORY_IDS } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildCategoryListingMetadata("events", CATEGORY_IDS.events, "/events");
}

export default async function EventsPage() {
  const [category, spaces] = await Promise.all([
    findPackageCategory(CATEGORY_IDS.events),
    getCategoryItems(CATEGORY_IDS.events),
  ]);

  return (
    <CategoryListingSection
      pillLabel="Banquet & Events"
      heading={category?.title || "Grand Occasions, Perfectly Hosted"}
      description={category?.description || "Three event spaces for weddings, conferences, and executive gatherings."}
      basePath="/events"
      items={toEventItems(spaces)}
    />
  );
}
