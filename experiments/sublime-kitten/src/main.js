import * as React from "react";
import * as ReactDOM from "react-dom";

import FrameElement from "./frame.js";

class Frame {
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
    return new TenFrame([
      new Frame(),
      new Frame(),
      new Frame(),
      new Frame(),
    ]);
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
    this.frames.forEach(f => f.reset());
  }
}

const tenFrame = TenFrame.ten();

function App(props) {
  const [frames, setFrames] = React.useState(tenFrame.frames);
  const framesEl = React.createElement(
    "div",
    {
      className: "tenframe",
    },
    React.createElement(FrameElement, {
      frame: frames[0],
      add: () => {
        tenFrame.add(0);
        setFrames([...tenFrame.frames]);
      }
    }),
    React.createElement(FrameElement, {
      frame: frames[1],
      add: () => {
        tenFrame.add(1);
        setFrames([...tenFrame.frames]);
      }
    })
  );

  const frames2El = React.createElement(
    "div",
    {
      className: "tenframe",
    },
    React.createElement(FrameElement, {
      frame: frames[2],
      add: () => {
        tenFrame.add(2);
        setFrames([...tenFrame.frames]);
      }
    }),
    React.createElement(FrameElement, {
      frame: frames[3],
      add: () => {
        tenFrame.add(3);
        setFrames([...tenFrame.frames]);
      }
    })
  );

  const resetBtn = React.createElement("button", {
    onClick: () => {
      tenFrame.reset();
      setFrames([...tenFrame.frames]);
    }
  }, "Reset");

  const total = React.createElement("div", null, tenFrame.total());

  const framesContainer = React.createElement(
    "div",
    {className: "tenframe-container"},
    framesEl,
    frames2El,
  );

  return React.createElement(
    React.Fragment,
    null,
    framesContainer,
    resetBtn,
    total,
  );
}


ReactDOM.render(
  React.createElement(App),
  document.getElementById("root")
);
