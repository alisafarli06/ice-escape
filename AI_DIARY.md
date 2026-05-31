# 🤖 AI Diary – Ice Escape

This diary documents how AI was used during the development of Ice Escape.

---

## AI Tools Used

| Tool | Why |
|------|-----|
| Claude (claude.ai) | Primary coding assistant — architecture planning, class design, feature implementation, visual styling, and iterative debugging |
| ChatGPT (free) | Second opinion on game loop structure and collision logic edge cases |
| Gemini (free) | Quick sanity checks on CSS animation syntax and canvas API usage |

---

## Entries

---

## Entry 1 – Project Setup & Architecture Planning

**Date:** 2026-05-30

**What I asked AI:** I shared the full project requirements and asked for help planning the file structure and generating initial skeleton files (HTML, CSS, JS, README, AI_DIARY).

**What AI helped with:**
- Suggested the folder/file structure (`index.html`, `style.css`, `game.js`, `assets/`)
- Generated boilerplate for all three files
- Proposed OOP architecture with ES6 classes: `Game`, `Player`, `SunRay`, `Snowflake`
- Drafted the initial `README.md` with all required sections

**What was wrong:** The initial boilerplate had all game logic inside a single `init()` function — no class separation. The game loop was also using `setInterval` instead of `requestAnimationFrame`, which caused stuttering on lower-end machines.

**How I fixed it:** I asked AI to refactor into proper ES6 classes and switch to `requestAnimationFrame`. AI restructured everything into the `Game` class with a `_loop()` method.

**What I learned / decided:** OOP with ES6 classes makes each entity independent and self-managing. Adding a new entity type later only requires a new class — no tangled global state.

**My own contribution:** I reviewed the proposed architecture, understood the class relationships, and decided on `requestAnimationFrame` for the game loop before any code was written.

**Time lost:** ~20 minutes refactoring from functional to OOP structure.

---

## Entry 2 – Player Movement

**Date:** 2026-05-30

**What I asked AI:** Implement the `Player` class with keyboard-controlled left/right movement inside the game container, with boundary checks.

**What AI helped with:**
- Created the `Player` class with `movingLeft` / `movingRight` state flags
- Added `keydown` / `keyup` event listeners in the constructor
- Implemented boundary clamping so the player can't leave the container

**What was wrong:** On game restart, the `keydown`/`keyup` listeners were being re-attached every time `start()` was called. After 3 restarts, the player was moving 3× faster because the same key was firing 3 handlers simultaneously.

**How I fixed it:** I asked AI why movement was accelerating on restart. It identified the stacked listeners and moved event binding to a one-time setup outside the restart flow. Fixed immediately.

**What I learned / decided:** Event listeners must be registered once — not inside functions that run on every restart. A subtle bug that would be very hard to catch without understanding event listener lifetimes.

**My own contribution:** I caught the bug by testing restart multiple times and noticed the speed difference. I described the symptom to AI and it diagnosed the root cause.

**Time lost:** ~15 minutes debugging accelerating movement.

---

## Entry 3 – Collision System & Falling Entities

**Date:** 2026-05-30

**What I asked AI:** Add `SunRay` and `Snowflake` classes with falling behavior and AABB collision detection against the player.

**What AI helped with:**
- Built `SunRay` and `Snowflake` classes that each create and manage their own DOM element
- Implemented `isColliding(a, b)` using axis-aligned bounding box (AABB) math via `getBoundingClientRect()`
- Added `remove()` method on each entity to clean up the DOM on collision or exit
- Wired up spawn intervals inside the game loop

**What was wrong:** Entities were not being removed from the internal arrays after collision — only from the DOM. This caused the game to check collisions against invisible "ghost" entities, and over time the arrays grew unbounded, causing a noticeable frame rate drop after ~60 seconds of play.

**How I fixed it:** I described the slowdown to AI. It identified the missing array cleanup and added a filter step after each collision check: `this.sunRays = this.sunRays.filter(r => !r.removed)`.

**What I learned / decided:** DOM removal and array removal must happen together. Keeping stale references in arrays is a memory/performance leak in game loops.

**My own contribution:** I noticed the slowdown by playing for a full minute and timing the frame rate difference. I also verified the fix worked by checking array lengths in the console.

**Time lost:** ~25 minutes tracing the performance degradation.

---

## Entry 4 – Score, HP, Start & Game Over Screens

**Date:** 2026-05-30

**What I asked AI:** Add HP tracking, score display, and start/game over overlay screens with proper state transitions and `localStorage` high score.

**What AI helped with:**
- Added `score` and `hp` to the `Game` class
- Built the HUD with live score and HP display using ice cube icons
- Created start screen and game over screen as overlay `div`s toggled with a `.hidden` CSS class
- Implemented `start()` method that fully resets state without page refresh
- Added `localStorage` high score save/load

