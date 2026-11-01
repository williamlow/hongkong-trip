import {
  neighbourhoods,
  byNeighbourhood,
  hotel,
  kinds,
} from "./neighbourhood-data.js";
import { mapsLink } from "./walk-utils.js";
const L = window.L;
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const current = byNeighbourhood[document.body.dataset.neighbourhood];
const map = L.map("area-map", { scrollWheelZoom: false, zoomControl: false });
L.control.zoom({ position: "bottomright" }).addTo(map);
let tileLoaded = false;
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
}).addTo(map);
tiles.on("tileload", () => {
  tileLoaded = true;
  document.getElementById("area-map-error").hidden = true;
});
tiles.on("tileerror", () => {
  if (!tileLoaded) document.getElementById("area-map-error").hidden = false;
});
const layer = L.layerGroup().addTo(map);
let visible = current ? current.places : neighbourhoods;
let markers = new Map();
let selected = null;
function fitMap() {
  const points = visible.map((p) => [p.lat, p.lng]);
  if (!current) points.push([hotel.lat, hotel.lng]);
  if (!points.length) return;
  map.fitBounds(L.latLngBounds(points), {
    padding: [35, 40],
    maxZoom: 16,
    animate: false,
  });
}
function markSelected(id) {
  selected = id;
  document
    .querySelectorAll(".area-place")
    .forEach((card) =>
      card.classList.toggle("selected", card.dataset.place === id),
    );
  for (const [key, marker] of markers) {
    marker.getElement()?.classList.toggle("selected-area-pin", key === id);
    marker.setZIndexOffset(key === id ? 2000 : 0);
  }
}
function renderMarkers() {
  layer.clearLayers();
  markers = new Map();
  for (const p of visible) {
    const label = p.number;
    const icon = L.divIcon({
      className: `area-pin-wrap ${current ? "area-place-pin" : "area-hub-pin"} ${current ? "kind-" + p.kind : ""}`,
      html: `<span>${label}</span>`,
      iconSize: [30, 34],
      iconAnchor: [15, 30],
    });
    const marker = L.marker([p.lat, p.lng], {
      icon,
      title: `${label}. ${p.name}`,
    }).addTo(layer);
    const content = current
      ? `<span class="eyebrow">${esc(kinds[p.kind])}</span><h3>${esc(p.name)}</h3><p>${esc(p.address)}</p><a href="${esc(mapsLink(p))}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a><button data-read-place="${p.id}">Read this place ↓</button>`
      : `<span class="eyebrow">NEIGHBOURHOOD ${p.number}</span><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p><a href="./${p.id}.html">Open the day guide ↗</a>`;
    marker.bindPopup(`<div class="pin-popup">${content}</div>`);
    marker.on("click", () => markSelected(p.id));
    markers.set(p.id, marker);
  }
  markSelected(selected);
}
if (!current) {
  L.marker([hotel.lat, hotel.lng], {
    icon: L.divIcon({
      className: "area-hotel-pin",
      html: "<span>H</span>",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    }),
    title: "Eaton HK · your base",
    zIndexOffset: 1000,
  })
    .addTo(map)
    .bindPopup(
      `<div class="pin-popup"><span class="eyebrow">YOUR BASE</span><h3>Eaton HK</h3><p>${esc(hotel.address)}</p><a href="${esc(mapsLink(hotel))}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a></div>`,
    );
}
renderMarkers();
fitMap();
document.getElementById("fit-area-map").addEventListener("click", fitMap);
new ResizeObserver(() => {
  map.invalidateSize({ pan: false });
  fitMap();
}).observe(document.getElementById("area-map"));
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const kind = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    visible = current.places.filter(
      (p) => kind === "all" || p.kind === kind || p.also?.includes(kind),
    );
    const ids = new Set(visible.map((p) => p.id));
    document
      .querySelectorAll(".area-place")
      .forEach((card) => (card.hidden = !ids.has(card.dataset.place)));
    selected = null;
    map.closePopup();
    renderMarkers();
    fitMap();
    document.getElementById("area-result-count").textContent =
      `${visible.length} ${visible.length === 1 ? "place" : "places"} on the map`;
  }),
);
document.addEventListener("click", (event) => {
  const locate = event.target.closest("[data-locate]");
  if (locate) {
    const id = locate.dataset.locate,
      p = current.places.find((p) => p.id === id);
    if (!p) return;
    markSelected(id);
    map.setView([p.lat, p.lng], 17, { animate: false });
    markers.get(id).openPopup();
    if (matchMedia("(max-width:900px)").matches)
      document.querySelector(".area-map-panel").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }
  const read = event.target.closest("[data-read-place]");
  if (read) {
    const id = read.dataset.readPlace;
    markSelected(id);
    const card = document.getElementById("place-" + id);
    card.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    const heading = card.querySelector("h3");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
});
