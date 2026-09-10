/** CMS image entry — `img`/`gallery_images` arrive as arrays of these, not plain strings. */
export interface ImageItem {
  src: string;
  title?: string;
}

export interface AmenityItem {
  title: string;
  icon?: string;
  /** Icon image URL (the CMS ships PNG icons per amenity, not a name/key). */
  img?: string;
}

export interface AmenityGroup {
  group_title: string;
  items: AmenityItem[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface NavItem {
  id: string;
  title: string;
  link: string;
  /** CMS link type: "0" → internal route, "1" → external URL (opens in a new tab). */
  linktype?: string | number;
  subLinks?: NavItem[];
  /** Icon URL — used by the mobile bottom nav (menu type 3). */
  image?: string;
}

export interface MenuContainer {
  type: string | number;
  items: NavItem[];
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  /** A short label OR a full paragraph, depending on the property — render as plain text. */
  sub_title?: string;
  /** Social-share image. */
  fb_img?: string;
  img: ImageItem[];
  /** Preferred photo set for the hero/gallery when present — see resolveHeroImages(). */
  gallery_images?: ImageItem[];
  /** Rich HTML — may embed its own inclusions/check-in/check-out sub-sections. */
  description?: string;
  content_0?: string;
  /** Rich HTML — typically a "Room Policies" quick-facts block. */
  content_1?: string;
  currency?: string;
  /** Only render a price when this is a real, non-empty numeric string. */
  price?: string | null;
  amenities?: AmenityGroup[];
  occupancy?: string;
  rooms_Size?: string;
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
  includes?: string[];
  excludes?: string[];
  /** Event/hall setup-style capacities — null for rooms, populated for banquet spaces. */
  size?: string | null;
  cover?: string | null;
  theater?: string | null;
  class_room_style?: string | null;
  u_shape?: string | null;
  round_table?: string | null;
  /** Full <script type="application/ld+json"> block from the CMS. */
  schema_code?: string;
  faq_schema?: FaqItem[];
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  book_url?: string;
}

export interface ApiResponse {
  parent_id?: string;
  items?: Package[];
}

/** `banner_img`/`fb_img`-style entry from the `package` endpoint — `{id,url,alt}`, not `{src,title}` like ImageItem. */
export interface BannerImage {
  id?: number;
  url: string;
  alt?: string;
}

/**
 * Parent-category landing-page record from the `package` endpoint — one per
 * CATEGORY_IDS entry (rooms/events/restaurant), distinct from `subpackage`'s
 * individual items. Carries the category's own banner image + short
 * description, used on the /rooms, /dining, /events listing pages.
 */
export interface PackageCategory {
  id: string;
  slug: string;
  title: string;
  /** Admin-assigned per property — not a reliable category discriminator (match by `id`/`slug` instead). */
  type?: string | number;
  banner_img?: BannerImage[];
  fb_img?: string;
  /** Short plain-text summary (not HTML). */
  description?: string;
  schema_code?: string;
  faq_schema?: FaqItem[];
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

/** Generic CMS "article" — used for static pages like About Us. */
export interface ArticleItem {
  id?: string | number;
  slug: string;
  title: string;
  sub_title?: string;
  fb_img?: string;
  img?: ImageItem[];
  gallery_images?: ImageItem[];
  description?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

export interface GalleryImageEntry {
  src: string;
  title?: string;
  category?: string;
}

export interface FaqItemEntry {
  question: string;
  answer: string;
}

export interface BlogPost {
  id?: string | number;
  slug: string;
  title: string;
  author?: string;
  date?: string;
  banner_image?: string;
  image?: string;
  fb_img?: string;
  content?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

export interface DealOfTheDay {
  id?: string;
  title?: string;
  whatsapp_message?: string;
  slug?: string;
  dod_date?: string;
  /** "1" = email enquiry, "2" = WhatsApp enquiry. */
  type?: string;
  mail?: string;
  whatsapp?: string;
  image?: string;
}

export interface TourHotSpotTarget {
  sceneId: number;
  yaw: number;
  pitch: number;
}

export interface TourHotSpot {
  id: number;
  text: string;
  pitch: number;
  yaw: number;
  type: string;
  target: TourHotSpotTarget;
}

export interface TourScene {
  id: number;
  title: string;
  panorama: string;
  thumb?: string;
  draggable?: boolean;
  status?: string;
  view: { yaw: number; pitch: number; hfov: number };
  hotSpots: TourHotSpot[];
}

export interface TourCategory {
  id: string;
  title: string;
  sceneIds: number[];
}

export interface VirtualTourData {
  tour: {
    id: number;
    title: string;
    settings: {
      fadeIn: number;
      defaultScene: number;
      hotspotIcon?: string;
      draggable?: boolean;
      imgWidth?: number;
      imgHeight?: number;
    };
  };
  categories: TourCategory[];
  scenes: Record<string, TourScene>;
}

/**
 * Guest testimonial from OTA platforms (Agoda, Booking.com, TripAdvisor, Google).
 * API response includes `id`, `name`, `title`, `via`, `rating` (string), `image`, and `content` (HTML).
 * Transformed into component-friendly format with extracted text and normalized source.
 */
export interface Testimonial {
  id: string;
  name: string;
  image: string;
  title: string;
  via: string;
  rating: number;
  quote: string;
  source: string;
  role: string;
}

export interface OfferItem {
  id: string;
  slug: string;
  title: string;
  image?: string;
  img?: ImageItem[];
  start_date?: string;
  end_date?: string;
  content?: string;
  /** Real numeric rate when the CMS supplies one — never invent a price. */
  rate?: string | null;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

export interface NavbarClientProps {
  menu: NavItem[];
  logoUrl?: string;
  site:any;
}
