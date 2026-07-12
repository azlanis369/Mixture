# STATE — RENFlow Plus (Mixture landing)

Updated: 2026-07-12 · Loop #2 outcome.

Paired with the loop kickoff prompt (below §Kickoff). This file is the
work-tracking artefact — read + rewrite it at the start and end of every
loop run.

## Goal

RENFlow Plus — mobile-first workspace for individual RENs. Landing sells
without over-promising beta. Enjin `superren.group` is **abandoned, donor
code only** (not live, not going live). RENFlow Plus is the only product
going forward.

## Architecture gate

**Default: duplicate + rebrand.** Confirmed in Loop #1. Mixture landing
(this repo) and `renflowplus-app` CRM are already standalone; no
white-label is being introduced. Reconsider only when RENFlow Plus itself
has traction and a real second tenant appears.

## 5 guardrails (source of truth for triage)

- **G1** — Every "Live" claim must actually work in the CRM today.
- **G2** — No fabricated numbers or user stats.
- **G3** — Copy stays in the honest Live / Draft-Beta / Roadmap register.
- **G4** — Third-party-API dependent modules stay Roadmap until approved.
- **G5** — Never imply `superren.group` is a live system. Historical
  origin framing only.

## Loop #1 — DONE ✅ (12 Jul 2026)

Triage: 5 landing spots implied `superren.group` was a live system. Fixed
in PR #28 (merged, `76d78a6`):

- `Proof.tsx` — browser mockup URL bar → `app.renflowplus.com/dashboard`;
  caption reframed to origin-history.
- `Footer.tsx` — Data-proof disclaimer reframed to origin-history.
- `Faq.tsx` — Live/Draft/Roadmap answer switched to past-tense proof.
- `OriginStory.tsx` — byline shifts from "Pembina Sistem —
  superREN.group CRM Pro" to RENFlow Plus builder framing.
- `AppHub.tsx` and `README.md` — internal notes updated.
- `ENGINE_SOURCE_NAME` constant removed (only used by the URL bar we
  replaced).

Checker passes: separate re-read against G1–G5, `grep superren src/`
(only remaining hit is a defensive code comment in `Nav.tsx`), and
`npm run build` green.

## Loop #2 — DONE ✅ (12 Jul 2026)

Both P2 items from Loop #1 closed in PR #30 (merged, `187e61b`):

- **Poster template naming unified.** Hero callout now reads "Galeri
  Multi-Foto" to match App Hub. `grep Galeri src/` returns only two
  hits, both descriptive.
- **Full LPPEH board name added to landing.** New section
  `#6 Kepatuhan Profesional REN` inside Footer's Terma & Syarat spells
  out "Lembaga Penilai, Pentaksir, Ejen Harta Tanah dan Pengurus Harta
  (LPPEH)" once, then uses the abbreviation. Also clarifies that
  RENFlow Plus is a workflow tool, not a substitute for REN
  registration.

Checker: separate re-read + `grep`, `tsc --noEmit` clean,
`npm run build` green. Guardrails intact (no superren.group live claim,
copy honest about beta register).

## Open items — next loop

None right now. Next loop starts with a fresh triage against G1–G5 to
find whatever surfaces after these polishes.

## Stop conditions

- Landing P0 gaps clear and build green, OR
- Checker rejects the same issue twice → escalate to Azlan, OR
- Triage-pass budget spent (one full pass per loop).

## Budget / models

- Opus for planning + checker passes.
- Sonnet for bulk implementation when quota is tight.
- Cap: one full triage pass per loop before reporting back.

## Lessons (intent debt)

- **Present-tense byline is a live claim.** "Pembina Sistem — X" reads
  as an active role, not history. Loop #1 caught 5 of these; watch for
  the pattern (verb + external system name in present tense) in every
  future triage.
- **Constants can smuggle claims.** `ENGINE_SOURCE_NAME` looked
  innocuous but its only consumer rendered "superren.group/dashboard"
  live on-page. When removing a copy claim, also delete the constant
  that fed it — leaving it dangling invites a future component to
  reintroduce the claim.
- **Two names for one thing = future doubt** (Loop #2). Hero said
  "Galeri", App Hub said "Galeri Multi-Foto" for the same template.
  A lead reading top-to-bottom will wonder if it's two features. Any
  time a product-facing name is coined, grep the repo before
  committing — one canonical string, everywhere.
- **Regulator names need the full form once, then the acronym**
  (Loop #2). Landing had "LPPEH" everywhere but never spelled the
  board name out — that reads confident to insiders and vague to
  everyone else. Same rule for any Malaysian regulator/board that
  appears on landing/legal.

---

## Kickoff prompt — paste into Claude Code (repo `azlanis369/Mixture`)

```
Baca STATE.md dulu. Awak loop berikutnya untuk RENFlow Plus (repo ini).

1. TRIAGE — scan repo + landing terhadap 5 guardrail (G1–G5) di STATE.md.
   Ganti/kemas §"Open items" dengan gap SEBENAR yang ada hari ini
   (P0/P1/P2). Rujuk STATE.md sebagai source of truth; jangan reka copy.

2. ARCHITECTURE GATE — default = duplicate + rebrand. Sahkan. Kalau ada
   bukti kuat white-label perlu, flag ke Azlan dengan bukti.

3. WRITER/CHECKER — setiap fix P0: satu pass buat, satu pass BERASINGAN
   sahkan lawan G1–G5 + `npm run build` green sebelum commit. Tiada
   self-grading.

4. Bila green → commit + push + PR. Tulis semula STATE.md (Loop
   outcome + langkah seterusnya + pelajaran baharu). Escalate ke Azlan
   hanya di vision/irreversible; selebihnya teruskan sendiri.

Stop: P0 landing habis & build green, ATAU checker reject 2× isu sama,
ATAU budget triage habis. Model: Opus plan/checker, Sonnet bulk.
```
