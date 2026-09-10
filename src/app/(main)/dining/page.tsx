import type { Metadata } from "next";
import CategoryListingSection from "@/components/ui/CategoryListingSection";
import { buildCategoryListingMetadata } from "@/lib/metadata";
import { findPackageCategory, getCategoryItems } from "@/lib/data";
import { toDiningItems } from "@/lib/listingItems";
import { CATEGORY_IDS } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildCategoryListingMetadata("restaurant", CATEGORY_IDS.restaurant, "/dining");
}

export default async function DiningPage() {
  const [category, venues] = await Promise.all([
    findPackageCategory(CATEGORY_IDS.restaurant),
    getCategoryItems(CATEGORY_IDS.restaurant),
  ]);

  return (
    <CategoryListingSection
      pillLabel="Dining & Rooftop"
      heading="Dining at Hotel Daaas"
      description={category?.description || "All-day dining, Newari specialties, and a rooftop lounge above the skyline."}
      basePath="/dining"
      items={toDiningItems(venues)}
    />
  );
}
