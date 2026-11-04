// All speeds are laps/second. Timing chooses pace; no winner is preselected.
export const RACE_RULES = Object.freeze({
  laps: 4,
  meterCycleMs: 1450,
  gentleMeterCycleMs: 2800,
  cooldownMs: 900,
  boostMs: 3200,
  fadeMs: 700,
  baseSpeed: 0.055,
  slowSpeed: 0.035,
  fastSpeed: 0.125,
  injuryMultiplier: 0.22,
  autoRecoverMs: 8000,
});
export function secureRandom() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 4294967296;
}
export function triangleMeter(elapsedMs, cycleMs = RACE_RULES.meterCycleMs) {
  const fraction = (((Math.max(0, elapsedMs) / cycleMs) % 1) + 1) % 1;
  return fraction < 0.5 ? fraction * 2 : (1 - fraction) * 2;
}
export function timingAccuracy(value) {
  return Math.max(0, 1 - 2 * Math.abs(Math.max(0, Math.min(1, value)) - 0.5));
}
export function createRace({
  random = secureRandom,
  meterCycleMs = RACE_RULES.meterCycleMs,
} = {}) {
  return {
    status: "running",
    time: 0,
    laps: RACE_RULES.laps,
    winners: [],
    events: [],
    eventSerial: 0,
    meterCycleMs: Math.max(
      500,
      Number(meterCycleMs) || RACE_RULES.meterCycleMs,
    ),
    horses: ["Willy", "Gilly"].map((name) => ({
      name,
      progress: 0,
      quality: null,
      boostUntil: 0,
      readyAt: 0,
      lastMeter: 0,
      injured: false,
      recoverAt: Infinity,
      injuryIndex: 0,
      injuries: [1.2 + random() * 0.45, 2.2 + random() * 0.45],
      strikes: 0,
      accuracyTotal: 0,
      bestAccuracy: 0,
      recoveries: 0,
      autoRecoveries: 0,
    })),
  };
}
function emit(race, kind, index, extra = {}) {
  race.events.push({
    id: ++race.eventSerial,
    time: race.time,
    kind,
    index,
    ...extra,
  });
  if (race.events.length > 64) race.events.shift();
}
export function meterValue(race, horse) {
  if (race.time < horse.readyAt) return horse.lastMeter;
  return triangleMeter(race.time - horse.readyAt, race.meterCycleMs);
}
export function horseSpeed(race, horse, atTime = race.time) {
  if (horse.injured) return RACE_RULES.baseSpeed * RACE_RULES.injuryMultiplier;
  if (horse.quality === null || atTime >= horse.boostUntil)
    return RACE_RULES.baseSpeed;
  const timed =
    RACE_RULES.slowSpeed +
    (RACE_RULES.fastSpeed - RACE_RULES.slowSpeed) * horse.quality;
  const strength = Math.min(
    1,
    Math.max(0, (horse.boostUntil - atTime) / RACE_RULES.fadeMs),
  );
  return RACE_RULES.baseSpeed + (timed - RACE_RULES.baseSpeed) * strength;
}
export function strike(race, index) {
  const horse = race.horses[index];
  if (
    race.status !== "running" ||
    !horse ||
    horse.injured ||
    race.time + 0.001 < horse.readyAt
  )
    return { accepted: false };
  const value = meterValue(race, horse),
    accuracy = timingAccuracy(value);
  const label =
    accuracy >= 0.94
      ? "Perfect"
      : accuracy >= 0.8
        ? "Great"
        : accuracy >= 0.6
          ? "Good"
          : "Wide";
  horse.quality = accuracy;
  horse.boostUntil = race.time + RACE_RULES.boostMs;
  horse.readyAt = race.time + RACE_RULES.cooldownMs;
  horse.lastMeter = value;
  horse.strikes++;
  horse.accuracyTotal += accuracy;
  horse.bestAccuracy = Math.max(horse.bestAccuracy, accuracy);
  emit(race, "strike", index, { accuracy, value, label });
  return { accepted: true, accuracy, value, label };
}
export function recover(race, index) {
  const horse = race.horses[index];
  if (race.status !== "running" || !horse?.injured) return false;
  horse.injured = false;
  horse.recoverAt = Infinity;
  horse.recoveries++;
  emit(race, "recovered", index);
  return true;
}
export function advanceRace(race, deltaMs) {
  let remaining = Math.max(0, Number(deltaMs) || 0);
  while (remaining > 0.001 && race.status === "running") {
    for (const [index, horse] of race.horses.entries()) {
      if (horse.injured && race.time + 0.001 >= horse.recoverAt) {
        horse.injured = false;
        horse.recoverAt = Infinity;
        horse.autoRecoveries++;
        emit(race, "auto-recovered", index);
      }
    }
    let step = Math.min(20, remaining);
    for (const h of race.horses)
      if (h.injured) step = Math.min(step, h.recoverAt - race.time);
    const speeds = race.horses.map((h) =>
      horseSpeed(race, h, race.time + step / 2),
    );
    const before = race.horses.map((h) => h.progress);
    const crossings = race.horses.map((h, i) =>
      before[i] + (speeds[i] * step) / 1000 >= race.laps
        ? Math.max(0, ((race.laps - before[i]) / speeds[i]) * 1000)
        : Infinity,
    );
    const finishAt = Math.min(...crossings);
    if (finishAt <= step) {
      race.time += finishAt;
      race.horses.forEach((h, i) => {
        h.progress = Math.min(
          race.laps,
          before[i] + (speeds[i] * finishAt) / 1000,
        );
      });
      race.winners = crossings
        .map((ms, index) => ({ ms, index }))
        .filter((x) => Math.abs(x.ms - finishAt) <= 0.5)
        .map((x) => x.index);
      race.status = "finished";
      emit(race, "finish", null, { winners: [...race.winners] });
      break;
    }
    race.horses.forEach((h, i) => {
      h.progress = before[i] + (speeds[i] * step) / 1000;
    });
    race.time += step;
    remaining -= step;
    race.horses.forEach((h, index) => {
      if (
        h.injuryIndex < h.injuries.length &&
        h.progress >= h.injuries[h.injuryIndex]
      ) {
        h.injuryIndex++;
        h.injured = true;
        h.recoverAt = race.time + RACE_RULES.autoRecoverMs;
        emit(race, "injured", index);
      }
    });
  }
  return race;
}
