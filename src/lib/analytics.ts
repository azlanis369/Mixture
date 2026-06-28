declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLead(source: string, isCheckoutIntent = false) {
  if (typeof window === "undefined") return;

  if (isCheckoutIntent) {
    window.fbq?.("track", "InitiateCheckout", { content_name: source });
    window.ttq?.track("InitiateCheckout", { content_name: source });
    window.gtag?.("event", "begin_checkout", { source });
    return;
  }

  window.fbq?.("track", "Lead", { content_name: source });
  window.ttq?.track("ClickButton", { content_name: source });
  window.gtag?.("event", "generate_lead", { source });
}
