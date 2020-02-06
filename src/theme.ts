export const theme = {
  colors: {
    primary: ["black"],
    secondary: ["white"]
  }
};

export type Theme = typeof theme;
export type ThemeProps = { theme?: Theme };
export type ColorType = keyof Theme["colors"];
export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
