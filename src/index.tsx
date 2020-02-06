import * as React from "react";
import { render } from "react-dom";
import { App } from "./app";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("app")
);
