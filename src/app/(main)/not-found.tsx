import NotFoundCard from "@/components/ui/NotFoundCard";

// Used for notFound() calls thrown by pages inside this route group (e.g. a
// bad /rooms/[slug]) — renders nested inside (main)/layout.tsx, so it already
// gets the Navbar/Footer chrome for free.
export default function NotFound() {
  return <NotFoundCard />;
}
