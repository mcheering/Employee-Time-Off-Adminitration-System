import React from "react";
import { render, screen } from "@testing-library/react";
import AppHeader from "../AppHeader";

describe("AppHeader Component", () => {
  test("renders app title", () => {
    render(<AppHeader />);
    expect(screen.getByText(/employee time-off administration system/i)).toBeInTheDocument();
  });

  test("renders the dashboard button", () => {
    render(<AppHeader />);
    const dashboardBtn = screen.getByRole("button", { name: /dashboard/i });
    expect(dashboardBtn).toBeInTheDocument();
  });

  test("has correct branding or layout wrapper", () => {
    render(<AppHeader />);
    expect(document.querySelector("#app-header")).toBeInTheDocument();
  });
});