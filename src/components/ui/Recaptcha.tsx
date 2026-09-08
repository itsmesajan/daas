"use client";

import { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Recaptcha({
  onChange,
  theme = "light",
}: {
  onChange: (token: string | null) => void;
  theme?: "light" | "dark";
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  // No reCAPTCHA key is provisioned yet — the widget throws on an empty
  // sitekey, so skip rendering it and let the form submit unguarded instead
  // of crashing the whole page. Once a real key exists, this renders normally.
  useEffect(() => {
    if (!siteKey) onChange("no-recaptcha-configured");
  }, [siteKey, onChange]);

  if (!siteKey) return null;

  return (
    <div className="flex justify-start">
      <ReCAPTCHA sitekey={siteKey} onChange={onChange} theme={theme} />
    </div>
  );
}
