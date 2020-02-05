import * as React from "react";
import styled from "styled-components";

export function AddButton({ onClick }) {
  const View = styled.i`
    cursor: pointer;
    border: 1px solid red;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
      "Helvetica Neue", sans-serif;
    padding: 1em 1.2em;
    position: absolute;
    bottom: 2em;
    right: 2em;
    border: 2px solid black;
    background-color: white;
    &:hover {
      background-color: black;
      color: white;
    }
  `;
  return <View onClick={onClick}>+</View>;
}
