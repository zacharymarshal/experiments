import * as React from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

function Slot(props) {
  const styles = {};
  if (props.color) {
    styles.backgroundColor = props.color;
  }
  if (props.isRemoved) {
    styles.opacity = 0.25;
  }
  return (
    <div className="slot">
      <CSSTransition in={props.isFilled} timeout={500} classNames="circle">
        <div
          className={props.isFilled ? "circle circle--filled" : "circle"}
          style={styles}
        >
          &nbsp;
        </div>
      </CSSTransition>
    </div>
  );
}

Slot.propTypes = {
  isFilled: PropTypes.bool.isRequired,
  color: PropTypes.string,
  isRemoved: PropTypes.bool,
};

export default Slot;
