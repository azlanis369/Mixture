# Mixture

RENFlow Plus landing page — Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev
```

## Notes

- Copy and section structure follow `RENFLOW PLUS — CODEX BUILD SPEC v2`.
- `src/lib/site-config.ts` holds the WhatsApp number used by every CTA —
  it currently has a placeholder and must be swapped for the real Super Ren
  Group number before launch.
- The Proof section (`src/components/Proof.tsx`) renders the
  Views → Shares → Leads → Booked → Closed funnel as a structural diagram
  rather than fabricated numbers, per guardrail G2/G3. Swap in a real
  screenshot from `superren.group` when available (see TODO in that file).
- Headline font is Sora and body font is Inter (next/font/google) as
  freely-licensed substitutes for Clash Display / Satoshi from the spec.
