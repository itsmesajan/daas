// Data-access layer — the only module that talks to fetchAPI besides api.ts
// itself. Pages/components never import fetchAPI directly; they call the
// named helpers below.
//
// The live CMS is only partially populated (e.g. one room entered, not all
// three), so getCategoryItems merges by slug rather than switching all-or-
// nothing: a slug present live uses live content, any slug only known
// locally (src/data/hotel.ts) keeps showing our accurate fallback instead of
// 404ing. Once every real item exists in the CMS, the local half of the
// merge simply stops contributing anything — no code change needed then.

import { fetchAPI } from "./api";
import type {
  ArticleItem,
  BlogPost,
  DealOfTheDay,
  FaqItemEntry,
  GalleryImageEntry,
  MenuContainer,
  NavItem,
  OfferItem,
  Package,
  PackageCategory,
  TestimonialEntry,
  VirtualTourData,
  WellnessTabItem,
  SlideShowGroup,
} from "@/types";
import type { SiteMetadata } from "@/types/metadata";
import { CATEGORY_IDS, SERVICE_TYPE_IDS, SITE_FALLBACK } from "@/config/site";
import {
  roomCategories,
  roomAmenities,
  diningVenues,
  banquetSpaces,
  services,
  wellnessTabs,
  galleryImages,
  faqs,
  blogPosts,
} from "@/data/hotel";

// ── Site-wide ────────────────────────────────────────────────────────────────

export function getSiteRegulars(): Promise<any | null> {
  return fetchAPI<any>("siteregulars");
}

/** Falls back to an empty object so all consumers degrade gracefully. */
export async function getSiteMetadata(): Promise<SiteMetadata> {
  const data = await fetchAPI<SiteMetadata>("metadata");
  return data ?? {};
}

/** `popup` arrives in several wrapper shapes; normalise to a flat array. */
export async function getPopupItems(): Promise<any[]> {
  try {
    const data = await fetchAPI<any>("popup");
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data && typeof data === "object") return [data];
  } catch (err) {
    console.error("Failed to fetch popup data", err);
  }
  return [];
}

/** Raw CMS `schema` entries (JSON-LD blocks); [] when unavailable. */
export async function getCmsSchemaEntries<T = unknown>(): Promise<T[]> {
  const data = await fetchAPI<T[]>("schema");
  return Array.isArray(data) ? data : [];
}

/** One `schema` entry by its CMS `slug` (carries `image`/`fb_upload`, meta fields, JSON-LD), or null. */
export async function findSchemaEntryBySlug(slug: string): Promise<any | null> {
  const entries = await getCmsSchemaEntries();
  return entries.find((entry: any) => entry.slug === slug) ?? null;
}

// ── Navigation & social ──────────────────────────────────────────────────────

/** Menu items for one container: type 1 = header nav, type 2 = footer nav. */
export async function getMenuItems(type: number): Promise<NavItem[]> {
  const menu = (await fetchAPI<MenuContainer[]>("menu")) || [];
  return menu.find((item) => Number(item.type) === type)?.items || [];
}

/** Social-link group: type 1 = footer icons, type 2 = partner/OTA logos. */
export async function getSocialGroup(type: number): Promise<any | null> {
  const social = await fetchAPI<any[]>("social");
  return social?.find((item: any) => Number(item.type) === type) ?? null;
}

// ── Packages & categories (rooms / restaurant / events) ─────────────────────
// Parent-category ids live in CATEGORY_IDS (src/config/site.ts).

function roomsToItems(): Package[] {
  return roomCategories.map((room) => ({
    id: room.slug,
    slug: room.slug,
    title: room.name,
    sub_title: `${room.count} Rooms`,
    img: room.images.map((img) => ({ src: img.src, title: room.name })),
    description: `<p>${room.description}</p>`,
    amenities: [{ group_title: "Room Amenities", items: roomAmenities.map((name) => ({ title: name })) }],
    // No real per-night rate yet — price stays unset rather than invented;
    // the detail page only renders a price tag when this is present.
  }));
}

