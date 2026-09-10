"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Recaptcha from "@/components/ui/Recaptcha";

const todayISO = () => new Date().toISOString().split("T")[0];

const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .regex(/^[0-9+-\s]+$/, "Phone number can only contain digits, spaces, +, or -"),
  checkin_date: z
    .string()
    .min(1, "Check-in date is required")
    .refine((val) => val >= todayISO(), "Check-in date cannot be in the past"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type OfferFormData = z.infer<typeof offerSchema>;

const inputClass =
  "w-full rounded-xl border border-white/70 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-bento-ink placeholder:text-bento-ink-soft/60 transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30";

/**
 * Same fields/validation/submit contract as manakamanahillcrest's
 * OfferDetail form (booking_mail.php, the No. of People/Rate/Total
 * calculator, and the Pay Now → HBL gateway hand-off) — restyled with this
 * project's bento-glass UI instead of the luxury-gold one.
 */
export default function OfferEnquiryForm({ offerTitle, rate }: { offerTitle: string; rate?: string | null }) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // No.of People / Rate / Total / Pay Now-Later — only meaningful when the
  // CMS supplied a real per-person rate; never invent one.
  const [numPeople, setNumPeople] = useState(1);
  const [paymentOption, setPaymentOption] = useState<"now" | "later">("now");
  const ratePerPerson = Number(rate) || 0;
  const totalAmount = numPeople * ratePerPerson;

  // When booking_mail.php answers with a payment form (Pay Now), it hands
  // back a hidden <form> + inline auto-submit <script> that POSTs to the
  // payment gateway. dangerouslySetInnerHTML never runs embedded <script>
  // tags, so the injected form is submitted manually once it lands in the DOM.
  const [paymentFormHtml, setPaymentFormHtml] = useState<string | null>(null);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paymentFormHtml) return;
    const form = paymentFormRef.current?.querySelector<HTMLFormElement>('form[name="hblform"]');
    form?.submit();
  }, [paymentFormHtml]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: { checkin_date: todayISO() },
  });

  const onSubmit = async (formData: OfferFormData) => {
    if (!captchaToken) {
      setSubmitError("Please complete the reCAPTCHA");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const endpoint = process.env.NEXT_PUBLIC_SITE_URL + "/booking_mail.php";

    try {
      // booking_mail.php only takes the "save + confirm" path when
      // payment_type is exactly "pay_later" — anything else returns a
      // payment-form payload instead of a plain success. Offers with no rate
      // have nothing to calculate or pay, so they always go through as a
      // plain "pay_later" enquiry; offers with a rate send the calculator's
      // numbers plus the guest's actual Pay Now/Pay Later choice.
      const submissionData = {
        fullname: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkin_date: formData.checkin_date,
        message: formData.message,
        offer_title: offerTitle,
        "g-recaptcha-response": captchaToken,
        ...(ratePerPerson > 0
          ? {
              no_of_people: String(numPeople),
              adults_book: String(numPeople),
              total__pax: String(numPeople),
              room_price: ratePerPerson.toFixed(2),
              total_amount: totalAmount.toFixed(2),
              currency: "USD",
              payment_type: paymentOption === "later" ? "pay_later" : "pay_now",
            }
          : { payment_type: "pay_later" }),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Server responded with an error");

      const data = await response.json().catch(() => null);

      if (data?.payment_form && data?.payment_content) {
        // Pay Now: hand off to the payment gateway via a real browser navigation.
        setPaymentFormHtml(data.payment_content);
        return;
      }

      setSubmitSuccess(true);
      reset();
      setCaptchaToken(null);
    } catch (err) {
      setSubmitError("Something went wrong. Please try again later.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-6" role="alert">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
        <h3 className="bento-title text-xl mb-2">Thank you!</h3>
        <p className="text-bento-ink-soft text-sm mb-6">
          Your enquiry has been sent successfully. We will contact you soon.
        </p>
        <button type="button" onClick={() => setSubmitSuccess(false)} className="bento-btn mx-auto w-fit">
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="bento-pill w-fit mb-4">Reserve Your Stay</p>
      <h3 className="bento-title text-xl md:text-2xl mb-2">Interested in this offer?</h3>
      <p className="text-bento-ink-soft text-sm mb-6">Fill out the form below and we will get back to you shortly.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {ratePerPerson > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/40 p-5">
            <p className="text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70">Trip Details</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="offer-people" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
                  No. of People
                </label>
                <input
                  id="offer-people"
                  type="number"
                  min={1}
                  value={numPeople}
                  onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value) || 1))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-bento-ink-soft mb-1.5">Rate per Person</label>
                <div className="flex items-center overflow-hidden rounded-xl border border-white/70 bg-white/50">
                  <span className="border-r border-white/70 px-3 py-3 text-sm text-bento-ink-soft">$</span>
                  <input
                    type="text"
                    readOnly
                    value={ratePerPerson.toFixed(2)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-bento-ink outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="offer-checkin" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
                Check-in Date *
              </label>
              <input
                id="offer-checkin"
                type="date"
                min={todayISO()}
                {...register("checkin_date")}
                className={inputClass}
              />
              {errors.checkin_date && <p className="text-red-500 text-xs mt-1">{errors.checkin_date.message}</p>}
            </div>

            <div className="flex items-center justify-between border-t border-white/70 pt-3">
              <span className="text-sm text-bento-ink">Total Amount</span>
              <span className="text-lg font-bold text-accent-orange">USD {totalAmount.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentOption("now")}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                  paymentOption === "now"
                    ? "border-bento-ink bg-bento-ink text-white"
                    : "border-white/70 bg-white/50 text-bento-ink-soft"
                }`}
              >
                Pay Now
              </button>
              <button
                type="button"
                onClick={() => setPaymentOption("later")}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                  paymentOption === "later"
                    ? "border-bento-ink bg-bento-ink text-white"
                    : "border-white/70 bg-white/50 text-bento-ink-soft"
                }`}
              >
                Pay Later
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="offer-name" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
            Full Name *
          </label>
          <input id="offer-name" type="text" {...register("name")} className={inputClass} placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="offer-email" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Email Address *
            </label>
            <input
              id="offer-email"
              type="email"
              {...register("email")}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="offer-phone" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Phone Number *
            </label>
            <input
              id="offer-phone"
              type="tel"
              {...register("phone")}
              className={inputClass}
              placeholder="+977 98XXXXXXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Zero-rate offers skip the Trip Details card, so give the check-in
            date its own field instead of losing it. */}
        {ratePerPerson <= 0 && (
          <div>
            <label htmlFor="offer-checkin-plain" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Check-in Date *
            </label>
            <input
              id="offer-checkin-plain"
              type="date"
              min={todayISO()}
              {...register("checkin_date")}
              className={inputClass}
            />
            {errors.checkin_date && <p className="text-red-500 text-xs mt-1">{errors.checkin_date.message}</p>}
          </div>
        )}

        <div>
          <label htmlFor="offer-message" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
            Message *
          </label>
          <textarea
            id="offer-message"
            rows={4}
            {...register("message")}
            className={inputClass}
            placeholder="I would like to know more about this offer..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <Recaptcha onChange={(token) => setCaptchaToken(token)} />
        {submitError && <p className="text-red-500 text-xs font-medium">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bento-btn w-full justify-center mt-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Proceed to Booking
              <Send size={14} />
            </>
          )}
        </button>
      </form>

      {paymentFormHtml && <div ref={paymentFormRef} dangerouslySetInnerHTML={{ __html: paymentFormHtml }} />}
    </div>
  );
}
