import {
  walkStops,
  walkExtras,
  walkLegs,
  walkSections,
  walkHotel,
  ferryEndpoint,
  walkSourceCards,
} from "./walk-data.js";
import {
  distanceKm,
  mergedRoute,
  mapsLink,
  directionsLink,
  mapKml,
} from "./walk-utils.js";
const L = window.L;
const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const allStops = [...walkStops, ...walkExtras];
const byId = new Map(allStops.map((stop) => [stop.id, stop]));
const storageKey = "one-more-bite-kowloon-walk";
let visited;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  visited = new Set(
    Array.isArray(stored) ? stored.filter((id) => byId.has(id)) : [],
  );
} catch {
  visited = new Set();
}
const state = { extras: true, ferry: false, selected: null };
let toastTimer;
function toast(message) {
  $("#walk-toast").textContent = message;
  $("#walk-toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => $("#walk-toast").classList.remove("visible"),
    3000,
  );
}
const route = mergedRoute(walkLegs);
const km = distanceKm(route);
$("#walk-distance").textContent = `~${km.toFixed(1)} km · walking line only`;
$("#moving-time").textContent =
  "Allow around 1½–2 hours of moving time at a leisurely city pace, then add visits, food, crossings and waiting. Detours and the ferry are extra.";
$("#walk-hotel-link").href = mapsLink(walkHotel);
$("#start-from-eaton").href = directionsLink([walkHotel, walkStops[0]]);

function stopCard(stop, extra = false) {
  const nextLeg = walkLegs.find((leg) => leg.fromId === stop.id);
  return `<details class="walk-stop ${extra ? "extra-stop" : ""}" id="walk-stop-${stop.id}" data-stop="${stop.id}" ${!extra && stop.number === 1 ? "open" : ""}><summary><span class="walk-stop-number">${extra ? stop.label : stop.number}</span><span class="walk-stop-summary"><strong>${escape(stop.name)}</strong><span lang="zh-Hant">${escape(stop.chinese)}</span><small>${escape(stop.tag)}${extra ? ` · near book stop ${stop.near}` : ""}</small></span><span class="walk-chevron" aria-hidden="true">+</span></summary><div class="walk-stop-body"><p class="walk-stop-address">${escape(stop.address)} <span>· allow ${escape(stop.allow)}</span></p>${stop.background
    .split("\n\n")
    .map((p) => `<p>${escape(p)}</p>`)
    .join(
      "",
    )}<div class="walk-look-for"><span>LOOK FOR</span><ul>${stop.lookFor.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></div><p class="walk-practical">${escape(stop.practical)}</p>${nextLeg ? `<p class="walk-next-leg"><strong>Next walking leg:</strong> ${escape(nextLeg.via)}</p>` : ""}<div class="walk-stop-sources"><span>BACKGROUND & PLACE CHECK</span>${stop.sources.map((source) => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(source.publisher)}: ${escape(source.name)} — source for ${escape(stop.name)}">${escape(source.publisher)} ↗</a>`).join("")}</div><div class="walk-stop-actions"><button data-locate="${stop.id}">Find on map ↗</button><a href="${mapsLink(stop)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a><label><input type="checkbox" data-visited="${stop.id}" aria-label="Mark ${escape(stop.name)} as visited" ${visited.has(stop.id) ? "checked" : ""}/> Visited</label></div></div></details>`;
}
$("#walk-stop-list").innerHTML = walkStops
  .map((stop) => stopCard(stop))
  .join("");
$("#walk-detours").innerHTML = walkExtras
  .map((stop) => stopCard(stop, true))
  .join("");
$("#walk-directions").innerHTML = walkSections
  .map((section) => {
    const stops = section.ids.map((id) => byId.get(id));
    return `<article><h4>${escape(section.label)}</h4><p>${stops.map((stop) => escape(stop.name)).join(" → ")}</p><a href="${directionsLink(stops)}" target="_blank" rel="noopener noreferrer" aria-label="Google Maps walking directions for stops ${stops[0].number} to ${stops.at(-1).number}">Open walking section ↗</a></article>`;
  })
  .join("");
$("#walk-source-grid").innerHTML = walkSourceCards
  .map(
    (source) =>
      `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer"><span>${escape(source.name)} <span aria-hidden="true">↗</span></span><small>${escape(source.publisher)}</small><em>Read · 1 November 2026</em></a>`,
  )
  .join("");

