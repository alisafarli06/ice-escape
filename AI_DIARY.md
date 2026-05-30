# 🤖 AI Diary – Ice Escape

This diary documents how AI was used during the development of Ice Escape.

---

## Entry 1 – Project Setup

**Date:** 2026-05-30

**What I asked AI:**
I shared the full project description and requirements with the AI. I asked it to help me plan the project structure and generate the initial skeleton files (HTML, CSS, JS, README, AI_DIARY).

**What AI helped with:**
- Suggested the file/folder structure
- Generated boilerplate `index.html`, `style.css`, and `game.js`
- Wrote initial `README.md` with all required sections
- Explained the OOP approach with classes for each game entity

**What I learned / decided:**
I decided to use OOP with ES6 classes because it makes each game entity independent and easier to manage. The game loop will use `requestAnimationFrame`.

**My own contribution:**
I reviewed the structure, understood the plan, and will be writing commits step by step.

---

## Entry 2 – Player Movement

**Date:** 2026-05-30

**What I asked AI:**
I asked AI to implement the Player class with keyboard-controlled left/right movement inside the game container.

**What AI helped with:**
- Created the `Player` class with `movingLeft` / `movingRight` flags
- Implemented `keydown` / `keyup` event listeners
- Added boundary checks so the player can't leave the container
- Set up the `Game` class with a `requestAnimationFrame` loop

**What I learned / decided:**
I learned that binding keys once in the constructor (not on every restart) is important — otherwise event listeners stack up and movement speed multiplies on each restart.

**My own contribution:**
I tested the movement and confirmed boundaries worked correctly before moving to the next step.

---

## Entry 3 – Collision System & Entities

**Date:** 2026-05-30

**What I asked AI:**
I asked AI to add `SunRay` and `Snowflake` classes with falling behavior and AABB collision detection against the player.

**What AI helped with:**
- Built `SunRay` and `Snowflake` classes that create and manage their own DOM elements
- Implemented `isColliding(a, b)` using axis-aligned bounding box logic
- Wired up spawn timers inside the game loop
- Added `.remove()` method on each entity to clean up the DOM

**What I learned / decided:**
AABB collision is simple and effective for this type of game. Each entity storing its own DOM element and being responsible for removing itself keeps the Game class clean.

**My own contribution:**
I verified collisions in the browser console and adjusted spawn timing to feel balanced.

---

## Entry 4 – Score, HP, Start & Game Over Screens

**Date:** 2026-05-30

**What I asked AI:**
I asked AI to add HP tracking, score display, and the start/game over overlay screens with proper state transitions.

**What AI helped with:**
- Added `score` and `hp` to the Game class
- Built the HUD with live score and HP display (ice cube icons)
- Created start screen and game over screen as overlay divs
- Implemented `start()` method that fully resets state without page refresh
- Added `localStorage` high score save/load

**What I learned / decided:**
Managing screens with a `.hidden` CSS class is clean and simple. Resetting the game means clearing DOM objects, resetting class properties, and restarting the loop — no need to recreate the entire Game object.

**My own contribution:**
I decided the game over screen should say "Melted!" instead of "Game Over" to match the ice theme.

---

## Entry 5 – Visual Overhaul & Difficulty Scaling

**Date:** 2026-05-31

**What I asked AI:**
I asked AI to improve the visuals significantly: make the sun realistic with CSS/SVG, add a snow particle background, make the ice block render as a real SVG with cracks, add a melt animation, and implement score-based difficulty scaling.

**What AI helped with:**
- Built a CSS animated sun with rotating SVG rays and a glowing radial gradient core
- Created `SnowBackground` class using Canvas for ambient falling snow particles
- Replaced the emoji ice block with a dynamically generated SVG with gradient fill, shine, and crack lines that appear as HP decreases
- Implemented `melt()` — shake animation followed by CSS scale-to-zero transition
- Added `_difficulty()` method: every 250 points increases ray speed, snowflake speed, and spawn frequency
- Fixed arrow key scroll lock with `e.preventDefault()`

**What I learned / decided:**
SVG generated in JavaScript (innerHTML) is surprisingly powerful — the ice block looks much more realistic than an emoji and required no external assets. Score-based difficulty feels fairer than time-based because it scales with how well the player is doing.

**My own contribution:**
I gave specific visual feedback on what I liked and what to change — I asked to remove flame emoji from sun rays, keep the ice emoji style for the last HP stage, and remove an experimental "Snowing" power-up feature that didn't fit the game feel.