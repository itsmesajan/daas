import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { getBlogs, findBlogBySlug } from "@/lib/data";
import { SITE_URL } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogBySlug(slug);
  if (!post) return buildMetadata("blog", {}, `/blog/${slug}`);
  return buildMetadata(
    "blog",
    {
      title: post.meta_title || `${post.title} | Hotel Daaas Kathmandu`,
      description: post.meta_description,
    },
    `/blog/${slug}`
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([findBlogBySlug(slug), getBlogs()]);
  if (!post) notFound();

  const index = allPosts.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? allPosts[index - 1] : null;
  const next = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const slugOf = (s: string) => s.replace(/^\//, "").split("/").pop() ?? s;
  const shareUrl = `${SITE_URL}/blog/${slugOf(post.slug)}`;
  const image = post.banner_image || post.image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: post.author ? { "@type": "Organization", name: post.author } : undefined,
    image: image ? [image] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="max-w-225 mx-auto px-4">
          <Reveal className="mb-6">
            <Link href="/blog" className="bento-link w-fit">
              <ArrowLeft size={14} />
              All Posts
            </Link>
          </Reveal>

          {image && (
            <Reveal className="relative rounded-3xl overflow-hidden bento-card h-72 md:h-96 mb-6">
              <Image src={image} alt={post.title} fill className="object-cover" sizes="900px" priority />
            </Reveal>
          )}

          <Reveal delay={100} className="bento-card p-6 md:p-10">
            <h1 className="bento-title text-3xl md:text-4xl mb-3">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-bento-ink-soft mb-6 pb-6 border-b border-white/70">
              {post.date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-accent-orange" />
                  {post.date}
                </span>
              )}
              {post.author && <span>By {post.author}</span>}
            </div>

            {post.content && (
              <div
                className="text-bento-ink-soft text-sm leading-relaxed [&_p]:mb-4 [&_h1]:bento-title [&_h1]:text-xl [&_h1]:mb-3 [&_h1]:mt-6 [&_strong]:text-bento-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/70">
              <span className="text-xs font-semibold text-bento-ink-soft">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/50 text-bento-ink-soft hover:bg-accent-orange hover:text-white transition-colors"
              >
                <i className="fa-brands fa-facebook-f text-xs" aria-hidden="true" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/50 text-bento-ink-soft hover:bg-accent-orange hover:text-white transition-colors"
              >
                <i className="fa-brands fa-x-twitter text-xs" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          {(prev || next) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {prev ? (
                <Link href={`/blog/${slugOf(prev.slug)}`} className="bento-card p-5 flex items-center gap-3">
                  <ArrowLeft size={16} className="text-accent-orange shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-bento-ink-soft/70">Previous</p>
                    <p className="text-sm font-semibold text-bento-ink truncate">{prev.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/blog/${slugOf(next.slug)}`}
                  className="bento-card p-5 flex items-center justify-end gap-3 text-right"
                >
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-bento-ink-soft/70">Next</p>
                    <p className="text-sm font-semibold text-bento-ink truncate">{next.title}</p>
                  </div>
                  <ArrowRight size={16} className="text-accent-orange shrink-0" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
