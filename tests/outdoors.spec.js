import { test, expect } from "@playwright/test";
import {
  dayTrips,
  hikes,
  filterDayTrips,
  filterHikes,
  laiChiWoLead,
  liveLinks,
} from "../outdoors-data.js";

test("the two shortlists have cited plans, explicit return/access notes and valid Hong Kong map references", () => {
  expect(dayTrips).toHaveLength(7);
  expect(hikes).toHaveLength(5);
  for (const list of [dayTrips, hikes]) {
    expect(new Set(list.map((p) => p.id)).size).toBe(list.length);
    expect(list.map((p) => p.number)).toEqual(list.map((_, i) => i + 1));
    for (const p of list) {
      expect(p.lat).toBeGreaterThan(22.2);
      expect(p.lat).toBeLessThan(22.6);
      expect(p.lng).toBeGreaterThan(113.8);
      expect(p.lng).toBeLessThan(114.4);
      expect(p.sources.length).toBeGreaterThan(0);
      for (const s of p.sources) {
        expect(new URL(s.url).protocol).toBe("https:");
        expect(s.accessed).toBe("2026-11-03");
      }
      expect(p.food.length).toBeGreaterThan(50);
    }
  }
  for (const p of dayTrips) {
    expect(p.return.length).toBeGreaterThan(70);
    expect(p.fallback.length).toBeGreaterThan(50);
    expect(p.heat.length).toBeGreaterThan(80);
  }
  for (const h of hikes) {
    expect(h.route).toHaveLength(3);
    expect(h.distanceNote.length).toBeGreaterThan(80);
    expect(h.exit.length).toBeGreaterThan(70);
    expect(h.skip.length).toBeGreaterThan(70);
    expect(h.start.lat).toBe(h.lat);
  }
  // Reject the similarly named geocoder results in Kwai Chung and the reserve centroid.
  const hoi = dayTrips.find((p) => p.id === "hoi-ha");
  expect(hoi.lat).toBeGreaterThan(22.45);
  expect(hoi.lng).toBeGreaterThan(114.32);
  expect(hikes.find((p) => p.id === "tai-po-kau").start.lat).toBeGreaterThan(
    22.43,
  );
});

test("filters preserve the difference between simpler weekday logistics, confirmed boats, woodland and downhill", () => {
  expect(filterDayTrips("weekday").map((p) => p.id)).toEqual([
    "peng-chau",
    "hoi-ha",
    "mui-wo",
    "tai-o",
    "kadoorie",
  ]);
  expect(filterDayTrips("boat")).toHaveLength(4);
  expect(filterDayTrips("short")).toHaveLength(3);
  expect(filterHikes("wooded")).toHaveLength(4);
  expect(filterHikes("downhill").map((h) => h.id)).toEqual([
    "pok-fu-lam",
    "tai-tam",
  ]);
  expect(filterHikes("short").map((h) => h.id)).toEqual([
    "pineapple-dam",
    "tai-po-kau",
  ]);
  expect(laiChiWoLead.status).toContain("unconfirmed");
  expect(laiChiWoLead.text).toContain("Area 77");
  expect(laiChiWoLead.caution).toContain("closed-area-permit");
  for (const url of Object.values(liveLinks))
    expect(new URL(url).protocol).toBe("https:");
});
async function openPage(page, kind) {
  await page.goto(kind === "trips" ? "/day-trips.html" : "/hikes.html", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator(".outdoor-pin-wrap")).toHaveCount(
    kind === "trips" ? 7 : 5,
  );
}

test("all existing sections expose the seven-tab navigation and both new pages load without runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of [
    "/",
    "/racing.html",
    "/walk.html",
    "/neighbourhoods.html",
    "/sham-shui-po.html",
    "/sheung-wan.html",
    "/sai-ying-pun.html",
    "/wong-chuk-hang.html",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link")).toHaveCount(7);
    await expect(
      nav.getByRole("link", { name: "Day trips", exact: true }),
    ).toHaveAttribute("href", "./day-trips.html");
    await expect(
      nav.getByRole("link", { name: "Hikes", exact: true }),
    ).toHaveAttribute("href", "./hikes.html");
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Day trips", exact: true })
    .click();
  await expect(page.locator(".trip-card")).toHaveCount(7);
  await expect(page.locator(".outdoor-trip-pin")).toHaveCount(7);
  await expect(page.locator(".outdoor-hotel-pin")).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Hikes", exact: true })
    .click();
  await expect(page.locator(".hike-card")).toHaveCount(5);
  await expect(page.locator(".outdoor-hike-pin")).toHaveCount(5);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Hikes", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  expect(errors).toEqual([]);
});

test("day-trip filters keep the cards, destination markers and result count in sync", async ({
  page,
}) => {
  await openPage(page, "trips");
  for (const [label, count] of [
    ["Easier weekday logistics", 5],
    ["Boat days", 4],
    ["Shorter strolls", 3],
    ["All seven", 7],
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator(".trip-card:not([hidden])")).toHaveCount(count);
    await expect(page.locator(".outdoor-trip-pin")).toHaveCount(count);
    await expect(page.locator("#outdoor-count")).toHaveText(
      `${count} day trips shown`,
    );
  }
});

