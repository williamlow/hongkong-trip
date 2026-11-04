import { test, expect } from "@playwright/test";
import {
  RACE_RULES,
  createRace,
  triangleMeter,
  timingAccuracy,
  meterValue,
  horseSpeed,
  strike,
  recover,
  advanceRace,
} from "../race-engine.js";

function playStrongPlayer(index) {
  const race = createRace({ random: () => 0.5 });
  for (let i = 0; i < 20000 && race.status === "running"; i++) {
    advanceRace(race, 10);
    const h = race.horses[index];
    if (h.injured) recover(race, index);
    else if (
      race.time >= h.readyAt &&
      Math.abs(meterValue(race, h) - 0.5) < 0.015
    )
      strike(race, index);
  }
  return race;
}
test("the meter bounces and closer-to-centre timing produces more pace, with a cooldown against mashing", () => {
  const cycle = RACE_RULES.meterCycleMs;
  expect(
    [0, cycle / 4, cycle / 2, (cycle * 3) / 4, cycle].map((t) =>
      triangleMeter(t),
    ),
  ).toEqual([0, 0.5, 1, 0.5, 0]);
  expect([0, 0.25, 0.5, 0.75, 1].map(timingAccuracy)).toEqual([
    0, 0.5, 1, 0.5, 0,
  ]);
  const edge = createRace({ random: () => 0 }),
    centre = createRace({ random: () => 0 });
  const hit = strike(edge, 0);
  expect(hit.accuracy).toBe(0);
  expect(strike(edge, 0).accepted).toBe(false);
  expect(edge.horses[0].strikes).toBe(1);
  advanceRace(centre, cycle / 4);
  expect(strike(centre, 0).accuracy).toBeCloseTo(1);
  expect(horseSpeed(centre, centre.horses[0])).toBeGreaterThan(
    horseSpeed(edge, edge.horses[0]),
  );
  expect(horseSpeed(edge, edge.horses[0])).toBeLessThan(RACE_RULES.baseSpeed);
  const locked = meterValue(centre, centre.horses[0]);
  advanceRace(centre, 500);
  expect(meterValue(centre, centre.horses[0])).toBe(locked);
  expect(strike(centre, 0).accepted).toBe(false);
  advanceRace(centre, 400);
  expect(meterValue(centre, centre.horses[0])).toBeCloseTo(0);
  expect(strike(centre, 0).accepted).toBe(true);
});

test("either player can earn a four-lap win through timing and recovery; a winner is not drawn at the start", () => {
  for (const index of [0, 1]) {
    const race = playStrongPlayer(index);
    expect(race.laps).toBe(4);
    expect(race.status).toBe("finished");
    expect(race.winners).toEqual([index]);
    expect(race.horses[index].progress).toBe(4);
    expect(race.horses[index].strikes).toBeGreaterThan(10);
    expect(race.horses[index].recoveries).toBe(2);
  }
  const a = createRace({ random: () => 0.1 }),
    b = createRace({ random: () => 0.9 });
  expect(a.winners).toEqual([]);
  expect(a.horses[0].injuries).not.toEqual(b.horses[0].injuries);
});

test("injuries slow only their horse, recover clears the penalty, and unattended injuries clear after eight seconds", () => {
  const race = createRace({ random: () => 0 });
  advanceRace(race, 23000);
  expect(race.horses.every((h) => h.injured)).toBe(true);
  const slow = horseSpeed(race, race.horses[1]);
  expect(recover(race, 0)).toBe(true);
  expect(recover(race, 0)).toBe(false);
  expect(race.horses[0].injured).toBe(false);
  expect(race.horses[1].injured).toBe(true);
  expect(horseSpeed(race, race.horses[0])).toBeGreaterThan(slow);
  expect(strike(race, 1).accepted).toBe(false);
  advanceRace(race, 8000);
  expect(race.horses[1].injured).toBe(false);
  expect(race.horses[1].autoRecoveries).toBe(1);
});

