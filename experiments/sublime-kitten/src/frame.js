import * as React from "react";

import Slot from "./slot.js";

export default function (props) {
  const { frame } = props;

  const frameEl = React.createElement(
    "div",
    {
      className: "frame",
      onClick: props.add,
    },
    ...frame.slots.map(slot => {
      return React.createElement(Slot, {
        isFilled: slot === 1,
      });
    }),
  );

  return frameEl;
}
