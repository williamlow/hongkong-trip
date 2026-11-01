export function distanceKm(points) {
  const rad = (value) => (value * Math.PI) / 180;
  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1], points[i]];
    const h =
      Math.sin(rad(b[0] - a[0]) / 2) ** 2 +
      Math.cos(rad(a[0])) *
        Math.cos(rad(b[0])) *
        Math.sin(rad(b[1] - a[1]) / 2) ** 2;
    distance += 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  return distance;
}

export function mergedRoute(legs) {
  return legs.flatMap((leg, index) =>
    index ? leg.points.slice(1) : leg.points,
  );
}

export function mapsQuery(stop) {
  return (
    stop.mapsQuery ||
    [
      stop.name,
      stop.address,
      stop.address?.endsWith("Hong Kong") ? null : "Hong Kong",
    ]
      .filter(Boolean)
      .join(", ")
  );
}

export function mapsLink(stop) {
  return (
    "https://www.google.com/maps/search/?" +
    new URLSearchParams({ api: "1", query: mapsQuery(stop) })
  );
}

// Five places means at most three intermediate waypoints, including on mobile.
export function directionsLink(stops) {
  if (stops.length < 2 || stops.length > 5)
    throw new RangeError("Use walking sections of two to five stops.");
  const params = new URLSearchParams({
    api: "1",
    origin: mapsQuery(stops[0]),
    destination: mapsQuery(stops.at(-1)),
    travelmode: "walking",
  });
  if (stops.length > 2)
    params.set("waypoints", stops.slice(1, -1).map(mapsQuery).join("|"));
  return "https://www.google.com/maps/dir/?" + params;
}

const xml = (text) =>
  String(text).replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );

export function mapKml(stops, extras, legs, hotel, ferry) {
  const point = (stop, style, label) =>
    `<Placemark><name>${xml(label + " " + stop.name)}</name><styleUrl>#${style}</styleUrl><description>${xml((stop.background || stop.description || "") + "\n" + (stop.address || "") + "\n" + mapsLink(stop))}</description><Point><coordinates>${stop.lng},${stop.lat},0</coordinates></Point></Placemark>`;
  const line = (name, style, points) =>
    `<Placemark><name>${xml(name)}</name><styleUrl>#${style}</styleUrl><description>Illustrative route, not live turn-by-turn navigation. Use the linked Google Maps walking sections for current crossings and access.</description><LineString><tessellate>1</tessellate><coordinates>${points.map(([lat, lng]) => `${lng},${lat},0`).join(" ")}</coordinates></LineString></Placemark>`;
  return `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Walk Kowloon — ten book stops and six optional detours</name><description>Adapted from the user's photograph of Lonely Planet's Walk Kowloon. Background is independently written; coordinates use Hong Kong Tourism Board, OpenStreetMap and cited branch listings. Optional places are A–F. The ferry line is illustrative. No live opening or navigation data.</description><Style id="original"><IconStyle><color>ff2d41b9</color></IconStyle></Style><Style id="extra"><IconStyle><color>ff323b27</color></IconStyle></Style><Style id="base"><IconStyle><color>ff686868</color></IconStyle></Style><Style id="walk"><LineStyle><color>ff2d41b9</color><width>4</width></LineStyle></Style><Style id="ferry"><LineStyle><color>ffb88645</color><width>3</width></LineStyle></Style>${stops.map((s) => point(s, "original", s.number + ".")).join("")}${extras.map((s) => point(s, "extra", s.label + ".")).join("")}${point(hotel, "base", "Base:")}${point(ferry, "base", "Ferry:")}${line("Approximate walking route · book order", "walk", mergedRoute(legs))}${line(
    "Optional Star Ferry excursion · schematic crossing",
    "ferry",
    [
      [stops[8].lat, stops[8].lng],
      [ferry.lat, ferry.lng],
    ],
  )}</Document></kml>`;
}
