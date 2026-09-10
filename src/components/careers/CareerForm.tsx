"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, FileText, Send, UploadCloud, X } from "lucide-react";
import Recaptcha from "@/components/ui/Recaptcha";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const careerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  cv: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Please attach your CV")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "File must be under 5MB")
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Only PDF or Word documents are accepted"),
});

type CareerFormData = z.infer<typeof careerSchema>;

const inputClass =
  "w-full rounded-xl border border-white/70 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-bento-ink placeholder:text-bento-ink-soft/60 transition-colors focus:outline-none focus:border-accent-orange/50 focus:ring-2 focus:ring-accent-orange/30";

export default function CareerForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
  });

  const { onChange: onCvChange, ...cvField } = register("cv");

  const onSubmit = async (formData: CareerFormData) => {
    if (!captchaToken) {
      setSubmitError("Please complete the reCAPTCHA");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const endpoint = process.env.NEXT_PUBLIC_SITE_URL + "/enquery_mail_career.php";

    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name);
      submissionData.append("email", formData.email);
      submissionData.append("cv", formData.cv[0]);
      submissionData.append("g-recaptcha-response", captchaToken);

      const response = await fetch(endpoint, { method: "POST", body: submissionData });

      if (!response.ok) throw new Error("Server responded with an error");

      setSubmitSuccess(true);
      reset();
      setFileName(null);
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
          Your application has been submitted successfully. Our team will review your profile and get back to you soon.
        </p>
        <button type="button" onClick={() => setSubmitSuccess(false)} className="bento-btn mx-auto w-fit">
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="career-name" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Full Name *
        </label>
        <input id="career-name" type="text" {...register("name")} className={inputClass} placeholder="Your full name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="career-email" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Email Address *
        </label>
        <input
          id="career-email"
          type="email"
          {...register("email")}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="career-cv" className="block text-xs font-semibold text-bento-ink-soft mb-1.5">
          Upload CV *
        </label>
        <label
          htmlFor="career-cv"
          className="flex flex-col items-center justify-center gap-2 w-full rounded-xl border border-dashed border-white/70 bg-white/40 px-4 py-8 text-center cursor-pointer hover:border-accent-orange/50 transition-colors"
        >
          {fileName ? (
            <span className="flex items-center gap-2 text-sm text-bento-ink">
              <FileText className="w-5 h-5 text-accent-orange" />
              {fileName}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("cv", undefined as unknown as FileList);
                  setFileName(null);
                }}
                aria-label="Remove selected file"
                className="text-bento-ink-soft hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-bento-ink-soft" strokeWidth={1.5} />
              <span className="text-sm text-bento-ink-soft">Click to upload your CV</span>
              <span className="text-xs text-bento-ink-soft/70">PDF or Word, up to 5MB</span>
            </>
          )}
          <input
            id="career-cv"
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            {...cvField}
            onChange={(e) => {
              onCvChange(e);
              setFileName(e.target.files?.[0]?.name ?? null);
            }}
          />
        </label>
        {errors.cv && <p className="text-red-500 text-xs mt-1">{errors.cv.message as string}</p>}
      </div>

      <Recaptcha onChange={(token) => setCaptchaToken(token)} />
      {submitError && <p className="text-red-500 text-xs font-medium">{submitError}</p>}

      <button type="submit" disabled={isSubmitting} className="bento-btn w-fit mx-auto mt-2 disabled:opacity-60">
        {isSubmitting ? "Submitting..." : "Submit Application"}
        <Send size={14} />
      </button>
    </form>
  );
}
