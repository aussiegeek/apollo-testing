import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  test("shows the template message", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Template react app/ })
    ).toBeInTheDocument();
  });
});
