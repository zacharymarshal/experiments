import * as React from "react";
import PropTypes from "prop-types";
import Slot from "./Slot";

function TenFrame(props) {
  const counters = props.counters;

  const getCounter = (idx) => {
    if (!counters[idx]) {
      return {
        isFilled: false,
      };
    }

    const counter = counters[idx];
    return {
      isFilled: true,
      color: counter.color,
      isRemoved: counter.isRemoved,
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
      <div className="tenframe" onClick={props.addCounter}>
        <div className="frame">
          {oddSlots.map((slot, idx) => (
            <Slot
              isFilled={slot.isFilled}
              color={slot.color}
              isRemoved={slot.isRemoved}
              key={idx}
            />
          ))}
        </div>
        <div className="frame">
          {evenSlots.map((slot, idx) => (
            <Slot
              isFilled={slot.isFilled}
              color={slot.color}
              isRemoved={slot.isRemoved}
              key={idx}
            />
          ))}
        </div>
      </div>
    </>
  );
}

TenFrame.propTypes = {
  counters: PropTypes.array.isRequired,
  addCounter: PropTypes.func.isRequired,
};

export default TenFrame;