function diningToItems(): Package[] {
  return diningVenues.map((venue) => ({
    id: venue.slug,
    slug: venue.slug,
    title: venue.name,
    sub_title: venue.cuisine,
    img: venue.images.map((img) => ({ src: img.src, title: venue.name })),
    description: `<p>${venue.description}</p>`,
    amenities: [
      {
        group_title: "Venue Details",
        items: [{ title: venue.seats }, { title: venue.timing }, { title: venue.cuisine }],
      },
    ],
    // Live CMS restaurant items repurpose the shared package fields: `breakfast`
    // carries the venue's timing text, `lunch` carries its seating/size text
    // (not literal meal info) — matched here so local fallback items read the
    // same way as live ones on the homepage carousel.
    breakfast: venue.timing,
    lunch: venue.seats,
  }));
}

function eventsToItems(): Package[] {
  return banquetSpaces.map((space) => ({
    id: space.slug,
    slug: space.slug,
    title: space.name,
    sub_title: space.description,
    img: space.images.map((img) => ({ src: img.src, title: space.name })),
    description: `<p>${space.description}</p>`,
    amenities: [
      {
        group_title: "Space Details",
        items: [{ title: space.size }, { title: space.capacity }, { title: space.setupType }],
      },
    ],
    // Live CMS event items use `size` for floor area and `cover` for pax
    // capacity — the literal fields, not repurposed like dining's
    // breakfast/lunch — matched here so local fallback items read the same
    // way as live ones on the homepage carousel.
    size: space.size,
    cover: space.capacity,
    // No real per-layout capacity numbers (theater/classroom/u-shape/round
    // table) exist yet — left unset rather than invented; the setup-style
    // table only renders when at least one of these is present.
  }));
}

function localFallbackFor(parentId: string): Package[] {
  if (parentId === CATEGORY_IDS.rooms) return roomsToItems();
  if (parentId === CATEGORY_IDS.restaurant) return diningToItems();
  if (parentId === CATEGORY_IDS.events) return eventsToItems();
  return [];
}

interface SubpackageCategory {
  parent_id?: string | number;
  items?: Package[];
}

/** Raw `subpackage` response — only for consumers that scan every category. */
export function getSubpackages(): Promise<SubpackageCategory[] | null> {
  return fetchAPI<SubpackageCategory[]>("subpackage");
}

/** Items (rooms/venues/spaces) of one `subpackage` category — live items merged with local fallback by slug. */
export async function getCategoryItems(parentId: string): Promise<Package[]> {
  const subpackage = await getSubpackages();
  const category = subpackage?.find((c) => String(c.parent_id) === parentId);
  const liveItems = Array.isArray(category?.items) ? category.items : [];
  const liveSlugs = new Set(liveItems.map((item) => item.slug));
  const fallbackOnly = localFallbackFor(parentId).filter((item) => !liveSlugs.has(item.slug));
  return [...liveItems, ...fallbackOnly];
}

export async function findCategoryItem(parentId: string, slug: string): Promise<Package | null> {
  const items = await getCategoryItems(parentId);
  return items.find((item) => item.slug === slug) ?? null;
}

// ── Package categories (parent-category landing pages) ──────────────────────
// The `package` endpoint returns one record per CATEGORY_IDS entry — the
// /rooms, /dining, /events landing page's own banner image + short
// description — separate from `subpackage`'s individual items above.

export async function getPackageCategories(): Promise<PackageCategory[]> {
  const data = await fetchAPI<PackageCategory[]>("package");
  return Array.isArray(data) ? data : [];
}

export async function findPackageCategory(id: string): Promise<PackageCategory | null> {
  const categories = await getPackageCategories();
  return categories.find((c) => String(c.id) === id) ?? null;
}

// ── About Us (generic CMS "article", looked up by slug) ─────────────────────
// The reference site actually looks this page up by a hardcoded numeric CMS
// id, not a slug — that's fragile (a per-instance id, not a portable name),
// so this uses the same slug-based mechanism as everything else instead.

// The `article_all` endpoint names fields differently from `subpackage`
// (`subtitle`/`content` instead of `sub_title`/`description`) — normalise
// here so every consumer can rely on one consistent ArticleItem shape.
interface RawArticle extends Omit<ArticleItem, "sub_title" | "description"> {
  subtitle?: string;
  sub_title?: string;
  content?: string;
  description?: string;
}

function normaliseArticle(raw: RawArticle): ArticleItem {
  return {
    ...raw,
    sub_title: raw.sub_title ?? raw.subtitle,
    description: raw.description ?? raw.content,
  };
}

export async function getArticles(): Promise<ArticleItem[]> {
  const data = await fetchAPI<RawArticle[]>("article_all");
  return Array.isArray(data) ? data.map(normaliseArticle) : [];
}

