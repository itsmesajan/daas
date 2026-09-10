import { getCategoryItems } from "@/lib/data";
import { CATEGORY_IDS } from "@/config/site";
import DiningCarousel from "./DiningCarousel";

export default async function Dining() {
  const venues = await getCategoryItems(CATEGORY_IDS.restaurant);
  if (venues.length === 0) return null;

  return <DiningCarousel venues={venues} />;
}
