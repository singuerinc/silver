import * as React from "react";
import styled from "styled-components";
import { useTheme } from "../useTheme";
import { Theme } from "../theme";

const View = styled.i.attrs(({ direction, theme }: { direction: string; theme: Theme }) => ({
  direction,
  theme
}))`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
  padding: 1em 1.2em;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  user-select: none;
  ${props => props.direction === "prev" && `left: 2em;`}
  ${props => props.direction === "next" && `right: 2em;`}
  color: ${props => props.theme.color("primary", 0)};
  border: 2px solid ${props => props.theme.color("primary", 0)};
  background-color: ${props => props.theme.color("secondary", 0)};
  opacity: 0.2;
  pointer-events: none;
  &[data-enabled="true"] {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    pointer-events: all;
    opacity: 1;
    cursor: pointer;
    &:hover {
      color: ${props => props.theme.color("secondary", 0)};
      border: 2px solid ${props => props.theme.color("secondary", 0)};
      background-color: ${props => props.theme.color("primary", 0)};
    }
  }
`;

export function PrevPageButton({ onClick, enabled }: { onClick: VoidFunction; enabled: boolean }) {
  return (
    <View theme={useTheme()} data-enabled={enabled} direction="prev" onClick={onClick}>
      &lt;
    </View>
  );
}

export function NextPageButton({ onClick, enabled }: { onClick: VoidFunction; enabled: boolean }) {
  return (
    <View theme={useTheme()} data-enabled={enabled} direction="next" onClick={onClick}>
      &gt;
    </View>
  );
}
