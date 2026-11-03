import {
  dayTrips,
  hikes,
  filterDayTrips,
  filterHikes,
  hotel,
} from "./outdoors-data.js";
import { mapsLink } from "./walk-utils.js";
const L = window.L,
  esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const isHike = document.body.dataset.outdoors === "hikes";
const items = isHike ? hikes : dayTrips;
let visible = items,
  selected = null;
const markers = new Map();
const map = L.map("outdoor-map", {
  scrollWheelZoom: false,
  zoomControl: false,
});
L.control.zoom({ position: "bottomright" }).addTo(map);
let loadedTile = false;
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
}).addTo(map);
tiles.on("tileload", () => {
  loadedTile = true;
  document.getElementById("outdoor-map-error").hidden = true;
});
tiles.on("tileerror", () => {
  if (!loadedTile) document.getElementById("outdoor-map-error").hidden = false;
});
const layer = L.layerGroup().addTo(map),
  endLayer = L.layerGroup().addTo(map);
if (!isHike)
  L.marker([hotel.lat, hotel.lng], {
    title: "Eaton HK · your base",
    icon: L.divIcon({
      className: "outdoor-hotel-pin",
      html: "<span>H</span>",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    }),
    zIndexOffset: 1000,
  })
    .addTo(map)
    .bindPopup(
      `<div class="pin-popup"><span class="eyebrow">YOUR BASE</span><h3>Eaton HK</h3><p>${esc(hotel.address)}</p><a href="${esc(mapsLink(hotel))}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a></div>`,
    );
