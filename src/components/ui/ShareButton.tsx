"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** Native OS share sheet (mobile/modern desktop browsers); falls back to copying the link where the Web Share API isn't available. */
export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing more we can do.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share this post"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/50 text-bento-ink-soft hover:bg-accent-orange hover:text-white transition-colors"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
    </button>
  );
}
