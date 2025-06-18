import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiscalYearsTable from "../FiscalYearsTable";

describe("FiscalYearsTable", () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();

  const fiscalYears = [
    {
      id: 1,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      is_closed: false,
    },
    {
      id: 2,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      is_closed: true,
    },
  ];

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnEdit.mockClear();
  });

  it("renders a list of fiscal years", () => {
    render(
      <FiscalYearsTable
        fiscalYears={fiscalYears}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Edit/i })).toHaveLength(2);
    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("calls onToggle when Close/Open button is clicked", () => {
    render(
      <FiscalYearsTable
        fiscalYears={fiscalYears}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
      />
    );

    const toggleButtons = screen.getAllByText(/Close|Open/i);
    fireEvent.click(toggleButtons[0]); // Close 2025
    fireEvent.click(toggleButtons[1]); // Open 2024

    expect(mockOnToggle).toHaveBeenCalledWith(1);
    expect(mockOnToggle).toHaveBeenCalledWith(2);
  });

  it("calls onEdit when Edit button is clicked", () => {
    render(
      <FiscalYearsTable
        fiscalYears={fiscalYears}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    fireEvent.click(editButtons[1]);

    expect(mockOnEdit).toHaveBeenCalledWith(fiscalYears[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(fiscalYears[1]);
  });

  it("disables Edit button if fiscal year is closed", () => {
    render(
      <FiscalYearsTable
        fiscalYears={fiscalYears}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    expect(editButtons[0]).not.toBeDisabled(); // Open
    expect(editButtons[1]).toBeDisabled(); // Closed
  });
});