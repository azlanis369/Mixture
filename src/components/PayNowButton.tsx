"use client";

import { trackLead } from "@/lib/analytics";

type Props = {
  source: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PayNowButton({
  source,
  className = "",
  children = "Bayar Sekarang · RM69",
}: Props) {
  const url = process.env.NEXT_PUBLIC_BILLPLZ_PAYMENT_URL;

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead(source, true)}
      className={className}
    >
      {children}
    </a>
  );
}
