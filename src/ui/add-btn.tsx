import * as React from "react";
import styled from "styled-components";
import { useTheme } from "../useTheme";
import { ColorType } from "../theme";

export function AddButton({ onClick, enabled }: { onClick: VoidFunction; enabled: boolean }) {
  const theme = useTheme();
  const View = styled.i`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
    padding: 1em 1.2em;
    position: absolute;
    user-select: none;
    bottom: 2em;
    right: 2em;
    color: ${theme.color("primary", 0)};
    border: 2px solid ${theme.color("primary", 0)};
    background-color: ${theme.color("secondary", 0)};
    opacity: 0.2;
    pointer-events: none;
    &[data-enabled="true"] {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
      pointer-events: all;
      opacity: 1;
      cursor: pointer;
      &:hover {
        color: ${theme.color("secondary", 0)};
        border: 2px solid ${theme.color("secondary", 0)};
        background-color: ${theme.color("primary", 0)};
      }
    }
  `;
  return (
    <View data-enabled={enabled} onClick={onClick}>
      +
    </View>
  );
}
