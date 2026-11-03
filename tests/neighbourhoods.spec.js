import { test, expect } from "@playwright/test";
import { neighbourhoods, kinds } from "../neighbourhood-data.js";
import { directionsLink } from "../walk-utils.js";

test("each neighbourhood mixes exploring, local food, coffee and drinks with citations and usable route links", () => {
  expect(neighbourhoods.map((n) => n.id)).toEqual([
    "sham-shui-po",
    "sheung-wan",
    "sai-ying-pun",
    "wong-chuk-hang",
  ]);
  for (const area of neighbourhoods) {
    expect(new Set(area.places.map((p) => p.id)).size).toBe(area.places.length);
    expect(area.day).toHaveLength(4);
    const categories = new Set(
      area.places.flatMap((p) => [p.kind, ...(p.also || [])]),
    );
    for (const kind of ["streets", "art", "food", "coffee", "drinks"])
      expect(categories.has(kind)).toBe(true);
    const route = area.route.map((id) => area.places.find((p) => p.id === id));
    expect(route.every(Boolean)).toBe(true);
    expect(route.some((p) => p.kind === "food")).toBe(true);
    const url = new URL(directionsLink(route));
    expect(url.searchParams.get("travelmode")).toBe("walking");
    expect(
      url.searchParams.get("waypoints").split("|").length,
    ).toBeLessThanOrEqual(3);
    for (const p of area.places) {
      expect(p.lat).toBeGreaterThan(22.24);
      expect(p.lat).toBeLessThan(22.35);
      expect(p.lng).toBeGreaterThan(114.13);
      expect(p.lng).toBeLessThan(114.18);
      expect(p.sources.length).toBeGreaterThan(0);
      for (const s of p.sources) expect(new URL(s.url).protocol).toBe("https:");
      if (p.foodId) {
        expect(p.order.length).toBeGreaterThan(10);
        expect(p.budget).toContain("estimate");
      }
    }
  }
  // The generic tourism listing pins Winstons in Kennedy Town; keep this walk's SYP branch.
  const w = neighbourhoods[2].places.find((p) => p.id === "winstons");
  expect(w.address).toContain("213 Queen");
  expect(w.lng).toBeGreaterThan(114.135);
  expect(
    neighbourhoods[3].places.find((p) => p.id === "desarthe").address,
  ).toContain("Vita Tower");
});

async function openArea(page, id) {
  await page.goto(`/${id}.html`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".area-place-pin")).toHaveCount(
    neighbourhoods.find((n) => n.id === id).places.length,
  );
}

test("the hub is reachable from all existing tabs and opens all four day guides", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of ["/", "/racing.html", "/walk.html"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Neighbourhoods", exact: true })
      .click();
    await expect(page).toHaveURL(/neighbourhoods.html$/);
  }
  await expect(page.locator(".area-guide-card")).toHaveCount(4);
  await expect(page.locator(".area-hub-pin")).toHaveCount(4);
  await expect(page.locator(".area-hotel-pin")).toHaveCount(1);
  for (const area of neighbourhoods) {
    await page
      .getByRole("navigation", { name: "Neighbourhood guides" })
      .getByRole("link", { name: area.name, exact: true })
      .click();
    await expect(page.locator("h1")).toContainText(area.name);
    await expect(page.locator(".area-place")).toHaveCount(area.places.length);
    await expect(
      page
        .getByRole("navigation", { name: "Neighbourhood guides" })
        .getByRole("link", { name: area.name, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".area-timeline li")).toHaveCount(4);
  }
  expect(errors).toEqual([]);
});

test("food and drink filters keep the cards, count and map in sync, including the WCH cafe/bar", async ({
  page,
}) => {
  for (const area of neighbourhoods) {
    await openArea(page, area.id);
    for (const kind of ["food", "coffee", "drinks", "art", "all"]) {
      const count = area.places.filter(
        (p) => kind === "all" || p.kind === kind || p.also?.includes(kind),
      ).length;
      await page
        .getByRole("button", { name: kinds[kind], exact: true })
        .click();
      await expect(page.locator(".area-place:visible")).toHaveCount(count);
      await expect(page.locator(".area-place-pin")).toHaveCount(count);
      await expect(page.locator("#area-result-count")).toContainText(
        `${count} ${count === 1 ? "place" : "places"} on the map`,
      );
    }
  }
});

