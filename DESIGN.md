# Design

SHRIVAS PS — a fictional Japanese retro game console OS. The design register is a CRT machine from an alternate 1996, art-directed like a film and executed to the pixel.

Mood in one phrase: **CRT phosphor at 1 a.m. in a messy teenage bedroom — bootleg Famicom energy, film grain, one machine that loves you back.**

## Color

Strategy: **Full palette** — four named roles, each with one job, on a near-black CRT surface. The screen itself is the brand surface (drenched dark), color arrives as phosphor.

```css
:root {
  /* surfaces */
  --crt-black: oklch(0.13 0.012 210);   /* body bg — CRT glass, faint cyan cast */
  --crt-well: oklch(0.18 0.015 210);    /* window/panel bg */

  /* phosphor system (primary) */
  --phosphor: oklch(0.82 0.14 200);     /* cyan phosphor — system chrome, borders, selection */
  --phosphor-dim: oklch(0.6 0.08 200);  /* secondary system text, inactive chrome */

  /* ink */
  --ink: oklch(0.96 0.01 200);          /* body text on dark — near-white, cool cast */
  --ink-muted: oklch(0.72 0.02 200);    /* secondary text — ≥4.5:1 on --crt-black */

  /* alert (accent 1) */
  --alert: oklch(0.62 0.21 27);         /* Famicom red — tickers, notifications, record dots */

  /* memo (accent 2) */
  --memo: oklch(0.88 0.16 95);          /* sticky-note yellow — notes, highlights, save icons */
}
```

Rules:
- White (`--ink`) carries reading text; `--phosphor` carries the *machine's* voice (labels, borders, boot text).
- `--alert` and `--memo` are loud and rationed: tickers, badges, sticky notes. Never body text.
- Text over the wallpaper photo always sits on a solid or scrim panel — never raw on the image.
- The messy-room wallpaper is duotoned toward the palette (cyan-shadow / green-cast, like myideal's magenta room) so every widget reads against it.

## Typography

Three voices on a hard contrast axis: **segment display / bitmap / smooth**.

- **Segment** (Fontshare, self-hosted at `public/fonts/Segment-Regular.woff2`) — the machine's display voice. USER'S PICK; leads the identity. Hero/display type, clocks, stat readouts, tickers, big poster moments. It's a segmented-LED face: all-caps or numerals, display sizes only.
- **DotGothic16** — the console's UI voice. Window titles, labels, boot text, buttons. Dot-matrix with real katakana/kanji for bilingual accents (シュリヴァスPS).
- **Zen Kaku Gothic New** (400/700) — the human voice. Story prose inside windows, longer copy.

Rules:
- Segment never below 20px and never for prose — segmented faces are display hardware, not reading text.
- Body prose ≥16px, line-length ≤ 70ch, line-height 1.7 (light-on-dark needs air).
- DotGothic16 never below 14px (bitmap fonts crumble small).
- Display ceiling: clamp() max 5.5rem. Letter-spacing: Segment reads best slightly tracked OUT (+0.02–0.06em), never negative.
- `text-wrap: balance` on headings.

## Texture & Effects

- **CRT overlay**: one fixed div — scanlines (repeating-linear-gradient, 3px period, ≤8% opacity) + vignette + very subtle flicker (opacity keyframes, disabled under reduced-motion). Toggleable from boot config ("CRT: ON/OFF").
- **Film grain**: SVG turbulence noise at low opacity over the wallpaper layer only, echoing the ENTØ portrait grain.
- Chromatic-aberration / RGB-split reserved for transitions and hovers, never at rest.
- No glassmorphism, no glow bloom, no gradient orbs.

## Motion

Library: framer-motion (`motion`). Character: **mechanical, snappy, earned** — a machine responding, not a webpage easing.

- Boot sequence: staged text reveal (config screen → START), 1.6s max, skippable on any input.
- Windows: open with a 2-frame scale-snap (0.96 → 1.0, ~180ms, ease-out-expo) + soft shadow pop; close reverses. No bounce, no elastic.
- Drag: framer-motion `drag` with momentum off — windows feel weighty, snap within bounds.
- Tickers: linear infinite marquee, pausable on hover.
- Hover/focus: pixel selection brackets appear instantly (no transition) — game-cursor behavior.
- `prefers-reduced-motion`: boot becomes a single crossfade, flicker/marquee stop, windows fade.

## Components

- **BootScreen** — system-config fiction: AUDIO ON/OFF, CRT ON/OFF, START button. First frame of the site; must be a poster.
- **Desktop** — the home screen: duotoned messy-room wallpaper, widget/cartridge grid, ticker, taskbar.
- **Window** — draggable, closable panel with DotGothic16 title bar, phosphor border, `--crt-well` body. One component, many contents.
- **Cartridge tiles** — the launchers: STORY, ENTØ, NOW PLAYING, STATS, CONTACT. Hover = insert animation.
- **Ticker** — `--alert` red news marquee with mischievous headlines about Shrivas.
- **Taskbar** — clock (real time), audio toggle, CRT toggle, open-window tabs.
- **Music widget** — NOW PLAYING with album art, in the grain language of the SZA/Rocky covers.

## Layout

- Desktop (≥1024px): free canvas — windows and widgets at art-directed positions, draggable.
- Mobile (≤768px): same fiction, different physics — widgets become a tight 2-col grid of cartridges; windows open as full-screen sheets with a title bar ✕. No drag.
- Spacing: 8px base grid. Window padding 16/24. Chrome is tight (machine), prose is airy (human).
- Z-scale: wallpaper 0 → widgets 10 → focused window 20 → taskbar 30 → CRT overlay 40 (pointer-events: none) → boot 50.

## Assets

- `wonderlane-...unsplash.jpg` — messy room → duotone wallpaper.
- ENTØ duotone portraits (2 WhatsApp images) — STORY / ENTØ window imagery.
- Album covers (SZA SOS, Sloppy Joe, A$AP) — NOW PLAYING references; recreate the *grain language*, embed personal favorites.
- Reference screenshots in `docs/inspiration/` — myideal.me (structure bar), dawn.la (charm bar).
