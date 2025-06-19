/*
Author: Matthew Heering
Description: Component testing to verify the fiscal years table redners correctly
Date: 6/18/25
*/
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiscalYearsTable from "../FiscalYearsTable";

describe("FiscalYearsTable Component", () => {
  const mockFiscalYears = [
    {
      id: 1,
      start_date: "2023-01-01",
      end_date: "2023-12-31",
    },
    {
      id: 2,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
    },
  ];

  it("renders a list of fiscal years", () => {
    render(<FiscalYearsTable fiscalYears={mockFiscalYears} />);
    expect(screen.getByText("2022-23")).toBeInTheDocument();
    expect(screen.getByText("2024-25")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Fiscal Year" })
    ).toBeInTheDocument();
  });

  it("disables the Edit button for closed fiscal years", () => {
    render(<FiscalYearsTable fiscalYears={mockFiscalYears} />);
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    expect(editButtons[0]).toBeDisabled(); // Closed
    expect(editButtons[1]).not.toBeDisabled(); // Open
  });

  it("shows the Reopen button for closed fiscal years", () => {
    render(<FiscalYearsTable fiscalYears={mockFiscalYears} />);
    expect(screen.getByRole("button", { name: /Reopen/i })).toBeInTheDocument();
  });

  it("opens the form dialog when Add Fiscal Year is clicked", () => {
    render(<FiscalYearsTable fiscalYears={mockFiscalYears} />);
    const button = screen.getByRole("button", { name: "Add Fiscal Year" });
    fireEvent.click(button);
    expect(
      screen.getByRole("heading", { name: "Add Fiscal Year" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
