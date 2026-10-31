// Independent fresh random draws; the animation never changes the chosen winner.
export function secureRandom() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 4294967296;
}

export function createRacePlan(random = secureRandom) {
  const winnerIndex = random() < 0.5 ? 0 : 1;
  const winningTime = 6500 + random() * 1200;
  const gap = 550 + random() * 700;
  return {
    winner: winnerIndex === 0 ? "Willy" : "Gilly",
    laps: 2,
    horses: ["Willy", "Gilly"].map((name, index) => ({
      name,
      finishTime: winningTime + (index === winnerIndex ? 0 : gap),
      rhythm: (random() - 0.5) * 0.06,
    })),
  };
}

export function raceProgress(elapsed, horse) {
  const t = Math.max(0, Math.min(1, elapsed / horse.finishTime));
  // The small oscillation changes pace without allowing backwards movement.
  return t + horse.rhythm * Math.sin(4 * Math.PI * t) * Math.sin(Math.PI * t);
}
