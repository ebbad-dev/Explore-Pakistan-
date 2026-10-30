# Explore Pakistan

A responsive travel discovery and trip-planning website for Pakistan, built with
React, Vite, Bootstrap 5 and custom CSS. Frontend-only: data lives in the source,
and personal data (trips, favourites, profile) is saved in the browser.

## Run it

```bash
npm install
npm run dev        # development server, usually http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Requires Node.js 18 or newer.

## Source layout

| File | Purpose |
| --- | --- |
| `index.html` | HTML shell, fonts, metadata, `#root` |
| `src/main.jsx` | Main React application code, components, and views |
| `src/style.css` | Custom styling and design tokens |
| `package.json` | Dependencies and scripts |
| `vite.config.js` | Vite configuration with React plugin and relative base path |

## Google Maps setup

The map works without a key — it shows a destination list with "Open in Google Maps"
links. To enable the interactive map:

1. In Google Cloud Console, create a project and **enable billing** (Maps requires it).
2. Enable the **Maps JavaScript API**.
3. Create an **API key**, then restrict it:
   - Application restriction: **HTTP referrers** — add `http://localhost:5173/*` and your deployed domain, e.g. `https://your-site.netlify.app/*`.
   - API restriction: **Maps JavaScript API** only.
4. Set a **budget alert** and quota limits under Billing and APIs & Services.
5. Copy `.env.example` to `.env.local` and paste the key:
   `VITE_GOOGLE_MAPS_API_KEY=your-key`. The Contact page defaults to `ebbadurrehman538@gmail.com` and WhatsApp `0313 7813498`; optionally set `VITE_CONTACT_EMAIL=your-inbox@example.com` to override the email recipient.
6. Restart `npm run dev`. Never commit `.env.local`.

A browser key is visible to anyone using the site; the referrer and API restrictions are what protect it.

## Deploying

This is a single-page app using clean URLs, so the host must send every path to
`index.html`. On Netlify, add a file `public/_redirects` containing
`/*  /index.html  200` before building (or set the same rule in the Netlify UI).
Add `VITE_GOOGLE_MAPS_API_KEY` as an environment variable in the host's settings.

## Before publishing — things to check

- **Package prices** were re-checked on 2026-10-27 against the linked operator detail pages. Travelon Today's current pages publish group-departure starting rates per person, and every package links to its matching destination page. Rates can change with fuel prices; confirm the final quote with the operator. Pakistan Tour N Travel's PKR 20,000 Lahore rate applies to its published 6–10-person tier, while Paramount's PKR 22,000 Swat rate is for a 5–6-person group departing Islamabad (Lahore adds PKR 3,000/person). The source link and caveats are retained per package in `TOUR_PACKAGES`.
- **Destination photos**: Every destination includes 5–7 authentic, reviewed WebP photographs (max 1600px width with 640px thumbnails) directly declared in `DESTINATIONS` in `src/main.jsx`. Nothing is fetched from external APIs at runtime.
- **Hero video**: a Pexels mountain-road clip (Pexels licence: free use, no attribution required; source kept in `HERO_MEDIA.videoSource`). It loads only on screens 768px and wider, without data-saver or reduced motion; phones get the local poster. The clip is a 4K remote file — host a smaller local encode for production.
- **Membership prices and savings** are Explore Pakistan's own proposed programme terms, not benefits guaranteed by the third-party operators.

### Tour-rate verification log (checked 27 October 2026)

