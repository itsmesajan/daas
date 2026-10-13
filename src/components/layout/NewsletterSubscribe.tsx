const MAILCHIMP_ACTION =
  "https://hoteldaaaskathmandu.us8.list-manage.com/subscribe/post?u=b025f28e466b12c29c3bf893d&id=32ecd183c1&f_id=005018e1f0";
const MAILCHIMP_HONEYPOT = "b_b025f28e466b12c29c3bf893d_32ecd183c1";

/**
 * Mailchimp's classic embedded form, restyled to match the site instead of
 * loading Mailchimp's own CSS — submits as a real browser POST
 * (target="_blank") straight to list-manage.com, same as their embed
 * snippet, so Mailchimp's own success/error response opens in the new tab
 * and no custom submit-state handling is needed here. Their mc-validate.js
 * and SMS-country-dropdown script are skipped entirely: script tags don't
 * execute via dangerouslySetInnerHTML anyway, this form has no phone field,
 * and native `type="email" required` covers the same validation their JS added.
 */
export default function NewsletterSubscribe() {
  return (
    <form action={MAILCHIMP_ACTION} method="post" target="_blank" className="relative w-full sm:w-auto">
      {/* Anti-bot honeypot — real people should leave this empty/untouched. */}
      <div aria-hidden="true" className="absolute left-[-5000px]">
        <input type="text" name={MAILCHIMP_HONEYPOT} tabIndex={-1} defaultValue="" />
      </div>

      <input
        type="email"
        name="EMAIL"
        required
        placeholder="Your email address"
        aria-label="Email address"
        className="rounded-full border border-white/70 bg-white/80 backdrop-blur-sm pl-5 pr-32 py-3 text-sm text-bento-ink placeholder:text-bento-ink-soft/60 transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30 w-full sm:w-80"
      />
      <button
        type="submit"
        className="bento-btn absolute right-1.5 top-1/2 -translate-y-1/2 py-2! px-5! text-xs"
      >
        Subscribe
      </button>
    </form>
  );
}
