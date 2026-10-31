import { test, expect } from "@playwright/test";
import { createRacePlan, raceProgress } from "../race-engine.js";

test("either horse can win a fresh draw, including repeated winners", () => {
  expect(
    [0.1, 0.1, 0.9].map((draw) => createRacePlan(() => draw).winner),
  ).toEqual(["Willy", "Willy", "Gilly"]);
  expect(createRacePlan(() => 0.499999).winner).toBe("Willy");
  expect(createRacePlan(() => 0.5).winner).toBe("Gilly");
  for (const draw of [0, 0.25, 0.75, 0.99999]) {
    const plan = createRacePlan(() => draw);
    const winner = plan.horses.find((h) => h.name === plan.winner);
    const other = plan.horses.find((h) => h.name !== plan.winner);
    expect(winner.finishTime).toBeLessThan(other.finishTime);
    for (const horse of plan.horses) {
      let last = 0;
      for (let i = 0; i <= 100; i++) {
        const progress = raceProgress((horse.finishTime * i) / 100, horse);
        expect(progress).toBeGreaterThanOrEqual(last);
        expect(progress).toBeLessThanOrEqual(1);
        last = progress;
      }
      expect(raceProgress(horse.finishTime + 1, horse)).toBe(1);
    }
  }
});

test("the horses actually move, finish with the selected winner, and unlock replay", async ({
  page,
}) => {
  await page.goto("/racing.html");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.locator("#start-race").click();
  await expect(page.locator("#start-race")).toBeDisabled();
  await page.locator("#start-race").dispatchEvent("click");
  await expect
    .poll(async () =>
      Number(await page.locator("#horse-willy").getAttribute("data-progress")),
    )
    .toBeGreaterThan(0);
  await expect(page.locator("#race-count")).toHaveText("1", { timeout: 12000 });
  await expect(page.locator("#race-result")).toHaveAttribute(
    "data-winner",
    /^(Willy|Gilly)$/,
  );
  const winner = await page.locator("#race-result").getAttribute("data-winner");
  await expect(page.locator(`#${winner.toLowerCase()}-wins`)).toHaveText("1");
  await expect(page.locator("#start-race")).toBeEnabled();
  expect(
    Number(await page.locator("#willy-wins").innerText()) +
      Number(await page.locator("#gilly-wins").innerText()),
  ).toBe(1);
  expect(errors).toEqual([]);
});

test("reduced motion resolves immediately and replay updates the scoreboard once per race", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/racing.html");
  for (let i = 1; i <= 5; i++) {
    await page.locator("#start-race").click();
    await expect(page.locator("#race-count")).toHaveText(String(i));
    await expect(page.locator("#start-race")).toBeEnabled();
    expect(
      Number(await page.locator("#willy-wins").innerText()) +
        Number(await page.locator("#gilly-wins").innerText()),
    ).toBe(i);
    await expect(page.locator("#race-status")).toContainText("wins!");
  }
});

test("racing guide and mini-course fit a narrow mobile screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/racing.html");
  await expect(page.locator("#mini-course")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Food guide" }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#start-race").click();
  await expect(page.locator("#race-count")).toHaveText("1");
});
