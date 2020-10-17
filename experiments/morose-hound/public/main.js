import { World } from './world.js';

const size = 20;
const width = 800;
const height = 600;

const colors = new Map();
let world;

window.setup = function setup() {
  createCanvas(width, height);

  world = World.random(height/size, width/size);
};

window.draw = function draw() {
  frameRate(10);
  background(0);

  world.cells(cell => {
    if (cell.isAlive) {
      fill(255);
      stroke(0);
      rect(cell.x * size, cell.y * size, size-1, size-1);
    }
  });

  world.tick();
};
