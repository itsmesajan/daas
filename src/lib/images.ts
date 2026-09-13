// CMS `gallery_images`/`img` entries come back as either bare URL strings or
// {src|url} objects — normalise to plain URL strings for the image slider.
export function toImageUrls(images: unknown[] | undefined): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === "string") return img;
      if (img && typeof img === "object") {
        const { src, url } = img as { src?: string; url?: string };
        return src ?? url ?? "";
      }
      return "";
    })
    .filter(Boolean);
}

export function resolveHeroImages(
  item: { gallery_images?: unknown[]; img?: unknown[] } | null | undefined,
  fallback = ""
): string[] {
  const gallery = toImageUrls(item?.gallery_images);
  const images = toImageUrls(item?.img);
  if (gallery.length > 0) return gallery;
  if (images.length > 0) return images;
  return fallback ? [fallback] : [];
}

/** Strips tags from a CMS rich-text field (e.g. `Package.description`) for plain-text display, like a card teaser. */
export function htmlToPlainText(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