test("the finish compares crossing times inside a frame, handles genuine draws, and never moves after finishing", () => {
  const race = createRace({ random: () => 0 });
  race.horses[0].progress = 3.9998;
  race.horses[1].progress = 3.9999;
  advanceRace(race, 100);
  expect(race.winners).toEqual([1]);
  expect(race.horses[0].progress).toBeLessThan(4);
  const snapshot = JSON.stringify(race);
  advanceRace(race, 100000);
  expect(JSON.stringify(race)).toBe(snapshot);
  const draw = createRace({ random: () => 0 });
  draw.horses.forEach((h) => (h.progress = 3.9999));
  advanceRace(draw, 100);
  expect(draw.winners).toEqual([0, 1]);
});

async function openGame(page, { reduced = false } = {}) {
  await page.clock.install({ time: new Date("2026-11-04T04:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-04T04:00:01Z"));
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await page.goto("/race-game.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#start-race")).toBeEnabled();
}
async function startGame(page) {
  await page.locator("#start-race").click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "countdown",
  );
  await page.clock.runFor(3050);
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "racing",
  );
}

test("the visitor guide links to the separate game and keeps its schedule without any old race controls", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/racing.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#fixture-note")).not.toBeEmpty();
  await expect(page.locator("#start-race")).toHaveCount(0);
  await page.getByRole("link", { name: "Play the two-player race" }).click();
  await expect(page).toHaveURL(/race-game.html#race-arena$/);
  await expect(page.locator("#start-race")).toBeEnabled();
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Race game", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  expect(errors).toEqual([]);
});

test("two players have independent timing hits and held keyboard repeats cannot fire a stride", async ({
  page,
}) => {
  await openGame(page);
  await startGame(page);
  await page.clock.runFor(300);
  await page.dispatchEvent("body", "keydown", { code: "KeyA", repeat: true });
  await expect(page.locator("#feedback-willy")).toHaveText(
    "Aim for the centre line.",
  );
  await page.keyboard.press("a");
  await expect(page.locator("#stride-willy")).toBeDisabled();
  await expect(page.locator("#stride-gilly")).toBeEnabled();
  const locked = await page.locator("#meter-willy").getAttribute("data-value");
  const other = await page.locator("#meter-gilly").getAttribute("data-value");
  await page.clock.runFor(200);
  expect(await page.locator("#meter-willy").getAttribute("data-value")).toBe(
    locked,
  );
  expect(
    await page.locator("#meter-gilly").getAttribute("data-value"),
  ).not.toBe(other);
  await page.keyboard.press("k");
  await expect(page.locator("#stride-gilly")).toBeDisabled();
  await expect(page.locator("#feedback-gilly")).toContainText("accuracy");
  expect(
    Number(await page.locator("#horse-willy").getAttribute("data-progress")),
  ).toBeGreaterThan(0);
  await page.clock.runFor(901);
  await expect(page.locator("#stride-willy")).toBeEnabled();
});

test("both touch panels accept separate simultaneous pointers", async ({
  page,
}) => {
  await openGame(page);
  await startGame(page);
  await page.clock.runFor(300);
  await page.locator("#stride-willy").dispatchEvent("pointerdown", {
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    isPrimary: true,
  });
  await page.locator("#stride-gilly").dispatchEvent("pointerdown", {
    pointerId: 2,
    pointerType: "touch",
    button: 0,
    isPrimary: false,
  });
  await expect(page.locator("#feedback-willy")).toContainText("accuracy");
  await expect(page.locator("#feedback-gilly")).toContainText("accuracy");
  await expect(page.locator("#stride-willy")).toBeDisabled();
  await expect(page.locator("#stride-gilly")).toBeDisabled();
});

