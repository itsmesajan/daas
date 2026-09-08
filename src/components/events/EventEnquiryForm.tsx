"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Send } from "lucide-react";
import Recaptcha from "@/components/ui/Recaptcha";

const scheduleSlots = ["Morning (6 AM – 12 PM)", "Day (12 PM – 6 PM)", "Evening (6 PM – 10 PM)"];

const eventEnquirySchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  event_name: z.string().min(2, "Event name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .regex(/^[0-9+-\s]+$/, "Phone number can only contain digits, spaces, +, or -"),
  schedule_slot: z.string().min(1, "Schedule slot is required"),
  event_date: z.string().min(1, "Event date is required"),
  address: z.string().optional(),
  pax: z.string().min(1, "Number of guests is required"),
  special_request: z.string().optional(),
});

type EventEnquiryFormData = z.infer<typeof eventEnquirySchema>;

const inputClass =
  "w-full rounded-xl border border-white/70 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-bento-ink placeholder:text-bento-ink-soft/60 transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30";

export default function EventEnquiryForm({ hallName }: { hallName?: string }) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventEnquiryFormData>({
    resolver: zodResolver(eventEnquirySchema),
    defaultValues: { schedule_slot: "" },
  });

  const onSubmit = async (formData: EventEnquiryFormData) => {
    if (!captchaToken) {
      setSubmitError("Please complete the reCAPTCHA");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const endpoint = process.env.NEXT_PUBLIC_SITE_URL + "/enquery_mail_hall.php";

    try {
      const submissionData = {
        ...formData,
        package_name: hallName || "General Enquiry",
        "g-recaptcha-response": captchaToken,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Server responded with an error");

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
          Your event enquiry has been sent successfully. We will get back to you soon.
        </p>
        <button type="button" onClick={() => setSubmitSuccess(false)} className="bento-btn mx-auto w-fit">
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="bento-pill w-fit mb-4">Get In Touch</p>
      <h2 className="bento-title text-2xl md:text-3xl mb-6">Event Enquiry</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ee-full-name" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Full Name *
            </label>
            <input id="ee-full-name" type="text" {...register("full_name")} className={inputClass} placeholder="John Doe" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <label htmlFor="ee-event-name" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Event Name *
            </label>
            <input
              id="ee-event-name"
              type="text"
              {...register("event_name")}
              className={inputClass}
              placeholder="Wedding Reception"
            />
            {errors.event_name && <p className="text-red-500 text-xs mt-1">{errors.event_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ee-email" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Email Address *
            </label>
            <input id="ee-email" type="email" {...register("email")} className={inputClass} placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="ee-phone" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Phone Number *
            </label>
            <input id="ee-phone" type="tel" {...register("phone")} className={inputClass} placeholder="+977 98XXXXXXXX" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ee-schedule-slot" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Schedule Slot *
            </label>
            <select id="ee-schedule-slot" {...register("schedule_slot")} className={inputClass}>
              <option value="" disabled>
                Select a slot
              </option>
              {scheduleSlots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.schedule_slot && <p className="text-red-500 text-xs mt-1">{errors.schedule_slot.message}</p>}
          </div>
          <div>
            <label htmlFor="ee-event-date" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Event Date *
            </label>
            <input
              id="ee-event-date"
              type="date"
              {...register("event_date")}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
            {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ee-address" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Address
            </label>
            <input id="ee-address" type="text" {...register("address")} className={inputClass} placeholder="Kathmandu, Nepal" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label htmlFor="ee-pax" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
              Number of Guests (Pax) *
            </label>
            <input id="ee-pax" type="number" min={1} {...register("pax")} className={inputClass} placeholder="50" />
            {errors.pax && <p className="text-red-500 text-xs mt-1">{errors.pax.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="ee-special-request" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
            Special Requests
          </label>
          <textarea
            id="ee-special-request"
            rows={4}
            {...register("special_request")}
            className={inputClass}
            placeholder="Any special requirements, dietary needs, or setup preferences..."
          />
        </div>

        <Recaptcha onChange={(token) => setCaptchaToken(token)} />
        {submitError && <p className="text-red-500 text-xs font-medium">{submitError}</p>}

        <button type="submit" disabled={isSubmitting} className="bento-btn w-fit mt-2 disabled:opacity-60">
          {isSubmitting ? "Sending..." : "Send Enquiry"}
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