| Tour listing | Advertised starting price | Source |
| --- | ---: | --- |
| Hunza Valley, 5–7 days | PKR 28,500/person | [Travelon Today](https://travelontoday.com/hunza-valley-tour-packages/) |
| Skardu, 6–8 days | PKR 32,500/person | [Travelon Today](https://travelontoday.com/skardu-tour-packages/) |
| Hunza + Skardu, 8–10 days | PKR 46,500/person | [Travelon Today](https://travelontoday.com/hunza-skardu-tour-packages/) |
| Fairy Meadows, 5–7 days | PKR 27,500/person | [Travelon Today](https://travelontoday.com/fairy-meadows-tour-packages/) |
| Naran Kaghan, 3–5 days | PKR 17,500/person | [Travelon Today](https://travelontoday.com/naran-kaghan-tour-packages/) |
| Swat Kalam, 3–5 days | PKR 17,500/person | [Travelon Today](https://travelontoday.com/swat-kalam-tour-packages/) |
| Neelum Valley, 3–5 days | PKR 18,500/person | [Travelon Today](https://travelontoday.com/neelum-valley-tour-packages/) |
| Kumrat Valley, 3–5 days | PKR 19,500/person | [Travelon Today](https://travelontoday.com/kumrat-valley-tour-packages/) |
| Murree & Galiyat, 2–4 days | PKR 12,500/person | [Travelon Today](https://travelontoday.com/murree-tour-packages/) |
| Lahore guided city tour, 1 day | PKR 20,000/person for 6–10 people | [Pakistan Tour N Travel](https://pakistantourntravel.com/lahore-city-tour-packages/) |
| Swat Valley, 5 days, economy group of 5–6 | PKR 22,000/person from Islamabad; Lahore adds PKR 3,000/person | [Paramount Adventure Club](https://www.paramount.pk/pc_tour/swat-valley-5d/) |

These are published starting or stated-option prices observed on the linked pages, not booking confirmations. Tour operators may change prices, availability, pickup conditions, inclusions and exclusions. Recheck the source before presenting a final quote or accepting payment.

## Architecture & Implementation Overview

- **Routing:** `react-router-dom` maps 20 URLs to view components (section 14). Explore
  filters are stored in the URL query string, so filtered views can be shared.
- **Data:** canonical arrays at the top of `main.jsx` — `DESTINATIONS`, `TOUR_PACKAGES`,
  `STORIES`, `MEMBERSHIP_PLANS`, `QUIZ_QUESTIONS`, `PACKING_RULES`, `FAQ_ITEMS`. Every
  feature reads them by ID, so a fact is never duplicated.
- **State:** `AppProvider` (section 6) holds shared state — favourites, trips, comparison,
  profile — exposed via React Context. Page-only state (form fields, quiz answers) uses
  local `useState`. Results, rankings and totals are *derived* with `useMemo`, not stored.
- **Persistence:** `usePersistentState` syncs a slice of state to `localStorage` under
  versioned keys (`explorePakistan:v1:...`). Every read is wrapped in try/catch and
  validated, so corrupted storage falls back to defaults instead of crashing.
  Passwords and card details are never stored.
- **Domain logic** (section 4) is plain functions, separate from components:
  `filterDestinations`, `rankDestinations` (quiz scoring with explainable reasons),
  `calculateBudget`, `memberPrice`, and `generateConciergeResponse` — the concierge's
  smart trip-planning engine that processes travel parameters (budget, duration, companions) and generates structured itineraries.
- **Pricing integrity:** a price only renders through `PriceTag`, which always shows
  "From" and the price basis; destinations without a sourced package show "Self-planned".
  Member price = base − base × rate, only for packages with explicit eligibility.
- **Maps:** `loadGoogleMaps` injects the script once, with a 12-second timeout and Google's
  `gm_authFailure` hook. `MapPanel` creates markers in a `useEffect` and removes them in
  the cleanup function. Any failure shows `MapFallback` — a real list, never a fake map.
- **Accessibility:** one dialog component handles focus trapping, Escape, scroll lock and
  returning focus; forms use labelled fields with inline errors; cards use a stretched
  link so action buttons don't trigger navigation; motion respects `prefers-reduced-motion`.
- **Trade-off:** one source file keeps the project explainable for assessment; a
  production team would split it into modules and lazy-load routes.

## Release-pass changes (27 October 2026)

- Curated, local WebP photo library (max 1600px width with 640px thumbnails) directly inlined in `DESTINATIONS` in `src/main.jsx`.
- Simplified responsive `Image` component with sensible srcset/sizes, lazy loading, and loading skeleton.
- Lightbox features a quiet credit line for Creative Commons photography (`Photo: <author> · <license>`).
- Account page: split-screen travel-journal panel with animated mode changes.
- Concierge launcher: compact round button with tooltip; steps aside while the footer is visible; hidden on `/account`.
- Motion: shared timing tokens, route fade-in, section reveals, featured-card stagger, mild hero parallax — all reduced to opacity or none with reduced motion.
- "Listen" narration on destination pages using the device's voice: opt-in, transcript shown, stops on Stop or leaving the page, clear message if the device has no voice.
- Stories pick a subject-matched photo that isn't a destination's cover image.

### Not production authentication

Profiles live in the browser only; passwords are validated but never stored or verified, and
password reset sends nothing. Before a real launch, add a backend with server-side registration,
password hashing, sessions, emailed reset links and authorisation checks.
