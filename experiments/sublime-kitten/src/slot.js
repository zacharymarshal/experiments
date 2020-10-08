import * as React from "react";
import { CSSTransition } from "react-transition-group";

export default function (props) {
  return (
    <div className="slot">
      <CSSTransition
        in={props.isFilled}
        timeout={{enter: 500, exit: 250}}
        classNames="circle"
      >
        <div
          className={props.isFilled ? "circle circle--filled" : "circle"}
          style={{ backgroundColor: props.color, opacity: props.isRemoved ? 0.25 : 1 }}
        >
          &nbsp;
        </div>
      </CSSTransition>
    </div>
  );
}
