import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { buildMetadata } from "@/lib/metadata";
import { getFaqs } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "faq",
    { title: "FAQ | Hotel Daaas Kathmandu", description: "Frequently asked questions about Hotel Daaas Kathmandu." },
    "/faq"
  );
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">FAQ</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Frequently Asked Questions</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
            Everything you need to know before your stay.
          </p>
        </Reveal>

        <Reveal delay={100} className="max-w-3xl mx-auto">
          {faqs.length > 0 ? (
            <FaqAccordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
          ) : (
            <p className="text-bento-ink-soft text-sm text-center">No questions available yet.</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
