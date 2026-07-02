# SHRIVAS-64 Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Shrivas VM's portfolio as SHRIVAS-64 — a fictional Japanese retro game-console OS with a boot screen, a widget desktop over a duotoned messy-room wallpaper, draggable windows, and full mobile play.

**Architecture:** Single Next.js App Router route. A Zustand store is the "OS kernel" (boot config, open windows, z-order). `Console` gates BootScreen vs Desktop; `Window` is one draggable chrome component fed by per-widget content; a pure-CSS CRT overlay sits above everything. Content lives as typed data in `src/content`, separate from components.

**Tech Stack:** Next.js 15 (App Router, TS), Tailwind v4, framer-motion, Zustand, vitest (store/logic tests), Playwright (flow + responsive verification), sharp (one-off wallpaper duotone bake).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-03-shrivas-64-console-design.md`; visual system: `DESIGN.md`; strategy: `PRODUCT.md`. All three bind every task.
- Palette tokens exactly as DESIGN.md: `--crt-black oklch(0.13 0.012 210)`, `--crt-well oklch(0.18 0.015 210)`, `--phosphor oklch(0.82 0.14 200)`, `--phosphor-dim oklch(0.6 0.08 200)`, `--ink oklch(0.96 0.01 200)`, `--ink-muted oklch(0.72 0.02 210)`, `--alert oklch(0.62 0.21 27)`, `--memo oklch(0.88 0.16 95)`.
- Fonts: Segment (display ≥20px, tracked +0.02–0.06em, never prose) · DotGothic16 (UI chrome, ≥14px) · Zen Kaku Gothic New (prose, ≥16px, lh 1.7).
- Motion: ease-out-expo `cubic-bezier(0.16,1,0.3,1)`; window open 180ms scale 0.96→1; no bounce; every animation has a `prefers-reduced-motion` alternative; no strobe >3 flashes/s.
- A11y: WCAG AA contrast on real backdrops, touch ≥44×44px, full keyboard operation, in-fiction focus brackets.
- Audio defaults OFF; every sound call gates on store config.
- Copy passes stop-slop: no throat-clearing, no adverb padding, active voice, machine-in-character.
- Commit after every task; messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Design tokens, fonts, global CSS

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: none (Segment already at `public/fonts/`)

**Interfaces:**
- Produces: CSS vars per Global Constraints; font CSS vars `--font-segment`, `--font-dot`, `--font-zen`; utility classes `.font-segment`, `.font-dot`, `.font-zen`, `.focus-brackets`.

- [ ] **Step 1:** Rewrite `globals.css`: `@import "tailwindcss";` then `@font-face` for Segment (`/fonts/Segment-Regular.woff2`, `font-display: swap`), `:root` tokens from Global Constraints, `@theme inline` mapping Tailwind color names (`crt-black`, `crt-well`, `phosphor`, `phosphor-dim`, `ink`, `ink-muted`, `alert`, `memo`) and the three font vars, body defaults (`background: var(--crt-black); color: var(--ink)`), `.focus-brackets` (corner-bracket outline via `outline: 2px solid var(--phosphor); outline-offset: 2px; clip-path: none` styled brackets using `::before/::after` optional — minimum: visible 2px phosphor outline), and a `@media (prefers-reduced-motion: reduce)` block killing nonessential animation.
- [ ] **Step 2:** `layout.tsx`: load DotGothic16 + Zen Kaku Gothic New via `next/font/google` (subsets latin; DotGothic16 weight "400", Zen weights "400","700"), set `<html lang="en" className={vars}>`, metadata: title `SHRIVAS-64`, description in machine voice, OG fields.
- [ ] **Step 3:** `npm run dev` — page loads with black bg, no console errors. Commit.

### Task 2: Assets — organize + bake duotone wallpaper

**Files:**
- Create: `scripts/bake-wallpaper.mjs`, `public/images/wallpaper.webp`, `public/images/{portrait-ento.webp, poster-ento.webp}`
- Move: user-dropped media out of repo root into `public/images/raw/` (git-ignored) — keep originals untouched.

**Interfaces:**
- Produces: `/images/wallpaper.webp` (1920w + 828w `wallpaper-mobile.webp`, cyan-shadow duotone, pre-darkened so `--ink` text hits AA on it), `/images/portrait-ento.webp`, `/images/poster-ento.webp`.

- [ ] **Step 1:** `npm i -D sharp`. Write `bake-wallpaper.mjs`: read `wonderlane-6jA6eVsRJ6Q-unsplash.jpg`; `.modulate({saturation:0.25})`, `.tint({r:70,g:140,b:150})`, `.linear(0.62, -8)` (darken), export webp q78 at 1920w and 828w. Convert the two WhatsApp portraits + ENTØ poster to webp (max 1200w).
- [ ] **Step 2:** Run script; visually inspect output with Read; adjust tint/linear until the room reads "1 a.m. CRT bedroom" and near-white text is legible over it. Add `public/images/raw/` + root media patterns to `.gitignore`. Commit.

### Task 3: OS store (TDD)

**Files:**
- Create: `src/store/os.ts`, `src/store/os.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces:
```ts
type WidgetId = "story" | "ento" | "music" | "stats" | "contact";
type Phase = "boot" | "desktop";
useOS: {
  phase: Phase; config: { audio: boolean; crt: boolean };
  windows: Record<WidgetId, { open: boolean; z: number }>;
  start(): void; toggleAudio(): void; toggleCrt(): void;
  openWindow(id: WidgetId): void; closeWindow(id: WidgetId): void; focusWindow(id: WidgetId): void;
  topWindow(): WidgetId | null; openIds(): WidgetId[];
}
```

