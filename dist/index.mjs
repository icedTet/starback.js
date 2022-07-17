// src/utils.ts
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}
function randomArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function sinDeg(angleDeg) {
  return Math.sin(angleDeg * (Math.PI / 180));
}
function cosDeg(angleDeg) {
  return Math.cos(angleDeg * (Math.PI / 180));
}

// src/types/dot.ts
var Dot = class {
  constructor(canvas, config) {
    this.stars = [];
    this.config = {
      quantity: 100,
      direction: 100,
      speed: [0.5, 0.8],
      backgroundColor: "#ccc",
      starColor: "white",
      starSize: [0, 3]
    };
    this.overflowSize = 10;
    this.canvas = null;
    this.ctx = null;
    this.config = { ...this.config, ...config };
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  draw() {
    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      this.ctx.beginPath();
      this.ctx.fillStyle = star.color || this.config.starColor;
      this.ctx.save();
      this.ctx.globalAlpha = star.opacity;
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.closePath();
    }
  }
  update(speedMultiplier = 1) {
    let dx = sinDeg(this.config.direction);
    let dy = cosDeg(this.config.direction);
    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      star.x += dx * star.speed * speedMultiplier;
      star.y += dy * star.speed * speedMultiplier;
      if (star.x > this.canvas.width + this.overflowSize || star.x < 0 - this.overflowSize || star.y > this.canvas.height + this.overflowSize || star.y < 0 - this.overflowSize) {
        this.stars.splice(i, 1);
        let x, y, startX;
        if (dy == -1 || dy == 1) {
          startX = 0;
          x = randomNumber(startX, this.canvas.width);
          y = dy == 1 ? 0 : this.canvas.height;
        } else if (dx == -1 || dx == 1) {
          startX = dx == 1 ? 0 : this.canvas.width;
          x = startX + this.overflowSize * -dx;
          y = randomNumber(0, this.canvas.height);
        } else if (dx > 0 && dy > 0) {
          startX = -this.overflowSize;
          x = randomArr([startX, randomNumber(startX, this.canvas.width - this.overflowSize)]);
          y = x == startX ? randomNumber(startX, this.canvas.height - this.overflowSize) : -this.overflowSize;
        } else if (dx < 0 && dy > 0) {
          startX = -this.canvas.width + this.overflowSize;
          x = randomArr([startX, randomNumber(startX, 0 + this.overflowSize)]);
          y = x == startX ? randomNumber(startX, 0 - this.canvas.height + this.overflowSize) : -this.overflowSize;
        } else if (dx < 0 && dy < 0) {
          startX = this.canvas.width + this.overflowSize;
          x = randomArr([startX, randomNumber(startX, 0 + this.overflowSize)]);
          y = x == startX ? randomNumber(startX, 0 + this.overflowSize) : this.canvas.height + this.overflowSize;
        } else if (dx > 0 && dy < 0) {
          startX = -this.overflowSize;
          x = randomArr([startX, randomNumber(startX, this.canvas.width - this.overflowSize)]);
          y = x == startX ? randomNumber(startX, this.canvas.height - this.overflowSize) : this.canvas.height + this.overflowSize;
        }
        let newStarLocation = {
          x,
          y
        };
        this.generate(1, newStarLocation);
      }
    }
  }
  generate(amount, location = null) {
    if (location) {
      let { x, y } = location;
      let newStar = {
        x,
        y,
        size: this.randomSize(),
        opacity: this.randomOpacity(),
        speed: this.randomSpeed(),
        color: Array.isArray(this.config.starColor) ? randomArr(this.config.starColor) : this.config.starColor
      };
      return this.stars.push(newStar);
    }
    for (let i = 0; i < amount; i++) {
      let x = randomNumber(0, this.canvas.width);
      let y = randomNumber(0, this.canvas.height);
      this.stars.push({
        x,
        y,
        size: this.randomSize(),
        opacity: this.randomOpacity(),
        speed: this.randomSpeed(),
        color: Array.isArray(this.config.starColor) ? randomArr(this.config.starColor) : this.config.starColor
      });
    }
  }
  randomSize() {
    return typeof this.config.starSize == "object" ? randomNumber(this.config.starSize[0], this.config.starSize[1]) : this.config.starSize;
  }
  randomOpacity() {
    let opacity = this.config.randomOpacity;
    if (typeof opacity == "boolean")
      return !opacity ? 1 : (opacity ? Math.random() : 1).toFixed(2);
    else
      return (Math.random() * (opacity[1] - opacity[0]) + opacity[0]).toFixed(2);
  }
  randomSpeed() {
    const speed = this.config.speed;
    return typeof Array.isArray(speed) ? Math.random() * (speed[1] - speed[0]) + speed[0] : speed;
  }
};
var dot_default = Dot;

