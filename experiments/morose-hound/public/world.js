class World {
  static random(rows, cols) {
    const grid = Array.from({length: rows}, () => {
      return Array.from({length: cols}, () => Math.round(Math.random()));
    });
    const world = new World(grid);

    return world;
  }

  constructor(grid) {
    this.grid = grid;
    this.colors = new Map();
  }

  cells(fn) {
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        let color = this.colors.get(`${r}.${c}`);
        if (!color) {
          color = [rc(), rc(), rc()];
          this.colors.set(`${r}.${c}`, color);
        }
        fn({
          x: c,
          y: r,
          color,
          isAlive: this.grid[r][c] === 1,
        });
      }
    }
  }

  tick() {
    const newGrid = [];
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        const cell = this.grid[r][c];
        const n = this.getNeighbors(this.grid, r, c);

        let newCell = this.mutation(0); // dead
        if (cell === 1 && (n === 2 || n === 3)) {
          newCell = 1;
        } else if (cell === 0 && n === 3) {
          newCell = 1;
        }
        if (!newGrid[r]) {
          newGrid[r] = [];
        }
        newGrid[r][c] = newCell;
      }
    }

    this.grid = newGrid;
  }

  getNeighbors(grid, r, c) {
    let n = 0;
    // top-left
    n += this.lookupCell(r - 1, c - 1);
    // top
    n += this.lookupCell(r - 1, c);
    // top-right
    n += this.lookupCell(r - 1, c + 1);
    // right
    n += this.lookupCell(r, c + 1);
    // bottom-left
    n += this.lookupCell(r + 1, c - 1);
    // bottom
    n += this.lookupCell(r + 1, c);
    // bottom-right
    n += this.lookupCell(r + 1, c + 1);
    // left
    n += this.lookupCell(r, c - 1);

    return n;
  }

  lookupCell(r, c) {
    if (r < 0) {
      r = this.grid.length - 1;
    } else if (r > this.grid.length - 1) {
      r = 0;
    }

    if (c < 0) {
      c = this.grid[r].length - 1;
    } else if (c > this.grid[r].length - 1) {
      c = 0;
    }

    if (!this.grid[r]) {
      return 0;
    }

    if (!this.grid[r][c]) {
      return 0;
    }

    return this.grid[r][c];
  }

  mutation(cell) {
    return cell;
    if (Math.random() < 0.00001) {
      return 1;
    }
    return cell;
  }

}

class Cell {
  static alive() {
    return new Cell(true);
  }

  constructor(isAlive) {
    this.isAlive = isAlive;
  }
}

function rc() {
  return Math.floor(Math.random() * 255) + 1;
}

export { World, Cell };