test("place-to-map selection opens the right branch and the popup returns focus to its card", async ({
  page,
}) => {
  await openArea(page, "sai-ying-pun");
  const card = page.locator("#place-ping-pong");
  await card.getByRole("button", { name: "Find on map" }).click();
  await expect(page.locator(".leaflet-popup")).toContainText(
    "129 Second Street",
  );
  await expect(card).toHaveClass(/selected/);
  await page
    .locator(".leaflet-popup")
    .getByRole("button", { name: "Read this place" })
    .click();
  await expect(card.locator("h3")).toBeFocused();
  const query = new URL(
    await card
      .getByRole("link", { name: "Google Maps", exact: false })
      .getAttribute("href"),
  ).searchParams.get("query");
  expect(query).toContain("129 Second Street");
  expect(query).toContain("Sai Ying Pun");
});

test("food-guide links land on the actual restaurant card and retain its full menu notes", async ({
  page,
}) => {
  await openArea(page, "sham-shui-po");
  await page
    .locator("#place-hop-yik-tai")
    .getByRole("link", { name: "Food-guide card" })
    .click();
  await expect(page).toHaveURL(/index.html#place-hop-yik-tai$/);
  const card = page.locator("#place-hop-yik-tai");
  await expect(card).toBeInViewport();
  await expect(card.locator("h3")).toHaveText("Hop Yik Tai");
  await expect(card.locator(".card-sources a")).not.toHaveCount(0);
});

test("transit links start at Eaton and further conversation leads stay separate from researched pins", async ({
  page,
}) => {
  await openArea(page, "wong-chuk-hang");
  const url = new URL(await page.locator(".area-facts a").getAttribute("href"));
  expect(url.searchParams.get("origin")).toContain("Eaton HK");
  expect(url.searchParams.get("travelmode")).toBe("transit");
  expect(url.searchParams.get("destination")).toContain("Wong Chuk Hang MTR");
  await expect(page.locator(".area-leads")).toContainText("PODIUM");
  await expect(page.locator(".area-leads")).toContainText("SC Gallery");
  await expect(page.locator(".area-place-pin")).toHaveCount(5);
  await expect(page.locator("#place-blindspot")).toContainText(
    "has not been independently verified",
  );
  await expect(page.locator("#place-desarthe")).toContainText(
    "Older guides list",
  );
});

test("the generated guides retain their food, venue and navigation links without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/sheung-wan.html");
    await expect(page.locator(".area-place")).toHaveCount(11);
    await expect(page.locator("#place-kau-kee")).toContainText(
      "ORDER SOMETHING LOCAL",
    );
    await expect(
      page.locator("#place-blue-supreme a").filter({ hasText: "Google Maps" }),
    ).toHaveAttribute("href", /Tung/);
    await expect(
      page.getByRole("navigation", { name: "Neighbourhood guides" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("the shared navigation and all guides fit small phones and tablets, and maps refit after resizing", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  for (const path of [
    "neighbourhoods",
    "sham-shui-po",
    "sheung-wan",
    "sai-ying-pun",
    "wong-chuk-hang",
  ]) {
    await page.goto(`/${path}.html`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".area-pin-wrap").first()).toBeVisible();
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(
        page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Neighbourhoods", exact: true }),
      ).toBeVisible();
    }
    await expect
      .poll(() =>
        page.evaluate(() => {
          const map = document
            .querySelector("#area-map")
            .getBoundingClientRect();
          return [
            ...document.querySelectorAll(".area-pin-wrap,.area-hotel-pin"),
          ].every((el) => {
            const p = el.getBoundingClientRect(),
              x = p.left + p.width / 2,
              y = p.top + p.height / 2;
            return (
              x >= map.left && x <= map.right && y >= map.top && y <= map.bottom
            );
          });
        }),
      )
      .toBe(true);
    await expect(page.locator("#area-map-error")).toBeVisible();
  }
});