- [ ] **Step 1:** `npm i -D vitest`; `vitest.config.ts` with `test: { environment: "node", include: ["src/**/*.test.ts"] }`; add `"test": "vitest run"` script.
- [ ] **Step 2:** Write failing tests: initial phase "boot" / audio false / crt true; `start()` → phase "desktop"; `openWindow` sets open + highest z; `focusWindow` raises z above all; `closeWindow` clears open; `topWindow` returns highest-z open id or null; reopening keeps single entry.
- [ ] **Step 3:** Run `npm test` — expect FAIL (module missing).
- [ ] **Step 4:** Implement store with zustand `create`; z-order via incrementing counter; persist `phase` + `config` to sessionStorage via zustand `persist` middleware (`createJSONStorage(() => sessionStorage)`, guarded for SSR) so an in-session return skips boot (spec requirement).
- [ ] **Step 5:** `npm test` → PASS. Commit.

### Task 4: Sound engine (TDD for gating)

**Files:**
- Create: `src/lib/sound.ts`, `src/lib/sound.test.ts`

**Interfaces:**
- Produces: `playSound(name: "boot"|"click"|"open"|"close", enabled: boolean): void` — pure gate + WebAudio synth (square-wave blips, ≤120ms; boot = 3-note rising arpeggio). No audio files.

- [ ] **Step 1:** Failing test: `playSound` with `enabled:false` never constructs AudioContext (inject/spyable factory `_setAudioContextFactory`); with `enabled:true` constructs once and reuses.
- [ ] **Step 2:** `npm test` → FAIL. Implement: lazy singleton AudioContext behind factory; oscillator envelope per name. `npm test` → PASS. Commit.

### Task 5: BootScreen

**Files:**
- Create: `src/components/console/BootScreen.tsx`, `src/components/console/Console.tsx`
- Modify: `src/app/page.tsx` (render `<Console/>`, client boundary)

**Interfaces:**
- Consumes: `useOS` (config, toggleAudio, toggleCrt, start), `playSound`.
- Produces: `<Console/>` gating `phase === "boot" ? <BootScreen/> : <Desktop/>` (Desktop stubbed as `<div data-testid="desktop"/>` until Task 6).

- [ ] **Step 1:** BootScreen per spec: centered phosphor-bordered panel on `--crt-black`; DotGothic16 header `シュリヴァス-64 SYSTEM CONFIGURATION`, Segment title `SHRIVAS-64`; two toggle rows (AUDIO, CRT MODE) as real `<button role="switch" aria-checked>` ≥44px; `START →` button calls `playSound("boot", config.audio)` then `start()`. Staged reveal with framer-motion stagger ≤1.6s, any click/keypress completes it instantly; reduced-motion renders complete.
- [ ] **Step 2:** Playwright smoke: boot renders, toggles flip aria-checked, START reaches desktop stub, keyboard-only run works. Screenshot 1440px — poster check against `docs/inspiration/myideal-1-initial.png`. Commit.

### Task 6: Desktop shell — wallpaper, Window, Taskbar, CRT overlay

**Files:**
- Create: `src/components/console/{Desktop,Window,Taskbar,CrtOverlay}.tsx`
- Modify: `Console.tsx` (mount CrtOverlay when `config.crt`)

