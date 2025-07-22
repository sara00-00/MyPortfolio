// Select the menu icon and navigation links
const menuIcon = document.querySelector("#menu-icon");
const navLinks = document.querySelector(".nav-links");

// Toggle the active class on nav links when the menu icon is clicked
menuIcon.onclick = () => {
  navLinks.classList.toggle("active");
};

// Get modal elements and their corresponding buttons
const openModal1 = document.getElementById("open-modal-1");
const openModal2 = document.getElementById("open-modal-2");
const openModal3 = document.getElementById("open-modal-3");

const modal1 = document.getElementById("popup-modal-1");
const modal2 = document.getElementById("popup-modal-2");
const modal3 = document.getElementById("popup-modal-3");

const closeModal1 = document.getElementById("close-modal-1");
const closeModal2 = document.getElementById("close-modal-2");
const closeModal3 = document.getElementById("close-modal-3");

// Open modals on button click
openModal1.onclick = () => {
  modal1.style.display = "block"; // Show modal 1
};
openModal2.onclick = () => {
  modal2.style.display = "block"; // Show modal 2
};
openModal3.onclick = () => {
  modal3.style.display = "block"; // Show modal 3
};

// Close modals when close button is clicked
closeModal1.onclick = () => {
  modal1.style.display = "none"; // Hide modal 1
};
closeModal2.onclick = () => {
  modal2.style.display = "none"; // Hide modal 2
};
closeModal3.onclick = () => {
  modal3.style.display = "none"; // Hide modal 3
};

// Close modals when clicking outside of them
window.onclick = (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none"; // Hide modal 1
  }
  if (event.target === modal2) {
    modal2.style.display = "none"; // Hide modal 2
  }
  if (event.target === modal3) {
    modal3.style.display = "none"; // Hide modal 3
  }
};