// src/types/line.ts
var Line = class {
  constructor(canvas, config) {
    this.stars = [];
    this.config = {
      type: "line",
      slope: { x: 1, y: 1 },
      frequency: 10,
      speed: 2,
      starSize: 100,
      starColor: ["#fb00ff", "#00dde0"],
      spread: 1,
      directionY: -1,
      directionX: 1,
      distanceX: 0.1,
      quantity: 200
    };
    this.direction = 225;
    this.canvas = null;
    this.ctx = null;
    this.config = { ...this.config, ...config };
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  draw() {
    this.ctx.strokeStyle = "white";
    this.stars.forEach((star) => {
      let starColor;
      if (Array.isArray(this.config.starColor)) {
        starColor = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        this.config.starColor.forEach((color, index) => starColor.addColorStop(index / this.config.starColor.length, color));
      } else
        starColor = this.config.starColor;
      this.ctx.save();
      this.ctx.strokeStyle = starColor;
      this.ctx.beginPath();
      this.ctx.moveTo(star.start.x, star.start.y);
      this.ctx.setLineDash([this.config.starSize, star.startPoint * this.config.frequency]);
      this.ctx.lineDashOffset = this.config.directionY * (star.progress + star.length);
      this.ctx.quadraticCurveTo(star.curve.x, star.curve.y, star.end.x, star.end.y);
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
    });
  }
  update(speedMultiplier = 1) {
    this.stars.map((star, index) => {
      star.progress += star.speed * speedMultiplier;
    });
  }
  generate() {
    for (let i = 0; i < this.config.quantity; i++) {
      const x = randomNumber(-20, this.canvas.width);
      const y = x <= 0 ? randomNumber(0, this.canvas.height) : 0;
      const height = 100;
      const endX = x + (this.canvas.width * this.config.distanceX + this.config.spread * x * this.config.directionX);
      const adjacentWidth = endX - x;
      const length = this.canvas.height;
      this.stars.push({
        x,
        y,
        length,
        height,
        progress: 0,
        speed: this.config.speed + Math.random() / 5,
        lineDash: randomNumber(50, 100),
        filter: {
          opacity: randomArr([randomNumber(20, 100) + "%", false])
        },
        start: {
          x,
          y
        },
        curve: {
          x: x + adjacentWidth * this.config.slope.x,
          y: y + this.canvas.height * this.config.slope.y
        },
        startPoint: randomNumber(10, 100),
        end: {
          x: endX,
          y: this.canvas.height
        }
      });
    }
    return this.stars;
  }
};
var line_default = Line;

// src/starback.ts
var StarbackDefaultConfig = {
  width: 800,
  height: 600,
  randomOpacity: true,
  showFps: false,
  type: "dot"
};
var _Starback = class {
  constructor(canvas, config = {}) {
    this.config = {};
    this.stars = null;
    this.canvas = null;
    this.starTypes = {
      dot: dot_default,
      line: line_default
    };
    this.fps = 0;
    this.repeat = 0;
    this.speedMultiplier = 1;
    this.lastCalledTime = 0;
    this.lastGenerated = 0;
    this.frontCallbacks = [];
    this.behindCallbacks = [];
    this.canvas = canvas instanceof HTMLCanvasElement ? canvas : document.querySelector(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.mergeConfig(config);
    this.frontCallbacks = [];
    this.behindCallbacks = [];
    this.init();
  }
  static create(canvas, config = {}) {
    return new _Starback(canvas, config);
  }
  mergeConfig(instanceConfig) {
    let config = { ...StarbackDefaultConfig, ...instanceConfig };
    this.config = config;
  }
  init() {
    this.canvas.setAttribute("width", this.config.width);
    this.canvas.setAttribute("height", this.config.height);
    this.stars = new this.starTypes[this.config.type](this.canvas, this.config);
    this.generateStar();
    requestAnimationFrame((t) => this.render(t));
  }
  setBackground() {
    let bg;
    if (typeof this.config.backgroundColor == "string")
      bg = this.config.backgroundColor;
    else if (typeof this.config.backgroundColor == "object") {
      bg = this.ctx.createLinearGradient(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);
      this.config.backgroundColor.forEach((bgString, index) => {
        bg.addColorStop(index / this.config.backgroundColor.length, bgString);
      });
    }
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  draw() {
    this.behindCallbacks.forEach((cb) => cb(this.ctx));
    this.stars.draw();
    this.frontCallbacks.forEach((cb) => cb(this.ctx));
    if (this.config.showFps)
      this.drawFps();
  }
  update() {
    this.stars.update(this.speedMultiplier);
  }
  addToFront(cb) {
    this.frontCallbacks.push(cb);
  }
  addToBehind(cb) {
    this.behindCallbacks.push(cb);
  }
  generateStar() {
    this.stars.generate(this.config.quantity);
  }
  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
  }
  drawFps() {
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`${this.fps} fps`, 10, 10);
  }
  render(timestamp) {
    if (!this.lastCalledTime)
      this.lastCalledTime = timestamp;
    let deltaTime = timestamp - this.lastCalledTime;
    this.fps = Math.round(1e3 / deltaTime);
    this.lastCalledTime = timestamp;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setBackground();
    this.draw();
    this.update();
    requestAnimationFrame((t) => this.render(t));
  }
};
var Starback = _Starback;
Starback.DefaultConfig = StarbackDefaultConfig;

// src/index.ts
var src_default = Starback;
export {
  src_default as default
};
