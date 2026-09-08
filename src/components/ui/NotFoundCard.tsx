import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function NotFoundCard() {
  return (
    <section className="flex-1 flex items-center py-16">
      <div className="max-w-[1200px] mx-auto px-4 w-full">
        <Reveal className="mx-auto max-w-lg">
          <div className="bento-card p-8 md:p-12 text-center">
            <p className="bento-pill mx-auto w-fit mb-5">404</p>
            <h1 className="bento-title text-3xl md:text-4xl mb-3">Page not found</h1>
            <p className="text-bento-ink-soft text-sm mb-8">
              The page you&apos;re looking for doesn&apos;t exist or may have moved.
            </p>
            <Link href="/" className="bento-btn mx-auto w-fit">
              Back to home
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
