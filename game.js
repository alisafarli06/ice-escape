// ─── Snow Background ────────────────────────────────────────────────────────
class SnowBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      this.particles.push(this._randomParticle(true));
    }
  }

  _randomParticle(randomY = false) {
    return {
      x:       Math.random() * 400,
      y:       randomY ? Math.random() * 600 : -6,
      r:       Math.random() * 3 + 1,
      speed:   Math.random() * 0.8 + 0.3,
      drift:   (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.3,
    };
  }

  update() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 400, 600);
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${p.opacity})`;
      ctx.fill();
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > 606) Object.assign(p, this._randomParticle(false));
    }
  }
}

// ─── Player ─────────────────────────────────────────────────────────────────
// Each stage: [size, fontSize, label]
const ICE_STAGES = [
  [64, 52, '🧊'],   // 3 HP — full
  [46, 38, '🧊'],   // 2 HP — cracked / smaller
  [30, 24, '🧊'],   // 1 HP — tiny but still ice
];

class Player {
  constructor(containerWidth) {
    this.containerWidth = containerWidth;
    this.speed   = 6;
    this.el      = document.getElementById('player');
    this.movingLeft  = false;
    this.movingRight = false;
    this.maxHp = 3;
    this.hp    = this.maxHp;
    this._applyStage();
    this.x = (containerWidth - this.size) / 2;
    this.el.style.left = this.x + 'px';
    this._bindKeys();
  }

  _applyStage() {
    const idx   = this.maxHp - this.hp;
    const stage = ICE_STAGES[Math.min(idx, ICE_STAGES.length - 1)];
    this.size = stage[0];
    this.el.style.width    = this.size + 'px';
    this.el.style.height   = this.size + 'px';
    this.el.style.fontSize = stage[1] + 'px';
    this.el.textContent    = stage[2];
    this.y = 600 - this.size - 20;
  }

  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); // ← ekranın sürüşməsinin qarşısı
      }
      if (e.key === 'ArrowLeft')  this.movingLeft  = true;
      if (e.key === 'ArrowRight') this.movingRight = true;
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft')  this.movingLeft  = false;
      if (e.key === 'ArrowRight') this.movingRight = false;
    });
  }

  reset() {
    this.hp = this.maxHp;
    this._applyStage();
    this.x = (this.containerWidth - this.size) / 2;
    this.movingLeft  = false;
    this.movingRight = false;
    this.el.style.left = this.x + 'px';
    this.el.classList.remove('melting');
    this.el.style.filter = '';
  }

  hit() {
    this.hp--;
    if (this.hp > 0) {
      this._applyStage();
      this.el.style.filter = 'drop-shadow(0 0 16px #ff4400)';
      setTimeout(() => {
        this.el.style.filter = 'drop-shadow(0 4px 10px rgba(100,200,255,0.6))';
      }, 300);
    }
  }

  melt(onDone) {
    this.el.textContent    = '💧';
    this.el.style.fontSize = '36px';
    this.el.classList.add('melting');
    setTimeout(onDone, 1150);
  }

  update() {
    if (this.movingLeft)  this.x -= this.speed;
    if (this.movingRight) this.x += this.speed;
    if (this.x < 0) this.x = 0;
    if (this.x + this.size > this.containerWidth) this.x = this.containerWidth - this.size;
    this.el.style.left = this.x + 'px';
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.size, height: this.size };
  }
}

// ─── Sun Ray projectile ──────────────────────────────────────────────────────
class SunRay {
  constructor(containerWidth, gameScreen, speed) {
    this.width  = 22;
    this.height = 22;
    this.speed  = speed;
    this.x      = Math.random() * (containerWidth - this.width);
    this.y      = 80;
    this.active = true;

    this.el = document.createElement('div');
    this.el.classList.add('sun-ray');
    this.el.style.width  = this.width  + 'px';
    this.el.style.height = this.height + 'px';
    this.el.style.left   = this.x + 'px';
    this.el.style.top    = this.y + 'px';
    gameScreen.appendChild(this.el);
  }

  update() {
    this.y += this.speed;
    this.el.style.top = this.y + 'px';
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  remove() {
    this.el.remove();
    this.active = false;
  }
}

// ─── Snowflake collectible ───────────────────────────────────────────────────
class Snowflake {
  constructor(containerWidth, gameScreen, speed) {
    this.width  = 24;
    this.height = 24;
    this.speed  = speed;
    this.x      = Math.random() * (containerWidth - this.width);
    this.y      = -this.height;
    this.active = true;

    this.el = document.createElement('div');
    this.el.classList.add('snowflake');
    this.el.textContent  = '❄️';
    this.el.style.width  = this.width  + 'px';
    this.el.style.height = this.height + 'px';
    this.el.style.left   = this.x + 'px';
    this.el.style.top    = this.y + 'px';
    gameScreen.appendChild(this.el);
  }

  update() {
    this.y += this.speed;
    this.el.style.top = this.y + 'px';
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  remove() {
    this.el.remove();
    this.active = false;
  }
}

// ─── Collision ───────────────────────────────────────────────────────────────
function isColliding(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ─── Game ────────────────────────────────────────────────────────────────────
class Game {
  constructor() {
    this.container      = document.getElementById('game-container');
    this.gameScreen     = document.getElementById('game-screen');
    this.startScreen    = document.getElementById('start-screen');
    this.gameoverScreen = document.getElementById('gameover-screen');
    this.finalScoreEl   = document.getElementById('final-score');
    this.scoreEl        = document.getElementById('score-display');
    this.hpEl           = document.getElementById('hp-display');
    this.startHsEl      = document.getElementById('start-highscore');
    this.gameoverHsEl   = document.getElementById('gameover-highscore');

    this.containerWidth  = this.container.offsetWidth;
    this.containerHeight = this.container.offsetHeight;

    this.snow   = new SnowBackground(document.getElementById('snow-canvas'));
    this.player = new Player(this.containerWidth);

    this.sunRays    = [];
    this.snowflakes = [];
    this.score      = 0;
    this.hp         = 3;
    this.spawnTimer = 0;
    this.elapsed    = 0;
    this.running    = false;
    this.gameOverPending = false;

    this.highScore = parseInt(localStorage.getItem('iceEscapeHighScore')) || 0;
    this.startHsEl.textContent = this.highScore;

    document.getElementById('start-btn').addEventListener('click',   () => this.start());
    document.getElementById('restart-btn').addEventListener('click', () => this.start());

    this._snowLoop();
  }

  _snowLoop() {
    this.snow.update();
    requestAnimationFrame(() => this._snowLoop());
  }

  _difficulty() {
    const level = Math.floor(this.elapsed / 10);
    return {
      raySpeed:      3   + level * 0.4,
      flakeSpeed:    2   + level * 0.2,
      rayInterval:   Math.max(40,  90  - level * 8),
      flakeInterval: Math.max(60,  120 - level * 8),
    };
  }

  _saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('iceEscapeHighScore', this.highScore);
    }
  }

  start() {
    this.score      = 0;
    this.hp         = 3;
    this.spawnTimer = 0;
    this.elapsed    = 0;
    this.running    = true;
    this.gameOverPending = false;

    this.sunRays.forEach((r) => r.remove());
    this.snowflakes.forEach((f) => f.remove());
    this.sunRays    = [];
    this.snowflakes = [];

    this.player.reset();
    this.startHsEl.textContent = this.highScore;

    this.startScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');

    this._updateHUD();
    this._lastTime = performance.now();
    this._loop();
  }

  _updateHUD() {
    this.scoreEl.textContent = `Score: ${this.score}`;
    this.hpEl.textContent    = '🧊'.repeat(this.hp) + '🫙'.repeat(3 - this.hp);
  }

  _spawnObjects() {
    this.spawnTimer++;
    const d = this._difficulty();

    if (this.spawnTimer % d.rayInterval   === 0)
      this.sunRays.push(new SunRay(this.containerWidth, this.gameScreen, d.raySpeed));

    if (this.spawnTimer % d.flakeInterval === 0)
      this.snowflakes.push(new Snowflake(this.containerWidth, this.gameScreen, d.flakeSpeed));
  }

  _checkCollisions() {
    if (this.gameOverPending) return;
    const pr = this.player.getRect();

    this.sunRays = this.sunRays.filter((ray) => {
      if (!ray.active) return false;
      if (ray.y > this.containerHeight) { ray.remove(); return false; }
      if (isColliding(pr, ray.getRect())) {
        ray.remove();
        this.player.hit();
        this.hp--;
        if (this.hp <= 0) { this.hp = 0; this._triggerGameOver(); }
        return false;
      }
      return true;
    });

    this.snowflakes = this.snowflakes.filter((flake) => {
      if (!flake.active) return false;
      if (flake.y > this.containerHeight) { flake.remove(); return false; }
      if (isColliding(pr, flake.getRect())) {
        flake.remove();
        this.score += 10;
        return false;
      }
      return true;
    });
  }

  _triggerGameOver() {
    this.running = false;
    this.gameOverPending = true;
    this._saveHighScore();

    this.player.melt(() => {
      this.finalScoreEl.textContent = this.score;
      this.gameoverHsEl.textContent = this.highScore;
      this.startHsEl.textContent    = this.highScore;
      this.gameScreen.classList.add('hidden');
      this.gameoverScreen.classList.remove('hidden');
    });
  }

  _loop() {
    if (!this.running) return;

    const now = performance.now();
    this.elapsed += (now - this._lastTime) / 1000;
    this._lastTime = now;

    this.player.update();
    this._spawnObjects();
    this.sunRays.forEach((r) => r.update());
    this.snowflakes.forEach((f) => f.update());
    this._checkCollisions();
    this._updateHUD();

    requestAnimationFrame(() => this._loop());
  }
}

const game = new Game();