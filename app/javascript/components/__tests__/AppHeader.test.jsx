import React from "react";
import { render, screen } from "@testing-library/react";
import AppHeader from "../AppHeader";
import "@testing-library/jest-dom";

describe("AppHeader Component", () => {
  test("displays app title", () => {
    render(<AppHeader loggedIn={true} />);
    expect(screen.getByText("Employee Time-Off Admin System")).toBeInTheDocument();
  });

  test("shows disabled Login button when not logged in", () => {
    render(<AppHeader loggedIn={false} />);
    const loginButton = screen.getByRole("button", { name: /login \(not working\)/i });

    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });
});