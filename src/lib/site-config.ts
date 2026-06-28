// TODO(azlan): replace with the real Super Ren Group WhatsApp number before launch.
// Format: country code + number, no symbols (e.g. "60123456789").
export const WHATSAPP_NUMBER = "60123456789";
export const WHATSAPP_DEMO_MESSAGE =
  "Hi, saya nak minta demo RENFlow Plus (Early Access).";

export function whatsappLink(message: string = WHATSAPP_DEMO_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SITE_NAME = "RENFlow Plus";
export const ENGINE_SOURCE_NAME = "superren.group";