**Interfaces:**
- Consumes: store, `playSound`.
- Produces: `<Window id title children>` — draggable (framer-motion `drag dragMomentum={false} dragConstraints` ref to desktop), title bar (DotGothic16, ✕ button ≥44px), scale-snap open/close via AnimatePresence, `onPointerDown → focusWindow`; Taskbar with live clock (`toLocaleTimeString`, minute tick), audio/CRT toggles, open-window tabs (click → focus); CrtOverlay fixed, `pointer-events-none`, z-40, scanlines + vignette + ≤8%-opacity flicker (none under reduced-motion).

- [ ] **Step 1:** Build Desktop: full-viewport `bg-[url(/images/wallpaper.webp)] bg-cover`, film-grain SVG layer, cartridge tile row (stub buttons for 5 widgets calling `openWindow`), windows rendered from store, Taskbar bottom, "note to self: try clicking around!" memo-yellow sticky.
- [ ] **Step 2:** Playwright: open/close/focus windows, drag moves window, z-order visually correct, clock ticks, tabs focus. Commit.

### Task 7: Content data + five widgets

**Files:**
- Create: `src/content/{story,ento,music,stats,contact}.ts`, `src/components/console/widgets/{StoryWidget,EntoWidget,MusicWidget,StatsWidget,ContactWidget}.tsx`
- Modify: `Desktop.tsx` (real cartridge tiles with insert-hover animation, wire widget bodies into Window)

**Interfaces:**
- Consumes: `Window`, content modules (typed exports, e.g. `storyBeats: {speaker: string; line: string; img?: string}[]`).
- Produces: five mounted widgets per spec table.

- [ ] **Step 1:** Write content in machine voice (stop-slop pass): STORY dialog beats (Coimbatore → ENTØ founding → Netherlands) using portrait images; ENTØ blurb + entostudios.com link + poster image; MUSIC static rotation (title/artist/cover-color, grain treatment — no copyrighted cover art embedded, recreate grain language with typographic covers); STATS character sheet (LVL, CLASS FOUNDER/DESIGNER/DEV, playful meters); CONTACT links (Instagram, LinkedIn, mailto) as "LINK CABLES", `rel="noopener"`.
- [ ] **Step 2:** Build the five widget bodies: prose in Zen Kaku, readouts in Segment, labels in DotGothic16; images with real alt text; STORY advances dialog on click like a JRPG textbox (`▼` indicator).
- [ ] **Step 3:** Ticker: `<Ticker/>` red marquee, linear infinite, `animation-play-state: paused` on hover, duplicated track for seamless loop, headlines from `src/content/ticker.ts`; add one easter egg (e.g. clicking taskbar clock 3× opens a hidden `VOID` mini-window). Mount both. Playwright: all five open, links valid, STORY advances. Commit.

### Task 8: Mobile adaptation

**Files:**
- Modify: `Desktop.tsx`, `Window.tsx`, `globals.css`

**Interfaces:**
- Produces: ≤768px behavior — cartridge 2-col grid, windows as full-screen sheets (no drag, slide-up 200ms), `wallpaper-mobile.webp`, taskbar condensed; no horizontal scroll at 375px.

- [ ] **Step 1:** Implement via CSS + a `useMediaQuery` hook gating `drag` and window sizing.
- [ ] **Step 2:** Playwright 375/768/1280: no horizontal scroll, tap targets ≥44px, sheets open/close, boot playable one-thumbed. Commit.

### Task 9: SEO floor, metadata, polish gate

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `public/og.png` (baked poster frame)

**Interfaces:**
- Produces: OG/Twitter card, noscript-visible identity block (name, one-liner, contact links) server-rendered inside `page.tsx` behind the client Console.

- [ ] **Step 1:** Server-render the SEO floor; verify with `curl localhost:3000 | grep Shrivas`.
- [ ] **Step 2:** Run `/impeccable audit` mindset checks: axe-style contrast on real screenshots, focus order, reduced-motion run, Lighthouse (Perf ≥90, A11y ≥95, BP ≥90). Fix what fails. Commit.

### Task 10: Final verification + reel-readiness

- [ ] **Step 1:** Full Playwright suite green; screenshots at 3 viewports saved to scratchpad; side-by-side vs `docs/inspiration/` refs — poster test on every frame.
- [ ] **Step 2:** `npm run build` clean, no console errors in prod mode. `superpowers:verification-before-completion` checklist. Commit; offer `/finishing-a-development-branch`.