function aboutFallback(): ArticleItem {
  return {
    slug: "about-us",
    title: "About Hotel Daaas Kathmandu",
    description: `<p>${SITE_FALLBACK.description}</p>`,
  };
}

/** Generic `article_all` lookup by slug for the catch-all /[slug] route — null (→ 404) on no match, not the About Us fallback. */
export async function findArticleBySlug(slug: string): Promise<ArticleItem | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

/** Preferred lookup for `article_all` — the CMS `slug` field isn't reliably route-shaped, but `id` is stable (see ARTICLE_IDS). */
export async function findArticleById(id: string): Promise<ArticleItem> {
  const articles = await getArticles();
  return articles.find((a) => String(a.id) === id) ?? aboutFallback();
}

// ── Gallery ──────────────────────────────────────────────────────────────────

function galleryFallback(): GalleryImageEntry[] {
  return galleryImages.map((g) => ({ src: g.image.src, title: g.title, category: g.category }));
}

/** Raw `gallery` endpoint item shape — the photo URL comes back as `image`, not `src`. */
interface RawGalleryItem {
  id?: number | string;
  title?: string;
  category?: string;
  image?: string;
}

/** Images of one gallery group, selected by its CMS `display` label. */
export async function getGalleryImages(display = "Inner Page"): Promise<GalleryImageEntry[]> {
  const data = await fetchAPI<{ display?: string; items?: RawGalleryItem[] }[]>("gallery");
  const group = Array.isArray(data) ? data.find((g) => g.display === display) : null;
  const liveItems = Array.isArray(group?.items) ? group.items : [];
  const normalised = liveItems
    .filter((item): item is RawGalleryItem & { image: string } => Boolean(item.image))
    .map((item) => ({ src: item.image, title: item.title, category: item.category }));
  return normalised.length > 0 ? normalised : galleryFallback();
}

// ── Offers ───────────────────────────────────────────────────────────────────
// No real promotional offers exist for Hotel Daaas yet — deliberately no
// local fallback here. Inventing a discount/promo would misrepresent a real
// price commitment, unlike a generic facilities description; an empty CMS
// response should show an honest "no current offers" state instead.

export async function getOffers(): Promise<OfferItem[]> {
  const data = await fetchAPI<OfferItem[] | Record<string, OfferItem>>("offers");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return Object.values(data);
  return [];
}

export async function findOfferBySlug(slug: string): Promise<OfferItem | null> {
  const offers = await getOffers();
  return offers.find((o) => o.slug === slug) ?? null;
}

// ── Services / facilities ────────────────────────────────────────────────────
// Merges the same way getCategoryItems does: live items win by slug, any
// slug the CMS doesn't have yet keeps showing our real local content.

interface ServiceCategory {
  type?: number | string;
  items?: Package[];
}

export async function getServicesGrouped(): Promise<{ facilities: Package[]; services: Package[] }> {
  const data = await fetchAPI<ServiceCategory[]>("services");
  const categories = Array.isArray(data) ? data : [];

  const facilities = categories
    .filter((c) => String(c.type) === SERVICE_TYPE_IDS.facility)
    .flatMap((c) => (Array.isArray(c.items) ? c.items : []));

  const services = categories
    .filter((c) => String(c.type) !== SERVICE_TYPE_IDS.facility)
    .flatMap((c) => (Array.isArray(c.items) ? c.items : []));

  return { facilities, services };
}

export async function getServices(): Promise<Package[]> {
  const { facilities, services: serviceItems } = await getServicesGrouped();
  return [...facilities, ...serviceItems];
}

export async function findServiceBySlug(slug: string): Promise<Package | null> {
  const items = await getServices();
  return items.find((item) => item.slug === slug) ?? null;
}

// ── Homepage wellness tabs (services `type` 2 = facility) ───────────────────
// A separate, narrower read of the same `services` endpoint used by
// since that flag exists to hold back the still-in-design /facilities and
// /service/[slug] pages, not this homepage teaser. The CMS entries here have
// no separate description/highlights fields — both are baked into one
// `content_0` rich-text block (desc paragraph + bullet list), rendered as-is
// rather than parsed apart.

interface RawServiceItem {
  slug?: string;
  title?: string;
  sub_title?: string;
  content_0?: string;
  description?: string;
  image?: string;
  fb_img?: string;
  gallery_images?: (string | { src?: string; url?: string })[];
  img?: (string | { src?: string; url?: string })[];
}

