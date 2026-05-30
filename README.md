# 🧊 Ice Escape

A 2D browser-based survival game built with vanilla JavaScript, HTML, and CSS.

## 📖 Description

The player controls an ice block that must survive falling sun rays while collecting snowflakes to increase their score. Survive as long as possible without losing all HP!

## 🧩 Entities

- **Player (Ice Block)** – moves left/right using arrow keys
- **Sun Rays ☀️** – fall from the top; damage the player on contact
- **Snowflakes ❄️** – fall from the top; collected for points

## 🎮 How to Play

| Control | Action |
|--------|--------|
| ← Arrow | Move left |
| → Arrow | Move right |

- **Objective:** Survive as long as possible and collect snowflakes
- **Lose condition:** HP reaches 0
- **Win condition:** None – it's a survival game!

## ⚙️ Tech Decisions

This project uses **OOP (Object-Oriented Programming)** with ES6 classes (`Game`, `Player`, `SunRay`, `Snowflake`). OOP was chosen because it keeps each entity self-contained, making collision logic and state management easier to reason about.

No canvas API or external libraries are used – only vanilla JS with DOM manipulation.

## 📓 AI Diary

See [AI_DIARY.md](./AI_DIARY.md)

## 🌐 Live Demo

_Link will be added after GitHub Pages deployment._

## 🐛 Known Bugs / What I'd Fix Next

_To be filled in after development._