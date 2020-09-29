import * as React from "react";

import Slot from "./slot.js";

export default function (props) {
  const { frame } = props;

  return (
    <div className="frame" onClick={props.add}>
      {frame.slots.map(s => <Slot isFilled={s === 1} />)}
    </div>
  );
}
