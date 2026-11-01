# One More Bite — Hong Kong food notebook

A simple, mobile-friendly guide to 48 casual Hong Kong and Chinese food stops, based at Eaton HK in Jordan. Includes a Leaflet/OpenStreetMap map, branch-specific Google Maps links, estimated walks from the hotel, search and food/neighbourhood filters, saved places and a flexible seven-day plan.

Research was checked on **31 October 2026** against Eater, The Infatuation, the 2026 MICHELIN Guide, Sassy Hong Kong and OpenRice, with tourism-board neighbourhood background. Every restaurant has article or listing links. See [RESEARCH.md](RESEARCH.md) for methodology, source scope, corrections and limitations. Prices are planning estimates, not current menu quotes; maps and walks are approximate. This is desk research, not a claim of personal visits.

The top navigation also links to `racing.html`: an introduction to Hong Kong and Happy Valley racing, a visitor plan, terminology, basic bet types and a Willy-versus-Gilly mini race. The game makes a new independent 50/50 winner draw each time, animates two laps, supports replay and honours reduced-motion preferences.

The **Kowloon walk** tab (`walk.html`) digitises the ten-stop itinerary in the user's Lonely Planet photograph. It adds independently researched background, six optional heritage/neighbourhood detours, an interactive numbered route map, three mobile-friendly Google Maps walking sections, an optional ferry layer, a KML download and browser-local visited tracking. See [WALK_RESEARCH.md](WALK_RESEARCH.md) for sources, location checks and route limitations, checked 1 November 2026.

The expansion added 14 food stops, tagged **NEW** and accessible through the new-places filter. Recent Reddit threads were requested but the running environment still blocks Reddit. The racing guide uses Sassy’s August 2026 visitor article and links to HKJC; exact fixture dates remain unconfirmed until official access is applied. See [RACING_RESEARCH.md](RACING_RESEARCH.md). No unverified dates are presented as confirmed meetings.

## Website and publishing

The GitHub Pages project site is **https://williamlow.github.io/hongkong-trip/**.

The repository is configured to publish **`main` → `/`**, and the site works directly as static files in that location. `.nojekyll` disables Jekyll processing. No framework build, API key, server, CDN script or font service is required for visitors; Leaflet is vendored with its license. Map tiles come from OpenStreetMap and retain attribution. Google Maps and editorial sources are external links.

GitHub's built-in `pages-build-deployment` workflow publishes pushes to `main`. The separate `.github/workflows/pages.yml` checks installation, the static build and browser tests. It does not try to change Pages settings. Confirm the Pages deployment and the public site after publishing; pushing source alone does not prove a successful deployment.

## Develop

Use the existing checkout; each cloud task is already isolated, so no extra worktree is needed. Node.js 24 and npm are the development prerequisites.

```sh
npm ci
npm run dev
```

The development command serves the repository's static site. To prepare and serve a standalone output folder:

```sh
npm run build
npm run preview
```

The build copies the public site files and vendored Leaflet into `dist/`. All resource URLs are relative, so the same files work under `/hongkong-trip/`.

## Validate

```sh
# On a machine without system Chromium:
npx playwright install --with-deps chromium
npm run build
npm test
```

The test configuration uses `/usr/bin/chromium` when present and Playwright's browser otherwise. Tests cover data/citation integrity, Chinese-name and dish search, combined filters, hotel walks, saved-place persistence and unavailable storage, exact-branch Google Maps queries, card/map selection, week-plan links, blocked map tiles, mobile overflow and hosting under a project subdirectory. Walking-guide checks cover the photographed stop order, route continuity, mobile directions, layer controls, visited tracking, popup navigation and valid downloadable KML. Racing checks cover the random draw and replay. Software checks do not establish that a restaurant is open today.

## Update the guide

- Edit `data.js` for restaurants, citations, hotel details and day plans. Preserve stable restaurant IDs so saved favourites continue to work.
- Add direct coverage links for recommendations; distinguish editorial evidence from address/operating-status directory checks. Record publication/access dates and flag older sources.
- Check the exact branch and coordinates before changing an address. Kai Kai, Wang Fu and Keung Kee illustrate why older articles need cross-checks.
- Keep prices labelled as estimates unless quoting a checked current menu. Avoid listing fixed opening hours without a reliable current source.
- Edit `app.js`, `index.html` and `styles.css` for the food interface. `racing.html`, `racing.css` and `racing.js` contain the racing guide; `race-engine.js` holds the random draw and animation progress logic. `racing-data.js` only accepts independently verified official fixtures, with an explicit check date. `vendor/leaflet/` comes from the pinned Leaflet 1.9.4 npm package and includes its license.
- Rebuild and run tests before pushing. GitHub Pages publishes the root files, while `dist/` is an ignored verification/export output.

For the walk, edit `walk-data.js` for sourced places and approximate route geometry, `walk-utils.js` for distance/directions/KML, and `walk.html`, `walk.css` and `walk.js` for the interface. Preserve numbers 1–10 and use letters for additions. Check exact branches and addresses before moving pins; keep route estimates distinct from live walking directions.

Saved places use only browser local storage. There is no account system, analytics or tracking. Map-tile failures show an explicit message; cards, numbered pins and Google Maps links remain usable.
