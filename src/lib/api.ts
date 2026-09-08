import crypto from "crypto";
import { parseAPIResponse } from "./parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * The CMS has no token-exchange endpoint — it just verifies a self-signed
 * HS256 JWT against the shared JWT_SECRET, so we mint one per request rather
 * than fetching/caching a token from anywhere. Returns null (no Authorization
 * header sent) when JWT_SECRET isn't configured — the live Hotel Daaas
 * endpoint currently accepts unauthenticated requests, so this isn't a hard
 * requirement; sign one whenever a secret exists so it's ready the moment
 * the backend starts enforcing it.
 */
function signApiToken(): string | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ api_key: process.env.CMS_API_KEY, iat: now, exp: now + 300 })
  );
  const signature = base64url(
    crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest()
  );

  return `${header}.${payload}.${signature}`;
}

/**
 * Fetches one CMS endpoint. Always fails soft (returns `null` on any error —
 * network failure, non-2xx, bot-protection challenge, unsigned request, bad
 * JSON) so a CMS hiccup never white-screens a page; callers layer their own
 * fallback content on top (see src/lib/data.ts).
 */
export async function fetchAPI<T>(endpoint: string, slug?: string): Promise<T | null> {
  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  try {
    const tag = endpoint.replace("api_", "").replace(".php", "");
    const token = signApiToken();

    const res = await fetch(url, {
      // The CMS sits behind Imunify360 bot-protection. It returns 415 without
      // an explicit Accept header, and challenges non-browser User-Agents —
      // so we present as a normal browser client to get the real JSON back.
      // A self-signed bearer JWT (when configured) authenticates this server
      // as the trusted frontend client (JWT_SECRET is server-only — never
      // expose it with NEXT_PUBLIC_).
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: {
        revalidate: 3600,
        tags: [tag, "all"],
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${endpoint} (Status: ${res.status})`);
    }

    const text = await res.text();
    let data = parseAPIResponse<unknown>(text);

    // Bot-protection can answer with a 200 + denial object instead of the
    // real data. Treat that as a failure so callers fail soft (→ null)
    // rather than receiving a junk { message } object that breaks `.find`/`.map`.
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      typeof (data as { message?: unknown }).message === "string" &&
      /imunify360|bot[- ]?protection|access denied/i.test((data as { message: string }).message)
    ) {
      throw new Error(`API blocked by bot-protection: ${endpoint}`);
    }

    // The CMS also answers empty/missing data with an HTTP 200 body shaped
    // like `{ action: "error", message: "no data found" }` instead of a
    // non-2xx status. Treat that the same as a failed fetch so callers get
    // `null` (and fall back to local content) rather than an object where
    // an array was expected.
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      (data as { action?: unknown }).action === "error"
    ) {
      throw new Error(`API returned an error payload for ${endpoint}: ${(data as { message?: string }).message ?? "unknown error"}`);
    }

    // Extract by slug if response is a dictionary
    if (slug && data && typeof data === "object") {
      data = (data as Record<string, unknown>)[slug] ?? data;
    }

    // Clean HTML if it exists in the article data
    if (data && typeof data === "object" && typeof (data as { html?: unknown }).html === "string") {
      (data as { html: string }).html = cleanArticleHTML((data as { html: string }).html);
    }

    return data as T;
  } catch (error) {
    console.warn(`[fetchAPI] Error fetching ${url}:`, error);
    return null;
  }
}

/** Extension point for stripping legacy/technical classes from CMS rich-text HTML. */
function cleanArticleHTML(html: string): string {
  if (!html) return "";
  return html;
}
