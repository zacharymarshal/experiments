import * as React from "react";

export default function (props) {
  const [isFilled, setIsFilled] = React.useState(false);

  const img = React.createElement("img", {
    src: "/images/counter.png",
    width: "100%",
    style: {
      display: isFilled ? "block" : "none",
    },
  });

  return React.createElement("div", {
    style: { width: "100px", height: "100px" },
    onClick: () => setIsFilled(isFilled ? false : true),
  }, img);
}
