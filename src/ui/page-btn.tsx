import * as React from "react";
import styled from "styled-components";

const View = styled.i.attrs((props: { direction: string }) => ({
  direction: props.direction
}))`
  cursor: pointer;
  border: 1px solid red;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
  padding: 1em 1.2em;
  position: absolute;
  top: 2em;
  user-select: none;
  ${props => props.direction === "prev" && `left: 2em;`}
  ${props => props.direction === "next" && `right: 2em;`}
  border: 2px solid black;
  background-color: white;
  &:hover {
    background-color: black;
    color: white;
  }
`;

export function PrevPageButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <View direction="prev" onClick={onClick}>
      &lt;
    </View>
  );
}

export function NextPageButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <View direction="next" onClick={onClick}>
      &gt;
    </View>
  );
}
