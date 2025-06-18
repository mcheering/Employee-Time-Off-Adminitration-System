import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiscalYearForm from "../FiscalYearForm";

describe("FiscalYearForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form fields and submit button", () => {
    render(<FiscalYearForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Fiscal Year/i })).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when valid", () => {
    render(<FiscalYearForm onSubmit={mockOnSubmit} />);

    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    const submitButton = screen.getByRole("button", { name: /Add Fiscal Year/i });

    fireEvent.change(startDateInput, { target: { value: "2025-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2025-12-31" } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-12-31",
    });
  });

  it("does not submit if fields are empty", () => {
    render(<FiscalYearForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /Add Fiscal Year/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates start date must be before end date", () => {
    render(<FiscalYearForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2025-12-31" } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2025-01-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Fiscal Year/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Start date must be before end date/i)).toBeInTheDocument();
  });
});