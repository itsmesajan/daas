import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ImageGallery from "@/components/ui/ImageGallery";
import { buildMetadata } from "@/lib/metadata";
import { findArticleBySlug } from "@/lib/data";
import { resolveHeroImages } from "@/lib/images";
import { SITE_URL } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);
  if (!article) return buildMetadata(slug, {}, `/${slug}`);
  return buildMetadata(
    slug,
    {
      title: article.meta_title || `${article.title} | Hotel Daaas Kathmandu`,
      description: article.meta_description || article.title,
    },
    `/${slug}`
  );
}

/**
 * Generic catch-all for `article_all` CMS pages that don't have their own
 * bespoke route — data comes strictly from that one endpoint (via
 * findArticleBySlug), with no local/fallback content for a slug it doesn't
 * recognise (a miss 404s instead of silently showing unrelated content).
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);
  if (!article) notFound();

  const images = resolveHeroImages(article, article.fb_img);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: article.title, item: `${SITE_URL}/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/" className="bento-link w-fit">
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </Reveal>

          <h1 className="bento-title text-3xl md:text-4xl mb-4">{article.title}</h1>
          {images.length > 0 && (
            <Reveal className="relative rounded-3xl overflow-hidden bento-card h-105 md:h-140 mb-5">
              <ImageGallery images={images} alt={article.title} />
            </Reveal>
          )}

          <Reveal delay={100} className="bento-card p-6 md:p-8 flex flex-col">

            {article.description && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed max-w-2xl [&_p]:mb-3 [&_h6]:font-semibold [&_h6]:text-bento-ink [&_h6]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