const map = L.map("walk-map", { scrollWheelZoom: false, zoomControl: false });
L.control.zoom({ position: "bottomright" }).addTo(map);
let loadedTile = false;
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
}).addTo(map);
tiles.on("tileload", () => {
  loadedTile = true;
  $("#walk-map-error").hidden = true;
});
tiles.on("tileerror", () => {
  if (!loadedTile) $("#walk-map-error").hidden = false;
});
L.polyline(route, {
  color: "#b9412d",
  weight: 4,
  opacity: 0.85,
  lineJoin: "round",
  dashArray: "9 6",
}).addTo(map);
const mainLayer = L.layerGroup().addTo(map);
const extraLayer = L.layerGroup().addTo(map);
const ferryLayer = L.layerGroup();
const markers = new Map();
function icon(stop, extra = false) {
  return L.divIcon({
    className: `walk-pin-wrap ${extra ? "walk-extra-pin-wrap" : "walk-book-pin-wrap"}`,
    html: `<span class="walk-pin ${extra ? "extra-pin" : ""} ${visited.has(stop.id) ? "visited-pin" : ""} ${state.selected === stop.id ? "selected-pin" : ""}">${extra ? stop.label : stop.number}</span>`,
    iconSize: [32, 38],
    iconAnchor: [16, 35],
  });
}
function makeMarker(stop, extra = false) {
  const marker = L.marker([stop.lat, stop.lng], {
    icon: icon(stop, extra),
    title: `${extra ? stop.label : stop.number}. ${stop.name}`,
  });
  marker.bindPopup(
    `<div class="pin-popup"><span class="eyebrow">${extra ? "OPTIONAL DETOUR " + stop.label : "BOOK STOP " + stop.number}</span><h3>${escape(stop.name)}</h3><p>${escape(stop.address)}</p><a href="${mapsLink(stop)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a><button data-read="${stop.id}">Read this stop ↓</button></div>`,
  );
  marker.on("click", () => select(stop.id, false));
  marker.addTo(extra ? extraLayer : mainLayer);
  markers.set(stop.id, marker);
}
walkStops.forEach((stop) => makeMarker(stop));
walkExtras.forEach((stop) => makeMarker(stop, true));
L.marker([walkHotel.lat, walkHotel.lng], {
  icon: L.divIcon({
    className: "walk-base-pin-wrap",
    html: '<span class="walk-base-pin">H</span>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  title: "Eaton HK · your base",
  zIndexOffset: 1000,
})
  .addTo(map)
  .bindPopup(
    `<div class="pin-popup"><span class="eyebrow">YOUR BASE</span><h3>Eaton HK</h3><p>${escape(walkHotel.address)}</p><a href="${directionsLink([walkHotel, walkStops[0]])}" target="_blank" rel="noopener noreferrer">Walk to the Museum of Art ↗</a></div>`,
  );
L.polyline(
  [
    [walkStops[8].lat, walkStops[8].lng],
    [ferryEndpoint.lat, ferryEndpoint.lng],
  ],
  { color: "#387eac", weight: 3, dashArray: "5 8", opacity: 0.9 },
).addTo(ferryLayer);
L.marker([ferryEndpoint.lat, ferryEndpoint.lng], {
  icon: L.divIcon({
    className: "walk-ferry-pin-wrap",
    html: '<span class="walk-ferry-pin">FERRY</span>',
    iconSize: [48, 24],
    iconAnchor: [24, 12],
  }),
  title: ferryEndpoint.name,
})
  .addTo(ferryLayer)
  .bindPopup(
    `<div class="pin-popup"><span class="eyebrow">OPTIONAL RETURN CROSSING</span><h3>Central · Pier 7</h3><p>Take the return ferry to Tsim Sha Tsui to continue to stop 10. This line illustrates the crossing, not the boat’s exact track.</p><a href="${mapsLink(ferryEndpoint)}" target="_blank" rel="noopener noreferrer">Central ferry pier on Google Maps ↗</a><a href="https://www.starferry.com.hk/en/home" target="_blank" rel="noopener noreferrer">Operator’s timetable & notices ↗</a></div>`,
  );

function fitAll() {
  const points = [
    [walkHotel.lat, walkHotel.lng],
    ...route,
    ...(state.extras ? walkExtras.map((s) => [s.lat, s.lng]) : []),
    ...(state.ferry ? [[ferryEndpoint.lat, ferryEndpoint.lng]] : []),
  ];
  map.fitBounds(L.latLngBounds(points), {
    padding: [30, 35],
    maxZoom: 16,
    animate: false,
  });
}
function refreshIcons() {
  allStops.forEach((stop) =>
    markers.get(stop.id).setIcon(icon(stop, Boolean(stop.label))),
  );
}
function select(id, locate = true) {
  const stop = byId.get(id);
  if (!stop) return;
  state.selected = id;
  if (stop.label && !state.extras) {
    state.extras = true;
    $("#show-detours").checked = true;
    extraLayer.addTo(map);
  }
  document
    .querySelectorAll(".walk-stop")
    .forEach((el) => el.classList.toggle("selected", el.dataset.stop === id));
  const card = document.getElementById("walk-stop-" + id);
  card.open = true;
  refreshIcons();
  if (locate) {
    map.setView([stop.lat, stop.lng], 17, { animate: false });
    markers.get(id).openPopup();
    if (matchMedia("(max-width:900px)").matches)
      $(".walk-map-panel").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }
}
function updateProgress() {
  const count = walkStops.filter((stop) => visited.has(stop.id)).length;
  $("#walk-progress").textContent = `${count} of 10 book stops visited`;
  $("#walk-progress-meter").value = count;
  document
    .querySelectorAll(".walk-stop")
    .forEach((el) =>
      el.classList.toggle("completed", visited.has(el.dataset.stop)),
    );
  document
    .querySelectorAll("[data-visited]")
    .forEach((input) => (input.checked = visited.has(input.dataset.visited)));
}
function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...visited]));
  } catch {
    toast("Progress kept for this visit. Browser storage is unavailable.");
  }
}
function updateExpansion() {
  const all = [...document.querySelectorAll(".walk-stop")].every(
    (el) => el.open,
  );
  $("#expand-stops").setAttribute("aria-expanded", String(all));
  $("#expand-stops").textContent = all
    ? "Collapse all stops"
    : "Expand all stops";
}
$("#expand-stops").addEventListener("click", () => {
  const open = $("#expand-stops").getAttribute("aria-expanded") !== "true";
  document.querySelectorAll(".walk-stop").forEach((el) => (el.open = open));
  updateExpansion();
});
document
  .querySelectorAll(".walk-stop")
  .forEach((el) => el.addEventListener("toggle", updateExpansion));
