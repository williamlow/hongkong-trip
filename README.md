# One More Bite — Hong Kong food notebook

A simple, mobile-friendly guide to 48 casual Hong Kong and Chinese food stops, based at Eaton HK in Jordan. Includes a Leaflet/OpenStreetMap map, branch-specific Google Maps links, estimated walks from the hotel, search and food/neighbourhood filters, saved places and a flexible seven-day plan.

Research was checked on **31 October 2026** against Eater, The Infatuation, the 2026 MICHELIN Guide, Sassy Hong Kong and OpenRice, with tourism-board neighbourhood background. Every restaurant has article or listing links. See [RESEARCH.md](RESEARCH.md) for methodology, source scope, corrections and limitations. Prices are planning estimates, not current menu quotes; maps and walks are approximate. This is desk research, not a claim of personal visits.

The top navigation also links to `racing.html`: an introduction to Hong Kong and Happy Valley racing, a visitor plan, terminology, basic bet types and a Willy-versus-Gilly mini race. The game makes a new independent 50/50 winner draw each time, animates two laps, supports replay and honours reduced-motion preferences.

The **Kowloon walk** tab (`walk.html`) digitises the ten-stop itinerary in the user's Lonely Planet photograph. It adds independently researched background, six optional heritage/neighbourhood detours, an interactive numbered route map, three mobile-friendly Google Maps walking sections, an optional ferry layer, a KML download and browser-local visited tracking. See [WALK_RESEARCH.md](WALK_RESEARCH.md) for sources, location checks and route limitations, checked 1 November 2026.

The **Neighbourhoods** tab (`neighbourhoods.html`) links to separate day guides for **Sham Shui Po, Sheung Wan, Sai Ying Pun and Wong Chuk Hang**. Each mixes local food, coffee, streets/heritage, art and drinks, with a flexible four-part day plan, numbered map, category filters, Eaton transit directions and a short Google Maps walking section. The 34 mapped places include restaurants reused from the food guide. Five further conversation leads are clearly separated from the researched pins. See [NEIGHBOURHOODS_RESEARCH.md](NEIGHBOURHOODS_RESEARCH.md).

The **Day trips** tab (`day-trips.html`) compares seven village, island and nature outings, with food, modest walking plans, heat compromises, departure hubs, return checks and fallbacks. A prominently qualified Lai Chi Wo note distinguishes the Tourism Board's published Shatin Area 77 weekday route from Ma Liu Shui weekend access. No current sailing is presented as confirmed.

The **Hikes** tab (`hikes.html`) compares five shorter, wooded or mostly downhill plans. It separates published trail lengths from estimated shortened outings and access walking, describes shade gaps and climbing, identifies exits and excluded extensions, and maps approximate starts/selected finishes. It does not supply surveyed tracks or live heat/closure ratings. See [OUTDOORS_RESEARCH.md](OUTDOORS_RESEARCH.md) for the evaluation and source limitations, checked 3 November 2026.

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

Before copying, `npm run build` runs `npm run generate` to regenerate the neighbourhood hub and four HTML guides at the repository root. These generated HTML files are committed because GitHub Pages serves the root directly. Edit `neighbourhood-data.js` and `scripts/neighbourhood-pages.mjs`, then regenerate; `neighbourhoods.js` and `neighbourhoods.css` provide map/filter behaviour and presentation. The generated guide text and external navigation links remain readable without JavaScript.

The same generate command also runs `scripts/outdoor-pages.mjs` for the two outdoor guides. Edit `outdoors-data.js`, the generator, `outdoors.js` and `outdoors.css` for these pages. Commit regenerated `day-trips.html` and `hikes.html` alongside changes; the root publishes directly. Native details cards and external links remain usable without JavaScript.

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

Neighbourhood tests check that every guide covers food, coffee and drinks alongside exploring; route waypoint limits, category/card/map synchronisation, popup focus, restaurant-card deep links, transit origins, static content without JavaScript, blocked tiles and navigation at 320px, 768px and 1024px. The header exposes all six tabs on phones and tablets.

Outdoor checks cover the weekday/boat/shorter-stroll distinctions, wooded/downhill/shorter walk filters, map/card synchronisation, selected finish pins, comparison links restoring filtered cards and keyboard focus, high-start taxi directions, source/access integrity, explicitly unconfirmed ferry/weather information, static content without JS, blocked tiles and phone/tablet layouts. Software tests do not establish that a trail or ferry is operating today.
