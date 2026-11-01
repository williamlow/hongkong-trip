const L = window.L;
import { hotel, restaurants, sources, week } from "./data.js";

const $ = (s) => document.querySelector(s);
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const maps = (r) => {
  const query = [
    r.name,
    r.address,
    r.area,
    r.address.endsWith("Hong Kong") ? null : "Hong Kong",
  ]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
const directions = (r) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}&destination=${encodeURIComponent(`${r.name}, ${r.address}, ${r.area}, Hong Kong`)}&travelmode=walking`;
const distance = (r) => {
  const rad = (n) => (n * Math.PI) / 180;
  const a =
    Math.sin(rad(r.lat - hotel.lat) / 2) ** 2 +
    Math.cos(rad(hotel.lat)) *
      Math.cos(rad(r.lat)) *
      Math.sin(rad(r.lng - hotel.lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
restaurants.forEach((r) => {
  r.distance = distance(r);
  r.near = r.distance <= 1;
  r.walk = Math.max(2, Math.round(((r.distance * 1.35) / 4.5) * 60));
});
let saved;
try {
  const data = JSON.parse(localStorage.getItem("one-more-bite-saved") || "[]");
  saved = new Set(
    Array.isArray(data)
      ? data.filter((id) => restaurants.some((r) => r.id === id))
      : [],
  );
} catch {
  saved = new Set();
}
const state = {
  search: "",
  area: "all",
  category: "all",
  near: false,
  saved: false,
  newOnly: false,
  sort: "recommended",
  selected: null,
};
let storageWorks = true;
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2800);
}
$("#hotel-link").href = maps(hotel);
$("#total-count").textContent = restaurants.length;
$("#near-count").textContent = restaurants.filter((r) => r.near).length;
const areas = [...new Set(restaurants.map((r) => r.area))].sort();
areas.forEach((area) => {
  const option = document.createElement("option");
  option.value = area;
  option.textContent = area;
  $("#area").append(option);
});
const requestedArea = new URLSearchParams(location.search).get("area");
if (areas.includes(requestedArea)) {
  state.area = requestedArea;
  $("#area").value = requestedArea;
}
const categories = ["all", ...new Set(restaurants.map((r) => r.category))];
$("#categories").innerHTML = categories
  .map(
    (c) =>
      `<button class="category-chip ${c === "all" ? "active" : ""}" data-category="${escape(c)}" aria-pressed="${c === "all"}">${c === "all" ? "Everything" : escape(c)}</button>`,
  )
  .join("");

const newCount = restaurants.filter((r) => r.addedIn === "more-bites").length;
$("#categories").insertAdjacentHTML(
  "afterbegin",
  `<button class="category-chip new-chip" id="new-toggle" aria-pressed="false">+ ${newCount} new places</button>`,
);
$("#new-toggle").addEventListener("click", () => {
  state.newOnly = !state.newOnly;
  updateCategories();
  render();
});

const map = L.map("map", {
  scrollWheelZoom: false,
  zoomControl: false,
}).setView([22.302, 114.16], 12);
L.control.zoom({ position: "bottomright" }).addTo(map);
let loadedTile = false;
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
}).addTo(map);
tiles.on("tileload", () => {
  loadedTile = true;
  $("#map-error").hidden = true;
});
tiles.on("tileerror", () => {
  if (!loadedTile) $("#map-error").hidden = false;
});
const hotelIcon = L.divIcon({
  className: "hotel-marker-wrap",
  html: '<span class="hotel-marker" aria-label="Eaton HK">⌂</span>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});
L.marker([hotel.lat, hotel.lng], {
  icon: hotelIcon,
  title: "Eaton HK · your base",
  zIndexOffset: 1000,
})
  .addTo(map)
  .bindPopup(
    `<div class="pin-popup"><span class="eyebrow">YOUR BASE</span><h3>Eaton HK</h3><p>${escape(hotel.address)}</p><a href="${maps(hotel)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></div>`,
  );
