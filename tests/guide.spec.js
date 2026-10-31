import { test, expect } from "@playwright/test";
import { restaurants, hotel } from "../data.js";

test("every researched stop has citations, a unique ID, useful price range, HK coordinates and an address", () => {
  expect(restaurants).toHaveLength(34);
  expect(new Set(restaurants.map((r) => r.id)).size).toBe(34);
  for (const r of restaurants) {
    expect(r.address.length).toBeGreaterThan(5);
    expect(r.lat).toBeGreaterThan(22.2);
    expect(r.lat).toBeLessThan(22.4);
    expect(r.lng).toBeGreaterThan(114.1);
    expect(r.lng).toBeLessThan(114.3);
    expect(r.low).toBeLessThan(r.high);
    expect(r.order.length).toBeGreaterThan(10);
    expect(r.verification).toBe("researched");
    expect(r.citations.length).toBeGreaterThan(0);
    expect(r.checkedOn).toBe("2026-10-31");
    for (const source of r.citations) {
      expect(new URL(source.url).protocol).toBe("https:");
      expect(source.publisher.length).toBeGreaterThan(3);
      expect(source.title.length).toBeGreaterThan(5);
    }
  }
  expect(hotel.name).toBe("Eaton HK");
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders all restaurants, hotel and map markers with no runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload();
  await expect(page.locator(".restaurant-card")).toHaveCount(
    restaurants.length,
  );
  await expect(page.locator(".food-marker")).toHaveCount(restaurants.length);
  await expect(page.locator(".hotel-marker")).toHaveCount(1);
  await expect(page.locator("#total-count")).toHaveText(
    String(restaurants.length),
  );
  expect(errors).toEqual([]);
});

test("search finds dishes and Chinese names and keeps markers in sync", async ({
  page,
}) => {
  await page.getByRole("searchbox").fill("澳洲");
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await expect(page.locator(".food-marker")).toHaveCount(1);
  await expect(page.locator(".restaurant-card h3")).toHaveText(
    "Australia Dairy Company",
  );
  await page.getByRole("searchbox").fill("shrimp roe");
  await expect(page.locator(".restaurant-card")).toHaveCount(2);
});

test("food and neighbourhood filters combine and empty results can reset", async ({
  page,
}) => {
  await page.locator("#area").selectOption("Jordan");
  await page.getByRole("button", { name: "Sweet things", exact: true }).click();
  await expect(page.locator(".restaurant-card")).toHaveCount(2);
  await page.getByRole("searchbox").fill("Kai Kai");
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await expect(page.locator(".restaurant-card h3")).toHaveText(
    "Kai Kai Dessert",
  );
  await page.getByRole("searchbox").fill("no-such-restaurant");
  await expect(page.locator("#empty")).toBeVisible();
  await expect(page.locator(".food-marker")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".restaurant-card")).toHaveCount(
    restaurants.length,
  );
});

test("Near Eaton excludes distant places and offers walking directions from the hotel", async ({
  page,
}) => {
  await page.locator("#near-toggle").click();
  const count = await page.locator(".restaurant-card").count();
  expect(count).toBeGreaterThanOrEqual(6);
  expect(count).toBeLessThan(15);
  await expect(page.locator(".restaurant-card")).toHaveCount(
    await page.locator(".near-badge").count(),
  );
  await expect(
    page.getByRole("heading", { name: "Kau Kee", exact: true }),
  ).toHaveCount(0);
  const href = await page
    .locator(".directions-link")
    .first()
    .getAttribute("href");
  const url = new URL(href);
  expect(url.hostname).toBe("www.google.com");
  expect(url.searchParams.get("origin")).toContain("Eaton HK");
  expect(url.searchParams.get("travelmode")).toBe("walking");
});

test("saved places persist after reload, and can be removed from the saved filter", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Save Australia Dairy Company", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Unsave Australia Dairy Company",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator("#saved-toggle").click();
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Unsave Australia Dairy Company",
      exact: true,
    })
    .click();
  await expect(page.locator("#empty")).toBeVisible();
});