// Immediately Invoked Function Expression (IIFE) for encapsulation
(function () {
  "use strict";

  var lava0; // Variable to hold the LavaLamp instance
  var ge1doot = {
    screen: {
      elem: null,
      callback: null,
      ctx: null,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      // Initialize the canvas and set up the context
      init: function (id, callback, initRes) {
        this.elem = document.getElementById(id);
        this.callback = callback || null;
        if (this.elem.tagName == "CANVAS")
          this.ctx = this.elem.getContext("2d");
        window.addEventListener(
          "resize",
          function () {
            this.resize(); // Resize canvas on window resize
          }.bind(this),
          false
        );
        this.elem.onselectstart = function () {
          return false; // Prevent text selection on the canvas
        };
        this.elem.ondrag = function () {
          return false; // Prevent dragging on the canvas
        };
        initRes && this.resize(); // Initialize the canvas size
        return this;
      },
      // Resize the canvas
      resize: function () {
        var o = this.elem;
        this.width = o.offsetWidth;
        this.height = o.offsetHeight;
        for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
          this.left += o.offsetLeft;
          this.top += o.offsetTop;
        }
        if (this.ctx) {
          this.elem.width = this.width;
          this.elem.height = this.height;
        }
        this.callback && this.callback(); // Call the callback if defined
      },
    },
  };

  // Point class to represent a point in 2D space
  var Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.magnitude = x * x + y * y;
    this.computed = 0;
    this.force = 0;
  };

  // Add a method to Point to add another point
  Point.prototype.add = function (p) {
    return new Point(this.x + p.x, this.y + p.y);
  };

  // Ball class to represent each ball in the LavaLamp
  var Ball = function (parent) {
    var min = 0.1;
    var max = 1.5;
    this.vel = new Point(
      (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.25),
      (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random())
    );
    this.pos = new Point(
      parent.width * 0.2 + Math.random() * parent.width * 0.6,
      parent.height * 0.2 + Math.random() * parent.height * 0.6
    );
    this.size =
      parent.wh / 15 + (Math.random() * (max - min) + min) * (parent.wh / 15);
    this.width = parent.width;
    this.height = parent.height;
  };

  // Move the ball within the canvas boundaries
  Ball.prototype.move = function () {
    if (this.pos.x >= this.width - this.size) {
      if (this.vel.x > 0) this.vel.x = -this.vel.x;
      this.pos.x = this.width - this.size;
    } else if (this.pos.x <= this.size) {
      if (this.vel.x < 0) this.vel.x = -this.vel.x;
      this.pos.x = this.size;
    }

    if (this.pos.y >= this.height - this.size) {
      if (this.vel.y > 0) this.vel.y = -this.vel.y;
      this.pos.y = this.height - this.size;
    } else if (this.pos.y <= this.size) {
      if (this.vel.y < 0) this.vel.y = -this.vel.y;
      this.pos.y = this.size;
    }

    this.pos = this.pos.add(this.vel); // Update the position
  };

  // LavaLamp class to create the lava lamp effect
  var LavaLamp = function (width, height, numBalls, c0, c1) {
    this.step = 5;
    this.width = width;
    this.height = height;
    this.wh = Math.min(width, height);
    this.sx = Math.floor(this.width / this.step);
    this.sy = Math.floor(this.height / this.step);
    this.paint = false;
    this.metaFill = createRadialGradient(width, height, width, c0, c1);
    this.plx = [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    this.ply = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1];
    this.mscases = [0, 3, 0, 3, 1, 3, 0, 3, 2, 2, 0, 2, 1, 1, 0];
    this.ix = [1, 0, -1, 0, 0, 1, 0, -1, -1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1];
    this.grid = [];
    this.balls = [];
    this.iter = 0;
    this.sign = 1;

    // Initialize the grid and balls
    for (var i = 0; i < (this.sx + 2) * (this.sy + 2); i++) {
      this.grid[i] = new Point(
        (i % (this.sx + 2)) * this.step,
        Math.floor(i / (this.sx + 2)) * this.step
      );
    }

    // Create the balls
    for (var k = 0; k < numBalls; k++) {
      this.balls[k] = new Ball(this);
    }
  };

  // Calculate the force acting on a given cell in the grid
  LavaLamp.prototype.computeForce = function (x, y, idx) {
    var force;
    var id = idx || x + y * (this.sx + 2);

    if (x === 0 || y === 0 || x === this.sx || y === this.sy) {
      force = 0.6 * this.sign; // Boundary condition
    } else {
      force = 0;
      var cell = this.grid[id];
      var i = 0;
      var ball;
      while ((ball = this.balls[i++])) {
        force +=
          (ball.size * ball.size) /
          (-2 * cell.x * ball.pos.x -
            2 * cell.y * ball.pos.y +
            ball.pos.magnitude +
            cell.magnitude);
      }
      force *= this.sign;
    }
    this.grid[id].force = force; // Set the computed force
    return force;
  };

  // Marching squares algorithm to determine the shape of the metaballs
  LavaLamp.prototype.marchingSquares = function (next) {
    var x = next[0];
    var y = next[1];
    var pdir = next[2];
    var id = x + y * (this.sx + 2);
    if (this.grid[id].computed === this.iter) {
      return false; // Skip already computed cells
    }
    var dir,
      mscase = 0;

    for (var i = 0; i < 4; i++) {
      var idn = x + this.ix[i + 12] + (y + this.ix[i + 16]) * (this.sx + 2);
      var force = this.grid[idn].force;
      if (
        (force > 0 && this.sign < 0) ||
        (force < 0 && this.sign > 0) ||
        !force
      ) {
        force = this.computeForce(
          x + this.ix[i + 12],
          y + this.ix[i + 16],
          idn
        );
      }
      if (Math.abs(force) > 1) mscase += Math.pow(2, i);
    }
    if (mscase === 15) {
      return [x, y - 1, false]; // Return if fully filled
    } else {
      if (mscase === 5) dir = pdir === 2 ? 3 : 1;
      else if (mscase === 10) dir = pdir === 3 ? 0 : 2;
      else {
        dir = this.mscases[mscase];
        this.grid[id].computed = this.iter; // Mark as computed
      }
      var ix =
        this.step /
        (Math.abs(
          Math.abs(
            this.grid[
              x +
                this.plx[4 * dir + 2] +
                (y + this.ply[4 * dir + 2]) * (this.sx + 2)
            ].force
          ) - 1
        ) /
          Math.abs(
            Math.abs(
              this.grid[
                x +
                  this.plx[4 * dir + 3] +
                  (y + this.ply[4 * dir + 3]) * (this.sx + 2)
              ].force
            ) - 1
          ) +
          1);
      ctx.lineTo(
        this.grid[
          x + this.plx[4 * dir] + (y + this.ply[4 * dir]) * (this.sx + 2)
        ].x +
          this.ix[dir] * ix,
        this.grid[
          x +
            this.plx[4 * dir + 1] +
            (y + this.ply[4 * dir + 1]) * (this.sx + 2)
        ].y +
          this.ix[dir + 4] * ix
      );
      this.paint = true; // Mark for painting
      return [x + this.ix[dir + 4], y + this.ix[dir + 8], dir];
    }
  };

  // Render the metaballs onto the canvas
  LavaLamp.prototype.renderMetaballs = function () {
    var i = 0,
      ball;
    while ((ball = this.balls[i++])) ball.move(); // Move all balls
    this.iter++;
    this.sign = -this.sign; // Alternate sign for forces
    this.paint = false;
    ctx.fillStyle = this.metaFill;
    ctx.beginPath();
    i = 0;
    while ((ball = this.balls[i++])) {
      var next = [
        Math.round(ball.pos.x / this.step),
        Math.round(ball.pos.y / this.step),
        false,
      ];
      do {
        next = this.marchingSquares(next); // Marching squares for each ball
      } while (next);
      if (this.paint) {
        ctx.fill(); // Fill the shape
        ctx.closePath();
        ctx.beginPath();
        this.paint = false;
      }
    }
  };

  // Create a radial gradient for the lava lamp effect
  var createRadialGradient = function (w, h, r, c0, c1) {
    var gradient = ctx.createRadialGradient(w / 1, h / 1, 0, w / 1, h / 1, r);
    gradient.addColorStop(0, c0);
    gradient.addColorStop(1, c1);
    return gradient;
  };

  // Animation loop to render the lava lamp continuously
  var run = function () {
    requestAnimationFrame(run);
    ctx.clearRect(0, 0, screen.width, screen.height);
    lava0.renderMetaballs();
  };

  // Initialize the screen and canvas context
  var screen = ge1doot.screen.init("bubble", null, true),
    ctx = screen.ctx;
  screen.resize();

  // Create LavaLamps with specified colors
  lava0 = new LavaLamp(screen.width, screen.height, 6, "#006699", "#000066");
  run(); // Start the animation loop
})();
