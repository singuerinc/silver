import { ThemeContext } from "styled-components";
import { useContext } from "react";
import { ColorType, ColorIndex } from "./theme";

export function useTheme() {
  const theme = useContext(ThemeContext);
  return {
    color: (type: ColorType, index: ColorIndex) => theme.colors[type][index]
  };
}
