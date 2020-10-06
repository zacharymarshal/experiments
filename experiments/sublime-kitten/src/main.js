import * as React from "react";
import * as ReactDOM from "react-dom";

import Frame from "./frame.js";

class Fr {
  constructor() {
    this.reset();
  }
  reset() {
    this.slots = new Array(5).fill(0);
    this.amount = 0;
  }
  add() {
    if (this.amount === this.slots.length) {
      return;
    }

    this.amount += 1;
    this.slots = this.slots.map((s, idx) => {
      if (idx + 1 <= this.amount) {
        return 1;
      }
      return s;
    });
  }
  subtract() {
    if (this.amount === 0) {
      return;
    }

    this.amount -= 1;
    this.slots = this.slots.map((s, idx) => {
      if (idx + 1 > this.amount) {
        return 0;
      }
      return s;
    });
  }
}

class TenFrame {
  static ten() {
    return new TenFrame([new Fr(), new Fr(), new Fr(), new Fr()]);
  }
  constructor(frames) {
    this.frames = frames;
  }

  total() {
    return this.frames.reduce((acc, v) => {
      acc += v.amount;
      return acc;
    }, 0);
  }

  add(frameIdx) {
    this.frames[frameIdx].add();
  }

  subtract(frameIdx) {
    this.frames[frameIdx].subtract();
  }

  reset() {
    this.frames.forEach((f) => f.reset());
  }
}

const tenFrame = TenFrame.ten();

function App(props) {
  const [frames, setFrames] = React.useState(tenFrame.frames);

  const add = (idx) => {
    return () => {
      tenFrame.add(idx);
      setFrames([...tenFrame.frames]);
    };
  };
  const subtract = (idx) => {
    return (e) => {
      e.stopPropagation();
      tenFrame.subtract(idx);
      setFrames([...tenFrame.frames]);
    };
  };
  const getFrame = (idx) => frames[idx];
  const reset = () => {
    tenFrame.reset();
    setFrames([...tenFrame.frames]);
  };

  const getTotal = (...idxs) => {
    let total = 0;
    idxs.forEach((idx) => {
      total += frames[idx].amount;
    });
    return total;
  };

  return (
    <>
      <div className="tenframe-container">
        <div className="tenframe">
          <Frame frame={getFrame(0)} add={add(0)} subtract={subtract(0)} />
          <Frame frame={getFrame(1)} add={add(1)} subtract={subtract(1)} />
        </div>
        <div className="tenframe">
          <Frame frame={getFrame(2)} add={add(2)} subtract={subtract(2)} />
          <Frame frame={getFrame(3)} add={add(3)} subtract={subtract(3)} />
        </div>
      </div>
      <button onClick={reset}>Reset</button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