test("cards select the matching map pin and Google Maps links specify the exact branch", async ({
  page,
}) => {
  const card = page.locator("#place-kam-wah");
  await card.getByRole("button", { name: "Find on map", exact: true }).click();
  await expect(page.locator(".leaflet-popup")).toBeVisible();
  await expect(page.locator(".leaflet-popup h3")).toHaveText("Kam Wah Cafe");
  const link = await card
    .getByRole("link", { name: "Google Maps" })
    .getAttribute("href");
  const url = new URL(link);
  expect(url.searchParams.get("query")).toContain("45–47 Bute Street");
  expect(url.searchParams.get("query")).toContain("Hong Kong");
});

test("price sort changes the list and week-plan buttons open the right restaurant", async ({
  page,
}) => {
  await page.locator("#sort").selectOption("price");
  await expect(
    page.locator(".restaurant-card").first().locator("h3"),
  ).toHaveText("Mrs. Fong Chinese Desserts");
  await page
    .locator("#week")
    .getByRole("button", { name: "Kam’s Roast Goose" })
    .click();
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await expect(page.locator(".restaurant-card h3")).toHaveText(
    "Kam’s Roast Goose",
  );
});

test("blocked map tiles display a useful fallback without breaking the list", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.reload();
  await expect(page.locator("#map-error")).toBeVisible();
  await expect(page.locator(".food-marker")).toHaveCount(restaurants.length);
  await expect(page.locator(".restaurant-card")).toHaveCount(
    restaurants.length,
  );
});

test("unavailable browser storage does not prevent browsing or saving for the visit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Save Australia Dairy Company", exact: true })
    .click();
  await expect(page.locator("#toast")).toContainText(
    "Browser storage is unavailable",
  );
  await page.locator("#saved-toggle").click();
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
});

test("mobile layout stays within the viewport and map/card interaction works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.locator("#near-toggle").click();
  await page
    .locator(".restaurant-card")
    .first()
    .getByRole("button", { name: "Find on map", exact: true })
    .click();
  await expect(page.locator(".leaflet-popup")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("production assets work under the nested GitHub Pages project path", async ({
  page,
}) => {
  const { createServer } = await import("node:http");
  const { readFile } = await import("node:fs/promises");
  const { resolve, extname } = await import("node:path");
  const root = resolve("dist");
  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, "http://localhost").pathname;
      if (!pathname.startsWith("/hongkong-trip/")) {
        res.writeHead(404);
        res.end();
        return;
      }
      const file = resolve(
        root,
        pathname.slice("/hongkong-trip/".length) || "index.html",
      );
      if (!file.startsWith(root + "/")) {
        res.writeHead(403);
        res.end();
        return;
      }
      const body = await readFile(file);
      const type =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".png": "image/png",
        }[extname(file)] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const missing = [];
  page.on("response", (r) => {
    if (r.url().startsWith("http://127.0.0.1") && r.status() >= 400)
      missing.push(r.url());
  });
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/hongkong-trip/`);
    await expect(page.locator(".restaurant-card")).toHaveCount(
      restaurants.length,
    );
    await page.getByRole("searchbox").fill("Kai Kai");
    await expect(page.locator(".restaurant-card")).toHaveCount(1);
    expect(missing).toEqual([]);
  } finally {
    const closed = new Promise((done) => server.close(done));
    server.closeAllConnections();
    await closed;
  }
});

test("source links are visible on every card and relocated restaurants use their current branches", async ({
  page,
}) => {
  await expect(page.locator(".card-sources")).toHaveCount(restaurants.length);
  for (const id of ["kai-kai", "wang-fu", "keung-kee"]) {
    const restaurant = restaurants.find((r) => r.id === id);
    const card = page.locator(`#place-${id}`);
    await expect(card.locator(".card-address")).toContainText(
      restaurant.address,
    );
    const href = await card
      .getByRole("link", { name: "Google Maps", exact: false })
      .getAttribute("href");
    expect(new URL(href).searchParams.get("query")).toContain(
      restaurant.address,
    );
    await expect(card.locator(".card-sources a")).toHaveCount(
      restaurant.citations.length,
    );
  }
  await expect(page.locator("#place-kai-kai .card-address")).toContainText(
    "113–115 Parkes Street",
  );
  await expect(page.locator("#place-wang-fu .card-address")).toContainText(
    "168 Wellington Street",
  );
  await expect(page.locator("#place-keung-kee .card-address")).toContainText(
    "406 Lockhart Road",
  );
});
