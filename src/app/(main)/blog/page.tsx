import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { getBlogs } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    "blog",
    { title: "Blog | Hotel Daaas Kathmandu", description: "News and stories from Hotel Daaas Kathmandu." },
    "/blog"
  );
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <section className="pt-28 md:pt-32 pb-16">
      <div className="max-w-[1200px] 2xl:max-w-[1440px] mx-auto px-4">
        <Reveal className="mb-10 px-2 text-center">
          <p className="bento-pill mx-auto w-fit mb-4">Blog</p>
          <h1 className="bento-title text-3xl md:text-5xl mb-3">Stories &amp; News</h1>
          <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">Updates from Hotel Daaas Kathmandu.</p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={100}>
            <p className="text-bento-ink-soft text-sm text-center">No posts published yet.</p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post, i) => {
              const cleanSlug = post.slug.replace(/^\//, "").split("/").pop() ?? post.slug;
              const image = post.banner_image || post.image;
              return (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link href={`/blog/${cleanSlug}`} className="group block bento-card overflow-hidden h-full">
                    {image && (
                      <div className="relative h-48">
                        <Image
                          src={image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6">
                      {post.date && (
                        <p className="flex items-center gap-1.5 text-bento-ink-soft text-xs mb-2">
                          <CalendarDays size={12} className="text-accent-orange" />
                          {post.date}
                        </p>
                      )}
                      <h2 className="bento-title text-lg mb-3 line-clamp-2">{post.title}</h2>
                      <span className="bento-link">
                        Read More
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
