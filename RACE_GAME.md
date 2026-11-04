# Willy vs Gilly

A shared-screen two-player game at `race-game.html`, linked from every section's **Race game** tab. The Happy Valley visitor guide links to it at its existing `#mini-race` anchor. No backend, account, external game library or real-money mechanic is involved.

## Controls and flow

| Player | Horse | Time stride            | Recover                     |
| ------ | ----- | ---------------------- | --------------------------- |
| 1      | Willy | A or left touch panel  | S or Willy's Recover button |
| 2      | Gilly | K or right touch panel | L or Gilly's Recover button |

Start gives a three-second countdown. Both horses begin with the same rules and meter timing. Each meter runs left → right → left, with the target at **50%**. A hit freezes that player's meter for a **900 ms cooldown**, then starts their next sweep independently. A closer hit produces higher pace; repeated edge hits can slow the horse below normal pace. Holding the game keys does not repeatedly fire actions. Pointer input is handled on press for responsiveness; keyboard/assistive button clicks have a separate path.

First to complete **four laps** wins. The simulation compares crossing times within a simulation step, so the horse processed first has no finish-order advantage. Crossing times within 0.5 ms share a draw. The race stops at the first finish; the other horse can remain short of four laps.

P or the Pause button freezes race time, meters, boosts, cooldowns, injuries and the countdown. Losing page/window visibility pauses until an explicit resume. Restart abandons the current race without awarding a score and starts a new countdown. Race again retains the session scores and creates fresh race state. Reload resets scores.

## Pace and injuries

The pure simulation in `race-engine.js` exports the rules, meter/accuracy helpers, state creation, stride/recovery actions and time advancement. `race-game.js` connects it to the SVG course, controls, feedback and scoreboard. The SVG course is reused from the original site; lane positions use lap progress.

- Quick meter: a full 0 → 100 → 0 cycle in **1450 ms**. Gentle: **2800 ms**.
- Accuracy is `1 - 2 × abs(value - 0.5)`, bounded to 0–1. Centre is perfect, ends are zero.
- Normal pace is **0.055 laps/second**. A timed hit chooses **0.035–0.125 laps/second** linearly with accuracy, so a perfect hit is about 2.3× normal pace. A boost lasts 3200 ms, fading towards normal during its last 700 ms.
- Each horse has two injury locations: one in lap 2, one in lap 3. Locations are independently drawn within equivalent progress ranges using browser crypto randomness; no winner is chosen in advance.
- Injury pace is 22% of normal. The separate recovery action immediately clears it. An unattended injury clears after eight seconds of active race time, avoiding a permanently stalled game. Healthy recovery presses have no effect.
- Scores update once for a completed race. Draws are counted separately. Input is rejected during countdown, pause, injury/stride cooldown and after the finish as appropriate.

Time advances in at most 20 ms simulation steps. The UI bounds a single rendering catch-up to 100 ms and pauses on page/window departure rather than making players catch up with unseen gameplay. The simulation's random source is injectable for deterministic tests; the published UI uses browser crypto.

## Motion and small screens

Touch controls remain in two columns on small phones, with timing and recovery separated for each horse. Seven-section navigation wraps cleanly, and starting a race scrolls the track/controls into view. Buttons have keyboard shortcuts and native disabled states; status regions announce actions and phase changes rather than every animation frame.

Reduced-motion preferences choose Gentle meters before a race and remove decorative galloping. The essential timing sweep and race progress remain playable; reduced motion does not instantly select a result. Meter speed is fixed for the current race so both players keep the same setting.

## Verification

Tests cover the bouncing waveform and accuracy relationship; cooldown and below-baseline wide hits; either player winning through skilled input; injury/recovery isolation and automatic recovery; sub-frame finish ordering and ties; guide/game separation; independent keyboard and multi-pointer inputs; pause/restart; one-time scoring and replay; reduced motion; and side-by-side controls and navigation at phone/tablet/desktop widths. Browser tests use a controlled clock to exercise complete races without wall-clock waits. These tests concern the game, not the visitor guide's real-world betting/schedule information.
