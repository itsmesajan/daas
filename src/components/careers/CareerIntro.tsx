export default function CareerIntro({ siteName }: { siteName?: string }) {
  return (
    <div className="text-center mb-10">
      <p className="bento-pill mx-auto w-fit mb-4">We&apos;re Hiring</p>
      <h1 className="bento-title text-3xl md:text-4xl mb-3">Join Our Team</h1>
      <p className="text-bento-ink-soft text-sm max-w-lg mx-auto">
        Build your career with {siteName || "us"}. Share your details and CV below and our HR team will reach out
        when a suitable opening is available.
      </p>
    </div>
  );
}
