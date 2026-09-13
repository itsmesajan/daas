import { getMenuItems } from "@/lib/data";
import MobileBottomNavClient from "./MobileBottomNavClient";

export default async function MobileBottomNav() {
  const menu = await getMenuItems(3);
  if (!menu || menu.length === 0) return null;

  return <MobileBottomNavClient menu={menu} />;
}
