import * as React from "react";
import styled from "styled-components";

export function AddButton({ onClick, enabled }: { onClick: VoidFunction; enabled: boolean }) {
  const View = styled.i`
    border: 1px solid red;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
    padding: 1em 1.2em;
    position: absolute;
    user-select: none;
    bottom: 2em;
    right: 2em;
    border: 2px solid black;
    background-color: white;
    opacity: 0.2;
    pointer-events: none;
    &[data-enabled="true"] {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
      pointer-events: all;
      opacity: 1;
      cursor: pointer;
      &:hover {
        background-color: black;
        color: white;
      }
    }
  `;
  return (
    <View data-enabled={enabled} onClick={onClick}>
      +
    </View>
  );
}
