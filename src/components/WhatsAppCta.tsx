"use client";

import { trackLead } from "@/lib/analytics";
import { whatsappLink } from "@/lib/site-config";

type WhatsAppCtaProps = {
  source: string;
  message?: string;
  className?: string;
  checkoutIntent?: boolean;
  children: React.ReactNode;
};

export default function WhatsAppCta({
  source,
  message,
  className,
  checkoutIntent = false,
  children,
}: WhatsAppCtaProps) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackLead(source, checkoutIntent)}
    >
      {children}
    </a>
  );
}