test("a comparison link restores a filtered-out trip and opens its full day/return plan", async ({
  page,
}) => {
  await openPage(page, "trips");
  await page
    .getByRole("button", { name: "Easier weekday logistics", exact: true })
    .click();
  await expect(page.locator("#trip-yim-tin-tsai")).toBeHidden();
  await page
    .locator("#trip-comparison")
    .getByRole("link", { name: "2. Yim Tin Tsai", exact: true })
    .click();
  await expect(page.locator("#trip-yim-tin-tsai")).toHaveAttribute("open", "");
  await expect(page.locator("#trip-yim-tin-tsai summary")).toBeFocused();
  await expect(page.locator("#outdoor-count")).toHaveText("7 day trips shown");
  await expect(page.locator("#trip-yim-tin-tsai")).toContainText(
    "Tuesday–Sunday",
  );
});

test("hike filters show the intended profiles and a one-way selection adds the correct finish reference", async ({
  page,
}) => {
  await openPage(page, "hikes");
  await page
    .getByRole("button", { name: "Mostly downhill", exact: true })
    .click();
  await expect(page.locator(".outdoor-hike-pin")).toHaveCount(2);
  const card = page.locator("#hike-pok-fu-lam");
  await card.locator("summary").click();
  await card.getByRole("button", { name: "See start & finish" }).click();
  await expect(page.locator(".outdoor-end-pin")).toHaveCount(1);
  await expect(page.locator(".leaflet-popup")).toContainText("The Peak");
  await expect(page.locator("#outdoor-map-key")).toContainText(
    "E = approximate finish",
  );
  await page
    .locator(".leaflet-popup")
    .getByRole("button", { name: "Read this walk" })
    .click();
  await expect(card.locator("summary")).toBeFocused();
  const start = new URL(
    await card
      .getByRole("link", { name: "Start on Maps", exact: false })
      .getAttribute("href"),
  );
  expect(start.searchParams.get("query")).toContain("Peak Galleria");
  const finish = new URL(
    await card
      .getByRole("link", { name: "Finish on Maps", exact: false })
      .getAttribute("href"),
  );
  expect(finish.searchParams.get("query")).toContain("Pok Fu Lam Road");
  await page
    .getByRole("button", { name: "Shortest plans", exact: true })
    .click();
  await expect(page.locator(".outdoor-end-pin")).toHaveCount(0);
  await expect(page.locator(".outdoor-hike-pin")).toHaveCount(2);
  await expect(page.locator("#hike-pok-fu-lam")).toBeHidden();
  await page
    .getByRole("button", { name: "Mostly wooded", exact: true })
    .click();
  await expect(page.locator(".outdoor-hike-pin")).toHaveCount(4);
});

test("high-start taxi directions, published ferry leads and live-condition uncertainty stay explicit", async ({
  page,
}) => {
  await openPage(page, "hikes");
  const tam = page.locator("#hike-tai-tam");
  await tam.locator("summary").click();
  const taxi = new URL(
    await tam
      .getByRole("link", { name: "Taxi route to high start" })
      .getAttribute("href"),
  );
  expect(taxi.searchParams.get("travelmode")).toBe("driving");
  expect(taxi.searchParams.get("origin")).toContain("Eaton HK");
  await expect(tam).toContainText("not an equivalent");
  await expect(page.locator(".outdoor-weather")).toContainText(
    "were not verified",
  );
  await expect(page.locator("#hike-pineapple-dam")).toContainText("0.8 km");
  await expect(page.locator("#hike-pineapple-dam")).toContainText("1.6–2 km");
  await page.goto("/day-trips.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#lai-chi-wo")).toContainText(
    "current sailings unconfirmed",
  );
  await expect(page.locator("#lai-chi-wo")).toContainText("closed-area-permit");
});

test("the day plans, food notes and hiking limitations remain readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/day-trips.html", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(".trip-card")).toHaveCount(7);
    await page.locator("#trip-mui-wo summary").click();
    await expect(page.locator("#trip-mui-wo")).toContainText("Wah Kee");
    await page.goto("http://127.0.0.1:4173/hikes.html", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(".hike-card")).toHaveCount(5);
    await page.locator("#hike-tai-tam summary").click();
    await expect(page.locator("#hike-tai-tam")).toContainText(
      "Wong Nai Chung Gap",
    );
    await expect(page.locator("#not-this-time article")).toHaveCount(5);
  } finally {
    await context.close();
  }
});

test("new pages fit phones and tablets, keep the map pins in view and recover from blocked tiles", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (r) => r.abort());
  for (const kind of ["trips", "hikes"]) {
    await openPage(page, kind);
    await expect(page.locator("#outdoor-map-error")).toBeVisible();
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(
        page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Day trips", exact: true }),
      ).toBeVisible();
      await expect(
        page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Hikes", exact: true }),
      ).toBeVisible();
    }
    await expect
      .poll(() =>
        page.evaluate(() => {
          const m = document
            .querySelector("#outdoor-map")
            .getBoundingClientRect();
          return [
            ...document.querySelectorAll(
              ".outdoor-pin-wrap,.outdoor-hotel-pin",
            ),
          ].every((el) => {
            const p = el.getBoundingClientRect(),
              x = p.left + p.width / 2,
              y = p.top + p.height / 2;
            return x >= m.left && x <= m.right && y >= m.top && y <= m.bottom;
          });
        }),
      )
      .toBe(true);
  }
});