function fitAll() {
  const points = visible.map((p) => [p.lat, p.lng]);
  if (!isHike) points.push([hotel.lat, hotel.lng]);
  if (!points.length) return;
  map.fitBounds(L.latLngBounds(points), {
    padding: [35, 40],
    maxZoom: 15,
    animate: false,
  });
}
function updateSelection(id) {
  selected = id;
  document
    .querySelectorAll("[data-outdoor-id]")
    .forEach((card) =>
      card.classList.toggle("selected", card.dataset.outdoorId === id),
    );
  for (const [key, marker] of markers) {
    marker.getElement()?.classList.toggle("outdoor-selected-pin", key === id);
    marker.setZIndexOffset(key === id ? 1500 : 0);
  }
  endLayer.clearLayers();
  const p = items.find((p) => p.id === id);
  if (isHike && p?.end) {
    L.marker([p.end.lat, p.end.lng], {
      title: `Finish · ${p.end.name}`,
      icon: L.divIcon({
        className: "outdoor-end-pin",
        html: "<span>E</span>",
        iconSize: [30, 34],
        iconAnchor: [15, 30],
      }),
    })
      .addTo(endLayer)
      .bindPopup(
        `<div class="pin-popup"><span class="eyebrow">APPROXIMATE ROAD-EXIT REFERENCE</span><h3>${esc(p.end.name)}</h3><p>${esc(p.end.address)}</p><a href="${esc(mapsLink(p.end))}" target="_blank" rel="noopener noreferrer">Finish on Google Maps ↗</a></div>`,
      );
  }
  document.getElementById("outdoor-map-key").textContent = isHike
    ? p?.end
      ? `${p.number} = selected start · E = approximate finish · No trail track drawn`
      : "Numbers = approximate starts · E appears for a selected one-way finish"
    : "Numbers match the trip cards · H = Eaton HK";
}
function renderMarkers() {
  layer.clearLayers();
  markers.clear();
  for (const p of visible) {
    const point = isHike
      ? p.start
      : p.mapPlace || { name: p.name, address: "Hong Kong" };
    const marker = L.marker([p.lat, p.lng], {
      title: `${p.number}. ${p.name}`,
      icon: L.divIcon({
        className: `outdoor-pin-wrap ${isHike ? "outdoor-hike-pin" : "outdoor-trip-pin"}`,
        html: `<span>${p.number}</span>`,
        iconSize: [30, 34],
        iconAnchor: [15, 30],
      }),
    }).addTo(layer);
    marker.bindPopup(
      `<div class="pin-popup"><span class="eyebrow">${isHike ? "APPROXIMATE START AREA" : "DAY-TRIP DESTINATION"} ${p.number}</span><h3>${esc(p.name)}</h3><p>${esc(isHike ? p.start.address : p.tagline)}</p><a href="${esc(mapsLink(point))}" target="_blank" rel="noopener noreferrer">${isHike ? "Start" : "Destination"} on Google Maps ↗</a><button data-outdoor-read="${p.id}">Read this ${isHike ? "walk" : "trip"} ↓</button></div>`,
    );
    marker.on("click", () => {
      openCard(p.id);
      updateSelection(p.id);
    });
    markers.set(p.id, marker);
  }
  updateSelection(null);
}
function applyFilter(mode) {
  visible = isHike ? filterHikes(mode) : filterDayTrips(mode);
  const ids = new Set(visible.map((p) => p.id));
  document
    .querySelectorAll("[data-outdoor-id]")
    .forEach((card) => (card.hidden = !ids.has(card.dataset.outdoorId)));
  document
    .querySelectorAll("[data-outdoor-filter]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.outdoorFilter === mode)),
    );
  document.getElementById("outdoor-count").textContent =
    `${visible.length} ${isHike ? (visible.length === 1 ? "hike" : "hikes") : visible.length === 1 ? "day trip" : "day trips"} shown`;
  map.closePopup();
  renderMarkers();
  fitAll();
}
function openCard(id) {
  if (!visible.some((p) => p.id === id)) applyFilter("all");
  const card = document.getElementById(`${isHike ? "hike" : "trip"}-${id}`);
  if (card) card.open = true;
  return card;
}
function scrollTo(el) {
  el.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
document
  .querySelectorAll("[data-outdoor-filter]")
  .forEach((b) =>
    b.addEventListener("click", () => applyFilter(b.dataset.outdoorFilter)),
  );
document.getElementById("fit-outdoor-map").addEventListener("click", () => {
  updateSelection(null);
  map.closePopup();
  fitAll();
});
document.addEventListener("click", (event) => {
  const locate = event.target.closest("[data-outdoor-locate]");
  if (locate) {
    const id = locate.dataset.outdoorLocate,
      p = items.find((p) => p.id === id);
    if (!p) return;
    openCard(id);
    updateSelection(id);
    const points = [[p.lat, p.lng]];
    if (isHike && p.end) points.push([p.end.lat, p.end.lng]);
    map.fitBounds(L.latLngBounds(points), {
      padding: [45, 50],
      maxZoom: 16,
      animate: false,
    });
    markers.get(id).openPopup();
    if (matchMedia("(max-width:900px)").matches)
      scrollTo(document.querySelector(".outdoor-map-panel"));
  }
  const read = event.target.closest("[data-outdoor-read]");
  if (read) {
    const card = openCard(read.dataset.outdoorRead);
    updateSelection(read.dataset.outdoorRead);
    scrollTo(card);
    card.querySelector("summary").focus({ preventScroll: true });
  }
  const compare = event.target.closest("[data-open-outdoor]");
  if (compare) {
    event.preventDefault();
    const card = openCard(compare.dataset.openOutdoor);
    updateSelection(compare.dataset.openOutdoor);
    if (card) {
      history.pushState(null, "", compare.getAttribute("href"));
      scrollTo(card);
      card.querySelector("summary").focus({ preventScroll: true });
    }
  }
});
renderMarkers();
fitAll();
new ResizeObserver(() => {
  map.invalidateSize({ pan: false });
  fitAll();
}).observe(document.getElementById("outdoor-map"));
const fragment = location.hash.slice(1),
  linkedCard = document.getElementById(fragment);
if (linkedCard?.matches("[data-outdoor-id]")) {
  linkedCard.open = true;
  requestAnimationFrame(() =>
    linkedCard.scrollIntoView({ behavior: "instant", block: "start" }),
  );
}
