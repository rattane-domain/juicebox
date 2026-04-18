# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Working with Maurice

- **Non-developer.** Maurice is not a developer. Explain things in plain language, avoid jargon. Use German unless he writes in English.
- **Always push after changes.** Every code change must be committed and pushed immediately so Cloudflare auto-deploys. Workflow: edit → `git add` → `git commit` → `git push`.
- **No deploy step needed.** Cloudflare Pages detects every push to `main` and rebuilds automatically (~2 min). The live URL is **juiceboxrad.io**.
- **Test tool available.** `/Users/maurice/Documents/M Dokumente/M Projects/stream-test.html` on disk — a local HTML file to test radio stream URLs before committing them.

---

## Commands

```bash
npm run dev      # Local dev server on port 3000
npm run build    # Production build → ./build/
```

No lint or test scripts exist.

---

## Architecture

Juicebox is a **pure static React/TypeScript PWA** — no backend, no database, no API keys. It's a 3D drink carousel radio player where each drink visual maps to a radio station.

### The ID system

The entire app is wired together by **drink IDs** (e.g. `'martini'`, `'sprudel'`, `'whisky'`). These IDs are the single source of truth linking three things:

1. **Visual** — `src/constants/drinks.tsx` (`DRINK_REGISTRY`): the carousel order and SVG components per drink
2. **Station** — `src/constants/stations.ts` (`STATION_CONFIGS`): the stream URL per drink ID
3. **Audio** — `src/hooks/useSimplePlayer.ts`: looks up station by drink ID at play time

**To swap a station onto a different drink visual**, you must update both files. Changing only `stations.ts` changes what plays but not what's shown. Changing only `drinks.tsx` changes visuals but not what plays.

> ⚠️ `src/constants/app.ts` contains a `drinkCategories` array that is **stale/unused** — it does not drive any logic, ignore it.

### Carousel & playback flow

`App.tsx` orchestrates everything:
- `usePhysicalCarousel` → manages swipe physics and `centerIndex`
- `useSimplePlayer` → one `<Audio>` element, loads stream by drink ID
- On startup: `pointerdown` on `StartScreen` triggers `setUserInteracted(true)` + begins loading drink 0 immediately (iOS audio unlock requires this during a user gesture)
- After swipe completes: `onComplete()` hides start screen; a `justLaunchedRef` blocks accidental center-tap for 600ms to prevent the startup swipe's `pointerup` from muting the stream

### Audio gotchas

- Stream URLs **must be HTTPS**. HTTP streams are blocked by browsers on HTTPS pages.
- **Do not set `crossOrigin = 'anonymous'`** on audio elements — most radio icecast servers don't send CORS headers, which silently blocks playback. It was removed intentionally.
- The `nightstar` drink has a **sleep timer** (33 min auto-fade) — the only drink with special behaviour.

### Static assets

Static files served at the root URL live in **`/public/`** (project root), not `src/public/`. Vite's default `publicDir` is the root-level `public/`.

Key files in `public/`:
- `icon-192x192.png`, `icon-512x512.png` — PWA icons (also used as MediaSession lock screen artwork)
- `apple-touch-icon.png` — iOS home screen
- `favicon.svg` — browser tab (modern), `favicon.ico` / `favicon-32x32.png` — Safari fallback
- `social-sharing.png` — OG image (1200×630)
- `stickerpack.png` — single image shown on the launch screen (replaces all individual sticker SVGs)
- `manifest.json` — PWA manifest

**Favicon order in `index.html` matters for Safari:** ICO/PNG must come before SVG, otherwise iOS Safari shows nothing.

### Password gate

The app shows a password screen when the env var `VITE_PASSWORD` is set. Set it in **Cloudflare Pages → Settings → Environment Variables**. Without the env var (e.g. locally), the gate is skipped. Password is never in source code.

### Deployment

```
Local Mac  →  git push  →  GitHub (rattane-domain/juicebox)  →  Cloudflare Pages (auto-build)  →  juiceboxrad.io
```

To trigger a redeploy without a code change: `git commit --allow-empty -m "trigger redeploy" && git push`

---

## Changing stations

Edit `src/constants/stations.ts`. Each entry:
```ts
{
  id: 'martini',          // must match DRINK_REGISTRY id in drinks.tsx
  name: 'Gri Balkon',     // displayed on screen
  primaryUrl: 'https://gribalkon.radioca.st/stream',
  fallbackSearchTerms: [],
  description: ''
}
```

To **swap two drink+station pairs** (visual + audio together): update SVG components in `drinks.tsx` AND station URLs in `stations.ts` for the two affected IDs.

## Changing drink SVGs

Each drink has three SVG states in `src/components/drinks/svgs/`: `Active`, `Passive`, `Loading`. They are imported in `drinks.tsx` and assigned per drink entry. To add a new loading animation, edit the `Loading` file for that drink.

## Adding a new drink

1. Add SVG files (Active/Passive/Loading) to `src/components/drinks/svgs/`
2. Import them in `drinks.tsx`, add entry to `DRINK_REGISTRY`
3. Add a matching entry with the same `id` to `STATION_CONFIGS` in `stations.ts`
