# 🧊 Ice Escape

A 2D browser-based survival game built with vanilla JavaScript, HTML, and CSS — no frameworks, no libraries, no canvas for gameplay.

🌐 **[▶ Play on GitHub Pages](https://alisafarli06.github.io/ice-escape/)**

---

## 📖 Description

Ice Escape is a survival arcade game where you control a melting ice block trying to dodge falling sun rays while collecting snowflakes to boost your score.

The sun at the top of the screen continuously fires heat rays downward. Every snowflake you catch earns +10 points — but every sun ray that hits you costs 1 HP. You start with 3 HP. The ice block visually cracks and shrinks as you take damage, and melts into nothing when HP reaches zero.

The game has no win condition — it's purely about surviving as long as possible and chasing the high score. As your score climbs, the sun rays fall faster and spawn more frequently, so the pressure never stops increasing. Your best score is saved automatically and persists across sessions.

---

## 🎨 Game Sketch

[![Game Sketch](https://github.com/alisafarli06/ice-escape/raw/main/assets/excalidraw-sketch.svg)](https://github.com/alisafarli06/ice-escape/blob/main/assets/excalidraw-sketch.svg)

> The sketch shows the full game layout: the animated sun at top-center, falling sun rays and snowflakes, the ice block player at the bottom with horizontal movement arrows, and the HUD displaying score, best score, and HP.

---

## 🧩 Entities

### Player — Ice Block 🧊
- Controlled with **← →** arrow keys; moves horizontally only
- Starts with **3 HP**; each sun ray hit removes 1 HP
- SVG appearance updates dynamically: no cracks at full HP → hairline crack at 2 HP → deep crack at 1 HP
- Plays a shake + melt (scale-to-zero) animation on death
- Cannot move outside the game container boundaries

### Sun Rays ☀️
- Spawned from the sun's position at the top of the screen at regular intervals
- Fall straight down at a fixed speed
- Deal **−1 HP** on contact with the player and are immediately removed
- Speed and spawn frequency **increase every 250 points**

### Snowflakes ❄️
- Spawn at random horizontal positions and fall downward
- Collecting one (walking into it) awards **+10 score**
- Removed on collection or when they exit the bottom of the screen
- Fall speed also scales with difficulty

### Snow Background ❄️
- Ambient canvas-based particle system rendered behind the game area
- Purely decorative — does not affect gameplay
- Runs on its own animation loop independent of the game state

---

## 🎮 How to Play

| Control | Action |
|---------|--------|
| `←` Arrow | Move left |
| `→` Arrow | Move right |

**Objective:** Survive as long as possible and collect snowflakes to maximise your score.

**Scoring:**
- +10 points per snowflake collected
- No time-based scoring — only snowflakes count

**Losing:**
- HP reaches 0 → the ice block melts → game over screen appears
- Your score is compared to the stored best score and updated if beaten

**Difficulty scaling:**
- Every 250 points: sun ray fall speed increases, spawn interval decreases, snowflake speed increases
- There is no difficulty cap — the game gets progressively harder without limit

**Restarting:**
- Click **Play Again** on the game over screen — no page refresh needed
- All entities are cleared, HP and score reset, game loop restarts cleanly

---

## ⚙️ Tech Decisions

### Architecture: OOP with ES6 Classes

The entire game is structured around five classes:

| Class | Responsibility |
|-------|----------------|
| `Game` | Game loop (`requestAnimationFrame`), state management, entity spawning, collision detection, difficulty scaling, screen transitions |
| `Player` | Keyboard input, boundary-clamped movement, HP tracking, dynamic SVG re-rendering per HP stage, melt animation |
| `SunRay` | Creates its own DOM element, manages its own position and fall speed, exposes `remove()` for cleanup |
| `Snowflake` | Same lifecycle as `SunRay` — spawns, falls, collected or exits, removes itself |
| `SnowBackground` | Canvas-based particle system; runs independently on its own `requestAnimationFrame` loop |

**Why OOP?** Each entity owns its DOM element, its position, and its own update logic. The `Game` class only needs to call `update()` and check collisions — it doesn't manage individual entity internals. This also means adding a new entity type (e.g. a moving obstacle) only requires a new class that follows the same interface.

### Rendering: DOM + SVG, not Canvas

The gameplay layer uses DOM elements positioned with CSS, not a `<canvas>`. This was a deliberate choice to practice DOM manipulation as the project required. The player entity uses an **inline SVG** generated via `innerHTML` to render a realistic ice block with gradient fill, specular shine, and crack lines — no external image assets needed. The SVG is regenerated each time HP changes to update the crack stage.

The only `<canvas>` used is for the ambient snow background, where particle rendering is performance-sensitive and canvas is the appropriate tool.

### Game Loop

`requestAnimationFrame` drives a single `_loop()` method in `Game`. The frame ID is stored so the loop can be cancelled cleanly on game over, preventing state corruption between rounds. Difficulty is score-based (every 250 points) rather than time-based — this means the challenge scales with player skill, not just how long they've been alive.

### Persistence

`localStorage` stores a single `iceEscapeBestScore` key. It is read on game start and written on game over if the current score exceeds it. No server, no backend.

---

## 📓 AI Diary

Development was assisted by AI tools throughout. All prompts, decisions, bugs encountered, and fixes are documented in:

📄 **[AI_DIARY.md](https://github.com/alisafarli06/ice-escape/blob/main/AI_DIARY.md)**

---

## 🌐 Live Demo

**[▶ Play Ice Escape on GitHub Pages](https://alisafarli06.github.io/ice-escape/)**

---

## 🐛 Known Bugs / What I'd Fix Next

### Known Bugs

- **Collision imprecision at edges:** Collision detection uses AABB (`getBoundingClientRect()`). The ice block SVG has rounded corners, so a sun ray grazing the very corner of the visual shape can register a hit even though it looks like a near-miss. A circular or polygon-based hitbox would fix this.
- **Sun ray stacking at high difficulty:** Above score 1000, spawn intervals get short enough that multiple sun rays can appear almost simultaneously in the same column, creating unavoidable damage bursts that feel more like RNG than skill-based difficulty.
- **Arrow key page scroll:** Fixed with `e.preventDefault()` in the keydown handler, but this also suppresses arrow key navigation when the game is focused — a minor UX issue if the player tries to scroll the page while the game is running.

### What I'd Fix / Add Next

- **Sound effects** — snowflake collect chime, hit sound, melt sound on game over
- **Difficulty labels in HUD** — show "Level 2", "Level 3" etc. so the player knows when an escalation happened
- **Mobile touch controls** — on-screen left/right buttons or swipe gestures; the game is currently unplayable on mobile
- **Leaderboard** — persist top 5 scores with player initials using `localStorage`
- **Hitbox refinement** — use a smaller inner hitbox (80% of visual size) to make near-misses feel fair
- **Pause functionality** — the current settings button is present but pause is not fully implemented