$("#reset-walk").addEventListener("click", () => {
  visited.clear();
  saveProgress();
  updateProgress();
  refreshIcons();
  toast("Visited stops cleared. Food favourites are unchanged.");
});
$("#show-detours").addEventListener("change", (e) => {
  state.extras = e.target.checked;
  state.extras ? extraLayer.addTo(map) : map.removeLayer(extraLayer);
  fitAll();
});
$("#show-ferry").addEventListener("change", (e) => {
  state.ferry = e.target.checked;
  state.ferry ? ferryLayer.addTo(map) : map.removeLayer(ferryLayer);
  fitAll();
});
$("#fit-walk-map").addEventListener("click", fitAll);
document.addEventListener("change", (e) => {
  const input = e.target.closest("[data-visited]");
  if (!input) return;
  input.checked
    ? visited.add(input.dataset.visited)
    : visited.delete(input.dataset.visited);
  saveProgress();
  updateProgress();
  refreshIcons();
});
document.addEventListener("click", (e) => {
  const locate = e.target.closest("[data-locate]");
  if (locate) {
    select(locate.dataset.locate);
    return;
  }
  const read = e.target.closest("[data-read]");
  if (read) {
    const id = read.dataset.read;
    select(id, false);
    const card = document.getElementById("walk-stop-" + id);
    card.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    card.querySelector("summary").focus({ preventScroll: true });
  }
});
$("#download-walk").addEventListener("click", () => {
  const blob = new Blob(
    [mapKml(walkStops, walkExtras, walkLegs, walkHotel, ferryEndpoint)],
    { type: "application/vnd.google-earth.kml+xml;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "walk-kowloon.kml";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updateProgress();
updateExpansion();
fitAll();
new ResizeObserver(() => {
  map.invalidateSize({ pan: false });
  fitAll();
}).observe($("#walk-map"));
