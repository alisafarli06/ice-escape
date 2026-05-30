# 🧊 Ice Escape

A 2D browser-based survival game built with vanilla JavaScript, HTML, and CSS.

## 📖 Description

The player controls an ice block that must survive falling sun rays while collecting snowflakes to increase their score. As the score grows, the game becomes progressively harder — sun rays fall faster and more frequently. Survive as long as possible without melting!

## 🎨 Game Sketch (Excalidraw)

![Game Sketch](./assets/excalidraw-sketch.png)

> Sketch shows the game layout: sun at the top center, falling sun rays and snowflakes, the ice block player at the bottom, and the HUD (score + HP).

## 🧩 Entities

- **Player (Ice Block) 🧊** – Controlled with arrow keys. Moves horizontally only. Has 3 HP. Shrinks and cracks visually as HP decreases. Melts into nothing on game over.
- **Sun Rays ☀️** – Fall from the sun at the top of the screen. Contact with the player reduces HP by 1.
- **Snowflakes ❄️** – Fall from the top randomly. Collecting one gives +10 score.

## 🎮 How to Play

| Control | Action |
|--------|--------|
| ← Arrow | Move left |
| → Arrow | Move right |

- **Objective:** Survive as long as possible and collect as many snowflakes as you can
- **Lose condition:** HP reaches 0 — the ice block melts
- **Win condition:** None — it's a survival game, go for the high score!
- **Difficulty:** Every 250 points the sun rays fall faster and spawn more frequently

## ⚙️ Tech Decisions

This project uses **OOP (Object-Oriented Programming)** with ES6 classes:

- `Game` – manages the game loop, state, spawning, collisions, and difficulty
- `Player` – handles movement, HP, SVG rendering (crack stages), and melt animation
- `SunRay` – falling enemy projectile, spawned and updated by Game
- `Snowflake` – collectible item, same lifecycle as SunRay
- `SnowBackground` – canvas-based ambient snow particle system

**Why OOP?** Each entity owns its own DOM element, position, and behavior. This makes collision logic, state resets, and visual updates clean and isolated. Adding a new entity type requires only a new class — no tangled global state.

**Why no Canvas for gameplay?** The requirement specified DOM manipulation. SVG is used inside the player element to achieve a realistic ice appearance with gradient and crack lines — no external assets needed.

**Game loop:** `requestAnimationFrame` for smooth 60fps animation. Difficulty is score-based (every 250 points) rather than time-based, so the challenge scales with player skill.

## 📓 AI Diary

See [AI_DIARY.md](./AI_DIARY.md)

## 🌐 Live Demo

[▶ Play on GitHub Pages](https://YOUR-USERNAME.github.io/ice-escape)

> Replace `YOUR-USERNAME` with your GitHub username after deploying.

## 🐛 Known Bugs / What I'd Fix Next

**Known bugs:**
- Collision detection uses axis-aligned bounding boxes (AABB). The ice block is square but the SVG has rounded corners, so very edge-level hits can feel slightly off.
- On very high difficulty levels (score 1000+) sun rays can stack and spawn almost simultaneously, which can feel unfair.

**What I'd fix / add next:**
- Add sound effects (collect snowflake, getting hit, game over)
- Add a difficulty label in the HUD ("Level 2", "Level 3"...) so the player knows when it escalated
- Improve melt animation with a CSS water puddle spreading at the bottom
- Add mobile touch controls (swipe or on-screen buttons)
- Persist the high score with a name/initials leaderboard