import React from "react";

// This is considered a function component, for a component that only contains a render method and doesn't need to be a class
export default function Square(props) {
  /* Solution 5: Append class name if this square is a winning square and should be highlighted */
  const className = `square ${props.isWinningSquare ? "winning-square" : ""}`;
  return (
    <button variant="contained" className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
