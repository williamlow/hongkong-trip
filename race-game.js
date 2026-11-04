import {
  RACE_RULES,
  createRace,
  advanceRace,
  meterValue,
  horseSpeed,
  strike,
  recover,
} from "./race-engine.js";
const $ = (s) => document.querySelector(s),
  ids = ["willy", "gilly"];
const paths = ids.map((id) => $("#lane-" + id)),
  runners = ids.map((id) => $("#horse-" + id)),
  lengths = paths.map((p) => p.getTotalLength());
const panels = ids.map((id) => ({
  root: $("#player-" + id),
  meter: $("#meter-" + id),
  fill: $("#fill-" + id),
  cursor: $("#cursor-" + id),
  stride: $("#stride-" + id),
  strideLabel: $("#stride-label-" + id),
  recover: $("#recover-" + id),
  alert: $("#alert-" + id),
  feedback: $("#feedback-" + id),
  lap: $("#lap-" + id),
  distance: $("#distance-" + id),
  pace: $("#pace-" + id),
}));
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = motion.matches,
  phase = "ready",
  resumePhase = "racing",
  race = createRace(),
  countdown = 3000,
  lastTime = 0,
  frame = null,
  lastEvent = 0;
let serial = 0,
  scoredSerial = -1,
  completed = 0,
  draws = 0;
