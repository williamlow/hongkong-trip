import { createRacePlan, raceProgress } from "./race-engine.js";
import { racingSchedule } from "./racing-data.js";

const $ = (selector) => document.querySelector(selector);
const names = ["Willy", "Gilly"];
const paths = [$("#lane-willy"), $("#lane-gilly")];
const runners = [$("#horse-willy"), $("#horse-gilly")];
const scores = { Willy: 0, Gilly: 0 };
let completed = 0;
let running = false;
let frame;

function position(index, progress, laps = 2) {
  const path = paths[index];
  const length = path.getTotalLength();
  const distance = ((progress * laps) % 1) * length;
  const point = path.getPointAtLength(distance);
  const ahead = path.getPointAtLength((distance + 2) % length);
  const facing = ahead.x >= point.x ? 1 : -1;
  runners[index].setAttribute("transform", `translate(${point.x} ${point.y})`);
  runners[index]
    .querySelector(".horse-body")
    .setAttribute("transform", `scale(${facing} 1)`);
  runners[index].dataset.progress = progress.toFixed(4);
}

function announceWinner(plan) {
  $("#race-status").textContent =
    `${plan.winner} wins! Every new race is another 50/50 draw.`;
  $("#race-result").textContent = `${plan.winner} takes the honours`;
  $("#race-result").dataset.winner = plan.winner;
  $("#race-result").classList.add("has-result");
}

function finish(plan) {
  running = false;
  scores[plan.winner]++;
  completed++;
  $("#willy-wins").textContent = scores.Willy;
  $("#gilly-wins").textContent = scores.Gilly;
  $("#race-count").textContent = completed;
  $("#start-race").disabled = false;
  $("#start-race").textContent = "Race again ↗";
}

$("#start-race").addEventListener("click", () => {
  if (running) return;
  running = true;
  cancelAnimationFrame(frame);
  const plan = createRacePlan();
  $("#start-race").disabled = true;
  $("#start-race").textContent = "Racing…";
  $("#race-status").textContent =
    "They’re off! Willy and Gilly are racing two laps.";
  $("#race-result").textContent = "Two laps. Two hopefuls. One winner.";
  $("#race-result").classList.remove("has-result");
  delete $("#race-result").dataset.winner;
  names.forEach((_, i) => position(i, 0, plan.laps));
  $("#race-timer").textContent = "0.0";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    names.forEach((_, i) => position(i, 1, plan.laps));
    $("#race-timer").textContent = "—";
    announceWinner(plan);
    finish(plan);
    return;
  }
  const start = performance.now();
  let announced = false;
  const tick = (now) => {
    const elapsed = now - start;
    let allFinished = true;
    plan.horses.forEach((horse, index) => {
      const progress = raceProgress(elapsed, horse);
      position(index, progress, plan.laps);
      if (progress < 1) allFinished = false;
    });
    $("#race-timer").textContent = (elapsed / 1000).toFixed(1);
    const winningHorse = plan.horses.find(
      (horse) => horse.name === plan.winner,
    );
    if (!announced && elapsed >= winningHorse.finishTime) {
      announceWinner(plan);
      announced = true;
    }
    if (allFinished) finish(plan);
    else frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
});

names.forEach((_, i) => position(i, 0));

// The calendar is stored with an explicit check date; it is never invented or
// assumed to repeat weekly when official fixture data has not been verified.
$("#fixture-note").textContent = racingSchedule.note;
if (racingSchedule.verifiedOn && racingSchedule.fixtures.length) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const upcoming = racingSchedule.fixtures
    .filter((f) => f.date >= today)
    .slice(0, 6);
  $("#fixture-panel h3").textContent = upcoming.length
    ? "Upcoming Happy Valley meetings"
    : "Check the latest official calendar";
  if (upcoming.length) {
    const table = document.createElement("table");
    table.className = "fixture-table";
    table.innerHTML =
      '<caption class="sr-only">Happy Valley fixtures, in Hong Kong time</caption><thead><tr><th scope="col">Date · Hong Kong time</th><th scope="col">Meeting</th><th scope="col">First race</th></tr></thead>';
    const tbody = document.createElement("tbody");
    for (const fixture of upcoming) {
      const row = document.createElement("tr");
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Hong_Kong",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(fixture.date + "T12:00:00+08:00"));
      for (const text of [
        date,
        fixture.type || "Happy Valley",
        fixture.firstRace || "Check final racecard",
      ]) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.append(cell);
      }
      tbody.append(row);
    }
    table.append(tbody);
    $("#fixture-list").append(table);
  }
  $("#fixture-freshness").textContent =
    `Official fixture data checked ${racingSchedule.verifiedOn}. All dates and times are Hong Kong time. Confirm the final racecard and any amendments before leaving.`;
}
