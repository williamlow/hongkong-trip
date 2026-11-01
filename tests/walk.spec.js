import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  walkStops,
  walkExtras,
  walkLegs,
  walkSections,
  walkHotel,
  ferryEndpoint,
} from "../walk-data.js";
import { directionsLink, mergedRoute, distanceKm } from "../walk-utils.js";

test("the photo’s ten-stop sequence is preserved and the walking line joins every stop in order", () => {
  expect(walkStops.map((stop) => stop.id)).toEqual([
    "art",
    "park",
    "waffles",
    "mak",
    "jade",
    "temple",
    "fruit",
    "shanghai",
    "ferry",
    "stars",
  ]);
  expect(walkStops.map((stop) => stop.number)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(walkExtras.map((stop) => stop.label)).toEqual([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ]);
  expect(walkLegs).toHaveLength(9);
  expect(
    new Set([...walkStops, ...walkExtras].map((stop) => stop.id)).size,
  ).toBe(16);
  walkLegs.forEach((leg, index) => {
    expect(leg.fromId).toBe(walkStops[index].id);
    expect(leg.toId).toBe(walkStops[index + 1].id);
    expect(leg.points[0]).toEqual([walkStops[index].lat, walkStops[index].lng]);
    expect(leg.points.at(-1)).toEqual([
      walkStops[index + 1].lat,
      walkStops[index + 1].lng,
    ]);
  });
  expect(distanceKm(mergedRoute(walkLegs))).toBeGreaterThan(5);
  expect(distanceKm(mergedRoute(walkLegs))).toBeLessThan(8);
  for (const stop of [...walkStops, ...walkExtras]) {
    expect(stop.background.length).toBeGreaterThan(150);
    expect(stop.sources.length).toBeGreaterThan(0);
    expect(stop.lat).toBeGreaterThan(22.29);
    expect(stop.lat).toBeLessThan(22.32);
    for (const source of stop.sources)
      expect(new URL(source.url).protocol).toBe("https:");
  }
  // Reject the similarly named fruit shop farther south and jade market in SSP.
  expect(walkStops.find((s) => s.id === "fruit").lat).toBeGreaterThan(22.312);
  expect(walkStops.find((s) => s.id === "jade").lat).toBeLessThan(22.31);
});

test("the three mobile walking links retain every book stop with no more than three intermediate waypoints", () => {
  const seen = new Set();
  for (const section of walkSections) {
    const stops = section.ids.map((id) =>
      walkStops.find((stop) => stop.id === id),
    );
    const url = new URL(directionsLink(stops));
    expect(url.hostname).toBe("www.google.com");
    expect(url.searchParams.get("travelmode")).toBe("walking");
    expect(
      (url.searchParams.get("waypoints") || "").split("|").filter(Boolean)
        .length,
    ).toBeLessThanOrEqual(3);
    stops.forEach((stop) => seen.add(stop.number));
  }
  expect([...seen]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(
    new URL(directionsLink([walkHotel, walkStops[0]])).searchParams.get(
      "origin",
    ),
  ).toContain("Eaton HK");
  expect(ferryEndpoint.name).toContain("Pier 7");
});

async function openWalk(page) {
  await page.goto("/walk.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".walk-book-pin-wrap")).toHaveCount(10);
}

test("the new tab is reachable and all ten original stops and six additions render without runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Kowloon walk" })
    .click();
  await expect(page).toHaveURL(/walk.html$/);
  await expect(page.locator("#walk-stop-list .walk-stop")).toHaveCount(10);
  await expect(page.locator("#walk-detours .walk-stop")).toHaveCount(6);
  await expect(page.locator(".walk-extra-pin-wrap")).toHaveCount(6);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Kowloon walk" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator("#walk-distance")).toContainText("5.9 km");
  expect(errors).toEqual([]);
});

test("detour and ferry layers toggle independently while preserving all ten original pins", async ({
  page,
}) => {
  await openWalk(page);
  await page.locator("#show-detours").uncheck();
  await expect(page.locator(".walk-extra-pin-wrap")).toHaveCount(0);
  await expect(page.locator(".walk-book-pin-wrap")).toHaveCount(10);
  await page.locator("#show-ferry").check();
  await expect(page.locator(".walk-ferry-pin-wrap")).toHaveCount(1);
  await expect(page.locator(".walk-book-pin-wrap")).toHaveCount(10);
  await page.locator("#show-ferry").uncheck();
  await expect(page.locator(".walk-ferry-pin-wrap")).toHaveCount(0);
  await page.locator("#show-detours").check();
  await expect(page.locator(".walk-extra-pin-wrap")).toHaveCount(6);
});

