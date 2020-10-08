import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Slot from "./slot";

export default function ({ counters, add }) {
  const getCounter = (idx) => {
    let isFilled = false;
    let color = "#fff";
    let isRemoved = false;
    if (counters[idx]) {
      const counter = counters[idx];
      isFilled = true;
      color = counter.color;
      isRemoved = counter.isRemoved;
    }
    return {
      isFilled,
      color,
      isRemoved,
    };
  };
  const oddSlots = Array.from({ length: 5 }).map((_, idx) => {
    const num = (idx + 1) * 2 - 1;
    return getCounter(num - 1);
  });
  const evenSlots = Array.from({ length: 5 }).map((_, idx) => {
    const num = (idx + 1) * 2;
    return getCounter(num - 1);
  });

  return (
    <>
      <div className="tenframe" onClick={add}>
        <TransitionGroup className="frame">
          {oddSlots.map((slot, idx) => (
            <CSSTransition
              key={"hi" + idx}
              timeout={{ enter: 5000, exit: 5000 }}
              classNames="slot"
            >
              <Slot
                isFilled={slot.isFilled}
                color={slot.color}
                isRemoved={slot.isRemoved}
                key={"hi" + idx}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        <div className="frame">
          {evenSlots.map((slot, idx) => (
            <Slot
              isFilled={slot.isFilled}
              color={slot.color}
              isRemoved={slot.isRemoved}
              key={"woot" + idx}
            />
          ))}
        </div>
      </div>
    </>
  );
}
