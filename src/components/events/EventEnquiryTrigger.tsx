"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import EventEnquiryForm from "@/components/events/EventEnquiryForm";
import { SITE_FALLBACK } from "@/config/site";

interface EventEnquiryTriggerProps {
  hallName: string;
  whatsapp?: string;
}

export default function EventEnquiryTrigger({ hallName, whatsapp }: EventEnquiryTriggerProps) {
  const [open, setOpen] = useState(false);
  const cleanNumber = (whatsapp || SITE_FALLBACK.whatsapp).replace(/[^0-9]/g, "");

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-auto">
        <button type="button" onClick={() => setOpen(true)} className="bento-btn">
          <MessageSquareText size={14} />
          Enquire
        </button>
        <a
          href={`https://wa.me/${cleanNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-btn-ghost"
        >
          <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
          WhatsApp Us
        </a>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Enquire about ${hallName}`}>
        <EventEnquiryForm hallName={hallName} />
      </Modal>
    </>
  );
}
