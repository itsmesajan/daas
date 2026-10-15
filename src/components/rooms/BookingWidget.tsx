"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import DateField from "@/components/ui/DateField";
import { SITE_FALLBACK } from "@/config/site";

interface BookingWidgetProps {
  bookingUrl?: string;
}

function tomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

export default function BookingWidget({ bookingUrl }: BookingWidgetProps) {
  // Defaults to today/tomorrow so the widget is ready to submit immediately
  // rather than forcing a guest to pick dates before they can even see
  // availability.
  const [checkIn, setCheckIn] = useState<Date | undefined>(() => new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(tomorrow);
  const [error, setError] = useState<string | null>(null);

  // siteregulars.booking_code is the hotel's actual booking-engine URL, on a
  // different domain (mayurstay.com) than this site — an external redirect,
  // not an internal route, so it needs a real browser navigation rather than
  // Next's client-side router (which is for in-app routes only).
  const resolvedUrl = bookingUrl || SITE_FALLBACK.bookingUrl;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    setError(null);
    window.location.href = resolvedUrl;
  };

  return (
    <div className="bento-card p-6 md:p-8">
      <h3 className="bento-title text-lg mb-5 text-center">Secure Your Booking Today</h3>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <DateField label="Check-in date" value={checkIn} onChange={setCheckIn} minDate={new Date()} />
        <DateField label="Check-out date" value={checkOut} onChange={setCheckOut} minDate={checkIn ?? new Date()} />
        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" className="cursor-pointer bento-btn w-full justify-center mt-2">
          <CalendarCheck size={15} />
          Check Availability
        </button>
      </form>
    </div>
  );
}
