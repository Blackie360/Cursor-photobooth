# Cursor Meetup Card Generator

A small, brand-faithful web app that lets any **Cursor Community ambassador** spin up a meetup social card in seconds — without touching Figma.

Built initially for **Cursor Nairobi**, but the editor is fully city‑agnostic. Drop in your own meetup title and hashtags (`/Lagos Meetup`, `/Berlin Meetup`, `/Bengaluru Meetup`, …), share the locked link with your attendees, and they’ll generate their own personalized card from their phone in two taps.



---

## Features

- **Locked Figma artwork** — the official meetup card stays pixel‑perfect. The app only composites a photo into the frame and re‑renders the title and hashtag layers.
- **Admin / Viewer modes** — admins edit, then copy a `?locked=1` URL with the title and tags baked in. Anyone opening the locked link sees a read‑only editor where the only thing they can change is their photo.
- **One‑tap mobile sharing** — uses the native Web Share API on mobile so the rendered PNG hands off directly to WhatsApp, X, Instagram Stories, LinkedIn, Telegram, etc.
- **Desktop share dropdown** — share the locked link to X (Twitter), LinkedIn, WhatsApp, or Telegram, plus a one‑click copy and a PNG download fallback.
- **cursor.com‑aligned theme** — flat near‑black canvas, white pill primary CTA, outlined dark secondary CTA, coral‑orange accent. Built with Tailwind 4 + shadcn/ui + Radix.

---

## Tech stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router) + React 19      |
| Styling      | Tailwind CSS v4, shadcn/ui, Radix UI    |
| Icons        | lucide‑react                            |
| Fonts        | Geist Sans + Geist Mono (`next/font`)   |
| Card render  | HTML `<canvas>` 2D                      |
| Analytics    | `@vercel/analytics` (production only)   |
| Package mgr  | pnpm (npm/yarn/bun also work)           |

---

## Run it locally

### 1. Prerequisites

- **Node.js** ≥ 20 (LTS recommended)
- **pnpm** ≥ 9 — install once with `npm i -g pnpm`

### 2. Clone and install

```bash
git clone <this-repo-url>
cd "aws photobooth"
pnpm install
```

### 3. Start the dev server

```bash
pnpm dev
```

Open http://localhost:3000 — the app reloads on file changes.

### 4. Production build (optional)

```bash
pnpm build
pnpm start
```

That serves the optimized build at http://localhost:3000.

### Other scripts

| Command       | What it does                          |
| ------------- | ------------------------------------- |
| `pnpm dev`    | Start the Next.js dev server          |
| `pnpm build`  | Build for production                  |
| `pnpm start`  | Run the production build              |
| `pnpm lint`   | Run ESLint across the project         |

> Using npm or yarn? Swap `pnpm` for `npm run` or `yarn` — every script is plain Next.js.

---

## How to use it

### As an admin (organizer / ambassador)

1. Open the app in **unlocked** mode (`/`).
2. Edit the **Title** (e.g. `/Nairobi Meetup`, `/Lagos Meetup`) and **Hashtags**.
3. Click **Copy Locked Link** to put the shareable URL on your clipboard, or use **Share Locked Link** to push it straight to X / LinkedIn / WhatsApp / Telegram.
4. Send that link to your attendees in WhatsApp, Telegram, email, or your community chat.

### As an attendee

1. Open the locked link your ambassador sent you. Title and hashtags are already set; you can’t change them by accident.
2. Tap **Upload Photo** and pick a selfie or group shot from your camera roll.
3. Tap **Share Card** — your phone’s native share sheet pops up and you can post the rendered PNG directly to your social app of choice. (No native share? Tap **Download Card** instead and post the file manually.)

---

## URL parameters

The locked link is plain query‑string state — handy for testing or scripting:

| Param   | Example                            | Effect                                        |
| ------- | ---------------------------------- | --------------------------------------------- |
| `locked` | `?locked=1`                       | Hides the admin editor; only photo upload remains |
| `title`  | `?title=%2FLagos%20Meetup`        | Overrides the card title                      |
| `tags`   | `?tags=%23CursorLagos,%23DevCommunity` | Comma‑separated hashtags (with or without `#`) |

Example end‑to‑end link:

```
https://your-domain.com/?locked=1&title=%2FLagos%20Meetup&tags=%23CursorLagos,%23BuildInPublic
```

---

## Project structure

```
app/
  layout.tsx          Root layout, fonts, dark mode, analytics
  page.tsx            Single‑page editor + share UI (admin & locked views)
  globals.css         Tailwind v4 tokens (cursor.com‑aligned palette)
components/
  card-preview.tsx    Canvas renderer — draws Figma template + photo + text
  card-editor.tsx     Photo upload control
  ui/                 shadcn/ui primitives (Button, Input, Dropdown, …)
public/
  cursor-nairobi-card-template.png   The locked Figma artwork (do not edit)
  cursor-community-avatar.svg        Favicon / OG image
hooks/                Reusable React hooks (toast, mobile detection)
lib/                  Small utilities (e.g. `cn` for Tailwind class merging)
```

---

## Customizing for your city

The fastest path: **don’t fork the code, just send a locked link** with your city’s title and hashtags (see [URL parameters](#url-parameters)).

If you do want a forked, branded variant for your community:

1. Replace `public/cursor-nairobi-card-template.png` with your city’s 1024×1024 card export from Figma. Keep the photo frame and title/hashtag mask coordinates — they’re defined as constants at the top of `components/card-preview.tsx`.
2. Update the defaults in `app/page.tsx`:
   - `DEFAULT_TITLE` — your city’s default title
   - `DEFAULT_HASHTAGS` — your community’s default hashtag set
3. Update site metadata in `app/layout.tsx` (`siteTitle`, `siteDescription`, OG image).

The theme tokens in `app/globals.css` mirror **cursor.com/home** — please don’t drift from them so cards stay on‑brand across cities.

---

## Deploying

The app is a stock Next.js project, so any Next.js‑friendly host works. The simplest path:

```bash
# from the project root
npx vercel              # one‑off preview deploy
npx vercel --prod       # production deploy
```

No environment variables are required for the core app. `@vercel/analytics` activates automatically when `NODE_ENV === 'production'`.

---

## Contributing

PRs are welcome — especially:

- New social‑network share intents
- Per‑city template presets
- Accessibility / mobile polish

Please keep theme changes in line with **cursor.com/home** and leave the locked Figma artwork untouched.

---

## License

This project is shared with the Cursor Community for use at Cursor meetups. Use it freely for community events; please don’t repurpose the Cursor brand assets outside of that context.
