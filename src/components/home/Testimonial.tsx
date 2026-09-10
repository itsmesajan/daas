import { getTestimonials } from "@/lib/data";
import { htmlToPlainText } from "@/lib/images";
import TestimonialCarousel from "./TestimonialCarousel";

export default async function Testimonial() {
  const testimonials = await getTestimonials();

  const items = testimonials
    .map((t) => ({ ...t, quote: htmlToPlainText(t.quoteHtml) }))
    .filter((t) => t.quote);

  if (items.length === 0) return null;

  return <TestimonialCarousel items={items} />;
}
