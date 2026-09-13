import { getWellnessTabs } from "@/lib/data";
import WellnessTabs from "./WellnessTabs";

export default async function WellnessExperiences() {
  const tabs = await getWellnessTabs();
  if (tabs.length === 0) return null;

  return <WellnessTabs tabs={tabs} />;
}
