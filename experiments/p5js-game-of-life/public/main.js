const lookupIdx = (col, row, cols) => {
  return col + row * cols;
};

let grid;
let cols;
let rows;
let size = 5;

function setup() {
  createCanvas(800, 600);
  cols = width / size;
  rows = height / size;

  grid = Array.from(new Array(rows * cols)).map(() => floor(random(2)));
}

function draw() {
  frameRate(60);
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size;
      let y = j * size;
      if (grid[lookupIdx(i, j, cols)] === 1) {
        fill(255);
        stroke(0);
        rect(x, y, size-1, size-1);
      }
    }
  }

  grid = nextGen();
}

function nextGen() {
  return grid.map((val, idx) => {
    // Mutation
    if (random(1) < 0.0001) {
      return (val === 1 ? 0 : 1);
    }

    let liveNeighbors = countLiveNeighbors(idx);
    if (val === 0) {
      if (liveNeighbors === 3) {
        return 1;
      }
      return 0;
    }

    // < 2 n || > 3 n  ~~ 0
    if(liveNeighbors < 2 || liveNeighbors > 3) {
      return 0;
    }
    return 1;
  });
}

function getNeighbors(idx) {
  const size = grid.length;
  const n = [];
  // Left
  if (idx % cols !== 0) {
    n.push(grid[idx - 1]);
  }
  // Top-Left
  if ((idx - cols - 1) >= 0 && idx % cols !== 0) {
    n.push(grid[idx - cols - 1]);
  }
  // Top
  if (idx - cols >= 0) {
    n.push(grid[idx - cols]);
  }
  // Top-Right
  if ((idx - cols + 1) >= 0 && (idx + 1) % cols !== 0) {
    n.push(grid[idx - cols + 1]);
  }
  // Right
  if ((idx + 1) % cols !== 0) {
    n.push(grid[idx + 1]);
  }
  // Down-Right
  if ((idx + cols + 1) < size && (idx + 1) % cols != 0) {
    n.push(grid[idx + cols + 1]);
  }
  // Down
  if (idx + cols < size) {
    n.push(grid[idx + cols]);
  }
  // Down-Left
  if ((idx + cols - 1) < size && idx % cols !== 0) {
    n.push(grid[idx + cols - 1]);
  }

  return n;
}

function countLiveNeighbors(idx) {
  return getNeighbors(idx).reduce((n, s) => n + s, 0);
}
