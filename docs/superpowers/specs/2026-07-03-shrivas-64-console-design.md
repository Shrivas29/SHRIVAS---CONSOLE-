# SHRIVAS-64 — Design Spec

Date: 2026-07-03
Status: approved direction (user-guided through brainstorming); font locked by user (Segment).

## What this is

Shrivas VM's personal portfolio, built as a playable machine: a fictional Japanese retro game console OS called SHRIVAS-64. Visitors boot it, land on a home screen, and explore widgets that each hold a fragment of who Shrivas is. No scrolling narrative; navigation is exploration.

Primary inspiration: myideal.me (boot screen → living desktop of clickable widgets). Secondary: dawn.la (charm through detail density). Personality: mischievous · cinematic · precise. Anti-references: template portfolio, generic vaporwave, corporate minimal, web3 slop.

PRODUCT.md carries strategy; DESIGN.md carries the visual system (palette, type, texture, motion). This spec carries structure and behavior.

## Stack

- Next.js App Router (already scaffolded at project root), TypeScript, Tailwind v4
- framer-motion for all animation, including window drag
- Zustand: OS state (open windows, z-order, focus, boot config: audio/CRT toggles)
- Self-hosted fonts: Segment (public/fonts), DotGothic16 + Zen Kaku Gothic New via next/font/google
- WebAudio for opt-in sound (boot jingle, click blips); silent unless AUDIO: ON at boot
- Deploy: Vercel

## Architecture

```
src/
  app/layout.tsx          fonts, metadata/OG, CRT overlay mount
  app/page.tsx            <Console/> (client)
  components/console/
    Console.tsx           boot-state gate: BootScreen | Desktop
    BootScreen.tsx        system config fiction + START
    Desktop.tsx           wallpaper, widget layout, ticker, taskbar
    Window.tsx            draggable window chrome (title bar, ✕, focus)
    Taskbar.tsx           clock, audio/CRT toggles, open-window tabs
    Ticker.tsx            red BREAKING NEWS marquee
    CrtOverlay.tsx        scanlines + vignette + flicker (CSS only)
    widgets/              one file per cartridge (Story, Ento, NowPlaying, Stats, Contact)
  store/os.ts             Zustand: windows[], zOrder, focus, config {audio, crt}
  lib/sound.ts            WebAudio hook, respects config.audio
  content/                widget copy as typed data, separated from components
```

State model: `windows: {id, open, pos, z}[]`; opening a widget pushes it to top z; Taskbar reflects open windows. Boot config persists in sessionStorage (returning visitors within a session skip boot; hard reload re-boots — the fiction is the feature).

## Screens & behavior

**Boot (screen 1).** CRT-black, phosphor-cyan DotGothic16 fiction: `シュリヴァス-64 SYSTEM CONFIGURATION`, toggles AUDIO ON/OFF (default OFF) and CRT MODE ON/OFF (default ON), `START →`. Staged text reveal ≤1.6s, skippable on any input. Reduced-motion: single crossfade.

**Home (screen 2).** Messy-room photo (wonderlane unsplash, duotoned cyan-dark per DESIGN.md) as wallpaper. On top:

| Cartridge | Contents |
|---|---|
| STORY | Coimbatore → Netherlands, founder at 17, game-dialog beats + ENTØ duotone portraits |
| ENTØ | The studio: what it is, entostudios.com link, "AI does it better" poster |
| NOW PLAYING | Music widget, grainy album art, Shrivas's actual rotation |
| STATS | Character sheet: LVL 17, class FOUNDER/DESIGNER/DEV, playful stats |
| CONTACT | Instagram, LinkedIn, email as console "link cables" |

Plus: red BREAKING NEWS ticker (mischievous headlines about Shrivas), taskbar with real clock and toggles. A "note to self: try clicking around" style hint. At least one hidden easter egg for pokers.

**Windows.** Desktop ≥1024px: draggable (momentum off, bounded), 2-frame scale-snap open (0.96→1.0, ~180ms, ease-out-expo), focus brings to front. Mobile ≤768px: cartridges in a 2-col grid; windows open as full-screen sheets, no drag. All openable/closable by keyboard; focus visible as pixel selection brackets.

## Copy voice

The machine talks: system messages, teasing hints, headlines in ticker-speak. All copy passes stop-slop (≥35/50). English leads; katakana/Japanese as UI garnish, never load-bearing.

## Quality gates (from global CLAUDE.md)

- WCAG AA contrast on real backdrops (grain/wallpaper counted); touch ≥44px; keyboard complete; `prefers-reduced-motion` full alternative; no strobe >3/s
- Playwright-verified at 375 / 768 / 1280+; no horizontal scroll; no console errors
- Lighthouse: Perf ≥90, A11y ≥95, Best Practices ≥90
- Images WebP-processed (wallpaper duotone pre-baked, not runtime-filtered)

## Error handling

- Fonts: `font-display: swap`; system fallbacks defined for all three voices
- JS disabled / crawlers: boot screen renders statically with name + one-line identity + contact links (SEO floor)
- Missing audio permission / autoplay block: sound silently stays off; toggle reflects reality

## Out of scope (v1)

- CMS, backend, analytics dashboards
- Real music API (NOW PLAYING is curated static data)
- Walkable character/overworld (explicitly chose console-OS metaphor instead)

## Testing

- Unit: store logic (open/close/focus/z-order), sound gating by config
- Playwright: boot → desktop flow, every widget opens/closes (mouse + keyboard), mobile sheet behavior, reduced-motion path, link validity
- Visual: screenshots at 3 viewports compared against docs/inspiration references for vibe parity