interface RawServiceCategory {
  type?: number | string;
  items?: RawServiceItem[];
}

function extractServiceImage(item: RawServiceItem): string | undefined {
  if (item.image) return item.image;
  if (item.fb_img) return item.fb_img;

  const galleryImg = item.gallery_images?.[0];
  if (typeof galleryImg === "string") return galleryImg;
  if (galleryImg && typeof galleryImg === "object") {
    return galleryImg.src || galleryImg.url;
  }

  const rawImg = item.img?.[0];
  if (typeof rawImg === "string") return rawImg;
  if (rawImg && typeof rawImg === "object") {
    return rawImg.src || rawImg.url;
  }

  return undefined;
}

export async function getWellnessTabs(): Promise<WellnessTabItem[]> {
  const data = await fetchAPI<RawServiceCategory[]>("services");
  const categories = Array.isArray(data) ? data : [];
  const facilityCategory = categories.find((c) => String(c.type) === SERVICE_TYPE_IDS.facility);
  const liveItems = Array.isArray(facilityCategory?.items) ? facilityCategory.items : [];

  return liveItems
    .filter((item): item is RawServiceItem & { slug: string; title: string } => Boolean(item.slug && item.title))
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      label: item.sub_title || item.title,
      contentHtml: item.content_0 || item.description || "",
      image: extractServiceImage(item),
    }));
}

interface RawTestimonial {
  id?: string | number;
  name?: string;
  title?: string;
  via?: string;
  rating?: string | number;
  image?: string;
  content?: string;
}

export async function getTestimonials(): Promise<TestimonialEntry[]> {
  const data = await fetchAPI<RawTestimonial[]>("testimonial");
  if (!Array.isArray(data)) return [];
  return data
    .filter((t) => t.content)
    .map((t) => ({
      id: t.id,
      name: t.name,
      role: t.title,
      quoteHtml: t.content!,
      via: t.via,
      image: t.image,
      rating: Number(t.rating) || 0,
    }));
}

export async function getFaqs(): Promise<{ question: string; answer: string }[]> {
  const data = await fetchAPI<{ question: string; answer: string }[]>("faq");
  return Array.isArray(data) ? data : [];
}

// ── Blog ─────────────────────────────────────────────────────────────────────
// Merges by slug like getCategoryItems (see the `blogPosts` disclaimer in
// src/data/hotel.ts). findBlogBySlug/findBlogIndex read through getBlogs(),
// so fallback posts are reachable at /blog/[slug] with no further changes.

function blogFallback(): BlogPost[] {
  return blogPosts.map((post) => ({
    ...post,
    image: post.image.src,
    banner_image: post.image.src,
  }));
}

export async function getBlogs(): Promise<BlogPost[]> {
  const data = await fetchAPI<BlogPost[]>("blog");
  const liveItems = Array.isArray(data) ? data : [];
  const liveSlugs = new Set(liveItems.map((b) => b.slug));
  // const fallbackOnly = blogFallback().filter((b) => !liveSlugs.has(b.slug));
  return [...liveItems];
}

/** Robust slug match — tolerates leading slashes and nested CMS slugs. */
function findBlogIndex(blogs: BlogPost[], slug: string): number {
  return blogs.findIndex((b) => {
    const cleanSlug = b.slug.startsWith("/") ? b.slug.slice(1) : b.slug;
    const targetSlug = slug.startsWith("/") ? slug.slice(1) : slug;
    return cleanSlug === targetSlug || cleanSlug.endsWith(`/${targetSlug}`);
  });
}

export async function findBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  const index = findBlogIndex(blogs, slug);
  return index === -1 ? null : blogs[index];
}

// ── Deal of the Day ──────────────────────────────────────────────────────────
// No deal exists most days — fetchAPI already returns null for the 404
// response, so this naturally renders an honest "no deal today" state.

export function getDealOfTheDay(): Promise<DealOfTheDay | null> {
  return fetchAPI<DealOfTheDay>("dod");
}

// ── Virtual Tour ─────────────────────────────────────────────────────────────

export function getVirtualTour(): Promise<VirtualTourData | null> {
  return fetchAPI<VirtualTourData>("virtual_tour");
}

// ── Slideshow ─────────────────────────────────────────────────────────────────

export async function getSlideshow(): Promise<SlideShowGroup[]> {
  const data = await fetchAPI<SlideShowGroup[]>("slideshow");
  return Array.isArray(data) ? data : [];
}