const markers = L.layerGroup().addTo(map);
const markerById = new Map();
let visible = [];
function fitMap() {
  const points = [
    [hotel.lat, hotel.lng],
    ...visible.map((r) => [r.lat, r.lng]),
  ];
  map.fitBounds(L.latLngBounds(points), {
    padding: [35, 35],
    maxZoom: 15,
    animate: false,
  });
}
function card(r) {
  return `<article class="restaurant-card ${state.selected === r.id ? "selected" : ""}" id="place-${r.id}" data-id="${r.id}"><div class="card-top"><span class="place-number">${String(r.number).padStart(2, "0")}</span><div class="card-location">${escape(r.area)} <span> / </span> ${escape(r.category)}${r.addedIn ? `<span class="new-label">NEW</span>` : ""}</div><button class="save-button ${saved.has(r.id) ? "is-saved" : ""}" data-save="${r.id}" aria-label="${saved.has(r.id) ? "Unsave" : "Save"} ${escape(r.name)}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id) ? "♥" : "♡"}</button></div><div class="card-title"><h3><button data-locate="${r.id}" title="Show ${escape(r.name)} on the map">${escape(r.name)}</button></h3><span lang="zh-Hant">${escape(r.chinese)}</span></div><div class="card-tags"><span class="budget">HK$${r.low}–${r.high} <small>est.</small></span><span>${escape(r.meal)}</span>${r.near ? `<span class="near-badge">⌂ ~${r.walk} min walk</span>` : ""}</div><p class="card-description">${escape(r.description)}</p><div class="order-box"><span>COME FOR</span><p>${escape(r.order)}</p></div><p class="card-tip">${escape(r.tip)}</p><div class="card-address">${escape(r.address)} · ${escape(r.area)}</div><div class="card-sources"><span>READ WHY</span>${r.citations.map((c) => `<a href="${escape(c.url)}" target="_blank" rel="noopener noreferrer" title="${escape(c.title)}${c.published ? ` · ${escape(c.published)}` : ``}" aria-label="${escape(c.publisher)}: ${escape(c.title)} — source for ${escape(r.name)}">${escape(c.publisher)} ↗</a>`).join("")}</div><div class="card-bottom"><button data-locate="${r.id}" class="map-button"><svg width="13" height="16" viewBox="0 0 18 22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M16 8c0 6-7 12-7 12S2 14 2 8a7 7 0 1 1 14 0Z"/><circle cx="9" cy="8" r="2.5"/></svg> Find on map</button><a href="${maps(r)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>${r.near ? `<a class="directions-link" href="${directions(r)}" target="_blank" rel="noopener noreferrer" aria-label="Walking directions from Eaton HK to ${escape(r.name)}">Walk ↗</a>` : ""}</div></article>`;
}
function render() {
  const terms = state.search
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  visible = restaurants.filter((r) => {
    const text =
      `${r.name} ${r.chinese} ${r.area} ${r.category} ${r.order} ${r.description} ${r.address}`.toLocaleLowerCase();
    return (
      terms.every((term) => text.includes(term)) &&
      (state.area === "all" || r.area === state.area) &&
      (state.category === "all" || r.category === state.category) &&
      (!state.near || r.near) &&
      (!state.saved || saved.has(r.id)) &&
      (!state.newOnly || r.addedIn === "more-bites")
    );
  });
  if (state.sort === "distance")
    visible.sort((a, b) => a.distance - b.distance);
  if (state.sort === "price") visible.sort((a, b) => a.low - b.low);
  $("#restaurant-list").innerHTML = visible.map(card).join("");
  $("#empty").hidden = visible.length > 0;
  $("#results-count").innerHTML =
    `<strong>${visible.length}</strong> ${visible.length === 1 ? "place" : "places"}${state.near ? " near Eaton HK" : ""}${state.saved ? " saved" : ""}${state.newOnly ? " · new additions" : ""} <span>· source links on every card</span>`;
  $("#saved-count").textContent = saved.size;
  markers.clearLayers();
  markerById.clear();
  visible.forEach((r) => {
    const icon = L.divIcon({
      className: "food-marker-wrap",
      html: `<span class="food-marker ${state.selected === r.id ? "active" : ""}">${String(r.number).padStart(2, "0")}</span>`,
      iconSize: [30, 38],
      iconAnchor: [15, 36],
    });
    const marker = L.marker([r.lat, r.lng], {
      icon,
      title: `${r.number}. ${r.name}`,
      keyboard: true,
    })
      .addTo(markers)
      .bindPopup(
        `<div class="pin-popup"><span class="eyebrow">${escape(r.area)} · HK$${r.low}–${r.high} EST.</span><h3>${escape(r.name)}</h3><p>${escape(r.order)}</p><small>${escape(r.address)} · approximate pin</small><a href="${maps(r)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a><button data-card="${r.id}">Read the notebook entry ↓</button></div>`,
      );
    marker.on("click", () => {
      state.selected = r.id;
      document
        .querySelectorAll(".restaurant-card")
        .forEach((c) => c.classList.toggle("selected", c.dataset.id === r.id));
    });
    markerById.set(r.id, marker);
  });
  fitMap();
}
function reset() {
  Object.assign(state, {
    search: "",
    area: "all",
    category: "all",
    near: false,
    saved: false,
    newOnly: false,
    sort: "recommended",
    selected: null,
  });
  $("#search").value = "";
  $("#area").value = "all";
  $("#sort").value = "recommended";
  $("#near-toggle").setAttribute("aria-pressed", "false");
  $("#saved-toggle").setAttribute("aria-pressed", "false");
  updateCategories();
  render();
}
function updateCategories() {
  $("#new-toggle").setAttribute("aria-pressed", String(state.newOnly));
  $("#new-toggle").classList.toggle("active", state.newOnly);
  document.querySelectorAll("[data-category]").forEach((b) => {
    b.classList.toggle("active", b.dataset.category === state.category);
    b.setAttribute(
      "aria-pressed",
      String(b.dataset.category === state.category),
    );
  });
}
function locate(id) {
  const marker = markerById.get(id);
  if (!marker) return;
  state.selected = id;
  document
    .querySelectorAll(".restaurant-card")
    .forEach((c) => c.classList.toggle("selected", c.dataset.id === id));
  map.setView(marker.getLatLng(), 16, {
    animate: !matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
  marker.openPopup();
  if (matchMedia("(max-width: 900px)").matches)
    $(".map-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}
$("#search").addEventListener("input", (e) => {
  state.search = e.target.value;
  render();
});
$("#area").addEventListener("change", (e) => {
  state.area = e.target.value;
  render();
});
$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});
$("#near-toggle").addEventListener("click", () => {
  state.near = !state.near;
  $("#near-toggle").setAttribute("aria-pressed", String(state.near));
  render();
});
$("#saved-toggle").addEventListener("click", () => {
  state.saved = !state.saved;
  $("#saved-toggle").setAttribute("aria-pressed", String(state.saved));
  render();
});
$("#categories").addEventListener("click", (e) => {
  const b = e.target.closest("[data-category]");
  if (!b) return;
  state.category = b.dataset.category;
  updateCategories();
  render();
});
$("#reset-filters").addEventListener("click", reset);
$("#fit-map").addEventListener("click", fitMap);
document.addEventListener("click", (e) => {
  const save = e.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    const adding = !saved.has(id);
    adding ? saved.add(id) : saved.delete(id);
    try {
      localStorage.setItem("one-more-bite-saved", JSON.stringify([...saved]));
    } catch {
      storageWorks = false;
    }
    render();
    toast(
      storageWorks
        ? adding
          ? "Added to your saved places."
          : "Removed from saved places."
        : "Saved for this visit. Browser storage is unavailable.",
    );
    return;
  }
  const find = e.target.closest("[data-locate]");
  if (find) {
    locate(find.dataset.locate);
    return;
  }
  const jump = e.target.closest("[data-card]");
  if (jump) {
    const el = document.getElementById(`place-${jump.dataset.card}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector("h3 button")?.focus({ preventScroll: true });
  }
  const plan = e.target.closest("[data-plan]");
  if (plan) {
    reset();
    const id = plan.dataset.plan;
    state.search = restaurants.find((r) => r.id === id).name;
    $("#search").value = state.search;
    render();
    $("#explore").scrollIntoView({ behavior: "smooth" });
    locate(id);
  }
});
$("#week-grid").innerHTML = week
  .map(
    (d) =>
      `<article class="day-card"><span class="day-number">DAY ${d.day}</span><p class="day-area">${escape(d.area)}</p><h3>${escape(d.title)}</h3><p>${escape(d.note)}</p><div class="day-stops">${d.ids
        .map((id) => {
          const r = restaurants.find((p) => p.id === id);
          return `<button data-plan="${id}">${escape(r.name)} <span>↗</span></button>`;
        })
        .join("")}</div></article>`,
  )
  .join("");
$("#source-grid").innerHTML = sources
  .map(
    (s) =>
      `<a href="${s.url}" target="_blank" rel="noopener noreferrer"><span>${escape(s.name)} <span aria-hidden="true">↗</span></span><small>${escape(s.type)}</small><em>${escape(s.status)}</em></a>`,
  )
  .join("");
render();
const linkedCard = document.getElementById(location.hash.slice(1));
if (linkedCard?.matches(".restaurant-card")) {
  requestAnimationFrame(() => {
    linkedCard.scrollIntoView({ behavior: "instant", block: "start" });
  });
}
const resizeObserver = new ResizeObserver(() => {
  map.invalidateSize({ pan: false });
  fitMap();
});
resizeObserver.observe($("#map"));
