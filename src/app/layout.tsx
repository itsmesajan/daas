import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { site, SITE_URL } from "@/config/site";
import FloatingButtons from "@/components/ui/Floating";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const bookman = localFont({
  src: [
    { path: "../assets/font/bookmanoldstyle.woff", weight: "400", style: "normal" },
    { path: "../assets/font/bookmanoldstyle_italic.woff", weight: "400", style: "italic" },
    { path: "../assets/font/bookmanoldstyle_bold.woff", weight: "700", style: "normal" },
    { path: "../assets/font/bookmanoldstyle_bolditalic.woff", weight: "700", style: "italic" },
  ],
  variable: "--font-bookman",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={site.locale} className={`${poppins.variable} ${bookman.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          precedence="default"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <MotionConfig reducedMotion="user">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-accent-orange focus:text-bento-ink focus:rounded-full focus:font-medium focus:text-sm"
          >
            Skip to main content
          </a>
          {/* Fixed ambient color field — gives the glass cards real color to
              refract at every scroll position, not just near the hero. */}
          <div className="bento-glow-field" aria-hidden="true">
            <span className="w-[26rem] h-[26rem] bg-accent-orange opacity-30 -top-20 -left-16" />
            <span className="w-[24rem] h-[24rem] bg-accent-blue opacity-25 top-1/3 -right-20" />
            <span className="w-[22rem] h-[22rem] bg-accent-orange opacity-20 bottom-10 left-1/4" />
            <span className="w-[24rem] h-[24rem] bg-accent-blue opacity-20 -bottom-24 -right-10" />
          </div>
          {children}
          <FloatingButtons />
        </MotionConfig>
      </body>
    </html>
  );
}
