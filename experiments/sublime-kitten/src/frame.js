import * as React from "react";

import Slot from "./slot.js";

export default function (props) {
  const { frame } = props;

  return (
    <>
      <div className="frame" onClick={props.add}>
        <div className="frame--actions">
          <button onClick={props.subtract} style={{ width: "100%" }}>
            -
          </button>
        </div>
        {frame.slots.map((s, idx) => (
          <Slot key={idx} isFilled={s === 1} />
        ))}
      </div>
    </>
  );
}
