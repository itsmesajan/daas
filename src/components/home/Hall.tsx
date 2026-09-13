import { getCategoryItems } from "@/lib/data";
import { CATEGORY_IDS } from "@/config/site";
import HallCarousel from "./HallCarousel";

export default async function Hall() {
  const spaces = await getCategoryItems(CATEGORY_IDS.events);
  if (spaces.length === 0) return null;

  return <HallCarousel venues={spaces} />;
}
