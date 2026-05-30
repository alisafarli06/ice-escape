class Player {
  constructor(containerWidth) {
    this.width = 50;
    this.speed = 6;
    this.containerWidth = containerWidth;
    this.x = (containerWidth - this.width) / 2;
    this.el = document.getElementById('player');
    this.movingLeft = false;
    this.movingRight = false;

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

  update() {
    if (this.movingLeft) this.x -= this.speed;
    if (this.movingRight) this.x += this.speed;

    // Boundary check
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.containerWidth) {
      this.x = this.containerWidth - this.width;
    }

    this.el.style.left = this.x + 'px';
  }
}

class Game {
  constructor() {
    this.container = document.getElementById('game-container');
    this.containerWidth = this.container.offsetWidth;
    this.player = new Player(this.containerWidth);
    this.running = true;

    this._loop();
  }

  _loop() {
    if (!this.running) return;

    this.player.update();

    requestAnimationFrame(() => this._loop());
  }
}

const game = new Game();