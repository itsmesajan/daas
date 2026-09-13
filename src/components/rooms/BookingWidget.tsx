"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import DateField from "@/components/ui/DateField";
import { SITE_FALLBACK } from "@/config/site";

interface BookingWidgetProps {
  bookingUrl?: string;
}

export default function BookingWidget({ bookingUrl }: BookingWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);

  const resolvedUrl = bookingUrl || SITE_FALLBACK.bookingUrl;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    setError(null);
    router.push(resolvedUrl);
  };

  return (
    <div className="bento-card p-6 md:p-8">
      <h3 className="bento-title text-lg mb-5 text-center">Secure Your Booking Today</h3>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <DateField label="Check-in date" value={checkIn} onChange={setCheckIn} minDate={new Date()} />
        <DateField label="Check-out date" value={checkOut} onChange={setCheckOut} minDate={checkIn ?? new Date()} />
        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" className="bento-btn w-full justify-center mt-2">
          <CalendarCheck size={15} />
          Check Availability
        </button>
      </form>
    </div>
  );
}