test("a stop opens the correct map popup and the popup links back to its background", async ({
  page,
}) => {
  await openWalk(page);
  const card = page.locator("#walk-stop-waffles");
  await card.locator("summary").click();
  await card.getByRole("button", { name: "Find on map" }).click();
  await expect(page.locator(".leaflet-popup")).toContainText("178 Nathan Road");
  await page
    .locator(".leaflet-popup")
    .getByRole("button", { name: "Read this stop" })
    .click();
  await expect(card).toHaveAttribute("open", "");
  await expect(card.locator("summary")).toBeFocused();
  const query = new URL(
    await card
      .getByRole("link", { name: "Google Maps", exact: false })
      .getAttribute("href"),
  ).searchParams.get("query");
  expect(query).toContain("178 Nathan Road");
  expect(query).toContain("Tsim Sha Tsui");
});

test("visited progress survives reload, optional detours do not inflate it, and clearing leaves food favourites intact", async ({
  page,
}) => {
  await openWalk(page);
  await page.evaluate(() =>
    localStorage.setItem(
      "one-more-bite-saved",
      JSON.stringify(["mak-man-kee"]),
    ),
  );
  await page.locator('[data-visited="art"]').check();
  await page.locator("#walk-stop-clock summary").click();
  await page.locator('[data-visited="clock"]').check();
  await expect(page.locator("#walk-progress")).toHaveText(
    "1 of 10 book stops visited",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-visited="art"]')).toBeChecked();
  await expect(page.locator("#walk-progress-meter")).toHaveJSProperty(
    "value",
    1,
  );
  await page.locator("#reset-walk").click();
  await expect(page.locator("#walk-progress")).toHaveText(
    "0 of 10 book stops visited",
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("one-more-bite-saved")),
    ),
  ).toEqual(["mak-man-kee"]);
});

test("all backgrounds can expand and progress still works when local storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    }),
  );
  await openWalk(page);
  await page.locator("#expand-stops").click();
  await expect(page.locator(".walk-stop[open]")).toHaveCount(16);
  await page.locator('[data-visited="art"]').check();
  await expect(page.locator("#walk-progress")).toHaveText(
    "1 of 10 book stops visited",
  );
  await expect(page.locator("#walk-toast")).toContainText(
    "Browser storage is unavailable",
  );
  await page.locator("#expand-stops").click();
  await expect(page.locator(".walk-stop[open]")).toHaveCount(0);
});

test("the downloadable KML is valid XML with all stops and the walking and ferry lines", async ({
  page,
}) => {
  await openWalk(page);
  const pending = page.waitForEvent("download");
  await page.locator("#download-walk").click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("walk-kowloon.kml");
  const text = await readFile(await download.path(), "utf8");
  const result = await page.evaluate((xml) => {
    const parsed = new DOMParser().parseFromString(xml, "application/xml");
    const names = [...parsed.getElementsByTagName("Placemark")].map(
      (p) => p.getElementsByTagName("name")[0].textContent,
    );
    return {
      errors: parsed.getElementsByTagName("parsererror").length,
      points: parsed.getElementsByTagName("Point").length,
      lines: parsed.getElementsByTagName("LineString").length,
      book: names.filter((n) => /^(?:10|[1-9])\. /.test(n)).length,
      names,
    };
  }, text);
  expect(result.errors).toBe(0);
  expect(result.points).toBe(18);
  expect(result.lines).toBe(2);
  expect(result.book).toBe(10);
  expect(result.names.some((n) => n.includes("Mosque & Islamic Centre"))).toBe(
    true,
  );
  expect(text).toContain(`${walkStops[0].lng},${walkStops[0].lat},0`);
});

test("the walking page fits mobile, keeps pins in view after resize and handles unavailable tiles", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await openWalk(page);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const map = document.querySelector("#walk-map").getBoundingClientRect();
        return [
          ...document.querySelectorAll(".walk-pin-wrap,.walk-base-pin-wrap"),
        ].every((el) => {
          const pin = el.getBoundingClientRect();
          const x = pin.left + pin.width / 2,
            y = pin.top + pin.height / 2;
          return (
            x >= map.left && x <= map.right && y >= map.top && y <= map.bottom
          );
        });
      }),
    )
    .toBe(true);
  await expect(page.locator("#walk-map-error")).toBeVisible();
  await expect(page.locator(".walk-book-pin-wrap")).toHaveCount(10);
});