const scores = [0, 0];
const text = (el, value) => {
  if (el.textContent !== String(value)) el.textContent = value;
};
if (reduced) $("#meter-speed").value = String(RACE_RULES.gentleMeterCycleMs);
function setPhase(next) {
  phase = next;
  document.body.dataset.gamePhase = next;
}
function position(index, laps) {
  const distance = (laps % 1) * lengths[index],
    point = paths[index].getPointAtLength(distance),
    ahead = paths[index].getPointAtLength((distance + 2) % lengths[index]);
  runners[index].setAttribute("transform", `translate(${point.x} ${point.y})`);
  runners[index]
    .querySelector(".horse-body")
    .setAttribute("transform", `scale(${ahead.x >= point.x ? 1 : -1} 1)`);
  runners[index].dataset.progress = (laps / RACE_RULES.laps).toFixed(5);
  runners[index].dataset.laps = laps.toFixed(5);
}
function processEvents() {
  for (const event of race.events) {
    if (event.id <= lastEvent) continue;
    lastEvent = event.id;
    if (event.index === null) continue;
    const p = panels[event.index];
    if (event.kind === "strike")
      text(
        p.feedback,
        `${event.label} · ${Math.round(event.accuracy * 100)}% accuracy`,
      );
    if (event.kind === "injured")
      text(p.feedback, "Injury! Hit your recovery button.");
    if (event.kind === "recovered")
      text(p.feedback, "Recovered! Get back into your rhythm.");
    if (event.kind === "auto-recovered")
      text(p.feedback, "Recovered after eight seconds.");
  }
}
function render() {
  const active = phase === "racing",
    locked = !["ready", "finished"].includes(phase);
  $("#start-race").disabled = locked;
  $("#pause-race").disabled = !["racing", "countdown", "paused"].includes(
    phase,
  );
  $("#restart-race").disabled = !locked;
  $("#meter-speed").disabled = locked;
  const pauseLabel =
    phase === "paused" ? "Resume <kbd>P</kbd>" : "Pause <kbd>P</kbd>";
  if ($("#pause-race").innerHTML !== pauseLabel)
    $("#pause-race").innerHTML = pauseLabel;
  text($("#race-timer"), (race.time / 1000).toFixed(1));
  const diff = race.horses[0].progress - race.horses[1].progress;
  if (active) {
    text(
      $("#course-callout"),
      Math.abs(diff) < 0.015
        ? "NECK AND NECK"
        : `${diff > 0 ? "WILLY" : "GILLY"} LEADS`,
    );
    text($("#course-detail"), "FOUR LAPS · FIND YOUR RHYTHM");
  }
  if (phase === "countdown") {
    text(
      $("#course-callout"),
      String(Math.max(1, Math.ceil(countdown / 1000))),
    );
    text($("#course-detail"), "GET YOUR BUTTONS READY");
  }
  if (phase === "paused") {
    text($("#course-callout"), "PAUSED");
    text($("#course-detail"), "RESUME WHEN YOU’RE BOTH READY");
  }
  race.horses.forEach((h, index) => {
    const p = panels[index],
      value = meterValue(race, h),
      cooldown = Math.max(0, h.readyAt - race.time);
    p.fill.style.transform = `scaleX(${value})`;
    p.cursor.style.left = `${value * 100}%`;
    p.meter.setAttribute("aria-valuenow", String(Math.round(value * 100)));
    p.meter.dataset.value = value.toFixed(5);
    p.stride.disabled = !active || h.injured || cooldown > 0.001;
    p.recover.disabled = !active || !h.injured;
    text(
      p.strideLabel,
      cooldown > 0
        ? `Set · ${(cooldown / 1000).toFixed(1)}s`
        : "Time the stride",
    );
    text(
      p.alert,
      phase === "finished"
        ? "Race finished"
        : phase === "paused"
          ? "Paused"
          : h.injured
            ? "INJURY · recover now"
            : phase === "countdown"
              ? "Get ready…"
              : phase === "ready"
                ? "Ready for the start."
                : "Running well",
    );
    p.root.classList.toggle("is-injured", h.injured);
    runners[index].classList.toggle("is-injured", h.injured);
    text(
      p.lap,
      phase === "finished" && h.progress >= RACE_RULES.laps - 0.0001
        ? "Finished"
        : `Lap ${Math.min(RACE_RULES.laps, Math.floor(h.progress) + 1)} / ${RACE_RULES.laps}`,
    );
    p.distance.value = h.progress;
    text(
      p.pace,
      `${(horseSpeed(race, h) / RACE_RULES.baseSpeed).toFixed(1)}× pace`,
    );
    // The timing sweep is essential; reduced motion removes the decorative bob.
    position(index, h.progress);
  });
}
function finish() {
  if (scoredSerial === serial) return;
  scoredSerial = serial;
  setPhase("finished");
  completed++;
  cancelAnimationFrame(frame);
  frame = null;
  const result = $("#race-result");
  result.classList.add("has-result");
  if (race.winners.length === 2) {
    draws++;
    text(result, "A photo-finish draw!");
    result.dataset.winner = "draw";
    text(
      $("#race-status"),
      "A draw after four laps. Share the honours, then race again.",
    );
    text($("#course-callout"), "PHOTO FINISH");
  } else {
    const index = race.winners[0],
      name = race.horses[index].name;
    scores[index]++;
    text(result, `${name} wins!`);
    result.dataset.winner = name;
    const h = race.horses[index],
      accuracy = h.strikes
        ? `${Math.round((h.accuracyTotal / h.strikes) * 100)}% average timing`
        : "No timing hits";
    text(
      $("#race-status"),
      `${name} wins four laps in ${(race.time / 1000).toFixed(1)} seconds. ${accuracy}; ${h.recoveries} quick recoveries.`,
    );
    text($("#course-callout"), `${name.toUpperCase()} WINS`);
  }
  text($("#course-detail"), "ANOTHER FOUR LAPS?");
  text($("#willy-wins"), scores[0]);
  text($("#gilly-wins"), scores[1]);
  text($("#draw-count"), draws);
  text($("#race-count"), completed);
  text($("#start-race"), "Race again ↗");
  race.horses.forEach((h, index) => {
    const average = h.strikes
      ? `${Math.round((h.accuracyTotal / h.strikes) * 100)}%`
      : "—";
    text(
      panels[index].feedback,
      `${h.strikes} hits · ${average} avg · ${h.recoveries} recoveries`,
    );
  });
  render();
}
function advanceTo(now) {
  const elapsed = Math.max(0, Math.min(100, now - lastTime));
  lastTime = now;
  if (phase === "countdown") {
    countdown -= elapsed;
    if (countdown <= 0) {
      setPhase("racing");
      text(
        $("#race-status"),
        "They’re off! Aim for 50%, and watch for injury alerts.",
      );
    }
  } else if (phase === "racing") {
    advanceRace(race, elapsed);
    processEvents();
    if (race.status === "finished") finish();
  }
}
function tick(now) {
  frame = null;
  advanceTo(now);
  render();
  if (phase === "racing" || phase === "countdown")
    frame = requestAnimationFrame(tick);
}
function start(restart = false) {
  if (!restart && !["ready", "finished"].includes(phase)) return;
  cancelAnimationFrame(frame);
  serial++;
  lastEvent = 0;
  race = createRace({ meterCycleMs: Number($("#meter-speed").value) });
  countdown = 3000;
  setPhase("countdown");
  delete $("#race-result").dataset.winner;
  $("#race-result").classList.remove("has-result");
  text($("#race-result"), "Four laps. Find the middle.");
  text($("#race-status"), "Get ready: three-second countdown.");
  panels.forEach((p) => text(p.feedback, "Aim for the centre line."));
  lastTime = performance.now();
  render();
  frame = requestAnimationFrame(tick);
  $("#race-arena").scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
    block: "start",
  });
}
function pause(message = "Paused. Resume when you’re both ready.") {
  if (!["countdown", "racing"].includes(phase)) return;
  advanceTo(performance.now());
  if (phase === "finished") return;
  resumePhase = phase;
  setPhase("paused");
  cancelAnimationFrame(frame);
  frame = null;
  text($("#race-status"), message);
  render();
}
function togglePause() {
  if (phase === "paused") {
    setPhase(resumePhase);
    lastTime = performance.now();
    text(
      $("#race-status"),
      resumePhase === "countdown" ? "Countdown resumed." : "Back on the track.",
    );
    render();
    frame = requestAnimationFrame(tick);
  } else pause();
}
function action(index, recovery = false) {
  if (phase !== "racing") return;
  advanceTo(performance.now());
  if (phase !== "racing") return;
  if (recovery) recover(race, index);
  else strike(race, index);
  processEvents();
  render();
}
$("#start-race").addEventListener("click", () => start());
$("#restart-race").addEventListener("click", () => start(true));
$("#pause-race").addEventListener("click", togglePause);
for (const [index, p] of panels.entries())
  for (const [button, recovery] of [
    [p.stride, false],
    [p.recover, true],
  ]) {
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || button.disabled) return;
      event.preventDefault();
      button.focus({ preventScroll: true });
      action(index, recovery);
    });
    // Keyboard/assistive clicks have no pointerdown. Pointer clicks are handled above.
    button.addEventListener("click", (event) => {
      if (event.detail === 0 && !button.disabled) action(index, recovery);
    });
  }
document.addEventListener("keydown", (event) => {
  if (
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.target.closest?.('input,textarea,select,[contenteditable="true"]')
  )
    return;
  if (
    event.code === "KeyP" &&
    ["countdown", "racing", "paused"].includes(phase)
  ) {
    event.preventDefault();
    togglePause();
    return;
  }
  const key = {
    KeyA: [0, false],
    KeyS: [0, true],
    KeyK: [1, false],
    KeyL: [1, true],
  }[event.code];
  if (key && phase === "racing") {
    event.preventDefault();
    action(...key);
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden)
    pause("Paused while the page is hidden. Press Resume when you’re back.");
});
window.addEventListener("blur", () =>
  pause("Paused while this window is away. Press Resume when you’re back."),
);
motion.addEventListener("change", (event) => {
  reduced = event.matches;
  if (["ready", "finished"].includes(phase))
    $("#meter-speed").value = String(
      reduced ? RACE_RULES.gentleMeterCycleMs : RACE_RULES.meterCycleMs,
    );
});
render();
