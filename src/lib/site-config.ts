export const WHATSAPP_NUMBER = "60105013699";
export const WHATSAPP_DEMO_MESSAGE =
  "Hi, saya nak minta demo RENFlow Plus (Early Access).";

export function whatsappLink(message: string = WHATSAPP_DEMO_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SITE_NAME = "RENFlow Plus";