**What was wrong:** The game over screen was appearing instantly when HP hit 0 — before the melt animation could play. The screen and the animation were racing. Also, the `cancelAnimationFrame` call was missing, so the game loop kept running in the background after game over, causing `score` to keep incrementing invisibly.

**How I fixed it:** Asked AI to sequence the game over screen behind the melt animation using a `setTimeout` delay, and to store the `requestAnimationFrame` ID so it could be properly cancelled on game over.

**What I learned / decided:** Game state transitions need to be explicitly sequenced. A running loop after "game over" is a silent bug — nothing visually breaks but state corrupts.

**My own contribution:** I decided the game over screen should say "Melted! ☀️" instead of "Game Over" to match the ice theme. I also decided that high score should show on both the game over screen and the start screen.

**Time lost:** ~30 minutes on the animation/screen race condition.

---

## Entry 5 – Visual Overhaul & Difficulty Scaling

**Date:** 2026-05-31

**What I asked AI:** Improve all visuals significantly: realistic CSS/SVG sun, canvas snow background, SVG ice block with crack stages, melt animation, and score-based difficulty scaling.

**What AI helped with:**
- Built a CSS animated sun with rotating SVG rays and a glowing radial gradient core
- Created `SnowBackground` class using Canvas API for ambient falling snow particles
- Replaced the emoji ice block with a dynamically generated inline SVG with gradient fill, shine, and crack lines that appear progressively as HP decreases
- Implemented `melt()` — CSS shake + scale-to-zero transition triggered on death
- Added `_difficulty()` method: every 250 points increases ray speed, snowflake speed, and spawn frequency
- Fixed arrow key page scroll interference with `e.preventDefault()`

**What was wrong:**
1. The sun's rotating rays were causing a full page layout repaint on every frame because they were DOM elements being rotated — not canvas or SVG transforms. This tanked performance.
2. An experimental "Snowing" power-up (temporary invincibility) was added by AI unprompted, which didn't fit the game design.
3. Sun ray projectiles were rendered as flame emojis (🔥), which looked inconsistent with the clean SVG style of everything else.
4. The ice block SVG was not updating its crack stage when HP changed — the SVG was generated once and never re-rendered.

**How I fixed it:**
1. Asked AI to move the sun rotation to a single CSS `@keyframes` transform on the SVG element — one GPU-composited layer, no layout repaint.
2. Explicitly told AI to remove the power-up feature entirely.
3. Asked for sun rays to be replaced with CSS glowing circles (box-shadow + border-radius).
4. AI refactored the SVG to be regenerated via `innerHTML` each time HP changes — simple and effective.

**What I learned / decided:** AI sometimes adds features it thinks are "nice to have" — you have to actively reject scope creep. Also, DOM-based animation is expensive; CSS transforms and Canvas are much better for anything that animates every frame.

**My own contribution:** I gave detailed visual feedback throughout multiple rounds. I specifically requested removing the flame emoji, keeping the ice crystal style for the final HP stage (instead of the proposed "crumbling" look), and adding the scroll lock fix after noticing the page was scrolling when playing.

**Time lost:** ~45 minutes across performance fix, scope removal, and SVG HP re-rendering.

---

## Entry 6 – Game Sketch & Final Documentation

**Date:** 2026-05-31

**What I asked AI:** Generate a game design sketch in Excalidraw hand-drawn SVG style showing all game zones, entities, annotations, and a legend. Then finalize all README sections.

**What AI helped with:**
- Generated an SVG sketch with: game container, HUD bar, sun, falling sun rays, snowflakes, ice block player, movement arrows
- Added zone labels, annotation leader lines, entities description box, and a legend — all in hand-drawn style
- Wrote the final `README.md` with all required sections
- Compiled and structured all 6 AI_DIARY entries

**What was wrong:** The sketch's title area showed "GAME CANVAS / VIEWPORT" as a generic label instead of the actual game name. The overall canvas size was also too small — annotations were cramped and the legend overlapped the game area.

**How I fixed it:** Asked AI to update the title to "ICE ESCAPE" and increase the SVG `viewBox` dimensions to give more breathing room. Took two rounds of feedback to get the spacing right.

**What I learned / decided:** SVG is powerful for design documentation — it stays crisp at any resolution and needs no external image editor. Iterative visual feedback ("make this bigger", "move that label") works well with AI but requires patience.

**My own contribution:** I reviewed every visual output, gave specific positional feedback, and saved the final result as `assets/excalidraw-sketch.svg`. I also made the call to link the Trello board in the README for extra transparency.

**Time lost:** ~20 minutes on sketch title and sizing iterations.