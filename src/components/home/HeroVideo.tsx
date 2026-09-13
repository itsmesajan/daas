import { getSlideshow } from "@/lib/data";
import HeroClient from "./HeroClient";

export default async function HeroVideo() {
  const slideshow = await getSlideshow();

  // If no slideshow data exists, return null
  if (!slideshow || slideshow.length === 0) {
    return null;
  }

  return <HeroClient slideshow={slideshow} />;
}
