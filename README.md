# One More Bite — Hong Kong food notebook

A mobile-friendly static restaurant guide for a week in Hong Kong, based at Eaton HK in Jordan. It focuses on casual Hong Kong and Chinese food, with an interactive Leaflet/OpenStreetMap map, branch-specific Google Maps links, a near-hotel filter, search, food and neighbourhood filters, saved places and a flexible seven-day plan.

## Content status: research blocked

**This is a provisional draft, not a researched restaurant recommendation list.** The 30 candidate entries were assembled from general knowledge. Live access to Time Out, Eater, The Infatuation, MICHELIN, Hong Kong Tourism Board, OpenRice and Sassy Hong Kong was blocked by the cloud environment's network policy. The site prominently discloses this, and its reading list is explicitly not presented as supporting citations.

Addresses, branch operating status, coordinates, price estimates, current menus and publication coverage still need verification. No current awards, opening hours or checked restaurant recommendations are asserted. Approximate map pins and estimated walks are not routed directions.

The required source, map and GitHub API domains have been saved to the cloud environment configuration draft. They must be saved/applied through environment settings before research and Pages administration can continue. Environment publication is separate from deploying the website to GitHub Pages.

## Develop

Requires Node.js 24 and npm. No app secrets or backend are required.

```sh
npm ci
npm run dev
```

Use the existing checkout; each cloud task is already isolated. No additional worktree is needed.

```sh
npm run build
npm run preview
```

The build writes `dist/`, uses relative asset paths and works under a GitHub Pages repository path such as `/hongkong-trip/`.

## Validate

```sh
# On a machine without system Chromium:
npx playwright install --with-deps chromium
npm run build
npm test
```

The test configuration uses `/usr/bin/chromium` when present and Playwright's browser otherwise. Existing tests cover filtering, search including Chinese names, saved-place persistence and unavailable storage, exact-branch map links, map/card selection, the week plan, tile failure and mobile overflow. These validate software behaviour, not restaurant facts.

Map tiles are requested from `tile.openstreetmap.org`. The map gives an explicit fallback message if tiles cannot load; numbered pins, cards and Google Maps links remain usable. Leaflet itself is bundled, and no font or image CDN is required.

## GitHub Pages

`.github/workflows/pages.yml` installs dependencies, builds, runs browser tests and deploys `dist/` on pushes to `main`.

The repository's **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. If it is not enabled, an authorised administrator can enable it with:

```sh
gh api --method POST repos/williamlow/hongkong-trip/pages -f build_type=workflow
```

For an existing Pages site, use the supported update endpoint instead of creating a duplicate. A successful workflow deployment, not merely pushing source, establishes that the site is live. The expected project-site URL is `https://williamlow.github.io/hongkong-trip/`; it must be verified after deployment.

## Finish the research

1. Read broad cheap-eats, local-food and neighbourhood coverage in the named publications; add other authoritative local sources as useful.
2. Match each entry to the exact branch and check recent evidence that it operates. Remove closed, relocated, duplicate or poorly matched candidates.
3. Keep editorial recommendation evidence separate from factual address/menu checks. Record article URL, title, publisher, access date and the specific supported facts.
4. Update `data.js`, add article-level source links to the cards, and replace the pending-research language only after the research has actually been done.
5. Recheck map coordinates, nearby classification and any walk estimates. Keep price estimates labelled unless supported by current menus.
6. Rebuild, run browser tests, push and verify the deployed Pages URL.

`data.js` contains hotel, candidate, reading-list and day-plan data. `app.js` handles rendering and map/filter interactions. `styles.css` is the responsive design. Favourites are stored only in the visitor's browser; there is no analytics or tracking.
