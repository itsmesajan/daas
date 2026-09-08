"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Send } from "lucide-react";
import Recaptcha from "@/components/ui/Recaptcha";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .regex(/^[0-9+-\s]+$/, "Phone number can only contain digits, spaces, +, or -"),
  address: z.string().min(3, "Address is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inputClass =
  "w-full rounded-xl border border-white/70 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-bento-ink placeholder:text-bento-ink-soft/60 transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30";

export default function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (formData: ContactFormData) => {
    if (!captchaToken) {
      setSubmitError("Please complete the reCAPTCHA");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const endpoint = process.env.NEXT_PUBLIC_SITE_URL + "/enquery_mail_contact.php";

    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
        "g-recaptcha-response": captchaToken,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
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
      <div className="bento-card p-8 md:p-10 text-center" role="alert">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-accent-orange" strokeWidth={1.5} />
        <h3 className="bento-title text-xl mb-2">Thank you!</h3>
        <p className="text-bento-ink-soft text-sm mb-6">
          Your message has been sent successfully. We will get back to you soon.
        </p>
        <button type="button" onClick={() => setSubmitSuccess(false)} className="bento-btn mx-auto w-fit">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bento-card p-6 md:p-8 flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          {...register("name")}
          className={inputClass}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          {...register("email")}
          className={inputClass}
          placeholder="Your email address"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            {...register("phone")}
            className={inputClass}
            placeholder="Your phone number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-address" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
            Address
          </label>
          <input
            id="contact-address"
            type="text"
            {...register("address")}
            className={inputClass}
            placeholder="Your address"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          className={inputClass}
          placeholder="Tell us about your enquiry..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Recaptcha onChange={(token) => setCaptchaToken(token)} />
      {submitError && <p className="text-red-500 text-xs font-medium">{submitError}</p>}

      <button type="submit" disabled={isSubmitting} className="bento-btn w-fit mt-2 disabled:opacity-60">
        {isSubmitting ? "Sending..." : "Send Message"}
        <Send size={14} />
      </button>
    </form>
  );
}
