class Player {
  constructor(containerWidth) {
    this.width = 50;
    this.height = 50;
    this.speed = 6;
    this.containerWidth = containerWidth;
    this.x = (containerWidth - this.width) / 2;
    this.el = document.getElementById('player');
    this.el.textContent = '🧊';
    this.movingLeft = false;
    this.movingRight = false;
    this.y = 600 - this.height - 20;

    this._bindKeys();
  }

  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.movingLeft = true;
      if (e.key === 'ArrowRight') this.movingRight = true;
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') this.movingLeft = false;
      if (e.key === 'ArrowRight') this.movingRight = false;
    });
  }

  reset() {
    this.x = (this.containerWidth - this.width) / 2;
    this.movingLeft = false;
    this.movingRight = false;
    this.el.style.left = this.x + 'px';
  }

  update() {
    if (this.movingLeft) this.x -= this.speed;
    if (this.movingRight) this.x += this.speed;

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.containerWidth) {
      this.x = this.containerWidth - this.width;
    }

    this.el.style.left = this.x + 'px';
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

class SunRay {
  constructor(containerWidth, gameScreen) {
    this.width = 30;
    this.height = 30;
    this.speed = 3;
    this.x = Math.random() * (containerWidth - this.width);
    this.y = -this.height;
    this.active = true;

    this.el = document.createElement('div');
    this.el.classList.add('sun-ray');
    this.el.textContent = '☀️';
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
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

class Snowflake {
  constructor(containerWidth, gameScreen) {
    this.width = 24;
    this.height = 24;
    this.speed = 2;
    this.x = Math.random() * (containerWidth - this.width);
    this.y = -this.height;
    this.active = true;

    this.el = document.createElement('div');
    this.el.classList.add('snowflake');
    this.el.textContent = '❄️';
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
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

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

class Game {
  constructor() {
    this.container = document.getElementById('game-container');
    this.gameScreen = document.getElementById('game-screen');
    this.startScreen = document.getElementById('start-screen');
    this.gameoverScreen = document.getElementById('gameover-screen');
    this.finalScoreEl = document.getElementById('final-score');
    this.scoreEl = document.getElementById('score-display');
    this.hpEl = document.getElementById('hp-display');
    this.startHighscoreEl = document.getElementById('start-highscore');
    this.gameoverHighscoreEl = document.getElementById('gameover-highscore');

    this.containerWidth = this.container.offsetWidth;
    this.containerHeight = this.container.offsetHeight;

    this.player = new Player(this.containerWidth);

    this.sunRays = [];
    this.snowflakes = [];
    this.score = 0;
    this.hp = 3;
    this.spawnTimer = 0;
    this.running = false;

    // Load high score from localStorage
    this.highScore = parseInt(localStorage.getItem('iceEscapeHighScore')) || 0;
    this.startHighscoreEl.textContent = this.highScore;

    document.getElementById('start-btn').addEventListener('click', () => this.start());
    document.getElementById('restart-btn').addEventListener('click', () => this.start());
  }

  _saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('iceEscapeHighScore', this.highScore);
    }
  }

  start() {
    this.score = 0;
    this.hp = 3;
    this.spawnTimer = 0;
    this.running = true;

    this.sunRays.forEach((r) => r.remove());
    this.snowflakes.forEach((f) => f.remove());
    this.sunRays = [];
    this.snowflakes = [];

    this.player.reset();

    // Show fresh high score on start screen for next time
    this.startHighscoreEl.textContent = this.highScore;

    this.startScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');

    this._updateHUD();
    this._loop();
  }

  _updateHUD() {
    this.scoreEl.textContent = `Score: ${this.score}`;
    this.hpEl.textContent = '❤️'.repeat(this.hp);
  }

  _spawnObjects() {
    this.spawnTimer++;

    if (this.spawnTimer % 90 === 0) {
      this.sunRays.push(new SunRay(this.containerWidth, this.gameScreen));
    }

    if (this.spawnTimer % 120 === 0) {
      this.snowflakes.push(new Snowflake(this.containerWidth, this.gameScreen));
    }
  }

  _checkCollisions() {
    const playerRect = this.player.getRect();

    this.sunRays = this.sunRays.filter((ray) => {
      if (!ray.active) return false;
      if (ray.y > this.containerHeight) {
        ray.remove();
        return false;
      }
      if (isColliding(playerRect, ray.getRect())) {
        ray.remove();
        this.hp--;
        if (this.hp <= 0) {
          this.hp = 0;
          this._gameOver();
        }
        return false;
      }
      return true;
    });

    this.snowflakes = this.snowflakes.filter((flake) => {
      if (!flake.active) return false;
      if (flake.y > this.containerHeight) {
        flake.remove();
        return false;
      }
      if (isColliding(playerRect, flake.getRect())) {
        flake.remove();
        this.score += 10;
        return false;
      }
      return true;
    });
  }

  _gameOver() {
    this.running = false;
    this._saveHighScore();
    this.finalScoreEl.textContent = this.score;
    this.gameoverHighscoreEl.textContent = this.highScore;
    this.startHighscoreEl.textContent = this.highScore;
    this.gameScreen.classList.add('hidden');
    this.gameoverScreen.classList.remove('hidden');
  }

  _loop() {
    if (!this.running) return;

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