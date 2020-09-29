import * as React from "react";

export default function (props) {
  const circle = React.createElement("div", {
    className: "circle" + (props.isFilled ? " circle--filled" : ""),
    dangerouslySetInnerHTML: { __html: "&nbsp;" },
  });
  return React.createElement("div", {
    className: "slot",
  }, circle);
}
