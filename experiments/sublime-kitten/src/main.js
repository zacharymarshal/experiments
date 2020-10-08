import * as React from "react";
import * as ReactDOM from "react-dom";

import TenFrame from "./ten_frame";

function App(props) {
  const [counters, setCounters] = React.useState([[], []]);

  const howManyInput = React.createRef();

  const addRed = () => {
    const c = [...counters];
    if (c[0].length === 10) {
      return;
    }
    c[0].push({ color: "red", number: c[0].length + 1 });
    setCounters(c);
  };
  const addBlue = () => {
    const c = [...counters];
    if (c[1].length === 10) {
      return;
    }
    c[1].push({ color: "blue", number: c[1].length + 1 });
    setCounters(c);
  };
  const reset = () => {
    setCounters([[], []]);
  };

  const subtract = () => {
    const nc = [...counters];
    for (let i = nc.length - 1; i >= 0; i--) {
      const c = nc[i];
      for (let j = c.length - 1; j >= 0; j--) {
        const ct = c[j];
        if (ct.isRemoved !== true) {
          ct.isRemoved = true;
          setCounters(nc);
          return;
        }
      }
    }
  };

  const move = () => {
    const c = [...counters];
    if (c[0].length === 10) {
      return;
    }
    const m = c[1].pop();
    if (!m) {
      return;
    }
    c[0].push(m);
    setCounters(c);
  };

  const check = () => {
    console.log(howManyInput.current.value);
  };

  return (
    <>
      <div className="tenframe-container">
        <TenFrame counters={counters[0]} add={addRed} />
        <TenFrame counters={counters[1]} add={addBlue} />
      </div>
      <button onClick={move}>Move</button>
      &nbsp;
      <button onClick={subtract}>Subtract</button>
      &nbsp;
      <button onClick={reset}>Reset</button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
