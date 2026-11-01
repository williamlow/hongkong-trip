import { writeFile } from "node:fs/promises";
import { neighbourhoods, kinds, hotel } from "../neighbourhood-data.js";
import { mapsLink, directionsLink } from "../walk-utils.js";
const root = new URL("../", import.meta.url);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const link = (url, label, cls = "") =>
  `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
const transit = (n) =>
  "https://www.google.com/maps/dir/?" +
  new URLSearchParams({
    api: "1",
    origin: `${hotel.name}, ${hotel.address}`,
    destination: `${n.station}, Hong Kong`,
    travelmode: "transit",
  });
function shell(title, description, body, id = "hub") {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f4ec"><meta name="description" content="${esc(description)}"><title>${esc(title)} · One More Bite</title><link rel="stylesheet" href="./vendor/leaflet/leaflet.css"><link rel="stylesheet" href="./styles.css"><link rel="stylesheet" href="./neighbourhoods.css"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='20' fill='%23273b32'/%3E%3Ctext x='40' y='55' text-anchor='middle' font-size='44' fill='%23fff' font-family='serif'%3E街%3C/text%3E%3C/svg%3E"></head><body data-neighbourhood="${id}"><a class="skip-link" href="#neighbourhood-main">Skip to neighbourhood guide</a><header class="site-header"><a class="brand" href="./index.html"><span class="brand-stamp" lang="zh-Hant">食</span><span>ONE MORE BITE<span class="brand-sub">HONG KONG FIELD NOTES</span></span></a><nav aria-label="Main navigation"><a href="./index.html#explore">Food guide</a><a href="./racing.html">Happy Valley</a><a href="./walk.html">Kowloon walk</a><a href="./neighbourhoods.html" aria-current="page">Neighbourhoods</a></nav>${link(mapsLink(hotel), '<span class="status-dot"></span> BASE: EATON HK', "hotel-link")}</header><main id="neighbourhood-main">${body}</main><footer><a class="footer-brand" href="./index.html">ONE MORE BITE <span lang="zh-Hant">食好啲</span></a><p>A good day, a few streets at a time.</p><a href="#neighbourhood-main">Back to the top ↑</a></footer><script src="./vendor/leaflet/leaflet.js"></script><script type="module" src="./neighbourhoods.js"></script></body></html>`;
}
function areaNav(current = "hub") {
  return `<nav class="area-nav" aria-label="Neighbourhood guides"><a href="./neighbourhoods.html" ${current === "hub" ? 'aria-current="page"' : ""}>Choose a day</a>${neighbourhoods.map((n) => `<a href="./${n.id}.html" ${current === n.id ? 'aria-current="page"' : ""}>${esc(n.name)}</a>`).join("")}</nav>`;
}
function mapPanel(hub = false) {
  return `<aside class="area-map-panel" aria-label="${hub ? "Four neighbourhoods and Eaton" : "Neighbourhood places"} map"><div class="map-heading"><span class="eyebrow">${hub ? "FIND YOUR NEXT NEIGHBOURHOOD" : "A FEW STREETS, MAPPED"}</span><button id="fit-area-map">Show all ↗</button></div><div id="area-map" aria-label="Interactive map of ${hub ? "four neighbourhoods and Eaton HK" : "the guide’s numbered places"}"></div><p class="map-error" id="area-map-error" hidden>Map tiles are unavailable. Numbered pins and Google Maps links still work.</p><div class="area-map-legend"><span><i></i> ${hub ? "Neighbourhoods 01–04" : "Numbers match the place cards"}</span>${hub ? "<span>H · Eaton HK</span>" : ""}</div><p class="area-map-note">Pins are approximate. Zoom in to separate nearby places; use the address links for the door. ${hub ? "Select a pin to open its guide." : "Food, coffee and drinks appear alongside the sights. The map does not draw a walking route."}</p></aside>`;
}
function card(p, n) {
  return `<article class="area-place" id="place-${p.id}" data-place="${p.id}" data-kind="${p.kind}"><div class="area-place-heading"><span class="area-number">${p.number}</span><div><span class="place-kind">${esc(p.also?.includes("drinks") ? "Coffee & drinks" : kinds[p.kind])}</span><h3>${esc(p.name)}</h3>${p.chinese ? `<span lang="zh-Hant" class="place-chinese">${esc(p.chinese)}</span>` : ""}</div></div>${p.badge || p.older ? `<span class="place-badge">${esc(p.badge || "Older coverage · recheck current listing")}</span>` : ""}<p>${esc(p.description)}</p>${p.order ? `<div class="area-order"><span>ORDER SOMETHING LOCAL</span><p>${esc(p.order)}</p><small>${esc(p.budget)}</small></div>` : ""}<p class="area-tip">${esc(p.tip)}</p><p class="area-address">${esc(p.address)}</p><div class="place-sources">${p.sources.map((s) => link(s.url, esc(s.publisher) + (s.edition ? ` · ${esc(s.edition)}` : ""))).join("")}</div><div class="area-place-actions"><button data-locate="${p.id}">Find on map ↗</button>${link(mapsLink(p), "Google Maps")}${p.foodId ? `<a href="./index.html#place-${p.foodId}">Food-guide card ↗</a>` : ""}${p.operator ? link(p.operator, "Venue website") : ""}</div></article>`;
}
function areaPage(n) {
  const route = n.route.map((id) => n.places.find((p) => p.id === id));
  const filters = [
    "all",
    ...Object.keys(kinds).filter(
      (k) =>
        k !== "all" &&
        n.places.some((p) => p.kind === k || p.also?.includes(k)),
    ),
  ];
  return shell(
    n.name,
    n.intro,
    `${areaNav(n.id)}<section class="area-hero" style="--area-accent:${n.accent}"><div><p class="eyebrow">NEIGHBOURHOOD ${n.number} / <span lang="zh-Hant">${n.chinese}</span></p><h1>${esc(n.name)}<br><em>${esc(n.short)}</em></h1><p class="area-intro">${esc(n.intro)}</p><a class="explore-link" href="#day-plan">Make a day of it <span aria-hidden="true">↓</span></a></div><aside class="area-facts"><span class="area-facts-number">${n.number}</span><p class="eyebrow">${esc(n.vibe)}</p><dl><div><dt>Best shape for the day</dt><dd>${esc(n.time)}</dd></div><div><dt>Allow</dt><dd>${esc(n.duration)}</dd></div><div><dt>Start with</dt><dd>${esc(n.station)}</dd></div><div><dt>On the shortlist</dt><dd>${n.places.length} places · food, coffee & exploring</dd></div></dl>${link(transit(n), "Get here from Eaton")}</aside></section><section class="area-context"><p>${esc(n.context)}</p><p>${esc(n.pairing)}</p></section><section class="area-section" id="day-plan"><div class="section-heading"><div><p class="eyebrow">LEAVE TIME BETWEEN THE STOPS</p><h2>A day that has room for lunch.</h2></div><p>A flexible order, with alternatives.<br>Choose what appeals when you get there.</p></div><ol class="area-timeline">${n.day.map(([time, title, text], i) => `<li><span class="timeline-index">0${i + 1}</span><span class="eyebrow">${esc(time)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`).join("")}</ol></section><section class="area-section" id="places"><div class="section-heading"><div><p class="eyebrow">EAT, DRINK, LOOK AROUND</p><h2>The places to build it around.</h2></div><p>Numbers match the map.<br>Filter to find the next thing you fancy.</p></div><div class="area-filter-bar" role="group" aria-label="Filter neighbourhood places">${filters.map((k) => `<button data-filter="${k}" aria-pressed="${k === "all"}">${esc(kinds[k])}</button>`).join("")}</div><p id="area-result-count" role="status" aria-live="polite">${n.places.length} places on the map</p><div class="area-layout"><div id="area-place-list">${n.places.map((p) => card(p, n)).join("")}</div>${mapPanel()}</div><div class="area-route-link"><div><p class="eyebrow">A STARTING POINT FOR YOUR WALK</p><h3>${route.map((p) => esc(p.name)).join(" → ")}</h3><p>This short sequence is a starting point, not the whole day. Add the other meals, coffee stops or sights individually as you go; Google Maps calculates current crossings.</p></div>${link(directionsLink(route), "Open this walking section", "area-button")}</div></section><section class="area-section area-practical" aria-labelledby="practical-title"><div><p class="eyebrow">BEFORE YOU SET OFF</p><h2 id="practical-title">A little planning, then wander.</h2></div><div><h3>From Eaton HK</h3><p>${esc(n.transport)}</p>${link(transit(n), "Current transit directions")}<h3>On foot</h3><p>${esc(n.terrain)}</p><h3>Opening, access and spending</h3><p>${esc(n.practical)}</p><p>Food budgets come from the existing food guide and are estimates. For cocktails, check current menus, minimum spends, service charges and any set-menu format. Picking one good drinks stop keeps the day flexible.</p></div></section>${n.leads.length ? `<section class="area-section area-leads"><p class="eyebrow">FURTHER LEADS FROM YOUR CONVERSATION</p><h2>Keep these in reserve.</h2><p>These suggestions need a current address and access check before becoming firm plans. They are separate from the researched map pins.</p><div>${n.leads.map((l) => `<article><h3>${esc(l.name)}</h3><p>${esc(l.note)}</p>${link("https://www.google.com/maps/search/?" + new URLSearchParams({ api: "1", query: l.query }), "Check current venue listing")}</article>`).join("")}</div></section>` : ""}<section class="area-section area-sources"><p class="eyebrow">THE NOTES BEHIND THE DAY</p><h2>Sources and visiting notes.</h2><p>Inspired by your conversation and independently checked against the sources below. Sources were read 1 November 2026; the older 2022–24 guides are labelled on the relevant cards. Current opening, exhibition programmes and menus need a final venue check.</p><details><summary>Read the sources for ${esc(n.name)}</summary><ul>${n.sources.map((s) => `<li>${link(s.url, esc(s.publisher) + " — " + esc(s.title))}${s.edition ? `<span>${esc(s.edition)}</span>` : ""}<small>Read ${s.accessed === "2026-10-31" ? "31 October" : "1 November"} 2026</small></li>`).join("")}</ul></details><p class="source-footnote">Map: Leaflet / OpenStreetMap · Approximate place pins · Transit and walking directions open in Google Maps · Current exhibitions are not assumed · No affiliation or paid placements.</p></section><section class="area-section area-next"><p class="eyebrow">ANOTHER DAY, ANOTHER NEIGHBOURHOOD</p><div>${neighbourhoods
      .filter((o) => o.id !== n.id)
      .map(
        (o) =>
          `<a href="./${o.id}.html"><span>${o.number} / ${esc(o.vibe)}</span><strong>${esc(o.name)}</strong><em>${esc(o.short)} ↗</em></a>`,
      )
      .join("")}</div></section>`,
    n.id,
  );
}
const hubBody = `${areaNav()}<section class="neighbourhood-hero"><div><p class="eyebrow">TAKE THE SIDE STREETS / 街坊慢遊</p><h1>A different<br><em>kind of Hong Kong.</em></h1><p>Market streets and small galleries. A bowl of noodles, a coffee,<br>then somewhere with a little character for a drink.</p><a class="explore-link" href="#choose-day">Choose your next day <span aria-hidden="true">↓</span></a></div><aside class="field-note"><span class="eyebrow">YOUR BRIEF, IN FOUR DAYS OUT</span><p>More independent spaces.<br>More everyday street life.<br>A good lunch along the way.</p><small>Each guide mixes food, coffee, exploring and drinks. The comparisons in your conversation are a starting point; every neighbourhood has more than one side.</small><span class="field-note-mark" lang="zh-Hant">街</span></aside></section><section class="area-section" id="choose-day"><div class="section-heading"><div><p class="eyebrow">FOUR PLACES TO START</p><h2>Four ways to spend a good day.</h2></div><p>One neighbourhood is enough.<br>Stay longer when you find something you like.</p></div><div class="area-guide-grid">${neighbourhoods.map((n) => `<a href="./${n.id}.html" class="area-guide-card" style="--area-accent:${n.accent}"><div class="area-guide-card-top"><span>${n.number} / ${esc(n.vibe)}</span><span lang="zh-Hant">${n.chinese}</span></div><h3>${esc(n.name)}</h3><p>${esc(n.short)}</p><div class="area-guide-card-details"><span>${n.places.length} mapped places</span><span>Lunch · coffee · exploring · drinks</span></div><span class="area-card-open">Open the day guide ↗</span></a>`).join("")}</div></section><section class="area-section hub-map-section"><div><p class="eyebrow">STARTING FROM EATON HK</p><h2>Across the harbour,<br>or a few MTR stops north.</h2><p>Sham Shui Po is on Kowloon’s Tsuen Wan line. The other three are on Hong Kong Island, with Wong Chuk Hang reached on the South Island line. Each guide includes current Google Maps transit links from the hotel.</p><p>You can combine Wong Chuk Hang with drinks farther west, but every guide also has its own food and coffee stops. There is no need to cross the city to make the day feel complete.</p><div class="hub-picks"><h3>If you want an easy first choice</h3><p>Try Sham Shui Po for a low-key day of markets, coffee, noodles and an optional drink. Choose Sai Ying Pun if you want dinner and a cocktail to carry the day into the evening.</p></div></div>${mapPanel(true)}</section><section class="area-section hub-planning"><div><p class="eyebrow">KEEP IT PLEASANTLY LOOSE</p><h2>A few things worth knowing.</h2></div><div><h3>Give galleries a quick check first</h3><p>Industrial-building galleries can be between shows or need appointments. The earlier conversation’s exhibition title and closing date have not been verified. Use the current venue links before a special trip.</p><h3>Eat locally, choose your drinks deliberately</h3><p>These guides use the existing local-food shortlist, plus the cooked-food market in Wong Chuk Hang. Coffee and cocktail stops add variety; check menus and minimum spends before sitting down.</p><h3>Leave space between the stops</h3><p>The plans include alternatives. One meal, one coffee, a few interesting streets or a gallery, then a drink can be a very good afternoon and evening.</p></div></section>`;
async function writePage(name, html) {
  const content = html
    .replaceAll("><", ">\n<")
    .replace(
      "<!doctype html>",
      "<!doctype html>\n<!-- Generated by npm run generate. Edit neighbourhood-data.js or scripts/neighbourhood-pages.mjs. -->",
    );
  await writeFile(new URL(name, root), content + "\n");
}
await writePage(
  "neighbourhoods.html",
  shell(
    "Neighbourhoods",
    "Four Hong Kong neighbourhood day guides with local food, coffee, galleries, street life, drinks and maps, starting from Eaton HK.",
    hubBody,
  ),
);
for (const n of neighbourhoods) await writePage(`${n.id}.html`, areaPage(n));
console.log("Generated neighbourhood hub and four day guides.");
