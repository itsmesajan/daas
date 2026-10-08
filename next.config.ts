import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Lets the dev server accept the dining subdomain locally (e.g.
  // dining.localhost:3000) — Next.js blocks cross-origin dev requests by
  // default, this only relaxes that for local testing; the real
  // dining.hoteldaaas.com subdomain in production isn't affected by this.
  allowedDevOrigins: ["*.localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "www.mayurstay.com", pathname: "/**" },
      { protocol: "https", hostname: "mayurstay.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