test("injury alerts enable the separate recovery controls for the correct horse", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(crypto, "getRandomValues", {
      value: (array) => {
        array.fill(0);
        return array;
      },
    }),
  );
  await openGame(page);
  await startGame(page);
  await page.clock.runFor(23000);
  await expect(page.locator("#recover-willy")).toBeEnabled();
  await expect(page.locator("#recover-gilly")).toBeEnabled();
  await expect(page.locator("#stride-willy")).toBeDisabled();
  await page.keyboard.press("s");
  await expect(page.locator("#recover-willy")).toBeDisabled();
  await expect(page.locator("#recover-gilly")).toBeEnabled();
  await expect(page.locator("#stride-willy")).toBeEnabled();
  await expect(page.locator("#feedback-willy")).toContainText("Recovered!");
  await page.keyboard.press("p");
  await expect(page.locator("#recover-gilly")).toBeDisabled();
  await expect(page.locator("#alert-gilly")).toHaveText("Paused");
  await page.keyboard.press("p");
  await expect(page.locator("#recover-gilly")).toBeEnabled();
  await page.keyboard.press("l");
  await expect(page.locator("#recover-gilly")).toBeDisabled();
  await expect(page.locator("#stride-gilly")).toBeEnabled();
});

test("pause, hidden-window pause and restart preserve fair timing and do not award unfinished races", async ({
  page,
}) => {
  await openGame(page);
  await startGame(page);
  await page.clock.runFor(1000);
  await page.keyboard.press("p");
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "paused",
  );
  const before = await page.locator("#horse-willy").getAttribute("data-laps");
  await page.clock.runFor(10000);
  await page.keyboard.press("a");
  expect(await page.locator("#horse-willy").getAttribute("data-laps")).toBe(
    before,
  );
  await page.locator("#pause-race").click();
  await page.clock.runFor(1000);
  expect(await page.locator("#horse-willy").getAttribute("data-laps")).not.toBe(
    before,
  );
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "paused",
  );
  await expect(page.locator("#race-status")).toContainText("window is away");
  await page.locator("#restart-race").click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "countdown",
  );
  await expect(page.locator("#horse-willy")).toHaveAttribute(
    "data-laps",
    "0.00000",
  );
  await expect(page.locator("#race-count")).toHaveText("0");
});

test("four-lap finishes score once, replay resets the race and scores include draws", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.addInitScript(() =>
    Object.defineProperty(crypto, "getRandomValues", {
      value: (array) => {
        array.fill(0);
        return array;
      },
    }),
  );
  await openGame(page);
  await startGame(page);
  await page.clock.runFor(90000);
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "finished",
  );
  await expect(page.locator("#race-result")).toHaveAttribute(
    "data-winner",
    "draw",
  );
  await expect(page.locator("#race-count")).toHaveText("1");
  await expect(page.locator("#draw-count")).toHaveText("1");
  await expect(page.locator("#start-race")).toBeEnabled();
  await page.clock.runFor(10000);
  await expect(page.locator("#race-count")).toHaveText("1");
  await startGame(page);
  await expect(page.locator("#race-count")).toHaveText("1");
  await expect(page.locator("#draw-count")).toHaveText("1");
  await expect(page.locator("body")).toHaveAttribute(
    "data-game-phase",
    "racing",
  );
  await expect(page.locator("#race-result")).not.toHaveAttribute("data-winner");
  await expect(page.locator("#start-race")).toBeDisabled();
});

test("reduced motion keeps two-player play, defaults to gentle meters and removes decorative galloping", async ({
  page,
}) => {
  await openGame(page, { reduced: true });
  await expect(page.locator("#meter-speed")).toHaveValue("2800");
  await startGame(page);
  await page.clock.runFor(500);
  expect(
    Number(await page.locator("#horse-willy").getAttribute("data-progress")),
  ).toBeGreaterThan(0);
  await expect(page.locator("#race-count")).toHaveText("0");
  expect(
    await page
      .locator("#horse-willy use")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await expect(page.locator("#meter-speed")).toBeDisabled();
  await page.keyboard.press("a");
  await expect(page.locator("#feedback-willy")).toContainText("accuracy");
});

test("the seven-tab header, course and side-by-side controls fit phones and tablets", async ({
  page,
}) => {
  await page.goto("/race-game.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#start-race")).toBeEnabled();
  for (const width of [320, 390, 768, 1152, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Race game", exact: true }),
    ).toBeVisible();
    const boxes = await page.locator(".player-panel").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right };
      }),
    );
    expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(1);
    expect(boxes[0].right).toBeLessThan(boxes[1].left);
  }
});
