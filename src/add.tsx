import * as React from "react";

export function Add({ onAdd }) {
  return <div onClick={() => onAdd()}>add!</div>;
}
