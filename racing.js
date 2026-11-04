import { racingSchedule } from "./racing-data.js";

const $ = (selector) => document.querySelector(selector);

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
